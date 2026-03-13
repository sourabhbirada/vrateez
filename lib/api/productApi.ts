import api from "./axios";
import type { ApiResponse, Product } from "./types";

interface ProductListData {
  items: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getProductsApi(params?: {
  category?: string;
  q?: string;
  page?: number;
  limit?: number;
}) {
  const res = await api.get<ApiResponse<ProductListData>>("/products", { params });
  return res.data.data;
}

export async function getProductBySlugApi(slug: string) {
  const res = await api.get<ApiResponse<{ product: Product }>>(`/products/${slug}`);
  return res.data.data.product;
}
