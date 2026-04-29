import api from "./axios";
import type { ApiResponse, Order, PaymentIntent } from "./types";

export type PaymentProvider = "razorpay";

// For authenticated users
export async function createPaymentIntentApi(orderId: string, provider: PaymentProvider = "razorpay") {
  const res = await api.post<ApiResponse<PaymentIntent>>("/payments/intent", { orderId, provider });
  return res.data.data;
}

export async function verifyPaymentApi(input: {
  orderId: string;
  provider?: PaymentProvider;
  // Razorpay fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  // Stripe fields
  paymentIntentId?: string;
}) {
  const res = await api.post<ApiResponse<{ payment: PaymentIntent["payment"]; order: Order }>>("/payments/verify", input);
  return res.data.data;
}

export async function confirmCodOrderApi(orderId: string) {
  const res = await api.post<ApiResponse<{ order: Order }>>("/payments/confirm-cod", { orderId });
  return res.data.data.order;
}

// Legacy mock payment confirmation
export async function confirmPaymentApi(input: { paymentId: string; success?: boolean }) {
  const res = await api.post<ApiResponse<{ payment: PaymentIntent["payment"]; order: Order }>>("/payments/confirm", input);
  return res.data.data;
}

// For guest users
export async function createGuestPaymentApi(orderId: string, email: string, provider: PaymentProvider = "razorpay") {
  const res = await api.post<ApiResponse<PaymentIntent>>("/guest/payments/create", { orderId, email, provider });
  return res.data.data;
}

export async function verifyGuestPaymentApi(input: {
  orderId: string;
  email: string;
  provider?: PaymentProvider;
  // Razorpay fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  // Stripe fields
  paymentIntentId?: string;
}) {
  const res = await api.post<ApiResponse<{ payment: PaymentIntent["payment"]; order: Order }>>("/guest/payments/verify", input);
  return res.data.data;
}
