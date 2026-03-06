import React from "react";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { FLOORS } from "../data/mockData";

/**
 * FloorTabs — horizontal scrollable tabs for selecting a parking floor.
 * @param {{ activeFloor: string, onChange: function }} props
 */
export function FloorTabs({ activeFloor, onChange }) {
  const { getRgba } = useMtkColor();

  return (
    <div
      className="flex overflow-x-auto border-b border-gray-100 dark:border-gray-700"
      style={{ scrollbarWidth: "none" }}
    >
      {FLOORS.map((f) => {
        const isActive = f.id === activeFloor;
        const available = f.spots.filter((s) => s.status === "available").length;
        const occupied  = f.spots.filter((s) => s.status === "occupied").length;

        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-5 py-3 text-sm font-semibold transition-all border-b-2 ${
              isActive
                ? "border-current"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
            style={isActive ? { color: getRgba(1), borderColor: getRgba(1) } : {}}
          >
            <span className="whitespace-nowrap">{f.label}</span>
            <span className="text-[10px] font-normal opacity-70">
              {available} boş / {occupied} tutulmuş
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default FloorTabs;
