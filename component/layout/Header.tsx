'use client';

import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { totalItems, toggleCart } = useCart();
    const { user, openLogin, logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showHindi, setShowHindi] = useState(false);
    const [mounted, setMounted] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Handle mounting
    useEffect(() => {
        setMounted(true);
    }, []);

    // Handle scroll effect
    useEffect(() => {
        if (!mounted) return;
        
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [mounted]);

    // Alternate between Hindi and English every 2 seconds
    useEffect(() => {
        if (!mounted || scrolled) return;
        
        const interval = setInterval(() => {
            setShowHindi(prev => !prev);
        }, 2000);
        return () => clearInterval(interval);
    }, [scrolled, mounted]);

    // Close user menu on outside click
    useEffect(() => {
        if (!mounted) return;
        
        const handler = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [mounted]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setSearchOpen(false);
            setMobileOpen(false);
        }
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <header className="bg-[#E8DCC8]/95 backdrop-blur-md sticky top-0 z-30 border-b border-black/5 py-2.5">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between gap-3">
                        <nav className="hidden md:flex items-center gap-0.5" />
                        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                            <div className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                                Vrateez
                            </div>
                        </Link>
                        <div className="flex items-center gap-0.5" />
                    </div>
                </div>
            </header>
        );
    }

    return (
        <header className={`bg-[#E8DCC8]/95 backdrop-blur-md sticky top-0 z-30 border-b border-black/5 transition-all duration-300 ${scrolled ? 'py-2' : 'py-2.5'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between gap-3">
                    {/* Left: Nav links */}
                    <nav className="hidden md:flex items-center gap-0.5">
                        <Link href="/shop" className="text-gray-800 font-medium text-xs px-2.5 py-1.5 rounded-md hover:bg-black/5 transition whitespace-nowrap">
                            Shop
                        </Link>
                        <Link href="/bulk-order" className="text-gray-800 font-medium text-xs px-2.5 py-1.5 rounded-md hover:bg-black/5 transition whitespace-nowrap">
                            Bulk Order
                        </Link>
                        <Link href="/faq" className="text-gray-800 font-medium text-xs px-2.5 py-1.5 rounded-md hover:bg-black/5 transition whitespace-nowrap">
                            FAQ
                        </Link>
                        <Link href="/about-us" className="text-gray-800 font-medium text-xs px-2.5 py-1.5 rounded-md hover:bg-black/5 transition whitespace-nowrap">
                            About
                        </Link>
                    </nav>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-1.5 hover:bg-black/5 rounded-md transition"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    {/* Center: Logo */}
                    <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                        <div className="relative h-8 flex items-center justify-center">
                            {/* Icon "V" - shows when scrolled */}
                            <div className={`flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-md font-black text-base shadow-md transition-all duration-300 ${scrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-0 absolute'}`}>
                                V
                            </div>
                            {/* Full bilingual text - shows when not scrolled */}
                            <div className={`transition-all duration-300 ${scrolled ? 'opacity-0 scale-0 w-0 h-0' : 'opacity-100 scale-100'}`}>
                                <div className="relative h-8 flex items-center justify-center min-w-[90px]">
                                    {/* English Text */}
                                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${!showHindi ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                        <div className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap">
                                            Vrateez
                                        </div>
                                    </div>
                                    {/* Hindi Text */}
                                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${showHindi ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                        <div className="text-xl md:text-2xl font-extrabold text-orange-600 tracking-tight whitespace-nowrap">
                                            व्रतीज़
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Right: Search + User + Cart */}
                    <div className="flex items-center gap-0.5">
                        {/* Search - Desktop */}
                        {!searchOpen ? (
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="hidden md:flex p-1.5 hover:bg-black/5 rounded-md transition"
                                aria-label="Search"
                            >
                                <Search size={17} />
                            </button>
                        ) : (
                            <form onSubmit={handleSearch} className="hidden md:flex items-center">
                                <div className="relative">
                                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onBlur={() => setTimeout(() => !searchQuery && setSearchOpen(false), 200)}
                                        placeholder="Search..."
                                        autoFocus
                                        className="w-52 pl-8 pr-3 py-1.5 text-xs bg-white border border-black/10 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/40 focus:border-orange-500 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </form>
                        )}
                        
                        {/* Search - Mobile */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="p-1.5 hover:bg-black/5 rounded-md transition md:hidden"
                            aria-label="Search"
                        >
                            <Search size={17} />
                        </button>

                        {/* User / Auth */}
                        <div className="relative" ref={userMenuRef}>
                            {user ? (
                                <>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center p-1.5 hover:bg-black/5 rounded-md transition"
                                    >
                                        <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                                            {user.name[0].toUpperCase()}
                                        </div>
                                    </button>
                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                                            <div className="px-3 py-2.5 border-b border-gray-100">
                                                <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                                                <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                href="/account/orders"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-800 hover:bg-gray-50 transition border-b border-gray-100"
                                            >
                                                <Package size={14} />
                                                My orders
                                            </Link>
                                            <button
                                                onClick={() => { logout(); setUserMenuOpen(false); }}
                                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-600 hover:bg-red-50 transition"
                                            >
                                                <LogOut size={14} />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={openLogin}
                                    className="p-1.5 hover:bg-black/5 rounded-md transition"
                                    aria-label="Login"
                                >
                                    <User size={17} />
                                </button>
                            )}
                        </div>

                        {/* Cart */}
                        <button
                            onClick={toggleCart}
                            className="relative p-1.5 hover:bg-black/5 rounded-md transition"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart size={17} />
                            {totalItems > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile nav */}
                {mobileOpen && (
                    <nav className="md:hidden pt-3 pb-2 flex flex-col gap-0.5 border-t border-black/5 mt-2.5">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="mb-1.5">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products..."
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-black/10 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/40 focus:border-orange-500 transition-all placeholder:text-gray-400"
                                />
                            </div>
                        </form>
                        
                        <Link href="/shop" onClick={() => setMobileOpen(false)} className="text-gray-800 font-medium text-sm py-2 px-2.5 rounded-md hover:bg-black/5 transition">
                            Shop
                        </Link>
                        <Link href="/bulk-order" onClick={() => setMobileOpen(false)} className="text-gray-800 font-medium text-sm py-2 px-2.5 rounded-md hover:bg-black/5 transition">
                            Bulk Order
                        </Link>
                        <Link href="/faq" onClick={() => setMobileOpen(false)} className="text-gray-800 font-medium text-sm py-2 px-2.5 rounded-md hover:bg-black/5 transition">
                            FAQ
                        </Link>
                        <Link href="/about-us" onClick={() => setMobileOpen(false)} className="text-gray-800 font-medium text-sm py-2 px-2.5 rounded-md hover:bg-black/5 transition">
                            About Us
                        </Link>
                        {user && (
                            <Link href="/account/orders" onClick={() => setMobileOpen(false)} className="text-gray-800 font-medium text-sm py-2 px-2.5 rounded-md hover:bg-black/5 transition">
                                My Orders
                            </Link>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
}
