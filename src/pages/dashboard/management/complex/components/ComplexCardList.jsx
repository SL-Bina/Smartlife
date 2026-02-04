import React from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ComplexCardList({ complexes, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  if (!complexes || complexes.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
      {complexes.map((row) => (
        <Card
          key={row.id}
          className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800"
        >
          <CardBody className="space-y-2 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-semibold dark:text-white"
              >
                {row.name}
              </Typography>
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <EllipsisVerticalIcon
                      strokeWidth={2}
                      className="h-5 w-5"
                    />
                  </IconButton>
                </MenuHandler>
                <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                  {onView && (
                    <MenuItem onClick={() => onView(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("complexes.actions.view")}</MenuItem>
                  )}
                  <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("complexes.actions.edit")}</MenuItem>
                  <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("complexes.actions.delete")}</MenuItem>
                </MenuList>
              </Menu>
            </div>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("complexes.table.id")}: {row.id}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("complexes.table.address")}: {row.meta?.address || "-"}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("complexes.table.buildingsCount")}: {row.buildings?.length || 0}
            </Typography>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
