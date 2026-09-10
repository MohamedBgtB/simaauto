"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CarFront, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur de connexion");
        setLoading(false);
        return;
      }
      router.push(searchParams.get("next") || "/admin");
      router.refresh();
    } catch {
      setError("Erreur serveur");
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-sima-gold/10 border border-sima-gold/30 flex items-center justify-center text-sima-gold mb-3">
            <CarFront className="w-7 h-7" />
          </div>
          <h1 className="font-extrabold text-lg text-white">SIMA AUTO — Admin</h1>
          <p className="text-xs text-zinc-400 mt-1">Connectez-vous pour gérer l'inventaire</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-zinc-300 text-sm font-semibold mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sima-gold"
            />
          </div>
          <div>
            <label className="block text-zinc-300 text-sm font-semibold mb-1.5">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sima-gold"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-sima-gold hover:bg-sima-goldHover text-zinc-950 font-bold text-sm px-4 py-3 rounded-xl transition disabled:opacity-60"
          >
            <Lock className="w-4 h-4" />
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
}
