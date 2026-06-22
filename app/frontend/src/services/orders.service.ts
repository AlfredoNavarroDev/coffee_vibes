import { api } from "@/lib/api-client";
import type { ApiSuccess, CreateOrderPayload, Order, OrderStatus } from "@/types";

export const ordersApi = {
  async list() {
    const { data } = await api.get<ApiSuccess<Order[]>>("/orders");
    return data.data;
  },

  async get(id: number) {
    const { data } = await api.get<ApiSuccess<Order>>(`/orders/${id}`);
    return data.data;
  },

  async create(payload: CreateOrderPayload) {
    const { data } = await api.post<ApiSuccess<Order>>("/orders", payload);
    return data.data;
  },

  async updateStatus(id: number, status: OrderStatus) {
    const { data } = await api.patch<ApiSuccess<Order>>(
      `/orders/${id}/status`,
      { status }
    );
    return data.data;
  },
};
