import React from "react";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ExpenseTypesTable({ expenseTypes, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "-";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="hidden lg:block overflow-x-auto rounded-lg">
      <table className="w-full table-auto min-w-[800px]">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700">
            {[
              t("expenseTypes.table.id") || "ID",
              t("expenseTypes.table.name") || "Ad",
              t("expenseTypes.table.description") || "Açıqlama",
              t("expenseTypes.table.createdAt") || "Yaradılma",
              t("expenseTypes.table.operations") || "Əməliyyatlar",
            ].map((el, idx) => (
              <th
                key={el}
                className={`py-4 px-6 text-left ${
                  idx === 4 ? "text-right" : ""
                }`}
              >
                <Typography
                  variant="small"
                  className="text-[11px] font-medium uppercase text-blue-gray-700 dark:text-gray-300"
                >
                  {el}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {expenseTypes.map((row, key) => {
            const className = `py-4 px-6 ${
              key === expenseTypes.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
            }`;
            return (
              <tr
                key={row.id}
                onClick={() => onView(row)}
                className={`cursor-pointer transition-colors ${
                  key % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-800/50"
                } hover:bg-blue-50 dark:hover:bg-gray-700/50`}
              >
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.id}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                    {row.name}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.description || "-"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {formatDate(row.createdAt)}
                  </Typography>
                </td>
                <td className={`${className} text-right`} onClick={(e) => e.stopPropagation()}>
                  <Menu placement="left-start" offset={5}>
                    <MenuHandler>
                      <div className="dark:text-gray-300 dark:hover:bg-blue-600/20 hover:bg-blue-100 cursor-pointer p-2 rounded-md text-end" onClick={(e) => e.stopPropagation()}>
                        <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                      </div>
                    </MenuHandler>
                    <MenuList className="dark:bg-gray-800 dark:border-gray-800 z-50">
                      <MenuItem onClick={() => onView(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <EyeIcon className="h-4 w-4" />
                          {t("expenseTypes.actions.view")}
                        </div>
                      </MenuItem>
                      <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <PencilIcon className="h-4 w-4" />
                          {t("expenseTypes.actions.edit")}
                        </div>
                      </MenuItem>
                      <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <TrashIcon className="h-4 w-4" />
                          {t("expenseTypes.actions.delete")}
                        </div>
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

