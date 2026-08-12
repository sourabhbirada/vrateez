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

const S3 = 'https://vrateez.s3.ap-south-1.amazonaws.com';

const FALLBACK_CATEGORY_CARDS: CategoryCardItem[] = [
  {
    image: `${S3}/Assorted+cookie+box.jpeg`,
    label: 'Cookies',
    desc: 'Protein-rich millet cookies',
    href: '/shop?category=cookies',
  },
  {
    image: `${S3}/Energy+bar.jpeg`,
    label: 'Energy on the Go',
    desc: 'Energy bars',
    href: '/shop?category=energy-on-the-go',
  },
  {
    image: `${S3}/Blueberry+cookies.jpeg`,
    label: 'Infused Cookies',
    desc: 'Fruit-infused cookies',
    href: '/shop?category=infused-cookie',
  },
  {
    image: `${S3}/Cashew+cookies+in+plate+along+with+box.jpeg`,
    label: 'Savory Snacks',
    desc: 'Wholesome savory bites',
    href: '/shop?category=savory-snacks',
  },
  {
    image: `${S3}/Desert+dates+drops.jpeg`,
    label: 'Wholesome Delights',
    desc: 'Everyday healthy treats',
    href: '/shop?category=wholesome-delights',
  },
];

const IMAGE_BY_SLUG: Record<string, string> = {
  cookies: `${S3}/Assorted+cookie+box.jpeg`,
  'energy-on-the-go': `${S3}/Energy+bar.jpeg`,
  'energy-bar': `${S3}/Energy+bar.jpeg`,
  'infused-cookie': `${S3}/Blueberry+cookies.jpeg`,
  'infused-cookies': `${S3}/Blueberry+cookies.jpeg`,
  'savory-snacks': `${S3}/Cashew+cookies+in+plate+along+with+box.jpeg`,
  'wholesome-delights': `${S3}/Desert+dates+drops.jpeg`,
};

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

function isWeakImage(image?: string) {
  if (!image) return true;
  const lower = image.toLowerCase();
  return lower.includes('logo') || lower === '/logo.png' || lower.endsWith('/logo.png');
}

function mapCategoriesToCards(categories: Category[]): CategoryCardItem[] {
  return categories.map((c) => ({
    image: !isWeakImage(c.image)
      ? c.image
      : IMAGE_BY_SLUG[c.slug] || FALLBACK_CATEGORY_CARDS[0].image,
    label: c.name,
    desc: c.description?.replace(/engery/i, 'Energy') || '',
    href: `/shop?category=${c.slug}`,
  }));
}

export default function OurProductsSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    let cancelled = false;
    getCategoriesApi()
      .then((items) => {
        if (!cancelled) setCategories(items);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cards: CategoryCardItem[] = useMemo(() => {
    if (!loaded) return FALLBACK_CATEGORY_CARDS;
    if (!categories.length) return FALLBACK_CATEGORY_CARDS;
    return mapCategoriesToCards(categories);
  }, [categories, loaded]);

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
    <section className="relative py-20 overflow-hidden bg-ink">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, #E4A93D 0%, transparent 42%), radial-gradient(circle at 90% 75%, #C4711F 0%, transparent 38%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 grain-overlay opacity-[0.04] mix-blend-overlay" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        <div className="text-center mb-12">
          <p className="font-label text-[11px] tracking-[0.25em] text-millet uppercase mb-3">
            What We Make
          </p>
          <h2 className="font-display italic text-3xl md:text-4xl text-parchment mb-3 tracking-tight">
            Explore by Category
          </h2>
          <p className="text-parchment/50 max-w-md mx-auto text-sm leading-relaxed">
            Every product crafted with traditional ingredients, validated by modern science — and always
            vrat-friendly.
          </p>
        </div>

        {topRow.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-5">
            {topRow.map((cat) => (
              <CategoryCard key={cat.href} cat={cat} />
            ))}
          </div>
        ) : null}
        {bottomRow.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 max-w-3xl mx-auto mb-14">
            {bottomRow.map((cat) => (
              <CategoryCard key={cat.href} cat={cat} />
            ))}
          </div>
        ) : null}

        <div className="border-t border-parchment/10 pt-12">
          <div className="relative overflow-hidden ring-1 ring-parchment/10 bg-parchment/[0.04] px-5 py-10 md:px-10 md:py-12">
            <div className="relative text-center mb-9 md:mb-11">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="h-px w-8 md:w-12 bg-parchment/20" />
                <p className="font-label text-[10px] md:text-[11px] tracking-[0.32em] text-parchment/40 uppercase">
                  Our Products Are
                </p>
                <span className="h-px w-8 md:w-12 bg-parchment/20" />
              </div>
              <p className="font-display italic text-xl md:text-2xl text-parchment tracking-tight">
                Crafted with intention
              </p>
            </div>

            <ul className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-8 gap-x-4 md:gap-x-2">
              {features.map(({ icon: Icon, title }, index) => (
                <li
                  key={`${title}-${index}`}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative mb-3.5">
                    <div className="relative w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full border border-parchment/25 group-hover:border-millet/60 bg-ink flex items-center justify-center transition-all duration-300 group-hover:-translate-y-0.5">
                      <Icon
                        size={22}
                        strokeWidth={1.5}
                        className="text-parchment/80 group-hover:text-millet transition-colors duration-300"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] md:text-[11px] font-semibold text-parchment/70 uppercase tracking-[0.12em] leading-snug max-w-30">
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
      className="group relative overflow-hidden h-64 md:h-72 ring-1 ring-parchment/15 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.7)] transition-all duration-300 hover:ring-millet/40"
    >
      <Image
        src={cat.image}
        alt={cat.label}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/35 to-transparent" />
      <div className="absolute bottom-5 left-5 right-5">
        <p className="font-display italic text-parchment text-xl leading-tight mb-1">{cat.label}</p>
        {cat.desc ? <p className="text-parchment/55 text-xs">{cat.desc}</p> : null}
      </div>
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-parchment/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-parchment text-xs">→</span>
      </div>
    </Link>
  );
}
