"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, MapPin, Store } from "lucide-react";
import { useAsyncData } from "@/hooks/use-async-data";
import { ordersApi } from "@/services/orders.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderTimeline } from "@/components/store/order-timeline";
import { formatDate, formatMoney } from "@/lib/utils";
import {
  availableNextStatuses,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_STYLE,
  PAYMENT_STATUS_LABEL,
  SIZE_LABEL,
} from "@/lib/order-status";
import type { OrderStatus } from "@/types";

export function AdminOrderDetail({ orderId }: { orderId: number }) {
  const { data: order, loading, error, refetch } = useAsyncData(
    () => ordersApi.get(orderId),
    [orderId]
  );
  const [updating, setUpdating] = useState<OrderStatus | null>(null);

  async function handleUpdateStatus(status: OrderStatus) {
    setUpdating(status);
    try {
      await ordersApi.updateStatus(orderId, status);
      toast.success(`Pedido marcado como "${ORDER_STATUS_LABEL[status]}"`);
      refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setUpdating(null);
    }
  }

  if (loading) return <LoadingState label="Cargando pedido..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!order) return null;

  const nextStatuses = availableNextStatuses(order.status);

  return (
    <div>
      <Link
        href="/admin/pedidos"
        className="mb-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-espresso/55 hover:text-tueste-oscuro"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Todos los pedidos
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] text-espresso/45">
            Pedido #{String(order.id).padStart(4, "0")}
          </p>
          <h1 className="mt-1 font-display text-2xl font-medium tracking-tight text-espresso">
            {order.user?.name || order.user?.email}
          </h1>
          <p className="mt-0.5 text-sm text-espresso/55">{formatDate(order.createdAt)}</p>
        </div>
        <Badge className={ORDER_STATUS_STYLE[order.status]}>
          {ORDER_STATUS_LABEL[order.status]}
        </Badge>
      </div>

      <div className="mt-8 rounded-sm border border-linea bg-pergamino p-5">
        <OrderTimeline status={order.status} />
      </div>

      {nextStatuses.length > 0 && (
        <div className="mt-4 rounded-sm border border-linea-fuerte bg-pergamino-2 p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-espresso/55">
            Avanzar estado del pedido
          </p>
          <div className="flex flex-wrap gap-2">
            {nextStatuses.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={status === nextStatuses[0] ? "primary" : "outline"}
                loading={updating === status}
                onClick={() => handleUpdateStatus(status)}
              >
                Marcar &ldquo;{ORDER_STATUS_LABEL[status]}&rdquo;
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-sm border border-linea bg-pergamino p-4">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-espresso/50">
            {order.deliveryType === "DELIVERY" ? (
              <MapPin className="h-3.5 w-3.5" />
            ) : (
              <Store className="h-3.5 w-3.5" />
            )}
            {order.deliveryType === "DELIVERY" ? "Entrega a domicilio" : "Recojo en tienda"}
          </p>
          {order.address ? (
            <p className="mt-2 text-sm text-espresso/75">
              {order.address.street}, {order.address.city}
              {order.address.reference && (
                <span className="block text-xs text-espresso/50">
                  {order.address.reference}
                </span>
              )}
            </p>
          ) : (
            <p className="mt-2 text-sm text-espresso/55">Recojo en el local principal.</p>
          )}
        </div>

        <div className="rounded-sm border border-linea bg-pergamino p-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-espresso/50">
            Pago
          </p>
          {order.payment ? (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-espresso/75">
                {PAYMENT_STATUS_LABEL[order.payment.status]}
              </span>
              <span className="font-mono text-sm font-semibold text-tueste-oscuro">
                {formatMoney(order.payment.amount)}
              </span>
            </div>
          ) : (
            <p className="mt-2 text-sm text-espresso/55">Sin registro de pago aún.</p>
          )}
        </div>
      </div>

      {order.notes && (
        <div className="mt-6 rounded-sm border border-linea-fuerte bg-pergamino-2 p-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-espresso/45">
            Notas del cliente
          </p>
          <p className="mt-1 text-sm text-espresso/70">{order.notes}</p>
        </div>
      )}

      <div className="mt-8">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-espresso/55">
          Productos
        </p>
        <div className="flex flex-col gap-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-sm border border-linea bg-pergamino p-3.5"
            >
              <div>
                <p className="text-sm font-medium text-espresso">
                  {item.quantity}× {item.product?.name}
                  {item.productSize && (
                    <span className="ml-1.5 font-mono text-xs text-espresso/50">
                      ({SIZE_LABEL[item.productSize.size]})
                    </span>
                  )}
                </p>
                {item.modifiers && item.modifiers.length > 0 && (
                  <p className="mt-0.5 text-xs text-espresso/55">
                    {item.modifiers.map((m) => m.modifier?.name).join(", ")}
                  </p>
                )}
              </div>
              <span className="font-mono text-sm text-espresso/80">
                {formatMoney(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-sm border border-linea bg-pergamino p-5">
        <div className="flex justify-between text-sm text-espresso/70">
          <span>Subtotal</span>
          <span className="font-mono">{formatMoney(order.subtotal)}</span>
        </div>
        <div className="mt-1.5 flex justify-between text-sm text-espresso/70">
          <span>Envío</span>
          <span className="font-mono">{formatMoney(order.deliveryFee)}</span>
        </div>
        <div className="dash-line my-3" />
        <div className="flex justify-between">
          <span className="font-display text-base font-medium text-espresso">Total</span>
          <span className="font-mono text-lg font-semibold text-tueste-oscuro">
            {formatMoney(order.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
