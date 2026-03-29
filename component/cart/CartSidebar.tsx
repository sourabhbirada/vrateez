'use client';

import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartSidebar() {
    const { items, isOpen, closeCart, updateQuantity, removeFromCart, totalItems, totalPrice, clearCart } = useCart();

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 transition-opacity"
                    onClick={closeCart}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={22} />
                        <h2 className="text-lg font-bold">Your Cart ({totalItems})</h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-1 hover:bg-gray-100 rounded-full transition"
                        aria-label="Close cart"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <ShoppingBag size={64} className="mb-4 opacity-30" />
                            <p className="text-lg font-medium">Your cart is empty</p>
                            <p className="text-sm mt-1">Add some delicious snacks!</p>
                            <button
                                onClick={closeCart}
                                className="mt-6 bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
                            >
                                BROWSE PRODUCTS
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 bg-gray-50 rounded-xl p-3"
                                >
                                    {/* Image */}
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-gray-900 truncate">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{item.weight}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            {/* Quantity */}
                                            <div className="flex items-center border rounded-full">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1.5 hover:bg-gray-200 rounded-full transition"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="px-3 text-sm font-semibold">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1.5 hover:bg-gray-200 rounded-full transition"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <span className="font-bold text-gray-900">
                                                ₹{item.price * item.quantity}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="self-start p-1 text-gray-400 hover:text-red-500 transition"
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-xl font-bold">₹{totalPrice}</span>
                        </div>
                        <p className="text-xs text-gray-400">
                            Shipping & taxes calculated at checkout
                        </p>
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="w-full bg-orange-500 text-white py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition block text-center"
                        >
                            CHECKOUT — ₹{totalPrice}
                        </Link>
                        <button
                            onClick={clearCart}
                            className="w-full text-center text-sm text-gray-500 hover:text-red-500 transition"
                        >
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
