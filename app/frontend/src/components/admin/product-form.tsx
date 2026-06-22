"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAsyncData } from "@/hooks/use-async-data";
import { categoriesApi, catalogApi } from "@/services/catalog.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/states";
import type { Product } from "@/types";

const PRODUCT_TYPES = [
  { value: "grano", label: "Grano" },
  { value: "molido", label: "Molido" },
  { value: "bebida", label: "Bebida" },
  { value: "accesorio", label: "Accesorio" },
];

const schema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  categoryId: z.coerce.number().int().min(1, "Elige una categoría"),
  productType: z.string().min(1, "Elige un tipo"),
  hasSizes: z.boolean().optional(),
  basePrice: z.coerce.number().min(0.01, "El precio debe ser mayor a 0"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
});

type FormValues = z.input<typeof schema>;

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { data: categories, loading: loadingCategories } = useAsyncData(
    () => categoriesApi.list(),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      imageUrl: product?.imageUrl ?? "",
      categoryId: product?.categoryId ?? undefined,
      productType: product?.productType ?? "",
      hasSizes: product?.hasSizes ?? false,
      basePrice: product ? Number(product.basePrice) : undefined,
      stock: product?.stock ?? 0,
    },
  });

  async function onSubmit(rawValues: FormValues) {
    const values = schema.parse(rawValues);
    setSubmitting(true);
    try {
      const payload = {
        name: values.name,
        description: values.description || undefined,
        imageUrl: values.imageUrl || undefined,
        categoryId: values.categoryId,
        productType: values.productType,
        hasSizes: values.hasSizes,
        // Se envía como string decimal: el backend valida con isDecimal()
        // de express-validator, que espera un string con formato decimal.
        basePrice: values.basePrice.toFixed(2),
        stock: values.stock,
      };

      if (product) {
        await catalogApi.updateProduct(product.id, payload);
        toast.success("Producto actualizado");
      } else {
        await catalogApi.createProduct(payload);
        toast.success("Producto creado");
      }
      router.push("/admin/productos");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingCategories) return <LoadingState label="Cargando categorías..." />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nombre del producto"
        placeholder="Espresso"
        error={errors.name?.message}
        {...register("name")}
      />
      <Textarea
        label="Descripción"
        placeholder="Café espresso clásico, intenso y aromático"
        error={errors.description?.message}
        {...register("description")}
      />
      <Input
        label="URL de imagen"
        placeholder="https://..."
        error={errors.imageUrl?.message}
        {...register("imageUrl")}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select label="Categoría" error={errors.categoryId?.message} {...register("categoryId")}>
          <option value="">Selecciona una categoría</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>

        <Select label="Tipo de producto" error={errors.productType?.message} {...register("productType")}>
          <option value="">Selecciona un tipo</option>
          {PRODUCT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Precio base (S/)"
          type="number"
          step="0.01"
          min="0"
          error={errors.basePrice?.message}
          {...register("basePrice")}
        />
        <Input
          label="Stock inicial"
          type="number"
          min="0"
          error={errors.stock?.message}
          {...register("stock")}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-espresso/70">
        <input type="checkbox" className="h-4 w-4 accent-tueste" {...register("hasSizes")} />
        Este producto tiene tamaños (chico / mediano / grande)
      </label>

      <p className="rounded-sm border border-linea-fuerte bg-pergamino-2 px-3.5 py-2.5 text-xs text-espresso/55">
        Los tamaños y modificadores se administran directamente en la base de datos por ahora.
        Esta es la información base del producto.
      </p>

      <div className="mt-2 flex gap-3">
        <Button type="submit" loading={submitting}>
          {product ? "Guardar cambios" : "Crear producto"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/productos")}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
