import { RouteGuard } from "@/components/auth/route-guard";
import { OrdersListView } from "@/components/store/orders-list-view";

export const metadata = { title: "Mis pedidos — Coffee Vibes" };

export default function OrdersListPage() {
  return (
    <RouteGuard>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-wider text-tueste">
          Historial
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
          Mis pedidos
        </h1>
        <div className="mt-8">
          <OrdersListView />
        </div>
      </div>
    </RouteGuard>
  );
}
