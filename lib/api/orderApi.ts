import api from "./axios";
import type { ApiResponse, Order } from "./types";

export async function createOrderApi(input: {
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
  };
  paymentMethod: "card" | "upi" | "netbanking" | "cod";
  notes?: string;
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
