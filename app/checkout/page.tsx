'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Truck, CheckCircle, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrderApi, createGuestOrderApi, confirmGuestCodOrderApi } from '@/lib/api/orderApi';
import { createPaymentIntentApi, verifyPaymentApi, confirmCodOrderApi, createGuestPaymentApi, verifyGuestPaymentApi } from '@/lib/api/paymentApi';
import { validateCouponApi } from '@/lib/api/couponApi';
import { getProductsApi } from '@/lib/api/productApi';
import type { ShippingAddress, GuestInfo, Order } from '@/lib/api/types';

type PaymentMethod = 'stripe' | 'cod';

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

const isObjectId = (id: string): boolean => OBJECT_ID_REGEX.test(id);

const normalizeText = (value: string): string =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

// Stripe Elements options
const cardElementOptions = {
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#aab7c4',
            },
            padding: '12px',
        },
        invalid: {
            color: '#9e2146',
        },
    },
};

// Inner checkout form that uses Stripe hooks
function CheckoutForm({
    items,
    totalPrice,
    clearCart,
    user,
}: {
    items: ReturnType<typeof useCart>['items'];
    totalPrice: number;
    clearCart: () => void;
    user: ReturnType<typeof useAuth>['user'];
}) {
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = useState(false);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{
        couponCode: string;
        discountAmount: number;
        description: string;
    } | null>(null);

    // Guest info (only shown if not logged in)
    const [guestInfo, setGuestInfo] = useState<GuestInfo>({
        name: '',
        email: '',
        phone: '',
    });

    // Shipping address
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
    });

    // Payment method
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');

    // Calculate totals
    const subtotal = totalPrice;
    const shippingCharge = subtotal >= 499 ? 0 : 49;
    const discountAmount = appliedCoupon?.discountAmount || 0;
    const total = Math.max(subtotal - discountAmount + shippingCharge, 0);

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) {
            setError('Please enter a coupon code');
            return;
        }

        setError(null);
        setIsApplyingCoupon(true);

        try {
            const result = await validateCouponApi({
                couponCode: couponInput.trim(),
                subtotal,
            });
            setAppliedCoupon(result);
            setCouponInput(result.couponCode);
        } catch (err) {
            setAppliedCoupon(null);
            setError(err instanceof Error ? err.message : 'Unable to apply coupon right now');
        } finally {
            setIsApplyingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
    };

    const validateForm = (): boolean => {
        // Validate guest info if not logged in
        if (!user) {
            if (!guestInfo.name.trim()) {
                setError('Please enter your name');
                return false;
            }
            if (!guestInfo.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
                setError('Please enter a valid email address');
                return false;
            }
            if (!guestInfo.phone.trim() || guestInfo.phone.length < 10) {
                setError('Please enter a valid phone number');
                return false;
            }
        }

        // Validate shipping address
        if (!shippingAddress.line1.trim()) {
            setError('Please enter your address');
            return false;
        }
        if (!shippingAddress.city.trim()) {
            setError('Please enter your city');
            return false;
        }
        if (!shippingAddress.state.trim()) {
            setError('Please enter your state');
            return false;
        }
        if (!shippingAddress.pincode.trim() || shippingAddress.pincode.length !== 6) {
            setError('Please enter a valid 6-digit pincode');
            return false;
        }

        return true;
    };

    const handlePlaceOrder = async () => {
        setError(null);

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            let order: Order;

            const resolveGuestOrderItems = async (): Promise<Array<{ productId: string; quantity: number }>> => {
                const needsResolution = items.some(item => !isObjectId(item.id));

                if (!needsResolution) {
                    return items.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                    }));
                }

                const response = await getProductsApi({ limit: 100 });
                const apiProducts = response.items;
                if (!apiProducts.length) {
                    throw new Error('Product catalog is temporarily unavailable. Please refresh and try again in a few seconds.');
                }
                const apiBySlug = new Map(apiProducts.map(p => [p.slug, p]));

                return items.map(item => {
                    if (isObjectId(item.id)) {
                        return {
                            productId: item.id,
                            quantity: item.quantity,
                        };
                    }

                    // Prefer slug-based matching when available.
                    let matchedProduct = item.slug ? apiBySlug.get(item.slug) : undefined;

                    if (!matchedProduct) {
                        const normalizedItemName = normalizeText(item.name);
                        const nameMatches = apiProducts.filter(p => normalizeText(p.name) === normalizedItemName);
                        matchedProduct = nameMatches.find(p => p.price === item.price) || nameMatches[0];
                    }

                    if (!matchedProduct) {
                        const normalizedItemName = normalizeText(item.name);
                        const looseNameMatches = apiProducts.filter(
                            p =>
                                normalizeText(p.name).includes(normalizedItemName) ||
                                normalizedItemName.includes(normalizeText(p.name)),
                        );
                        matchedProduct = looseNameMatches.find(p => p.price === item.price) || looseNameMatches[0];
                    }

                    if (!matchedProduct) {
                        throw new Error(
                            `Product \"${item.name}\" is outdated in cart. Please remove it and add again.`,
                        );
                    }

                    return {
                        productId: matchedProduct._id,
                        quantity: item.quantity,
                    };
                });
            };

            // Create order
            if (user) {
                // Authenticated user
                order = await createOrderApi({
                    shippingAddress,
                    paymentMethod: paymentMethod === 'stripe' ? 'card' : 'cod',
                    couponCode: appliedCoupon?.couponCode,
                });
            } else {
                // Guest user
                const guestItems = await resolveGuestOrderItems();
                order = await createGuestOrderApi({
                    items: guestItems,
                    shippingAddress,
                    paymentMethod: paymentMethod === 'stripe' ? 'card' : 'cod',
                    guestInfo,
                    couponCode: appliedCoupon?.couponCode,
                });
            }

            // Handle payment
            if (paymentMethod === 'cod') {
                // COD - just confirm and redirect
                if (user) {
                    await confirmCodOrderApi(order._id);
                } else {
                    await confirmGuestCodOrderApi(order._id, guestInfo.email);
                }
                clearCart();
                router.push(`/order-success?orderId=${order._id}&email=${encodeURIComponent(guestInfo.email || user?.email || '')}`);
            } else {
                // Stripe payment
                let paymentIntent;
                if (user) {
                    paymentIntent = await createPaymentIntentApi(order._id, 'stripe');
                } else {
                    paymentIntent = await createGuestPaymentApi(order._id, guestInfo.email, 'stripe');
                }

                if (!stripe || !elements) {
                    throw new Error('Stripe payment form is still loading. Please wait a moment and try again.');
                }

                // Check if Stripe is configured
                if (paymentIntent.provider === 'stripe' && paymentIntent.clientSecret && stripe && elements) {
                    const cardElement = elements.getElement(CardElement);

                    if (!cardElement) {
                        throw new Error('Card element not found');
                    }

                    const { error: stripeError, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
                        paymentIntent.clientSecret,
                        {
                            payment_method: {
                                card: cardElement,
                                billing_details: {
                                    name: user?.name || guestInfo.name,
                                    email: user?.email || guestInfo.email,
                                },
                            },
                        }
                    );

                    if (stripeError) {
                        throw new Error(stripeError.message || 'Payment failed');
                    }

                    if (confirmedPayment?.status === 'succeeded') {
                        // Verify payment on backend
                        if (user) {
                            await verifyPaymentApi({
                                orderId: order._id,
                                provider: 'stripe',
                                paymentIntentId: confirmedPayment.id,
                            });
                        } else {
                            await verifyGuestPaymentApi({
                                orderId: order._id,
                                email: guestInfo.email,
                                provider: 'stripe',
                                paymentIntentId: confirmedPayment.id,
                            });
                        }
                        clearCart();
                        router.push(`/order-success?orderId=${order._id}&email=${encodeURIComponent(guestInfo.email || user?.email || '')}`);
                    }
                } else {
                    // Mock payment (for testing when Stripe not configured)
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    if (user) {
                        await verifyPaymentApi({
                            orderId: order._id,
                            provider: 'stripe',
                            paymentIntentId: paymentIntent.payment.paymentId,
                        });
                    } else {
                        await verifyGuestPaymentApi({
                            orderId: order._id,
                            email: guestInfo.email,
                            provider: 'stripe',
                            paymentIntentId: paymentIntent.payment.paymentId,
                        });
                    }
                    clearCart();
                    router.push(`/order-success?orderId=${order._id}&email=${encodeURIComponent(guestInfo.email || user?.email || '')}`);
                }
            }
        } catch (err) {
            console.error('Checkout error:', err);
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
                {/* Guest Info (only if not logged in) */}
                {!user && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={guestInfo.name}
                                    onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={guestInfo.email}
                                        onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        value={guestInfo.phone}
                                        onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address Line 1 *
                            </label>
                            <input
                                type="text"
                                value={shippingAddress.line1}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                placeholder="House/Flat No., Building Name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Address Line 2
                            </label>
                            <input
                                type="text"
                                value={shippingAddress.line2}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, line2: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                placeholder="Street, Area, Landmark"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                    placeholder="Mumbai"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    State *
                                </label>
                                <input
                                    type="text"
                                    value={shippingAddress.state}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                    placeholder="Maharashtra"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pincode *
                                </label>
                                <input
                                    type="text"
                                    value={shippingAddress.pincode}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                                    placeholder="400001"
                                    maxLength={6}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
                    <div className="space-y-3">
                        <label
                            className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                                paymentMethod === 'stripe'
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="stripe"
                                checked={paymentMethod === 'stripe'}
                                onChange={() => setPaymentMethod('stripe')}
                                className="w-5 h-5 text-orange-500"
                            />
                            <CreditCard size={24} className={paymentMethod === 'stripe' ? 'text-orange-500' : 'text-gray-400'} />
                            <div>
                                <p className="font-semibold text-gray-900">Pay Online (Stripe)</p>
                                <p className="text-sm text-gray-500">Credit/Debit Card</p>
                            </div>
                        </label>

                        <label
                            className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                                paymentMethod === 'cod'
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                                className="w-5 h-5 text-orange-500"
                            />
                            <Truck size={24} className={paymentMethod === 'cod' ? 'text-orange-500' : 'text-gray-400'} />
                            <div>
                                <p className="font-semibold text-gray-900">Cash on Delivery</p>
                                <p className="text-sm text-gray-500">Pay when you receive</p>
                            </div>
                        </label>
                    </div>

                    {/* Stripe Card Element */}
                    {paymentMethod === 'stripe' && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Card Details
                            </label>
                            <div className="border border-gray-300 rounded-lg p-4 bg-white">
                                <CardElement options={cardElementOptions} />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Test card: 4242 4242 4242 4242, any future date, any CVC
                            </p>
                            {!stripe && (
                                <p className="text-xs text-orange-600 mt-2">
                                    Loading Stripe secure card form...
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                    {/* Items */}
                    <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-3">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        ₹{item.price * item.quantity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t pt-4 space-y-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Coupon Code</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                    placeholder="Enter coupon"
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyCoupon}
                                    disabled={isApplyingCoupon}
                                    className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-50"
                                >
                                    {isApplyingCoupon ? 'Applying...' : 'Apply'}
                                </button>
                            </div>
                            {appliedCoupon && (
                                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                                    <span className="text-green-700">
                                        {appliedCoupon.couponCode} applied ({appliedCoupon.description})
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleRemoveCoupon}
                                        className="text-green-700 font-semibold hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">₹{subtotal}</span>
                        </div>
                        {discountAmount > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-green-700">Discount</span>
                                <span className="font-medium text-green-700">-₹{discountAmount}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className={`font-medium ${shippingCharge === 0 ? 'text-green-600' : ''}`}>
                                {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                            </span>
                        </div>
                        {shippingCharge > 0 && (
                            <p className="text-xs text-orange-600">
                                Add ₹{499 - subtotal} more for free shipping!
                            </p>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                            <span>Total</span>
                            <span>₹{total}</span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Place Order Button */}
                    <button
                        onClick={handlePlaceOrder}
                        disabled={isLoading}
                        className="w-full mt-6 bg-orange-500 text-white py-4 rounded-full font-bold text-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                {paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${total}`}
                            </>
                        )}
                    </button>

                    {/* Security Note */}
                    <p className="text-xs text-gray-400 text-center mt-4">
                        Your payment information is secure and encrypted
                    </p>
                </div>
            </div>
        </div>
    );
}

// Main checkout page with Stripe Elements wrapper
export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);

    // Initialize Stripe with publishable key
    useEffect(() => {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (publishableKey) {
            setStripePromise(loadStripe(publishableKey));
        }
    }, []);

    // Redirect if cart is empty
    useEffect(() => {
        if (items.length === 0) {
            router.push('/shop');
        }
    }, [items, router]);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                </div>

                {/* Checkout Form wrapped in Stripe Elements */}
                <Elements stripe={stripePromise}>
                    <CheckoutForm
                        items={items}
                        totalPrice={totalPrice}
                        clearCart={clearCart}
                        user={user}
                    />
                </Elements>
            </div>
        </div>
    );
}
