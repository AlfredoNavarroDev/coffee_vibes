import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminProductsList } from "@/components/admin/admin-products-list";

export const metadata = { title: "Productos — Panel Coffee Vibes" };

export default function AdminProductsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-tueste">
            Gestión
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-espresso">
            Productos
          </h1>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="flex h-10 items-center gap-1.5 rounded-sm border border-tueste-oscuro bg-tueste-oscuro px-4 text-sm font-medium text-pergamino transition-colors hover:bg-tueste"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>
      <div className="mt-7">
        <AdminProductsList />
      </div>
    </div>
  );
}
