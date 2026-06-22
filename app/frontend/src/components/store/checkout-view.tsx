"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, Plus, Store } from "lucide-react";
import { useCartStore, lineUnitTotal } from "@/store/cart.store";
import { useAuthStore } from "@/store/auth.store";
import { useAsyncData } from "@/hooks/use-async-data";
import { addressesApi } from "@/services/addresses.service";
import { ordersApi } from "@/services/orders.service";
import { paymentsApi } from "@/services/payments.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { formatMoney, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { EmptyState, LoadingState } from "@/components/ui/states";
import { AddressForm } from "@/components/store/address-form";
import type { CreateOrderPayload, DeliveryType } from "@/types";

const DELIVERY_FEE = 5.0;

export function CheckoutView() {
  const router = useRouter();
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);

  const { data: addresses, loading: loadingAddresses, refetch } = useAsyncData(
    () => addressesApi.list(),
    []
  );

  const [deliveryType, setDeliveryType] = useState<DeliveryType>("LOCAL");
  const [addressId, setAddressId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = deliveryType === "DELIVERY" ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  if (!user) {
    return (
      <EmptyState
        title="Inicia sesión para continuar"
        description="Necesitas una cuenta para confirmar tu pedido."
      />
    );
  }

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Tu carrito está vacío"
        description="Agrega productos antes de pasar al checkout."
      />
    );
  }

  async function handleConfirm() {
    if (deliveryType === "DELIVERY" && !addressId) {
      toast.error("Selecciona una dirección de entrega.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: CreateOrderPayload = {
        deliveryType,
        addressId: deliveryType === "DELIVERY" ? addressId : null,
        notes: notes || null,
        items: lines.map((line) => ({
          productId: line.productId,
          productSizeId: line.productSizeId,
          quantity: line.quantity,
          modifiers: line.modifiers.map((m) => ({ modifierId: m.modifierId })),
        })),
      };

      const order = await ordersApi.create(payload);
      const preference = await paymentsApi.createPreference(order.id);

      clearCart();
      toast.success("Pedido creado. Redirigiendo a Mercado Pago...");

      const checkoutUrl = preference.initPoint || preference.sandboxInitPoint;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        router.push(`/pedidos/${order.id}`);
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-7">
        {/* Tipo de entrega */}
        <section>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-espresso/55">
            Tipo de entrega
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setDeliveryType("LOCAL")}
              className={cn(
                "flex flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors",
                deliveryType === "LOCAL"
                  ? "border-tueste-oscuro bg-tueste-oscuro/5"
                  : "border-linea-fuerte hover:border-tueste"
              )}
            >
              <Store className="h-5 w-5 text-tueste" />
              <span className="font-display text-sm font-medium text-espresso">
                Recojo en tienda
              </span>
              <span className="text-xs text-espresso/55">Sin costo de envío</span>
            </button>
            <button
              onClick={() => setDeliveryType("DELIVERY")}
              className={cn(
                "flex flex-col items-start gap-2 rounded-sm border p-4 text-left transition-colors",
                deliveryType === "DELIVERY"
                  ? "border-tueste-oscuro bg-tueste-oscuro/5"
                  : "border-linea-fuerte hover:border-tueste"
              )}
            >
              <MapPin className="h-5 w-5 text-tueste" />
              <span className="font-display text-sm font-medium text-espresso">
                Delivery
              </span>
              <span className="text-xs text-espresso/55">
                + {formatMoney(DELIVERY_FEE)} de envío
              </span>
            </button>
          </div>
        </section>

        {/* Direcciones */}
        {deliveryType === "DELIVERY" && (
          <section>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-espresso/55">
              Dirección de entrega
            </p>

            {loadingAddresses && <LoadingState label="Cargando direcciones..." />}

            {!loadingAddresses && addresses && addresses.length > 0 && (
              <div className="flex flex-col gap-2">
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    onClick={() => setAddressId(addr.id)}
                    className={cn(
                      "flex items-start justify-between gap-3 rounded-sm border p-3.5 text-left transition-colors",
                      addressId === addr.id
                        ? "border-tueste-oscuro bg-tueste-oscuro/5"
                        : "border-linea-fuerte hover:border-tueste"
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium text-espresso">{addr.street}</p>
                      <p className="text-xs text-espresso/55">{addr.city}</p>
                      {addr.reference && (
                        <p className="text-xs text-espresso/45">{addr.reference}</p>
                      )}
                    </div>
                    {addr.isDefault && (
                      <span className="rounded-full border border-oliva px-2 py-0.5 font-mono text-[9px] uppercase text-oliva-oscuro">
                        Principal
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {!loadingAddresses && (!addresses || addresses.length === 0) && !showNewAddress && (
              <p className="text-sm text-espresso/55">
                No tienes direcciones guardadas todavía.
              </p>
            )}

            {!showNewAddress ? (
              <button
                onClick={() => setShowNewAddress(true)}
                className="mt-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-tueste-oscuro hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar nueva dirección
              </button>
            ) : (
              <div className="mt-3 rounded-sm border border-linea bg-pergamino p-4">
                <AddressForm
                  onSaved={(addr) => {
                    setAddressId(addr.id);
                    setShowNewAddress(false);
                    refetch();
                  }}
                  onCancel={() => setShowNewAddress(false)}
                />
              </div>
            )}
          </section>
        )}

        {/* Notas */}
        <section>
          <Textarea
            label="Notas para tu pedido (opcional)"
            placeholder="Sin azúcar, tocar el timbre dos veces, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>
      </div>

      {/* Resumen */}
      <div className="sticky top-24 h-fit rounded-sm border border-linea bg-pergamino p-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-espresso/50">
          Resumen del pedido
        </p>
        <div className="dash-line my-3" />
        <ul className="flex flex-col gap-2">
          {lines.map((line) => (
            <li key={line.lineId} className="flex justify-between text-sm">
              <span className="text-espresso/70">
                {line.quantity}× {line.productName}
                {line.sizeLabel ? ` (${line.sizeLabel})` : ""}
              </span>
              <span className="font-mono text-espresso/80">
                {formatMoney(lineUnitTotal(line) * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="dash-line my-3" />
        <div className="flex justify-between text-sm text-espresso/70">
          <span>Subtotal</span>
          <span className="font-mono">{formatMoney(subtotal)}</span>
        </div>
        <div className="mt-1.5 flex justify-between text-sm text-espresso/70">
          <span>Envío</span>
          <span className="font-mono">{formatMoney(deliveryFee)}</span>
        </div>
        <div className="dash-line my-3" />
        <div className="flex justify-between">
          <span className="font-display text-base font-medium text-espresso">Total</span>
          <span className="font-mono text-lg font-semibold text-tueste-oscuro">
            {formatMoney(total)}
          </span>
        </div>

        <Button fullWidth size="lg" className="mt-5" loading={submitting} onClick={handleConfirm}>
          Pagar con Mercado Pago
        </Button>
        <p className="mt-2 text-center text-[11px] text-espresso/40">
          Serás redirigido a Mercado Pago para completar el pago de forma segura.
        </p>
      </div>
    </div>
  );
}
