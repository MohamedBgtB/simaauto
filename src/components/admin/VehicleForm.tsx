"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import ImageUploader, { UploaderImage } from "@/components/admin/ImageUploader";
import FeatureChecklist from "@/components/admin/FeatureChecklist";
import { BODY_CATEGORIES } from "@/lib/constants";

export type VehicleFormData = {
  id?: number;
  reference: string;
  make: string;
  modelRange: string;
  trimLine: string;
  priceDh: string;
  mileageKm: string;
  firstRegistration: string;
  status: "Disponible" | "Reserve" | "Vendu";
  featured: boolean;
  description: string;
  vehicleCondition: string;
  category: string;
  origin: string;
  ownersCount: string;
  cubicCapacity: string;
  power: string;
  driveType: string;
  fuel: string;
  energyConsumption: string;
  co2Emissions: string;
  transmission: string;
  emissionClass: string;
  emissionsSticker: string;
  seatsCount: string;
  doorCount: string;
  climatisation: string;
  parkingSensors: string;
  airbags: string;
  manufacturerColour: string;
  colour: string;
  interiorDesign: string;
  weight: string;
  cylinders: string;
  tankCapacity: string;
  trailerLoadBraked: string;
  trailerLoadUnbraked: string;
  features: string[];
  images: UploaderImage[];
};

export const emptyVehicleForm: VehicleFormData = {
  reference: "",
  make: "",
  modelRange: "",
  trimLine: "",
  priceDh: "",
  mileageKm: "",
  firstRegistration: "",
  status: "Disponible",
  featured: false,
  description: "",
  vehicleCondition: "Used vehicle, Accident-free",
  category: "SUV/Off-road Vehicle/Pickup Truck",
  origin: "",
  ownersCount: "",
  cubicCapacity: "",
  power: "",
  driveType: "Internal combustion engine",
  fuel: "Petrol",
  energyConsumption: "",
  co2Emissions: "",
  transmission: "Automatic",
  emissionClass: "",
  emissionsSticker: "",
  seatsCount: "5",
  doorCount: "4/5",
  climatisation: "",
  parkingSensors: "",
  airbags: "",
  manufacturerColour: "",
  colour: "",
  interiorDesign: "",
  weight: "",
  cylinders: "",
  tankCapacity: "",
  trailerLoadBraked: "",
  trailerLoadUnbraked: "",
  features: [],
  images: [],
};

const inputCls =
  "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sima-gold transition text-sm";
const labelCls = "block text-zinc-300 font-semibold mb-1.5 text-sm";

