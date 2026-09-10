export function formatDH(value: number | string) {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " DH";
}

export function formatKm(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " km";
}

export function slugifyRef(make: string, modelRange: string) {
  const base = `${make}-${modelRange}`.toLowerCase();
  return base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
