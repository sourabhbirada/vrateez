"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { getCategoriesApi } from '@/lib/api/categoryApi';

const fallbackCategories = [
    { label: 'Cookies', href: '/shop?category=cookies' },
    { label: 'Infused Cookies', href: '/shop?category=infused-cookie' },
    { label: 'Energy on the Go', href: '/shop?category=energy-on-the-go' },
    { label: 'Savory Snacks', href: '/shop?category=savory-snacks' },
    { label: 'Wholesome Delights', href: '/shop?category=wholesome-delights' },
];

export default function Footer() {
    const [categories, setCategories] = useState(fallbackCategories);

    useEffect(() => {
        async function loadCategories() {
            try {
                const items = await getCategoriesApi();
                if (!items.length) return;
                setCategories(items.map((cat) => ({ label: cat.name, href: `/shop?category=${cat.slug}` })));
            } catch {
                setCategories(fallbackCategories);
            }
        }

        void loadCategories();
    }, []);

    return (
        <footer className="bg-[#2D1B14] text-white py-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-amber-600/60 to-transparent" />

            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">
                    {/* Brand + contact */}
                    <div className="md:col-span-5">
                        <div className="text-3xl font-extrabold tracking-tight mb-2">Vrateez</div>
                        <p className="text-[10px] font-semibold tracking-[0.25em] text-amber-500 uppercase mb-5">
                            Tradition Meets Innovation
                        </p>
                        <p className="text-white/55 mb-7 max-w-xs text-sm leading-relaxed">
                            Pure, clean-label, millet-based foods crafted with Vedic wisdom and modern nutritional science. Vrat-friendly. Always honest.
                        </p>

                        <div className="space-y-2.5 mb-7">
                            <div className="flex items-center gap-2.5 text-sm text-white/60">
                                <MapPin size={14} className="text-amber-500 shrink-0" />
                                <span>Jaipur, Rajasthan, India</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-white/60">
                                <Phone size={14} className="text-amber-500 shrink-0" />
                                <a href="tel:+919407230914" className="hover:text-amber-400 transition">+91 9407230914</a>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-white/60">
                                <Mail size={14} className="text-amber-500 shrink-0" />
                                <a href="mailto:vrateezfoodspvtltd@gmail.com" className="hover:text-amber-400 transition">vrateezfoodspvtltd@gmail.com</a>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <a href="https://www.instagram.com/vrateez/" className="w-9 h-9 bg-white/8 border border-white/10 rounded-full flex items-center justify-center hover:bg-amber-700 hover:border-amber-700 transition" aria-label="Instagram">
                                <Instagram size={15} />
                            </a>
                            <a href="#" className="w-9 h-9 bg-white/8 border border-white/10 rounded-full flex items-center justify-center hover:bg-amber-700 hover:border-amber-700 transition" aria-label="Facebook">
                                <Facebook size={15} />
                            </a>
                            <a href="#" className="w-9 h-9 bg-white/8 border border-white/10 rounded-full flex items-center justify-center hover:bg-amber-700 hover:border-amber-700 transition" aria-label="Twitter">
                                <Twitter size={15} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div>
                            <h4 className="font-bold text-[10px] uppercase mb-4 text-white/35 tracking-[0.2em]">Shop</h4>
                            <Link href="/shop" className="block mb-2.5 hover:text-amber-400 transition text-sm text-white/60">All Products</Link>
                            {categories.map((cat) => (
                                <Link key={cat.href} href={cat.href} className="block mb-2.5 hover:text-amber-400 transition text-sm text-white/60">
                                    {cat.label}
                                </Link>
                            ))}
                        </div>
                        <div>
                            <h4 className="font-bold text-[10px] uppercase mb-4 text-white/35 tracking-[0.2em]">Company</h4>
                            <Link href="/about-us" className="block mb-2.5 hover:text-amber-400 transition text-sm text-white/60">About Us</Link>
                            <Link href="/bulk-order" className="block mb-2.5 hover:text-amber-400 transition text-sm text-white/60">Bulk Orders</Link>
                            <Link href="/faq" className="block mb-2.5 hover:text-amber-400 transition text-sm text-white/60">FAQ</Link>
                            <Link href="/contact" className="block mb-2.5 hover:text-amber-400 transition text-sm text-white/60">Contact</Link>
                        </div>
                        {/* <div>
                            <h4 className="font-bold text-[10px] uppercase mb-4 text-white/35 tracking-[0.2em]">Legal</h4>
                            <Link href="/privacy" className="block mb-2.5 hover:text-amber-400 transition text-sm text-white/60">Privacy Policy</Link>
                            <Link href="/terms" className="block mb-2.5 hover:text-amber-400 transition text-sm text-white/60">Terms of Service</Link>
                            <Link href="/refund" className="block mb-2.5 hover:text-amber-400 transition text-sm text-white/60">Refund Policy</Link>
                        </div> */}
                    </div>
                </div>

                <div className="border-t border-white/8 pt-8">
                    <div className="text-center mb-6">
                        <h2 className="text-6xl md:text-8xl font-extrabold text-white/[0.035] tracking-[0.2em] select-none">
                            VRATEEZ
                        </h2>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/25">
                        <p>&copy; {new Date().getFullYear()} Vrateez Foods Pvt. Ltd. All rights reserved.</p>
                        <p>Handcrafted in Jaipur, Rajasthan 🇮🇳</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}