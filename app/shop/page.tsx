'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductsApi } from '@/lib/api/productApi';
import type { Product as ApiProduct, ProductCategory } from '@/lib/api/types';
import { getProductCategoryLabel, normalizeProductCategory } from '@/lib/api/types';

interface ShopProduct {
    id: string | number;
    name: string;
    slug: string;
    category: ProductCategory;
    image: string;
    images: string[];
    rating: number;
    reviews: number;
    price: number;
    originalPrice: number;
    discount: string;
    weight: string;
    description: string;
}

function ShopContent() {
    const searchParams = useSearchParams();
    const initialCategory = normalizeProductCategory(searchParams.get('category') || 'all');
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
    const [allProducts, setAllProducts] = useState<ShopProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    const categories = [
        { key: 'all', label: 'All' },
        ...Array.from(new Set(allProducts.map(p => p.category))).map(cat => ({
            key: cat,
            label: getProductCategoryLabel(cat),
        })),
    ];

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await getProductsApi({ limit: 100 });
                const mapped: ShopProduct[] = response.items.map((p: ApiProduct) => ({
                    id: p._id,
                    name: p.name,
                    slug: p.slug,
                    category: p.category,
                    image: p.image,
                    images: p.images,
                    rating: p.rating,
                    reviews: p.reviews,
                    price: p.price,
                    originalPrice: p.originalPrice,
                    discount: p.discount,
                    weight: p.weight,
                    description: p.description,
                }));
                setAllProducts(mapped);
            } catch {
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        }

        void loadProducts();
    }, []);

    let filtered =
        activeCategory === 'all'
            ? [...allProducts]
            : allProducts.filter(p => p.category === activeCategory);

    // Sort
    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    const handleAddToCart = (product: ShopProduct) => {
        addToCart({
            id: String(product.id),
            slug: product.slug,
            name: product.name,
            image: product.image,
            price: product.price,
            originalPrice: product.originalPrice,
            weight: product.weight,
        });
    };

    return (
        <main className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-8 py-10">
                {/* Filters row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all ${
                                    activeCategory === cat.key
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as typeof sortBy)}
                        className="border border-gray-300 rounded-full px-4 py-2 text-sm bg-white"
                    >
                        <option value="default">Sort: Default</option>
                        <option value="price-asc">Price: Low → High</option>
                        <option value="price-desc">Price: High → Low</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>

                {loading && (
                    <div className="text-center py-20 text-gray-500">Loading products...</div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filtered.map(product => (
                        <div
                            key={product.id}
                            className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                        >
                            <Link href={`/product/${product.slug}`}>
                                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        {product.discount}
                                    </span>
                                </div>
                            </Link>

                            <div className="p-5">
                                <Link href={`/product/${product.slug}`}>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase mb-1 line-clamp-2 hover:text-orange-600 transition">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="text-xs text-gray-500 mb-2">{product.weight}</p>

                                <div className="flex items-center gap-1.5 mb-3">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={13}
                                                className={
                                                    i < Math.floor(product.rating)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                }
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-500">({product.reviews})</span>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                                    <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                                </div>

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

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <p className="text-xl mb-2">No products found in this category.</p>
                        <button onClick={() => setActiveCategory('all')} className="text-orange-500 font-semibold hover:underline">
                            View all products
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ShopContent />
        </Suspense>
    );
}
