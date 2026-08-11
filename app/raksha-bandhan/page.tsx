'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, Gift, Heart, Sparkles, Package, Truck, Shield } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function RakshaBandhanPage() {
    const [quantity, setQuantity] = useState(1);
    const { addToCart, toggleCart } = useCart();
    const router = useRouter();

    const handleAddToCart = () => {
        // This is a special hamper product
        const hamperProduct = {
            _id: 'raksha-bandhan-hamper-2024',
            name: 'Raksha Bandhan Gift Hamper',
            slug: 'raksha-bandhan-hamper',
            price: 379,
            originalPrice: 499,
            image: '/rakhsbandhangift.png',
            category: 'festive',
            weight: '500g',
            description: 'Special Raksha Bandhan hamper with energy bars, cookies, rakhi & more',
            stock: 100,
            isActive: true,
        };

        addToCart(hamperProduct, quantity);
        toggleCart();
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#FFF5E6] to-[#FFE8CC]">
            {/* Hero Banner */}
            <div className="relative h-[40vh] md:h-[50vh]">
                <Image
                    src="/rakhsbandhangift.png"
                    alt="Raksha Bandhan Gift Hamper"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-8 left-0 right-0 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-2">Raksha Bandhan Gift Hamper</h1>
                    <p className="text-lg md:text-xl italic">Celebrate the bond of love with wellness 🎁</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Video & Images */}
                    <div className="space-y-6">
                        {/* Video */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video bg-gray-900">
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

                        {/* Product Image */}
                        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-square">
                            <Image
                                src="/rakhsbandhangift.png"
                                alt="Raksha Bandhan Hamper"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4 text-center shadow-md">
                                <Package className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-gray-700">Premium<br />Packaging</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center shadow-md">
                                <Truck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-gray-700">Fast<br />Delivery</p>
                            </div>
                            <div className="bg-white rounded-lg p-4 text-center shadow-md">
                                <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <p className="text-xs font-semibold text-gray-700">100%<br />Authentic</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Details & Order */}
                    <div className="space-y-6">
                        {/* Limited Time Badge */}
                        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                            </span>
                            🕐 LIMITED TIME OFFER
                        </div>

                        {/* Title & Description */}
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
                                Raksha Bandhan Gift Hamper
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                To health and happiness, Vrateez brings you endless siblings love wrapped in delicious treats. Each hamper is carefully curated with our premium healthy snacks, a beautiful Rakhi, and traditional Roli Chawal — the perfect gift to celebrate the sacred bond of Raksha Bandhan.
                            </p>
                        </div>

                        {/* What's Inside - Detailed */}
                        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200">
                            <div className="flex items-center gap-2 mb-4">
                                <Gift className="w-6 h-6 text-orange-500" />
                                <h3 className="text-lg font-bold text-gray-900">Hamper Contains:</h3>
                            </div>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 border-b border-gray-100 pb-3">
                                    <span className="text-orange-500 mt-0.5 flex-shrink-0 text-lg">✓</span>
                                    <div>
                                        <span className="text-gray-900 font-semibold block">1 Energy Bar</span>
                                        <p className="text-xs text-gray-500">Rich in protein, fiber & minerals. Perfect energy booster for your sibling's active lifestyle.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 border-b border-gray-100 pb-3">
                                    <span className="text-orange-500 mt-0.5 flex-shrink-0 text-lg">✓</span>
                                    <div>
                                        <span className="text-gray-900 font-semibold block">2 Multigrain Coconut Cookies</span>
                                        <p className="text-xs text-gray-500">Crunchy, nutritious & delicious. Made with wholesome multigrain flour and real coconut.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 border-b border-gray-100 pb-3">
                                    <span className="text-orange-500 mt-0.5 flex-shrink-0 text-lg">✓</span>
                                    <div>
                                        <span className="text-gray-900 font-semibold block">2 Multigrain Dry Fruit Cookies</span>
                                        <p className="text-xs text-gray-500">Packed with real dry fruits, almonds & cashews. A healthy indulgence.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 border-b border-gray-100 pb-3">
                                    <span className="text-orange-500 mt-0.5 flex-shrink-0 text-lg">✓</span>
                                    <div>
                                        <span className="text-gray-900 font-semibold block">40gm Millet Crunchy Bites</span>
                                        <p className="text-xs text-gray-500">Guilt-free snacking delight made from nutritious millets. Zero added sugar.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3 border-b border-gray-100 pb-3">
                                    <span className="text-orange-500 mt-0.5 flex-shrink-0 text-lg">✓</span>
                                    <div>
                                        <span className="text-gray-900 font-semibold block">Beautiful Rakhi 📿</span>
                                        <p className="text-xs text-gray-500">Traditional & elegant design to grace your sibling's wrist.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-orange-500 mt-0.5 flex-shrink-0 text-lg">✓</span>
                                    <div>
                                        <span className="text-gray-900 font-semibold block">Roli & Chawal 🎨</span>
                                        <p className="text-xs text-gray-500">Complete the traditional Raksha Bandhan ceremony with sacred Roli and Chawal.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Why This Gift is Special */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                            <div className="flex items-center gap-2 mb-3">
                                <Heart className="w-5 h-5 text-orange-600" />
                                <h4 className="font-bold text-gray-900">Why This Gift is Special:</h4>
                            </div>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <Sparkles size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                    <span><strong>Healthy & Delicious:</strong> Perfect for health-conscious siblings who care about what they eat</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Sparkles size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                    <span><strong>Zero Added Sugar:</strong> High in protein & fiber, guilt-free snacking</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Sparkles size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                    <span><strong>Premium Packaging:</strong> Beautiful presentation perfect for gifting</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Sparkles size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                    <span><strong>Complete Set:</strong> Everything you need for the Raksha Bandhan celebration</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Sparkles size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                                    <span><strong>Express Love with Wellness:</strong> Show you care about their health and happiness</span>
                                </li>
                            </ul>
                        </div>

                        {/* Pricing & Order */}
                        <div className="bg-white rounded-xl p-6 shadow-xl border-2 border-orange-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-orange-600">₹379</span>
                                    <span className="text-2xl text-gray-400 line-through">₹499</span>
                                </div>
                                <div className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                                    SAVE ₹120
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity:</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-orange-500 text-gray-700 font-bold hover:bg-orange-50 transition"
                                    >
                                        −
                                    </button>
                                    <span className="text-xl font-bold text-gray-900 min-w-[3rem] text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-orange-500 text-gray-700 font-bold hover:bg-orange-50 transition"
                                    >
                                        +
                                    </button>
                                    <span className="text-sm text-gray-500 ml-2">
                                        Total: <span className="font-bold text-orange-600">₹{379 * quantity}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={handleAddToCart}
                                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                            >
                                <ShoppingBag size={20} />
                                Add to Cart & Order Now
                            </button>

                            <div className="mt-4 space-y-2 text-sm text-gray-600">
                                <p className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Free shipping on orders above ₹499
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Delivery before Raksha Bandhan
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Cash on Delivery available
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
