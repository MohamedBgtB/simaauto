"use client";

import { useState } from "react";
import { Phone, MessageCircle, MapPin, Mail } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phoneNumber: phone,
          channel: "Form",
          notes: message,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setName("");
      setPhone("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
      <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Contactez-nous</h1>
      <p className="text-xs text-zinc-400 mb-8">
        Une question, un véhicule à vendre ou à acheter ? Écrivez-nous.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={submit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-zinc-300 text-sm font-semibold mb-1.5">Nom</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sima-gold"
            />
          </div>
          <div>
            <label className="block text-zinc-300 text-sm font-semibold mb-1.5">Téléphone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sima-gold"
            />
          </div>
          <div>
            <label className="block text-zinc-300 text-sm font-semibold mb-1.5">Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sima-gold"
            />
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-sima-gold hover:bg-sima-goldHover text-zinc-950 font-bold text-sm px-4 py-3 rounded-xl transition disabled:opacity-60"
          >
            {status === "sending" ? "Envoi..." : "Envoyer le message"}
          </button>
          {status === "sent" && (
            <p className="text-xs text-emerald-400 font-semibold">Message envoyé, merci !</p>
          )}
          {status === "error" && (
            <p className="text-xs text-red-400">Une erreur est survenue, réessayez.</p>
          )}
        </form>

        <div className="space-y-4">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 hover:border-emerald-600 rounded-2xl p-5 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-600/10 border border-emerald-600/30 flex items-center justify-center text-emerald-500">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">WhatsApp</p>
              <p className="text-zinc-400 text-xs">0{WHATSAPP_NUMBER.slice(3)}</p>
            </div>
          </a>
          <a
            href={`tel:0${WHATSAPP_NUMBER.slice(3)}`}
            className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 hover:border-sima-gold rounded-2xl p-5 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-sima-gold/10 border border-sima-gold/30 flex items-center justify-center text-sima-gold">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Téléphone</p>
              <p className="text-zinc-400 text-xs">0{WHATSAPP_NUMBER.slice(3)}</p>
            </div>
          </a>
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="w-11 h-11 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Showroom</p>
              <p className="text-zinc-400 text-xs">Rabat, Maroc</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="w-11 h-11 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Email</p>
              <p className="text-zinc-400 text-xs">contact@simaauto.ma</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
