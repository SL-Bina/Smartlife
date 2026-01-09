import React from "react";
import { Typography, IconButton } from "@material-tailwind/react";
import { EyeIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DebtorApartmentsTable({ apartments, onView, sortConfig, onSortChange }) {
  const { t } = useTranslation();

  const columns = [
    { key: "id", label: t("debtorApartments.table.id") || "Id", sortable: true },
    { key: "apartment", label: t("debtorApartments.table.apartment") || "Mənzil", sortable: true },
    { key: "owner", label: t("debtorApartments.table.owner") || "Mənzil sahibi", sortable: true },
    { key: "building", label: t("debtorApartments.table.building") || "Bina", sortable: true },
    { key: "block", label: t("debtorApartments.table.block") || "Blok", sortable: true },
    { key: "floor", label: t("debtorApartments.table.floor") || "Mərtəbə", sortable: true },
    { key: "rooms", label: t("debtorApartments.table.rooms") || "Otaq", sortable: true },
    { key: "area", label: t("debtorApartments.table.area") || "Kv.m", sortable: true },
    { key: "invoiceCount", label: t("debtorApartments.table.invoiceCount") || "Faktura sayı", sortable: true },
    { key: "totalDebt", label: t("debtorApartments.table.totalDebt") || "Ümumi borc", sortable: true },
    { key: "operations", label: t("debtorApartments.table.operations") || "Əməliyyatlar", sortable: false },
  ];

  const handleSort = (key) => {
    if (!columns.find((col) => col.key === key)?.sortable) return;

    let direction = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc") {
      direction = "desc";
    }
    onSortChange({ key, direction });
  };

  return (
    <div className="hidden lg:block overflow-x-auto rounded-lg">
      <table className="w-full table-auto min-w-[1200px]">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`border-b border-blue-gray-200 dark:border-gray-700 py-4 px-6 text-left ${
                  idx === 10 ? "text-right" : ""
                } ${col.sortable ? "cursor-pointer hover:bg-blue-gray-50 dark:hover:bg-gray-700 transition-colors" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <Typography
                    variant="small"
                    className="text-[11px] font-bold uppercase text-blue-gray-700 dark:text-gray-300"
                  >
                    {col.label}
                  </Typography>
                  {col.sortable && (
                    <div className="flex flex-col">
                      <ArrowUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === col.key && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ArrowDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === col.key && sortConfig?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {apartments.map((row, key) => {
            const className = `py-3 px-6 ${
              key === apartments.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
            }`;
            return (
              <tr
                key={row.id || key}
                onClick={() => onView(row)}
                className={`
                  ${key % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-800/50"}
                  hover:bg-blue-50 dark:hover:bg-gray-700/70 
                  transition-all duration-200 
                  cursor-pointer
                  group
                `}
              >
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="font-medium dark:text-gray-300">
                    {row.id || "N/A"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {row.apartment || "N/A"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.owner || "-"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.building || "N/A"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.block || "N/A"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.floor || "N/A"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.rooms || "N/A"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.area ? `${row.area} m²` : "N/A"}
                  </Typography>
                </td>
                <td className={className}>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {row.invoiceCount || 0}
                  </span>
                </td>
                <td className={className}>
                  <Typography
                    variant="small"
                    color="red"
                    className="font-bold dark:text-red-400"
                  >
                    {row.totalDebt ? `${row.totalDebt} AZN` : "0 AZN"}
                  </Typography>
                </td>
                <td className={`${className} text-right`} onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    size="sm"
                    variant="text"
                    color="blue-gray"
                    onClick={() => onView(row)}
                    className="dark:text-gray-300 dark:hover:bg-blue-600/20 hover:bg-blue-100"
                  >
                    <EyeIcon strokeWidth={2} className="h-5 w-5" />
                  </IconButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

