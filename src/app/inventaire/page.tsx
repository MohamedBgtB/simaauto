import VehicleCard from "@/components/VehicleCard";
import { getVehicles, getDistinctMakes } from "@/lib/vehicles";
import { BODY_CATEGORIES } from "@/lib/constants";

export const revalidate = 0;

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: { make?: string; maxPrice?: string; maxMileage?: string; q?: string; category?: string };
}) {
  const [vehicles, makes] = await Promise.all([
    getVehicles({
      make: searchParams.make || undefined,
      maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
      maxMileage: searchParams.maxMileage ? Number(searchParams.maxMileage) : undefined,
      q: searchParams.q || undefined,
      category: searchParams.category || undefined,
    }),
    getDistinctMakes(),
  ]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Inventaire</h1>
        <p className="text-xs text-zinc-400 mt-0.5">{vehicles.length} véhicule(s) trouvé(s)</p>
      </div>

      <form
        method="get"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
      >
        <select
          name="make"
          defaultValue={searchParams.make || ""}
          className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sima-gold"
        >
          <option value="">Toutes les marques</option>
          {makes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <select
          name="category"
          defaultValue={searchParams.category || ""}
          className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sima-gold"
        >
          <option value="">Toutes les catégories</option>
          {BODY_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="maxPrice"
          placeholder="Budget max (DH)"
          defaultValue={searchParams.maxPrice || ""}
          className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sima-gold placeholder:text-zinc-600"
        />
        <input
          type="number"
          name="maxMileage"
          placeholder="Kilométrage max"
          defaultValue={searchParams.maxMileage || ""}
          className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sima-gold placeholder:text-zinc-600"
        />
        <div className="flex gap-2">
          <input
            type="text"
            name="q"
            placeholder="Rechercher..."
            defaultValue={searchParams.q || ""}
            className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-sima-gold placeholder:text-zinc-600"
          />
          <button
            type="submit"
            className="bg-sima-gold hover:bg-sima-goldHover text-zinc-950 font-bold px-4 rounded-xl transition text-sm shrink-0"
          >
            Filtrer
          </button>
        </div>
      </form>

      {vehicles.length === 0 ? (
        <p className="text-zinc-500 text-sm">Aucun véhicule ne correspond à ces critères.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </main>
  );
}
