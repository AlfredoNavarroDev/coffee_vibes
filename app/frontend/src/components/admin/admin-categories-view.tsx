"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Pencil, Plus, X } from "lucide-react";
import { useAsyncData } from "@/hooks/use-async-data";
import { categoriesApi } from "@/services/catalog.service";
import { getApiErrorMessage } from "@/lib/api-client";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminCategoriesView() {
  const { data: categories, loading, error, refetch } = useAsyncData(
    () => categoriesApi.list(),
    []
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      await categoriesApi.create(newName.trim());
      toast.success("Categoría creada");
      setNewName("");
      refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setCreating(false);
    }
  }

  async function handleSaveEdit(id: number) {
    if (!editValue.trim()) return;
    setSaving(true);
    try {
      await categoriesApi.update(id, editValue.trim());
      toast.success("Categoría actualizada");
      setEditingId(null);
      refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState label="Cargando categorías..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      <div className="flex gap-2">
        <Input
          placeholder="Nombre de la nueva categoría"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          className="flex-1"
        />
        <Button onClick={handleCreate} loading={creating}>
          <Plus className="h-4 w-4" />
          Agregar
        </Button>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {!categories || categories.length === 0 ? (
          <EmptyState title="Sin categorías todavía" />
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between gap-3 rounded-sm border border-linea bg-pergamino p-3.5"
            >
              {editingId === cat.id ? (
                <>
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(cat.id)}
                    className="h-9 flex-1 rounded-sm border border-tueste bg-pergamino px-3 text-sm outline-none"
                  />
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleSaveEdit(cat.id)}
                      disabled={saving}
                      className="flex h-8 w-8 items-center justify-center rounded-sm border border-oliva text-oliva-oscuro"
                      aria-label="Guardar"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex h-8 w-8 items-center justify-center rounded-sm border border-linea-fuerte text-espresso/50"
                      aria-label="Cancelar"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm font-medium text-espresso">{cat.name}</p>
                    <p className="font-mono text-[10px] text-espresso/40">
                      {cat.products?.length ?? 0} productos · /{cat.slug}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingId(cat.id);
                      setEditValue(cat.name);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-sm border border-linea-fuerte text-espresso/60 hover:border-tueste hover:text-tueste-oscuro"
                    aria-label="Editar"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
