"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, Coffee, Minus, Plus } from "lucide-react";
import { useAsyncData } from "@/hooks/use-async-data";
import { catalogApi } from "@/services/catalog.service";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { StockBar } from "@/components/ui/stock-bar";
import { formatMoney, cn } from "@/lib/utils";
import { SIZE_LABEL } from "@/lib/order-status";
import { useCartStore } from "@/store/cart.store";
import type { ProductModifier, ProductSize } from "@/types";

export function ProductDetail({ productId }: { productId: number }) {
  const { data: product, loading, error, refetch } = useAsyncData(
    () => catalogApi.getProduct(productId),
    [productId]
  );

  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [selectedMods, setSelectedMods] = useState<ProductModifier[]>([]);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const unitPrice = useMemo(() => {
    if (!product) return 0;
    const base = selectedSize ? Number(selectedSize.price) : Number(product.basePrice);
    const mods = selectedMods.reduce((sum, m) => sum + Number(m.extraPrice), 0);
    return base + mods;
  }, [product, selectedSize, selectedMods]);

  if (loading) return <LoadingState label="Buscando el producto..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!product) return null;

  const outOfStock = product.stock <= 0;

  const toggleModifier = (mod: ProductModifier) => {
    setSelectedMods((prev) =>
      prev.some((m) => m.id === mod.id)
        ? prev.filter((m) => m.id !== mod.id)
        : [...prev, mod]
    );
  };

  const handleAddToCart = () => {
    if (product.hasSizes && product.sizes?.length && !selectedSize) {
      toast.error("Elige un tamaño antes de continuar.");
      return;
    }
    addItem({ product, size: selectedSize, modifiers: selectedMods, quantity });
    toast.success(`${product.name} agregado al carrito`, {
      description: `${quantity} × ${formatMoney(unitPrice)}`,
    });
    setQuantity(1);
  };

  return (
    <div>
      <Link
        href="/tienda"
        className="mb-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-espresso/55 hover:text-tueste-oscuro"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Volver al catálogo
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-linea bg-pergamino-2">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              unoptimized
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Coffee className="h-16 w-16 text-tueste/25" />
            </div>
          )}
        </div>

        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-tueste">
            {product.category?.name ?? product.productType}
          </span>
          <h1 className="mt-1.5 font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
            {product.name}
          </h1>

          {product.description && (
            <p className="mt-4 text-[15px] leading-relaxed text-espresso/65">
              {product.description}
            </p>
          )}

          <div className="mt-5">
            <StockBar stock={product.stock} />
          </div>

          <div className="mt-6 flex items-baseline gap-2 border-y border-linea py-5">
            <span className="font-mono text-3xl font-semibold text-tueste-oscuro">
              {formatMoney(unitPrice)}
            </span>
            <span className="font-mono text-xs text-espresso/40">por unidad</span>
          </div>

          {product.hasSizes && product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-espresso/55">
                Elige un tamaño
              </p>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "flex-1 rounded-sm border px-3 py-3 text-center transition-colors",
                      selectedSize?.id === size.id
                        ? "border-tueste-oscuro bg-tueste-oscuro/5"
                        : "border-linea-fuerte hover:border-tueste"
                    )}
                  >
                    <p className="text-sm font-medium text-espresso">
                      {SIZE_LABEL[size.size]}
                    </p>
                    <p className="font-mono text-xs text-espresso/55">
                      {formatMoney(size.price)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.modifiers && product.modifiers.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-espresso/55">
                Personaliza tu pedido
              </p>
              <div className="flex flex-col gap-2">
                {product.modifiers.map((mod) => {
                  const checked = selectedMods.some((m) => m.id === mod.id);
                  return (
                    <label
                      key={mod.id}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-sm border px-3.5 py-2.5 transition-colors",
                        checked
                          ? "border-oliva bg-oliva/8"
                          : "border-linea-fuerte hover:border-oliva"
                      )}
                    >
                      <span className="flex items-center gap-2.5 text-sm text-espresso">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleModifier(mod)}
                          className="h-4 w-4 accent-oliva"
                        />
                        {mod.name}
                      </span>
                      <span className="font-mono text-xs text-espresso/55">
                        + {formatMoney(mod.extraPrice)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-7 flex items-center gap-4">
            <div className="flex items-center rounded-sm border border-linea-fuerte">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-espresso/60 hover:text-tueste-oscuro"
                aria-label="Disminuir cantidad"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-mono text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="flex h-11 w-11 items-center justify-center text-espresso/60 hover:text-tueste-oscuro"
                aria-label="Aumentar cantidad"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              size="lg"
              className="flex-1"
              disabled={outOfStock}
              onClick={handleAddToCart}
            >
              {outOfStock ? "Agotado" : "Agregar al carrito"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
