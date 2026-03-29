'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShoppingCart } from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';

// Mark the newest products (last 3 added) as "new launches"
const newLaunches = [products[9], products[7], products[6]]; // Desert Date Drops, Energy Bar, Assorted Box

export default function NewLaunchesSection() {
    const { addToCart } = useCart();

    return (
        <section className="py-20 bg-gradient-to-b from-white to-amber-50">
            <div className="max-w-7xl mx-auto px-8">
                {/* Section header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase mb-4">
                        <Sparkles size={14} />
                        Just Launched
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                        NEW ARRIVALS
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Check out the latest additions to our protein snack lineup — freshly crafted, lab-tested, and ready to fuel your day.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {newLaunches.map((product) => (
                        <div
                            key={product.id}
                            className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
                        >
                            {/* NEW badge */}
                            <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <Sparkles size={12} /> NEW
                            </div>

                            {/* Image */}
                            <Link href={`/product/${product.slug}`}>
                                <div className="relative h-72 overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                </div>
                            </Link>

                            {/* Content */}
                            <div className="p-6">
                                <Link href={`/product/${product.slug}`}>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-orange-600 transition">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="text-xs text-gray-500 mb-3">{product.weight}</p>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                                        <span className="text-sm text-gray-400 line-through ml-2">₹{product.originalPrice}</span>
                                    </div>
                                    <button
                                        onClick={() => addToCart({
                                            id: String(product.id),
                                            name: product.name,
                                            image: product.image,
                                            price: product.price,
                                            originalPrice: product.originalPrice,
                                            weight: product.weight,
                                        })}
                                        className="bg-gray-900 text-white p-3 rounded-full hover:bg-orange-600 transition-colors"
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
