import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: "SIMA AUTO — Vente et Achat de Voitures d'Occasion et Neuf",
  description:
    "Véhicules d'occasion certifiés et neufs. Qualité garantie, révision complète et accompagnement sur-mesure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-zinc-950 text-zinc-100 font-sans antialiased min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
