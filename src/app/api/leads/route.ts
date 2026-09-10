import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vehicleId, customerName, phoneNumber, channel, notes } = body;

    if (!phoneNumber && !customerName) {
      return NextResponse.json({ error: "Nom ou téléphone requis" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        vehicleId: vehicleId ? Number(vehicleId) : null,
        customerName: customerName || null,
        phoneNumber: phoneNumber || null,
        channel: channel && ["WhatsApp", "PhoneCall", "Form"].includes(channel) ? channel : "Form",
        notes: notes || null,
      },
    });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
