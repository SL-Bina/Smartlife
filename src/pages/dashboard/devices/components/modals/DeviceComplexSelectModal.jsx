import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import {
  BuildingOffice2Icon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const DEFAULT_COMPLEX_COLOR = "#3b82f6";

const getRgbaColor = (hexColor, alpha = 1) => {
  if (!hexColor || typeof hexColor !== "string") return `rgba(59, 130, 246, ${alpha})`;

  const hex = hexColor.replace("#", "");
  const fullHex = hex.length === 3 ? hex.split("").map((char) => char + char).join("") : hex;

  if (fullHex.length !== 6) return `rgba(59, 130, 246, ${alpha})`;

  const r = Number.parseInt(fullHex.slice(0, 2), 16);
  const g = Number.parseInt(fullHex.slice(2, 4), 16);
  const b = Number.parseInt(fullHex.slice(4, 6), 16);

  if ([r, g, b].some(Number.isNaN)) return `rgba(59, 130, 246, ${alpha})`;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const resolveComplexColor = (complex) =>
  complex?.meta?.color_code || complex?.color_code || complex?.color || DEFAULT_COMPLEX_COLOR;

export function DeviceComplexSelectModal({
  open,
  onClose,
  complexes = [],
  selectedComplexId = null,
  onConfirm,
  loading = false,
  required = false,
}) {
  const { t } = useTranslation();
  const [value, setValue] = useState(selectedComplexId ? String(selectedComplexId) : "");

  useEffect(() => {
    if (open) {
      setValue(selectedComplexId ? String(selectedComplexId) : "");
    }
  }, [open, selectedComplexId]);

  const selectedName = useMemo(() => {
    const selected = complexes.find((item) => String(item.id) === value);
    return selected?.name || selected?.title || "";
  }, [complexes, value]);

  const handleConfirm = () => {
    if (!value) return;
    onConfirm?.(Number(value));
  };

  return (
    <Dialog
      open={open}
      handler={required ? undefined : onClose}
      size="sm"
      className="dark:bg-gray-900 z-[130]"
      dismiss={{ enabled: !required }}
    >
      <DialogHeader className="p-0">
        <div className="w-full rounded-t-xl bg-gradient-to-r from-blue-600 to-blue-700 p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <BuildingOffice2Icon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h6" className="text-white font-bold">
            {t("devices.complexSelection.title") || "Kompleks secimi"}
          </Typography>
          {!required && (
            <button onClick={onClose} className="ml-auto text-white/70 hover:text-white transition-colors">
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </DialogHeader>

      <DialogBody className="space-y-4 dark:bg-gray-900">
        <Typography variant="small" className="text-gray-600 dark:text-gray-300">
          {required
            ? t("devices.complexSelection.requiredDescription") ||
              "Cihazlar sehifesini acmaq ucun once kompleks secin."
            : t("devices.complexSelection.changeDescription") ||
              "Aktiv kompleks secimini deyisin."}
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {complexes.map((complex) => {
            const complexId = String(complex.id);
            const complexName = complex.name || complex.title || `Complex ${complex.id}`;
            const isSelected = value === complexId;
            const color = resolveComplexColor(complex);

            return (
              <button
                key={complex.id}
                type="button"
                onClick={() => setValue(complexId)}
                className={`relative w-full max-w-[190px] mx-auto text-center rounded-2xl border p-0 overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 aspect-[3/4] ${
                  isSelected
                    ? "ring-2 ring-offset-1 dark:ring-offset-gray-900"
                    : "hover:shadow-md hover:-translate-y-0.5"
                }`}
                style={{
                  borderColor: isSelected ? color : getRgbaColor(color, 0.25),
                  backgroundColor: isSelected ? getRgbaColor(color, 0.12) : getRgbaColor(color, 0.05),
                  boxShadow: isSelected ? `0 0 0 2px ${getRgbaColor(color, 0.22)}` : "none",
                }}
              >
                <div
                  className="h-1.5 w-full"
                  style={{ background: `linear-gradient(90deg, ${color} 0%, ${getRgbaColor(color, 0.65)} 100%)` }}
                />

                <div className="p-3.5 h-[calc(100%-6px)]">
                  <div className="flex h-full flex-col items-center justify-center gap-3">
                    <div
                      className="h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: getRgbaColor(color, 0.16), color }}
                    >
                      <BuildingOffice2Icon className="h-7 w-7" />
                    </div>

                    <Typography
                      variant="small"
                      className="font-semibold text-gray-900 dark:text-white text-sm leading-5 text-center line-clamp-3"
                    >
                      {complexName}
                    </Typography>
                  </div>
                </div>

                {isSelected ? (
                  <span
                    className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ backgroundColor: getRgbaColor(color, 0.2), color }}
                  >
                    <CheckCircleIcon className="h-3.5 w-3.5" />
                    Aktiv
                  </span>
                ) : null}

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: isSelected
                      ? `radial-gradient(circle at top right, ${getRgbaColor(color, 0.12)} 0%, transparent 48%)`
                      : "none",
                  }}
                />
              </button>
            );
          })}
        </div>

        {selectedName ? (
          <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
            {t("devices.complexSelection.activeComplex") || "Secilen kompleks"}: <b>{selectedName}</b>
          </Typography>
        ) : null}
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2 px-4 py-3 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        {!required && (
          <Button variant="text" color="blue-gray" onClick={onClose} className="dark:text-gray-300">
            {t("devices.actions.cancel") || "Legv et"}
          </Button>
        )}
        <Button color="blue" onClick={handleConfirm} disabled={!value || loading}>
          {loading
            ? t("devices.actions.loading") || "Yuklenir..."
            : t("devices.complexSelection.confirm") || "Kompleksi ac"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
