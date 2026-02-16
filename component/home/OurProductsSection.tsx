'use client';

import Image from 'next/image';
import Link from 'next/link';

const highlights = [
    {
        image: '/virteez/Blueberry cookies.jpeg',
        label: 'Protein Cookies',
        href: '/shop?category=cookie',
    },
    {
        image: '/virteez/Energy bar closeup.jpeg',
        label: 'Energy Bars',
        href: '/shop?category=energy-bar',
    },
    {
        image: '/virteez/Desert dates drops.jpeg',
        label: 'Desert Date Drops',
        href: '/shop?category=desert-date',
    },
];

const features = [
    { icon: '💪', title: 'PACKED WITH PROTEIN' },
    { icon: '🧬', title: 'GMO FREE' },
    { icon: '🚫', title: 'NO ADDED SUGAR' },
    { icon: '🌱', title: 'GUT FRIENDLY' },
    { icon: '🌾', title: 'HIGH IN FIBRE' },
    { icon: '🔬', title: 'BACKED BY SCIENCE' },
];

export default function OurProductsSection() {
    return (
        <section className="py-20 bg-gradient-to-b from-amber-50 to-orange-50">
            <div className="max-w-7xl mx-auto px-8">
                {/* Category cards */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                        EXPLORE BY CATEGORY
                    </h2>
                    <p className="text-gray-500">Find your perfect protein snack</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {highlights.map((h, i) => (
                        <Link
                            key={i}
                            href={h.href}
                            className="group relative rounded-3xl overflow-hidden h-72 shadow-lg hover:shadow-2xl transition-shadow"
                        >
                            <Image
                                src={h.image}
                                alt={h.label}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="text-white text-xl font-bold">{h.label}</span>
                                <p className="text-white/70 text-sm mt-1">Shop now →</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Feature badges */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                        OUR PRODUCTS ARE
                    </h2>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 rounded-full border-[3px] border-gray-800 flex items-center justify-center mb-3 bg-white/60 group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                                <span className="text-2xl">{feature.icon}</span>
                            </div>
                            <h3 className="text-[10px] md:text-xs font-bold text-gray-900 uppercase">
                                {feature.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
