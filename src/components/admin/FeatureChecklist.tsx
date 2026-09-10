"use client";

import { FEATURES } from "@/lib/constants";

export default function FeatureChecklist({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (features: string[]) => void;
}) {
  function toggle(name: string) {
    if (selected.includes(name)) {
      onChange(selected.filter((f) => f !== name));
    } else {
      onChange([...selected, name]);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white">Équipements</h3>
        <div className="flex gap-3 text-xs">
          <button
            type="button"
            onClick={() => onChange([...FEATURES])}
            className="text-sima-gold hover:underline font-semibold"
          >
            Tout sélectionner
          </button>
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-zinc-400 hover:text-white font-semibold"
          >
            Tout désélectionner
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs text-zinc-300 bg-zinc-950 p-5 rounded-xl border border-zinc-800">
        {FEATURES.map((feat) => (
          <label key={feat} className="flex items-center gap-2.5 cursor-pointer hover:text-white transition">
            <input
              type="checkbox"
              checked={selected.includes(feat)}
              onChange={() => toggle(feat)}
              className="rounded border-zinc-700 bg-zinc-900 text-sima-gold focus:ring-0 accent-sima-gold"
            />
            {feat}
          </label>
        ))}
      </div>
    </div>
  );
}
