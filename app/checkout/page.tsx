'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, CreditCard, Loader2, Phone, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { createOrderApi, createGuestOrderApi, confirmGuestCodOrderApi } from '@/lib/api/orderApi';
import { createPaymentIntentApi, verifyPaymentApi, confirmCodOrderApi, createGuestPaymentApi, verifyGuestPaymentApi } from '@/lib/api/paymentApi';
import { validateCouponApi } from '@/lib/api/couponApi';
import { getProductsApi } from '@/lib/api/productApi';
import { isPaymentCancelledError, openRazorpayCheckout } from '@/lib/razorpay';
import type { ShippingAddress, GuestInfo, Order } from '@/lib/api/types';

type CheckoutPaymentMode = 'online' | 'cod';

const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

const isObjectId = (id: string): boolean => OBJECT_ID_REGEX.test(id);

const normalizeText = (value: string): string =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

const PAYMENT_MODES: Array<{
    id: CheckoutPaymentMode;
    label: string;
    description: string;
    icon: typeof CreditCard;
}> = [
    {
        id: 'online',
        label: 'Pay online',
        description: 'UPI, cards, netbanking, wallets & more — opens Razorpay checkout',
        icon: CreditCard,
    },
    {
        id: 'cod',
        label: 'Cash on Delivery',
        description: 'Pay when your order arrives',
        icon: Truck,
    },
];

function digitsOnlyPhone(value: string): string {
    const d = value.replace(/\D/g, '');
    if (d.length >= 12 && d.startsWith('91')) return d.slice(-10);
    if (d.length >= 10) return d.slice(-10);
    return d;
}

const inputCls =
    'w-full border border-ink/12 rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-turmeric/35 focus:border-turmeric outline-none transition bg-white text-ink placeholder:text-ink/30 shadow-[inset_0_1px_0_rgba(36,31,22,0.02)]';

