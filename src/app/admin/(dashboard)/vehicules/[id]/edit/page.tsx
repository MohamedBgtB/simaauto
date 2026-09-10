import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VehicleForm, { VehicleFormData } from "@/components/admin/VehicleForm";

export const revalidate = 0;

export default async function EditVehiclePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const v = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      gallery: { orderBy: [{ isHero: "desc" }, { displayOrder: "asc" }] },
      technicalData: true,
      features: { include: { feature: true } },
    },
  });
  if (!v) notFound();

  const td = v.technicalData;

  const initial: VehicleFormData = {
    id: v.id,
    reference: v.reference,
    make: v.make,
    modelRange: v.modelRange,
    trimLine: v.trimLine || "",
    priceDh: String(v.priceDh),
    mileageKm: String(v.mileageKm),
    firstRegistration: v.firstRegistration,
    status: v.status as any,
    featured: v.featured,
    description: v.description || "",
    vehicleCondition: td?.vehicleCondition || "",
    category: td?.category || "",
    origin: td?.origin || "",
    ownersCount: td?.ownersCount != null ? String(td.ownersCount) : "",
    cubicCapacity: td?.cubicCapacity || "",
    power: td?.power || "",
    driveType: td?.driveType || "",
    fuel: td?.fuel || "",
    energyConsumption: td?.energyConsumption || "",
    co2Emissions: td?.co2Emissions || "",
    transmission: td?.transmission || "",
    emissionClass: td?.emissionClass || "",
    emissionsSticker: td?.emissionsSticker || "",
    seatsCount: td?.seatsCount != null ? String(td.seatsCount) : "",
    doorCount: td?.doorCount || "",
    climatisation: td?.climatisation || "",
    parkingSensors: td?.parkingSensors || "",
    airbags: td?.airbags || "",
    manufacturerColour: td?.manufacturerColour || "",
    colour: td?.colour || "",
    interiorDesign: td?.interiorDesign || "",
    weight: td?.weight || "",
    cylinders: td?.cylinders != null ? String(td.cylinders) : "",
    tankCapacity: td?.tankCapacity || "",
    trailerLoadBraked: td?.trailerLoadBraked || "",
    trailerLoadUnbraked: td?.trailerLoadUnbraked || "",
    features: v.features.map((f) => f.feature.name),
    images: v.gallery.map((g) => ({ url: g.imageUrl, isHero: g.isHero })),
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-6">
        Modifier {v.make} {v.modelRange}
      </h1>
      <VehicleForm mode="edit" initial={initial} />
    </div>
  );
}
