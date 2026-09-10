import { NextRequest, NextResponse } from "next/server";
import { saveUploadedImage } from "@/lib/storage";
import { MAX_UPLOAD_MB } from "@/lib/constants";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Format non supporté (JPEG, PNG, WEBP)" }, { status: 400 });
    }
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      return NextResponse.json({ error: `Fichier trop volumineux (max ${MAX_UPLOAD_MB}MB)` }, { status: 400 });
    }

    const url = await saveUploadedImage(file);
    return NextResponse.json({ url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Échec du téléversement" }, { status: 500 });
  }
}
