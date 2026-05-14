import api from "./axios";
import type { ApiResponse, Faq } from "./types";

export async function getFaqsApi() {
  const res = await api.get<ApiResponse<{ items: Faq[] }>>("/faqs");
  return res.data.data.items;
}
