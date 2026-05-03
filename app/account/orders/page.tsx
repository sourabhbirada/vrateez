'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, MapPin, Package, Phone, Truck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getMyOrdersApi } from '@/lib/api/orderApi';
import type { Order } from '@/lib/api/types';

function formatShortDate(iso: string) {
    try {
        return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
    } catch {
        return iso;
    }
}

export default function MyOrdersPage() {
    const { user, openLogin } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const list = await getMyOrdersApi();
                if (!cancelled) setOrders(list);
            } catch (e) {
                if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load orders');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
                <Package className="text-gray-300 mb-4" size={48} />
                <h1 className="text-xl font-bold text-gray-900 mb-2">Sign in to see your orders</h1>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                    Order history and tracking are available for your account. Log in with the same email you used at
                    checkout.
                </p>
                <button
                    type="button"
                    onClick={openLogin}
                    className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
                >
                    Log in
                </button>
                <Link href="/shop" className="mt-6 text-sm text-gray-500 hover:text-gray-800 flex items-center gap-2">
                    <ArrowLeft size={16} />
                    Continue shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <Link href="/shop" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm">
                    <ArrowLeft size={18} />
                    Shop
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Your orders</h1>
                        <p className="text-gray-600 mt-1 text-sm">
                            Logged in as <span className="font-medium text-gray-900">{user.email}</span>
                            {user.phone ? (
                                <>
                                    {' '}
                                    ·{' '}
                                    <span className="inline-flex items-center gap-1 font-medium text-gray-900">
                                        <Phone size={14} className="text-gray-500" />
                                        +91 {user.phone}
                                    </span>
                                </>
                            ) : null}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 text-gray-500 gap-2 items-center">
                        <Loader2 className="animate-spin" size={22} />
                        Loading orders…
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-600">
                        <Package className="mx-auto text-gray-300 mb-3" size={40} />
                        <p>No orders yet.</p>
                        <Link href="/shop" className="mt-4 inline-block text-orange-600 font-semibold hover:underline">
                            Start shopping
                        </Link>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {orders.map((order) => (
                            <li key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 flex flex-wrap items-start justify-between gap-3 border-b border-gray-50 bg-gray-50/80">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order</p>
                                        <p className="font-mono text-sm font-semibold text-gray-900">{order._id}</p>
                                        <p className="text-xs text-gray-500 mt-1">{formatShortDate(order.createdAt)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Total</p>
                                        <p className="text-lg font-bold text-gray-900">₹{order.totalAmount}</p>
                                        <p className="text-xs capitalize mt-1">
                                            <span
                                                className={
                                                    order.paymentStatus === 'paid'
                                                        ? 'text-green-600 font-medium'
                                                        : order.paymentStatus === 'failed'
                                                          ? 'text-red-600 font-medium'
                                                          : 'text-amber-600 font-medium'
                                                }
                                            >
                                                {order.paymentStatus}
                                            </span>
                                            <span className="text-gray-400"> · </span>
                                            <span className="text-gray-700">{order.orderStatus}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="px-5 py-4 space-y-3 text-sm text-gray-600">
                                    <div className="flex items-start gap-2">
                                        <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                                        <span>
                                            {order.shippingAddress.line1}
                                            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''},{' '}
                                            {order.shippingAddress.city}, {order.shippingAddress.state} —{' '}
                                            {order.shippingAddress.pincode}
                                        </span>
                                    </div>

                                    {order.contactPhone ? (
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-gray-400 shrink-0" />
                                            <span className="font-medium text-gray-900">+91 {order.contactPhone}</span>
                                            <span className="text-gray-400">· contact on order</span>
                                        </div>
                                    ) : null}

                                    {(order.trackingNumber || order.courierPartner) && (
                                        <div className="flex items-start gap-2 text-gray-800">
                                            <Truck size={16} className="text-gray-400 shrink-0 mt-0.5" />
                                            <div>
                                                {order.courierPartner ? (
                                                    <p className="font-medium">{order.courierPartner}</p>
                                                ) : null}
                                                {order.trackingNumber ? (
                                                    <p className="font-mono text-xs mt-0.5">AWB: {order.trackingNumber}</p>
                                                ) : null}
                                            </div>
                                        </div>
                                    )}

                                    {order.trackingEvents && order.trackingEvents.length > 0 && (
                                        <div className="border-t border-gray-100 pt-3 mt-1">
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                                Tracking
                                            </p>
                                            <ul className="space-y-2">
                                                {order.trackingEvents.slice(0, 4).map((ev, i) => (
                                                    <li key={`${ev.createdAt}-${i}`} className="text-xs text-gray-600">
                                                        <span className="font-medium text-gray-800">{ev.title}</span>
                                                        {ev.note ? <span> — {ev.note}</span> : null}
                                                        <span className="text-gray-400"> · {formatShortDate(ev.createdAt)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                                    <Link
                                        href={`/order-success?orderId=${encodeURIComponent(order._id)}&email=${encodeURIComponent(user.email)}`}
                                        className="text-sm font-semibold text-orange-600 hover:underline"
                                    >
                                        Full details & receipt
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
