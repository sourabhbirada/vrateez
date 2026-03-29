'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductsApi } from '@/lib/api/productApi';
import type { Product as ApiProduct } from '@/lib/api/types';

interface ProductView {
    id: string;
    name: string;
    slug: string;
    category: 'cookie' | 'energy-bar' | 'desert-date';
    image: string;
    rating: number;
    reviews: number;
    price: number;
    originalPrice: number;
    discount: string;
    weight: string;
}

export default function ProductsSection() {
    const [activeCategory, setActiveCategory] = useState('all');
    const [products, setProducts] = useState<ProductView[]>([]);
    const { addToCart } = useCart();

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await getProductsApi({ limit: 100 });
                setProducts(response.items.map((p: ApiProduct) => ({
                    id: p._id,
                    name: p.name,
                    slug: p.slug,
                    category: p.category,
                    image: p.image,
                    rating: p.rating,
                    reviews: p.reviews,
                    price: p.price,
                    originalPrice: p.originalPrice,
                    discount: p.discount,
                    weight: p.weight,
                })));
            } catch {
                setProducts([]);
            }
        }

        void loadProducts();
    }, []);

    const categories = [
        { key: 'all', label: 'All' },
        ...Array.from(new Set(products.map(p => p.category))).map(cat => ({
            key: cat,
            label: cat === 'energy-bar' ? 'Energy Bars' : cat === 'desert-date' ? 'Desert Dates' : 'Cookies',
        })),
    ];

    const filtered =
        activeCategory === 'all'
            ? products
            : products.filter(p => p.category === activeCategory);

    const handleAddToCart = (product: ProductView) => {
        addToCart({
            id: product.id,
            slug: product.slug,
            name: product.name,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice,
            weight: product.weight,
        });
    };

    return (
        <section className="py-16 bg-white" id="products">
            <div className="max-w-7xl mx-auto px-8">
                <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
                    OUR PRODUCTS
                </h2>
                <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
                    High-protein cookies, energy bars &amp; superfood snacks — all crafted with real ingredients and zero added sugar.
                </p>

                {/* Category filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                                activeCategory === cat.key
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filtered.map(product => (
                        <div
                            key={product.id}
                            className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Image */}
                            <Link href={`/product/${product.slug}`}>
                                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Discount badge */}
                                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        {product.discount}
                                    </span>
                                </div>
                            </Link>

                            <div className="p-5">
                                <Link href={`/product/${product.slug}`}>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-2 line-clamp-2 hover:text-orange-600 transition">
                                        {product.name}
                                    </h3>
                                </Link>

                                <p className="text-xs text-gray-500 mb-2">{product.weight}</p>

                                {/* Rating */}
                                <div className="flex items-center gap-1.5 mb-3">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={
                                                    i < Math.floor(product.rating)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                }
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        ({product.reviews})
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl font-bold text-gray-900">
                                        ₹{product.price}
                                    </span>
                                    <span className="text-sm text-gray-400 line-through">
                                        ₹{product.originalPrice}
                                    </span>
                                </div>

                                {/* Add to Cart */}
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-full font-semibold text-sm hover:bg-orange-600 transition-colors cursor-pointer"
                                >
                                    <ShoppingCart size={16} />
                                    ADD TO CART
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
