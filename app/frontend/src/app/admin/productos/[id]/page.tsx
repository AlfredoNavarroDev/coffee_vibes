import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { EditProductView } from "@/components/admin/edit-product-view";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <Link
        href="/admin/productos"
        className="mb-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-espresso/55 hover:text-tueste-oscuro"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Productos
      </Link>
      <h1 className="font-display text-3xl font-medium tracking-tight text-espresso">
        Editar producto
      </h1>
      <div className="mt-7 max-w-lg">
        <EditProductView productId={Number(id)} />
      </div>
    </div>
  );
}
