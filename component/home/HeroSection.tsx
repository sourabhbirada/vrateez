'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

const slides = [
    {
        image: '/virteez/All three infused cookies.jpeg',
        tag: 'Vrat Friendly · Clean Label',
        title: 'Ancient Grains.\nModern Nutrition.',
        subtitle: 'Millet-based snacks crafted with Vedic wisdom and food science.',
        cta: 'SHOP COOKIES',
        href: '/shop?category=cookie',
    },
    {
        image: '/virteez/Energy bar with packaging.jpeg',
        tag: 'No Palm Oil · No Onion · No Garlic',
        title: 'Energy That\nHonors You.',
        subtitle: 'Nut & seed bars designed to boost stamina — naturally.',
        cta: 'SHOP ENERGY BARS',
        href: '/shop?category=energy-bar',
    },
    {
        image: '/virteez/Assorted cookie box.jpeg',
        tag: 'Gluten Free · Science Backed',
        title: 'Pure. Honest.\nNourishing.',
        subtitle: 'Every ingredient chosen for health. Every product made with trust.',
        cta: 'EXPLORE ALL',
        href: '/shop',
    },
];

const CATEGORIES = [
    { label: 'Cookies', href: '/shop?category=cookie' },
    { label: 'Infused Cookies', href: '/shop?category=infused-cookie' },
    { label: 'Energy on the Go', href: '/shop?category=energy-bar' },
    { label: 'Savory Snacks', href: '/shop?category=savory' },
    { label: 'Wholesome Delights', href: '/shop?category=wholesome' },
];

export default function HeroSection() {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const goTo = useCallback((idx: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrent(idx);
            setTimeout(() => setIsAnimating(false), 50);
        }, 350);
    }, [isAnimating]);

    const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

    useEffect(() => {
        const timer = setInterval(next, 4000);
        return () => clearInterval(timer);
    }, [next]);

    const slide = slides[current];
    const contentAnim = isAnimating ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0';

    return (
        <section className="relative w-full h-[88vh] min-h-[580px] max-h-[820px] overflow-hidden">
            {/* Background image */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <Image src={slide.image} alt={slide.title} fill className="object-cover" priority sizes="100vw" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
                {/* Main text */}
                <div className="flex-1 flex items-center">
                    <div className="max-w-7xl mx-auto w-full px-8 md:px-16">
                        <div className={`max-w-lg transition-all duration-500 ease-out ${contentAnim}`}>
                            <span className="inline-block text-[11px] font-semibold tracking-[0.2em] text-amber-400 uppercase mb-5">
                                {slide.tag}
                            </span>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] mb-5 tracking-tight whitespace-pre-line">
                                {slide.title}
                            </h1>
                            <p className="text-base md:text-lg text-white/70 mb-8 leading-relaxed max-w-sm">
                                {slide.subtitle}
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                <Link
                                    href={slide.href}
                                    className="inline-flex items-center gap-2.5 bg-amber-600 hover:bg-amber-500 text-white px-7 py-3.5 rounded-full font-bold text-sm transition-all duration-200 hover:scale-[1.03] shadow-lg"
                                >
                                    {slide.cta}
                                    <ArrowRight size={15} />
                                </Link>
                                <Link href="/shop" className="text-white/60 hover:text-white text-sm font-medium transition flex items-center gap-1.5">
                                    View all products <ArrowRight size={13} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category strip at bottom */}
                <div className="bg-black/40 backdrop-blur-md border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-8 md:px-16">
                        <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
                            <span className="text-[10px] font-bold tracking-[0.2em] text-white/35 uppercase mr-3 flex-shrink-0">
                                Categories
                            </span>
                            {CATEGORIES.map((cat) => (
                                <Link
                                    key={cat.label}
                                    href={cat.href}
                                    className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold text-white/65 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/25 transition"
                                >
                                    {cat.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide dots */}
            <div className="absolute bottom-14 right-8 md:right-16 z-10 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-amber-400 w-6' : 'bg-white/30 w-1.5 hover:bg-white/50'}`}
                        aria-label={`Slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}