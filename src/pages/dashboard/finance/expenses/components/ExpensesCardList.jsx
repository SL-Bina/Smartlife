import React from "react";
import { Card, CardBody, Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ExpensesCardList({ expenses, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
      {expenses.map((row) => (
        <Card key={row.id} className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardBody className="space-y-2 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                {row.category}
              </Typography>
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
            </div>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("expenses.mobile.id")}: {row.id}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("expenses.mobile.description")}: {row.description}
            </Typography>
            <Typography variant="small" color="red" className="font-semibold dark:text-red-300">
              {t("expenses.mobile.amount")}: {row.amount} ₼
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("expenses.mobile.paymentMethod")}: {row.paymentMethod === "Nağd" ? t("expenses.paymentMethod.cash") : t("expenses.paymentMethod.bank")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("expenses.mobile.paymentDate")}: {row.paymentDate}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("expenses.mobile.paidBy")}: {row.paidBy}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("expenses.mobile.invoice")}: {row.invoiceNumber}
            </Typography>
            <Chip
              size="sm"
              value={row.status === "Təsdiqlənib" ? t("expenses.status.approved") : t("expenses.status.pending")}
              color={row.status === "Təsdiqlənib" ? "green" : "amber"}
              className="dark:bg-opacity-80"
            />
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

