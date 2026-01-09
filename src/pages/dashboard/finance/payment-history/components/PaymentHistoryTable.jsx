import React from "react";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function PaymentHistoryTable({ payments, onView, onEdit, onDelete, sortConfig, onSortChange }) {
  const { t } = useTranslation();

  const columns = [
    { key: "id", label: t("paymentHistory.table.id"), sortable: true },
    { key: "payer", label: t("paymentHistory.table.payer"), sortable: true },
    { key: "apartmentInfo", label: t("paymentHistory.table.apartmentInfo"), sortable: false },
    { key: "amount", label: t("paymentHistory.table.amount"), sortable: true },
    { key: "paymentDate", label: t("paymentHistory.table.paymentDate"), sortable: true },
    { key: "status", label: t("paymentHistory.table.status"), sortable: true },
    { key: "transactionType", label: t("paymentHistory.table.transactionType"), sortable: true },
    { key: "paymentType", label: t("paymentHistory.table.paymentType"), sortable: true },
    { key: "operations", label: t("paymentHistory.table.operations"), sortable: false },
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
      <table className="w-full table-auto min-w-[1400px]">
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
          {payments.map((row, key) => {
            const className = `py-3 px-6 ${
              key === payments.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
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
                    {row.payer}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                    {t("paymentHistory.labels.building")}: {row.building}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                    {t("paymentHistory.labels.block")}: {row.block}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                    {t("paymentHistory.labels.apartment")}: {row.apartment}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                    {t("paymentHistory.labels.floor")}: {row.floor}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                    {t("paymentHistory.labels.area")}: {row.area} m²
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                    {t("paymentHistory.labels.serviceDate")}: {row.serviceDate}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                    {row.amount} AZN
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.paymentDate}
                  </Typography>
                </td>
                <td className={className}>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      row.status === "successful" || row.status === "Uğurlu"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {t("paymentHistory.status.successful")}
                  </span>
                </td>
                <td className={className}>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      row.transactionType === "income" || row.transactionType === "Gəlir"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {t("paymentHistory.transactionType.income")}
                  </span>
                </td>
                <td className={className}>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      row.paymentType === "Nağd" || row.paymentType === "cash"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {row.paymentType === "Nağd" || row.paymentType === "cash"
                      ? t("paymentHistory.paymentType.cash")
                      : t("paymentHistory.paymentType.balance")}
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
                        {t("paymentHistory.actions.view")}
                      </MenuItem>
                      <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("paymentHistory.actions.edit")}
                      </MenuItem>
                      <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("paymentHistory.actions.delete")}
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

