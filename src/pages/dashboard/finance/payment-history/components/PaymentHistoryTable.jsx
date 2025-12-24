import React from "react";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function PaymentHistoryTable({ payments, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block">
      <table className="w-full table-auto min-w-[1400px]">
        <thead>
          <tr>
            {[
              t("paymentHistory.table.id"),
              t("paymentHistory.table.payer"),
              t("paymentHistory.table.apartmentInfo"),
              t("paymentHistory.table.amount"),
              t("paymentHistory.table.paymentDate"),
              t("paymentHistory.table.status"),
              t("paymentHistory.table.transactionType"),
              t("paymentHistory.table.paymentType"),
              t("paymentHistory.table.operations"),
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
                  <Chip size="sm" value={t("paymentHistory.status.successful")} color="green" className="dark:bg-opacity-80" />
                </td>
                <td className={className}>
                  <Chip size="sm" value={t("paymentHistory.transactionType.income")} color="green" className="dark:bg-opacity-80" />
                </td>
                <td className={className}>
                  <Chip
                    size="sm"
                    value={row.paymentType === "Nağd" ? t("paymentHistory.paymentType.cash") : t("paymentHistory.paymentType.balance")}
                    color={row.paymentType === "Nağd" ? "amber" : "blue"}
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

