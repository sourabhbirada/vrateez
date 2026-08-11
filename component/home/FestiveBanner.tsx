'use client';

import Link from 'next/link';
import { Gift, Heart, Sparkles, ShoppingBag } from 'lucide-react';

interface FestiveOffer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  items: string[];
  price: number;
  originalPrice?: number;
  link: string;
  bgGradient: string;
  textColor: string;
  icon: 'gift' | 'heart' | 'sparkles';
  active: boolean;
}

const festiveOffers: FestiveOffer[] = [
  {
    id: 'raksha-bandhan-2026',
    title: 'Raksha Bandhan Special 🎁',
    subtitle: 'Endless Siblings Love in Every Bite',
    description: 'To health and happiness, Vrateez brings you endless siblings love wrapped in delicious treats.',
    items: [
      '1 Energy bar 🍫',
      '2 Multigrain coconut cookies 🍪',
      '2 Multigrain dry fruit cookies 🍪',
      '40gm Millet Crunchy bites',
      'Rakhi 📿',
      'Roli chawal',
    ],
    price: 379,
    originalPrice: 499,
    link: '/shop?category=festive-hampers',
    bgGradient: 'from-orange-50 via-pink-50 to-purple-50',
    textColor: 'text-orange-900',
    icon: 'gift',
    active: true,
  },
];

const icons = {
  gift: Gift,
  heart: Heart,
  sparkles: Sparkles,
};

export default function FestiveBanner() {
  const activeOffer = festiveOffers.find(offer => offer.active);

  if (!activeOffer) return null;

  const Icon = icons[activeOffer.icon];

  return (
    <section className={`relative py-16 md:py-20 bg-gradient-to-br ${activeOffer.bgGradient} overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-200/30 to-orange-200/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6 border border-orange-200">
              <Sparkles size={16} className="text-orange-500" />
              <span className="text-sm font-bold text-orange-600 uppercase tracking-wide">
                Limited Time Offer
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display italic text-4xl md:text-5xl lg:text-6xl text-ink mb-4">
              {activeOffer.title}
            </h2>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl font-medium text-orange-800 mb-6">
              {activeOffer.subtitle}
            </p>

            {/* Description */}
            <p className="text-ink/70 text-lg mb-8 leading-relaxed">
              {activeOffer.description}
            </p>

            {/* Price */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-orange-600">
                  ₹{activeOffer.price}
                </span>
                {activeOffer.originalPrice && (
                  <span className="text-2xl text-ink/40 line-through">
                    ₹{activeOffer.originalPrice}
                  </span>
                )}
              </div>
              {activeOffer.originalPrice && (
                <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  Save ₹{activeOffer.originalPrice - activeOffer.price}
                </span>
              )}
            </div>

            {/* CTA */}
            <Link
              href={activeOffer.link}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ShoppingBag size={22} />
              Order Now
            </Link>

            <p className="text-sm text-ink/50 mt-4">
              🚚 Free shipping on orders above ₹499
            </p>
          </div>

          {/* Right: What's Inside Box */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-orange-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="font-display italic text-2xl text-ink">
                What's Inside?
              </h3>
            </div>

            <ul className="space-y-4">
              {activeOffer.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-ink/80 text-lg leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Special message */}
            <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border border-orange-200">
              <p className="text-center text-sm text-ink/70 font-medium flex items-center justify-center gap-2">
                <Heart size={16} className="text-pink-500" />
                Perfect gift for your beloved siblings
                <Heart size={16} className="text-pink-500" />
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
