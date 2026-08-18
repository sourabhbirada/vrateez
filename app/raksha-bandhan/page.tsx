'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Minus, Package, Plus, Shield, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import { getDealsApi } from '@/lib/api/dealApi';
import { getProductBySlugApi } from '@/lib/api/productApi';
import type { Deal, Product } from '@/lib/api/types';

const FALLBACK_LANDING_DEAL: Deal = {
  _id: 'fallback-rakhi-landing',
  title: 'Raksha Bandhan Gift Hamper',
  subtitle: 'Celebrate the bond of love with a healthy gift!',
  description:
    'To health and happiness, Vrateez brings you endless siblings love wrapped in delicious treats. Each hamper includes energy bars, cookies, millet bites, Rakhi & Roli Chawal.',
  badge: 'LIMITED TIME OFFER',
  cta: 'Order Now',
  ctaLink: '/product/raksha-bandhan-gift-hamper',
  image: '/rakhsbandhangift.png',
  video: '/rakhevideo.mp4',
  price: 379,
  originalPrice: 499,
  items: [
    'Energy Bar',
    'Coconut Cookies',
    'Dry Fruit Cookies',
    'Millet Bites',
    'Rakhi',
    'Roli & Chawal',
  ],
  productSlug: 'raksha-bandhan-gift-hamper',
  placement: 'landing',
  bgFrom: '#FFF5E6',
  bgTo: '#FFE8CC',
  isActive: true,
  position: 1,
};

export default function RakshaBandhanPage() {
  const [quantity, setQuantity] = useState(1);
  const [deal, setDeal] = useState<Deal | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleCart } = useCart();
  const { settings } = useSettings();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const deals = await getDealsApi('landing');
        const active = deals[0] || FALLBACK_LANDING_DEAL;
        if (cancelled) return;
        setDeal(active);
        if (active?.productSlug) {
          try {
            const p = await getProductBySlugApi(active.productSlug);
            if (!cancelled) setProduct(p);
          } catch {
            if (!cancelled) setProduct(null);
          }
        }
      } catch {
        if (!cancelled) setDeal(FALLBACK_LANDING_DEAL);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price: product.price,
        originalPrice: product.originalPrice,
        weight: product.weight,
        quantity,
        freeDelivery: product.freeDelivery,
      });
      toggleCart();
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-ink flex items-center justify-center">
        <p className="text-parchment/50 text-sm font-label tracking-widest uppercase">Loading offer…</p>
      </main>
    );
  }

  if (!deal) {
    return (
      <main className="min-h-screen bg-ink flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-parchment/70">No festive landing deal is active right now.</p>
        <Link href="/shop" className="text-millet font-semibold underline underline-offset-4">
          Browse shop
        </Link>
      </main>
    );
  }

  const price = product?.price ?? deal.price;
  const originalPrice = product?.originalPrice ?? deal.originalPrice;
  const savings = originalPrice > price ? originalPrice - price : 0;
  const freeShip = settings?.shipping?.freeShippingThreshold ?? 499;
  const ctaHref = deal.productSlug
    ? `/product/${deal.productSlug}`
    : deal.ctaLink || '/shop';

  return (
    <main className="min-h-screen bg-ink text-parchment">
      <section className="relative h-[42vh] md:h-[52vh] overflow-hidden">
        {deal.image ? (
          <Image src={deal.image} alt={deal.title} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-basil" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/55 to-ink/20" />
        <div className="absolute inset-0 grain-overlay opacity-[0.06] mix-blend-overlay" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-10 md:pb-14">
          <div className="max-w-7xl mx-auto">
            {deal.badge ? (
              <span className="inline-flex mb-4 font-label text-[10px] tracking-[0.22em] uppercase text-millet border border-millet/35 px-3 py-1.5">
                {deal.badge}
              </span>
            ) : null}
            <h1 className="font-display italic text-4xl md:text-6xl leading-[1.05] tracking-[-0.01em] max-w-3xl">
              {deal.title}
            </h1>
            {deal.subtitle ? (
              <p className="mt-3 text-base md:text-lg text-parchment/65 max-w-xl">{deal.subtitle}</p>
            ) : null}
          </div>
        </div>
      </section>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          aria-hidden="true"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 30%, #E4A93D 0%, transparent 40%), radial-gradient(circle at 90% 80%, #C4711F 0%, transparent 35%)',
          }}
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-6">
            <div className="relative aspect-video overflow-hidden rounded-sm ring-1 ring-parchment/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)] bg-basil">
              {deal.video ? (
                <video
                  controls
                  loop
                  playsInline
                  poster={deal.image || undefined}
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src={deal.video} type="video/mp4" />
                </video>
              ) : deal.image ? (
                <Image src={deal.image} alt={deal.title} fill className="object-cover" />
              ) : null}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Package, label: 'Premium packaging' },
                { icon: Truck, label: 'Fast delivery' },
                { icon: Shield, label: '100% authentic' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 py-4 px-2 text-center ring-1 ring-parchment/10 bg-parchment/[0.03]"
                >
                  <Icon className="w-5 h-5 text-millet" strokeWidth={1.75} />
                  <p className="font-label text-[9px] tracking-[0.12em] uppercase text-parchment/55 leading-snug">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {deal.description ? (
              <p className="text-[15px] text-parchment/60 leading-relaxed">{deal.description}</p>
            ) : null}

            {deal.items?.length > 0 ? (
              <div>
                <p className="font-label text-[10px] tracking-[0.18em] uppercase text-millet/80 mb-4">
                  Includes
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {deal.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm text-parchment/80">
                      <Check size={14} className="shrink-0 text-millet" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="border-t border-parchment/10 pt-6 space-y-6">
              {price > 0 ? (
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-4xl md:text-5xl text-millet leading-none">₹{price}</span>
                    {originalPrice > price ? (
                      <span className="text-lg text-parchment/35 line-through">₹{originalPrice}</span>
                    ) : null}
                  </div>
                  {savings > 0 ? (
                    <span className="mb-1 font-label text-[10px] tracking-[0.14em] uppercase bg-basil text-parchment px-3 py-1.5 ring-1 ring-parchment/10">
                      Save ₹{savings}
                    </span>
                  ) : null}
                </div>
              ) : null}

              {product ? (
                <>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="font-label text-[10px] tracking-[0.16em] uppercase text-parchment/45">
                      Quantity
                    </span>
                    <div className="inline-flex items-center ring-1 ring-parchment/20">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-parchment/70 hover:bg-parchment/10 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-12 text-center font-semibold text-parchment">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-parchment/70 hover:bg-parchment/10 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-sm text-parchment/50">
                      Total <span className="text-millet font-semibold">₹{price * quantity}</span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="group inline-flex items-center gap-2.5 bg-turmeric text-parchment px-7 py-3.5 font-semibold text-sm shadow-md shadow-turmeric/20 transition-all duration-200 hover:bg-clay"
                  >
                    Add to Cart
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                </>
              ) : (
                <Link
                  href={ctaHref}
                  className="group inline-flex items-center gap-2.5 bg-turmeric text-parchment px-7 py-3.5 font-semibold text-sm shadow-md shadow-turmeric/20 transition-all duration-200 hover:bg-clay"
                >
                  {deal.cta || 'View offer'}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}

              <p className="text-sm text-parchment/45 flex items-center gap-2">
                <Check size={14} className="text-millet" strokeWidth={2.5} />
                Free shipping on orders above ₹{freeShip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
