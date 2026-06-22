"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import type { Role } from "@/types";
import { LoadingState } from "@/components/ui/states";

export function RouteGuard({
  children,
  allow,
}: {
  children: React.ReactNode;
  allow?: Role[];
}) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (allow && !allow.includes(user.role)) {
      router.replace("/tienda");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, user]);

  if (!isHydrated || !user || (allow && !allow.includes(user.role))) {
    return <LoadingState label="Verificando acceso..." />;
  }

  return <>{children}</>;
}
