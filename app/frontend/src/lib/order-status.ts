import type { OrderStatus, PaymentStatus, Size } from "@/types";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PREPARING",
  "READY",
  "DELIVERED",
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pendiente de pago",
  PAID: "Pagado",
  PREPARING: "En preparación",
  READY: "Listo",
  DELIVERED: "Entregado",
};

export const ORDER_STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: "bg-miel-claro/30 text-tueste-oscuro border-miel",
  PAID: "bg-oliva/15 text-oliva-oscuro border-oliva",
  PREPARING: "bg-tueste/15 text-tueste-oscuro border-tueste",
  READY: "bg-verde-ok/15 text-verde-ok border-verde-ok",
  DELIVERED: "bg-espresso/10 text-espresso border-espresso/40",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
  REFUNDED: "Reembolsado",
};

export const SIZE_LABEL: Record<Size, string> = {
  SMALL: "Chico",
  MEDIUM: "Mediano",
  LARGE: "Grande",
};

export function nextOrderStatus(current: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUS_FLOW.indexOf(current);
  if (idx === -1 || idx === ORDER_STATUS_FLOW.length - 1) return null;
  return ORDER_STATUS_FLOW[idx + 1];
}

export function availableNextStatuses(current: OrderStatus): OrderStatus[] {
  const idx = ORDER_STATUS_FLOW.indexOf(current);
  if (idx === -1) return [];
  return ORDER_STATUS_FLOW.slice(idx + 1);
}
