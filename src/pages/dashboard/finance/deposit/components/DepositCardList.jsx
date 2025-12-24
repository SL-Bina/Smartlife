import React from "react";
import { Card, CardBody, Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DepositCardList({ deposits, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
      {deposits.map((row) => (
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
                    {t("deposit.actions.view")}
                  </MenuItem>
                  <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("deposit.actions.edit")}
                  </MenuItem>
                  <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("deposit.actions.delete")}
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("deposit.mobile.id")}: {row.id}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("deposit.mobile.owner")}: {row.owner}
            </Typography>
            <Typography variant="small" color="green" className="font-semibold dark:text-green-300">
              {t("deposit.mobile.amount")}: {row.amount} ₼
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("deposit.mobile.paymentMethod")}: {row.paymentMethod === "Nağd" ? t("deposit.paymentMethod.cash") : t("deposit.paymentMethod.bank")}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("deposit.mobile.depositDate")}: {row.depositDate}
            </Typography>
            <Chip
              size="sm"
              value={row.status === "Aktiv" ? t("deposit.status.active") : t("deposit.status.returned")}
              color={row.status === "Aktiv" ? "green" : "gray"}
              className="dark:bg-opacity-80"
            />
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

