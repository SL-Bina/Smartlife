import React from "react";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function InvoicesTable({ invoices, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block">
      <table className="w-full table-auto min-w-[1200px]">
        <thead>
          <tr>
            {[
              t("invoices.table.id"),
              t("invoices.table.serviceName"),
              t("invoices.table.owner"),
              t("invoices.table.apartmentInfo"),
              t("invoices.table.amount"),
              t("invoices.table.paidAmount"),
              t("invoices.table.remaining"),
              t("invoices.table.status"),
              t("invoices.table.invoiceDate"),
              t("invoices.table.paymentDate"),
              t("invoices.table.paymentMethod"),
              t("invoices.table.operations"),
            ].map((el, idx) => (
              <th
                key={el}
                className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${
                  idx === 11 ? "text-right" : ""
                }`}
              >
                <Typography
                  variant="small"
                  className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400"
                >
                  {el}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map((row, key) => {
            const className = `py-3 px-6 ${
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
                  <Chip
                    size="sm"
                    value={row.status === "Ödənilib" ? t("invoices.status.paid") : t("invoices.status.unpaid")}
                    color={row.status === "Ödənilib" ? "green" : "red"}
                    className="dark:bg-opacity-80"
                  />
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

