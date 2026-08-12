'use client';

import Image from 'next/image';
import { useSettings } from '@/context/SettingsContext';

const DEFAULT_PARTNERS = [
  { name: 'amazon', style: 'text-2xl font-bold text-ink italic', url: '', logoUrl: '' },
  { name: 'zepto', style: 'bg-clay text-parchment px-5 py-2.5 text-base font-bold rounded-xl', url: '', logoUrl: '' },
  { name: 'Blinkit', style: 'bg-millet text-ink px-5 py-2.5 text-base font-bold rounded-xl', url: '', logoUrl: '' },
];

export default function AvailableAtSection() {
  const { settings } = useSettings();
  const fromApi = settings?.content?.partners?.filter((p) => p.name) || [];
  const partners =
    fromApi.length > 0
      ? fromApi.map((p) => ({ ...p, style: 'text-xl font-bold text-ink' }))
      : DEFAULT_PARTNERS;

  return (
    <section className="py-20 bg-parchment">
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center mb-6">
          <p className="text-ink/50 max-w-2xl mx-auto leading-relaxed text-sm">
            In today&apos;s busy life, finding food that is healthy, pure, and ready to eat instantly feels like a
            difficult balance. Vrateez walks beside you — crafted for every moment, built on tradition, backed by
            science.
          </p>
        </div>

        <h2 className="font-display italic text-2xl md:text-3xl text-center text-ink mb-12">Also Available At</h2>

        <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
          {partners.map((p) => {
            const content = p.logoUrl ? (
              <div className="relative h-10 w-28">
                <Image src={p.logoUrl} alt={p.name} fill className="object-contain" />
              </div>
            ) : (
              <span className={(p as { style?: string }).style || 'text-xl font-bold text-ink'}>{p.name}</span>
            );

            return p.url ? (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                {content}
              </a>
            ) : (
              <div key={p.name} className="hover:opacity-80 transition-opacity cursor-default">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
