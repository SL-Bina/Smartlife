import React from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ServicesCardList({ services, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
      {services.map((row) => (
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
                      {t("services.actions.view")}
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("services.actions.edit")}
                  </MenuItem>
                  <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("services.actions.delete")}
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
            <div className="space-y-1">
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {t("services.table.id") || "ID"}: {row.id}
              </Typography>
              {row.description && (
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300 line-clamp-2">
                  {row.description}
                </Typography>
              )}
              <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                {t("services.table.price") || "Qiymət"}: {parseFloat(row.price || 0).toFixed(2)} ₼
              </Typography>
              {row.created_at && (
                <Typography variant="small" color="blue-gray" className="dark:text-gray-400 text-xs">
                  {t("services.table.createdAt")}: {new Date(row.created_at).toLocaleDateString("az-AZ", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              )}
              {row.updated_at && (
                <Typography variant="small" color="blue-gray" className="dark:text-gray-400 text-xs">
                  {t("services.table.updatedAt")}: {new Date(row.updated_at).toLocaleDateString("az-AZ", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

