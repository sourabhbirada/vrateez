import api from "./axios";
import type { ApiResponse, Deal } from "./types";

export async function getDealsApi(placement?: "homepage" | "landing") {
  const res = await api.get<ApiResponse<{ items: Deal[] }>>("/deals", {
    params: placement ? { placement } : undefined,
  });
  return res.data.data.items;
}
