'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Priya Sharma',
        role: 'Fitness Coach, Mumbai',
        text: 'I recommend Vrateez to all my clients. Pure ingredients, vrat-friendly, and actually delicious. The Blueberry infused cookies are a staple now.',
        rating: 5,
        avatar: 'PS',
        color: 'bg-rose-500',
    },
    {
        name: 'Arjun Menon',
        role: 'Software Engineer, Bangalore',
        text: 'Finally a healthy snack that doesn\'t taste like cardboard. The energy bars are my go-to between long work sessions — clean energy, no crash.',
        rating: 5,
        avatar: 'AM',
        color: 'bg-blue-500',
    },
    {
        name: 'Neha Patel',
        role: 'Nutritionist, Ahmedabad',
        text: 'As a nutritionist, I appreciate the clean-label approach. Millet-based, no palm oil, no artificial fillers — I confidently recommend Vrateez to my clients.',
        rating: 5,
        avatar: 'NP',
        color: 'bg-emerald-500',
    },
    {
        name: 'Rohit Kumar',
        role: 'Gym Owner, Delhi',
        text: 'We stock Vrateez at our counter and they fly off the shelves. The sama upma is a hit with our early-morning members too. Great brand.',
        rating: 5,
        avatar: 'RK',
        color: 'bg-amber-500',
    },
];

const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '4.8 ★', label: 'Average Rating' },
    { value: '50,000+', label: 'Snacks Sold' },
    { value: '100%', label: 'Natural Ingredients' },
];

export default function TestimonialsSection() {
    return (
        <section className="py-20 bg-stone-50">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-12">
                    <p className="text-[11px] font-semibold tracking-[0.25em] text-amber-700 uppercase mb-3">Reviews</p>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-3 tracking-tight">
                        Loved by Thousands
                    </h2>
                    <p className="text-stone-500 max-w-md mx-auto text-sm">
                        Join the growing community of health-conscious families who've made Vrateez part of their daily routine.
                    </p>
                </div>

                {/* Stats */}
                {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white rounded-xl p-5 text-center border border-stone-100 shadow-sm">
                            <div className="text-2xl md:text-3xl font-extrabold text-stone-900 mb-1">{s.value}</div>
                            <div className="text-[10px] text-stone-400 uppercase font-semibold tracking-widest">{s.label}</div>
                        </div>
                    ))}
                </div> */}

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                            <Quote size={20} className="text-amber-300 mb-4" />
                            <p className="text-stone-600 leading-relaxed mb-6 text-sm">&quot;{t.text}&quot;</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 ${t.color} text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-stone-900">{t.name}</p>
                                        <p className="text-xs text-stone-400">{t.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <Star key={j} size={13} className="fill-yellow-400 text-yellow-400" />
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