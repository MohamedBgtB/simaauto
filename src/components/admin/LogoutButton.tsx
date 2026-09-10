"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 transition flex items-center gap-1.5"
    >
      <LogOut className="w-3.5 h-3.5" /> Déconnexion
    </button>
  );
}
