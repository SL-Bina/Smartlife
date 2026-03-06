import React from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { STATUSES, STATUS_META } from "../data/mockData";

const ALL_OPTION = { v: "all", label: "Hamısı" };

/**
 * FilterBar — search input + status chip filters for parking grid.
 * @param {{ search: string, onSearch: function, statusFilter: string, onStatus: function }} props
 */
export function FilterBar({ search, onSearch, statusFilter, onStatus }) {
  const { getRgba, getActiveGradient } = useMtkColor();

  const chips = [
    ALL_OPTION,
    ...STATUSES.map((s) => ({ v: s, label: STATUS_META[s].label })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Yer, sakin, nişan..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ "--tw-ring-color": getRgba(0.5) }}
        />
      </div>

      {/* Status chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <FunnelIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
        {chips.map(({ v, label }) => {
          const isActive = statusFilter === v;
          const meta = v !== "all" ? STATUS_META[v] : null;
          return (
            <button
              key={v}
              onClick={() => onStatus(v)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                isActive
                  ? "text-white border-transparent shadow-sm"
                  : "bg-transparent border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"
              }`}
              style={
                isActive
                  ? {
                      background:
                        v === "all"
                          ? getActiveGradient(0.88, 0.68)
                          : undefined,
                      backgroundColor:
                        v !== "all" && meta
                          ? meta.dot.replace("bg-", "").replace(/-\d+$/, (m) => m)
                          : undefined,
                    }
                  : {}
              }
            >
              {meta && (
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white" : meta.dot}`} />
              )}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterBar;
