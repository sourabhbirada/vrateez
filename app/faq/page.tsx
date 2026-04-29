'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqCategories = [
    {
        key: 'general',
        label: 'General',
        color: 'bg-orange-500',
    },
    {
        key: 'cookies',
        label: 'Protein Cookies',
        color: 'bg-amber-500',
    },
    {
        key: 'bars',
        label: 'Energy Bars',
        color: 'bg-emerald-500',
    },
    {
        key: 'nutrition',
        label: 'Nutrition & Ingredients',
        color: 'bg-rose-500',
    },
    {
        key: 'orders',
        label: 'Orders & Shipping',
        color: 'bg-blue-500',
    },
];

const faqs: Record<string, { question: string; answer: string }[]> = {
    general: [
        {
            question: 'What is Vrateez?',
            answer: 'Vrateez is a health-focused snack brand based in Jaipur, Rajasthan, offering high-protein cookies, energy bars, and superfood snacks. All our products are made with real ingredients, no added sugar, and are backed by nutritional science to give you the best of taste and health.',
        },
        {
            question: 'Are Vrateez products suitable for vegetarians?',
            answer: 'Yes! All our products are 100% vegetarian. We use whey protein concentrate derived from grass-fed sources. None of our products contain any meat, fish, or egg-derived ingredients.',
        },
        {
            question: 'Where are Vrateez products made?',
            answer: 'All Vrateez products are manufactured in FSSAI-certified facilities in Jaipur, Rajasthan, following strict quality control and hygiene standards. Every batch is tested for quality and nutritional accuracy.',
        },
        {
            question: 'Are your products certified?',
            answer: 'Yes. All products are FSSAI-approved and lab-tested. We maintain full transparency about our ingredient sourcing and nutritional claims.',
        },
    ],
    cookies: [
        {
            question: 'How much protein is in each cookie?',
            answer: 'Each Vrateez protein cookie contains 10g of high-quality whey protein. This makes them an excellent protein-rich snack for between meals, pre-workout fuel, or a healthy dessert replacement.',
        },
        {
            question: 'Do protein cookies taste like regular cookies?',
            answer: 'Absolutely! Our cookies are designed to taste like premium dessert cookies, not protein supplements. Customers consistently say they can\'t believe they\'re eating a protein cookie. We use real nuts, fruits, and natural flavours for authentic taste.',
        },
        {
            question: 'What flavours of protein cookies are available?',
            answer: 'We offer six delicious flavours: Almond, Blueberry, Cashew, Coconut, Cranberry, and Walnut. We also have an Assorted Cookie Box that includes a mix of all flavours — perfect for gifting or trying everything.',
        },
        {
            question: 'How should I store the cookies?',
            answer: 'Store in a cool, dry place away from direct sunlight. Once opened, consume within 5 days for best freshness. The cookies have a shelf life of 6 months from the date of manufacture when unopened.',
        },
        {
            question: 'Are the cookies gluten-free?',
            answer: 'Our cookies contain oat flour as a primary ingredient, so they are not certified gluten-free. However, they do not contain wheat or refined flour (maida). If you have celiac disease, please consult your doctor before consuming.',
        },
    ],
    bars: [
        {
            question: 'How much protein is in each energy bar?',
            answer: 'Each Vrateez energy bar contains 21g of grass-fed whey protein isolate — one of the highest protein-per-bar ratios in the market. This makes it perfect for post-workout recovery or a meal replacement snack.',
        },
        {
            question: 'When is the best time to eat a protein bar?',
            answer: 'Protein bars are incredibly versatile. They\'re great as a post-workout recovery snack (within 30 minutes of exercising), a mid-afternoon energy boost, a meal replacement when you\'re busy, or a healthy dessert after dinner.',
        },
        {
            question: 'Do energy bars have artificial sweeteners?',
            answer: 'No. We use a small amount of honey for binding and natural sweetness, along with stevia for additional sweetness without calories. Our bars contain zero artificial sweeteners, colours, or preservatives.',
        },
        {
            question: 'Can I eat protein bars every day?',
            answer: 'Yes! Our bars are made with whole food ingredients and can be consumed daily as part of a balanced diet. They\'re a healthier alternative to traditional snack bars, biscuits, or chocolate. However, they should complement a varied diet, not replace whole meals entirely.',
        },
    ],
    nutrition: [
        {
            question: 'What is whey protein and why do you use it?',
            answer: 'Whey protein is a complete protein derived from milk during the cheese-making process. It contains all 9 essential amino acids and is quickly absorbed by the body. We use grass-fed whey protein concentrate and isolate because they offer the best bioavailability and amino acid profile for muscle recovery and overall health.',
        },
        {
            question: 'Are your products really zero added sugar?',
            answer: 'Yes. Our cookies have absolutely zero added sugar. We use stevia, a natural plant-based sweetener, to provide sweetness without the calories or blood sugar spikes. Our energy bars use a minimal amount of honey (a natural sugar) for binding purposes, which is listed transparently in our ingredients.',
        },
        {
            question: 'How many calories are in each product?',
            answer: 'Protein Cookies: approximately 145-162 kcal per cookie depending on flavour. Energy Bars: approximately 220 kcal per bar. Desert Date Drops: approximately 130 kcal per serving. All products are designed to be nutrient-dense while keeping calorie count reasonable.',
        },
        {
            question: 'Do your products contain any allergens?',
            answer: 'Our products contain milk (whey protein) and tree nuts (almonds, cashews, walnuts, coconut depending on the flavour). They are produced in a facility that also processes peanuts, soy, and sesame. Always check the specific product label if you have allergies.',
        },
        {
            question: 'Are your products keto-friendly?',
            answer: 'While our cookies and bars are low in sugar, they contain oats and other carbohydrate sources, so they are not strictly keto-friendly. However, they are excellent for a moderate-carb, high-protein diet. Each cookie has approximately 12-15g of carbs.',
        },
    ],
    orders: [
        {
            question: 'How do I place a bulk order?',
            answer: 'Visit our Bulk Orders page and fill out the inquiry form. Whether you\'re a café, gym, retail store, or corporate entity looking for gifting options, our team will get back to you within 24 hours with custom pricing and delivery details.',
        },
        {
            question: 'What is the shipping time?',
            answer: 'Orders are processed within 24 hours and typically delivered within 3-5 business days across India. Metro cities often receive delivery in 2-3 days. We partner with trusted logistics providers to ensure your snacks arrive fresh.',
        },
        {
            question: 'Is there free shipping?',
            answer: 'Yes! We offer free shipping on all orders above ₹499. Orders below ₹499 have a flat shipping fee of ₹49.',
        },
        {
            question: 'What is your return policy?',
            answer: 'We accept returns within 7 days of delivery if the product is damaged or defective. Since these are food products, we cannot accept returns for change of mind. Please contact us at vrateezfoodspvtltd@gmail.com with photos of any issues and we\'ll resolve it quickly.',
        },
        {
            question: 'Can I track my order?',
            answer: 'Yes. Once your order is shipped, you\'ll receive an email and SMS with tracking details. You can track your order status in real-time using the link provided.',
        },
    ],
};

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
    const [activeCategory, setActiveCategory] = useState('general');

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

                {/* Category tabs */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {faqCategories.map(cat => (
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
                    {faqs[activeCategory]?.map((faq, i) => (
                        <AccordionItem key={i} question={faq.question} answer={faq.answer} />
                    ))}
                </div>

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
