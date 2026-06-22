import { api } from "@/lib/api-client";
import type { ApiSuccess, Category, Pagination, Product } from "@/types";

export interface ProductFilters {
  categoryId?: number;
  productType?: string;
  page?: number;
  limit?: number;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  imageUrl?: string;
  categoryId: number;
  productType: string;
  hasSizes?: boolean;
  basePrice: string | number;
  stock?: number;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export const catalogApi = {
  async listProducts(filters: ProductFilters = {}) {
    const { data } = await api.get<
      ApiSuccess<Product[]> & { pagination: Pagination }
    >("/products", { params: filters });
    return { products: data.data, pagination: data.pagination };
  },

  async getProduct(id: number) {
    const { data } = await api.get<ApiSuccess<Product>>(`/products/${id}`);
    return data.data;
  },

  async createProduct(payload: CreateProductPayload) {
    const { data } = await api.post<ApiSuccess<Product>>("/products", payload);
    return data.data;
  },

  async updateProduct(id: number, payload: UpdateProductPayload) {
    const { data } = await api.put<ApiSuccess<Product>>(
      `/products/${id}`,
      payload
    );
    return data.data;
  },

  async updateStock(id: number, stock: number) {
    const { data } = await api.patch<ApiSuccess<Product>>(
      `/products/${id}/stock`,
      { stock }
    );
    return data.data;
  },

  async deleteProduct(id: number) {
    const { data } = await api.delete<ApiSuccess<null>>(`/products/${id}`);
    return data;
  },
};

export const categoriesApi = {
  async list() {
    const { data } = await api.get<ApiSuccess<Category[]>>("/categories");
    return data.data;
  },

  async create(name: string) {
    const { data } = await api.post<ApiSuccess<Category>>("/categories", {
      name,
    });
    return data.data;
  },

  async update(id: number, name: string) {
    const { data } = await api.put<ApiSuccess<Category>>(
      `/categories/${id}`,
      { name }
    );
    return data.data;
  },
};
