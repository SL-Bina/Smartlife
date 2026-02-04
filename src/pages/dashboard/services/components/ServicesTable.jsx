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
    <div className="hidden lg:block">
      <table className="w-full table-auto">
        <thead>
          <tr>
            {[
              t("services.table.id") || "ID",
              t("services.table.name") || "Ad",
              t("services.table.description") || "Təsvir",
              t("services.table.price") || "Qiymət",
              t("services.table.complex") || "Kompleks", // ✅ əlavə
              t("services.table.createdAt") || "Yaradılma",
              t("services.table.updatedAt") || "Yenilənmə",
              t("services.table.actions") || "Əməliyyatlar",
            ].map((el, idx) => (
              <th
                key={idx}
                className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${idx === 7 ? "text-right" : ""}`}
              >
                <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                  {el}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {(Array.isArray(services) ? services : []).map((row, key) => {
            const className = `py-3 px-6 ${key === services.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"}`;

            const complexName = row?.complex?.name || "—";

            return (
              <tr key={row?.id ?? key} className="dark:hover:bg-gray-700/50">
                <td className={className}>
                  <Typography variant="small" className="dark:text-gray-300">
                    {row?.id ?? "—"}
                  </Typography>
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
