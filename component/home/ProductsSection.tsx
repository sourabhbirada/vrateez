'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';

type ProductView = {
    id: string;
    name: string;
    slug: string;
    category: string;
    image: string;
    rating: number;
    reviews: number;
    price: number;
    originalPrice: number;
    discount: string;
    weight: string;
};

// Static — no API calls. Edit these arrays directly to change the catalog shown here.
const CATEGORY_FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'cookies', label: 'Cookies' },
    { key: 'infused-cookie', label: 'Infused Cookies' },
    { key: 'energy-on-the-go', label: 'Energy on the Go' },
    { key: 'savory-snacks', label: 'Savory Snacks' },
    { key: 'wholesome-delights', label: 'Wholesome Delights' },
];

const PRODUCTS: ProductView[] = [
    {
        id: 'almond-cookies',
        name: 'Almond Protein Cookies',
        slug: 'almond-cookies',
        category: 'cookies',
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Almond+cookies+in+plate.jpeg',
        rating: 4.7,
        reviews: 128,
        price: 229,
        originalPrice: 279,
        discount: '18% OFF',
        weight: '150g',
    },
    {
        id: 'cashew-cookies',
        name: 'Cashew Protein Cookies',
        slug: 'cashew-cookies',
        category: 'cookies',
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Cashew+cookies+in+plate+along+with+box.jpeg',
        rating: 4.6,
        reviews: 96,
        price: 229,
        originalPrice: 279,
        discount: '18% OFF',
        weight: '150g',
    },
    {
        id: 'blueberry-infused-cookies',
        name: 'Blueberry Infused Cookies',
        slug: 'blueberry-infused-cookies',
        category: 'infused-cookie',
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Blueberry+cookies.jpeg',
        rating: 4.8,
        reviews: 154,
        price: 249,
        originalPrice: 299,
        discount: '17% OFF',
        weight: '150g',
    },
    {
        id: 'desert-dates-drops',
        name: 'Desert Dates Drops',
        slug: 'desert-dates-drops',
        category: 'infused-cookie',
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Desert+dates+drops.jpeg',
        rating: 4.5,
        reviews: 61,
        price: 219,
        originalPrice: 259,
        discount: '15% OFF',
        weight: '150g',
    },
    {
        id: 'nut-seed-energy-bar',
        name: 'Nut & Seed Energy Bar',
        slug: 'nut-seed-energy-bar',
        category: 'energy-on-the-go',
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Energy+bar+closeup.jpeg',
        rating: 4.7,
        reviews: 203,
        price: 199,
        originalPrice: 249,
        discount: '20% OFF',
        weight: '4 x 35g',
    },
    {
        id: 'energy-booster-bar',
        name: 'Energy Booster Bar',
        slug: 'energy-booster-bar',
        category: 'energy-on-the-go',
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Energy+bar.jpeg',
        rating: 4.6,
        reviews: 88,
        price: 189,
        originalPrice: 229,
        discount: '17% OFF',
        weight: '4 x 35g',
    },
    {
        id: 'makhana-crunchy-bites',
        name: 'Makhana Crunchy Bites',
        slug: 'makhana-crunchy-bites',
        category: 'savory-snacks',
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/All+three+infused+cookies.jpeg',
        rating: 4.4,
        reviews: 47,
        price: 179,
        originalPrice: 219,
        discount: '18% OFF',
        weight: '100g',
    },
    {
        id: 'sama-upma',
        name: 'Instant Sama Upma',
        slug: 'sama-upma',
        category: 'wholesome-delights',
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Assorted+cookie+box.jpeg',
        rating: 4.5,
        reviews: 72,
        price: 179,
        originalPrice: 219,
        discount: '18% OFF',
        weight: '200g',
    },
];

export default function ProductsSection() {
    const [activeCategory, setActiveCategory] = useState('all');
    const { addToCart } = useCart();

    const filtered = activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory);

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
        <section className="py-16 bg-parchment" id="products">
            <div className="max-w-7xl mx-auto px-8">
                <h2 className="font-display italic text-4xl text-center text-ink mb-4">
                    Our Products
                </h2>
                <p className="text-center text-ink/50 mb-10 max-w-2xl mx-auto text-sm leading-relaxed">
                    High-protein cookies, energy bars &amp; superfood snacks — all crafted with real ingredients and zero added sugar.
                </p>

                {/* Category filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {CATEGORY_FILTERS.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                                activeCategory === cat.key
                                    ? 'bg-ink text-parchment shadow-lg'
                                    : 'bg-ink/5 text-ink/70 hover:bg-ink/10'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filtered.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white/60 border border-ink/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Image */}
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
                                    <h3 className="text-sm font-bold text-ink uppercase mb-2 line-clamp-2 hover:text-turmeric transition">
                                        {product.name}
                                    </h3>
                                </Link>

                                <p className="text-xs text-ink/40 mb-2">{product.weight}</p>

                                {/* Rating */}
                                <div className="flex items-center gap-1.5 mb-3">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={i < Math.floor(product.rating) ? 'fill-millet text-millet' : 'text-ink/15'}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs text-ink/40">
                                        ({product.reviews})
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl font-bold text-ink">
                                        ₹{product.price}
                                    </span>
                                    <span className="text-sm text-ink/30 line-through">
                                        ₹{product.originalPrice}
                                    </span>
                                </div>

                                {/* Add to Cart */}
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
            </div>
        </section>
    );
}