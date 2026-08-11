'use client';

import { ShoppingBag, Gift, Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function RakshaBandhanVideo() {
    return (
        <section className="relative bg-gradient-to-br from-[#FFF5E6] to-[#FFE8CC] py-8 md:py-12 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6 space-y-12">
                {/* Banner Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                        src="/rakhsbandhangift.png"
                        alt="Raksha Bandhan Gift Hamper - ₹379 only"
                        width={1920}
                        height={1080}
                        className="w-full h-auto object-cover"
                        priority
                    />
                    
                    {/* Order Now Button Overlay */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
                        <Link 
                            href="/shop?search=raksha"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-base md:text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                        >
                            <ShoppingBag size={20} />
                            Order Now
                        </Link>
                    </div>
                </div>

                {/* Video and Details Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Left: Video */}
                    <div className="order-2 lg:order-1">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-gray-900">
                            <video
                                controls
                                loop
                                playsInline
                                poster="/rakhsbandhangift.png"
                                className="w-full h-full object-cover"
                            >
                                <source src="/rakhevideo.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                        <p className="text-center text-sm text-gray-600 mt-3">
                            🎥 Watch how we celebrate the bond of love!
                        </p>
                    </div>

                    {/* Right: Details */}
                    <div className="order-1 lg:order-2 space-y-6">
                        {/* Title */}
                        <div>
                            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                                </span>
                                🕐 LIMITED TIME OFFER
                            </div>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
                                Raksha Bandhan Gift Hamper 🎁
                            </h2>
                            <p className="text-base md:text-lg text-gray-700 font-medium italic">
                                "Celebrate the bond of love with a healthy gift!"
                            </p>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                            To health and happiness, Vrateez brings you endless siblings love wrapped in delicious treats. Each hamper is carefully curated with our premium healthy snacks, a beautiful Rakhi, and traditional Roli Chawal.
                        </p>

                        {/* What's Inside Card */}
                        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Gift className="w-6 h-6 text-orange-500" />
                                <h3 className="text-lg font-bold text-gray-900">Hamper Contains:</h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-500 mt-0.5 flex-shrink-0">✓</span>
                                    <div>
                                        <span className="text-gray-900 font-semibold">1 Energy Bar</span>
                                        <p className="text-xs text-gray-500">Rich in protein, fiber & minerals</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-500 mt-0.5 flex-shrink-0">✓</span>
                                    <div>
                                        <span className="text-gray-900 font-semibold">2 Multigrain Coconut Cookies</span>
                                        <p className="text-xs text-gray-500">Crunchy & nutritious</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-500 mt-0.5 flex-shrink-0">✓</span>
                                    <div>
                                        <span className="text-gray-900 font-semibold">2 Multigrain Dry Fruit Cookies</span>
                                        <p className="text-xs text-gray-500">Packed with real dry fruits</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-500 mt-0.5 flex-shrink-0">✓</span>
                                    <div>
                                        <span className="text-gray-900 font-semibold">40gm Millet Crunchy Bites</span>
                                        <p className="text-xs text-gray-500">Guilt-free snacking delight</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-500 mt-0.5 flex-shrink-0">✓</span>
                                    <div>
                                        <span className="text-gray-900 font-semibold">Beautiful Rakhi</span>
                                        <p className="text-xs text-gray-500">Traditional & elegant design</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-500 mt-0.5 flex-shrink-0">✓</span>
                                    <div>
                                        <span className="text-gray-900 font-semibold">Roli & Chawal</span>
                                        <p className="text-xs text-gray-500">For the traditional ceremony</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Why Choose This Section */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                            <div className="flex items-center gap-2 mb-3">
                                <Heart className="w-5 h-5 text-orange-600" />
                                <h4 className="font-bold text-gray-900">Why This Gift is Special:</h4>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <Sparkles size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                    <span>Healthy & delicious - perfect for health-conscious siblings</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Sparkles size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                    <span>Zero added sugar, high in protein & fiber</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Sparkles size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                    <span>Beautiful packaging perfect for gifting</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Sparkles size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                    <span>Express your love with wellness</span>
                                </li>
                            </ul>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-center justify-between bg-white rounded-xl p-5 shadow-lg border-2 border-green-200">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl md:text-4xl font-black text-orange-600">₹379</span>
                                <span className="text-xl text-gray-400 line-through font-medium">₹499</span>
                            </div>
                            <div className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                                SAVE ₹120
                            </div>
                        </div>

                        {/* CTA Button */}
                        <Link 
                            href="/shop?search=raksha"
                            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-base md:text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                        >
                            <ShoppingBag size={20} />
                            Order Your Hamper Now
                        </Link>

                        <p className="text-xs text-gray-500 text-center">
                            🚚 Free shipping on orders above ₹499 | 📦 Delivery before Raksha Bandhan
                        </p>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-10 right-10 text-6xl opacity-10 animate-pulse pointer-events-none">🎁</div>
            <div className="absolute bottom-10 left-10 text-5xl opacity-10 animate-pulse pointer-events-none">🎊</div>
        </section>
    );
}
