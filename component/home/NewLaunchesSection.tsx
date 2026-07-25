'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// Static — no API call. Edit this array directly when new products launch.
const NEW_LAUNCHES = [
    {
        id: 'blueberry-infused-cookies',
        name: 'Blueberry Infused Cookies',
        slug: 'blueberry-infused-cookies',
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Blueberry+cookies.jpeg',
        price: 249,
        originalPrice: 299,
        weight: '150g',
        description: 'Millet cookies infused with real blueberry, high in antioxidants and protein.',
    },
    {
        id: 'nut-seed-energy-bar',
        name: 'Nut & Seed Energy Bar',
        slug: 'nut-seed-energy-bar',
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Energy+bar+closeup.jpeg',
        price: 199,
        originalPrice: 249,
        weight: '4 x 35g',
        description: 'A dense, protein-forward bar built for stamina during fasting or training.',
    },
    {
        id: 'sama-upma',
        name: 'Instant Sama Upma',
        slug: 'sama-upma',
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Cashew+cookies+in+plate+along+with+box.jpeg',
        price: 179,
        originalPrice: 219,
        weight: '200g',
        description: 'Ready-to-eat barnyard millet upma, light on the gut and quick to prepare.',
    },
];

export default function NewLaunchesSection() {
    const { addToCart } = useCart();

    return (
        <section className="py-20 bg-parchment">
            <div className="max-w-7xl mx-auto px-8">
                {/* Section header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-turmeric/15 text-clay px-4 py-1.5 rounded-full font-label text-xs uppercase mb-4">
                        <Sparkles size={14} />
                        Just Launched
                    </div>
                    <h2 className="font-display italic text-3xl md:text-4xl text-ink mb-3">
                        New Arrivals
                    </h2>
                    <p className="text-ink/50 max-w-xl mx-auto text-sm leading-relaxed">
                        Check out the latest additions to our protein snack lineup — freshly crafted, lab-tested, and ready to fuel your day.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {NEW_LAUNCHES.map((product) => (
                        <div
                            key={product.id}
                            className="group relative bg-white/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-ink/10"
                        >
                            {/* NEW badge */}
                            <div className="absolute top-4 left-4 z-10 bg-turmeric text-parchment px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
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
                                    <div className="absolute inset-0 bg-linear-to-t from-ink/40 to-transparent" />
                                </div>
                            </Link>

                            {/* Content */}
                            <div className="p-6">
                                <Link href={`/product/${product.slug}`}>
                                    <h3 className="font-display italic text-lg text-ink mb-1 hover:text-turmeric transition">
                                        {product.name}
                                    </h3>
                                </Link>
                                <p className="text-xs text-ink/40 mb-3">{product.weight}</p>
                                <p className="text-sm text-ink/60 mb-4 line-clamp-2 leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-2xl font-bold text-ink">₹{product.price}</span>
                                        <span className="text-sm text-ink/30 line-through ml-2">₹{product.originalPrice}</span>
                                    </div>
                                    <button
                                        onClick={() => addToCart({
                                            id: product.id,
                                            slug: product.slug,
                                            name: product.name,
                                            image: product.image,
                                            price: product.price,
                                            originalPrice: product.originalPrice,
                                            weight: product.weight,
                                        })}
                                        className="bg-ink text-parchment p-3 rounded-full hover:bg-turmeric transition-colors"
                                        aria-label={`Add ${product.name} to cart`}
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