'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, X, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import SearchModal from '@/component/search/SearchModal';

export default function Header() {
    const { totalItems, toggleCart } = useCart();
    const { user, openLogin, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Close user menu on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Keyboard shortcut Ctrl+K for search
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    return (
        <>
            {/* Announcement bar */}
            <div className="bg-gray-900 text-white text-center text-xs py-2 font-medium tracking-wide">
                <span className="hidden sm:inline">🚀 Free Shipping on orders above ₹499 | </span>
                <Link href="/shop" className="underline underline-offset-2 hover:text-orange-400 transition">Shop Now</Link>
                <span className="hidden sm:inline"> — Use code <strong>PROTEIN10</strong> for 10% off</span>
            </div>

            <header className="bg-[#E8DCC8]/95 backdrop-blur-md py-3 sticky top-0 z-30 border-b border-black/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8">
                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 hover:bg-black/5 rounded-lg transition"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>

                    {/* Nav links — desktop */}
                    <nav className="hidden md:flex items-center gap-1">
                        <Link href="/shop" className="text-gray-900 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-black/5 transition">
                            SHOP
                        </Link>
                        <Link href="/bulk-order" className="text-gray-900 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-black/5 transition">
                            BULK ORDER
                        </Link>
                        <Link href="/faq" className="text-gray-900 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-black/5 transition">
                            FAQ
                        </Link>
                        <Link href="/#new-launches" className="text-gray-900 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-black/5 transition inline-flex items-center gap-1">
                            <Sparkles size={14} className="text-orange-500" />
                            NEW
                        </Link>
                    </nav>

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <div className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Vrateez</div>
                    </Link>

                    {/* Right icons */}
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2.5 hover:bg-black/5 rounded-lg transition hidden md:flex items-center gap-2"
                            aria-label="Search"
                        >
                            <Search size={18} />
                            <span className="text-xs text-gray-400 border border-gray-300 rounded px-1.5 py-0.5">⌘K</span>
                        </button>
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2.5 hover:bg-black/5 rounded-lg transition md:hidden"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>

                        {/* User / Auth */}
                        <div className="relative" ref={userMenuRef}>
                            {user ? (
                                <>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-1.5 p-2 hover:bg-black/5 rounded-lg transition"
                                    >
                                        <div className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {user.name[0].toUpperCase()}
                                        </div>
                                        <ChevronDown size={14} className="hidden md:block text-gray-500" />
                                    </button>
                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => { logout(); setUserMenuOpen(false); }}
                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={openLogin}
                                    className="p-2.5 hover:bg-black/5 rounded-lg transition"
                                    aria-label="Login"
                                >
                                    <User size={20} />
                                </button>
                            )}
                        </div>

                        {/* Cart */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2.5 hover:bg-black/5 rounded-lg transition"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile nav */}
                {mobileOpen && (
                    <nav className="md:hidden px-6 pb-4 pt-3 flex flex-col gap-1 border-t border-black/5 mt-2">
                        <Link href="/shop" onClick={() => setMobileOpen(false)} className="text-gray-900 font-semibold py-3 px-3 rounded-lg hover:bg-black/5 transition">
                            SHOP
                        </Link>
                        <Link href="/bulk-order" onClick={() => setMobileOpen(false)} className="text-gray-900 font-semibold py-3 px-3 rounded-lg hover:bg-black/5 transition">
                            BULK ORDER
                        </Link>
                        <Link href="/faq" onClick={() => setMobileOpen(false)} className="text-gray-900 font-semibold py-3 px-3 rounded-lg hover:bg-black/5 transition">
                            FAQ
                        </Link>
                        <Link href="/#new-launches" onClick={() => setMobileOpen(false)} className="text-gray-900 font-semibold py-3 px-3 rounded-lg hover:bg-black/5 transition inline-flex items-center gap-2">
                            <Sparkles size={14} className="text-orange-500" />
                            NEW LAUNCHES
                        </Link>
                    </nav>
                )}
            </header>

            {/* Search Modal */}
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        </>
    );
}
