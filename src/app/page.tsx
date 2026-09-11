import Link from "next/link";
import { MessageSquare, Search, SlidersHorizontal } from "lucide-react";
import VehicleCard from "@/components/VehicleCard";
import { getNewArrivals } from "@/lib/vehicles";
import { BODY_CATEGORIES, WHATSAPP_NUMBER } from "@/lib/constants";

export const revalidate = 0;

export default async function HomePage() {
  const newArrivals = await getNewArrivals(8);

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative bg-zinc-900 py-12 border-b border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-900/90 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1600&q=80"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          alt="Sima Auto Showroom"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="inline-block bg-sima-gold/10 border border-sima-gold/30 text-sima-gold text-xs font-bold px-3 py-1 rounded-full mb-3">
              Sima Auto • Vente &amp; Achat
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trouvez Votre Prochaine Voiture de Confiance
            </h1>
            <p className="text-zinc-400 text-sm mt-2 max-w-xl">
              Véhicules d'occasion certifiés et neufs. Qualité garantie, révision complète et
              accompagnement sur-mesure.
            </p>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Bonjour Sima Auto, je souhaite vendre/acheter une voiture"
            )}`}
            target="_blank"
            rel="noreferrer"
            className="bg-sima-gold hover:bg-sima-goldHover text-zinc-950 font-bold px-6 py-3 rounded-xl transition shadow-lg flex items-center gap-2 text-sm shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Vendre Votre Voiture</span>
          </a>
        </div>
      </section>

      <section className="bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <form method="get" action="/inventaire" className="flex flex-wrap gap-3 items-center">
            <div className="flex flex-1 min-w-[280px] items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
              <Search className="w-4 h-4 text-sima-gold" />
              <input
                type="text"
                name="q"
                placeholder="Rechercher une voiture..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-sima-gold hover:bg-sima-goldHover text-zinc-950 font-bold px-5 py-3 rounded-xl text-sm transition"
            >
              Rechercher
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/inventaire"
              className="rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-sima-gold hover:text-zinc-950 transition"
            >
              Tous les véhicules
            </Link>
            {BODY_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/inventaire?category=${encodeURIComponent(category)}`}
                className="rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-sima-gold hover:text-zinc-950 transition"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Arrivages Récents</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Les derniers véhicules ajoutés à notre showroom
            </p>
          </div>
          <Link
            href="/inventaire"
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-xs font-semibold hover:bg-zinc-800 text-zinc-200 transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-sima-gold" />
            <span>Voir tout l'inventaire</span>
          </Link>
        </div>

        {newArrivals.length === 0 ? (
          <p className="text-zinc-500 text-sm">Aucun véhicule publié pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
