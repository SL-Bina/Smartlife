import React from "react";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ServicesTable({ services = [], onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("az-AZ", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="w-full min-w-max table-auto">
        <thead>
          <tr className="bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-200/50 dark:border-gray-700/50">
            {[
              t("services.table.id") || "ID",
              t("services.table.name") || "Ad",
              t("services.table.description") || "Təsvir",
              t("services.table.price") || "Qiymət",
              t("services.table.complex") || "Kompleks",
              t("services.table.createdAt") || "Yaradılma",
              t("services.table.updatedAt") || "Yenilənmə",
              t("services.table.actions") || "Əməliyyatlar",
            ].map((el, idx) => (
              <th
                key={idx}
                className={`px-4 xl:px-6 py-3 xl:py-4 text-left ${idx === 7 ? "text-right" : ""}`}
              >
                <Typography variant="small" className="text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wide">
                  {el}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {(Array.isArray(services) ? services : []).map((row, key) => {
            const className = `px-4 xl:px-6 py-3 xl:py-4`;
            const complexName = row?.complex?.name || "—";

            return (
              <tr key={row?.id ?? key} className="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors">
                <td className={className}>
                  <span className="inline-flex items-center justify-center h-6 px-2 rounded-md bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300">
                    #{row?.id ?? "—"}
                  </span>
                </td>

                <td className={className}>
                  <Typography variant="small" className="font-semibold dark:text-white">
                    {row?.name || "—"}
                  </Typography>
                </td>

                <td className={className}>
                  <Typography variant="small" className="dark:text-gray-300 max-w-md truncate">
                    {row?.description || "-"}
                  </Typography>
                </td>

                <td className={className}>
                  <Typography variant="small" className="font-semibold dark:text-white">
                    {Number(row?.price ?? 0).toFixed(2)} ₼
                  </Typography>
                </td>

                <td className={className}>
                  <Typography variant="small" className="dark:text-gray-300">
                    {complexName}
                  </Typography>
                </td>

                <td className={className}>
                  <Typography variant="small" className="dark:text-gray-300">
                    {formatDate(row?.created_at)}
                  </Typography>
                </td>

                <td className={className}>
                  <Typography variant="small" className="dark:text-gray-300">
                    {formatDate(row?.updated_at)}
                  </Typography>
                </td>

                <td className={`${className} text-right`}>
                  <Menu placement="left-start">
                    <MenuHandler>
                      <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                        <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                      </IconButton>
                    </MenuHandler>
                    <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                      {onView && (
                        <MenuItem onClick={() => onView(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                          {t("services.actions.view") || "Bax"}
                        </MenuItem>
                      )}
                      <MenuItem onClick={() => onEdit?.(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("services.actions.edit") || "Dəyiş"}
                      </MenuItem>
                      <MenuItem onClick={() => onDelete?.(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                        {t("services.actions.delete") || "Sil"}
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
