"use client";

import { useRef, useState } from "react";
import { Star, X, Upload, Loader2 } from "lucide-react";
import { MIN_PHOTOS, MAX_PHOTOS } from "@/lib/constants";

export type UploaderImage = { url: string; isHero: boolean };

export default function ImageUploader({
  images,
  onChange,
}: {
  images: UploaderImage[];
  onChange: (images: UploaderImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError("");

    const files = Array.from(fileList);
    const room = MAX_PHOTOS - images.length;
    if (room <= 0) {
      setError(`Maximum ${MAX_PHOTOS} photos. Supprimez-en avant d'en ajouter.`);
      return;
    }
    const toUpload = files.slice(0, room);
    if (files.length > room) {
      setError(`Seules les ${room} premières photos ont été ajoutées (limite de ${MAX_PHOTOS}).`);
    }

    setUploading(true);
    const uploaded: UploaderImage[] = [];
    for (const file of toUpload) {
      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Échec du téléversement");
        uploaded.push({ url: data.url, isHero: false });
      } catch (e: any) {
        setError(e.message || "Échec du téléversement d'une photo");
      }
    }

    const next = [...images, ...uploaded];
    if (next.length > 0 && !next.some((i) => i.isHero)) next[0].isHero = true;
    onChange(next);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function setHero(url: string) {
    onChange(images.map((img) => ({ ...img, isHero: img.url === url })));
  }

  function remove(url: string) {
    const next = images.filter((img) => img.url !== url);
    if (next.length > 0 && !next.some((i) => i.isHero)) next[0].isHero = true;
    onChange(next);
  }

  const count = images.length;
  const belowMin = count < MIN_PHOTOS;

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-zinc-700 hover:border-sima-gold/60 rounded-xl p-6 text-center cursor-pointer transition bg-zinc-950"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-zinc-300">
            <Loader2 className="w-6 h-6 animate-spin text-sima-gold" />
            <span className="text-xs">Téléversement en cours...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <Upload className="w-6 h-6 text-sima-gold" />
            <span className="text-sm font-semibold text-zinc-200">
              Cliquez ou glissez vos photos ici
            </span>
            <span className="text-xs">
              Entre {MIN_PHOTOS} et {MAX_PHOTOS} photos (JPEG, PNG, WEBP — 8MB max chacune)
            </span>
          </div>
        )}
      </div>

      <p className={`text-xs mt-2 font-semibold ${belowMin ? "text-amber-400" : "text-emerald-400"}`}>
        {count} / {MAX_PHOTOS} photo(s) — minimum {MIN_PHOTOS} requises
      </p>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
          {images.map((img) => (
            <div
              key={img.url}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 group ${
                img.isHero ? "border-sima-gold" : "border-zinc-800"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-end justify-between p-1.5 opacity-0 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setHero(img.url)}
                  className="p-1.5 rounded-lg bg-zinc-900/90 text-sima-gold hover:bg-zinc-900"
                  title="Choisir comme photo principale"
                >
                  <Star className="w-3.5 h-3.5" fill={img.isHero ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(img.url)}
                  className="p-1.5 rounded-lg bg-zinc-900/90 text-red-400 hover:bg-zinc-900"
                  title="Supprimer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {img.isHero && (
                <span className="absolute top-1.5 left-1.5 bg-sima-gold text-zinc-950 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                  Principale
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
