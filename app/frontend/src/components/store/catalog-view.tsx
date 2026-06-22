"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useAsyncData } from "@/hooks/use-async-data";
import { catalogApi, categoriesApi } from "@/services/catalog.service";
import { ProductCard, ProductCardSkeleton } from "@/components/store/product-card";
import { ErrorState, EmptyState } from "@/components/ui/states";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PRODUCT_TYPES = [
  { value: "", label: "Todos" },
  { value: "grano", label: "Grano" },
  { value: "molido", label: "Molido" },
  { value: "bebida", label: "Bebidas" },
  { value: "accesorio", label: "Accesorios" },
];

export function CatalogView() {
  const router = useRouter();
  const params = useSearchParams();

  const categoryId = params.get("categoryId");
  const productType = params.get("productType") || "";
  const page = Number(params.get("page") || "1");

  const { data: categories } = useAsyncData(() => categoriesApi.list(), []);

  const { data, loading, error, refetch } = useAsyncData(
    () =>
      catalogApi.listProducts({
        categoryId: categoryId ? Number(categoryId) : undefined,
        productType: productType || undefined,
        page,
        limit: 12,
      }),
    [categoryId, productType, page]
  );

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== "page") next.delete("page");
      router.push(`/tienda?${next.toString()}`);
    },
    [params, router]
  );

  const activeCategoryName = useMemo(
    () => categories?.find((c) => String(c.id) === categoryId)?.name,
    [categories, categoryId]
  );

  return (
    <div>
      {/* Filtros */}
      <div className="mb-6 flex flex-col gap-4 border-b border-linea pb-6">
        <div className="flex flex-wrap gap-2">
          {PRODUCT_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setParam("productType", t.value || null)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                productType === t.value
                  ? "border-tueste-oscuro bg-tueste-oscuro text-pergamino"
                  : "border-linea-fuerte text-espresso/60 hover:border-tueste"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setParam("categoryId", null)}
              className={cn(
                "rounded-sm border px-3 py-1.5 text-xs transition-colors",
                !categoryId
                  ? "border-oliva bg-oliva/10 text-oliva-oscuro"
                  : "border-linea text-espresso/55 hover:border-oliva"
              )}
            >
              Todas las categorías
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setParam("categoryId", String(cat.id))}
                className={cn(
                  "rounded-sm border px-3 py-1.5 text-xs transition-colors",
                  categoryId === String(cat.id)
                    ? "border-oliva bg-oliva/10 text-oliva-oscuro"
                    : "border-linea text-espresso/55 hover:border-oliva"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeCategoryName && (
        <p className="mb-4 text-sm text-espresso/55">
          Mostrando <span className="font-medium text-espresso">{activeCategoryName}</span>
        </p>
      )}

      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && data && data.products.length === 0 && (
        <EmptyState
          title="No hay productos en este filtro"
          description="Prueba con otra categoría o quita los filtros activos."
        />
      )}

      {!loading && !error && data && data.products.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setParam("page", String(page - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-linea-fuerte disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="font-mono text-xs text-espresso/55">
                Página {data.pagination.page} de {data.pagination.totalPages}
              </span>
              <button
                disabled={page >= data.pagination.totalPages}
                onClick={() => setParam("page", String(page + 1))}
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-linea-fuerte disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
