'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, ArrowLeft, Home, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function PaymentErrorContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const email = searchParams.get('email');
    const message = searchParams.get('message');
    const { user } = useAuth();

    const decoded = message ? decodeURIComponent(message) : 'Payment could not be completed or verified.';

    const successHref =
        orderId && (user?.email || email)
            ? `/order-success?orderId=${encodeURIComponent(orderId)}&email=${encodeURIComponent(user?.email || email || '')}`
            : null;

    return (
        <div className="min-h-screen bg-parchment py-12 px-4">
            <div className="max-w-lg mx-auto">
                <div className="bg-white/70 rounded-2xl shadow-sm border border-clay/20 overflow-hidden">
                    <div className="bg-clay/8 px-6 py-8 text-center border-b border-clay/15">
                        <div className="w-16 h-16 bg-clay/12 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="text-clay" size={36} />
                        </div>
                        <h1 className="font-display italic text-2xl text-ink">Payment not completed</h1>
                        <p className="text-ink/60 mt-2 text-sm leading-relaxed">{decoded}</p>
                    </div>
                    <div className="px-6 py-6 space-y-4 text-sm text-ink/60">
                        {orderId && (
                            <p className="font-label text-xs bg-ink/5 rounded-lg px-3 py-2 border border-ink/10">
                                Order ID: <span className="font-semibold text-ink">{orderId}</span>
                            </p>
                        )}
                        <p>
                            If money was debited, it is usually auto-refunded by Razorpay within a few days. You can try
                            paying again from your orders, or contact support with the order ID above.
                        </p>
                    </div>
                    <div className="px-6 pb-8 flex flex-col sm:flex-row gap-3">
                        {user ? (
                            <Link
                                href="/account/orders"
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-ink text-parchment py-3 rounded-xl font-semibold hover:bg-turmeric transition"
                            >
                                <Package size={18} />
                                My orders
                            </Link>
                        ) : successHref ? (
                            <Link
                                href={successHref}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-ink text-parchment py-3 rounded-xl font-semibold hover:bg-turmeric transition"
                            >
                                <Package size={18} />
                                View order status
                            </Link>
                        ) : null}
                        <Link
                            href="/shop"
                            className="flex-1 inline-flex items-center justify-center gap-2 border border-ink/15 py-3 rounded-xl font-semibold text-ink hover:bg-ink/5 transition"
                        >
                            <Home size={18} />
                            Back to shop
                        </Link>
                    </div>
                </div>
                <Link
                    href="/shop"
                    className="mt-6 flex items-center justify-center gap-2 text-sm text-ink/50 hover:text-ink"
                >
                    <ArrowLeft size={16} />
                    Continue browsing
                </Link>
            </div>
        </div>
    );
}

export default function OrderPaymentErrorPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-parchment flex items-center justify-center text-ink/50">Loading...</div>
            }
        >
            <PaymentErrorContent />
        </Suspense>
    );
}