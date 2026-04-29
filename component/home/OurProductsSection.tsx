'use client';

import Image from 'next/image';
import Link from 'next/link';

const categories = [
    {
        image: '/virteez/Blueberry cookies.jpeg',
        label: 'Cookies',
        desc: 'Almond · Coconut · Walnut · Cashew',
        href: '/shop?category=cookies',
    },
    {
        image: '/virteez/Energy bar closeup.jpeg',
        label: 'Energy on the Go',
        desc: 'Energy Bar · Energy Booster',
        href: '/shop?category=energy-on-the-go',
    },
    {
        image: '/virteez/Desert dates drops.jpeg',
        label: 'Infused Cookies',
        desc: 'Blueberry · Cranberry · Desert Dates',
        href: '/shop?category=infused-cookie',
    },
    {
        image: '/virteez/Almond cookies in plate.jpeg',
        label: 'Savory Snacks',
        desc: 'Makhana · Crunchy Bites · Falahaari Chips',
        href: '/shop?category=savory-snacks',
    },
    {
        image: '/virteez/Cashew cookies in plate along with box.jpeg',
        label: 'Wholesome Delights',
        desc: 'Instant Sama Upma',
        href: '/shop?category=wholesome-delights',
    },
];

const features = [
    { icon: '🕉️', title: '100% Vrat Friendly' },
    { icon: '🌾', title: 'Millet-Based' },
    { icon: '🏷️', title: 'Clean Label' },
    { icon: '🔬', title: 'Science Backed' },
    { icon: '🌿', title: 'Gut Friendly' },
    { icon: '🚫', title: 'No Palm Oil' },
];

export default function OurProductsSection() {
    return (
        <section className="py-20 bg-linear-to-b from-amber-50/60 to-stone-50">
            <div className="max-w-7xl mx-auto px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-[11px] font-semibold tracking-[0.25em] text-amber-700 uppercase mb-3">
                        What We Make
                    </p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-3 tracking-tight">
                        Explore by Category
                    </h2>
                    <p className="text-stone-500 max-w-md mx-auto text-sm">
                        Every product crafted with traditional ingredients, validated by modern science — and always vrat-friendly.
                    </p>
                </div>

                {/* Category grid — 5 items: 3 top, 2 bottom centered */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                    {categories.slice(0, 3).map((cat, i) => (
                        <CategoryCard key={i} cat={cat} />
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-16">
                    {categories.slice(3).map((cat, i) => (
                        <CategoryCard key={i} cat={cat} />
                    ))}
                </div>

                {/* Feature badges */}
                <div className="border-t border-stone-200 pt-14">
                    <p className="text-center text-[11px] font-semibold tracking-[0.25em] text-stone-400 uppercase mb-8">
                        Our Products Are
                    </p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 rounded-full border-2 border-stone-200 group-hover:border-amber-400 bg-white flex items-center justify-center mb-3 transition-all duration-200 group-hover:scale-105 shadow-sm">
                                    <span className="text-xl">{f.icon}</span>
                                </div>
                                <p className="text-[10px] md:text-xs font-bold text-stone-700 uppercase leading-tight">{f.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function CategoryCard({ cat }: { cat: typeof categories[0] }) {
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
            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white font-bold text-lg leading-tight mb-1">{cat.label}</p>
                <p className="text-white/60 text-xs">{cat.desc}</p>
            </div>
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs">→</span>
            </div>
        </Link>
    );
}