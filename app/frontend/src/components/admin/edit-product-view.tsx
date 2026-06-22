"use client";

import { useAsyncData } from "@/hooks/use-async-data";
import { catalogApi } from "@/services/catalog.service";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { ProductForm } from "@/components/admin/product-form";

export function EditProductView({ productId }: { productId: number }) {
  const { data: product, loading, error, refetch } = useAsyncData(
    () => catalogApi.getProduct(productId),
    [productId]
  );

  if (loading) return <LoadingState label="Cargando producto..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!product) return null;

  return <ProductForm product={product} />;
}
