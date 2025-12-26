import React from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function MtkCardList({ mtk, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
      {mtk.map((row) => (
        <Card key={row.id} className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardBody className="space-y-2 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                {row.name}
              </Typography>
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                  </IconButton>
                </MenuHandler>
                <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                  {onView && (
                    <MenuItem onClick={() => onView(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                      {t("mtk.actions.view")}
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("mtk.actions.edit")}
                  </MenuItem>
                  <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("mtk.actions.delete")}
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
            <div className="space-y-1">
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {t("mtk.table.id") || "ID"}: {row.id}
              </Typography>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    row.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {row.status === "active" ? (t("mtk.form.active") || "Aktiv") : (t("mtk.form.inactive") || "Passiv")}
                </span>
              </div>
              {row.meta?.email && (
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {t("mtk.table.email") || "Email"}: {row.meta.email}
                </Typography>
              )}
              {row.meta?.phone && (
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {t("mtk.table.phone") || "Telefon"}: {row.meta.phone}
                </Typography>
              )}
              {row.meta?.address && (
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {t("mtk.table.address") || "Ünvan"}: {row.meta.address}
                </Typography>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

