import React from "react";
import { Typography } from "@material-tailwind/react";

export function Table({
  rows = [],
  columns = [],
  loading = false,
  loadingText = "Yüklənir...",
  emptyText = "Məlumat tapılmadı",
  hideOnMobile = false,
  tableAuto = false,
  minWidth = "min-w-[820px]",
  containerClassName = "bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30",
  rowKey = "id",
  rowClassName = "transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50",
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Typography variant="small" className="text-gray-500 dark:text-gray-400">
          {loadingText}
        </Typography>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <Typography variant="small" className="text-gray-500 dark:text-gray-400">
          {emptyText}
        </Typography>
      </div>
    );
  }

  return (
    <div className={`${hideOnMobile ? "hidden lg:block" : ""} overflow-x-auto ${containerClassName}`}>
      <table className={`w-full ${tableAuto ? "table-auto" : ""} ${minWidth}`}>
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900/50">
            {columns.map(({ key, label, align = "text-left" }) => (
              <th key={key || label} className={`px-4 xl:px-6 py-3 xl:py-4 ${align}`}>
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  {label}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((row, rowIndex) => {
            const key = typeof rowKey === "function" ? rowKey(row, rowIndex) : row?.[rowKey] ?? rowIndex;
            return (
              <tr key={key} className={rowClassName}>
                {columns.map((column) => {
                  const value = row?.[column.key];
                  return (
                    <td key={column.key} className={`px-4 xl:px-6 py-3 xl:py-4 ${column.align || "text-left"} ${column.cellClassName || ""}`}>
                      {typeof column.render === "function" ? (
                        column.render(row, rowIndex)
                      ) : (
                        <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                          {value ?? "-"}
                        </Typography>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
