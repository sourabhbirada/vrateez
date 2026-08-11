'use client';

import { ShoppingBag, Gift } from 'lucide-react';
import Link from 'next/link';

export default function RakshaBandhanPreview() {
    return (
        <section className="relative bg-gradient-to-br from-[#FFF5E6] to-[#FFE8CC] py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Video */}
                    <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-gray-900">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                poster="/rakhsbandhangift.png"
                                className="w-full h-full object-cover"
                            >
                                <source src="/rakhevideo.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>

                    {/* Short Details */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                            🕐 LIMITED TIME OFFER
                        </div>

                        <div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
                                Raksha Bandhan<br />Gift Hamper 🎁
                            </h2>
                            <p className="text-base md:text-lg text-gray-700 font-medium italic">
                                "Celebrate the bond of love with a healthy gift!"
                            </p>
                        </div>

                        <p className="text-gray-600 leading-relaxed">
                            To health and happiness, Vrateez brings you endless siblings love wrapped in delicious treats. Each hamper includes energy bars, cookies, millet bites, Rakhi & Roli Chawal.
                        </p>

                        {/* Quick Items List */}
                        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-orange-200">
                            <div className="flex items-center gap-2 mb-3">
                                <Gift className="w-5 h-5 text-orange-500" />
                                <h3 className="font-bold text-gray-900">Hamper Contains:</h3>
                            </div>
                            <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                                <li className="flex items-center gap-2">
                                    <span className="text-orange-500">✓</span> Energy Bar
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-orange-500">✓</span> Coconut Cookies
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-orange-500">✓</span> Dry Fruit Cookies
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-orange-500">✓</span> Millet Bites
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-orange-500">✓</span> Rakhi 📿
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-orange-500">✓</span> Roli & Chawal
                                </li>
                            </ul>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-lg border-2 border-green-200">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl md:text-4xl font-black text-orange-600">₹379</span>
                                <span className="text-xl text-gray-400 line-through">₹499</span>
                            </div>
                            <div className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                                SAVE ₹120
                            </div>
                        </div>

                        {/* CTA */}
                        <Link 
                            href="/raksha-bandhan"
                            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                        >
                            <ShoppingBag size={20} />
                            Order Now - Full Details
                        </Link>

                        <p className="text-xs text-gray-500 text-center">
                            🚚 Free shipping on orders above ₹499
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
