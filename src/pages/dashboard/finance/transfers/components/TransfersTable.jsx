import React from "react";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function TransfersTable({ transfers, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block">
      <table className="w-full table-auto min-w-[1200px]">
        <thead>
          <tr>
            {[
              t("transfers.table.id"),
              t("transfers.table.fromAccount"),
              t("transfers.table.toAccount"),
              t("transfers.table.amount"),
              t("transfers.table.transferDate"),
              t("transfers.table.description"),
              t("transfers.table.referenceNumber"),
              t("transfers.table.status"),
              t("transfers.table.operations"),
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
                  <Chip
                    size="sm"
                    value={row.fromAccount === "Nağd" ? t("transfers.account.cash") : t("transfers.account.bank")}
                    color={row.fromAccount === "Nağd" ? "amber" : "blue"}
                    className="dark:bg-opacity-80"
                  />
                </td>
                <td className={className}>
                  <Chip
                    size="sm"
                    value={row.toAccount === "Nağd" ? t("transfers.account.cash") : t("transfers.account.bank")}
                    color={row.toAccount === "Nağd" ? "amber" : "blue"}
                    className="dark:bg-opacity-80"
                  />
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
                  <Chip
                    size="sm"
                    value={row.status === "Tamamlanıb" ? t("transfers.status.completed") : t("transfers.status.pending")}
                    color={row.status === "Tamamlanıb" ? "green" : "amber"}
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

