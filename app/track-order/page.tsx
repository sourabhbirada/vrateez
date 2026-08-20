'use client';

import { useState } from 'react';
import { Search, Package, MapPin, Clock, Truck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

type TrackingEvent = {
  message: string;
  status: string;
  statusLabel: string;
  datetime: string;
  source: string;
  location: {
    city: string;
    state: string;
    country: string;
    zip: string;
  };
};

type TrackingData = {
  trackingNumber: string;
  trackingProvider: string;
  orderId: string;
  status: string;
  statusLabel: string;
  estimatedDelivery: string | null;
  lastEventTime: string;
  destinationCity: string | null;
  destinationState: string | null;
  events: TrackingEvent[];
};

type Order = {
  _id: string;
  orderId?: string;
  trackingNumber?: string;
  courierPartner?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: number;
  shippingCharge: number;
  discountAmount: number;
  totalAmount: number;
  createdAt: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

const statusColors: Record<string, string> = {
  placed: 'bg-blue-100 text-blue-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const trackingStatusColors: Record<string, string> = {
  pre_transit: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  failure: 'bg-red-100 text-red-700',
};

export default function TrackOrderPage() {
  const [searchType, setSearchType] = useState<'orderId' | 'trackingNumber'>('orderId');
  const [searchValue, setSearchValue] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [tracking, setTracking] = useState<TrackingData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      setError('Please enter an Order ID or Tracking Number');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);
    setTracking(null);

    try {
      if (searchType === 'orderId') {
        // Search by Order ID (requires email for guest orders)
        const emailParam = email ? `?email=${encodeURIComponent(email)}` : '';
        const response = await fetch(`${API_BASE_URL}/orders/track/${searchValue}${emailParam}`, {
          headers: {
            'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
          },
        });

        const data = await response.json();

        if (!data.status) {
          throw new Error(data.message || 'Order not found');
        }

        setOrder(data.data.order);

        // Fetch tracking if available
        if (data.data.order.trackingNumber) {
          const trackingResponse = await fetch(
            `${API_BASE_URL}/orders/${data.data.order._id}/tracking`,
            {
              headers: {
                'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
              },
            }
          );
          const trackingData = await trackingResponse.json();
          if (trackingData.status && trackingData.data.hasTracking) {
            setTracking(trackingData.data.tracking);
          }
        }
      } else {
        // Search by Tracking Number
        // First, we need to find the order with this tracking number
        // Since we don't have a direct endpoint, we'll show a message
        setError('Please use Order ID to track your order. You can find it in your order confirmation email.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-4">
            <Package size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Enter your Order ID to see real-time delivery status and tracking information
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Search Type Toggle */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => setSearchType('orderId')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                  searchType === 'orderId'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Order ID
              </button>
              <button
                type="button"
                onClick={() => setSearchType('trackingNumber')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                  searchType === 'trackingNumber'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tracking Number
              </button>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {searchType === 'orderId' ? 'Order ID' : 'Tracking Number'}
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={searchType === 'orderId' ? 'e.g., VRZ001' : 'e.g., SF123456789'}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                />
              </div>
            </div>

            {/* Email Input (for guest orders) */}
            {searchType === 'orderId' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-gray-400 font-normal">(optional for logged in users)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter the email used during checkout if you're not logged in
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle size={18} className="flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Info Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order {order.orderId || `#${order._id.slice(-8)}`}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    statusColors[order.orderStatus] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {order.orderStatus.toUpperCase()}
                </span>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600">-{formatCurrency(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">
                      {order.shippingCharge === 0 ? 'FREE' : formatCurrency(order.shippingCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-orange-500">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin size={18} />
                  Shipping Address
                </h3>
                <div className="text-sm text-gray-700">
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking Info Card */}
            {tracking ? (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Truck size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Live Tracking</h2>
                    <p className="text-sm text-gray-500">Real-time shipment updates</p>
                  </div>
                </div>

                {/* Tracking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                    <p className="font-mono font-semibold text-gray-900">{tracking.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Courier Partner</p>
                    <p className="font-semibold text-gray-900 capitalize">{tracking.trackingProvider}</p>
                  </div>
                </div>

                {/* Current Status */}
                <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
                        trackingStatusColors[tracking.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tracking.statusLabel}
                    </span>
                    {tracking.lastEventTime && (
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock size={14} />
                        {formatDate(tracking.lastEventTime)}
                      </span>
                    )}
                  </div>
                  {tracking.destinationCity && (
                    <p className="text-sm text-gray-700 flex items-center gap-1">
                      <MapPin size={14} />
                      Destination: {tracking.destinationCity}
                      {tracking.destinationState && `, ${tracking.destinationState}`}
                    </p>
                  )}
                  {tracking.estimatedDelivery && (
                    <p className="text-sm text-gray-700 mt-2">
                      Estimated Delivery: {formatDate(tracking.estimatedDelivery)}
                    </p>
                  )}
                </div>

                {/* Tracking Timeline */}
                {tracking.events && tracking.events.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Tracking Timeline</h3>
                    <div className="space-y-4">
                      {tracking.events.map((event, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-4 h-4 rounded-full ${
                                index === 0
                                  ? 'bg-orange-500 ring-4 ring-orange-100'
                                  : 'bg-gray-300'
                              }`}
                            />
                            {index < tracking.events.length - 1 && (
                              <div className="w-0.5 h-full bg-gray-300 mt-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-start justify-between mb-1">
                              <p className="font-medium text-gray-900">{event.message}</p>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                {formatDate(event.datetime)}
                              </span>
                            </div>
                            {(event.location.city || event.source) && (
                              <p className="text-sm text-gray-600">
                                {event.location.city && `${event.location.city}, `}
                                {event.location.state && `${event.location.state} • `}
                                {event.source}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : order.trackingNumber ? (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Truck size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tracking Information</h3>
                <p className="text-gray-600 mb-4">
                  Tracking Number: <span className="font-mono font-semibold">{order.trackingNumber}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Tracking details are being fetched from the courier. Please check back in a few moments.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Package size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tracking Available Yet</h3>
                <p className="text-sm text-gray-600">
                  Your order is being processed. Tracking information will be available once your order is shipped.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
