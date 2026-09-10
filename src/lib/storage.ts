import { put, del } from "@vercel/blob";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Saves an uploaded image and returns its public URL.
 * - On Vercel (or anywhere BLOB_READ_WRITE_TOKEN is set): uploads to Vercel Blob.
 *   This is required in production because serverless filesystems are read-only/ephemeral.
 * - Locally without a token: writes to /public/uploads so `npm run dev` works out of the box.
 */
export async function saveUploadedImage(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

  if (useBlob) {
    const blob = await put(`vehicles/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function deleteUploadedImage(url: string): Promise<void> {
  try {
    if (useBlob && url.includes("blob.vercel-storage.com")) {
      await del(url);
      return;
    }
    if (url.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "public", url);
      await unlink(filePath);
    }
  } catch {
    // best effort — never block a request on cleanup failing
  }
}
