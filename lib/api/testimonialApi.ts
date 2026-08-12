import api from "./axios";
import type { ApiResponse, Testimonial } from "./types";

export async function getTestimonialsApi() {
  const res = await api.get<ApiResponse<{ items: Testimonial[] }>>("/testimonials");
  return res.data.data.items;
}
