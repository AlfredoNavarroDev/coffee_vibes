import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Nuevo producto — Panel Coffee Vibes" };

export default function NewProductPage() {
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
        Nuevo producto
      </h1>
      <div className="mt-7 max-w-lg">
        <ProductForm />
      </div>
    </div>
  );
}
