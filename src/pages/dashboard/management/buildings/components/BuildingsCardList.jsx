import React from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function BuildingsCardList({ buildings, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
      {buildings.map((row) => (
        <Card key={row.id} className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardBody className="space-y-3 dark:bg-gray-800">
            <div className="flex items-center justify-between gap-2">
              <div>
                <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                  {row.name}
                </Typography>
                <Typography variant="small" className="text-xs text-blue-gray-400 dark:text-gray-400">
                  {t("buildings.table.id")}: {row.id}
                </Typography>
              </div>
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                  </IconButton>
                </MenuHandler>
                <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                  {onView && (
                    <MenuItem onClick={() => onView(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                      {t("buildings.actions.view")}
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("buildings.actions.edit")}
                  </MenuItem>
                  <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("buildings.actions.delete")}
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("buildings.table.complex")}: {row.complex}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("buildings.table.blocksCount")}: {row.blocks}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("buildings.table.apartmentsCount")}: {row.apartments}
            </Typography>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

