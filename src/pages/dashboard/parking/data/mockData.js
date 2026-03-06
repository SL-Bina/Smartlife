// ─── Status list ──────────────────────────────────────────────────────────────
export const STATUSES = ["available", "occupied", "reserved", "disabled"];

// ─── Mock residents ───────────────────────────────────────────────────────────
export const RESIDENTS = [
  "Əli Məmmədov",
  "Leyla Hüseynova",
  "Rauf Əliyev",
  "Günel Kazımova",
  "Elnur Babayev",
];

// ─── Spot generator ───────────────────────────────────────────────────────────
const RNG_WEIGHTS = [0.45, 0.35, 0.12, 0.08]; // available, occupied, reserved, disabled

function weightedStatus() {
  const r = Math.random();
  let sum = 0;
  for (let i = 0; i < STATUSES.length; i++) {
    sum += RNG_WEIGHTS[i];
    if (r < sum) return STATUSES[i];
  }
  return STATUSES[0];
}

export function genSpots(floor, cols) {
  const rows = ["A", "B", "C", "D"];
  const spots = [];
  rows.forEach((row) => {
    for (let c = 1; c <= cols; c++) {
      const id = `${floor}-${row}${c}`;
      const status = weightedStatus();
      spots.push({
        id,
        label: `${row}${c}`,
        row,
        floor,
        status,
        resident: status === "occupied" ? RESIDENTS[Math.floor(Math.random() * RESIDENTS.length)] : null,
        property: status === "occupied" ? `Mənzil ${Math.floor(Math.random() * 200) + 1}` : null,
        plate: status === "occupied" ? `${String.fromCharCode(65 + Math.floor(Math.random() * 4))}B-${Math.floor(Math.random() * 900) + 100}` : null,
      });
    }
  });
  return spots;
}

// ─── Floors ───────────────────────────────────────────────────────────────────
export const FLOORS = [
  { id: "B2", label: "B-2 Mərtəbə", spots: genSpots("B2", 8) },
  { id: "B1", label: "B-1 Mərtəbə", spots: genSpots("B1", 10) },
  { id: "G",  label: "Zemin Mərtəbə", spots: genSpots("G", 12) },
  { id: "1",  label: "1-ci Mərtəbə", spots: genSpots("1", 10) },
];

// ─── Status metadata ──────────────────────────────────────────────────────────
export const STATUS_META = {
  available: { label: "Boş",       dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-700 dark:text-emerald-400" },
  occupied:  { label: "Tutulmuş", dot: "bg-red-500",      bg: "bg-red-50 dark:bg-red-900/20",         border: "border-red-200 dark:border-red-800",         text: "text-red-700 dark:text-red-400" },
  reserved:  { label: "Rezerv",   dot: "bg-amber-500",    bg: "bg-amber-50 dark:bg-amber-900/20",     border: "border-amber-200 dark:border-amber-800",     text: "text-amber-700 dark:text-amber-400" },
  disabled:  { label: "Qapalı",   dot: "bg-gray-400",     bg: "bg-gray-50 dark:bg-gray-800",          border: "border-gray-200 dark:border-gray-700",       text: "text-gray-500 dark:text-gray-400" },
};
