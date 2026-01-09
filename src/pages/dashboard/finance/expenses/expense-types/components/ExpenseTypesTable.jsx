import React from "react";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ExpenseTypesTable({ expenseTypes, onView, onEdit, onDelete, sortConfig, onSortChange }) {
  const { t } = useTranslation();

  const columns = [
    { key: "id", label: t("expenseTypes.table.id") || "ID", sortable: true },
    { key: "name", label: t("expenseTypes.table.name") || "Ad", sortable: true },
    { key: "description", label: t("expenseTypes.table.description") || "Açıqlama", sortable: true },
    { key: "createdAt", label: t("expenseTypes.table.createdAt") || "Yaradılma", sortable: true },
    { key: "operations", label: t("expenseTypes.table.operations") || "Əməliyyatlar", sortable: false },
  ];

  const handleSort = (key) => {
    if (!columns.find((col) => col.key === key)?.sortable) return;

    let direction = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc") {
      direction = "desc";
    }
    onSortChange({ key, direction });
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="hidden lg:block overflow-x-auto rounded-lg">
      <table className="w-full table-auto min-w-[800px]">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700">
            {columns.map((col, idx) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`py-4 px-6 text-left ${
                  idx === 4 ? "text-right" : ""
                } ${col.sortable ? "cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <Typography
                    variant="small"
                    className="text-[11px] font-medium uppercase text-blue-gray-700 dark:text-gray-300"
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
          {expenseTypes.map((row, key) => {
            const className = `py-4 px-6 ${
              key === expenseTypes.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
            }`;
            return (
              <tr
                key={row.id}
                onClick={() => onView(row)}
                className={`cursor-pointer transition-colors ${
                  key % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-800/50"
                } hover:bg-blue-50 dark:hover:bg-gray-700/50`}
              >
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.id}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                    {row.name}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.description || "-"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {formatDate(row.createdAt)}
                  </Typography>
                </td>
                <td className={`${className} text-right`} onClick={(e) => e.stopPropagation()}>
                  <Menu placement="left-start" offset={5}>
                    <MenuHandler>
                      <div className="dark:text-gray-300 dark:hover:bg-blue-600/20 hover:bg-blue-100 cursor-pointer p-2 rounded-md text-end" onClick={(e) => e.stopPropagation()}>
                        <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                      </div>
                    </MenuHandler>
                    <MenuList className="dark:bg-gray-800 dark:border-gray-800 z-50">
                      <MenuItem onClick={() => onView(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <EyeIcon className="h-4 w-4" />
                          {t("expenseTypes.actions.view")}
                        </div>
                      </MenuItem>
                      <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <PencilIcon className="h-4 w-4" />
                          {t("expenseTypes.actions.edit")}
                        </div>
                      </MenuItem>
                      <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <TrashIcon className="h-4 w-4" />
                          {t("expenseTypes.actions.delete")}
                        </div>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

