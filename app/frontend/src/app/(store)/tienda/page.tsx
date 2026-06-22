import { Suspense } from "react";
import { CatalogView } from "@/components/store/catalog-view";
import { LoadingState } from "@/components/ui/states";

export const metadata = {
  title: "Tienda — Coffee Vibes",
};

export default function StorePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-wider text-tueste">
          Catálogo
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
          Todo lo que tostamos
        </h1>
        <p className="mt-2 max-w-lg text-sm text-espresso/60">
          Grano, molido, bebidas preparadas y accesorios. Filtra por categoría
          para encontrar tu próxima taza.
        </p>
      </div>

      <Suspense fallback={<LoadingState />}>
        <CatalogView />
      </Suspense>
    </div>
  );
}
