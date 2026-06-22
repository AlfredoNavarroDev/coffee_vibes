"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Coffee, Pencil, Trash2 } from "lucide-react";
import { useAsyncData } from "@/hooks/use-async-data";
import { catalogApi } from "@/services/catalog.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { formatMoney, cn } from "@/lib/utils";

export function AdminProductsList() {
  const { data, loading, error, refetch } = useAsyncData(
    () => catalogApi.listProducts({ limit: 100 }),
    []
  );
  const [stockEdits, setStockEdits] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (loading) return <LoadingState label="Cargando productos..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data || data.products.length === 0) {
    return (
      <EmptyState
        title="Sin productos todavía"
        description="Crea tu primer producto para que aparezca en la tienda."
      />
    );
  }

  async function handleSaveStock(productId: number) {
    const value = stockEdits[productId];
    if (value === undefined) return;
    const stock = parseInt(value, 10);
    if (Number.isNaN(stock) || stock < 0) {
      toast.error("El stock debe ser un número entero mayor o igual a 0.");
      return;
    }
    setSavingId(productId);
    try {
      await catalogApi.updateStock(productId, stock);
      toast.success("Stock actualizado");
      refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(productId: number, name: string) {
    if (!confirm(`¿Eliminar "${name}"? Esto lo ocultará de la tienda.`)) return;
    setDeletingId(productId);
    try {
      await catalogApi.deleteProduct(productId);
      toast.success("Producto eliminado");
      refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-linea">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-linea bg-pergamino-2 text-left">
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-espresso/50">
              Producto
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-espresso/50">
              Categoría
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-espresso/50">
              Precio base
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-espresso/50">
              Stock
            </th>
            <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-espresso/50" />
          </tr>
        </thead>
        <tbody>
          {data.products.map((product) => {
            const editValue = stockEdits[product.id] ?? String(product.stock);
            const dirty = editValue !== String(product.stock);
            return (
              <tr key={product.id} className="border-b border-linea bg-pergamino">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-pergamino-2">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Coffee className="h-4 w-4 text-tueste/30" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-espresso">{product.name}</p>
                      <p className="font-mono text-[10px] text-espresso/40">
                        {product.productType}
                        {!product.isActive && " · inactivo"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-espresso/65">
                  {product.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono text-espresso/80">
                  {formatMoney(product.basePrice)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={editValue}
                      onChange={(e) =>
                        setStockEdits((prev) => ({ ...prev, [product.id]: e.target.value }))
                      }
                      className="h-8 w-20 rounded-sm border border-linea-fuerte bg-pergamino px-2 font-mono text-xs outline-none focus:border-tueste"
                    />
                    {dirty && (
                      <button
                        onClick={() => handleSaveStock(product.id)}
                        disabled={savingId === product.id}
                        className="font-mono text-[10px] uppercase text-oliva-oscuro hover:underline disabled:opacity-50"
                      >
                        {savingId === product.id ? "Guardando..." : "Guardar"}
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="flex h-8 w-8 items-center justify-center rounded-sm border border-linea-fuerte text-espresso/60 hover:border-tueste hover:text-tueste-oscuro"
                      aria-label="Editar producto"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deletingId === product.id}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-sm border border-linea-fuerte text-espresso/60 hover:border-rojo-error hover:text-rojo-error",
                        deletingId === product.id && "opacity-50"
                      )}
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
