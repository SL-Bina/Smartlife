import React from "react";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ResidentsTable({ residents, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block">
      <table className="w-full table-auto">
        <thead>
          <tr>
            {[
              t("residents.table.id"),
              t("residents.table.fullName"),
              t("residents.table.phone"),
              t("residents.table.email"),
              t("residents.table.apartment"),
              t("residents.table.type"),
              t("residents.table.finOrVoen"),
              t("residents.table.status"),
              t("residents.table.actions"),
            ].map((el, idx) => (
              <th
                key={el}
                className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${
                  idx === 8 ? "text-right" : ""
                }`}
              >
                <Typography
                  variant="small"
                  className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400"
                >
                  {el}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {residents.map((row, key) => {
            const className = `py-3 px-6 ${
              key === residents.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
            }`;
            return (
              <tr
                key={row.id}
                className="dark:hover:bg-gray-700/50 cursor-pointer"
                onClick={() => onView(row)}
              >
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.id}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(row);
                    }}
                  >
                    {row.fullName}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.phone}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.email}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.apartment}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300 font-semibold">
                    {row.type === "physical" ? t("residents.detail.physicalPerson") : t("residents.detail.legalEntity")}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.type === "physical" ? row.fin : row.voen}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography
                    variant="small"
                    color={row.status === "Aktiv" ? "green" : "red"}
                    className={row.status === "Aktiv" ? "dark:text-green-300" : "dark:text-red-400"}
                  >
                    {row.status}
                  </Typography>
                </td>
                <td className={`${className} text-right`}>
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

