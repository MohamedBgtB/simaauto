"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryViewer({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const safeImages = images.length > 0 ? images : ["/placeholder-car.svg"];

  function move(dir: number) {
    setIndex((prev) => (prev + dir + safeImages.length) % safeImages.length);
  }

  return (
    <div>
      <div className="relative aspect-[4/3] sm:aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
        <Image
          src={safeImages[index]}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
          priority
        />
        {safeImages.length > 1 && (
          <>
            <button
              onClick={() => move(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white shadow transition"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => move(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white shadow transition"
              aria-label="Photo suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="absolute bottom-3 right-3 bg-zinc-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {index + 1} / {safeImages.length}
            </span>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {safeImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition ${
                i === index ? "border-sima-gold" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt={`${alt} ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
