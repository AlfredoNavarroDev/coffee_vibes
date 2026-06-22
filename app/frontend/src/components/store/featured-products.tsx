"use client";

import { useAsyncData } from "@/hooks/use-async-data";
import { catalogApi } from "@/services/catalog.service";
import { ProductCard, ProductCardSkeleton } from "@/components/store/product-card";
import { ErrorState } from "@/components/ui/states";

export function FeaturedProducts() {
  const { data, loading, error, refetch } = useAsyncData(
    () => catalogApi.listProducts({ limit: 4 }),
    []
  );

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  if (!data || data.products.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-espresso/50">
        Aún no hay productos publicados.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {data.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
