import api from "./axios";
import type { ApiResponse, Category } from "./types";

export async function getCategoriesApi() {
  const res = await api.get<ApiResponse<{ items: Category[] }>>("/categories");
  return res.data.data.items;
}
