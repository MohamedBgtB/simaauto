import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export default function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Bonjour Sima Auto, je souhaite avoir plus d'informations."
      )}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-full shadow-2xl transition md:hidden"
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
