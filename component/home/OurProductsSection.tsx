'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { BadgeCheck, Wheat, Tag, FlaskConical, Sprout, Ban } from 'lucide-react';
import { getCategoriesApi } from '@/lib/api/categoryApi';
import { useSettings } from '@/context/SettingsContext';
import type { Category } from '@/lib/api/types';

type CategoryCardItem = {
  image: string;
  label: string;
  desc: string;
  href: string;
};

type FeatureItem = { icon: LucideIcon; title: string };

const DEFAULT_FEATURES: FeatureItem[] = [
  { icon: BadgeCheck, title: 'Vrat Friendly' },
  { icon: Wheat, title: 'Millet-Based' },
  { icon: Tag, title: 'Clean Label' },
  { icon: FlaskConical, title: 'Science Backed' },
  { icon: Sprout, title: 'Gut Friendly' },
  { icon: Ban, title: 'No Palm Oil' },
];

const ICON_RULES: Array<{ match: RegExp; icon: LucideIcon }> = [
  { match: /vrat|fast|satvik|sattvic/i, icon: BadgeCheck },
  { match: /millet|grain|ragi|jowar|bajra/i, icon: Wheat },
  { match: /clean|label|ingredient/i, icon: Tag },
  { match: /science|lab|research|clinical/i, icon: FlaskConical },
  { match: /gut|digest|probiotic|fiber/i, icon: Sprout },
  { match: /palm|no\s|free\s|without|zero/i, icon: Ban },
];

function iconForBadge(title: string, index: number): LucideIcon {
  const found = ICON_RULES.find((r) => r.match.test(title));
  if (found) return found.icon;
  return DEFAULT_FEATURES[index % DEFAULT_FEATURES.length].icon;
}

export default function OurProductsSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    let cancelled = false;
    getCategoriesApi()
      .then((items) => {
        if (!cancelled) setCategories(items);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cards: CategoryCardItem[] = useMemo(
    () =>
      categories.map((c) => ({
        image: c.image || '/logo.png',
        label: c.name,
        desc: c.description || '',
        href: `/shop?category=${c.slug}`,
      })),
    [categories]
  );

  const topRow = cards.slice(0, 3);
  const bottomRow = cards.slice(3);
  const apiBadges = settings?.content?.featureBadges?.filter(Boolean) || [];
  const features: FeatureItem[] =
    apiBadges.length > 0
      ? apiBadges.map((title, i) => ({
          icon: iconForBadge(title, i),
          title,
        }))
      : DEFAULT_FEATURES;

  return (
    <section className="py-20 bg-parchment">
      <div className="max-w-7xl mx-auto px-8">
        {cards.length > 0 ? (
          <>
            <div className="text-center mb-12">
              <p className="font-label text-[11px] tracking-[0.25em] text-clay uppercase mb-3">What We Make</p>
              <h2 className="font-display italic text-3xl md:text-4xl text-ink mb-3 tracking-tight">
                Explore by Category
              </h2>
              <p className="text-ink/50 max-w-md mx-auto text-sm leading-relaxed">
                Every product crafted with traditional ingredients, validated by modern science — and always
                vrat-friendly.
              </p>
            </div>

            {topRow.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
                {topRow.map((cat) => (
                  <CategoryCard key={cat.href} cat={cat} />
                ))}
              </div>
            ) : null}
            {bottomRow.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-16">
                {bottomRow.map((cat) => (
                  <CategoryCard key={cat.href} cat={cat} />
                ))}
              </div>
            ) : null}
          </>
        ) : null}

        <div className={cards.length > 0 ? 'border-t border-ink/8 pt-14' : ''}>
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-b from-[#F7F0E4] to-[#EFE6D6] border border-ink/6 px-5 py-10 md:px-10 md:py-12">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 0%, rgba(36,31,22,0.04), transparent 42%), radial-gradient(circle at 80% 100%, rgba(180,120,40,0.06), transparent 40%)',
              }}
            />

            <div className="relative text-center mb-9 md:mb-11">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="h-px w-8 md:w-12 bg-ink/15" />
                <p className="font-label text-[10px] md:text-[11px] tracking-[0.32em] text-ink/40 uppercase">
                  Our Products Are
                </p>
                <span className="h-px w-8 md:w-12 bg-ink/15" />
              </div>
              <p className="font-display italic text-xl md:text-2xl text-ink tracking-tight">
                Crafted with intention
              </p>
            </div>

            <ul className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-8 gap-x-4 md:gap-x-2">
              {features.map(({ icon: Icon, title }, index) => (
                <li
                  key={`${title}-${index}`}
                  className="flex flex-col items-center text-center group"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="relative mb-3.5">
                    <div className="absolute inset-0 rounded-full bg-turmeric/0 group-hover:bg-turmeric/10 scale-110 transition-colors duration-300" />
                    <div className="relative w-17 h-17 md:w-18 md:h-18 rounded-full border border-ink/25 group-hover:border-ink/55 bg-[#F8F1E5]/group-hover:bg-parchment flex items-center justify-center transition-all duration-300 group-hover:-translate-y-0.5 shadow-[0_1px_0_rgba(36,31,22,0.04)]">
                      <Icon
                        size={22}
                        strokeWidth={1.5}
                        className="text-ink/80 group-hover:text-ink transition-colors duration-300"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] md:text-[11px] font-semibold text-ink uppercase tracking-[0.12em] leading-snug max-w-30">
                    {title}
                  </p>
                </li>
              ))}
            </ul>
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
        {cat.desc ? <p className="text-parchment/60 text-xs">{cat.desc}</p> : null}
      </div>
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-parchment/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-parchment text-xs">→</span>
      </div>
    </Link>
  );
}
