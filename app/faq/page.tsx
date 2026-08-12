'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getFaqsApi } from '@/lib/api/faqApi';
import type { Faq } from '@/lib/api/types';
import { useSettings, whatsappLink } from '@/context/SettingsContext';

// Brand-adjacent variants used to distinguish category tabs — not semantic status colors.
const CATEGORY_COLORS = [
    'bg-turmeric',
    'bg-basil',
    'bg-clay',
    'bg-ink',
    'bg-millet text-ink',
];

function AccordionItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border border-ink/10 rounded-2xl overflow-hidden transition-all bg-white/50">
            <button
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between px-6 py-5 text-left transition-colors ${open ? 'bg-turmeric/8' : 'hover:bg-ink/5'}`}
            >
                <span className="font-bold text-ink text-sm md:text-base pr-4">{question}</span>
                {open ? <ChevronUp size={20} className="text-turmeric flex-shrink-0" /> : <ChevronDown size={20} className="text-ink/30 flex-shrink-0" />}
            </button>
            {open && (
                <div className="px-6 pb-5 pt-0 text-sm md:text-base text-ink/60 leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    );
}

export default function FaqPage() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const { settings } = useSettings();
    const wa = whatsappLink(settings?.contact?.whatsapp);
    const email = settings?.contact?.supportEmail;

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
        <main className="bg-parchment min-h-screen">
            {/* Hero Banner */}
            <section className="relative bg-ink py-20 overflow-hidden">
                <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-[0.06]">
                    <span className="font-display text-[200px] text-parchment">?</span>
                </div>
                <div className="max-w-4xl mx-auto px-8 relative z-10">
                    <p className="font-label text-[10px] tracking-[0.25em] text-millet uppercase mb-4">Support</p>
                    <h1 className="font-display italic text-4xl md:text-6xl text-parchment mb-3">FAQ&apos;s</h1>
                    <p className="text-lg text-parchment/60">Everything you need to know about Vrateez protein snacks</p>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-8 py-16">
                <h2 className="font-display italic text-3xl text-ink mb-8">Frequently Asked Questions</h2>

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
                                            ? `${cat.color} text-parchment shadow-lg scale-105`
                                            : 'bg-ink/5 text-ink/70 hover:bg-ink/10'
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
                    <div className="text-center py-16 text-ink/40">No FAQs available right now.</div>
                )}

                {/* CTA */}
                <div className="mt-16 bg-ink rounded-3xl p-10 text-center">
                    <h3 className="font-display italic text-2xl text-parchment mb-3">Still have questions?</h3>
                    <p className="text-parchment/50 mb-6">We&apos;re happy to help. Reach out to us anytime.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {email ? (
                            <a
                                href={`mailto:${email}`}
                                className="bg-turmeric text-parchment px-8 py-3 rounded-full font-bold text-sm hover:bg-clay transition"
                            >
                                Email us
                            </a>
                        ) : null}
                        {wa ? (
                            <a
                                href={wa}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-basil text-parchment px-8 py-3 rounded-full font-bold text-sm hover:bg-basil/80 transition"
                            >
                                WhatsApp
                            </a>
                        ) : null}
                    </div>
                </div>
            </section>
        </main>
    );
}