import VehicleForm, { emptyVehicleForm } from "@/components/admin/VehicleForm";

export default function AddVehiclePage() {
  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-6">
        Ajouter un Nouveau Véhicule
      </h1>
      <VehicleForm mode="create" initial={emptyVehicleForm} />
    </div>
  );
}
