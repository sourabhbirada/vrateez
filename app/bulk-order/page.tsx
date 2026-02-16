'use client';

import { useState } from 'react';
import { Send, Phone, Mail, MapPin } from 'lucide-react';

export default function BulkOrderPage() {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <main className="bg-white min-h-screen">
            {/* Hero */}
            <section className="bg-gradient-to-br from-amber-50 to-orange-100 py-20">
                <div className="max-w-4xl mx-auto px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                        Bulk &amp; Special Orders
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Whether you&apos;re looking to serve Vrateez in your café, stock it in your retail store,
                        add it to your distribution network, or use it for corporate gifting — we&apos;ve got you covered.
                    </p>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Send size={32} className="text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Inquiry Submitted!</h3>
                                    <p className="text-gray-500">We&apos;ll get back to you within 24 hours with custom pricing and details.</p>
                                    <button
                                        onClick={() => { setSubmitted(false); setFormData({ companyName: '', yourName: '', phone: '', email: '', location: '', inquiryType: '', message: '' }); }}
                                        className="mt-6 text-orange-600 font-semibold hover:underline"
                                    >
                                        Submit another inquiry
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <p className="text-sm text-gray-500 mb-2">
                                        Just drop your details and we&apos;ll swiftly get back to you. Alternatively, feel free to reach out via WhatsApp or email.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Company Name</label>
                                            <input
                                                type="text"
                                                name="companyName"
                                                value={formData.companyName}
                                                onChange={handleChange}
                                                className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                placeholder="Acme Corp"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Your Name *</label>
                                            <input
                                                type="text"
                                                name="yourName"
                                                value={formData.yourName}
                                                onChange={handleChange}
                                                required
                                                className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Phone *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                placeholder="+91 99999 99999"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Email *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                                placeholder="you@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Location</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                                            placeholder="City, State"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Bulk Order Inquiry *</label>
                                        <select
                                            name="inquiryType"
                                            value={formData.inquiryType}
                                            onChange={handleChange}
                                            required
                                            className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                                        >
                                            <option value="">Please Select</option>
                                            <option value="retail">Retail Store Stocking</option>
                                            <option value="cafe">Café / Restaurant</option>
                                            <option value="gifting">Corporate Gifting</option>
                                            <option value="gym">Gym / Fitness Studio</option>
                                            <option value="distributor">Distributor / Wholesale</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Message (optional)</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={3}
                                            className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                                            placeholder="Tell us about your requirements..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Send size={16} />
                                        SUBMIT INQUIRY
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Contact sidebar */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-8">
                            <h3 className="text-xl font-bold mb-6">Contact Details</h3>
                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <Phone size={18} className="text-orange-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Phone</p>
                                        <a href="tel:919079086630" className="text-white hover:text-orange-400 transition">+91 90790 86630</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail size={18} className="text-orange-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Email</p>
                                        <a href="mailto:support@vrateez.com" className="text-white hover:text-orange-400 transition">support@vrateez.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-orange-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-semibold">Address</p>
                                        <p className="text-sm text-gray-300">Vrateez HQ, Jaipur, Rajasthan, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Why bulk */}
                        <div className="bg-amber-50 rounded-3xl p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Why Partner with Vrateez?</h3>
                            <ul className="space-y-3 text-sm text-gray-700">
                                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">✓</span> Custom pricing for bulk orders</li>
                                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">✓</span> Dedicated account manager</li>
                                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">✓</span> Custom packaging & branding</li>
                                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">✓</span> Pan-India delivery</li>
                                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">✓</span> 30-day payment terms available</li>
                                <li className="flex items-start gap-2"><span className="text-orange-500 font-bold mt-0.5">✓</span> Marketing support & POS materials</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
