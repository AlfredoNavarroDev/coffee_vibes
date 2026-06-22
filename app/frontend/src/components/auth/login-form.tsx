"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authApi } from "@/services/auth.service";
import { useAuthStore, isStaff } from "@/store/auth.store";
import { getApiErrorMessage } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email("Ingresa un email válido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const setAuth = useAuthStore((s) => s.setAuth);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const result = await authApi.login(values);
      setAuth(result.user, result.token);
      toast.success(`Bienvenido, ${result.user.name || result.user.email}`);
      router.push(next || (isStaff(result.user.role) ? "/admin" : "/tienda"));
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-tueste">
        Bienvenido de vuelta
      </p>
      <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-espresso">
        Ingresa a tu cuenta
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" size="lg" fullWidth loading={submitting} className="mt-2">
          Ingresar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-espresso/60">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-medium text-tueste-oscuro hover:underline">
          Regístrate
        </Link>
      </p>

      <div className="mt-8 rounded-sm border border-linea-fuerte bg-pergamino-2 p-3.5">
        <p className="font-mono text-[10px] uppercase tracking-wider text-espresso/45">
          Cuentas de prueba (seed)
        </p>
        <ul className="mt-1.5 space-y-0.5 text-xs text-espresso/55">
          <li>cliente@test.com / test123</li>
          <li>owner@coffeevibes.com / owner123</li>
          <li>admin@coffeevibes.com / admin123</li>
        </ul>
      </div>
    </div>
  );
}
