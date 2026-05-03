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
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-lg mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                    <div className="bg-red-50 px-6 py-8 text-center border-b border-red-100">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="text-red-600" size={36} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Payment not completed</h1>
                        <p className="text-gray-600 mt-2 text-sm leading-relaxed">{decoded}</p>
                    </div>
                    <div className="px-6 py-6 space-y-4 text-sm text-gray-600">
                        {orderId && (
                            <p className="font-mono text-xs bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
                                Order ID: <span className="font-semibold text-gray-900">{orderId}</span>
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
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
                            >
                                <Package size={18} />
                                My orders
                            </Link>
                        ) : successHref ? (
                            <Link
                                href={successHref}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
                            >
                                <Package size={18} />
                                View order status
                            </Link>
                        ) : null}
                        <Link
                            href="/shop"
                            className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl font-semibold text-gray-800 hover:bg-gray-50 transition"
                        >
                            <Home size={18} />
                            Back to shop
                        </Link>
                    </div>
                </div>
                <Link
                    href="/shop"
                    className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800"
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
                <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
            }
        >
            <PaymentErrorContent />
        </Suspense>
    );
}