export default function VehicleForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial: VehicleFormData;
}) {
  const router = useRouter();
  const [form, setForm] = useState<VehicleFormData>(initial);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof VehicleFormData>(key: K, value: VehicleFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.images.length < 15) {
      setError(`Ajoutez au moins 15 photos (${form.images.length} actuellement).`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);
    const payload = {
      reference: form.reference || `SA-${Date.now()}`,
      make: form.make,
      modelRange: form.modelRange,
      trimLine: form.trimLine,
      priceDh: form.priceDh,
      mileageKm: form.mileageKm,
      firstRegistration: form.firstRegistration,
      status: form.status,
      featured: form.featured,
      description: form.description,
      images: form.images,
      features: form.features,
      technicalData: {
        vehicleCondition: form.vehicleCondition,
        category: form.category,
        origin: form.origin,
        ownersCount: form.ownersCount ? Number(form.ownersCount) : null,
        cubicCapacity: form.cubicCapacity,
        power: form.power,
        driveType: form.driveType,
        fuel: form.fuel,
        energyConsumption: form.energyConsumption,
        co2Emissions: form.co2Emissions,
        transmission: form.transmission,
        emissionClass: form.emissionClass,
        emissionsSticker: form.emissionsSticker,
        seatsCount: form.seatsCount ? Number(form.seatsCount) : null,
        doorCount: form.doorCount,
        climatisation: form.climatisation,
        parkingSensors: form.parkingSensors,
        airbags: form.airbags,
        manufacturerColour: form.manufacturerColour,
        colour: form.colour,
        interiorDesign: form.interiorDesign,
        weight: form.weight,
        cylinders: form.cylinders ? Number(form.cylinders) : null,
        tankCapacity: form.tankCapacity,
        trailerLoadBraked: form.trailerLoadBraked,
        trailerLoadUnbraked: form.trailerLoadUnbraked,
      },
    };

    try {
      const url = mode === "create" ? "/api/admin/vehicles" : `/api/admin/vehicles/${form.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'enregistrement");
      router.push("/admin");
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Erreur lors de l'enregistrement");
      setSaving(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <form onSubmit={submit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-10 shadow-2xl">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Basics */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">Informations Générales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className={labelCls}>Marque *</label>
            <input required value={form.make} onChange={(e) => set("make", e.target.value)} placeholder="ex: Audi" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Gamme / Modèle *</label>
            <input required value={form.modelRange} onChange={(e) => set("modelRange", e.target.value)} placeholder="ex: Q3 (F3B)(11.2018->)" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Finition / Trim Line</label>
            <input value={form.trimLine} onChange={(e) => set("trimLine", e.target.value)} placeholder="ex: 40 TFSI quattro S line Sport" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Prix (DH) *</label>
            <input required type="number" value={form.priceDh} onChange={(e) => set("priceDh", e.target.value)} placeholder="380000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Kilométrage (km) *</label>
            <input required type="number" value={form.mileageKm} onChange={(e) => set("mileageKm", e.target.value)} placeholder="99000" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Première Immatriculation *</label>
            <input required value={form.firstRegistration} onChange={(e) => set("firstRegistration", e.target.value)} placeholder="01/2020" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Référence</label>
            <input value={form.reference} onChange={(e) => set("reference", e.target.value)} placeholder="Générée automatiquement si vide" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Statut</label>
            <select value={form.status} onChange={(e) => set("status", e.target.value as any)} className={inputCls}>
              <option value="Disponible">Disponible</option>
              <option value="Reserve">Réservé</option>
              <option value="Vendu">Vendu</option>
            </select>
          </div>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2.5 cursor-pointer text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-sima-gold focus:ring-0 accent-sima-gold"
              />
              Mettre en vitrine (page d'accueil)
            </label>
          </div>
        </div>
        <div className="mt-5">
          <label className={labelCls}>Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className={inputCls}
            placeholder="État général, historique, points forts..."
          />
        </div>
      </section>

      {/* Technical */}
      <section>
        <h2 className="text-lg font-bold text-white mb-4">Fiche Technique</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className={labelCls}>État du Véhicule</label>
            <select value={form.vehicleCondition} onChange={(e) => set("vehicleCondition", e.target.value)} className={inputCls}>
              <option>Used vehicle, Accident-free</option>
              <option>Used vehicle, Accident recorded</option>
              <option>New vehicle</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Catégorie</label>
            <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
              {BODY_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Origine</label>
            <input value={form.origin} onChange={(e) => set("origin", e.target.value)} placeholder="ex: German edition" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Nombre de propriétaires</label>
            <input type="number" value={form.ownersCount} onChange={(e) => set("ownersCount", e.target.value)} placeholder="2" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Cylindrée</label>
            <input value={form.cubicCapacity} onChange={(e) => set("cubicCapacity", e.target.value)} placeholder="1,984 ccm" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Puissance</label>
            <input value={form.power} onChange={(e) => set("power", e.target.value)} placeholder="140 kW (190 hp)" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Type d'Entraînement</label>
            <input value={form.driveType} onChange={(e) => set("driveType", e.target.value)} placeholder="Internal combustion engine" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Carburant</label>
            <select value={form.fuel} onChange={(e) => set("fuel", e.target.value)} className={inputCls}>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Hybrid</option>
              <option>Electric</option>
              <option>LPG</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Consommation Mixte</label>
            <input value={form.energyConsumption} onChange={(e) => set("energyConsumption", e.target.value)} placeholder="7.5 l/100km" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Émissions CO₂</label>
            <input value={form.co2Emissions} onChange={(e) => set("co2Emissions", e.target.value)} placeholder="171 g/km" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Boîte de Vitesses</label>
            <select value={form.transmission} onChange={(e) => set("transmission", e.target.value)} className={inputCls}>
              <option>Automatic</option>
              <option>Manual</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Classe d'Émission</label>
            <input value={form.emissionClass} onChange={(e) => set("emissionClass", e.target.value)} placeholder="Euro6d-TEMP" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Nombre de Places</label>
            <input type="number" value={form.seatsCount} onChange={(e) => set("seatsCount", e.target.value)} placeholder="5" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Nombre de Portes</label>
            <input value={form.doorCount} onChange={(e) => set("doorCount", e.target.value)} placeholder="4/5" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Climatisation</label>
            <input value={form.climatisation} onChange={(e) => set("climatisation", e.target.value)} placeholder="Automatic climatisation, 3 zones" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Aide au Stationnement</label>
            <input value={form.parkingSensors} onChange={(e) => set("parkingSensors", e.target.value)} placeholder="Rear, Front, Camera" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Airbags</label>
            <input value={form.airbags} onChange={(e) => set("airbags", e.target.value)} placeholder="Front and Side and More Airbags" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Couleur Constructeur</label>
            <input value={form.manufacturerColour} onChange={(e) => set("manufacturerColour", e.target.value)} placeholder="Turboblau" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Couleur Générale</label>
            <input value={form.colour} onChange={(e) => set("colour", e.target.value)} placeholder="Blue Metallic" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Finition Intérieure</label>
            <input value={form.interiorDesign} onChange={(e) => set("interiorDesign", e.target.value)} placeholder="Part leather, Black" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Poids à vide</label>
            <input value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="1,695 kg" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Cylindres</label>
            <input type="number" value={form.cylinders} onChange={(e) => set("cylinders", e.target.value)} placeholder="4" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Réservoir</label>
            <input value={form.tankCapacity} onChange={(e) => set("tankCapacity", e.target.value)} placeholder="60 l" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Charge remorquée freinée</label>
            <input value={form.trailerLoadBraked} onChange={(e) => set("trailerLoadBraked", e.target.value)} placeholder="2,100 kg" className={inputCls} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <FeatureChecklist selected={form.features} onChange={(v) => set("features", v)} />
      </section>

      {/* Photos */}
      <section>
        <h2 className="text-lg font-bold text-white mb-2">Photos du Véhicule</h2>
        <p className="text-xs text-zinc-400 mb-4">
          Téléversez entre 15 et 20 photos, puis cliquez sur l'étoile pour choisir la photo
          principale (celle affichée dans la liste et les résultats de recherche).
        </p>
        <ImageUploader images={form.images} onChange={(v) => set("images", v)} />
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto bg-sima-gold hover:bg-sima-goldHover text-zinc-950 font-extrabold px-6 py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Enregistrement..." : mode === "create" ? "Publier le Véhicule" : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}
