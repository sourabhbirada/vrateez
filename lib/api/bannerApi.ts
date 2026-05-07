import api from "./axios";
import type { ApiResponse, Banner } from "./types";

export async function getBannersApi() {
  const res = await api.get<ApiResponse<{ items: Banner[] }>>("/banners");
  return res.data.data.items;
}
