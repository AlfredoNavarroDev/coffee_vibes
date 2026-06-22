"use client";

import Link from "next/link";
import { useAsyncData } from "@/hooks/use-async-data";
import { categoriesApi } from "@/services/catalog.service";
import { Layers } from "lucide-react";

export function CategoryStrip() {
  const { data, loading } = useAsyncData(() => categoriesApi.list(), []);

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-24 w-40 shrink-0 animate-pulse rounded-sm bg-pergamino-2"
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {data.map((cat) => (
        <Link
          key={cat.id}
          href={`/tienda?categoryId=${cat.id}`}
          className="group flex h-24 w-40 shrink-0 flex-col justify-between rounded-sm border border-linea bg-pergamino p-4 transition-colors hover:border-tueste"
        >
          <Layers className="h-4 w-4 text-tueste/60 transition-colors group-hover:text-tueste" />
          <div>
            <p className="font-display text-sm font-medium leading-tight text-espresso">
              {cat.name}
            </p>
            <p className="font-mono text-[10px] text-espresso/40">
              {cat.products?.length ?? 0} productos
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
