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
            <div className="min-h-screen bg-parchment flex flex-col items-center justify-center px-4 py-16">
                <Package className="text-ink/25" size={48} />
                <h1 className="font-display italic text-xl text-ink mt-4 mb-2">Sign in to see your orders</h1>
                <p className="text-ink/60 text-center mb-6 max-w-md">
                    Order history and tracking are available for your account. Log in with the same email you used at
                    checkout.
                </p>
                <button
                    type="button"
                    onClick={openLogin}
                    className="bg-turmeric text-parchment px-8 py-3 rounded-full font-semibold hover:bg-clay transition"
                >
                    Log in
                </button>
                <Link href="/shop" className="mt-6 text-sm text-ink/50 hover:text-ink flex items-center gap-2">
                    <ArrowLeft size={16} />
                    Continue shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-parchment py-10 px-4">
            <div className="max-w-3xl mx-auto">
                <Link href="/shop" className="inline-flex items-center gap-2 text-ink/60 hover:text-ink mb-6 text-sm">
                    <ArrowLeft size={18} />
                    Shop
                </Link>

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="font-display italic text-3xl text-ink">Your orders</h1>
                        <p className="text-ink/60 mt-1 text-sm">
                            Logged in as <span className="font-medium text-ink">{user.email}</span>
                            {user.phone ? (
                                <>
                                    {' '}
                                    ·{' '}
                                    <span className="inline-flex items-center gap-1 font-medium text-ink">
                                        <Phone size={14} className="text-ink/40" />
                                        +91 {user.phone}
                                    </span>
                                </>
                            ) : null}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20 text-ink/50 gap-2 items-center">
                        <Loader2 className="animate-spin" size={22} />
                        Loading orders…
                    </div>
                ) : error ? (
                    <div className="bg-clay/10 border border-clay/25 text-clay rounded-xl px-4 py-3 text-sm">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="bg-white/60 rounded-2xl border border-ink/10 p-10 text-center text-ink/60">
                        <Package className="mx-auto text-ink/25 mb-3" size={40} />
                        <p>No orders yet.</p>
                        <Link href="/shop" className="mt-4 inline-block text-turmeric font-semibold hover:underline">
                            Start shopping
                        </Link>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {orders.map((order) => (
                            <li key={order._id} className="bg-white/60 rounded-2xl border border-ink/10 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 flex flex-wrap items-start justify-between gap-3 border-b border-ink/10 bg-ink/[0.03]">
                                    <div>
                                        <p className="text-xs text-ink/40 uppercase tracking-wide">Order</p>
                                        <p className="font-label text-sm font-semibold text-ink">{order._id}</p>
                                        <p className="text-xs text-ink/40 mt-1">{formatShortDate(order.createdAt)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-ink/40">Total</p>
                                        <p className="text-lg font-bold text-ink">₹{order.totalAmount}</p>
                                        <p className="text-xs capitalize mt-1">
                                            <span
                                                className={
                                                    order.paymentStatus === 'paid'
                                                        ? 'text-basil font-medium'
                                                        : order.paymentStatus === 'failed'
                                                          ? 'text-clay font-medium'
                                                          : 'text-turmeric font-medium'
                                                }
                                            >
                                                {order.paymentStatus}
                                            </span>
                                            <span className="text-ink/30"> · </span>
                                            <span className="text-ink/70">{order.orderStatus}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="px-5 py-4 space-y-3 text-sm text-ink/60">
                                    <div className="flex items-start gap-2">
                                        <MapPin size={16} className="text-ink/30 shrink-0 mt-0.5" />
                                        <span>
                                            {order.shippingAddress.line1}
                                            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''},{' '}
                                            {order.shippingAddress.city}, {order.shippingAddress.state} —{' '}
                                            {order.shippingAddress.pincode}
                                        </span>
                                    </div>

                                    {order.contactPhone ? (
                                        <div className="flex items-center gap-2">
                                            <Phone size={16} className="text-ink/30 shrink-0" />
                                            <span className="font-medium text-ink">+91 {order.contactPhone}</span>
                                            <span className="text-ink/30">· contact on order</span>
                                        </div>
                                    ) : null}

                                    {(order.trackingNumber || order.courierPartner) && (
                                        <div className="flex items-start gap-2 text-ink/80">
                                            <Truck size={16} className="text-ink/30 shrink-0 mt-0.5" />
                                            <div>
                                                {order.courierPartner ? (
                                                    <p className="font-medium">{order.courierPartner}</p>
                                                ) : null}
                                                {order.trackingNumber ? (
                                                    <p className="font-label text-xs mt-0.5">AWB: {order.trackingNumber}</p>
                                                ) : null}
                                            </div>
                                        </div>
                                    )}

                                    {order.trackingEvents && order.trackingEvents.length > 0 && (
                                        <div className="border-t border-ink/10 pt-3 mt-1">
                                            <p className="text-xs font-semibold text-ink/40 uppercase tracking-wide mb-2">
                                                Tracking
                                            </p>
                                            <ul className="space-y-2">
                                                {order.trackingEvents.slice(0, 4).map((ev, i) => (
                                                    <li key={`${ev.createdAt}-${i}`} className="text-xs text-ink/60">
                                                        <span className="font-medium text-ink/80">{ev.title}</span>
                                                        {ev.note ? <span> — {ev.note}</span> : null}
                                                        <span className="text-ink/30"> · {formatShortDate(ev.createdAt)}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="px-5 py-3 bg-ink/[0.03] border-t border-ink/10 flex justify-end">
                                    <Link
                                        href={`/order-success?orderId=${encodeURIComponent(order._id)}&email=${encodeURIComponent(user.email)}`}
                                        className="text-sm font-semibold text-turmeric hover:underline"
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