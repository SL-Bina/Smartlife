import React from "react";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ExpensesTable({ expenses, onView, onEdit, onDelete, sortConfig, onSortChange }) {
  const { t } = useTranslation();

  const columns = [
    { key: "id", label: t("expenses.table.id") || "ID", sortable: true },
    { key: "category", label: t("expenses.table.category") || "Xərc növü", sortable: true },
    { key: "title", label: t("expenses.table.title") || "Başlıq", sortable: true },
    { key: "description", label: t("expenses.table.description") || "Açıqlama", sortable: true },
    { key: "amount", label: t("expenses.table.amount") || "Məbləğ", sortable: true },
    { key: "paymentDate", label: t("expenses.table.paymentDate") || "Tarix", sortable: true },
    { key: "operations", label: t("expenses.table.operations") || "Əməliyyatlar", sortable: false },
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
      <table className="w-full table-auto min-w-[1000px]">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${
                  idx === 6 ? "text-right" : ""
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
          {expenses.map((row, key) => {
            const className = `py-2 px-6 ${
              key === expenses.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
            }`;
            return (
              <tr
                key={row.id}
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
                    {row.id}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {row.category}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.title || row.description || "-"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.description || "-"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="red" className="font-semibold dark:text-red-400">
                    {parseFloat(row.amount || 0).toFixed(2)} ₼
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.paymentDate || "-"}
                  </Typography>
                </td>
                <td className={`${className} text-right`} onClick={(e) => e.stopPropagation()}>
                  <Menu placement="left-start">
                    <MenuHandler>
                      <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-blue-600/20 hover:bg-blue-100">
                        <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                      </IconButton>
                    </MenuHandler>
                    <MenuList className="dark:bg-gray-800 dark:border-gray-800">
                      <MenuItem onClick={() => onView(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("expenses.actions.view")}
                      </MenuItem>
                      <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("expenses.actions.edit")}
                      </MenuItem>
                      <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("expenses.actions.delete")}
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

