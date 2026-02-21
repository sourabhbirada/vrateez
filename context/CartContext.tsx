'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface CartItem {
    id: number;
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
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

    const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
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

    const removeFromCart = useCallback((id: number) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);

    const updateQuantity = useCallback((id: number, quantity: number) => {
        if (quantity <= 0) {
            setItems(prev => prev.filter(i => i.id !== id));
            return;
        }
        setItems(prev =>
            prev.map(i => (i.id === id ? { ...i, quantity } : i))
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
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
