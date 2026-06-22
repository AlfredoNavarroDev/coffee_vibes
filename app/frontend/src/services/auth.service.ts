import { api } from "@/lib/api-client";
import type { ApiSuccess, AuthResponse, User } from "@/types";

export interface RegisterPayload {
  email: string;
  name: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  async register(payload: RegisterPayload) {
    const { data } = await api.post<ApiSuccess<AuthResponse>>(
      "/auth/register",
      payload
    );
    return data.data;
  },

  async login(payload: LoginPayload) {
    const { data } = await api.post<ApiSuccess<AuthResponse>>(
      "/auth/login",
      payload
    );
    return data.data;
  },

  async me() {
    const { data } = await api.get<ApiSuccess<User>>("/auth/me");
    return data.data;
  },
};
