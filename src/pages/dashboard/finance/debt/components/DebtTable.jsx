import React from "react";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DebtTable({ debts, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block">
      <table className="w-full table-auto min-w-[1200px]">
        <thead>
          <tr>
            {[
              t("debt.table.id"),
              t("debt.table.creditor"),
              t("debt.table.debtor"),
              t("debt.table.amount"),
              t("debt.table.category"),
              t("debt.table.debtDate"),
              t("debt.table.dueDate"),
              t("debt.table.description"),
              t("debt.table.status"),
              t("debt.table.operations"),
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

