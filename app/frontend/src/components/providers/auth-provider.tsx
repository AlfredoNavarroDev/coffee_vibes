"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/services/auth.service";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    let cancelled = false;

    // Siempre resolvemos vía microtarea, incluso sin token, para nunca
    // llamar setState de forma síncrona en el cuerpo del efecto.
    const verify = token
      ? authApi.me().then(
          (user) => {
            if (!cancelled) setUser(user);
          },
          () => {
            if (!cancelled) logout();
          }
        )
      : Promise.resolve();

    verify.finally(() => {
      if (!cancelled) setChecked(true);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, token]);

  if (!isHydrated || !checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-crudo">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-linea-fuerte border-t-tueste" />
          <p className="font-mono text-xs uppercase tracking-widest text-espresso/50">
            Moliendo...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
