"use client";

import { useState } from "react";
import { PhoneCall } from "lucide-react";

export default function LeadButtons({ vehicleId, label }: { vehicleId: number; label: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          customerName: name,
          phoneNumber: phone,
          channel: "PhoneCall",
          notes: `Demande de rappel pour ${label}`,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-emerald-400 font-semibold text-center py-2">
        Merci ! Nous vous rappelons très vite.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-sima-gold hover:bg-sima-goldHover text-zinc-950 font-bold text-sm px-4 py-3 rounded-xl transition"
      >
        <PhoneCall className="w-4 h-4" /> Demander un rappel
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <input
        type="text"
        required
        placeholder="Votre nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sima-gold"
      />
      <input
        type="tel"
        required
        placeholder="Votre numéro"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sima-gold"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-sima-gold hover:bg-sima-goldHover text-zinc-950 font-bold text-sm px-4 py-2.5 rounded-xl transition disabled:opacity-60"
      >
        {status === "sending" ? "Envoi..." : "Envoyer"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400">Une erreur est survenue, réessayez.</p>
      )}
    </form>
  );
}
