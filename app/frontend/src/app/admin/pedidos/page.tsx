import { AdminOrdersList } from "@/components/admin/admin-orders-list";

export const metadata = { title: "Pedidos — Panel Coffee Vibes" };

export default function AdminOrdersPage() {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-tueste">
        Gestión
      </p>
      <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-espresso">
        Pedidos
      </h1>
      <div className="mt-7">
        <AdminOrdersList />
      </div>
    </div>
  );
}
