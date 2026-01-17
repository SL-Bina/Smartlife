import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { ArrowUpIcon, ArrowDownIcon, LightBulbIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ApplicationsListTable({ applications, onView, onEdit, onDelete, sortConfig, onSortChange }) {
  const { t } = useTranslation();

  const columns = [
    { key: "id", label: t("applications.list.table.id") || "ID", sortable: true },
    { key: "apartmentEmployee", label: t("applications.list.table.apartmentEmployee") || "Mənzil/Əməkdaş", sortable: true },
    { key: "text", label: t("applications.list.table.text") || "Mətn", sortable: true },
    { key: "department", label: t("applications.list.table.department") || "Şöbə", sortable: true },
    { key: "residentPriority", label: t("applications.list.table.residentPriority") || "Sakin prioriteti", sortable: false },
    { key: "operationPriority", label: t("applications.list.table.operationPriority") || "Əməliyyat prioriteti", sortable: false },
    { key: "image", label: t("applications.list.table.image") || "Şəkil", sortable: false },
    { key: "status", label: t("applications.list.table.status") || "Status", sortable: true },
    { key: "date", label: t("applications.list.table.date") || "Tarix", sortable: true },
    { key: "operations", label: t("applications.list.table.operations") || "Əməliyyatlar", sortable: false },
  ];

  const handleSort = (key) => {
    if (!columns.find((col) => col.key === key)?.sortable) return;

    let direction = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc") {
      direction = "desc";
    }
    onSortChange({ key, direction });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Tamamlandı":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Gözləmədə":
        return "bg-yellow-100 text-orange-600 dark:bg-yellow-900/30 dark:text-orange-400";
      case "Ləğv edildi":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "Yüksək":
      case "Tecili":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "Orta":
      case "5 deqiqelik":
        return "bg-yellow-100 text-orange-600 dark:bg-yellow-900/30 dark:text-orange-400";
      case "Normal":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full table-auto min-w-[1400px]">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${
                  idx === 9 ? "text-right" : ""
                } ${col.sortable ? "cursor-pointer hover:bg-blue-gray-50 dark:hover:bg-gray-700 transition-colors" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <Typography
                    variant="small"
                    className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400"
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
          {applications.map((row, key) => {
            const className = `py-3 px-6 ${
              key === applications.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
            }`;
            return (
              <tr key={row.id} className="dark:hover:bg-gray-700/50">
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.id}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white max-w-[150px] truncate" title={row.apartmentEmployee || "-"}>
                    {row.apartmentEmployee || "-"}
                  </Typography>
                </td>
                <td className={className}>
                  <div className="flex items-center gap-2 max-w-xs">
                    {row.isNew && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 whitespace-nowrap">
                        {t("applications.list.new")}
                      </span>
                    )}
                    <Typography variant="small" color="blue-gray" className="dark:text-gray-300 truncate" title={row.text}>
                      {row.text}
                    </Typography>
                  </div>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300 max-w-[120px] truncate" title={row.department || "-"}>
                    {row.department || "-"}
                  </Typography>
                </td>
                <td className={className}>
                  {row.residentPriority && row.residentPriority !== "-" ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityBadgeClass(row.residentPriority)}`}>
                      {row.residentPriority}
                    </span>
                  ) : (
                    <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                      -
                    </Typography>
                  )}
                </td>
                <td className={className}>
                  {row.operationPriority && row.operationPriority !== "-" ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityBadgeClass(row.operationPriority)}`}>
                      {row.operationPriority}
                    </span>
                  ) : (
                    <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                      -
                    </Typography>
                  )}
                </td>
                <td className={className}>
                  {row.image && row.image !== "-" ? (
                    <div className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-700 flex items-center justify-center">
                      <LightBulbIcon className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                      -
                    </Typography>
                  )}
                </td>
                <td className={className}>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getStatusBadgeClass(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300 whitespace-nowrap">
                    {row.date}
                  </Typography>
                </td>
                <td className={`${className} text-right`}>
                  <Button
                    size="sm"
                    variant="outlined"
                    color="blue"
                    onClick={() => onView(row)}
                    className="dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-600/20 whitespace-nowrap"
                  >
                    {t("applications.list.details")}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

