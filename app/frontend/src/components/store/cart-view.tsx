"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Coffee, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, lineUnitTotal, lineTotal } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { formatMoney } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states";

const DELIVERY_FEE_PREVIEW = 5.0;

export function CartView() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const removeLine = useCartStore((s) => s.removeLine);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore((s) => s.subtotal());
  const user = useAuthStore((s) => s.user);

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Tu carrito está vacío"
        description="Explora el catálogo y agrega tu café favorito."
        action={<ButtonLink href="/tienda">Ir a la tienda</ButtonLink>}
      />
    );
  }

  function goToCheckout() {
    if (!user) {
      router.push("/login?next=/checkout");
      return;
    }
    router.push("/checkout");
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-3">
        {lines.map((line) => (
          <div
            key={line.lineId}
            className="flex gap-4 rounded-sm border border-linea bg-pergamino p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-pergamino-2">
              {line.productImage ? (
                <Image
                  src={line.productImage}
                  alt={line.productName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Coffee className="h-7 w-7 text-tueste/30" />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-[15px] font-medium leading-tight text-espresso">
                    {line.productName}
                  </p>
                  {line.sizeLabel && (
                    <p className="font-mono text-[11px] text-espresso/50">
                      {line.sizeLabel}
                    </p>
                  )}
                  {line.modifiers.length > 0 && (
                    <p className="mt-0.5 text-xs text-espresso/55">
                      {line.modifiers.map((m) => m.name).join(", ")}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeLine(line.lineId)}
                  className="text-espresso/40 hover:text-rojo-error"
                  aria-label="Quitar del carrito"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center rounded-sm border border-linea-fuerte">
                  <button
                    onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center text-espresso/60 hover:text-tueste-oscuro"
                    aria-label="Disminuir cantidad"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center font-mono text-xs">
                    {line.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                    disabled={line.quantity >= line.maxStock}
                    className="flex h-8 w-8 items-center justify-center text-espresso/60 hover:text-tueste-oscuro disabled:opacity-30"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-tueste-oscuro">
                    {formatMoney(lineTotal(line))}
                  </p>
                  <p className="font-mono text-[10px] text-espresso/40">
                    {formatMoney(lineUnitTotal(line))} c/u
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen tipo ticket */}
      <div className="sticky top-24 h-fit rounded-sm border border-linea bg-pergamino p-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-espresso/50">
          Resumen
        </p>
        <div className="dash-line my-3" />
        <div className="flex justify-between text-sm text-espresso/70">
          <span>Subtotal</span>
          <span className="font-mono">{formatMoney(subtotal)}</span>
        </div>
        <div className="mt-1.5 flex justify-between text-sm text-espresso/50">
          <span>Envío (si aplica)</span>
          <span className="font-mono">+{formatMoney(DELIVERY_FEE_PREVIEW)}</span>
        </div>
        <div className="dash-line my-3" />
        <div className="flex justify-between">
          <span className="font-display text-base font-medium text-espresso">Total estimado</span>
          <span className="font-mono text-lg font-semibold text-tueste-oscuro">
            {formatMoney(subtotal + DELIVERY_FEE_PREVIEW)}
          </span>
        </div>
        <p className="mt-2 text-[11px] text-espresso/40">
          El costo de envío se confirma en el checkout según el tipo de entrega.
        </p>
        <Button fullWidth size="lg" className="mt-5" onClick={goToCheckout}>
          Continuar al pago
        </Button>
      </div>
    </div>
  );
}
