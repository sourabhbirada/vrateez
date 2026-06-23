'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, ShoppingCart, ChevronLeft, Minus, Plus, Truck, Shield, RotateCcw, ExternalLink } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductBySlugApi, getProductsApi } from '@/lib/api/productApi';
import type { Product as ApiProduct, ProductCategory } from '@/lib/api/types';
import { getProductCategoryLabel } from '@/lib/api/types';
import { getEffectiveUnitPrice, getPackLabel, getPackTotal, type PackOption } from '@/lib/packPricing';

interface ProductView {
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
    benefits: string[];
    ingredients: string;
    nutritionHighlights: string[];
    amazonUrl?: string;
    packOptions?: PackOption[];
}

function mapApiProductToView(p: ApiProduct): ProductView {
    return {
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
        benefits: p.benefits,
        ingredients: p.ingredients,
        nutritionHighlights: p.nutritionHighlights,
        amazonUrl: p.amazonUrl,
        packOptions: p.packOptions || [],
    };
}

export default function ProductPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [product, setProduct] = useState<ProductView | null>(null);
    const [allProducts, setAllProducts] = useState<ProductView[]>([]);
    const { addToCart } = useCart();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedPackUnits, setSelectedPackUnits] = useState(1);
    const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'ingredients'>('description');

    useEffect(() => {
        async function loadProduct() {
            try {
                const [apiProduct, apiList] = await Promise.all([
                    getProductBySlugApi(slug),
                    getProductsApi({ limit: 100 }),
                ]);

                setProduct(mapApiProductToView(apiProduct));

                setAllProducts(apiList.items.map(mapApiProductToView));
            } catch {
                setProduct(null);
                setAllProducts([]);
            }
        }

        void loadProduct();
    }, [slug]);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
                <Link href="/shop" className="text-orange-500 hover:underline">
                    ← Back to Shop
                </Link>
            </div>
        );
    }

    const hasPackOptions = (product.packOptions?.length ?? 0) > 0;
    const orderQuantity = hasPackOptions ? selectedPackUnits : quantity;
    const unitPrice = getEffectiveUnitPrice(product, orderQuantity);
    const lineTotal = getPackTotal(product, orderQuantity);

    const handleAddToCart = () => {
        addToCart({
            id: String(product.id),
            slug: product.slug,
            name: product.name,
            image: product.image,
            price: unitPrice,
            originalPrice: product.originalPrice,
            weight: product.weight,
            quantity: orderQuantity,
        });
    };

    // Related products (same category, different id)
    const related = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <main className="bg-white min-h-screen">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-8 pt-8">
                <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition">
                    <ChevronLeft size={16} />
                    Back to Shop
                </Link>
            </div>

            {/* Product detail */}
            <section className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Images */}
                <div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
                        <Image
                            src={product.images[selectedImage]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    {product.images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                                        i === selectedImage ? 'border-orange-500' : 'border-transparent hover:border-gray-300'
                                    }`}
                                >
                                    <Image src={img} alt="" fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase mb-3">
                        {getProductCategoryLabel(product.category)}
                    </span>

                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={18}
                                    className={
                                        i < Math.floor(product.rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                    }
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">
                            {product.rating} ({product.reviews} reviews)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-3xl font-bold text-gray-900">₹{hasPackOptions ? lineTotal : unitPrice}</span>
                        {hasPackOptions ? (
                            <span className="text-sm text-gray-500">
                                ₹{unitPrice} / pc · {orderQuantity} pcs
                            </span>
                        ) : (
                            <>
                                <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                                <span className="text-sm bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                                    {product.discount}
                                </span>
                            </>
                        )}
                    </div>
                    {!hasPackOptions ? (
                        <p className="text-sm text-gray-500 mb-6">{product.weight} · Inclusive of all taxes</p>
                    ) : (
                        <p className="text-sm text-gray-500 mb-6">{product.weight} · Pack pricing with bulk discount</p>
                    )}

                    {hasPackOptions && (
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-900 mb-3">Choose pack size</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedPackUnits(1)}
                                    className={`rounded-xl border p-4 text-left transition ${
                                        selectedPackUnits === 1
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <p className="font-semibold text-gray-900">Single pack</p>
                                    <p className="text-sm text-gray-600 mt-1">1 pc · ₹{product.price}</p>
                                </button>
                                {product.packOptions?.map((pack) => {
                                    const total = getPackTotal(product, pack.units);
                                    return (
                                        <button
                                            key={pack.units}
                                            type="button"
                                            onClick={() => setSelectedPackUnits(pack.units)}
                                            className={`rounded-xl border p-4 text-left transition ${
                                                selectedPackUnits === pack.units
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="font-semibold text-gray-900">{getPackLabel(pack)}</p>
                                                {pack.discountPercent > 0 ? (
                                                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">
                                                        {pack.discountPercent}% OFF
                                                    </span>
                                                ) : null}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {pack.units} pcs · ₹{total}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Benefits pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {product.benefits.map((b, i) => (
                            <span key={i} className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
                                {b}
                            </span>
                        ))}
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="flex items-center gap-4 mb-4">
                        {!hasPackOptions ? (
                            <div className="flex items-center border border-gray-300 rounded-full">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="p-3 hover:bg-gray-100 rounded-full transition"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="px-4 font-semibold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="p-3 hover:bg-gray-100 rounded-full transition"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        ) : null}

                        <button
                            onClick={handleAddToCart}
                            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-colors cursor-pointer"
                        >
                            <ShoppingCart size={20} />
                            ADD TO CART
                        </button>
                    </div>

                    {product.amazonUrl ? (
                        <a
                            href={product.amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mb-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 py-4 font-bold text-gray-900 transition hover:border-orange-500 hover:text-orange-600"
                        >
                            <ExternalLink size={18} />
                            Buy on Amazon
                        </a>
                    ) : null}

                    {/* Trust badges */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                            <Truck size={20} className="text-gray-700 mb-1" />
                            <span className="text-xs font-medium text-gray-700">Free Shipping ₹499+</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                            <Shield size={20} className="text-gray-700 mb-1" />
                            <span className="text-xs font-medium text-gray-700">Secure Checkout</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-xl">
                            <RotateCcw size={20} className="text-gray-700 mb-1" />
                            <span className="text-xs font-medium text-gray-700">Easy Returns</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b flex gap-6 mb-4">
                        {(['description', 'nutrition', 'ingredients'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-semibold capitalize transition border-b-2 ${
                                    activeTab === tab
                                        ? 'border-gray-900 text-gray-900'
                                        : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="text-sm text-gray-600 leading-relaxed">
                        {activeTab === 'description' && <p>{product.description}</p>}
                        {activeTab === 'nutrition' && (
                            <div className="grid grid-cols-2 gap-3">
                                {product.nutritionHighlights.map((n, i) => (
                                    <div key={i} className="bg-gray-50 p-3 rounded-lg text-center font-semibold">
                                        {n}
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'ingredients' && <p>{product.ingredients}</p>}
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {related.length > 0 && (
                <section className="max-w-7xl mx-auto px-8 pb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {related.map(rp => (
                            <Link key={rp.id} href={`/product/${rp.slug}`} className="group">
                                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                                    <Image
                                        src={rp.image}
                                        alt={rp.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition line-clamp-1">
                                    {rp.name}
                                </h3>
                                <p className="text-sm font-semibold text-gray-700 mt-1">₹{rp.price}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