function SectionCard({
    step,
    title,
    subtitle,
    children,
}: {
    step?: string;
    title: string;
    subtitle?: string;
    children: ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-ink/10 bg-white shadow-[0_10px_40px_-24px_rgba(36,31,22,0.35)] overflow-hidden">
            <div className="px-6 py-4 border-b border-ink/8 bg-linear-to-r from-parchment/80 to-white flex items-center gap-3">
                {step ? (
                    <span className="w-7 h-7 rounded-full bg-ink text-parchment text-xs font-bold flex items-center justify-center shrink-0">
                        {step}
                    </span>
                ) : null}
                <div>
                    <h2 className="font-display italic text-lg text-ink leading-tight">{title}</h2>
                    {subtitle ? <p className="text-xs text-ink/45 mt-0.5">{subtitle}</p> : null}
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

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
    const { settings } = useSettings();

    const [isLoading, setIsLoading] = useState(false);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [infoMessage, setInfoMessage] = useState<string | null>(null);
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{
        couponCode: string;
        discountAmount: number;
        description: string;
    } | null>(null);

    const [guestInfo, setGuestInfo] = useState<GuestInfo>({
        name: '',
        email: '',
        phone: '',
    });

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
    });

    const [paymentMode, setPaymentMode] = useState<CheckoutPaymentMode>('online');
    const [contactPhone, setContactPhone] = useState('');

    useEffect(() => {
        if (user?.phone) {
            setContactPhone(user.phone);
        }
    }, [user?.phone]);

    const subtotal = totalPrice;
    const freeShippingThreshold = settings?.shipping?.freeShippingThreshold ?? 499;
    const standardShippingFee = settings?.shipping?.standardShippingFee ?? 49;
    
    // Check if any item has free delivery enabled
    const hasFreeDeliveryProduct = items.some(item => item.freeDelivery === true);
    
    const shippingCharge = (subtotal >= freeShippingThreshold || hasFreeDeliveryProduct) ? 0 : standardShippingFee;
    const discountAmount = appliedCoupon?.discountAmount || 0;
    const total = Math.max(subtotal - discountAmount + shippingCharge, 0);

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) {
            setError('Please enter a coupon code');
            return;
        }

        setError(null);
        setInfoMessage(null);
        setIsApplyingCoupon(true);

        try {
            const result = await validateCouponApi({
                couponCode: couponInput.trim(),
                subtotal,
                shippingCharge,
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

        if (user && paymentMode === 'online') {
            const d = digitsOnlyPhone(contactPhone);
            if (d.length < 10) {
                setError('Enter a valid 10-digit mobile for Razorpay and SMS updates');
                return false;
            }
        }

        return true;
    };

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
                throw new Error(`Product "${item.name}" is outdated in cart. Please remove it and add again.`);
            }

            return {
                productId: matchedProduct._id,
                quantity: item.quantity,
            };
        });
    };

    const handlePlaceOrder = async () => {
        setError(null);
        setInfoMessage(null);

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            let order: Order;
            const orderPaymentMethod = paymentMode === 'cod' ? 'cod' : 'razorpay';

            if (user) {
                order = await createOrderApi({
                    shippingAddress,
                    paymentMethod: orderPaymentMethod,
                    couponCode: appliedCoupon?.couponCode,
                    ...(paymentMode === 'online' ? { contactPhone } : {}),
                });
            } else {
                const guestItems = await resolveGuestOrderItems();
                order = await createGuestOrderApi({
                    items: guestItems,
                    shippingAddress,
                    paymentMethod: orderPaymentMethod,
                    guestInfo,
                    couponCode: appliedCoupon?.couponCode,
                });
            }

            if (paymentMode === 'cod') {
                if (user) {
                    await confirmCodOrderApi(order._id);
                } else {
                    await confirmGuestCodOrderApi(order._id, guestInfo.email);
                }

                clearCart();
                router.push(`/order-success?orderId=${order._id}&email=${encodeURIComponent(guestInfo.email || user?.email || '')}`);
                return;
            }

            const paymentIntent = user
                ? await createPaymentIntentApi(order._id, 'razorpay')
                : await createGuestPaymentApi(order._id, guestInfo.email, 'razorpay');

            if (paymentIntent.provider === 'razorpay' && paymentIntent.razorpayOrderId && paymentIntent.razorpayKeyId) {
                await new Promise<void>((resolve) => {
                    queueMicrotask(() => resolve());
                });

                const razorpayContact = user ? digitsOnlyPhone(contactPhone) : digitsOnlyPhone(guestInfo.phone);

                const response = await openRazorpayCheckout({
                    key: paymentIntent.razorpayKeyId,
                    amount: paymentIntent.amount,
                    currency: paymentIntent.currency,
                    name: 'Vrateez',
                    description: `Order #${order._id.slice(-6).toUpperCase()}`,
                    order_id: paymentIntent.razorpayOrderId,
                    prefill: {
                        name: user?.name || guestInfo.name,
                        email: user?.email || guestInfo.email,
                        contact: razorpayContact,
                    },
                    theme: {
                        color: '#C4711F',
                    },
                    handler: () => {},
                });

                try {
                    if (user) {
                        await verifyPaymentApi({
                            orderId: order._id,
                            provider: 'razorpay',
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });
                    } else {
                        await verifyGuestPaymentApi({
                            orderId: order._id,
                            email: guestInfo.email,
                            provider: 'razorpay',
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });
                    }
                } catch (verifyErr) {
                    const msg =
                        verifyErr instanceof Error ? verifyErr.message : 'Payment could not be verified. Please try again.';
                    const qs = new URLSearchParams({ orderId: order._id, message: msg });
                    if (!user && guestInfo.email) {
                        qs.set('email', guestInfo.email);
                    }
                    router.push(`/order-payment-error?${qs.toString()}`);
                    return;
                }
            } else {
                throw new Error('Online payment is currently unavailable. Please try Cash on Delivery or contact support.');
            }

            clearCart();
            router.push(`/order-success?orderId=${order._id}&email=${encodeURIComponent(guestInfo.email || user?.email || '')}`);
        } catch (err) {
            console.error('Checkout error:', err);
            if (isPaymentCancelledError(err)) {
                setInfoMessage(
                    'Payment window was closed. Your order may be pending — use Pay again when you are ready, or choose Cash on Delivery.',
                );
                return;
            }
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 space-y-5">
                {!user && (
                    <SectionCard step="1" title="Contact Information" subtitle="We'll send order updates here">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-ink/55 mb-1.5">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={guestInfo.name}
                                    onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                                    className={inputCls}
                                    placeholder="Your full name"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-ink/55 mb-1.5">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={guestInfo.email}
                                        onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                                        className={inputCls}
                                        placeholder="you@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wide text-ink/55 mb-1.5">
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        value={guestInfo.phone}
                                        onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                                        className={inputCls}
                                        placeholder="9876543210"
                                    />
                                </div>
                            </div>
                        </div>
                    </SectionCard>
                )}

                <SectionCard
                    step={user ? '1' : '2'}
                    title="Shipping Address"
                    subtitle="Where should we deliver your order?"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/55 mb-1.5">
                                Address Line 1 *
                            </label>
                            <input
                                type="text"
                                value={shippingAddress.line1}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, line1: e.target.value })}
                                className={inputCls}
                                placeholder="House/Flat No., Building Name"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wide text-ink/55 mb-1.5">
                                Address Line 2
                            </label>
                            <input
                                type="text"
                                value={shippingAddress.line2}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, line2: e.target.value })}
                                className={inputCls}
                                placeholder="Street, Area, Landmark"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-ink/55 mb-1.5">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                    className={inputCls}
                                    placeholder="Mumbai"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-ink/55 mb-1.5">
                                    State *
                                </label>
                                <input
                                    type="text"
                                    value={shippingAddress.state}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                    className={inputCls}
                                    placeholder="Maharashtra"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wide text-ink/55 mb-1.5">
                                    Pincode *
                                </label>
                                <input
                                    type="text"
                                    value={shippingAddress.pincode}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                                    className={inputCls}
                                    placeholder="400001"
                                    maxLength={6}
                                />
                            </div>
                        </div>
                    </div>
                </SectionCard>

                <SectionCard
                    step={user ? '2' : '3'}
                    title="Payment"
                    subtitle="Pay online via Razorpay or choose Cash on Delivery"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {PAYMENT_MODES.map((mode) => {
                            const Icon = mode.icon;
                            const selected = paymentMode === mode.id;

                            return (
                                <label
                                    key={mode.id}
                                    className={`flex items-start gap-3 p-4 rounded-xl cursor-pointer transition border ${
                                        selected
                                            ? 'border-turmeric bg-turmeric/8 ring-1 ring-turmeric/30'
                                            : 'border-ink/10 bg-parchment/40 hover:border-ink/20'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMode"
                                        value={mode.id}
                                        checked={selected}
                                        onChange={() => setPaymentMode(mode.id)}
                                        className="mt-1 h-4 w-4 accent-turmeric"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon size={18} className={selected ? 'text-clay' : 'text-ink/45'} />
                                            <p className="font-semibold text-ink text-sm">{mode.label}</p>
                                        </div>
                                        <p className="text-xs text-ink/50 leading-relaxed">{mode.description}</p>
                                    </div>
                                </label>
                            );
                        })}
                    </div>

                    {user && paymentMode === 'online' && (
                        <div className="mt-5">
                            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink/55 mb-1.5">
                                <Phone size={14} className="text-ink/45" />
                                Mobile for Razorpay & updates *
                            </label>
                            <input
                                type="tel"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                className={inputCls}
                                placeholder="9876543210"
                                autoComplete="tel"
                            />
                            <p className="text-xs text-ink/40 mt-1.5">Saved to your account when you place the order.</p>
                        </div>
                    )}
                </SectionCard>
            </div>

            <div className="lg:col-span-2">
                <div className="rounded-2xl border border-ink/10 bg-white shadow-[0_18px_50px_-28px_rgba(36,31,22,0.45)] sticky top-24 overflow-hidden">
                    <div className="px-6 py-4 border-b border-ink/8 bg-ink text-parchment">
                        <h2 className="font-display italic text-lg">Order Summary</h2>
                        <p className="text-xs text-parchment/55 mt-0.5">{items.length} item{items.length === 1 ? '' : 's'} in cart</p>
                    </div>

                    <div className="p-6">
                        <div className="space-y-3 max-h-56 overflow-y-auto mb-5 pr-1">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-3">
                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-ink/8 bg-parchment">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        {item.freeDelivery && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-basil/90 text-white text-[9px] font-bold text-center py-0.5">
                                                FREE 🎁
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                                        <p className="text-xs text-ink/45">Qty {item.quantity}</p>
                                        {item.freeDelivery && (
                                            <span className="text-[10px] text-basil font-semibold">Free Delivery</span>
                                        )}
                                    </div>
                                    <p className="text-sm font-semibold text-ink shrink-0">
                                        ₹{item.price * item.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-2 mb-4">
                            <label className="text-xs font-semibold uppercase tracking-wide text-ink/55">
                                Coupon Code
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                    placeholder="Enter coupon"
                                    className="flex-1 border border-ink/12 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-turmeric/35 focus:border-turmeric outline-none bg-white text-ink"
                                />
                                <button
                                    type="button"
                                    onClick={handleApplyCoupon}
                                    disabled={isApplyingCoupon}
                                    className="px-4 py-2.5 rounded-xl bg-ink text-parchment text-sm font-semibold hover:bg-basil disabled:opacity-50 transition"
                                >
                                    {isApplyingCoupon ? '…' : 'Apply'}
                                </button>
                            </div>
                            {appliedCoupon && (
                                <div className="flex items-center justify-between bg-basil/10 border border-basil/20 rounded-xl px-3 py-2 text-sm">
                                    <span className="text-basil font-medium">
                                        {appliedCoupon.couponCode} applied
                                        {appliedCoupon.description && ` · ${appliedCoupon.description}`}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleRemoveCoupon}
                                        className="text-basil font-semibold hover:underline text-xs"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2.5 border-t border-ink/8 pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-ink/55">Subtotal</span>
                                <span className="font-medium text-ink">₹{subtotal}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-basil">Discount</span>
                                    <span className="font-medium text-basil">-₹{discountAmount}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-ink/55">Shipping</span>
                                <span className={`font-medium ${shippingCharge === 0 ? 'text-basil' : 'text-ink'}`}>
                                    {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                                </span>
                            </div>
                            {hasFreeDeliveryProduct && shippingCharge === 0 && (
                                <div className="flex items-center gap-1.5 text-xs text-basil bg-basil/8 rounded-lg px-2.5 py-1.5">
                                    <span>🎁</span>
                                    <span className="font-medium">Free delivery included with your product!</span>
                                </div>
                            )}
                            {!hasFreeDeliveryProduct && shippingCharge > 0 && (
                                <p className="text-xs text-turmeric bg-turmeric/8 rounded-lg px-2.5 py-1.5">
                                    Add ₹{Math.max(freeShippingThreshold - subtotal, 0)} more for free shipping
                                </p>
                            )}
                            <div className="flex justify-between text-lg font-bold pt-3 border-t border-ink/8 text-ink">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>

                        {infoMessage && (
                            <div className="mt-4 p-3 bg-ink/5 border border-ink/10 rounded-xl text-ink/80 text-sm">
                                {infoMessage}
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 p-3 bg-clay/10 border border-clay/20 rounded-xl text-clay text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isLoading}
                            className="w-full mt-5 bg-turmeric text-parchment py-4 rounded-xl font-bold text-base hover:bg-clay disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-turmeric/25"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    {paymentMode === 'cod' ? 'Place Order' : `Pay ₹${total}`}
                                </>
                            )}
                        </button>

                        <p className="text-[11px] text-ink/40 text-center mt-4 leading-relaxed">
                            Secure checkout · Confirmation email & WhatsApp alerts after order
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        if (items.length === 0) {
            router.push('/shop');
        }
    }, [items, router]);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-parchment py-8 md:py-12">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                <div className="mb-8 md:mb-10">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-ink/55 hover:text-ink transition mb-4 text-sm"
                    >
                        <ArrowLeft size={18} />
                        <span>Back to cart</span>
                    </button>
                    <h1 className="font-display italic text-3xl md:text-4xl text-ink">Checkout</h1>
                    <p className="text-sm text-ink/50 mt-2">
                        Complete your details — we&apos;ll email confirmation and notify the store on WhatsApp.
                    </p>
                </div>

                <CheckoutForm
                    items={items}
                    totalPrice={totalPrice}
                    clearCart={clearCart}
                    user={user}
                />
            </div>
        </div>
    );
}