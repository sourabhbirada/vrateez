import api from "./axios";
import type { ApiResponse, AuthUser } from "./types";

interface AuthPayload {
  token: string;
  user: AuthUser;
}

export type RegisterResponse =
  | AuthPayload
  | {
      requiresEmailOtp: true;
      email: string;
    };

export async function registerApi(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const res = await api.post<ApiResponse<RegisterResponse>>("/auth/register", input);
  return res.data.data;
}

export async function loginApi(input: { email: string; password: string }) {
  const res = await api.post<ApiResponse<AuthPayload>>("/auth/login", input);
  return res.data.data;
}

export async function requestEmailOtpApi(email: string) {
  const res = await api.post<ApiResponse<{ email: string }>>("/auth/request-otp", { email });
  return res.data.data;
}

export async function verifyEmailOtpApi(input: { email: string; otp: string }) {
  const res = await api.post<ApiResponse<AuthPayload>>("/auth/verify-otp", input);
  return res.data.data;
}

export async function meApi() {
  const res = await api.get<ApiResponse<{ user: AuthUser }>>("/auth/me");
  return res.data.data.user;
}
