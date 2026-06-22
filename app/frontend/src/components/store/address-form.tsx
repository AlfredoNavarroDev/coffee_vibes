"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addressesApi, type AddressPayload } from "@/services/addresses.service";
import { getApiErrorMessage } from "@/lib/api-client";
import type { Address } from "@/types";

const schema = z.object({
  street: z.string().min(3, "La calle es muy corta"),
  city: z.string().min(2, "La ciudad es requerida"),
  reference: z.string().optional(),
  isDefault: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function AddressForm({
  address,
  onSaved,
  onCancel,
}: {
  address?: Address;
  onSaved: (address: Address) => void;
  onCancel?: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      street: address?.street ?? "",
      city: address?.city ?? "",
      reference: address?.reference ?? "",
      isDefault: address?.isDefault ?? false,
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const payload: AddressPayload = {
        street: values.street,
        city: values.city,
        reference: values.reference || undefined,
        isDefault: values.isDefault,
      };
      const result = address
        ? await addressesApi.update(address.id, payload)
        : await addressesApi.create(payload);
      toast.success(address ? "Dirección actualizada" : "Dirección agregada");
      onSaved(result);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Calle y número"
        placeholder="Av. Los Tostadores 123"
        error={errors.street?.message}
        {...register("street")}
      />
      <Input
        label="Ciudad / distrito"
        placeholder="Chosica, Lima"
        error={errors.city?.message}
        {...register("city")}
      />
      <Input
        label="Referencia (opcional)"
        placeholder="Frente al parque, portón verde"
        error={errors.reference?.message}
        {...register("reference")}
      />
      <label className="flex items-center gap-2 text-sm text-espresso/70">
        <input type="checkbox" className="h-4 w-4 accent-tueste" {...register("isDefault")} />
        Usar como dirección principal
      </label>

      <div className="flex gap-3">
        <Button type="submit" loading={submitting}>
          {address ? "Guardar cambios" : "Agregar dirección"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
