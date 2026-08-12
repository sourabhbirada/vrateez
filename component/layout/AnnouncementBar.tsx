'use client';

import Link from 'next/link';
import { Truck } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function AnnouncementBar() {
  const { settings, loading } = useSettings();

  if (loading) return null;

  const bar = settings?.announcementBar;
  const enabled = bar?.enabled !== false;
  if (!enabled) return null;

  const threshold = settings?.shipping?.freeShippingThreshold ?? 499;
  const text =
    bar?.text?.trim() ||
    `Free delivery on orders above ₹${threshold} · Pan-India shipping`;
  const href = bar?.link?.trim() || '/shop';
  const bg = bar?.bgColor || '#241F16';
  const color = bar?.textColor || '#F3EAD8';

  return (
    <div
      className="relative z-40 w-full text-center text-[11px] sm:text-xs font-medium tracking-wide"
      style={{ backgroundColor: bg, color }}
    >
      <Link
        href={href}
        className="flex items-center justify-center gap-2 px-4 py-2 hover:opacity-90 transition"
      >
        <Truck size={13} className="shrink-0 opacity-80" />
        <span className="leading-none">{text}</span>
      </Link>
    </div>
  );
}
