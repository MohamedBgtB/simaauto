import { notFound } from "next/navigation";
import { Phone, MessageCircle, Gauge, Calendar, Fuel, Settings2, Check } from "lucide-react";
import { getVehicleDetail } from "@/lib/vehicles";
import { formatDH, formatKm } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import GalleryViewer from "@/components/GalleryViewer";
import LeadButtons from "@/components/LeadButtons";

export const revalidate = 0;

export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const vehicle = await getVehicleDetail(id);
  if (!vehicle) notFound();

  const td = vehicle.technicalData;
  const year = vehicle.firstRegistration?.split("/")[1] || "";

  const specRows: [string, string | number | null | undefined][] = [
    ["État", td?.vehicleCondition],
    ["Catégorie", td?.category],
    ["Origine", td?.origin],
    ["Propriétaires", td?.ownersCount],
    ["Cylindrée", td?.cubicCapacity],
    ["Puissance", td?.power],
    ["Motorisation", td?.driveType],
    ["Carburant", td?.fuel],
    ["Consommation", td?.energyConsumption],
    ["CO₂", td?.co2Emissions],
    ["Boîte", td?.transmission],
    ["Classe d'émission", td?.emissionClass],
    ["Vignette", td?.emissionsSticker],
    ["Places", td?.seatsCount],
    ["Portes", td?.doorCount],
    ["Climatisation", td?.climatisation],
    ["Aide au stationnement", td?.parkingSensors],
    ["Airbags", td?.airbags],
    ["Couleur constructeur", td?.manufacturerColour],
    ["Couleur", td?.colour],
    ["Intérieur", td?.interiorDesign],
    ["Poids", td?.weight],
    ["Cylindres", td?.cylinders],
    ["Réservoir", td?.tankCapacity],
    ["Charge remorquée freinée", td?.trailerLoadBraked],
    ["Charge remorquée non-freinée", td?.trailerLoadUnbraked],
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
      <div className="mb-6">
        <p className="text-xs text-sima-gold font-semibold">{vehicle.reference}</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {vehicle.make} {vehicle.modelRange}
        </h1>
        {vehicle.trimLine && <p className="text-zinc-400 text-sm mt-1">{vehicle.trimLine}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <GalleryViewer images={vehicle.images} alt={`${vehicle.make} ${vehicle.modelRange}`} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col items-center text-center gap-1">
              <Calendar className="w-4 h-4 text-sima-gold" />
              <span className="text-xs text-zinc-400">Année</span>
              <span className="text-sm font-bold text-white">{year}</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col items-center text-center gap-1">
              <Gauge className="w-4 h-4 text-sima-gold" />
              <span className="text-xs text-zinc-400">Kilométrage</span>
              <span className="text-sm font-bold text-white">{formatKm(vehicle.mileageKm)}</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col items-center text-center gap-1">
              <Settings2 className="w-4 h-4 text-sima-gold" />
              <span className="text-xs text-zinc-400">Boîte</span>
              <span className="text-sm font-bold text-white">{td?.transmission || "-"}</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col items-center text-center gap-1">
              <Fuel className="w-4 h-4 text-sima-gold" />
              <span className="text-xs text-zinc-400">Carburant</span>
              <span className="text-sm font-bold text-white">{td?.fuel || "-"}</span>
            </div>
          </div>

          {vehicle.description && (
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Description</h2>
              <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>
          )}

          <div>
            <h2 className="text-lg font-bold text-white mb-3">Fiche Technique</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl divide-y divide-zinc-800/80 overflow-hidden">
              {specRows
                .filter(([, v]) => v !== null && v !== undefined && v !== "")
                .map(([label, value]) => (
                  <div key={label} className="flex justify-between px-4 py-2.5 text-xs">
                    <span className="text-zinc-500">{label}</span>
                    <span className="text-zinc-200 font-medium">{value}</span>
                  </div>
                ))}
            </div>
          </div>

          {vehicle.features.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-3">Équipements</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {vehicle.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-sima-gold shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-28 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
            <div>
              <p className="text-xs text-zinc-400">Prix</p>
              <p className="text-3xl font-extrabold text-sima-gold">{formatDH(vehicle.priceDh)}</p>
            </div>
            <LeadButtons vehicleId={vehicle.id} label={`${vehicle.make} ${vehicle.modelRange}`} />
            <a
              href={`tel:0${WHATSAPP_NUMBER.slice(3)}`}
              className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm px-4 py-3 rounded-xl transition"
            >
              <Phone className="w-4 h-4" /> Appeler
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Bonjour, je suis intéressé(e) par ${vehicle.make} ${vehicle.modelRange} (${vehicle.reference})`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-3 rounded-xl transition"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
