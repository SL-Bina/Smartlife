import React from "react";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function InvoicesTable({ invoices, onView, onEdit, onDelete, sortConfig, onSortChange }) {
  const { t } = useTranslation();

  const sortableColumns = [
    "id",
    "serviceName",
    "owner",
    "amount",
    "paidAmount",
    "remaining",
    "status",
    "invoiceDate",
    "paymentDate",
    "paymentMethod",
  ];

  const handleSort = (key) => {
    if (!sortableColumns.includes(key)) return;

    let direction = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc") {
      direction = "desc";
    }
    onSortChange({ key, direction });
  };

  const columns = [
    { key: "id", label: t("invoices.table.id"), sortable: true },
    { key: "serviceName", label: t("invoices.table.serviceName"), sortable: true },
    { key: "owner", label: t("invoices.table.owner"), sortable: true },
    { key: "apartmentInfo", label: t("invoices.table.apartmentInfo"), sortable: false },
    { key: "amount", label: t("invoices.table.amount"), sortable: true },
    { key: "paidAmount", label: t("invoices.table.paidAmount"), sortable: true },
    { key: "remaining", label: t("invoices.table.remaining"), sortable: true },
    { key: "status", label: t("invoices.table.status"), sortable: true },
    { key: "invoiceDate", label: t("invoices.table.invoiceDate"), sortable: true },
    { key: "paymentDate", label: t("invoices.table.paymentDate"), sortable: true },
    { key: "paymentMethod", label: t("invoices.table.paymentMethod"), sortable: true },
    { key: "operations", label: t("invoices.table.operations"), sortable: false },
  ];

  return (
    <div className="hidden lg:block overflow-y-auto">
      <table className="w-full table-auto min-w-[1200px]">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${
                  idx === 11 ? "text-right" : ""
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
          {invoices.map((row, key) => {
            const className = `py-3 px-6 text-center ${
              key === invoices.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
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
                    {row.serviceName}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.owner}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                    {t("invoices.labels.balance")}: {row.ownerBalance} ₼
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.apartment}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                    {t("invoices.labels.building")}: {row.building}, {t("invoices.labels.block")}: {row.block}, {t("invoices.labels.floor")}: {row.floor}, {t("invoices.labels.area")}: {row.area} m²
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                    {row.amount} ₼
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="green" className="font-semibold dark:text-green-300">
                    {row.paidAmount} ₼
                  </Typography>
                </td>
                <td className={className}>
                  <Typography
                    variant="small"
                    color={parseFloat(row.remaining) > 0 ? "red" : "blue-gray"}
                    className={`font-semibold ${parseFloat(row.remaining) > 0 ? "dark:text-red-400" : "dark:text-gray-300"}`}
                  >
                    {row.remaining} ₼
                  </Typography>
                </td>
                <td className={className}>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      row.status === "Ödənilib"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {row.status === "Ödənilib" ? t("invoices.status.paid") : t("invoices.status.unpaid")}
                  </span>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.invoiceDate}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.paymentDate || "-"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.paymentMethod || "-"}
                  </Typography>
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
                        {t("invoices.actions.view")}
                      </MenuItem>
                      <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("invoices.actions.edit")}
                      </MenuItem>
                      <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("invoices.actions.delete")}
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

