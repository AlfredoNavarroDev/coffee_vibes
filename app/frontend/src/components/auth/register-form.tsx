"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authApi } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { getApiErrorMessage } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Ingresa un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
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
      const result = await authApi.register(values);
      setAuth(result.user, result.token);
      toast.success("Cuenta creada. ¡Bienvenido a Coffee Vibes!");
      router.push("/tienda");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wider text-tueste">
        Únete
      </p>
      <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-espresso">
        Crea tu cuenta
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 flex flex-col gap-4">
        <Input
          label="Nombre"
          placeholder="Tu nombre"
          error={errors.name?.message}
          {...register("name")}
        />
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
          placeholder="Mínimo 6 caracteres"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" size="lg" fullWidth loading={submitting} className="mt-2">
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-espresso/60">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-medium text-tueste-oscuro hover:underline">
          Ingresa aquí
        </Link>
      </p>
    </div>
  );
}
