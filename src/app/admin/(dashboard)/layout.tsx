import Link from "next/link";
import { CarFront, ExternalLink } from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-zinc-800 bg-zinc-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-2 text-white font-bold text-sm">
            <CarFront className="w-5 h-5 text-sima-gold" />
            Espace Gestion
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-2 rounded-lg border border-zinc-800 hover:border-zinc-700 transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Voir le site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">{children}</div>
    </div>
  );
}
