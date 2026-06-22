"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAsyncData } from "@/hooks/use-async-data";
import { ordersApi } from "@/services/orders.service";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatMoney, cn } from "@/lib/utils";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/order-status";
import type { OrderStatus } from "@/types";

export function AdminOrdersList() {
  const { data: orders, loading, error, refetch } = useAsyncData(
    () => ordersApi.list(),
    []
  );
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");

  const filtered = useMemo(() => {
    if (!orders) return [];
    if (filter === "ALL") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  if (loading) return <LoadingState label="Cargando pedidos..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("ALL")}
          className={cn(
            "rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
            filter === "ALL"
              ? "border-tueste-oscuro bg-tueste-oscuro text-pergamino"
              : "border-linea-fuerte text-espresso/60 hover:border-tueste"
          )}
        >
          Todos ({orders?.length ?? 0})
        </button>
        {ORDER_STATUS_FLOW.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
              filter === status
                ? "border-tueste-oscuro bg-tueste-oscuro text-pergamino"
                : "border-linea-fuerte text-espresso/60 hover:border-tueste"
            )}
          >
            {ORDER_STATUS_LABEL[status]} (
            {orders?.filter((o) => o.status === status).length ?? 0})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No hay pedidos en este estado" />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((order) => (
            <Link
              key={order.id}
              href={`/admin/pedidos/${order.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-linea bg-pergamino p-3.5 transition-colors hover:border-tueste"
            >
              <div>
                <p className="text-sm font-medium text-espresso">
                  #{String(order.id).padStart(4, "0")} · {order.user?.name || order.user?.email}
                </p>
                <p className="font-mono text-[11px] text-espresso/45">
                  {formatDate(order.createdAt)} · {order.items.length} producto(s)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={ORDER_STATUS_STYLE[order.status]}>
                  {ORDER_STATUS_LABEL[order.status]}
                </Badge>
                <span className="font-mono text-sm font-semibold text-tueste-oscuro">
                  {formatMoney(order.total)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
