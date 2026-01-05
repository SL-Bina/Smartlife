import React from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function PaymentHistoryCardList({ payments, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
      {payments.map((row) => (
        <Card key={row.id} className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardBody className="space-y-2 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                {row.payer}
              </Typography>
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
            </div>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("paymentHistory.mobile.id")}: {row.id}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("paymentHistory.mobile.apartment")}: {row.apartment}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {t("paymentHistory.mobile.amount")}: {row.amount} AZN
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("paymentHistory.mobile.paymentDate")}: {row.paymentDate}
            </Typography>
            <div className="flex gap-2 flex-wrap">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  row.status === "successful" || row.status === "Uğurlu"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {t("paymentHistory.status.successful")}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  row.transactionType === "income" || row.transactionType === "Gəlir"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {t("paymentHistory.transactionType.income")}
              </span>
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
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

