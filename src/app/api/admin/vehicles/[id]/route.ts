import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteUploadedImage } from "@/lib/storage";
import { MIN_PHOTOS, MAX_PHOTOS } from "@/lib/constants";

type ImageInput = { url: string; isHero?: boolean };

function idFrom(params: { id: string }) {
  const id = Number(params.id);
  return Number.isNaN(id) ? null : id;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = idFrom(params);
  if (id === null) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      gallery: { orderBy: [{ isHero: "desc" }, { displayOrder: "asc" }] },
      technicalData: true,
      features: { include: { feature: true } },
    },
  });
  if (!vehicle) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  return NextResponse.json({
    ...vehicle,
    priceDh: Number(vehicle.priceDh),
    features: vehicle.features.map((f) => f.feature.name),
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = idFrom(params);
  if (id === null) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  try {
    const body = await req.json();
    const images: ImageInput[] = Array.isArray(body.images) ? body.images : [];

    if (images.length < MIN_PHOTOS) {
      return NextResponse.json(
        { error: `Au moins ${MIN_PHOTOS} photos sont requises (${images.length} fournies)` },
        { status: 400 }
      );
    }
    if (images.length > MAX_PHOTOS) {
      return NextResponse.json(
        { error: `Maximum ${MAX_PHOTOS} photos autorisées (${images.length} fournies)` },
        { status: 400 }
      );
    }

    let heroIndex = images.findIndex((img) => img.isHero);
    if (heroIndex === -1) heroIndex = 0;

    const existing = await prisma.vehicle.findUnique({
      where: { id },
      include: { gallery: true },
    });
    if (!existing) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

    // Clean up photos that were removed in this edit
    const newUrls = new Set(images.map((i) => i.url));
    const removed = existing.gallery.filter((g) => !newUrls.has(g.imageUrl));
    await Promise.all(removed.map((g) => deleteUploadedImage(g.imageUrl)));

    const td = body.technicalData || {};
    const featureNames: string[] = Array.isArray(body.features) ? body.features : [];

    await prisma.$transaction([
      prisma.vehicleGallery.deleteMany({ where: { vehicleId: id } }),
      prisma.vehicleFeature.deleteMany({ where: { vehicleId: id } }),
      prisma.vehicleTechnicalData.deleteMany({ where: { vehicleId: id } }),
      prisma.vehicle.update({
        where: { id },
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
      }),
    ]);

    if (featureNames.length > 0) {
      const features = await prisma.feature.findMany({ where: { name: { in: featureNames } } });
      await prisma.vehicleFeature.createMany({
        data: features.map((f) => ({ vehicleId: id, featureId: f.id })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    console.error(err);
    if (err?.code === "P2002") {
      return NextResponse.json({ error: "Cette référence existe déjà" }, { status: 409 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  // Quick partial updates: toggle featured / change status from the dashboard list.
  const id = idFrom(params);
  if (id === null) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  try {
    const body = await req.json();
    const data: any = {};
    if (typeof body.featured === "boolean") data.featured = body.featured;
    if (body.status) data.status = body.status;

    const vehicle = await prisma.vehicle.update({ where: { id }, data });
    return NextResponse.json({ ok: true, id: vehicle.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = idFrom(params);
  if (id === null) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  const existing = await prisma.vehicle.findUnique({ where: { id }, include: { gallery: true } });
  if (!existing) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  await prisma.vehicle.delete({ where: { id } });
  await Promise.all(existing.gallery.map((g) => deleteUploadedImage(g.imageUrl)));

  return NextResponse.json({ ok: true });
}
