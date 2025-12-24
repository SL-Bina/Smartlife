import React from "react";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DebtorApartmentsTable({ apartments, onView, onPay, onInvoices }) {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block">
      <table className="w-full table-auto min-w-[1200px]">
        <thead>
          <tr>
            {[
              t("debtorApartments.table.id"),
              t("debtorApartments.table.apartment"),
              t("debtorApartments.table.apartmentInfo"),
              t("debtorApartments.table.owner"),
              t("debtorApartments.table.phone"),
              t("debtorApartments.table.totalDebt"),
              t("debtorApartments.table.invoiceCount"),
              t("debtorApartments.table.lastPaymentDate"),
              t("debtorApartments.table.status"),
              t("debtorApartments.table.operations"),
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
          {apartments.map((row, key) => {
            const className = `py-3 px-6 ${
              key === apartments.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
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
                  <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                    {t("debtorApartments.labels.building")}: {row.building}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                    {t("debtorApartments.labels.block")}: {row.block}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                    {t("debtorApartments.labels.floor")}: {row.floor}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                    {t("debtorApartments.labels.area")}: {row.area} m²
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.owner}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.phone}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography
                    variant="small"
                    color={parseFloat(row.totalDebt) > 0 ? "red" : "green"}
                    className={`font-semibold ${parseFloat(row.totalDebt) > 0 ? "dark:text-red-400" : "dark:text-green-300"}`}
                  >
                    {row.totalDebt} ₼
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.invoiceCount}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.lastPaymentDate}
                  </Typography>
                </td>
                <td className={className}>
                  <Chip
                    size="sm"
                    value={row.status === "Ödənilib" ? t("debtorApartments.status.paid") : t("debtorApartments.status.debtor")}
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
                        {t("debtorApartments.actions.view")}
                      </MenuItem>
                      <MenuItem onClick={() => onPay(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("debtorApartments.actions.pay")}
                      </MenuItem>
                      <MenuItem onClick={() => onInvoices(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("debtorApartments.actions.invoices")}
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

