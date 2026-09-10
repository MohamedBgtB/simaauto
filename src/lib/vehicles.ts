import { prisma } from "@/lib/prisma";
import type { VehicleCardData } from "@/components/VehicleCard";

const NEW_ARRIVAL_DAYS = 30;

function toCardData(v: any): VehicleCardData {
  const images = (v.gallery as any[])
    .slice()
    .sort((a, b) => (b.isHero ? 1 : 0) - (a.isHero ? 1 : 0) || a.displayOrder - b.displayOrder)
    .map((g) => g.imageUrl);

  const isNew =
    new Date(v.createdAt).getTime() > Date.now() - NEW_ARRIVAL_DAYS * 24 * 60 * 60 * 1000;

  return {
    id: v.id,
    reference: v.reference,
    make: v.make,
    modelRange: v.modelRange,
    trimLine: v.trimLine,
    priceDh: Number(v.priceDh),
    mileageKm: v.mileageKm,
    firstRegistration: v.firstRegistration,
    status: v.status,
    mainImageUrl: v.mainImageUrl,
    images: images.length > 0 ? images : [v.mainImageUrl],
    transmission: v.technicalData?.transmission ?? null,
    fuel: v.technicalData?.fuel ?? null,
    isNew,
  };
}

export type VehicleFilters = {
  make?: string;
  category?: string;
  maxPrice?: number;
  maxMileage?: number;
  q?: string;
};

export async function getNewArrivals(limit = 8) {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: { not: "Vendu" } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { gallery: true, technicalData: true },
  });
  return vehicles.map(toCardData);
}

export async function getVehicles(filters: VehicleFilters = {}) {
  const where: any = {};
  if (filters.make) where.make = { equals: filters.make };
  if (filters.maxPrice) where.priceDh = { lte: filters.maxPrice };
  if (filters.maxMileage) where.mileageKm = { lte: filters.maxMileage };
  if (filters.category) where.technicalData = { category: filters.category };
  if (filters.q) {
    where.OR = [
      { make: { contains: filters.q } },
      { modelRange: { contains: filters.q } },
      { trimLine: { contains: filters.q } },
    ];
  }

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { gallery: true, technicalData: true },
  });
  return vehicles.map(toCardData);
}

export async function getVehicleDetail(id: number) {
  const v = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      gallery: { orderBy: [{ isHero: "desc" }, { displayOrder: "asc" }] },
      technicalData: true,
      features: { include: { feature: true } },
    },
  });
  if (!v) return null;
  return {
    ...v,
    priceDh: Number(v.priceDh),
    images: v.gallery.map((g) => g.imageUrl),
    features: v.features.map((f) => f.feature.name),
  };
}

export async function getDistinctMakes() {
  const rows = await prisma.vehicle.findMany({
    select: { make: true },
    distinct: ["make"],
    orderBy: { make: "asc" },
  });
  return rows.map((r) => r.make);
}
