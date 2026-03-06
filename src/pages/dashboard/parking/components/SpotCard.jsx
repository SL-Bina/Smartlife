import React from "react";
import { STATUS_META } from "../data/mockData";

/**
 * SpotCard — single parking spot tile.
 * @param {{ spot: object, onClick: function, dimmed: boolean }} props
 */
export function SpotCard({ spot, onClick, dimmed }) {
  const meta = STATUS_META[spot.status];

  return (
    <button
      onClick={() => onClick(spot)}
      title={`${spot.label} — ${meta.label}`}
      className={`relative flex flex-col items-center justify-center rounded-md border transition-all duration-200 aspect-[2/3] min-w-0 text-[10px] font-semibold select-none
        ${meta.bg} ${meta.border} ${meta.text}
        hover:brightness-95 active:scale-95
        ${dimmed ? "opacity-20 saturate-0 pointer-events-none" : ""}
      `}
    >
      {/* Spot label */}
      <span className="font-black text-[10px] leading-none">{spot.label}</span>

      {/* Status icon */}
      {spot.status === "occupied" && (
        <svg className="h-3 w-3 mt-0.5 opacity-80" viewBox="0 0 20 20" fill="currentColor">
          <path d="M15.5 7.5A5.5 5.5 0 0110 13H6v3H4V4h6a5.5 5.5 0 015.5 3.5zM6 11h4a3.5 3.5 0 000-7H6v7z" />
          <path fillRule="evenodd" d="M2 17l2-1.5V4L2 2.5V17z" clipRule="evenodd" />
        </svg>
      )}
      {spot.status === "reserved" && (
        <svg className="h-3 w-3 mt-0.5 opacity-80" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )}
      {spot.status === "disabled" && (
        <svg className="h-3 w-3 mt-0.5 opacity-80" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524L13.477 14.89zm1.414-1.414L6.524 5.11A6 6 0 0114.89 13.476zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
        </svg>
      )}

      {/* Lane indicator stripe at bottom */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-lg opacity-40 ${meta.dot}`} />
    </button>
  );
}

export default SpotCard;
