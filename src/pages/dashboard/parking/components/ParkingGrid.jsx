import React from "react";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { STATUS_META } from "../data/mockData";
import { SpotCard } from "./SpotCard";

/**
 * ParkingGrid — renders spot rows for a single floor.
 * All spots are always rendered; non-matching spots are dimmed.
 *
 * @param {{
 *   rows: [string, object[]][],
 *   isSpotActive: function,
 *   onSpotClick: function
 * }} props
 */
export function ParkingGrid({ rows, isSpotActive, onSpotClick }) {
  const { getActiveGradient } = useMtkColor();

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <BuildingOfficeIcon className="h-12 w-12 text-gray-300 dark:text-gray-600" />
        <p className="text-sm text-gray-400 dark:text-gray-500">Uyğun parkinq yeri tapılmadı</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-5">
        {Object.entries(STATUS_META).map(([key, m]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-sm border ${m.border} ${m.bg}`} />
            <span className="text-xs text-gray-500 dark:text-gray-400">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Row zones */}
      <div className="space-y-6">
        {rows.map(([rowLabel, spots]) => (
          <div key={rowLabel}>
            {/* Row header */}
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                style={{ background: getActiveGradient(0.85, 0.65) }}
              >
                {rowLabel}
              </div>
              <div className="flex-1 h-px bg-gray-100 dark:bg-gray-700" />
              <span className="text-xs text-gray-400">
                {spots.filter((s) => s.status === "available").length} boş / {spots.length}
              </span>
            </div>

            {/* Spots grid with kerb decoration */}
            <div className="flex items-stretch gap-2">
              <div className="w-3 flex-shrink-0 rounded-l-lg bg-gray-200 dark:bg-gray-700" />

              <div
                className="flex-1 grid gap-2"
                style={{ gridTemplateColumns: `repeat(${Math.min(spots.length, 10)}, minmax(0, 1fr))` }}
              >
                {spots.map((spot) => (
                  <SpotCard
                    key={spot.id}
                    spot={spot}
                    onClick={onSpotClick}
                    dimmed={!isSpotActive(spot)}
                  />
                ))}
              </div>

              <div className="w-3 flex-shrink-0 rounded-r-lg bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Driveway indicator */}
            <div className="mt-1.5 mx-3 h-5 rounded-b-lg bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <span className="text-[9px] text-gray-400 dark:text-gray-600 tracking-widest font-semibold uppercase">
                Keçid yolu
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParkingGrid;
