'use client';

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductsApi } from '@/lib/api/productApi';
import { getCategoriesApi } from '@/lib/api/categoryApi';
import type { Product as ApiProduct, ProductCategory } from '@/lib/api/types';
import { normalizeProductCategory } from '@/lib/api/types';

// Note: This is a client component, so metadata needs to be set via generateMetadata in a server component wrapper
// For now, we'll handle SEO through document title manipulation

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
    const [categories, setCategories] = useState<Array<{ key: string; label: string }>>([{ key: 'all', label: 'All' }]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        async function loadProducts() {
            try {
                const [response, categoryItems] = await Promise.all([getProductsApi({ limit: 100 }), getCategoriesApi()]);
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
                setCategories([{ key: 'all', label: 'All' }, ...categoryItems.map((cat) => ({ key: cat.slug, label: cat.name }))]);
            } catch {
                setAllProducts([]);
                setCategories([{ key: 'all', label: 'All' }]);
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
        <main className="bg-parchment min-h-screen">
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
                                        ? 'bg-ink text-parchment'
                                        : 'bg-ink/5 text-ink/70 hover:bg-ink/10'
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
                        className="border border-ink/15 rounded-full px-4 py-2 text-sm bg-white/70 text-ink"
                    >
                        <option value="default">Sort: Default</option>
                        <option value="price-asc">Price: Low → High</option>
                        <option value="price-desc">Price: High → Low</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>

                {loading && (
                    <div className="text-center py-20 text-ink/50">Loading products...</div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filtered.map(product => (
                        <div
                            key={product.id}
                            className="group bg-white/60 border border-ink/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                        >
                            <Link href={`/product/${product.slug}`}>
                                <div className="relative aspect-square bg-ink/5 overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-3 left-3 bg-basil text-parchment text-xs font-bold px-3 py-1 rounded-full">
                                        {product.discount}
                                    </span>
                                </div>
                            </Link>

                            <div className="p-5">
                                <Link href={`/product/${product.slug}`}>
                                    <h3 className="text-sm font-bold text-ink uppercase mb-1 line-clamp-2 hover:text-turmeric transition">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="text-xs text-ink/40 mb-2">{product.weight}</p>

                                <div className="flex items-center gap-1.5 mb-3">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={13}
                                                className={
                                                    i < Math.floor(product.rating)
                                                        ? 'fill-millet text-millet'
                                                        : 'text-ink/15'
                                                }
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-ink/40">({product.reviews})</span>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl font-bold text-ink">₹{product.price}</span>
                                    <span className="text-sm text-ink/30 line-through">₹{product.originalPrice}</span>
                                </div>

                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full flex items-center justify-center gap-2 bg-ink text-parchment py-3 rounded-full font-semibold text-sm hover:bg-turmeric transition-colors cursor-pointer"
                                >
                                    <ShoppingCart size={16} />
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20 text-ink/40">
                        <p className="text-xl mb-2">No products found in this category.</p>
                        <button onClick={() => setActiveCategory('all')} className="text-turmeric font-semibold hover:underline">
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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-parchment text-ink/50">Loading...</div>}>
            <ShopContent />
        </Suspense>
    );
}