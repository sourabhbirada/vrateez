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
                    className="fixed inset-0 bg-ink/50 backdrop-blur-[1px] z-40 transition-opacity"
                    onClick={closeCart}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-parchment z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-ink/10">
                    <div className="flex items-center gap-2.5">
                        <ShoppingBag size={20} className="text-ink" />
                        <h2 className="font-display italic text-xl text-ink">Your Cart</h2>
                        {totalItems > 0 && (
                            <span className="font-label text-[10px] bg-turmeric text-parchment rounded-full px-2 py-0.5">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-1.5 hover:bg-ink/5 rounded-full transition"
                        aria-label="Close cart"
                    >
                        <X size={20} className="text-ink" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 rounded-full bg-ink/5 flex items-center justify-center mb-5">
                                <ShoppingBag size={26} className="text-ink/30" />
                            </div>
                            <p className="font-display italic text-lg text-ink">Your cart is empty</p>
                            <p className="text-sm text-ink/45 mt-1">Add some protein-forward snacks to get going.</p>
                            <button
                                onClick={closeCart}
                                className="mt-7 bg-ink text-parchment px-8 py-3 rounded-full font-semibold text-sm hover:bg-turmeric transition"
                            >
                                Browse products
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 bg-white/60 border border-ink/10 rounded-xl p-3"
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
                                        <h3 className="text-sm font-bold text-ink truncate">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-ink/40 mt-0.5">{item.weight}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            {/* Quantity */}
                                            <div className="flex items-center border border-ink/15 rounded-full">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1.5 hover:bg-ink/5 rounded-full transition"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={13} className="text-ink" />
                                                </button>
                                                <span className="px-3 text-sm font-semibold text-ink">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1.5 hover:bg-ink/5 rounded-full transition"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={13} className="text-ink" />
                                                </button>
                                            </div>

                                            <span className="font-bold text-ink">
                                                ₹{item.price * item.quantity}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="self-start p-1 text-ink/30 hover:text-clay transition"
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
                    <div className="border-t border-ink/10 p-6 space-y-4 bg-white/40">
                        <div className="flex justify-between items-center">
                            <span className="text-ink/60 text-sm">Subtotal</span>
                            <span className="font-display italic text-2xl text-ink">₹{totalPrice}</span>
                        </div>
                        <p className="text-xs text-ink/35">
                            Shipping &amp; taxes calculated at checkout
                        </p>
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="w-full bg-turmeric text-parchment py-4 rounded-full font-bold text-base hover:bg-clay transition block text-center"
                        >
                            Checkout — ₹{totalPrice}
                        </Link>
                        <button
                            onClick={clearCart}
                            className="w-full text-center text-sm text-ink/40 hover:text-clay transition"
                        >
                            Clear cart
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}