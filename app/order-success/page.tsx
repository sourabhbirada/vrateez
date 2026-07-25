'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Mail, Phone, MapPin, ArrowRight, Truck } from 'lucide-react';
import { getOrderByIdApi, getGuestOrderApi } from '@/lib/api/orderApi';
import { useAuth } from '@/context/AuthContext';
import type { Order } from '@/lib/api/types';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const email = searchParams.get('email');
    const { user } = useAuth();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrder() {
            if (!orderId) {
                setError('Order ID not found');
                setLoading(false);
                return;
            }

            try {
                let fetchedOrder: Order;
                if (user) {
                    fetchedOrder = await getOrderByIdApi(orderId);
                } else if (email) {
                    fetchedOrder = await getGuestOrderApi(orderId, email);
                } else {
                    setError('Unable to fetch order details');
                    setLoading(false);
                    return;
                }
                setOrder(fetchedOrder);
            } catch {
                setError('Unable to fetch order details');
            } finally {
                setLoading(false);
            }
        }

        void fetchOrder();
    }, [orderId, email, user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-parchment flex items-center justify-center">
                <div className="animate-pulse text-ink/50">Loading order details...</div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-parchment flex flex-col items-center justify-center px-4">
                <div className="text-clay mb-4">{error || 'Order not found'}</div>
                <Link
                    href={`/order-tracking?orderId=${encodeURIComponent(orderId || '')}&email=${encodeURIComponent(email || user?.email || '')}`}
                    className="bg-turmeric text-parchment px-6 py-3 rounded-full font-semibold hover:bg-clay transition"
                >
                    Track Order
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-parchment py-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-basil/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={48} className="text-basil" />
                    </div>
                    <h1 className="font-display italic text-3xl text-ink mb-2">
                        {order.paymentStatus === 'paid' ? 'Payment successful!' : 'Order confirmed!'}
                    </h1>
                    <p className="text-ink/60">
                        Thank you for your order. We&apos;ll send you a confirmation email shortly.
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white/70 rounded-2xl shadow-sm overflow-hidden border border-ink/10">
                    {/* Order ID Header */}
                    <div className="bg-ink text-parchment px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-parchment/50">Order ID</p>
                                <p className="font-label font-bold">{order._id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-parchment/50">Status</p>
                                <p className="font-semibold text-millet capitalize">{order.orderStatus}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-6 py-4 border-b border-ink/10">
                        <h3 className="font-semibold text-ink mb-3 flex items-center gap-2">
                            <Package size={18} />
                            Items ({order.items.length})
                        </h3>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-ink">{item.name}</p>
                                        <p className="text-sm text-ink/50">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-ink">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="px-6 py-4 border-b border-ink/10">
                        <h3 className="font-semibold text-ink mb-3 flex items-center gap-2">
                            <MapPin size={18} />
                            Shipping Address
                        </h3>
                        <p className="text-ink/60">
                            {order.shippingAddress.line1}
                            {order.shippingAddress.line2 && <>, {order.shippingAddress.line2}</>}
                            <br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            <br />
                            {order.shippingAddress.country}
                        </p>
                    </div>

                    {/* Contact Info (guest) */}
                    {order.guestInfo && (
                        <div className="px-6 py-4 border-b border-ink/10">
                            <h3 className="font-semibold text-ink mb-3">Contact Information</h3>
                            <div className="space-y-2 text-ink/60">
                                <p className="flex items-center gap-2">
                                    <span className="font-medium">{order.guestInfo.name}</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail size={14} />
                                    {order.guestInfo.email}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Phone size={14} />
                                    {order.guestInfo.phone}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Contact on file (account orders) */}
                    {!order.guestInfo && order.contactPhone && (
                        <div className="px-6 py-4 border-b border-ink/10">
                            <h3 className="font-semibold text-ink mb-3 flex items-center gap-2">
                                <Phone size={18} />
                                Contact on order
                            </h3>
                            <p className="text-ink font-medium">+91 {order.contactPhone}</p>
                            <p className="text-xs text-ink/40 mt-1">Used for Razorpay and delivery updates.</p>
                        </div>
                    )}

                    {/* Tracking */}
                    {(order.trackingNumber || order.courierPartner || (order.trackingEvents && order.trackingEvents.length > 0)) && (
                        <div className="px-6 py-4 border-b border-ink/10 bg-ink/[0.03]">
                            <h3 className="font-semibold text-ink mb-3 flex items-center gap-2">
                                <Truck size={18} />
                                Tracking
                            </h3>
                            <div className="space-y-2 text-sm text-ink/70">
                                {order.courierPartner ? (
                                    <p>
                                        <span className="text-ink/40">Courier:</span> {order.courierPartner}
                                    </p>
                                ) : null}
                                {order.trackingNumber ? (
                                    <p className="font-label text-xs">
                                        <span className="text-ink/40 font-sans">AWB / ID:</span> {order.trackingNumber}
                                    </p>
                                ) : null}
                                {order.estimatedDeliveryAt ? (
                                    <p className="text-xs text-ink/60">
                                        Est. delivery:{' '}
                                        {new Intl.DateTimeFormat('en-IN', { dateStyle: 'long' }).format(
                                            new Date(order.estimatedDeliveryAt),
                                        )}
                                    </p>
                                ) : null}
                            </div>
                            {order.trackingEvents && order.trackingEvents.length > 0 && (
                                <ol className="mt-4 space-y-3 border-t border-ink/10 pt-4">
                                    {order.trackingEvents.map((ev, idx) => (
                                        <li key={`${ev.createdAt}-${idx}`} className="flex gap-3 text-sm">
                                            <span className="w-2 h-2 rounded-full bg-turmeric mt-1.5 shrink-0" />
                                            <div>
                                                <p className="font-medium text-ink">{ev.title}</p>
                                                {ev.note ? <p className="text-ink/60 text-xs mt-0.5">{ev.note}</p> : null}
                                                {ev.location ? (
                                                    <p className="text-xs text-ink/50 mt-0.5">{ev.location}</p>
                                                ) : null}
                                                <p className="text-xs text-ink/35 mt-1">
                                                    {new Intl.DateTimeFormat('en-IN', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    }).format(new Date(ev.createdAt))}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>
                    )}

                    {/* Payment Summary */}
                    <div className="px-6 py-4 bg-ink/[0.03]">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-ink/60">Subtotal</span>
                                <span className="text-ink">₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-ink/60">Shipping</span>
                                <span className={order.shippingCharge === 0 ? 'text-basil' : 'text-ink'}>
                                    {order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}
                                </span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-sm text-basil">
                                    <span>Discount</span>
                                    <span>-₹{order.discountAmount}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-ink/10 text-ink">
                                <span>Total</span>
                                <span>₹{order.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-ink/60">Payment Method</span>
                                <span className="capitalize text-ink">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-ink/60">Payment Status</span>
                                <span className={`capitalize font-medium ${
                                    order.paymentStatus === 'paid' ? 'text-basil' :
                                    order.paymentStatus === 'failed' ? 'text-clay' : 'text-turmeric'
                                }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    {user && (
                        <Link
                            href="/account/orders"
                            className="inline-flex items-center justify-center gap-2 border border-ink/15 bg-white/60 text-ink px-8 py-3 rounded-full font-semibold hover:bg-ink/5 transition"
                        >
                            All my orders
                        </Link>
                    )}
                    <Link
                        href={`/order-tracking?orderId=${encodeURIComponent(order._id)}&email=${encodeURIComponent(email || user?.email || '')}`}
                        className="inline-flex items-center justify-center gap-2 bg-turmeric text-parchment px-8 py-3 rounded-full font-semibold hover:bg-clay transition"
                    >
                        Track Order
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Help Text */}
                <p className="text-center text-sm text-ink/50 mt-8">
                    Questions about your order? Contact us at{' '}
                    <a href="mailto:vrateezfoodspvtltd@gmail.com" className="text-turmeric hover:underline">
                        vrateezfoodspvtltd@gmail.com
                    </a>
                </p>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-parchment flex items-center justify-center">
                <div className="animate-pulse text-ink/50">Loading...</div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}