import api from "./axios";
import type { ApiResponse, Order, GuestInfo, ShippingAddress } from "./types";

// For authenticated users
export async function createOrderApi(input: {
  shippingAddress: ShippingAddress;
  paymentMethod: "card" | "upi" | "netbanking" | "cod" | "razorpay";
  notes?: string;
  couponCode?: string;
}) {
  const res = await api.post<ApiResponse<{ order: Order }>>("/orders", input);
  return res.data.data.order;
}

export async function getMyOrdersApi() {
  const res = await api.get<ApiResponse<{ orders: Order[] }>>("/orders/me");
  return res.data.data.orders;
}

export async function getOrderByIdApi(orderId: string) {
  const res = await api.get<ApiResponse<{ order: Order }>>(`/orders/${orderId}`);
  return res.data.data.order;
}

// For guest users
export async function createGuestOrderApi(input: {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: ShippingAddress;
  paymentMethod: "card" | "upi" | "netbanking" | "cod" | "razorpay";
  guestInfo: GuestInfo;
  notes?: string;
  couponCode?: string;
}) {
  const res = await api.post<ApiResponse<{ order: Order }>>("/guest/orders", input);
  return res.data.data.order;
}

export async function getGuestOrderApi(orderId: string, email: string) {
  const res = await api.get<ApiResponse<{ order: Order }>>(`/guest/orders/${orderId}?email=${encodeURIComponent(email)}`);
  return res.data.data.order;
}

export async function confirmGuestCodOrderApi(orderId: string, email: string) {
  const res = await api.post<ApiResponse<{ order: Order }>>("/guest/orders/confirm-cod", { orderId, email });
  return res.data.data.order;
}
