import React from "react";

export function Skeleton({ tableRows = 6, cardRows = 4 }) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="hidden lg:block overflow-x-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
        <div className="w-full min-w-[1200px]">
          <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
          {[...Array(tableRows)].map((_, idx) => (
            <div
              key={`table-skeleton-${idx}`}
              className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-10" />
            </div>
          ))}
        </div>
      </div>

      <div className="lg:hidden space-y-3">
        {[...Array(cardRows)].map((_, idx) => (
          <div
            key={`card-skeleton-${idx}`}
            className="bg-white/80 dark:bg-gray-800/80 rounded-xl border border-white/20 dark:border-gray-700/50 p-4"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
