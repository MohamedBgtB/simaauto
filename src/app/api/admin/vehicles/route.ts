import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MIN_PHOTOS, MAX_PHOTOS } from "@/lib/constants";

export async function GET() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    include: { gallery: true, _count: { select: { leads: true } } },
  });
  return NextResponse.json(
    vehicles.map((v) => ({ ...v, priceDh: Number(v.priceDh) }))
  );
}

type ImageInput = { url: string; isHero?: boolean };

function validatePayload(body: any) {
  const errors: string[] = [];
  if (!body.reference) errors.push("Référence requise");
  if (!body.make) errors.push("Marque requise");
  if (!body.modelRange) errors.push("Modèle requis");
  if (!body.priceDh) errors.push("Prix requis");
  if (!body.mileageKm && body.mileageKm !== 0) errors.push("Kilométrage requis");
  if (!body.firstRegistration) errors.push("Première immatriculation requise");

  const images: ImageInput[] = Array.isArray(body.images) ? body.images : [];
  if (images.length < MIN_PHOTOS) {
    errors.push(`Au moins ${MIN_PHOTOS} photos sont requises (${images.length} fournies)`);
  }
  if (images.length > MAX_PHOTOS) {
    errors.push(`Maximum ${MAX_PHOTOS} photos autorisées (${images.length} fournies)`);
  }
  return errors;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const errors = validatePayload(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" · ") }, { status: 400 });
    }

    const images: ImageInput[] = body.images;
    let heroIndex = images.findIndex((img) => img.isHero);
    if (heroIndex === -1) heroIndex = 0;

    const td = body.technicalData || {};
    const featureNames: string[] = Array.isArray(body.features) ? body.features : [];

    const vehicle = await prisma.vehicle.create({
      data: {
        reference: body.reference,
        make: body.make,
        modelRange: body.modelRange,
        trimLine: body.trimLine || null,
        priceDh: Number(body.priceDh),
        mileageKm: Number(body.mileageKm),
        firstRegistration: body.firstRegistration,
        status: body.status || "Disponible",
        featured: !!body.featured,
        mainImageUrl: images[heroIndex].url,
        description: body.description || null,
        technicalData: { create: { ...td } },
        gallery: {
          create: images.map((img, i) => ({
            imageUrl: img.url,
            displayOrder: i,
            isHero: i === heroIndex,
          })),
        },
      },
    });

    if (featureNames.length > 0) {
      const features = await prisma.feature.findMany({ where: { name: { in: featureNames } } });
      await prisma.vehicleFeature.createMany({
        data: features.map((f) => ({ vehicleId: vehicle.id, featureId: f.id })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ ok: true, id: vehicle.id });
  } catch (err: any) {
    console.error(err);
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Cette référence existe déjà" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
