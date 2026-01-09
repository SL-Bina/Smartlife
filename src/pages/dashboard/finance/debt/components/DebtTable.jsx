import React from "react";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DebtTable({ debts, onView, onEdit, onDelete, sortConfig, onSortChange }) {
  const { t } = useTranslation();

  const columns = [
    { key: "id", label: t("debt.table.id"), sortable: true },
    { key: "creditor", label: t("debt.table.creditor"), sortable: true },
    { key: "debtor", label: t("debt.table.debtor"), sortable: true },
    { key: "amount", label: t("debt.table.amount"), sortable: true },
    { key: "category", label: t("debt.table.category"), sortable: true },
    { key: "debtDate", label: t("debt.table.debtDate"), sortable: true },
    { key: "dueDate", label: t("debt.table.dueDate"), sortable: true },
    { key: "description", label: t("debt.table.description"), sortable: true },
    { key: "status", label: t("debt.table.status"), sortable: true },
    { key: "operations", label: t("debt.table.operations"), sortable: false },
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
    <div className="hidden lg:block">
      <table className="w-full table-auto min-w-[1200px]">
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
          {debts.map((row, key) => {
            const className = `py-3 px-6 ${
              key === debts.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
            }`;
            return (
              <tr key={row.id} className="dark:hover:bg-gray-700/50">
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.id}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                    {row.creditor}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.debtor}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="red" className="font-semibold dark:text-red-300">
                    {row.amount} ₼
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.category}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.debtDate}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.dueDate}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.description}
                  </Typography>
                </td>
                <td className={className}>
                  <Chip
                    size="sm"
                    value={row.status === "Ödənilib" ? t("debt.status.paid") : t("debt.status.active")}
                    color={row.status === "Ödənilib" ? "green" : "red"}
                    className="dark:bg-opacity-80"
                  />
                </td>
                <td className={`${className} text-right`}>
                  <Menu placement="left-start">
                    <MenuHandler>
                      <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                        <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                      </IconButton>
                    </MenuHandler>
                    <MenuList className="dark:bg-gray-800 dark:border-gray-800">
                      <MenuItem onClick={() => onView(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("debt.actions.view")}
                      </MenuItem>
                      <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("debt.actions.edit")}
                      </MenuItem>
                      <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("debt.actions.delete")}
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

