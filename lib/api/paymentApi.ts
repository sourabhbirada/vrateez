import api from "./axios";
import type { ApiResponse, Order } from "./types";

interface PaymentEntity {
  _id: string;
  paymentId: string;
  transactionId?: string;
  amount: number;
  currency: string;
  status: "created" | "success" | "failed";
}

export async function createPaymentIntentApi(orderId: string) {
  const res = await api.post<ApiResponse<{ payment: PaymentEntity }>>("/payments/intent", { orderId });
  return res.data.data.payment;
}

export async function confirmPaymentApi(input: { paymentId: string; success?: boolean }) {
  const res = await api.post<ApiResponse<{ payment: PaymentEntity; order: Order }>>("/payments/confirm", input);
  return res.data.data;
}
