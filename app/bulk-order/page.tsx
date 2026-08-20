'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Send, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

const WHY_PARTNER = [
    'Custom pricing for bulk orders',
    'Dedicated account manager',
    'Custom packaging & branding',
    'Pan-India delivery',
    '30-day payment terms available',
    'Marketing support & POS materials',
    '100% vrat-friendly products',
    'In-house manufacturing — full quality control',
];

export default function BulkOrderPage() {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
    const BULK_ORDER_URL = `${API_BASE_URL}/bulk-order`;

    const [formData, setFormData] = useState({
        companyName: '',
        yourName: '',
        phone: '',
        email: '',
        location: '',
        inquiryType: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');
        try {
            const response = await fetch(BULK_ORDER_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = (await response.json()) as { message?: string };
            if (!response.ok) throw new Error(data.message || 'Unable to submit your inquiry right now.');
            setSubmitted(true);
            setFormData({ companyName: '', yourName: '', phone: '', email: '', location: '', inquiryType: '', message: '' });
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-parchment min-h-screen">

            {/* ─── Hero ─── */}
            <section className="relative overflow-hidden bg-ink text-parchment pt-24 pb-20 px-6">
                {/* Background image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://vrateez.s3.ap-south-1.amazonaws.com/Assorted+cookie+box.jpeg"
                        alt="Vrateez bulk order"
                        fill
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-ink/95 via-ink/80 to-ink/60" />
                </div>

                <div className="relative max-w-5xl mx-auto">
                    <p className="font-label text-[10px] tracking-[0.25em] text-millet uppercase mb-4">
                        Partner with Vrateez
                    </p>
                    <h1 className="font-display italic text-4xl md:text-6xl leading-tight tracking-tight mb-5 max-w-2xl">
                        Bulk &amp; Special Orders
                    </h1>
                </div>
            </section>

            {/* ─── Form + Sidebar ─── */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                    {/* Form */}
                    <div className="lg:col-span-3">
                        <h2 className="font-display italic text-2xl text-ink mb-1 tracking-tight">Send an Inquiry</h2>
                        <p className="text-sm text-ink/50 mb-7">
                            Drop your details and we&apos;ll get back to you within 24 hours with custom pricing. You can also reach us directly via WhatsApp or email.
                        </p>

                        <div className="bg-white/70 rounded-2xl border border-ink/10 p-7 shadow-sm">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-basil/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-basil/20">
                                        <CheckCircle2 size={28} className="text-basil" />
                                    </div>
                                    <h3 className="font-display italic text-xl text-ink mb-2">Inquiry Submitted!</h3>
                                    <p className="text-ink/50 text-sm max-w-xs mx-auto">
                                        We&apos;ll get back to you within 24 hours with custom pricing and details.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-6 text-turmeric font-semibold hover:underline text-sm"
                                    >
                                        Submit another inquiry
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Field label="Company Name">
                                            <input
                                                type="text" name="companyName" value={formData.companyName}
                                                onChange={handleChange} placeholder="Acme Corp"
                                                className={inputCls}
                                            />
                                        </Field>
                                        <Field label="Your Name *">
                                            <input
                                                type="text" name="yourName" value={formData.yourName}
                                                onChange={handleChange} placeholder="Your full name"
                                                required className={inputCls}
                                            />
                                        </Field>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Field label="Phone *">
                                            <input
                                                type="tel" name="phone" value={formData.phone}
                                                onChange={handleChange} placeholder="+91 99999 99999"
                                                required className={inputCls}
                                            />
                                        </Field>
                                        <Field label="Email *">
                                            <input
                                                type="email" name="email" value={formData.email}
                                                onChange={handleChange} placeholder="you@company.com"
                                                required className={inputCls}
                                            />
                                        </Field>
                                    </div>

                                    <Field label="Location">
                                        <input
                                            type="text" name="location" value={formData.location}
                                            onChange={handleChange} placeholder="City, State"
                                            className={inputCls}
                                        />
                                    </Field>

                                    <Field label="Inquiry Type *">
                                        <select
                                            name="inquiryType" value={formData.inquiryType}
                                            onChange={handleChange} required
                                            className={inputCls + ' bg-white'}
                                        >
                                            <option value="">Please select</option>
                                            <option value="retail">Retail Store Stocking</option>
                                            <option value="cafe">Café / Restaurant</option>
                                            <option value="gifting">Corporate Gifting</option>
                                            <option value="gym">Gym / Fitness Studio</option>
                                            <option value="distributor">Distributor / Wholesale</option>
                                            <option value="wellness">Wellness / Clinic</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </Field>

                                    <Field label="Message (optional)">
                                        <textarea
                                            name="message" value={formData.message}
                                            onChange={handleChange} rows={3}
                                            placeholder="Tell us about your requirements, estimated quantity, preferred products..."
                                            className={inputCls + ' resize-none'}
                                        />
                                    </Field>

                                    <button
                                        type="submit" disabled={isSubmitting}
                                        className="w-full bg-ink hover:bg-turmeric text-parchment py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 mt-2"
                                    >
                                        <Send size={15} />
                                        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                                    </button>

                                    {submitError && (
                                        <p className="text-sm text-clay text-center">{submitError}</p>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Contact card */}
                        <div className="bg-ink text-parchment rounded-2xl p-7">
                            <h3 className="font-display italic text-lg mb-5">Contact Us Directly</h3>
                            <div className="space-y-4">
                                <ContactRow icon={<Phone size={15} className="text-millet" />} label="Phone">
                                    <a href="tel:+919407230914" className="text-sm text-parchment hover:text-millet transition">
                                        +91 94072 30914
                                    </a>
                                </ContactRow>
                                <ContactRow icon={<Mail size={15} className="text-millet" />} label="Email">
                                    <a href="mailto:vrateezfoodspvtltd@gmail.com" className="text-sm text-parchment hover:text-millet transition">
                                        vrateezfoodspvtltd@gmail.com
                                    </a>
                                </ContactRow>
                                <ContactRow icon={<MapPin size={15} className="text-millet" />} label="Address">
                                    <p className="text-sm text-parchment/60">Jaipur, Rajasthan, India</p>
                                </ContactRow>
                            </div>
                        </div>

                        {/* Why partner */}
                        <div className="bg-turmeric/8 border border-turmeric/20 rounded-2xl p-7">
                            <h3 className="font-display italic text-lg text-ink mb-1">Why Partner with Vrateez?</h3>
                            <p className="text-xs text-ink/50 mb-5 leading-relaxed">
                                A brand born out of responsibility — pure ingredients, honest preparation, nourishing in every sense.
                            </p>
                            <ul className="space-y-2.5">
                                {WHY_PARTNER.map((item) => (
                                    <li key={item} className="flex items-start gap-2.5 text-sm text-ink/70">
                                        <span className="text-turmeric font-bold mt-0.5 shrink-0">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

// ─── Helpers ───────────────────────────────────────────────────────────────
const inputCls = 'w-full px-4 py-2.5 border border-ink/15 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-turmeric/40 focus:border-turmeric transition bg-white/70 text-ink';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-[11px] font-semibold text-ink/40 uppercase tracking-wider mb-1.5">{label}</label>
            {children}
        </div>
    );
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">{icon}</div>
            <div>
                <p className="text-[10px] text-parchment/40 uppercase font-semibold tracking-wider mb-0.5">{label}</p>
                {children}
            </div>
        </div>
    );
}