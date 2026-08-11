'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Leaf, WheatOff } from 'lucide-react';

/**
 * FONT SETUP (add once in app/layout.tsx, outside this file):
 *
 * import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
 *
 * const fraunces = Fraunces({
 *   subsets: ['latin'],
 *   variable: '--font-fraunces',
 *   weight: ['400', '500', '600'],
 *   style: ['normal', 'italic'],
 * });
 * const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
 * const plexMono = IBM_Plex_Mono({
 *   subsets: ['latin'],
 *   variable: '--font-mono',
 *   weight: ['500'],
 * });
 *
 * // on <body>:
 * className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-sans`}
 *
 * globals.css @theme additions:
 * --font-display: var(--font-fraunces);
 * --font-sans: var(--font-inter);
 * --font-label: var(--font-mono);
 * --color-parchment: #F3EAD8;
 * --color-ink: #241F16;
 * --color-turmeric: #C4711F;
 * --color-basil: #26362A;
 * --color-millet: #E4A93D;
 * --color-clay: #9C4221;
 */

// Static — no API calls. Edit these arrays directly to change hero content.
const SLIDES = [
    {
        image: '/rakhsbandhangift.png',
        // object position tuned per-image so the product stays in frame after the crop
        imagePosition: 'object-[60%_40%]',
        tag: 'Limited Time Offer · Raksha Bandhan Special',
        title: 'Gift hamper that\ncelebrates love.',
        subtitle: 'Healthy treats, beautiful Rakhi & Roli Chawal — all wrapped in endless sibling love. Only ₹379!',
        cta: 'Order hamper now',
        href: '/raksha-bandhan',
        macros: [
            { value: '₹379', label: 'Special Price' },
            { value: '₹120', label: 'You Save' },
            { value: '6', label: 'Items' },
        ],
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/All+three+infused+cookies.jpeg',
        imagePosition: 'object-[70%_38%]',
        tag: 'High Protein · Vrat Friendly',
        title: 'Protein that\nfits your fast.',
        subtitle: 'Millet-based protein cookies built for real training days — clean label, no compromise.',
        cta: 'Shop protein cookies',
        href: '/shop?category=cookies',
        macros: [
            { value: '10g', label: 'Protein' },
            { value: '0g', label: 'Added Sugar' },
            { value: '140', label: 'Calories' },
        ],
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/WhatsApp+Image+2026-04-07+at+6.24.42+PM+(1).jpeg',
        imagePosition: 'object-[65%_35%]',
        tag: 'No Palm Oil · No Onion · No Garlic',
        title: 'Fuel that\nkeeps up with you.',
        subtitle: 'Nut & seed protein bars built for stamina — pre-workout, mid-fast, or on the move.',
        cta: 'Shop energy bars',
        href: '/shop?category=energy-on-the-go',
        macros: [
            { value: '12g', label: 'Protein' },
            { value: '6g', label: 'Fiber' },
            { value: '160', label: 'Calories' },
        ],
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Assorted+cookie+box.jpeg',
        imagePosition: 'object-[68%_40%]',
        tag: 'Gluten Free · Science Backed',
        title: 'Every gram\nearns its place.',
        subtitle: 'No filler ingredients. No hidden sugar. Just protein you can read on the label.',
        cta: 'Explore all',
        href: '/shop',
        macros: [
            { value: '11g', label: 'Protein' },
            { value: '0g', label: 'Palm Oil' },
            { value: '150', label: 'Calories' },
        ],
    },
];

const CATEGORIES = [
    { label: 'Protein Cookies', href: '/shop?category=cookies' },
    { label: 'Infused Cookies', href: '/shop?category=infused-cookie' },
    { label: 'Energy Bars', href: '/shop?category=energy-on-the-go' },
    { label: 'Savory Snacks', href: '/shop?category=savory-snacks' },
    { label: 'Wholesome Delights', href: '/shop?category=wholesome-delights' },
];

const FEATURES = [
    { icon: Leaf, label: 'No Onion, No Garlic' },
    { icon: WheatOff, label: 'Gluten Free' },
];

