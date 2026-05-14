'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getFaqsApi } from '@/lib/api/faqApi';
import type { Faq } from '@/lib/api/types';

const CATEGORY_COLORS = [
    'bg-orange-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-rose-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-lime-500',
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden transition-all">
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between px-6 py-5 text-left transition-colors ${open ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
            >
                <span className="font-bold text-gray-900 text-sm md:text-base pr-4">{question}</span>
                {open ? <ChevronUp size={20} className="text-orange-500 flex-shrink-0" /> : <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />}
            </button>
            {open && (
                <div className="px-6 pb-5 pt-0 text-sm md:text-base text-gray-600 leading-relaxed animate-fadeIn">
                    {answer}
                </div>
            )}
        </div>
    );
}

export default function FaqPage() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('');

    useEffect(() => {
        async function loadFaqs() {
            try {
                const items = await getFaqsApi();
                const ordered = [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
                setFaqs(ordered);
                if (ordered.length) {
                    setActiveCategory(ordered[0].category);
                }
            } catch {
                setFaqs([]);
                setActiveCategory('');
            }
        }

        void loadFaqs();
    }, []);

    const categories = useMemo(() => {
        const seen = new Set<string>();
        const result: Array<{ key: string; label: string; color: string }> = [];
        faqs.forEach((faq) => {
            if (!seen.has(faq.category)) {
                seen.add(faq.category);
                const color = CATEGORY_COLORS[result.length % CATEGORY_COLORS.length];
                result.push({ key: faq.category, label: faq.category, color });
            }
        });
        return result;
    }, [faqs]);

    const filtered = faqs.filter((faq) => faq.category === activeCategory);

    return (
        <main className="bg-white min-h-screen">
            {/* Hero Banner */}
            <section className="relative bg-gradient-to-br from-yellow-400 to-amber-500 py-20 overflow-hidden">
                <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20">
                    <span className="text-[200px] font-black text-amber-800">?</span>
                </div>
                <div className="max-w-4xl mx-auto px-8 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-amber-900 mb-3">FAQ&apos;s</h1>
                    <p className="text-lg text-amber-800">Everything you need to know about Vrateez protein snacks</p>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-8 py-16">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Frequently Asked Questions</h2>

                {categories.length ? (
                    <>
                        {/* Category tabs */}
                        <div className="flex flex-wrap gap-3 mb-10">
                            {categories.map((cat) => (
                                <button
                                    key={cat.key}
                                    onClick={() => setActiveCategory(cat.key)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                                        activeCategory === cat.key
                                            ? `${cat.color} text-white shadow-lg scale-105`
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Accordion list */}
                        <div className="space-y-3">
                            {filtered.map((faq) => (
                                <AccordionItem key={faq._id} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16 text-gray-500">No FAQs available right now.</div>
                )}

                {/* CTA */}
                <div className="mt-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 text-center">
                    <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
                    <p className="text-gray-400 mb-6">We&apos;re happy to help. Reach out to us anytime.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="mailto:support@virteez.com"
                            className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-orange-600 transition"
                        >
                            EMAIL US
                        </a>
                        <a
                            href="https://wa.me/919407230914"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-green-600 transition"
                        >
                            WHATSAPP
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
