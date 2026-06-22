import Link from "next/link";
import Image from "next/image";
import { Coffee } from "lucide-react";
import type { Product } from "@/types";
import { formatMoney } from "@/lib/utils";
import { StockBar } from "@/components/ui/stock-bar";

export function ProductCard({ product }: { product: Product }) {
  const priceFrom = product.hasSizes && product.sizes?.length
    ? Math.min(...product.sizes.map((s) => Number(s.price)))
    : Number(product.basePrice);

  return (
    <Link
      href={`/tienda/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-linea bg-pergamino transition-all hover:border-tueste hover:shadow-[0_4px_0_0_var(--tueste)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-pergamino-2">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Coffee className="h-9 w-9 text-tueste/30" />
          </div>
        )}
        <span className="absolute left-2.5 top-2.5 rounded-full border border-linea-fuerte bg-pergamino/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-espresso/60">
          {product.category?.name ?? product.productType}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-base font-medium leading-snug text-espresso line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="line-clamp-2 text-[13px] leading-relaxed text-espresso/55">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-mono text-base font-semibold text-tueste-oscuro">
            {product.hasSizes ? "Desde " : ""}
            {formatMoney(priceFrom)}
          </span>
        </div>
        <StockBar stock={product.stock} />
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-sm border border-linea bg-pergamino">
      <div className="aspect-[4/3] w-full animate-pulse bg-pergamino-2" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-pergamino-2" />
        <div className="h-3 w-full animate-pulse rounded bg-pergamino-2" />
        <div className="h-5 w-16 animate-pulse rounded bg-pergamino-2" />
      </div>
    </div>
  );
}
