import React from "react";
import { Card, CardBody, Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function InvoicesCardList({ invoices, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
      {invoices.map((row) => (
        <Card key={row.id} className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardBody className="space-y-2 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                {row.serviceName}
              </Typography>
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                  </IconButton>
                </MenuHandler>
                <MenuList className="dark:bg-gray-800 dark:border-gray-800">
                  <MenuItem onClick={() => onView(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("invoices.actions.view")}
                  </MenuItem>
                  <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("invoices.actions.edit")}
                  </MenuItem>
                  <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("invoices.actions.delete")}
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("invoices.mobile.id")}: {row.id}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("invoices.mobile.owner")}: {row.owner}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-white">
              {t("invoices.mobile.amount")}: {row.amount} ₼
            </Typography>
            <Typography variant="small" color="green" className="dark:text-green-300">
              {t("invoices.mobile.paid")}: {row.paidAmount} ₼
            </Typography>
            <Typography
              variant="small"
              color={parseFloat(row.remaining) > 0 ? "red" : "blue-gray"}
              className={parseFloat(row.remaining) > 0 ? "dark:text-red-400" : "dark:text-gray-300"}
            >
              {t("invoices.mobile.remaining")}: {row.remaining} ₼
            </Typography>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                row.status === "Ödənilib"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {row.status === "Ödənilib" ? t("invoices.status.paid") : t("invoices.status.unpaid")}
            </span>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

