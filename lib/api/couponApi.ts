import api from "./axios";
import type { ApiResponse } from "./types";

export interface CouponValidationData {
  couponCode: string;
  discountAmount: number;
  description: string;
}

export async function validateCouponApi(input: { couponCode: string; subtotal: number }) {
  const res = await api.post<ApiResponse<CouponValidationData>>("/coupons/validate", input);
  return res.data.data;
}
