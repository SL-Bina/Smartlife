import React from "react";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function BuildingsTable({ buildings, onView, onEdit, onDelete, sortConfig, onSortChange }) {
  const { t } = useTranslation();

  const columns = [
    { key: "id", label: t("buildings.table.id") || "ID", sortable: true },
    { key: "name", label: t("buildings.table.name") || "Ad", sortable: true },
    { key: "complex", label: t("buildings.table.complex") || "Kompleks", sortable: true },
    { key: "description", label: t("buildings.table.description") || "Təsvir", sortable: false },
    { key: "status", label: t("buildings.table.status") || "Status", sortable: true },
    { key: "actions", label: t("buildings.table.actions") || "Əməliyyatlar", sortable: false },
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
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full table-auto min-w-[800px]">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`border-b border-blue-gray-100 dark:border-gray-800 py-4 px-6 text-left ${
                  idx === 5 ? "text-right" : ""
                } ${col.sortable ? "cursor-pointer hover:bg-blue-gray-50 dark:hover:bg-gray-700 transition-colors" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <Typography
                    variant="small"
                    className="text-[11px] font-bold uppercase text-blue-gray-400 dark:text-gray-400"
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
          {buildings.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center">
                <Typography variant="small" color="blue-gray" className="dark:text-gray-400">
                  {t("buildings.table.noData") || "Məlumat yoxdur"}
                </Typography>
              </td>
            </tr>
          ) : (
            buildings.map((row, key) => {
              const className = `py-4 px-6 ${
                key === buildings.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
              }`;
              return (
                <tr key={row.id} className="dark:hover:bg-gray-700/50 transition-colors">
                  <td className={className}>
                    <Typography variant="small" color="blue-gray" className="font-medium dark:text-gray-300">
                      #{row.id}
                    </Typography>
                  </td>
                  <td className={className}>
                    <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                      {row.name || "-"}
                    </Typography>
                  </td>
                  <td className={className}>
                    <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                      {row.complex?.name || "-"}
                    </Typography>
                  </td>
                  <td className={className}>
                    <Typography 
                      variant="small" 
                      color="blue-gray" 
                      className="dark:text-gray-300 max-w-xs truncate"
                      title={row.meta?.desc || ""}
                    >
                      {row.meta?.desc || "-"}
                    </Typography>
                  </td>
                  <td className={className}>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        row.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {row.status === "active" ? (t("buildings.status.active") || "Aktiv") : (t("buildings.status.inactive") || "Passiv")}
                    </span>
                  </td>
                  <td className={`${className} text-right`}>
                    <Menu placement="left-start">
                      <MenuHandler>
                        <IconButton
                          size="sm"
                          variant="text"
                          color="blue-gray"
                          className="dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                        </IconButton>
                      </MenuHandler>
                      <MenuList className="dark:bg-gray-800 dark:border-gray-700 min-w-[120px]">
                        {onView && (
                          <MenuItem onClick={() => onView(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                            {t("buildings.actions.view") || "Bax"}
                          </MenuItem>
                        )}
                        <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                          {t("buildings.actions.edit") || "Düzəliş et"}
                        </MenuItem>
                        <MenuItem 
                          onClick={() => onDelete(row)} 
                          className="dark:text-red-400 dark:hover:bg-red-900/20 text-red-500"
                        >
                          {t("buildings.actions.delete") || "Sil"}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

