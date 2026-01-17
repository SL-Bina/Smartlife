import React from "react";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function TransfersTable({ transfers, onView, onEdit, onDelete, sortConfig, onSortChange }) {
  const { t } = useTranslation();

  const columns = [
    { key: "id", label: t("transfers.table.id"), sortable: true },
    { key: "fromAccount", label: t("transfers.table.fromAccount"), sortable: true },
    { key: "toAccount", label: t("transfers.table.toAccount"), sortable: true },
    { key: "amount", label: t("transfers.table.amount"), sortable: true },
    { key: "transferDate", label: t("transfers.table.transferDate"), sortable: true },
    { key: "description", label: t("transfers.table.description"), sortable: true },
    { key: "referenceNumber", label: t("transfers.table.referenceNumber"), sortable: true },
    { key: "status", label: t("transfers.table.status"), sortable: true },
    { key: "operations", label: t("transfers.table.operations"), sortable: false },
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
                  idx === 8 ? "text-right" : ""
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
          {transfers.map((row, key) => {
            const className = `py-3 px-6 ${
              key === transfers.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
            }`;
            return (
              <tr key={row.id} className="dark:hover:bg-gray-700/50">
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.id}
                  </Typography>
                </td>
                <td className={className}>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      row.fromAccount === "Nağd"
                        ? "bg-yellow-100 text-orange-600 dark:bg-yellow-900/30 dark:text-orange-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {row.fromAccount === "Nağd" ? t("transfers.account.cash") : t("transfers.account.bank")}
                  </span>
                </td>
                <td className={className}>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      row.toAccount === "Nağd"
                        ? "bg-yellow-100 text-orange-600 dark:bg-yellow-900/30 dark:text-orange-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {row.toAccount === "Nağd" ? t("transfers.account.cash") : t("transfers.account.bank")}
                  </span>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
                    {row.amount} ₼
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.transferDate}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.description}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.referenceNumber}
                  </Typography>
                </td>
                <td className={className}>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      row.status === "Tamamlanıb"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-orange-600 dark:bg-yellow-900/30 dark:text-orange-400"
                    }`}
                  >
                    {row.status === "Tamamlanıb" ? t("transfers.status.completed") : t("transfers.status.pending")}
                  </span>
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
                        {t("transfers.actions.view")}
                      </MenuItem>
                      <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("transfers.actions.edit")}
                      </MenuItem>
                      <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("transfers.actions.delete")}
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

