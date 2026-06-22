// Tipos del dominio Coffee Vibes, calcados del schema.prisma del backend.

export type Role = "CUSTOMER" | "OWNER" | "ADMIN";

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  phone?: string | null;
  googleId?: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  products?: { id: number }[];
}

export type Size = "SMALL" | "MEDIUM" | "LARGE";

export interface ProductSize {
  id: number;
  productId: number;
  size: Size;
  price: string; // Decimal viene como string desde Prisma/JSON
}

export interface ProductModifier {
  id: number;
  productId: number;
  name: string;
  extraPrice: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  categoryId: number;
  category?: Category;
  productType: string;
  hasSizes: boolean;
  basePrice: string;
  stock: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  sizes?: ProductSize[];
  modifiers?: ProductModifier[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Address {
  id: number;
  userId: number;
  street: string;
  city: string;
  reference?: string | null;
  isDefault: boolean;
}

export type DeliveryType = "DELIVERY" | "LOCAL";
export type OrderStatus = "PENDING" | "PAID" | "PREPARING" | "READY" | "DELIVERED";

export interface OrderItemModifier {
  id: number;
  orderItemId: number;
  modifierId: number;
  extraPrice: string;
  modifier?: ProductModifier;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productSizeId?: number | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  product?: Product;
  productSize?: ProductSize | null;
  modifiers?: OrderItemModifier[];
}

export type PaymentStatus = "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED";

export interface Payment {
  id: number;
  orderId: number;
  mpPaymentId?: string | null;
  mpPreferenceId?: string | null;
  status: PaymentStatus;
  amount: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: number;
  userId: number;
  user?: { id: number; name: string | null; email: string };
  addressId?: number | null;
  address?: Address | null;
  deliveryType: DeliveryType;
  status: OrderStatus;
  subtotal: string;
  deliveryFee: string;
  total: string;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  payment?: Payment | null;
}

// ── Payloads de creación ──

export interface CreateOrderItemPayload {
  productId: number;
  productSizeId?: number | null;
  quantity: number;
  modifiers?: { modifierId: number }[];
}

export interface CreateOrderPayload {
  deliveryType: DeliveryType;
  addressId?: number | null;
  notes?: string | null;
  items: CreateOrderItemPayload[];
}

export interface CreatePreferenceResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}

// ── Envelope estándar de respuesta del backend ──

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: Pagination;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
