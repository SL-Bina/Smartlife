import React from "react";
import {
  Square3Stack3DIcon,
  CheckCircleIcon,
  TruckIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import { useMtkColor } from "@/store/hooks/useMtkColor";

const STAT_CONFIGS = [
  { key: "total",     label: "Ümumi yerlər",  Icon: Square3Stack3DIcon },
  { key: "available", label: "Boş",            Icon: CheckCircleIcon    },
  { key: "occupied",  label: "Tutulmuş",       Icon: TruckIcon          },
  { key: "reserved",  label: "Rezerv",         Icon: ClockIcon          },
];

/**
 * StatsBar — four MTK-themed stat cards for parking overview.
 * @param {{ stats: { total: number, available: number, occupied: number, reserved: number } }} props
 */
export function StatsBar({ stats }) {
  const { getRgba, getActiveGradient } = useMtkColor();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STAT_CONFIGS.map(({ key, label, Icon }, i) => {
        const value = stats[key] ?? 0;
        const pct = stats.total ? Math.round((value / stats.total) * 100) : 0;
        const isFirst = i === 0;

        return (
          <div
            key={key}
            className="rounded-2xl p-4 shadow-sm border flex flex-col gap-3"
            style={
              isFirst
                ? { background: getActiveGradient(0.92, 0.75), borderColor: getRgba(0.3) }
                : { background: "#fff", borderColor: getRgba(0.15) }
            }
          >
            {/* Icon + value */}
            <div className="flex items-center justify-between">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: isFirst ? "rgba(255,255,255,0.2)" : getRgba(0.1) }}
              >
                <Icon
                  className="h-5 w-5"
                  style={{ color: isFirst ? "#fff" : getRgba(1) }}
                />
              </div>
              <span
                className="text-3xl font-black leading-none"
                style={{ color: isFirst ? "#fff" : getRgba(1) }}
              >
                {value}
              </span>
            </div>

            {/* Label */}
            <p
              className="text-xs font-semibold"
              style={{ color: isFirst ? "rgba(255,255,255,0.85)" : getRgba(0.7) }}
            >
              {label}
            </p>

            {/* Progress bar */}
            <div
              className="rounded-full h-1"
              style={{ backgroundColor: isFirst ? "rgba(255,255,255,0.25)" : getRgba(0.12) }}
            >
              <div
                className="rounded-full h-1 transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  backgroundColor: isFirst ? "#fff" : getRgba(0.7),
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsBar;
