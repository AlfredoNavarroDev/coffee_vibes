"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductModifier, ProductSize } from "@/types";

export interface CartLine {
  // Identificador único de la línea en el carrito (no del producto)
  lineId: string;
  productId: number;
  productName: string;
  productImage: string | null;
  productSizeId: number | null;
  sizeLabel: string | null;
  unitPrice: number; // basePrice o precio de tamaño, SIN modificadores
  modifiers: { modifierId: number; name: string; extraPrice: number }[];
  quantity: number;
  maxStock: number;
}

interface CartState {
  lines: CartLine[];
  addItem: (input: {
    product: Product;
    size: ProductSize | null;
    modifiers: ProductModifier[];
    quantity: number;
  }) => void;
  removeLine: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

function lineKey(productId: number, sizeId: number | null, modifierIds: number[]) {
  return `${productId}::${sizeId ?? "none"}::${[...modifierIds].sort().join(",")}`;
}

export function lineUnitTotal(line: CartLine) {
  const modsTotal = line.modifiers.reduce((sum, m) => sum + m.extraPrice, 0);
  return line.unitPrice + modsTotal;
}

export function lineTotal(line: CartLine) {
  return lineUnitTotal(line) * line.quantity;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],

      addItem: ({ product, size, modifiers, quantity }) => {
        const modifierIds = modifiers.map((m) => m.id);
        const key = lineKey(product.id, size?.id ?? null, modifierIds);

        set((state) => {
          const existing = state.lines.find((l) => l.lineId === key);
          if (existing) {
            const nextQty = Math.min(
              existing.quantity + quantity,
              existing.maxStock
            );
            return {
              lines: state.lines.map((l) =>
                l.lineId === key ? { ...l, quantity: nextQty } : l
              ),
            };
          }

          const newLine: CartLine = {
            lineId: key,
            productId: product.id,
            productName: product.name,
            productImage: product.imageUrl,
            productSizeId: size?.id ?? null,
            sizeLabel: size
              ? { SMALL: "Chico", MEDIUM: "Mediano", LARGE: "Grande" }[size.size]
              : null,
            unitPrice: size ? Number(size.price) : Number(product.basePrice),
            modifiers: modifiers.map((m) => ({
              modifierId: m.id,
              name: m.name,
              extraPrice: Number(m.extraPrice),
            })),
            quantity: Math.min(quantity, product.stock),
            maxStock: product.stock,
          };

          return { lines: [...state.lines, newLine] };
        });
      },

      removeLine: (lineId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.lineId !== lineId) })),

      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              l.lineId === lineId
                ? { ...l, quantity: Math.max(1, Math.min(quantity, l.maxStock)) }
                : l
            )
            .filter((l) => l.quantity > 0),
        })),

      clear: () => set({ lines: [] }),

      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),

      subtotal: () => get().lines.reduce((sum, l) => sum + lineTotal(l), 0),
    }),
    { name: "cv_cart" }
  )
);
