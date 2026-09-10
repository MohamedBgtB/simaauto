"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Star, Trash2 } from "lucide-react";

type Status = "Disponible" | "Reserve" | "Vendu";

export default function VehicleRowActions({
  id,
  status,
  featured,
  mode,
}: {
  id: number;
  status: Status;
  featured: boolean;
  mode: "status" | "featured" | "delete";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function patch(data: any) {
    setLoading(true);
    await fetch(`/api/admin/vehicles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Supprimer définitivement ce véhicule et ses photos ?")) return;
    setLoading(true);
    await fetch(`/api/admin/vehicles/${id}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  if (mode === "status") {
    return (
      <select
        defaultValue={status}
        disabled={loading}
        onChange={(e) => patch({ status: e.target.value })}
        className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-sima-gold disabled:opacity-60"
      >
        <option value="Disponible">Disponible</option>
        <option value="Reserve">Réservé</option>
        <option value="Vendu">Vendu</option>
      </select>
    );
  }

  if (mode === "featured") {
    return (
      <button
        onClick={() => patch({ featured: !featured })}
        disabled={loading}
        className={`p-1.5 rounded-lg border transition disabled:opacity-60 ${
          featured
            ? "bg-sima-gold/10 border-sima-gold/40 text-sima-gold"
            : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300"
        }`}
        title={featured ? "Retirer de la vitrine" : "Mettre en vitrine"}
      >
        <Star className="w-4 h-4" fill={featured ? "currentColor" : "none"} />
      </button>
    );
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 rounded-lg border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-500/40 transition disabled:opacity-60"
      title="Supprimer"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
