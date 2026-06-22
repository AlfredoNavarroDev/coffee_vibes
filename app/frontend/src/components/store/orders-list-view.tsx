"use client";

import Link from "next/link";
import { useAsyncData } from "@/hooks/use-async-data";
import { ordersApi } from "@/services/orders.service";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { formatDate, formatMoney } from "@/lib/utils";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/order-status";
import { ChevronRight, Package } from "lucide-react";

export function OrdersListView() {
  const { data: orders, loading, error, refetch } = useAsyncData(
    () => ordersApi.list(),
    []
  );

  if (loading) return <LoadingState label="Buscando tus pedidos..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  if (!orders || orders.length === 0) {
    return (
      <EmptyState
        title="Aún no tienes pedidos"
        description="Cuando hagas tu primera compra, aparecerá aquí."
        action={<ButtonLink href="/tienda">Ir a la tienda</ButtonLink>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/pedidos/${order.id}`}
          className="flex items-center justify-between gap-4 rounded-sm border border-linea bg-pergamino p-4 transition-colors hover:border-tueste"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-linea-fuerte bg-pergamino-2">
              <Package className="h-4.5 w-4.5 text-tueste" />
            </div>
            <div>
              <p className="font-mono text-xs text-espresso/50">
                Pedido #{String(order.id).padStart(4, "0")}
              </p>
              <p className="text-sm text-espresso/70">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge className={ORDER_STATUS_STYLE[order.status]}>
              {ORDER_STATUS_LABEL[order.status]}
            </Badge>
            <span className="font-mono text-sm font-semibold text-tueste-oscuro">
              {formatMoney(order.total)}
            </span>
            <ChevronRight className="h-4 w-4 text-espresso/30" />
          </div>
        </Link>
      ))}
    </div>
  );
}
