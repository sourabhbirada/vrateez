'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { getCategoriesApi } from '@/lib/api/categoryApi';
import { useSettings } from '@/context/SettingsContext';
import type { Category } from '@/lib/api/types';

const DEFAULT_CATEGORIES = [
  { label: 'Cookies', href: '/shop?category=cookies' },
  { label: 'Infused Cookies', href: '/shop?category=infused-cookie' },
  { label: 'Energy on the Go', href: '/shop?category=energy-on-the-go' },
  { label: 'Savory Snacks', href: '/shop?category=savory-snacks' },
  { label: 'Wholesome Delights', href: '/shop?category=wholesome-delights' },
];

export default function Footer() {
  const { settings } = useSettings();
  const [categories, setCategories] = useState<Category[]>([]);

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

  const contact = settings?.contact;
  const social = settings?.socialMedia;
  const phone = contact?.phone || '+91-70700 88100';
  const email = contact?.supportEmail || 'support@vrateez.com';
  const address = contact?.address || 'Jaipur, Rajasthan, India';
  const phoneHref = `tel:${phone.replace(/\s+/g, '')}`;
  const emailHref = `mailto:${email}`;

  const shopLinks =
    categories.length > 0
      ? categories.map((c) => ({ label: c.name, href: `/shop?category=${c.slug}` }))
      : DEFAULT_CATEGORIES;

  const socialLinks = [
    { href: social?.instagram || 'https://instagram.com/vrateez', icon: Instagram, label: 'Instagram' },
    { href: social?.facebook || 'https://facebook.com/vrateez', icon: Facebook, label: 'Facebook' },
    { href: social?.twitter || 'https://twitter.com/vrateez', icon: Twitter, label: 'Twitter' },
    { href: social?.youtube || 'https://youtube.com/@vrateez', icon: Youtube, label: 'YouTube' },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="relative overflow-hidden bg-ink text-parchment">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-turmeric/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-millet/5 blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-turmeric/50 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 mb-14">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-parchment/10 ring-1 ring-parchment/15">
                <Image src="/logo.png" alt="Vrateez" fill className="object-contain p-1" />
              </div>
              <div>
                <p className="font-display italic text-2xl text-parchment leading-none group-hover:text-millet transition">
                  Vrateez
                </p>
                <p className="font-label text-[9px] tracking-[0.22em] text-millet/80 uppercase mt-1">
                  Nourish your fasting
                </p>
              </div>
            </Link>

            <p className="text-parchment/55 mb-7 max-w-sm text-sm leading-relaxed">
              Pure, clean-label, millet-based foods crafted with Vedic wisdom and modern nutritional science.
              Vrat-friendly. Always honest.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3 text-sm text-parchment/65">
                <span className="mt-0.5 w-8 h-8 rounded-full bg-parchment/8 border border-parchment/10 flex items-center justify-center shrink-0">
                  <MapPin size={14} className="text-millet" />
                </span>
                <span className="pt-1.5">{address}</span>
              </div>
              <a href={phoneHref} className="flex items-start gap-3 text-sm text-parchment/65 hover:text-millet transition">
                <span className="mt-0.5 w-8 h-8 rounded-full bg-parchment/8 border border-parchment/10 flex items-center justify-center shrink-0">
                  <Phone size={14} className="text-millet" />
                </span>
                <span className="pt-1.5">{phone}</span>
              </a>
              <a href={emailHref} className="flex items-start gap-3 text-sm text-parchment/65 hover:text-millet transition">
                <span className="mt-0.5 w-8 h-8 rounded-full bg-parchment/8 border border-parchment/10 flex items-center justify-center shrink-0">
                  <Mail size={14} className="text-millet" />
                </span>
                <span className="pt-1.5 break-all">{email}</span>
              </a>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-parchment/8 border border-parchment/10 flex items-center justify-center hover:bg-turmeric hover:border-turmeric hover:scale-105 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10">
            <div>
              <h4 className="font-label font-bold text-[10px] uppercase mb-5 text-millet tracking-[0.2em]">Shop</h4>
              <nav className="space-y-2.5">
                <Link href="/shop" className="group flex items-center gap-1 text-sm text-parchment/60 hover:text-parchment transition">
                  All Products
                  <ArrowUpRight size={12} className="opacity-0 -translate-y-0.5 group-hover:opacity-70 transition" />
                </Link>
                {shopLinks.map((cat) => (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    className="group flex items-center gap-1 text-sm text-parchment/60 hover:text-parchment transition"
                  >
                    {cat.label}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-0.5 group-hover:opacity-70 transition" />
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h4 className="font-label font-bold text-[10px] uppercase mb-5 text-millet tracking-[0.2em]">Company</h4>
              <nav className="space-y-2.5">
                {[
                  { href: '/about-us', label: 'About Us' },
                  { href: '/bulk-order', label: 'Bulk Orders' },
                  { href: '/faq', label: 'FAQ' },
                  { href: '/contact', label: 'Contact' },
                  { href: '/raksha-bandhan', label: 'Festive Offers' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-1 text-sm text-parchment/60 hover:text-parchment transition"
                  >
                    {item.label}
                    <ArrowUpRight size={12} className="opacity-0 -translate-y-0.5 group-hover:opacity-70 transition" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h4 className="font-label font-bold text-[10px] uppercase mb-5 text-millet tracking-[0.2em]">
                Why Vrateez
              </h4>
              <ul className="space-y-2.5 text-sm text-parchment/55">
                <li>Vrat friendly snacks</li>
                <li>Zero added sugar</li>
                <li>Millet-based nutrition</li>
                <li>No palm oil</li>
                <li>FSSAI certified</li>
              </ul>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 mt-6 bg-turmeric text-parchment px-4 py-2.5 rounded-full text-xs font-bold hover:bg-clay transition shadow-lg shadow-turmeric/20"
              >
                Shop now
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-parchment/10 pt-8">
          <p className="font-display text-5xl md:text-7xl text-center text-parchment/[0.06] tracking-[0.18em] select-none mb-6">
            VRATEEZ
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-parchment/35">
            <p>&copy; {new Date().getFullYear()} Vrateez Foods Pvt. Ltd. All rights reserved.</p>
            <p className="text-parchment/30">Handcrafted in {address}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
