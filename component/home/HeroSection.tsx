'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const slides = [
    {
        image: '/virteez/All three infused cookies.jpeg',
        title: 'Protein-Packed Cookies',
        subtitle: 'Taste the goodness. Fuel the grind.',
        tagline: '10g Protein  •  No Added Sugar  •  Real Ingredients',
        cta: 'SHOP COOKIES',
        href: '/shop?category=cookie',
        accent: 'from-orange-500 to-amber-500',
    },
    {
        image: '/virteez/Energy bar with packaging.jpeg',
        title: 'Energy Bars That Deliver',
        subtitle: '21g protein per bar. Zero guilt.',
        tagline: 'Grass-Fed Whey  •  No Artificial Sweeteners',
        cta: 'SHOP BARS',
        href: '/shop?category=energy-bar',
        accent: 'from-emerald-500 to-teal-500',
    },
    {
        image: '/virteez/Assorted cookie box.jpeg',
        title: 'Gift the Goodness',
        subtitle: 'Assorted boxes for every occasion.',
        tagline: 'Perfect Gift  •  All Flavours  •  Premium Quality',
        cta: 'SHOP GIFTS',
        href: '/product/assorted-cookie-box',
        accent: 'from-rose-500 to-pink-500',
    },
];

export default function HeroSection() {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const DURATION = 3500;

    const goTo = useCallback((idx: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrent(idx);
            setTimeout(() => setIsAnimating(false), 50);
        }, 400);
    }, [isAnimating]);

    const prev = () => goTo((current - 1 + slides.length) % slides.length);
    const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

    useEffect(() => {
        const timer = setInterval(() => next(), DURATION);
        return () => clearInterval(timer);
    }, [next]);

    const slide = slides[current];

    const contentAnim = isAnimating
        ? 'opacity-0 translate-y-6'
        : 'opacity-100 translate-y-0';

    return (
        <section className="relative w-full h-[85vh] min-h-[550px] max-h-[800px] overflow-hidden">
            {/* Full-screen background image */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
            </div>

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

            {/* Navigation arrows */}
            {/* <button
                onClick={prev}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all hover:scale-110 flex items-center justify-center group"
                aria-label="Previous slide"
            >
                <ChevronLeft size={20} className="text-white group-hover:text-white transition" />
            </button>
            <button
                onClick={() => goTo((current + 1) % slides.length)}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all hover:scale-110 flex items-center justify-center group"
                aria-label="Next slide"
            >
                <ChevronRight size={20} className="text-white group-hover:text-white transition" />
            </button> */}

            {/* Text content overlay */}
            <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto w-full px-8 md:px-16">
                    <div className={`max-w-xl transition-all duration-500 ease-out ${contentAnim}`}>
                        {/* Category pill */}
                        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${slide.accent}`} />
                            <span className="text-xs font-bold text-white/90 uppercase tracking-wider">New Collection</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] mb-5 tracking-tight">
                            {slide.title}
                        </h1>

                        <p className="text-lg md:text-xl text-white/80 font-medium mb-3">
                            {slide.subtitle}
                        </p>

                        <p className="text-sm text-white/50 tracking-wide mb-8 font-medium">
                            {slide.tagline}
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                            <Link
                                href={slide.href}
                                className={`inline-flex items-center gap-2.5 bg-gradient-to-r ${slide.accent} text-white px-8 py-4 rounded-full font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-200`}
                            >
                                {slide.cta}
                                <ArrowRight size={16} />
                            </Link>
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 text-white/70 hover:text-white font-semibold text-sm transition px-4 py-4"
                            >
                                View all products
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom dots */}
            {/* <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center gap-2.5">
                {slides.map((s, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                            i === current
                                ? `bg-gradient-to-r ${s.accent} w-8 shadow-sm`
                                : 'bg-white/40 w-2.5 hover:bg-white/60'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div> */}
        </section>
    );
}
