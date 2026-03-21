import React, { useEffect, useMemo } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon, PencilSquareIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

// Azerbaijani labels for common field keys
const FIELD_LABELS = {
  name: "Ad",
  status: "Status",
  "meta.address": "Ünvan",
  "meta.desc": "Təsvir",
  "meta.phone": "Telefon",
  "meta.email": "E-mail",
  "meta.website": "Vebsayt",
  "meta.lat": "Enlik (Lat)",
  "meta.lng": "Uzunluq (Lng)",
  "meta.color_code": "Rəng kodu",
  "meta.logo": "Logo",
  "meta.images": "Şəkillər",
  "meta.total_floor": "Mərtəbə sayı",
  "meta.total_apartment": "Mənzil sayı",
  "meta.area": "Sahə (m²)",
  "meta.floor": "Mərtəbə",
  "meta.apartment_number": "Mənzil nömrəsi",
  mtk_id: "MTK",
  complex_id: "Complex",
  building_id: "Bina",
  block_id: "Blok",
  property_id: "Mənzil",
  email: "E-mail",
  phone: "Telefon",
  surname: "Soyadı",
  gender: "Cins",
  type: "Tip",
  password: "Şifrə",
};

const STATUS_LABELS = {
  active: "Aktiv",
  inactive: "Qeyri-aktiv",
  male: "Kişi",
  female: "Qadın",
  owner: "Sahib",
  tenant: "Kirayəçi",
};

function formatLabel(key) {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  return key
    .replace(/^meta\./, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(key, value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" && value.startsWith("data:image")) return "🖼 Şəkil";
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    if (typeof value[0] === "string" && value[0].startsWith("data:image"))
      return `🖼 ${value.length} şəkil`;
    return `[${value.length} element]`;
  }
  if (STATUS_LABELS[value]) return STATUS_LABELS[value];
  return String(value);
}

const SKIP_KEYS = ["sub_data", "buildings", "blocks", "modules", "property_residents", "bind_mtk", "bind_complex", "bind_building", "bind_block"];

function flattenObject(obj, prefix = "") {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return prefix ? { [prefix]: obj } : {};
  return Object.keys(obj).reduce((acc, key) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === "object" && !Array.isArray(val) && !SKIP_KEYS.includes(key)) {
      Object.assign(acc, flattenObject(val, fullKey));
    } else {
      acc[fullKey] = val;
    }
    return acc;
  }, {});
}

function getDiff(oldData, newData) {
  if (!oldData || !newData) return [];
  const flatOld = flattenObject(oldData);
  const flatNew = flattenObject(newData);
  const changes = [];
  for (const key of Object.keys(flatNew)) {
    if (["id", "created_at", "updated_at", "deleted_at"].includes(key)) continue;
    const oldStr = formatValue(key, flatOld[key]);
    const newStr = formatValue(key, flatNew[key]);
    if (oldStr !== newStr) {
      changes.push({ key, label: formatLabel(key), oldVal: oldStr, newVal: newStr });
    }
  }
  return changes;
}

export function EditConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Redaktəni Təsdiqlə",
  message = "Bu elementdə dəyişiklikləri saxlamaq istədiyinizə əminsiniz?",
  itemName = "",
  entityName = "element",
  loading = false,
  oldData = null,
  newData = null,
}) {
  const changes = useMemo(() => getDiff(oldData, newData), [oldData, newData]);

  if (!open) return null;

  const displayMessage = itemName
    ? `${itemName} adlı ${entityName} üzərindəki dəyişiklikləri saxlamaq istədiyinizə əminsiniz?`
    : message;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="md"
      className="dark:bg-gray-800 border border-blue-200 dark:border-blue-900/30"
      dismiss={{ enabled: false }}
      style={{ zIndex: 999999 }}
    >
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PencilSquareIcon className="h-5 w-5 text-blue-500" />
          <Typography variant="h5" className="font-bold text-blue-600 dark:text-blue-400">
            {title}
          </Typography>
        </div>
        <div
          className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>

      <DialogBody divider className="dark:bg-gray-800 py-4 max-h-[60vh] overflow-y-auto">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <PencilSquareIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <Typography variant="h6" className="font-semibold text-gray-900 dark:text-gray-100">
              Dəyişiklikləri Saxla
            </Typography>
            <Typography variant="small" className="text-gray-600 dark:text-gray-400">
              {displayMessage}
            </Typography>
          </div>
        </div>

        {changes.length > 0 ? (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-[120px_1fr_20px_1fr] gap-2 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 px-3 py-2">
              <Typography variant="small" className="font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">
                Sahə
              </Typography>
              <Typography variant="small" className="font-bold text-red-500 dark:text-red-400 uppercase tracking-wider text-xs">
                Əvvəl
              </Typography>
              <span />
              <Typography variant="small" className="font-bold text-green-600 dark:text-green-400 uppercase tracking-wider text-xs">
                İndi
              </Typography>
            </div>

            {/* Diff rows */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {changes.map(({ key, label, oldVal, newVal }) => (
                <div
                  key={key}
                  className="grid grid-cols-[120px_1fr_20px_1fr] items-center gap-2 px-3 py-2 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                >
                  <Typography
                    variant="small"
                    className="font-semibold text-gray-600 dark:text-gray-400 text-xs truncate"
                    title={label}
                  >
                    {label}
                  </Typography>

                  <div className="min-w-0 overflow-hidden">
                    <span
                      className="block truncate px-2 py-0.5 rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-mono border border-red-200 dark:border-red-800/40"
                      title={oldVal}
                    >
                      {oldVal}
                    </span>
                  </div>

                  <ArrowRightIcon className="h-3 w-3 text-gray-400 flex-shrink-0 mx-auto" />

                  <div className="min-w-0 overflow-hidden">
                    <span
                      className="block truncate px-2 py-0.5 rounded bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-mono border border-green-200 dark:border-green-800/40"
                      title={newVal}
                    >
                      {newVal}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm italic">
            {oldData && newData ? "Heç bir dəyişiklik aşkarlanmadı." : "Dəyişiklik məlumatı mövcud deyil."}
          </div>
        )}

        <Typography variant="small" className="text-gray-400 dark:text-gray-500 mt-3 block">
          Bu əməliyyat mövcud məlumatları yeniləyəcək.
        </Typography>
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <Button
          variant="text"
          color="gray"
          onClick={onClose}
          className="mr-2"
          disabled={loading}
        >
          Ləğv et
        </Button>
        <Button
          variant="filled"
          color="blue"
          onClick={onConfirm}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saxlanılır...
            </>
          ) : (
            <>
              <PencilSquareIcon className="h-4 w-4" />
              Bəli, Saxla
            </>
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
