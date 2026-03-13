import api from "./axios";
import type { ApiResponse, Cart } from "./types";

export async function getCartApi() {
  const res = await api.get<ApiResponse<{ cart: Cart }>>("/cart");
  return res.data.data.cart;
}

export async function addCartItemApi(input: { productId: string; quantity?: number }) {
  const res = await api.post<ApiResponse<{ cart: Cart }>>("/cart/items", input);
  return res.data.data.cart;
}

export async function updateCartItemApi(productId: string, quantity: number) {
  const res = await api.patch<ApiResponse<{ cart: Cart }>>(`/cart/items/${productId}`, { quantity });
  return res.data.data.cart;
}

export async function removeCartItemApi(productId: string) {
  const res = await api.delete<ApiResponse<{ cart: Cart }>>(`/cart/items/${productId}`);
  return res.data.data.cart;
}

export async function clearCartApi() {
  const res = await api.delete<ApiResponse<{ cart: Cart }>>("/cart");
  return res.data.data.cart;
}
