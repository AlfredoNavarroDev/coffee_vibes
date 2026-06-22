"use client";

import { useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "@/lib/api-client";

interface UseAsyncDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook genérico de fetch con loading/error. El fetcher se vuelve a ejecutar
 * cuando cambia cualquier valor en `deps` o cuando se llama a `refetch`.
 *
 * El "loading" se deriva comparando la key de la petición en curso contra la
 * key de la última petición resuelta — nunca se hace un setState síncrono
 * al inicio del cuerpo del efecto, solo dentro de los callbacks async.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): UseAsyncDataResult<T> {
  const [tick, setTick] = useState(0);
  const depsKey = JSON.stringify([...deps, tick]);

  const [resolved, setResolved] = useState<{
    key: string;
    data: T | null;
    error: string | null;
  } | null>(null);

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelled = false;

    fetcherRef
      .current()
      .then((result) => {
        if (!cancelled) setResolved({ key: depsKey, data: result, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setResolved({ key: depsKey, data: null, error: getApiErrorMessage(err) });
      });

    return () => {
      cancelled = true;
    };
  }, [depsKey]);

  const loading = resolved?.key !== depsKey;

  return {
    data: loading ? null : resolved!.data,
    loading,
    error: loading ? null : resolved!.error,
    refetch: () => setTick((t) => t + 1),
  };
}
