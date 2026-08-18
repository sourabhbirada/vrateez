'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Star, ShoppingCart, ChevronLeft, Minus, Plus, Truck, Shield, RotateCcw, ExternalLink } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
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
    customization?: ApiProduct['customization'];
    freeDelivery?: boolean;
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
        customization: p.customization,
        freeDelivery: p.freeDelivery,
    };
}

import { notFound } from 'next/navigation';

export default function ProductPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [product, setProduct] = useState<ProductView | null>(null);
    const [allProducts, setAllProducts] = useState<ProductView[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { settings } = useSettings();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedPackUnits, setSelectedPackUnits] = useState(1);
    const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'ingredients'>('description');
    const [customSelections, setCustomSelections] = useState<Record<string, string>>({});
    const [customError, setCustomError] = useState('');

    useEffect(() => {
        async function loadProduct() {
            try {
                setLoading(true);
                const [apiProduct, apiList] = await Promise.all([
                    getProductBySlugApi(slug),
                    getProductsApi({ limit: 100 }),
                ]);

                setProduct(mapApiProductToView(apiProduct));
                setAllProducts(apiList.items.map(mapApiProductToView));
                const defaults: Record<string, string> = {};
                apiProduct.customization?.options?.forEach((opt) => {
                    if (opt.type === 'select' && opt.choices?.[0]) {
                        defaults[opt.key] = opt.choices[0].value;
                    } else {
                        defaults[opt.key] = '';
                    }
                });
                setCustomSelections(defaults);
            } catch (error) {
                console.error('Error loading product:', error);
                setProduct(null);
                setAllProducts([]);
            } finally {
                setLoading(false);
            }
        }

        void loadProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-parchment flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-turmeric border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-ink/60">Loading product...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return notFound();
    }

    const hasPackOptions = (product.packOptions?.length ?? 0) > 0;
    const customizationEnabled = Boolean(product.customization?.enabled && product.customization.options?.length);
    const orderQuantity = hasPackOptions ? selectedPackUnits : quantity;
    const customizationDelta = (product.customization?.options || []).reduce((sum, opt) => {
        if (opt.type !== 'select') return sum;
        const selected = customSelections[opt.key];
        const choice = opt.choices?.find((c) => c.value === selected);
        return sum + (choice?.priceDelta || 0);
    }, 0);
    const unitPrice = getEffectiveUnitPrice(product, orderQuantity) + customizationDelta;
    const lineTotal = getPackTotal(
        { ...product, price: product.price + customizationDelta },
        orderQuantity
    );

    const handleAddToCart = () => {
        if (customizationEnabled) {
            for (const opt of product.customization?.options || []) {
                if (opt.required && !String(customSelections[opt.key] || '').trim()) {
                    setCustomError(`Please choose: ${opt.label}`);
                    return;
                }
            }
        }
        setCustomError('');

        const customParts = (product.customization?.options || [])
            .map((opt) => {
                const raw = customSelections[opt.key];
                if (!raw) return null;
                if (opt.type === 'select') {
                    const choice = opt.choices?.find((c) => c.value === raw);
                    return `${opt.label}: ${choice?.label || raw}`;
                }
                return `${opt.label}: ${raw}`;
            })
            .filter(Boolean);

        const customSuffix = customParts.length ? ` (${customParts.join(', ')})` : '';

        addToCart({
            id: String(product.id),
            slug: product.slug,
            name: `${product.name}${customSuffix}`,
            image: product.image,
            price: unitPrice,
            originalPrice: product.originalPrice + customizationDelta,
            weight: product.weight,
            quantity: orderQuantity,
            freeDelivery: product.freeDelivery,
        });
    };

    // Related products (same category, different id)
    const related = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <main className="bg-parchment min-h-screen">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-8 pt-8">
                <Link href="/shop" className="inline-flex items-center gap-1 text-sm text-ink/50 hover:text-ink transition">
                    <ChevronLeft size={16} />
                    Back to Shop
                </Link>
            </div>

            {/* Product detail */}
            <section className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Images */}
                <div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-ink/5 mb-4">
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
                                        i === selectedImage ? 'border-turmeric' : 'border-transparent hover:border-ink/20'
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
                    <span className="inline-block bg-turmeric/12 text-clay text-xs font-bold px-3 py-1 rounded-full uppercase mb-3">
                        {getProductCategoryLabel(product.category)}
                    </span>

                    <h1 className="font-display italic text-3xl text-ink mb-2">{product.name}</h1>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={18}
                                    className={
                                        i < Math.floor(product.rating)
                                            ? 'fill-millet text-millet'
                                            : 'text-ink/15'
                                    }
                                />
                            ))}
                        </div>
                        <span className="text-sm text-ink/50">
                            {product.rating} ({product.reviews} reviews)
                        </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-3xl font-bold text-ink">₹{hasPackOptions ? lineTotal : unitPrice}</span>
                        {hasPackOptions ? (
                            <span className="text-sm text-ink/50">
                                ₹{unitPrice} / pc · {orderQuantity} pcs
                            </span>
                        ) : (
                            <>
                                <span className="text-lg text-ink/30 line-through">₹{product.originalPrice}</span>
                                <span className="text-sm bg-basil/12 text-basil font-bold px-2 py-0.5 rounded-full">
                                    {product.discount}
                                </span>
                            </>
                        )}
                    </div>
                    {!hasPackOptions ? (
                        <p className="text-sm text-ink/50 mb-6">{product.weight} · Inclusive of all taxes</p>
                    ) : (
                        <p className="text-sm text-ink/50 mb-6">{product.weight} · Pack pricing with bulk discount</p>
                    )}

                    {hasPackOptions && (
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-ink mb-3">Choose pack size</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedPackUnits(1)}
                                    className={`rounded-xl border p-4 text-left transition ${
                                        selectedPackUnits === 1
                                            ? 'border-turmeric bg-turmeric/8'
                                            : 'border-ink/15 hover:border-ink/30'
                                    }`}
                                >
                                    <p className="font-semibold text-ink">Single pack</p>
                                    <p className="text-sm text-ink/60 mt-1">1 pc · ₹{product.price + customizationDelta}</p>
                                </button>
                                {product.packOptions?.map((pack) => {
                                    const total = getPackTotal(
                                        { ...product, price: product.price + customizationDelta },
                                        pack.units
                                    );
                                    return (
                                        <button
                                            key={pack.units}
                                            type="button"
                                            onClick={() => setSelectedPackUnits(pack.units)}
                                            className={`rounded-xl border p-4 text-left transition ${
                                                selectedPackUnits === pack.units
                                                    ? 'border-turmeric bg-turmeric/8'
                                                    : 'border-ink/15 hover:border-ink/30'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="font-semibold text-ink">{getPackLabel(pack)}</p>
                                                {pack.discountPercent > 0 ? (
                                                    <span className="text-xs bg-basil/12 text-basil font-bold px-2 py-0.5 rounded-full">
                                                        {pack.discountPercent}% OFF
                                                    </span>
                                                ) : null}
                                            </div>
                                            <p className="text-sm text-ink/60 mt-1">
                                                {pack.units} pcs · ₹{total}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {customizationEnabled && (
                        <div className="mb-6 space-y-5">
                            <p className="text-sm font-semibold text-ink">
                                {product.customization?.title || 'Customize your product'}
                            </p>
                            {(product.customization?.options || []).map((opt) => (
                                <div key={opt.key}>
                                    <p className="text-sm text-ink/70 mb-2">
                                        {opt.label}
                                        {opt.required ? <span className="text-clay"> *</span> : null}
                                    </p>
                                    {opt.type === 'text' ? (
                                        <input
                                            type="text"
                                            value={customSelections[opt.key] || ''}
                                            onChange={(e) =>
                                                setCustomSelections((prev) => ({
                                                    ...prev,
                                                    [opt.key]: e.target.value,
                                                }))
                                            }
                                            placeholder={`Enter ${opt.label.toLowerCase()}`}
                                            className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-turmeric/30 focus:border-turmeric"
                                        />
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {(opt.choices || []).map((choice) => {
                                                const selected = customSelections[opt.key] === choice.value;
                                                return (
                                                    <button
                                                        key={choice.value}
                                                        type="button"
                                                        onClick={() =>
                                                            setCustomSelections((prev) => ({
                                                                ...prev,
                                                                [opt.key]: choice.value,
                                                            }))
                                                        }
                                                        className={`rounded-xl border p-3 text-left transition ${
                                                            selected
                                                                ? 'border-turmeric bg-turmeric/8'
                                                                : 'border-ink/15 hover:border-ink/30'
                                                        }`}
                                                    >
                                                        {choice.image ? (
                                                            <div className="relative w-full aspect-square mb-2 rounded-lg overflow-hidden bg-ink/5">
                                                                <Image
                                                                    src={choice.image}
                                                                    alt={choice.label}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                        ) : null}
                                                        <p className="font-semibold text-ink text-sm">{choice.label}</p>
                                                        {(choice.priceDelta || 0) !== 0 ? (
                                                            <p className="text-xs text-ink/50 mt-1">
                                                                {choice.priceDelta! > 0 ? '+' : ''}₹
                                                                {choice.priceDelta}
                                                            </p>
                                                        ) : null}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {customError ? (
                                <p className="text-sm text-clay">{customError}</p>
                            ) : null}
                        </div>
                    )}

                    {/* Benefits pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {product.benefits.map((b, i) => (
                            <span key={i} className="bg-ink/5 text-ink/70 text-xs font-medium px-3 py-1.5 rounded-full">
                                {b}
                            </span>
                        ))}
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div className="flex items-center gap-4 mb-4">
                        {!hasPackOptions ? (
                            <div className="flex items-center border border-ink/15 rounded-full">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="p-3 hover:bg-ink/5 rounded-full transition"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="px-4 font-semibold">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="p-3 hover:bg-ink/5 rounded-full transition"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        ) : null}

                        <button
                            onClick={handleAddToCart}
                            className="flex-1 flex items-center justify-center gap-2 bg-ink text-parchment py-4 rounded-full font-bold text-lg hover:bg-turmeric transition-colors cursor-pointer"
                        >
                            <ShoppingCart size={20} />
                            Add to cart
                        </button>
                    </div>

                    {product.amazonUrl ? (
                        <a
                            href={product.amazonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mb-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 py-4 font-bold text-ink transition hover:border-turmeric hover:text-turmeric"
                        >
                            <ExternalLink size={18} />
                            Buy on Amazon
                        </a>
                    ) : null}

                    {/* Trust badges */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="flex flex-col items-center text-center p-3 bg-ink/5 rounded-xl">
                            <Truck size={20} className="text-ink/60 mb-1" />
                            <span className="text-xs font-medium text-ink/60">
                                Free Shipping ₹{settings?.shipping?.freeShippingThreshold ?? 499}+
                            </span>
                        </div>
                        <div className="flex flex-col items-center text-center p-3 bg-ink/5 rounded-xl">
                            <Shield size={20} className="text-ink/60 mb-1" />
                            <span className="text-xs font-medium text-ink/60">Secure Checkout</span>
                        </div>
                        <div className="flex flex-col items-center text-center p-3 bg-ink/5 rounded-xl">
                            <RotateCcw size={20} className="text-ink/60 mb-1" />
                            <span className="text-xs font-medium text-ink/60">Easy Returns</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-ink/10 flex gap-6 mb-4">
                        {(['description', 'nutrition', 'ingredients'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 text-sm font-semibold capitalize transition border-b-2 ${
                                    activeTab === tab
                                        ? 'border-turmeric text-ink'
                                        : 'border-transparent text-ink/40 hover:text-ink/60'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="text-sm text-ink/60 leading-relaxed">
                        {activeTab === 'description' && <p>{product.description}</p>}
                        {activeTab === 'nutrition' && (
                            <div className="grid grid-cols-2 gap-3">
                                {product.nutritionHighlights.map((n, i) => (
                                    <div key={i} className="bg-ink/5 p-3 rounded-lg text-center font-semibold text-ink">
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
                    <h2 className="font-display italic text-2xl text-ink mb-8">You May Also Like</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {related.map(rp => (
                            <Link key={rp.id} href={`/product/${rp.slug}`} className="group">
                                <div className="relative aspect-square rounded-xl overflow-hidden bg-ink/5 mb-3">
                                    <Image
                                        src={rp.image}
                                        alt={rp.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-sm font-bold text-ink group-hover:text-turmeric transition line-clamp-1">
                                    {rp.name}
                                </h3>
                                <p className="text-sm font-semibold text-ink/70 mt-1">₹{rp.price}</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}