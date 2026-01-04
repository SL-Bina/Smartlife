import React from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function BuildingsCardList({ buildings, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  if (buildings.length === 0) {
    return (
      <div className="lg:hidden px-4 pt-4">
        <Typography variant="small" color="blue-gray" className="text-center dark:text-gray-400 py-8">
          {t("buildings.table.noData") || "Məlumat yoxdur"}
        </Typography>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
      {buildings.map((row) => (
        <Card key={row.id} className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardBody className="space-y-3 dark:bg-gray-800">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white mb-1">
                  {row.name || "-"}
                </Typography>
                <Typography variant="small" className="text-xs text-blue-gray-400 dark:text-gray-400">
                  ID: #{row.id}
                </Typography>
              </div>
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700 flex-shrink-0">
                    <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                  </IconButton>
                </MenuHandler>
                <MenuList className="dark:bg-gray-800 dark:border-gray-700 min-w-[120px]">
                  {onView && (
                    <MenuItem onClick={() => onView(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                      {t("buildings.actions.view") || "Bax"}
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("buildings.actions.edit") || "Düzəliş et"}
                  </MenuItem>
                  <MenuItem 
                    onClick={() => onDelete(row)} 
                    className="dark:text-red-400 dark:hover:bg-red-900/20 text-red-500"
                  >
                    {t("buildings.actions.delete") || "Sil"}
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
            <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <Typography variant="small" className="text-xs text-blue-gray-400 dark:text-gray-400">
                  {t("buildings.table.complex") || "Kompleks"}:
                </Typography>
                <Typography variant="small" color="blue-gray" className="font-medium dark:text-gray-300">
                  {row.complex?.name || "-"}
                </Typography>
              </div>
              <div className="flex items-center justify-between">
                <Typography variant="small" className="text-xs text-blue-gray-400 dark:text-gray-400">
                  {t("buildings.table.status") || "Status"}:
                </Typography>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    row.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {row.status === "active" ? (t("buildings.status.active") || "Aktiv") : (t("buildings.status.inactive") || "Passiv")}
                </span>
              </div>
              {row.meta?.desc && (
                <div>
                  <Typography variant="small" className="text-xs text-blue-gray-400 dark:text-gray-400 mb-1">
                    {t("buildings.table.description") || "Təsvir"}:
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300 line-clamp-2">
                    {row.meta.desc}
                  </Typography>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

