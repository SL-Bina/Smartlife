import React from "react";

export function UsersTableSkeleton({ rows = 10, animate = true }) {
  const skeletonClass = animate 
    ? "bg-gray-200 dark:bg-gray-700" 
    : "bg-gray-100 dark:bg-gray-800";
  
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx} className={`border-b border-blue-gray-50 dark:border-gray-700 ${animate ? 'animate-pulse' : ''}`}>
          <td className="p-4">
            <div className={`h-4 ${skeletonClass} rounded w-16`}></div>
          </td>
          <td className="p-4">
            <div className={`h-4 ${skeletonClass} rounded w-32`}></div>
          </td>
          <td className="p-4">
            <div className={`h-4 ${skeletonClass} rounded w-24`}></div>
          </td>
          <td className="p-4">
            <div className={`h-4 ${skeletonClass} rounded w-40`}></div>
          </td>
          <td className="p-4">
            <div className={`h-4 ${skeletonClass} rounded w-28`}></div>
          </td>
          <td className="p-4">
            <div className={`h-4 ${skeletonClass} rounded w-20`}></div>
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

