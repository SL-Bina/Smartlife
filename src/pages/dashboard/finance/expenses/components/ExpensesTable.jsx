import React from "react";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ExpensesTable({ expenses, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block">
      <table className="w-full table-auto min-w-[1200px]">
        <thead>
          <tr>
            {[
              t("expenses.table.id"),
              t("expenses.table.category"),
              t("expenses.table.description"),
              t("expenses.table.amount"),
              t("expenses.table.paymentMethod"),
              t("expenses.table.paymentDate"),
              t("expenses.table.paidBy"),
              t("expenses.table.invoiceNumber"),
              t("expenses.table.status"),
              t("expenses.table.operations"),
            ].map((el, idx) => (
              <th
                key={el}
                className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${
                  idx === 9 ? "text-right" : ""
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
          {expenses.map((row, key) => {
            const className = `py-3 px-6 ${
              key === expenses.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
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
                    {row.category}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.description}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="red" className="font-semibold dark:text-red-300">
                    {row.amount} ₼
                  </Typography>
                </td>
                <td className={className}>
                  <Chip
                    size="sm"
                    value={row.paymentMethod === "Nağd" ? t("expenses.paymentMethod.cash") : t("expenses.paymentMethod.bank")}
                    color={row.paymentMethod === "Nağd" ? "amber" : "blue"}
                    className="dark:bg-opacity-80"
                  />
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.paymentDate}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.paidBy}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.invoiceNumber}
                  </Typography>
                </td>
                <td className={className}>
                  <Chip
                    size="sm"
                    value={row.status === "Təsdiqlənib" ? t("expenses.status.approved") : t("expenses.status.pending")}
                    color={row.status === "Təsdiqlənib" ? "green" : "amber"}
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

