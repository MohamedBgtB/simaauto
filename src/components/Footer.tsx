import { CarFront } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 border-t border-zinc-800 py-10 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sima-gold/10 border border-sima-gold/30 flex items-center justify-center text-sima-gold">
            <CarFront className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">SIMA AUTO</p>
            <p className="text-zinc-500">Vente et achat de voiture d'occasion et neuf</p>
          </div>
        </div>
        <p className="text-center md:text-right text-zinc-500">
          Contact Téléphone / WhatsApp:{" "}
          <a href={`tel:0${WHATSAPP_NUMBER.slice(3)}`} className="text-sima-gold font-bold hover:underline">
            0{WHATSAPP_NUMBER.slice(3)}
          </a>
        </p>
      </div>
    </footer>
  );
}
