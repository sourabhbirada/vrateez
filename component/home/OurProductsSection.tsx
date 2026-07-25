'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { BadgeCheck, Wheat, Tag, FlaskConical, Sprout, Ban } from 'lucide-react';

// Static — no API calls. Edit this array directly to change categories.
const CATEGORIES = [
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Blueberry+cookies.jpeg',
        label: 'Cookies',
        desc: 'Almond · Coconut · Walnut · Cashew',
        href: '/shop?category=cookies',
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Energy+bar+closeup.jpeg',
        label: 'Energy on the Go',
        desc: 'Energy Bar · Energy Booster',
        href: '/shop?category=energy-on-the-go',
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Desert+dates+drops.jpeg',
        label: 'Infused Cookies',
        desc: 'Blueberry · Cranberry · Desert Dates',
        href: '/shop?category=infused-cookie',
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Almond+cookies+in+plate.jpeg',
        label: 'Savory Snacks',
        desc: 'Makhana · Crunchy Bites · Falahaari Chips',
        href: '/shop?category=savory-snacks',
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Cashew+cookies+in+plate+along+with+box.jpeg',
        label: 'Wholesome Delights',
        desc: 'Instant Sama Upma',
        href: '/shop?category=wholesome-delights',
    },
];

const FEATURES = [
    { icon: BadgeCheck, title: 'Vrat Friendly' },
    { icon: Wheat, title: 'Millet-Based' },
    { icon: Tag, title: 'Clean Label' },
    { icon: FlaskConical, title: 'Science Backed' },
    { icon: Sprout, title: 'Gut Friendly' },
    { icon: Ban, title: 'No Palm Oil' },
];

type CategoryCardItem = (typeof CATEGORIES)[number];

export default function OurProductsSection() {
    const topRow = useMemo(() => CATEGORIES.slice(0, 3), []);
    const bottomRow = useMemo(() => CATEGORIES.slice(3), []);

    return (
        <section className="py-20 bg-parchment">
            <div className="max-w-7xl mx-auto px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <p className="font-label text-[11px] tracking-[0.25em] text-clay uppercase mb-3">
                        What We Make
                    </p>
                    <h2 className="font-display italic text-3xl md:text-4xl text-ink mb-3 tracking-tight">
                        Explore by Category
                    </h2>
                    <p className="text-ink/50 max-w-md mx-auto text-sm leading-relaxed">
                        Every product crafted with traditional ingredients, validated by modern science — and always vrat-friendly.
                    </p>
                </div>

                {/* Category grid — 5 items: 3 top, 2 bottom centered */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                    {topRow.map((cat) => (
                        <CategoryCard key={cat.label} cat={cat} />
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-16">
                    {bottomRow.map((cat) => (
                        <CategoryCard key={cat.label} cat={cat} />
                    ))}
                </div>

                {/* Feature badges */}
                <div className="border-t border-ink/10 pt-14">
                    <p className="text-center font-label text-[11px] tracking-[0.25em] text-ink/35 uppercase mb-8">
                        Our Products Are
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                        {FEATURES.map(({ icon: Icon, title }) => (
                            <div key={title} className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 rounded-full border-2 border-ink/10 group-hover:border-turmeric bg-parchment flex items-center justify-center mb-3 transition-all duration-200 group-hover:scale-105">
                                    <Icon size={20} className="text-basil" />
                                </div>
                                <p className="text-[10px] md:text-xs font-bold text-ink/70 uppercase leading-tight tracking-wide">{title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function CategoryCard({ cat }: { cat: CategoryCardItem }) {
    return (
        <Link
            href={cat.href}
            className="group relative rounded-2xl overflow-hidden h-64 shadow-sm hover:shadow-xl transition-all duration-300"
        >
            <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/25 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
                <p className="font-display italic text-parchment text-lg leading-tight mb-1">{cat.label}</p>
                <p className="text-parchment/60 text-xs">{cat.desc}</p>
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-parchment/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-parchment text-xs">→</span>
            </div>
        </Link>
    );
}