function SattvicSeal() {
    return (
        <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0">
            {/* Soft halo so the seal reads clearly against busy photo backgrounds */}
            <div className="absolute inset-0 scale-125 rounded-full bg-ink/25 blur-2xl" aria-hidden="true" />

            <svg
                viewBox="0 0 200 200"
                className="relative w-full h-full motion-safe:animate-[spin_28s_linear_infinite] drop-shadow-xl"
                style={{ animationDirection: 'reverse' }}
            >
                <defs>
                    <path id="sealArc" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
                </defs>
                <circle cx="100" cy="100" r="96" fill="#E4A93D" />
                <circle cx="100" cy="100" r="96" fill="none" stroke="#241F16" strokeWidth="1.5" strokeOpacity="0.15" />
                <circle cx="100" cy="100" r="78" fill="none" stroke="#241F16" strokeWidth="1" strokeDasharray="2 4" />
                <text fill="#241F16" fontSize="13" fontFamily="var(--font-mono, monospace)" letterSpacing="2">
                    <textPath href="#sealArc" startOffset="0%">
                        · HIGH PROTEIN · VRAT FRIENDLY · CLEAN LABEL
                    </textPath>
                </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[62%] h-[62%] rounded-full bg-ink flex flex-col items-center justify-center text-parchment text-center leading-none shadow-inner">
                    <span className="font-display italic text-lg md:text-xl">100%</span>
                    <span className="font-label text-[7px] md:text-[8px] tracking-[0.15em] uppercase mt-1">Certified<br />Clean</span>
                </div>
            </div>
        </div>
    );
}

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

    const next = useCallback(() => goTo((current + 1) % SLIDES.length), [current, goTo]);

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next]);

    const slide = SLIDES[current];
    const contentAnim = isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0';

    return (
        <section className="relative w-full overflow-hidden bg-parchment">
            <div className="grid md:grid-cols-[minmax(0,42%)_1fr]">
                {/* Text panel */}
                <div className="relative flex flex-col justify-center px-8 md:px-14 py-14 md:py-0 order-2 md:order-1 overflow-hidden">
                    {/* Scattered-grain texture — fills the quiet space without competing with the seal */}
                    <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" aria-hidden="true">
                        <defs>
                            <pattern id="grainPattern" width="48" height="48" patternUnits="userSpaceOnUse">
                                <circle cx="4" cy="6" r="1.6" fill="#241F16" />
                                <circle cx="26" cy="20" r="1.1" fill="#241F16" />
                                <circle cx="40" cy="10" r="1.8" fill="#241F16" />
                                <circle cx="16" cy="34" r="1.3" fill="#241F16" />
                                <circle cx="36" cy="40" r="1.1" fill="#241F16" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grainPattern)" />
                    </svg>

                    <div className={`relative max-w-md transition-all duration-500 ease-out ${contentAnim}`}>
                        <span className="inline-block font-label text-[10px] tracking-[0.22em] text-clay uppercase mb-6 border border-clay/30 rounded-full px-3 py-1">
                            {slide.tag}
                        </span>
                        <h1 className="font-display italic text-4xl md:text-5xl lg:text-[3.3rem] text-ink leading-[1.08] mb-6 whitespace-pre-line tracking-[-0.01em]">
                            {slide.title}
                        </h1>
                        <p className="text-[15px] text-ink/60 mb-7 leading-relaxed max-w-sm">
                            {slide.subtitle}
                        </p>

                        {/* Macro stat row — the thing a protein-brand hero needs to lead with */}
                        <div className="flex items-stretch gap-0 mb-7 bg-ink rounded-2xl px-6 py-4 w-fit shadow-lg shadow-ink/15 ring-1 ring-white/5">
                            {slide.macros.map((m, i) => (
                                <div key={m.label} className={`flex flex-col items-center px-5 ${i > 0 ? 'border-l border-parchment/15' : ''}`}>
                                    <span className="font-display text-2xl md:text-3xl text-millet leading-none">{m.value}</span>
                                    <span className="font-label text-[9px] tracking-[0.15em] uppercase text-parchment/60 mt-1.5">{m.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Feature chips — the same claims printed on the packaging itself */}
                        <div className="flex flex-wrap gap-2.5 mb-9">
                            {FEATURES.map(({ icon: Icon, label }) => (
                                <span
                                    key={label}
                                    className="inline-flex items-center gap-1.5 bg-ink/[0.04] border border-ink/10 rounded-full pl-2.5 pr-3.5 py-1.5 text-xs font-semibold text-ink/70"
                                >
                                    <Icon size={13} className="text-basil" />
                                    {label}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-5 mb-10">
                            <Link
                                href={slide.href}
                                className="group inline-flex items-center gap-2.5 bg-turmeric text-parchment px-6 py-3.5 rounded-full font-semibold text-sm shadow-md shadow-turmeric/25 transition-all duration-200 hover:bg-clay hover:shadow-lg hover:shadow-clay/25"
                            >
                                {slide.cta}
                                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                            </Link>
                            <Link href="/shop" className="text-ink/50 hover:text-ink text-sm font-medium transition underline decoration-ink/20 underline-offset-4">
                                View all products
                            </Link>
                        </div>

                        <div className="hidden md:flex gap-2">
                            {SLIDES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-turmeric w-8' : 'bg-ink/15 w-1.5 hover:bg-ink/30'}`}
                                    aria-label={`Slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Image panel */}
                <div className="relative h-[52vh] md:h-[82vh] order-1 md:order-2">
                    {/* Diagonal reveal — gentler angle + soft seam shadow so it reads as an intentional edit, not a raw cutout */}
                    <div
                        className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                        style={{
                            clipPath: 'polygon(13% 0, 100% 0, 100% 100%, 0% 100%)',
                        }}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className={`object-cover ${slide.imagePosition}`}
                            priority
                            sizes="(min-width: 768px) 58vw, 100vw"
                        />
                        {/* Grounding gradient for legibility */}
                        <div className="absolute inset-0 bg-linear-to-t from-ink/45 via-transparent to-transparent md:bg-linear-to-l md:from-transparent md:via-transparent md:to-ink/10" />
                    </div>

                    {/* Seam shadow along the diagonal edge, on top of the clipped image */}
                    <div
                        className="absolute inset-0 pointer-events-none hidden md:block"
                        style={{
                            background: 'linear-gradient(90deg, rgba(36,31,22,0.12) 0%, rgba(36,31,22,0) 6%)',
                            clipPath: 'polygon(13% 0, 22% 0, 100% 100%, 91% 100%)',
                        }}
                        aria-hidden="true"
                    />

                    {/* Seal, anchored over the image with its own halo for contrast */}
                    <div className="absolute top-6 right-6 md:top-10 md:right-10 z-10">
                        <SattvicSeal />
                    </div>
                </div>
            </div>
        </section>
    );
}