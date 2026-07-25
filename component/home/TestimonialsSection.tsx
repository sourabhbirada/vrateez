'use client';

import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
    {
        name: 'Priya Sharma',
        role: 'Fitness Coach, Mumbai',
        text: 'I recommend Vrateez to all my clients. Pure ingredients, vrat-friendly, and actually delicious. The Blueberry infused cookies are a staple now.',
        rating: 5,
        avatar: 'PS',
    },
    {
        name: 'Arjun Menon',
        role: 'Software Engineer, Bangalore',
        text: 'Finally a healthy snack that doesn\'t taste like cardboard. The energy bars are my go-to between long work sessions — clean energy, no crash.',
        rating: 5,
        avatar: 'AM',
    },
    {
        name: 'Neha Patel',
        role: 'Nutritionist, Ahmedabad',
        text: 'As a nutritionist, I appreciate the clean-label approach. Millet-based, no palm oil, no artificial fillers — I confidently recommend Vrateez to my clients.',
        rating: 5,
        avatar: 'NP',
    },
    {
        name: 'Rohit Kumar',
        role: 'Gym Owner, Delhi',
        text: 'We stock Vrateez at our counter and they fly off the shelves. The sama upma is a hit with our early-morning members too. Great brand.',
        rating: 5,
        avatar: 'RK',
    },
];

export default function TestimonialsSection() {
    return (
        <section className="py-20 bg-parchment">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-12">
                    <p className="font-label text-[11px] tracking-[0.25em] text-clay uppercase mb-3">Reviews</p>
                    <h2 className="font-display italic text-3xl md:text-4xl text-ink mb-3 tracking-tight">
                        Loved by Thousands
                    </h2>
                    <p className="text-ink/50 max-w-md mx-auto text-sm leading-relaxed">
                        Join the growing community of health-conscious families who&apos;ve made Vrateez part of their daily routine.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {TESTIMONIALS.map((t) => (
                        <div key={t.name} className="bg-white/60 rounded-2xl p-7 border border-ink/10 shadow-sm hover:shadow-md hover:border-turmeric/30 transition-all">
                            <Quote size={20} className="text-turmeric/50 mb-4" />
                            <p className="text-ink/70 leading-relaxed mb-6 text-sm">&quot;{t.text}&quot;</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-basil text-parchment rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-ink">{t.name}</p>
                                        <p className="text-xs text-ink/40">{t.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <Star key={j} size={13} className="fill-millet text-millet" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}