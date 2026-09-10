import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDH, formatKm } from "@/lib/utils";
import VehicleRowActions from "@/components/admin/VehicleRowActions";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    include: { gallery: { where: { isHero: true }, take: 1 }, _count: { select: { leads: true } } },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Véhicules</h1>
          <p className="text-xs text-zinc-400 mt-0.5">{vehicles.length} véhicule(s) au total</p>
        </div>
        <Link
          href="/admin/vehicules/add"
          className="flex items-center gap-2 bg-sima-gold hover:bg-sima-goldHover text-zinc-950 font-bold text-xs px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" /> Ajouter une voiture
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-zinc-500 border-b border-zinc-800">
              <th className="px-4 py-3 font-semibold">Véhicule</th>
              <th className="px-4 py-3 font-semibold">Prix</th>
              <th className="px-4 py-3 font-semibold">Km</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
              <th className="px-4 py-3 font-semibold">Vitrine</th>
              <th className="px-4 py-3 font-semibold">Leads</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-zinc-800/30 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={v.gallery[0]?.imageUrl || v.mainImageUrl}
                      alt=""
                      className="w-14 h-10 object-cover rounded-lg border border-zinc-800"
                    />
                    <div>
                      <p className="font-semibold text-white">
                        {v.make} {v.modelRange}
                      </p>
                      <p className="text-xs text-zinc-500">{v.reference}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sima-gold font-bold">{formatDH(Number(v.priceDh))}</td>
                <td className="px-4 py-3 text-zinc-400">{formatKm(v.mileageKm)}</td>
                <td className="px-4 py-3">
                  <VehicleRowActions
                    id={v.id}
                    status={v.status}
                    featured={v.featured}
                    mode="status"
                  />
                </td>
                <td className="px-4 py-3">
                  <VehicleRowActions
                    id={v.id}
                    status={v.status}
                    featured={v.featured}
                    mode="featured"
                  />
                </td>
                <td className="px-4 py-3 text-zinc-400">{v._count.leads}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/vehicules/${v.id}/edit`}
                      className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 transition"
                    >
                      Modifier
                    </Link>
                    <VehicleRowActions id={v.id} status={v.status} featured={v.featured} mode="delete" />
                  </div>
                </td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-zinc-500">
                  Aucun véhicule pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
