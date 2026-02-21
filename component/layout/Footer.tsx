import Link from 'next/link';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#2D1B14] text-white py-16 relative overflow-hidden">
            {/* Subtle top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

            <div className="max-w-7xl mx-auto px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-14">
                    {/* Left — Brand, contact & newsletter */}
                    <div className="md:col-span-5">
                        <div className="text-4xl font-extrabold tracking-tight mb-3">Vrateez</div>
                        <p className="text-white/60 mb-6 max-w-xs text-sm leading-relaxed">
                            Pure Protein, Natural Taste. High-protein cookies &amp; energy bars handcrafted in Jaipur with real ingredients.
                        </p>

                        {/* Contact info */}
                        <div className="space-y-2.5 mb-6">
                            <div className="flex items-center gap-2.5 text-sm text-white/70">
                                <MapPin size={15} className="text-orange-400 flex-shrink-0" />
                                <span>Jaipur, Rajasthan, India</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-white/70">
                                <Phone size={15} className="text-orange-400 flex-shrink-0" />
                                <a href="tel:+919079086630" className="hover:text-orange-400 transition">+91 90790 86630</a>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-white/70">
                                <Mail size={15} className="text-orange-400 flex-shrink-0" />
                                <a href="mailto:support@vrateez.com" className="hover:text-orange-400 transition">support@vrateez.com</a>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div className="flex gap-2 mb-6">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-2.5 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white/90"
                            />
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition">
                                Subscribe
                            </button>
                        </div>

                        {/* Social */}
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange-500 transition" aria-label="Instagram"><Instagram size={16} /></a>
                            <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange-500 transition" aria-label="Facebook"><Facebook size={16} /></a>
                            <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-orange-500 transition" aria-label="Twitter"><Twitter size={16} /></a>
                        </div>
                    </div>

                    {/* Right — Links */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div>
                            <h4 className="font-bold text-xs uppercase mb-4 text-white/40 tracking-wider">Shop</h4>
                            <Link href="/shop" className="block mb-2.5 hover:text-orange-400 transition text-sm text-white/70">All Products</Link>
                            <Link href="/shop?category=cookie" className="block mb-2.5 hover:text-orange-400 transition text-sm text-white/70">Protein Cookies</Link>
                            <Link href="/shop?category=energy-bar" className="block mb-2.5 hover:text-orange-400 transition text-sm text-white/70">Energy Bars</Link>
                            <Link href="/shop?category=desert-date" className="block mb-2.5 hover:text-orange-400 transition text-sm text-white/70">Date Drops</Link>
                        </div>
                        <div>
                            <h4 className="font-bold text-xs uppercase mb-4 text-white/40 tracking-wider">Company</h4>
                            <Link href="/bulk-order" className="block mb-2.5 hover:text-orange-400 transition text-sm text-white/70">Bulk Orders</Link>
                            <Link href="/faq" className="block mb-2.5 hover:text-orange-400 transition text-sm text-white/70">FAQ</Link>
                            <Link href="/contact" className="block mb-2.5 hover:text-orange-400 transition text-sm text-white/70">Contact</Link>
                        </div>
                        <div>
                            <h4 className="font-bold text-xs uppercase mb-4 text-white/40 tracking-wider">Legal</h4>
                            <Link href="/privacy" className="block mb-2.5 hover:text-orange-400 transition text-sm text-white/70">Privacy Policy</Link>
                            <Link href="/terms" className="block mb-2.5 hover:text-orange-400 transition text-sm text-white/70">Terms of Service</Link>
                            <Link href="/refund" className="block mb-2.5 hover:text-orange-400 transition text-sm text-white/70">Refund Policy</Link>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-8">
                    {/* Large Brand Text */}
                    <div className="text-center mb-6">
                        <h2 className="text-6xl md:text-8xl font-extrabold text-white/[0.04] tracking-[0.2em] select-none">
                            VRATEEZ
                        </h2>
                    </div>

                    {/* Copyright */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/30">
                        <p>&copy; {new Date().getFullYear()} Vrateez. All rights reserved.</p>
                        <p>Handcrafted in Jaipur, Rajasthan 🇮🇳</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
