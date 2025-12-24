import React from "react";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DepositTable({ deposits, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block">
      <table className="w-full table-auto min-w-[1200px]">
        <thead>
          <tr>
            {[
              t("deposit.table.id"),
              t("deposit.table.apartment"),
              t("deposit.table.owner"),
              t("deposit.table.amount"),
              t("deposit.table.paymentMethod"),
              t("deposit.table.depositDate"),
              t("deposit.table.status"),
              t("deposit.table.notes"),
              t("deposit.table.operations"),
            ].map((el, idx) => (
              <th
                key={el}
                className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${
                  idx === 8 ? "text-right" : ""
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
          {deposits.map((row, key) => {
            const className = `py-3 px-6 ${
              key === deposits.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
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
                    {row.apartment}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.owner}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="green" className="font-semibold dark:text-green-300">
                    {row.amount} ₼
                  </Typography>
                </td>
                <td className={className}>
                  <Chip
                    size="sm"
                    value={row.paymentMethod === "Nağd" ? t("deposit.paymentMethod.cash") : t("deposit.paymentMethod.bank")}
                    color={row.paymentMethod === "Nağd" ? "amber" : "blue"}
                    className="dark:bg-opacity-80"
                  />
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.depositDate}
                  </Typography>
                </td>
                <td className={className}>
                  <Chip
                    size="sm"
                    value={row.status === "Aktiv" ? t("deposit.status.active") : t("deposit.status.returned")}
                    color={row.status === "Aktiv" ? "green" : "gray"}
                    className="dark:bg-opacity-80"
                  />
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.notes}
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
                        {t("deposit.actions.view")}
                      </MenuItem>
                      <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("deposit.actions.edit")}
                      </MenuItem>
                      <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("deposit.actions.delete")}
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

