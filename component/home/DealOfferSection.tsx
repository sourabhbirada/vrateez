'use client';

import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDealsApi } from '@/lib/api/dealApi';
import type { Deal } from '@/lib/api/types';

function DealCard({ deal }: { deal: Deal }) {
    const href =
        deal.productSlug?.trim()
            ? `/product/${deal.productSlug.trim()}`
            : deal.ctaLink || '/shop';
    const savings =
        deal.originalPrice > deal.price && deal.price > 0
            ? deal.originalPrice - deal.price
            : 0;

    return (
        <section className="relative overflow-hidden bg-ink text-parchment">
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                aria-hidden="true"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 20% 20%, #E4A93D 0%, transparent 45%), radial-gradient(circle at 85% 70%, #C4711F 0%, transparent 40%)',
                }}
            />
            <div className="pointer-events-none absolute inset-0 grain-overlay opacity-[0.04] mix-blend-overlay" aria-hidden="true" />

            <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                    <div className="relative order-1">
                        <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-sm ring-1 ring-parchment/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]">
                            {deal.video ? (
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    poster={deal.image || undefined}
                                    className="absolute inset-0 h-full w-full object-cover"
                                >
                                    <source src={deal.video} type="video/mp4" />
                                </video>
                            ) : deal.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={deal.image}
                                    alt={deal.title}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-basil" />
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-ink/50 via-transparent to-ink/10" />
                        </div>
                    </div>

                    <div className="order-2 space-y-7">
                        {deal.badge ? (
                            <span className="inline-flex items-center gap-2 font-label text-[10px] tracking-[0.22em] uppercase text-millet border border-millet/35 px-3 py-1.5">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-millet opacity-60" />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-millet" />
                                </span>
                                {deal.badge}
                            </span>
                        ) : null}

                        <div>
                            <h2 className="font-display italic text-3xl md:text-5xl text-parchment leading-[1.1] tracking-[-0.01em] whitespace-pre-line">
                                {deal.title}
                            </h2>
                            {deal.subtitle ? (
                                <p className="mt-3 text-[15px] md:text-base text-parchment/65 leading-relaxed max-w-md">
                                    {deal.subtitle}
                                </p>
                            ) : null}
                        </div>

                        {deal.description ? (
                            <p className="text-sm md:text-[15px] text-parchment/55 leading-relaxed max-w-lg">
                                {deal.description}
                            </p>
                        ) : null}

                        {deal.items?.length > 0 ? (
                            <div>
                                <p className="font-label text-[10px] tracking-[0.18em] uppercase text-millet/80 mb-3">
                                    Includes
                                </p>
                                <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                                    {deal.items.map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-center gap-2 text-sm text-parchment/80"
                                        >
                                            <Check size={14} className="shrink-0 text-millet" strokeWidth={2.5} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}

                        {deal.price > 0 ? (
                            <div className="flex flex-wrap items-end gap-4 pt-1 border-t border-parchment/10">
                                <div className="flex items-baseline gap-3 pt-5">
                                    <span className="font-display text-4xl md:text-5xl text-millet leading-none">
                                        ₹{deal.price}
                                    </span>
                                    {deal.originalPrice > deal.price ? (
                                        <span className="text-lg text-parchment/35 line-through">
                                            ₹{deal.originalPrice}
                                        </span>
                                    ) : null}
                                </div>
                                {savings > 0 ? (
                                    <span className="mb-1 font-label text-[10px] tracking-[0.14em] uppercase bg-basil text-parchment px-3 py-1.5 ring-1 ring-parchment/10">
                                        Save ₹{savings}
                                    </span>
                                ) : null}
                            </div>
                        ) : null}

                        <div className="flex flex-wrap items-center gap-4 pt-1">
                            <Link
                                href={href}
                                className="group inline-flex items-center gap-2.5 bg-turmeric text-parchment px-7 py-3.5 font-semibold text-sm shadow-md shadow-turmeric/20 transition-all duration-200 hover:bg-clay hover:shadow-lg hover:shadow-clay/25"
                            >
                                {deal.cta || 'Order Now'}
                                <ArrowRight
                                    size={15}
                                    className="transition-transform group-hover:translate-x-0.5"
                                />
                            </Link>
                            <Link
                                href="/raksha-bandhan"
                                className="text-parchment/45 hover:text-parchment text-sm font-medium transition underline decoration-parchment/20 underline-offset-4"
                            >
                                View full details
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function DealOfferSection() {
    const [deals, setDeals] = useState<Deal[]>([]);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const items = await getDealsApi('homepage');
                if (!cancelled) setDeals(items);
            } catch {
                if (!cancelled) setDeals([]);
            }
        }
        void load();
        return () => {
            cancelled = true;
        };
    }, []);

    if (!deals.length) return null;

    return (
        <>
            {deals.map((deal) => (
                <DealCard key={deal._id} deal={deal} />
            ))}
        </>
    );
}
