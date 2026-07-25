'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Package, MapPin, Mail, Phone, Truck, Search, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getOrderByIdApi, getGuestOrderApi, getOrderTrackingApi, getOrderByOrderIdApi } from '@/lib/api/orderApi';
import type { Order } from '@/lib/api/types';
import TrackingDetails from '@/component/order/TrackingDetails';

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

const isObjectId = (value: string) => OBJECT_ID_REGEX.test(value);

function OrderTrackingContent() {
    const searchParams = useSearchParams();
    const { user } = useAuth();
    const [orderId, setOrderId] = useState(searchParams.get('orderId') || '');
    const [email, setEmail] = useState(searchParams.get('email') || user?.email || '');
    const [order, setOrder] = useState<Order | null>(null);
    const [trackingData, setTrackingData] = useState<any>(null);
    const [trackingError, setTrackingError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.email) {
            setEmail(user.email);
        }
    }, [user?.email]);

    useEffect(() => {
        const prefillOrderId = searchParams.get('orderId');
        const prefillEmail = searchParams.get('email');
        if (prefillOrderId) setOrderId(prefillOrderId);
        if (prefillEmail) setEmail(prefillEmail);
    }, [searchParams]);

    useEffect(() => {
        if (!orderId) return;
        if (!user && !email) return;
        void handleLookup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, orderId, email]);

    const fetchTracking = async (orderIdToTrack: string) => {
        setTrackingLoading(true);
        setTrackingError(null);
        try {
            const trackingResponse = await getOrderTrackingApi(orderIdToTrack);
            if (trackingResponse.hasTracking && trackingResponse.tracking) {
                setTrackingData(trackingResponse.tracking);
            } else if (trackingResponse.fallback) {
                // Use fallback tracking data from order
                setTrackingError(trackingResponse.message || 'Live tracking unavailable');
            } else {
                setTrackingError(trackingResponse.message || 'No tracking information available');
            }
        } catch (err) {
            setTrackingError('Unable to fetch tracking information');
        } finally {
            setTrackingLoading(false);
        }
    };

    const handleLookup = async () => {
        setError(null);
        setLoading(true);
        setOrder(null);
        setTrackingData(null);
        setTrackingError(null);

        if (!orderId.trim()) {
            setError('Please enter your order ID.');
            setLoading(false);
            return;
        }

        if (!user && (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
            setError('Please enter the email used for the order.');
            setLoading(false);
            return;
        }

        try {
            let data: Order;
            
            // First try to get by orderId (custom ID)
            try {
                data = await getOrderByOrderIdApi(orderId.trim(), user ? undefined : email.trim());
            } catch (orderIdError) {
                // If orderId lookup fails and it looks like a MongoDB ID, try that
                if (isObjectId(orderId.trim())) {
                    data = user
                        ? await getOrderByIdApi(orderId.trim())
                        : await getGuestOrderApi(orderId.trim(), email.trim());
                } else {
                    throw orderIdError;
                }
            }
            
            setOrder(data);
            
            // Fetch live tracking data using the database _id
            if (data.trackingNumber) {
                await fetchTracking(data._id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to fetch order details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-white border border-gray-100 rounded-full px-4 py-2 text-sm text-gray-700">
                        <Search size={16} /> Track your order
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Order Tracking</h1>
                    <p className="text-gray-500 mt-2">Enter your order ID and email to see the latest status.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="e.g. SF3583515448MIT or DB ID"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                disabled={Boolean(user)}
                            />
                            {user && (
                                <p className="text-xs text-gray-500 mt-1">Signed-in users do not need email.</p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={handleLookup}
                        disabled={loading}
                        className="mt-5 w-full md:w-auto bg-gray-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                    >
                        {loading ? 'Looking up...' : 'Track Order'}
                    </button>
                </div>

                {loading && !order && (
                    <div className="text-center text-gray-500 flex items-center justify-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        Fetching order details...
                    </div>
                )}

                {order && (
                    <div className="space-y-6">
                        {/* Live Tracking Information */}
                        {trackingLoading ? (
                            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                                <Loader2 className="animate-spin mx-auto mb-3 text-orange-500" size={32} />
                                <p className="text-gray-600">Loading live tracking information...</p>
                            </div>
                        ) : (
                            <TrackingDetails
                                trackingData={trackingData}
                                orderId={order._id}
                                error={trackingError || undefined}
                            />
                        )}

                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                            <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-300">Order DB ID</p>
                                    <p className="font-mono font-semibold text-sm">{order._id}</p>
                                    {order.orderId && (
                                        <p className="text-xs text-gray-300 mt-1">
                                            Order ID: <span className="font-semibold">{order.orderId}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-300">Status</p>
                                    <p className="font-semibold text-green-300 capitalize">{order.orderStatus}</p>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-b">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Package size={18} /> Items ({order.items.length})
                                </h3>
                                <div className="space-y-3">
                                    {order.items.map((item, idx) => (
                                        <div key={`${item.name}-${idx}`} className="flex justify-between text-sm">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="px-6 py-4 border-b">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <MapPin size={18} /> Shipping Address
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {order.shippingAddress.line1}
                                    {order.shippingAddress.line2 && <>, {order.shippingAddress.line2}</>}
                                    <br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                    <br />
                                    {order.shippingAddress.country}
                                </p>
                            </div>

                            {order.guestInfo && (
                                <div className="px-6 py-4 border-b">
                                    <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                                    <div className="space-y-2 text-gray-600 text-sm">
                                        <p className="font-medium">{order.guestInfo.name}</p>
                                        <p className="flex items-center gap-2"><Mail size={14} /> {order.guestInfo.email}</p>
                                        <p className="flex items-center gap-2"><Phone size={14} /> {order.guestInfo.phone}</p>
                                    </div>
                                </div>
                            )}

                            {/* Fallback tracking info if no live tracking */}
                            {!trackingData && (order.trackingNumber || order.courierPartner || (order.trackingEvents && order.trackingEvents.length > 0)) && (
                                <div className="px-6 py-4 border-b bg-slate-50/80">
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Truck size={18} /> Tracking (Basic Info)
                                    </h3>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        {order.courierPartner ? (
                                            <p><span className="text-gray-500">Courier:</span> {order.courierPartner}</p>
                                        ) : null}
                                        {order.trackingNumber ? (
                                            <p className="font-mono text-xs"><span className="text-gray-500 font-sans">AWB / ID:</span> {order.trackingNumber}</p>
                                        ) : null}
                                        {order.estimatedDeliveryAt ? (
                                            <p className="text-xs text-gray-600">
                                                Est. delivery: {new Intl.DateTimeFormat('en-IN', { dateStyle: 'long' }).format(new Date(order.estimatedDeliveryAt))}
                                            </p>
                                        ) : null}
                                    </div>
                                    {order.trackingEvents && order.trackingEvents.length > 0 && (
                                        <ol className="mt-4 space-y-3 border-t border-slate-200 pt-4">
                                            {order.trackingEvents.map((ev, idx) => (
                                                <li key={`${ev.createdAt}-${idx}`} className="flex gap-3 text-sm">
                                                    <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{ev.title}</p>
                                                        {ev.note ? <p className="text-gray-600 text-xs mt-0.5">{ev.note}</p> : null}
                                                        {ev.location ? <p className="text-xs text-gray-500 mt-0.5">{ev.location}</p> : null}
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ev.createdAt))}
                                                        </p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                    )}
                                </div>
                            )}

                            <div className="px-6 py-4 bg-gray-50">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Total</span>
                                    <span className="font-bold">₹{order.totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-2">
                                    <span className="text-gray-600">Payment Status</span>
                                    <span className="capitalize font-medium">{order.paymentStatus}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <p className="text-center text-sm text-gray-500 mt-8">
                    Need help? Email us at{' '}
                    <a href="mailto:vrateezfoodspvtltd@gmail.com" className="text-orange-500 hover:underline">
                        vrateezfoodspvtltd@gmail.com
                    </a>
                    {' '}or return to{' '}
                    <Link href="/" className="text-orange-500 hover:underline">home</Link>.
                </p>
            </div>
        </main>
    );
}

export default function OrderTrackingPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
                <p className="text-gray-500">Loading order tracking...</p>
            </main>
        }>
            <OrderTrackingContent />
        </Suspense>
    );
}
