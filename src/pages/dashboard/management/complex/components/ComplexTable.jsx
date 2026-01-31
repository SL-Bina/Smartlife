import React from "react";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ComplexTable({ complexes, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  if (!complexes || complexes.length === 0) return null;

  return (
    <div className="hidden lg:block">
      <table className="w-full table-auto">
        <thead>
          <tr>
            {[t("complexes.table.id"), t("complexes.table.name"), t("complexes.table.address"), t("complexes.table.buildingsCount"), t("complexes.table.actions")].map(
              (el, idx) => (
                <th
                  key={el}
                  className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${
                    idx === 4 ? "text-right" : ""
                  }`}
                >
                  <Typography
                    variant="small"
                    className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400"
                  >
                    {el}
                  </Typography>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {complexes.map((row, key) => {
            const className = `py-3 px-6 ${
              key === complexes.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
            }`;
            return (
              <tr key={row.id} className="dark:hover:bg-gray-700/50">
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.id}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-semibold dark:text-white"
                  >
                    {row.name}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.meta?.address || "-"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.buildings?.length || 0}
                  </Typography>
                </td>
                <td className={`${className} text-right`}>
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
