import { AdminCategoriesView } from "@/components/admin/admin-categories-view";

export const metadata = { title: "Categorías — Panel Coffee Vibes" };

export default function AdminCategoriesPage() {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-tueste">
        Gestión
      </p>
      <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-espresso">
        Categorías
      </h1>
      <div className="mt-7 max-w-xl">
        <AdminCategoriesView />
      </div>
    </div>
  );
}
