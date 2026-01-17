import React from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DebtCardList({ debts, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
      {debts.map((row) => (
        <Card key={row.id} className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardBody className="space-y-2 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                {row.creditor}
              </Typography>
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
            </div>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("debt.mobile.id")}: {row.id}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("debt.mobile.debtor")}: {row.debtor}
            </Typography>
            <Typography variant="small" color="red" className="font-semibold dark:text-red-300">
              {t("debt.mobile.amount")}: {row.amount} ₼
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("debt.mobile.category")}: {row.category}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("debt.mobile.dueDate")}: {row.dueDate}
            </Typography>
            <div className="flex items-center gap-2">
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {t("debt.mobile.status")}:
              </Typography>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  row.status === "Ödənilib"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {row.status === "Ödənilib" ? t("debt.status.paid") : t("debt.status.active")}
              </span>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

