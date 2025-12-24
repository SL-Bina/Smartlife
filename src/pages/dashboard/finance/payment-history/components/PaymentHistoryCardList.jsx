import React from "react";
import { Card, CardBody, Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
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
              <Chip size="sm" value={t("paymentHistory.status.successful")} color="green" className="dark:bg-opacity-80" />
              <Chip size="sm" value={t("paymentHistory.transactionType.income")} color="green" className="dark:bg-opacity-80" />
              <Chip
                size="sm"
                value={row.paymentType === "Nağd" ? t("paymentHistory.paymentType.cash") : t("paymentHistory.paymentType.balance")}
                color={row.paymentType === "Nağd" ? "amber" : "blue"}
                className="dark:bg-opacity-80"
              />
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

