"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Clock, DollarSign, Package, ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useAsyncData } from "@/hooks/use-async-data";
import { ordersApi } from "@/services/orders.service";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatMoney } from "@/lib/utils";
import { ORDER_STATUS_LABEL, ORDER_STATUS_STYLE } from "@/lib/order-status";

export function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: orders, loading, error, refetch } = useAsyncData(
    () => ordersApi.list(),
    []
  );

  const stats = useMemo(() => {
    if (!orders) return null;
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const preparing = orders.filter((o) => ["PAID", "PREPARING"].includes(o.status)).length;
    const ready = orders.filter((o) => o.status === "READY").length;
    const revenue = orders
      .filter((o) => o.status !== "PENDING")
      .reduce((sum, o) => sum + Number(o.total), 0);
    return { pending, preparing, ready, revenue, total: orders.length };
  }, [orders]);

  const recentOrders = useMemo(() => orders?.slice(0, 6) ?? [], [orders]);

  if (loading) return <LoadingState label="Cargando el panel..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-tueste">
        Bienvenido, {user?.name || user?.email}
      </p>
      <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-espresso">
        Resumen de la tienda
      </h1>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Por pagar"
          value={String(stats?.pending ?? 0)}
          accent="text-miel"
        />
        <StatCard
          icon={Package}
          label="En preparación"
          value={String(stats?.preparing ?? 0)}
          accent="text-tueste"
        />
        <StatCard
          icon={ShoppingCart}
          label="Listos"
          value={String(stats?.ready ?? 0)}
          accent="text-verde-ok"
        />
        <StatCard
          icon={DollarSign}
          label="Ingresos confirmados"
          value={formatMoney(stats?.revenue ?? 0)}
          accent="text-oliva-oscuro"
        />
      </div>

      <div className="mt-9 flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wider text-espresso/55">
          Pedidos recientes
        </p>
        <Link
          href="/admin/pedidos"
          className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-tueste-oscuro hover:underline"
        >
          Ver todos <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-3 flex flex-col gap-2">
        {recentOrders.length === 0 && (
          <p className="py-8 text-center text-sm text-espresso/50">
            Todavía no hay pedidos registrados.
          </p>
        )}
        {recentOrders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/pedidos/${order.id}`}
            className="flex items-center justify-between gap-3 rounded-sm border border-linea bg-pergamino p-3.5 transition-colors hover:border-tueste"
          >
            <div>
              <p className="text-sm font-medium text-espresso">
                #{String(order.id).padStart(4, "0")} · {order.user?.name || order.user?.email}
              </p>
              <p className="font-mono text-[11px] text-espresso/45">
                {formatDate(order.createdAt)}
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
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-sm border border-linea bg-pergamino p-4">
      <Icon className={`h-4 w-4 ${accent}`} />
      <p className="mt-3 font-display text-xl font-semibold text-espresso">{value}</p>
      <p className="font-mono text-[10px] uppercase tracking-wide text-espresso/45">
        {label}
      </p>
    </div>
  );
}
