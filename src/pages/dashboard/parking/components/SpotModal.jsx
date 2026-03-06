import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { STATUS_META } from "../data/mockData";

/**
 * Row — label + value helper for the modal detail list.
 */
function Row({ label, children, value }) {
  return (
    <div className="flex items-start gap-2 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-xs text-gray-500 dark:text-gray-400 w-24 shrink-0 pt-0.5">{label}</span>
      <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex-1">{children ?? value ?? "—"}</span>
    </div>
  );
}

/**
 * SpotModal — portal-rendered detail panel for a parking spot.
 * Renders directly into document.body to escape layout stacking contexts.
 * @param {{ spot: object, onClose: function }} props
 */
export function SpotModal({ spot, onClose }) {
  const meta = STATUS_META[spot.status];

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Escape key to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center sm:justify-center">
      {/* Backdrop — no backdrop-filter here to avoid stacking context issues */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Panel — sits above backdrop via stacking order within wrapper */}
      <div className="relative w-full sm:max-w-sm">
        <div className="bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className={`px-5 py-4 flex items-center justify-between ${meta.bg} border-b ${meta.border}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${meta.bg} ${meta.border} ${meta.text} border-2`}>
                {spot.label}
              </div>
              <div>
                <Typography variant="h6" className={`font-black text-sm ${meta.text}`}>
                  Parkinq yeri {spot.label}
                </Typography>
                <span className={`text-xs font-semibold ${meta.text}`}>{meta.label}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Detail rows */}
          <div className="px-5 py-2">
            <Row label="Mərtəbə">{spot.floor}</Row>
            <Row label="Zona / Sıra">{spot.row}</Row>
            <Row label="Status">
              <span className={`inline-flex items-center gap-1.5 ${meta.text}`}>
                <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
            </Row>
            <Row label="Sakin">{spot.resident}</Row>
            <Row label="Mənzil">{spot.property}</Row>
            <Row label="Nişan lövhəsi">{spot.plate}</Row>
          </div>

          {/* Footer */}
          <div className="px-5 pb-5 pt-3 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-semibold"
            >
              Bağla
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default SpotModal;
