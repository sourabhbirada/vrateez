import api from "./axios";
import type { ApiResponse, SiteSettings } from "./types";

export async function getSettingsApi() {
  const res = await api.get<ApiResponse<{ settings: SiteSettings }>>("/settings");
  return res.data.data.settings;
}
