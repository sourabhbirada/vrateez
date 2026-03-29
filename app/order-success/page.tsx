'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-gray-500">Loading order details...</div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <div className="text-red-500 mb-4">{error || 'Order not found'}</div>
                <Link
                    href="/shop"
                    className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={48} className="text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600">
                        Thank you for your order. We&apos;ll send you a confirmation email shortly.
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {/* Order ID Header */}
                    <div className="bg-gray-900 text-white px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">Order ID</p>
                                <p className="font-mono font-bold">{order._id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400">Status</p>
                                <p className="font-semibold text-green-400 capitalize">{order.orderStatus}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-6 py-4 border-b">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Package size={18} />
                            Items ({order.items.length})
                        </h3>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="px-6 py-4 border-b">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MapPin size={18} />
                            Shipping Address
                        </h3>
                        <p className="text-gray-600">
                            {order.shippingAddress.line1}
                            {order.shippingAddress.line2 && <>, {order.shippingAddress.line2}</>}
                            <br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            <br />
                            {order.shippingAddress.country}
                        </p>
                    </div>

                    {/* Contact Info (for guest orders) */}
                    {order.guestInfo && (
                        <div className="px-6 py-4 border-b">
                            <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
                            <div className="space-y-2 text-gray-600">
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

                    {/* Payment Summary */}
                    <div className="px-6 py-4 bg-gray-50">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className={order.shippingCharge === 0 ? 'text-green-600' : ''}>
                                    {order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}
                                </span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount</span>
                                    <span>-₹{order.discountAmount}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                <span>Total</span>
                                <span>₹{order.totalAmount}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Payment Status</span>
                                <span className={`capitalize font-medium ${
                                    order.paymentStatus === 'paid' ? 'text-green-600' :
                                    order.paymentStatus === 'failed' ? 'text-red-600' : 'text-orange-600'
                                }`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition"
                    >
                        Continue Shopping
                        <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Help Text */}
                <p className="text-center text-sm text-gray-500 mt-8">
                    Questions about your order? Contact us at{' '}
                    <a href="mailto:support@vrateez.com" className="text-orange-500 hover:underline">
                        support@vrateez.com
                    </a>
                </p>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-gray-500">Loading...</div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
