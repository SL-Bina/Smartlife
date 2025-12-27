import React from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ResidentsCardList({ residents, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
      {residents.map((row) => (
        <Card
          key={row.id}
          className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onView(row)}
        >
          <CardBody className="space-y-3 dark:bg-gray-800">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="text-[11px] font-medium uppercase dark:text-gray-400"
                >
                  {t("residents.table.fullName")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                  {row.fullName}
                </Typography>
              </div>
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton
                    size="sm"
                    variant="text"
                    color="blue-gray"
                    className="dark:text-gray-300 dark:hover:bg-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                  </IconButton>
                </MenuHandler>
                <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(row);
                    }}
                    className="dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {t("residents.actions.edit")}
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(row);
                    }}
                    className="dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    {t("residents.actions.delete")}
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>

            <div className="space-y-1">
              <Typography
                variant="small"
                color="blue-gray"
                className="text-[11px] font-medium uppercase dark:text-gray-400"
              >
                {t("residents.table.id")}
              </Typography>
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {row.id}
              </Typography>
            </div>

            <div className="space-y-1">
              <Typography
                variant="small"
                color="blue-gray"
                className="text-[11px] font-medium uppercase dark:text-gray-400"
              >
                {t("residents.table.email")}
              </Typography>
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {row.email}
              </Typography>
            </div>

            <div className="space-y-1">
              <Typography
                variant="small"
                color="blue-gray"
                className="text-[11px] font-medium uppercase dark:text-gray-400"
              >
                {t("residents.table.phone")}
              </Typography>
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {row.phone}
              </Typography>
            </div>

            <div className="space-y-1">
              <Typography
                variant="small"
                color="blue-gray"
                className="text-[11px] font-medium uppercase dark:text-gray-400"
              >
                {t("residents.table.apartment")}
              </Typography>
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {row.apartment}
              </Typography>
            </div>

            <div className="space-y-1">
              <Typography
                variant="small"
                color="blue-gray"
                className="text-[11px] font-medium uppercase dark:text-gray-400"
              >
                {t("residents.table.type")}
              </Typography>
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300 font-semibold">
                {row.type === "physical" ? t("residents.detail.physicalPerson") : t("residents.detail.legalEntity")}
              </Typography>
            </div>

            <div className="space-y-1">
              <Typography
                variant="small"
                color="blue-gray"
                className="text-[11px] font-medium uppercase dark:text-gray-400"
              >
                {t("residents.table.finOrVoen")}
              </Typography>
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {row.type === "physical" ? row.fin : row.voen}
              </Typography>
            </div>

            <div className="space-y-1">
              <Typography
                variant="small"
                color="blue-gray"
                className="text-[11px] font-medium uppercase dark:text-gray-400"
              >
                {t("residents.table.status")}
              </Typography>
              <Typography
                variant="small"
                color={row.status === "Aktiv" ? "green" : "red"}
                className={`font-semibold ${row.status === "Aktiv" ? "dark:text-green-300" : "dark:text-red-400"}`}
              >
                {row.status}
              </Typography>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

