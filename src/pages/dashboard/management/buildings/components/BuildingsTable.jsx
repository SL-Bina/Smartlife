import React from "react";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function BuildingsTable({ buildings, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full table-auto min-w-[800px]">
        <thead>
          <tr>
            {[
              t("buildings.table.id") || "ID",
              t("buildings.table.name") || "Ad",
              t("buildings.table.complex") || "Kompleks",
              t("buildings.table.description") || "Təsvir",
              t("buildings.table.status") || "Status",
              t("buildings.table.actions") || "Əməliyyatlar",
            ].map((el, idx) => (
              <th
                key={idx}
                className={`border-b border-blue-gray-100 dark:border-gray-800 py-4 px-6 text-left ${
                  idx === 5 ? "text-right" : ""
                }`}
              >
                <Typography
                  variant="small"
                  className="text-[11px] font-bold uppercase text-blue-gray-400 dark:text-gray-400"
                >
                  {el}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {buildings.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-8 text-center">
                <Typography variant="small" color="blue-gray" className="dark:text-gray-400">
                  {t("buildings.table.noData") || "Məlumat yoxdur"}
                </Typography>
              </td>
            </tr>
          ) : (
            buildings.map((row, key) => {
              const className = `py-4 px-6 ${
                key === buildings.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
              }`;
              return (
                <tr key={row.id} className="dark:hover:bg-gray-700/50 transition-colors">
                  <td className={className}>
                    <Typography variant="small" color="blue-gray" className="font-medium dark:text-gray-300">
                      #{row.id}
                    </Typography>
                  </td>
                  <td className={className}>
                    <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                      {row.name || "-"}
                    </Typography>
                  </td>
                  <td className={className}>
                    <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                      {row.complex?.name || "-"}
                    </Typography>
                  </td>
                  <td className={className}>
                    <Typography 
                      variant="small" 
                      color="blue-gray" 
                      className="dark:text-gray-300 max-w-xs truncate"
                      title={row.meta?.desc || ""}
                    >
                      {row.meta?.desc || "-"}
                    </Typography>
                  </td>
                  <td className={className}>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        row.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {row.status === "active" ? (t("buildings.status.active") || "Aktiv") : (t("buildings.status.inactive") || "Passiv")}
                    </span>
                  </td>
                  <td className={`${className} text-right`}>
                    <Menu placement="left-start">
                      <MenuHandler>
                        <IconButton
                          size="sm"
                          variant="text"
                          color="blue-gray"
                          className="dark:text-gray-300 dark:hover:bg-gray-700"
                        >
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
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

