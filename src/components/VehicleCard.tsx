"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { formatDH, formatKm } from "@/lib/utils";

export type VehicleCardData = {
  id: number;
  reference: string;
  make: string;
  modelRange: string;
  trimLine: string | null;
  priceDh: number;
  mileageKm: number;
  firstRegistration: string;
  status: "Disponible" | "Reserve" | "Vendu";
  mainImageUrl: string;
  images: string[]; // hero first
  transmission?: string | null;
  fuel?: string | null;
  isNew?: boolean;
};

const statusLabel: Record<string, string> = {
  Disponible: "Disponible",
  Reserve: "Réservé",
  Vendu: "Vendu",
};

export default function VehicleCard({ vehicle }: { vehicle: VehicleCardData }) {
  const images = vehicle.images.length > 0 ? vehicle.images : [vehicle.mainImageUrl];
  const [index, setIndex] = useState(0);

  const year = vehicle.firstRegistration?.split("/")[1] || "";

  function move(dir: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIndex((prev) => (prev + dir + images.length) % images.length);
  }

  return (
    <Link
      href={`/inventaire/${vehicle.id}`}
      className="group flex flex-col bg-zinc-900 rounded-2xl border border-zinc-800/80 overflow-hidden hover:border-zinc-700 transition duration-300"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
        <Image
          src={images[index]}
          alt={`${vehicle.make} ${vehicle.modelRange}`}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => move(-1, e)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white shadow opacity-0 group-hover:opacity-100 transition"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => move(1, e)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white shadow opacity-0 group-hover:opacity-100 transition"
              aria-label="Photo suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
        {vehicle.isNew && (
          <span className="absolute top-3 left-3 bg-sima-gold text-zinc-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
            Nouveau
          </span>
        )}
        {vehicle.status !== "Disponible" && (
          <span className="absolute top-3 right-3 bg-zinc-900/90 border border-zinc-700 text-zinc-200 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md">
            {statusLabel[vehicle.status]}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col text-sm flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start font-bold text-white text-base gap-2">
            <h3 className="line-clamp-1">
              {vehicle.make} {vehicle.modelRange}
            </h3>
            <span className="text-sima-gold font-extrabold whitespace-nowrap">
              {formatDH(vehicle.priceDh)}
            </span>
          </div>
          <p className="text-zinc-400 text-xs mt-1">
            {year} • {formatKm(vehicle.mileageKm)}
            {vehicle.transmission ? ` • ${vehicle.transmission}` : ""}
            {vehicle.fuel ? ` • ${vehicle.fuel}` : ""}
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <span className="line-clamp-1">{vehicle.trimLine || vehicle.reference}</span>
          <span className="text-sima-gold font-semibold flex items-center gap-1 shrink-0">
            Détails <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
