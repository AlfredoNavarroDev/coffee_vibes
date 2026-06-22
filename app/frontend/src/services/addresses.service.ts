import { api } from "@/lib/api-client";
import type { Address, ApiSuccess } from "@/types";

export interface AddressPayload {
  street: string;
  city: string;
  reference?: string;
  isDefault?: boolean;
}

export const addressesApi = {
  async list() {
    const { data } = await api.get<ApiSuccess<Address[]>>("/addresses");
    return data.data;
  },

  async get(id: number) {
    const { data } = await api.get<ApiSuccess<Address>>(`/addresses/${id}`);
    return data.data;
  },

  async create(payload: AddressPayload) {
    const { data } = await api.post<ApiSuccess<Address>>(
      "/addresses",
      payload
    );
    return data.data;
  },

  async update(id: number, payload: Partial<AddressPayload>) {
    const { data } = await api.put<ApiSuccess<Address>>(
      `/addresses/${id}`,
      payload
    );
    return data.data;
  },

  async remove(id: number) {
    const { data } = await api.delete<ApiSuccess<null>>(`/addresses/${id}`);
    return data;
  },
};
