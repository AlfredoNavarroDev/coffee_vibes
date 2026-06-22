import { api } from "@/lib/api-client";
import type { ApiSuccess, CreatePreferenceResponse, Payment } from "@/types";

export const paymentsApi = {
  async createPreference(orderId: number) {
    const { data } = await api.post<ApiSuccess<CreatePreferenceResponse>>(
      "/payments/create-preference",
      { orderId }
    );
    return data.data;
  },

  async getByOrder(orderId: number) {
    const { data } = await api.get<ApiSuccess<Payment>>(
      `/payments/${orderId}`
    );
    return data.data;
  },
};
