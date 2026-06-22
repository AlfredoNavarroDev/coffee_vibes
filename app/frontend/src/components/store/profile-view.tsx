"use client";

import { useState } from "react";
import { Plus, Trash2, MapPin, Star } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { useAsyncData } from "@/hooks/use-async-data";
import { addressesApi } from "@/services/addresses.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { Badge } from "@/components/ui/badge";
import { AddressForm } from "@/components/store/address-form";

const ROLE_LABEL: Record<string, string> = {
  CUSTOMER: "Cliente",
  OWNER: "Dueño",
  ADMIN: "Administrador",
};

export function ProfileView() {
  const user = useAuthStore((s) => s.user);
  const { data: addresses, loading, error, refetch } = useAsyncData(
    () => addressesApi.list(),
    []
  );
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(id: number) {
    if (!confirm("¿Eliminar esta dirección?")) return;
    try {
      await addressesApi.remove(id);
      toast.success("Dirección eliminada");
      refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    }
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-sm border border-linea bg-pergamino p-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-espresso/50">
          Datos de la cuenta
        </p>
        <div className="dash-line my-3" />
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-[10px] uppercase text-espresso/40">Nombre</dt>
            <dd className="mt-0.5 text-sm text-espresso">{user.name || "—"}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase text-espresso/40">Email</dt>
            <dd className="mt-0.5 text-sm text-espresso">{user.email}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase text-espresso/40">Rol</dt>
            <dd className="mt-0.5">
              <Badge className="border-oliva text-oliva-oscuro">
                {ROLE_LABEL[user.role]}
              </Badge>
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-wider text-espresso/55">
            Mis direcciones
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-tueste-oscuro hover:underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-4 rounded-sm border border-linea bg-pergamino p-4">
            <AddressForm
              onSaved={() => {
                setShowForm(false);
                refetch();
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {loading && <LoadingState label="Cargando direcciones..." />}
        {error && <ErrorState message={error} onRetry={refetch} />}

        {!loading && !error && addresses && addresses.length === 0 && !showForm && (
          <EmptyState
            title="Sin direcciones guardadas"
            description="Agrega una dirección para agilizar tus próximos pedidos por delivery."
          />
        )}

        {!loading && addresses && addresses.length > 0 && (
          <div className="flex flex-col gap-2">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="flex items-start justify-between gap-3 rounded-sm border border-linea bg-pergamino p-3.5"
              >
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-tueste" />
                  <div>
                    <p className="text-sm font-medium text-espresso">{addr.street}</p>
                    <p className="text-xs text-espresso/55">{addr.city}</p>
                    {addr.reference && (
                      <p className="text-xs text-espresso/45">{addr.reference}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {addr.isDefault && (
                    <Star className="h-4 w-4 fill-miel text-miel" />
                  )}
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-espresso/40 hover:text-rojo-error"
                    aria-label="Eliminar dirección"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
