import Link from "next/link";
import { CarFront, Phone } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-sima-gold/10 border border-sima-gold/30 flex items-center justify-center text-sima-gold">
              <CarFront className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-sima-gold leading-none">
                SIMA AUTO
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-normal mt-0.5">
                Achat &amp; Vente de Voitures
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-300">
            <Link href="/inventaire" className="hover:text-sima-gold transition">
              Inventaire
            </Link>
            <Link href="/contact" className="hover:text-sima-gold transition">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2.5 rounded-full flex items-center gap-2 shadow-md transition"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">0{WHATSAPP_NUMBER.slice(3)}</span>
            </a>
            <Link
              href="/admin"
              className="text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg border border-zinc-800 hover:border-zinc-600 transition"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
