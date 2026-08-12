'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Leaf, WheatOff } from 'lucide-react';
import { getBannersApi } from '@/lib/api/bannerApi';
import type { Banner } from '@/lib/api/types';

type HeroSlide = {
    image: string;
    video?: string;
    imagePosition: string;
    tag: string;
    title: string;
    subtitle: string;
    cta: string;
    href: string;
    macros: Array<{ value: string; label: string }>;
};

const FALLBACK_SLIDES: HeroSlide[] = [
    {
        image: '/rakhsbandhangift.png',
        video: '/rakhevideo.mp4',
        imagePosition: 'object-[60%_40%]',
        tag: 'Limited Time Offer · Raksha Bandhan Special',
        title: 'Gift hamper that\ncelebrates love.',
        subtitle:
            'Healthy treats, beautiful Rakhi & Roli Chawal — all wrapped in endless sibling love. Only ₹379!',
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
        subtitle:
            'Millet-based protein cookies built for real training days — clean label, no compromise.',
        cta: 'Shop protein cookies',
        href: '/shop?category=cookies',
        macros: [
            { value: '10g', label: 'Protein' },
            { value: '0g', label: 'Added Sugar' },
            { value: '140', label: 'Calories' },
        ],
    },
];

const FEATURES = [
    { icon: Leaf, label: 'No Onion, No Garlic' },
    { icon: WheatOff, label: 'Gluten Free' },
];

function mapBannerToSlide(banner: Banner): HeroSlide {
    const macros =
        banner.macros && banner.macros.length > 0
            ? banner.macros
            : [
                  { value: 'Clean', label: 'Label' },
                  { value: 'Vrat', label: 'Friendly' },
                  { value: 'GF', label: 'Gluten Free' },
              ];

    return {
        image: banner.image || '',
        video: banner.video || undefined,
        imagePosition: 'object-cover object-center',
        tag: banner.tag || 'Vrateez Special',
        title: banner.title,
        subtitle: banner.subtitle,
        cta: banner.cta || 'Shop Now',
        href: banner.ctaLink || '/shop',
        macros,
    };
}

function SattvicSeal() {
    return (
        <div className="relative w-28 h-28 md:w-36 md:h-36 shrink-0">
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
                    <span className="font-label text-[7px] md:text-[8px] tracking-[0.15em] uppercase mt-1">
                        Certified
                        <br />
                        Clean
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function HeroSection() {
    const [slides, setSlides] = useState<HeroSlide[]>(FALLBACK_SLIDES);
    const [loading, setLoading] = useState(true);
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const banners = await getBannersApi();
                if (!cancelled) {
                    const mapped = banners
                        .map(mapBannerToSlide)
                        .filter((s) => s.title && (s.image || s.video));
                    setSlides(mapped.length > 0 ? mapped : FALLBACK_SLIDES);
                    setCurrent(0);
                }
            } catch {
                if (!cancelled) setSlides(FALLBACK_SLIDES);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        void load();
        return () => {
            cancelled = true;
        };
    }, []);

    const goTo = useCallback(
        (idx: number) => {
            if (isAnimating || slides.length === 0) return;
            setIsAnimating(true);
            setTimeout(() => {
                setCurrent(idx);
                setTimeout(() => setIsAnimating(false), 50);
            }, 350);
        },
        [isAnimating, slides.length]
    );

    const next = useCallback(
        () => goTo((current + 1) % slides.length),
        [current, goTo, slides.length]
    );

    useEffect(() => {
        if (slides.length < 2) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next, slides.length]);

    if (loading) {
        return <section className="relative w-full min-h-[40vh] bg-parchment" />;
    }

    if (!slides.length) return null;

    const slide = slides[current];
    const contentAnim = isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0';

    return (
        <section className="relative w-full overflow-hidden bg-parchment">
            <div className="grid md:grid-cols-[minmax(0,42%)_1fr]">
                <div className="relative flex flex-col justify-center px-8 md:px-14 py-14 md:py-0 order-2 md:order-1 overflow-hidden">
                    <div className={`relative max-w-md transition-all duration-500 ease-out ${contentAnim}`}>
                        <span className="inline-block font-label text-[10px] tracking-[0.22em] text-clay uppercase mb-6 border border-clay/30 rounded-full px-3 py-1">
                            {slide.tag}
                        </span>
                        <h1 className="font-display italic text-4xl md:text-5xl lg:text-[3.3rem] text-ink leading-[1.08] mb-6 whitespace-pre-line tracking-[-0.01em]">
                            {slide.title}
                        </h1>
                        <p className="text-[15px] text-ink/60 mb-7 leading-relaxed max-w-sm">{slide.subtitle}</p>

                        <div className="flex items-stretch gap-0 mb-7 bg-ink rounded-2xl px-6 py-4 w-fit shadow-lg shadow-ink/15 ring-1 ring-white/5">
                            {slide.macros.map((m, i) => (
                                <div
                                    key={`${m.label}-${i}`}
                                    className={`flex flex-col items-center px-5 ${i > 0 ? 'border-l border-parchment/15' : ''}`}
                                >
                                    <span className="font-display text-2xl md:text-3xl text-millet leading-none">
                                        {m.value}
                                    </span>
                                    <span className="font-label text-[9px] tracking-[0.15em] uppercase text-parchment/60 mt-1.5">
                                        {m.label}
                                    </span>
                                </div>
                            ))}
                        </div>

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
                            <Link
                                href="/shop"
                                className="text-ink/50 hover:text-ink text-sm font-medium transition underline decoration-ink/20 underline-offset-4"
                            >
                                View all products
                            </Link>
                        </div>

                        <div className="hidden md:flex gap-2">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        i === current ? 'bg-turmeric w-8' : 'bg-ink/15 w-1.5 hover:bg-ink/30'
                                    }`}
                                    aria-label={`Slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="relative h-[52vh] md:h-[82vh] order-1 md:order-2">
                    <div
                        className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                        style={{
                            clipPath: 'polygon(13% 0, 100% 0, 100% 100%, 0% 100%)',
                        }}
                    >
                        {slide.video ? (
                            <video
                                key={slide.video}
                                autoPlay
                                muted
                                loop
                                playsInline
                                poster={slide.image || undefined}
                                className="absolute inset-0 h-full w-full object-cover"
                            >
                                <source src={slide.video} type="video/mp4" />
                            </video>
                        ) : slide.image ? (
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className={`object-cover ${slide.imagePosition}`}
                                priority
                                sizes="(min-width: 768px) 58vw, 100vw"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-ink/10" />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-ink/45 via-transparent to-transparent md:bg-linear-to-l md:from-transparent md:via-transparent md:to-ink/10" />
                    </div>

                    <div className="absolute top-6 right-6 md:top-10 md:right-10 z-10">
                        <SattvicSeal />
                    </div>
                </div>
            </div>
        </section>
    );
}
