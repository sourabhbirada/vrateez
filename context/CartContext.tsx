'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { addCartItemApi, clearCartApi, getCartApi, removeCartItemApi, updateCartItemApi } from '@/lib/api/cartApi';
import { getToken } from '@/lib/api/storage';
import type { Cart } from '@/lib/api/types';

export interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice: number;
    quantity: number;
    weight: string;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = 'vrateez_guest_cart';

// Helper to check if string is a valid MongoDB ObjectId format
const isValidObjectId = (id: unknown): boolean => {
    if (typeof id !== 'string') return false;
    return /^[a-f\d]{24}$/i.test(id);
};

const isValidGuestItemId = (id: unknown): boolean => {
    return typeof id === 'string' && id.trim().length > 0;
};

const mapApiCart = (cart: Cart): CartItem[] => {
    return cart.items.map((it: Cart['items'][number]) => ({
        id: it.product._id,
        name: it.product.name,
        image: it.product.image,
        price: it.product.price,
        originalPrice: it.product.originalPrice,
        quantity: it.quantity,
        weight: it.product.weight,
    }));
};

// Filter and validate cart items from localStorage
const validateLocalCart = (rawItems: unknown): CartItem[] => {
    if (!Array.isArray(rawItems)) return [];

    return rawItems.filter((item): item is CartItem => {
        if (!item || typeof item !== 'object') return false;

        // Guest cart can contain static product IDs and API IDs.
        if (!isValidGuestItemId((item as CartItem).id)) {
            console.warn('Removing invalid cart item with ID:', (item as CartItem).id);
            return false;
        }

        // Must have required fields
        return (
            typeof (item as CartItem).name === 'string' &&
            typeof (item as CartItem).price === 'number' &&
            typeof (item as CartItem).quantity === 'number'
        );
    });
};

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const token = getToken();

        if (token) {
            void (async () => {
                try {
                    const cart = await getCartApi();
                    setItems(mapApiCart(cart));
                } catch {
                    setItems([]);
                }
            })();
            return;
        }

        if (typeof window !== 'undefined') {
            const raw = localStorage.getItem(GUEST_CART_KEY);
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    const validItems = validateLocalCart(parsed);
                    setItems(validItems);

                    // If some items were invalid, update localStorage
                    if (validItems.length !== (parsed as unknown[]).length) {
                        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(validItems));
                    }
                } catch {
                    // Clear invalid localStorage data
                    localStorage.removeItem(GUEST_CART_KEY);
                    setItems([]);
                }
            }
        }
    }, []);

    useEffect(() => {
        const token = getToken();
        if (token) return;
        if (typeof window !== 'undefined') {
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
        }
    }, [items]);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

    const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
        if (!isValidGuestItemId(item.id)) {
            console.error('Cannot add item with invalid ID:', item.id);
            return;
        }

        const token = getToken();

        if (token) {
            if (!isValidObjectId(item.id)) {
                console.error('Cannot sync non-ObjectId cart item to API:', item.id);
                return;
            }

            void (async () => {
                try {
                    const cart = await addCartItemApi({ productId: item.id, quantity: 1 });
                    setItems(mapApiCart(cart));
                } catch {
                    // Fallback to local cart behavior when API fails
                    setItems(prev => {
                        const existing = prev.find(i => i.id === item.id);
                        if (existing) {
                            return prev.map(i =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                            );
                        }
                        return [...prev, { ...item, quantity: 1 }];
                    });
                }
            })();
            setIsOpen(true);
            return;
        }

        setItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
        setIsOpen(true);
    }, []);

    const removeFromCart = useCallback((id: string) => {
        const token = getToken();

        if (token) {
            void (async () => {
                try {
                    const cart = await removeCartItemApi(id);
                    setItems(mapApiCart(cart));
                } catch {
                    setItems(prev => prev.filter(i => i.id !== id));
                }
            })();
            return;
        }

        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        const token = getToken();

        if (token) {
            void (async () => {
                try {
                    const cart = await updateCartItemApi(id, quantity);
                    setItems(mapApiCart(cart));
                } catch {
                    if (quantity <= 0) {
                        setItems(prev => prev.filter(i => i.id !== id));
                    } else {
                        setItems(prev =>
                            prev.map(i => (i.id === id ? { ...i, quantity } : i))
                        );
                    }
                }
            })();
            return;
        }

        if (quantity <= 0) {
            setItems(prev => prev.filter(i => i.id !== id));
            return;
        }
        setItems(prev =>
            prev.map(i => (i.id === id ? { ...i, quantity } : i))
        );
    }, []);

    const clearCart = useCallback(() => {
        const token = getToken();

        if (token) {
            void clearCartApi().catch(() => {
                // Keep local reset even if remote clear fails.
            });
        }

        setItems([]);

        // Also clear localStorage
        if (typeof window !== 'undefined') {
            localStorage.removeItem(GUEST_CART_KEY);
        }
    }, []);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                openCart,
                closeCart,
                toggleCart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
