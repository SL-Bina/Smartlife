import React from "react";
import { Card, CardBody, Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DebtorApartmentsCardList({ apartments, onView, onPay, onInvoices }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
      {apartments.map((row) => (
        <Card key={row.id} className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardBody className="space-y-2 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                {row.apartment}
              </Typography>
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
            </div>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("debtorApartments.mobile.id")}: {row.id}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("debtorApartments.mobile.owner")}: {row.owner}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("debtorApartments.mobile.phone")}: {row.phone}
            </Typography>
            <Typography
              variant="small"
              color={parseFloat(row.totalDebt) > 0 ? "red" : "green"}
              className={`font-semibold ${parseFloat(row.totalDebt) > 0 ? "dark:text-red-400" : "dark:text-green-300"}`}
            >
              {t("debtorApartments.mobile.totalDebt")}: {row.totalDebt} ₼
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("debtorApartments.mobile.invoiceCount")}: {row.invoiceCount}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("debtorApartments.mobile.lastPayment")}: {row.lastPaymentDate}
            </Typography>
            <Chip
              size="sm"
              value={row.status === "Ödənilib" ? t("debtorApartments.status.paid") : t("debtorApartments.status.debtor")}
              color={row.status === "Ödənilib" ? "green" : "red"}
              className="dark:bg-opacity-80"
            />
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

