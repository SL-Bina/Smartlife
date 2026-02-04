import React from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function TransfersCardList({ transfers, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
      {transfers.map((row) => (
        <Card key={row.id} className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardBody className="space-y-2 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                {row.referenceNumber}
              </Typography>
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
            </div>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("transfers.mobile.id")}: {row.id}
            </Typography>
            <div className="flex items-center gap-2 flex-wrap">
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {t("transfers.mobile.fromAccount")}:
              </Typography>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  row.fromAccount === "Nağd"
                    ? "bg-yellow-100 text-orange-600 dark:bg-yellow-900/30 dark:text-orange-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                {row.fromAccount === "Nağd" ? t("transfers.account.cash") : t("transfers.account.bank")}
              </span>
              <span className="text-blue-gray-400 dark:text-gray-500">→</span>
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {t("transfers.mobile.toAccount")}:
              </Typography>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  row.toAccount === "Nağd"
                    ? "bg-yellow-100 text-orange-600 dark:bg-yellow-900/30 dark:text-orange-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                }`}
              >
                {row.toAccount === "Nağd" ? t("transfers.account.cash") : t("transfers.account.bank")}
              </span>
            </div>
            <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
              {t("transfers.mobile.amount")}: {row.amount} ₼
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("transfers.mobile.transferDate")}: {row.transferDate}
            </Typography>
            <div className="flex items-center gap-2">
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {t("transfers.mobile.status")}:
              </Typography>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  row.status === "Tamamlanıb"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-orange-600 dark:bg-yellow-900/30 dark:text-orange-400"
                }`}
              >
                {row.status === "Tamamlanıb" ? t("transfers.status.completed") : t("transfers.status.pending")}
              </span>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

