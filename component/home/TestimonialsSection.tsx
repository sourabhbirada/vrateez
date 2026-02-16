'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'Priya Sharma',
        role: 'Fitness Coach, Mumbai',
        text: 'I recommend Vrateez cookies to all my clients. 10g protein with zero added sugar? It\'s the real deal. My clients love the Blueberry flavour!',
        rating: 5,
        avatar: 'PS',
        color: 'bg-rose-500',
    },
    {
        name: 'Arjun Menon',
        role: 'Software Engineer, Bangalore',
        text: 'Finally a protein snack that doesn\'t taste like cardboard. The energy bars are my go-to 4pm snack. Keeps me going through those long coding sessions.',
        rating: 5,
        avatar: 'AM',
        color: 'bg-blue-500',
    },
    {
        name: 'Neha Patel',
        role: 'Nutritionist, Ahmedabad',
        text: 'Clean ingredients, no fillers, real nuts and fruits. As a nutritionist, I can confidently say these are one of the best protein snacks in India right now.',
        rating: 5,
        avatar: 'NP',
        color: 'bg-emerald-500',
    },
    {
        name: 'Rohit Kumar',
        role: 'Gym Owner, Delhi',
        text: 'We stock Vrateez bars at our gym counter. They fly off the shelves! The Assorted Cookie Box is our top-selling gift item during festivals.',
        rating: 5,
        avatar: 'RK',
        color: 'bg-amber-500',
    },
];

export default function TestimonialsSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                        LOVED BY THOUSANDS
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto">
                        Join the growing community of health-conscious snackers who&apos;ve made the switch.
                    </p>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
                    {[
                        { value: '10,000+', label: 'Happy Customers' },
                        { value: '4.8 ★', label: 'Average Rating' },
                        { value: '50,000+', label: 'Snacks Sold' },
                        { value: '100%', label: 'Natural Ingredients' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                            <div className="text-2xl md:text-3xl font-extrabold text-gray-900">{stat.value}</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase font-medium tracking-wide">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Testimonial cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((t, i) => (
                        <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <Quote size={24} className="text-orange-300 mb-4" />
                            <p className="text-gray-700 leading-relaxed mb-6">&quot;{t.text}&quot;</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${t.color} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{t.name}</p>
                                        <p className="text-xs text-gray-500">{t.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-0.5">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
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
