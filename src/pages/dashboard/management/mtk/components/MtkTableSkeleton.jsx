import React from "react";

export function MtkTableSkeleton({ rows = 10, animate = true }) {
  const skeletonClass = animate 
    ? "bg-gray-200 dark:bg-gray-700" 
    : "bg-gray-100 dark:bg-gray-800";
  
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx} className={`border-b border-blue-gray-50 dark:border-gray-700 ${animate ? 'animate-pulse' : ''}`}>
          <td className="p-4">
            <div className={`h-4 ${skeletonClass} rounded w-32 mb-2`}></div>
            <div className={`h-3 ${skeletonClass} rounded w-20`}></div>
          </td>
          <td className="p-4">
            <div className={`h-4 ${skeletonClass} rounded w-40`}></div>
          </td>
          <td className="p-4">
            <div className={`h-6 ${skeletonClass} rounded w-16`}></div>
          </td>
          <td className="p-4">
            <div className={`h-4 ${skeletonClass} rounded w-36`}></div>
          </td>
          <td className="p-4">
            <div className={`h-4 ${skeletonClass} rounded w-28`}></div>
          </td>
          <td className="p-4">
            <div className={`h-4 ${skeletonClass} rounded w-12`}></div>
          </td>
          <td className="p-4">
            <div className="flex items-center gap-2">
              <div className={`h-4 w-4 ${skeletonClass} rounded-full`}></div>
              <div className={`h-4 ${skeletonClass} rounded w-20`}></div>
            </div>
          </td>
          <td className="p-4">
            <div className={`h-4 ${skeletonClass} rounded w-32`}></div>
          </td>
          <td className="p-4">
            <div className="flex justify-end">
              <div className={`h-8 w-8 ${skeletonClass} rounded-full`}></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

