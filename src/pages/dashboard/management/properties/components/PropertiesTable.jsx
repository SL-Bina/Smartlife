import React, { useMemo } from "react";
import {
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Chip,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/**
 * Props:
 * - properties: array (raw list, məsələn apartments list)
 *   expected fields: { id, name, floor, block, area, status, ... }
 * - onView(property)
 * - onEdit(property)
 * - onDelete(property)
 * - sortConfig: { key, direction } | null
 * - onSortChange({ key, direction })
 */
export function PropertiesTable({
  properties = [],
  onView,
  onEdit,
  onDelete,
  sortConfig,
  onSortChange,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const openFeePage = (apartment) => {
    navigate(`/dashboard/management/service-fee/${apartment.id}`);
  };

  const statusColor = (s) => (s === "active" ? "green" : "gray");

  const columns = useMemo(
    () => [
      { key: "id", label: t("properties.table.id") || "ID", sortable: true },
      { key: "name", label: t("properties.table.name") || "Ad", sortable: true },
      { key: "floor", label: t("properties.table.floor") || "Mərtəbə", sortable: true },
      { key: "block", label: t("properties.table.block") || "Blok", sortable: true },
      { key: "area", label: t("properties.table.area") || "Sahə", sortable: true },
      { key: "status", label: t("properties.table.status") || "Status", sortable: true },
      { key: "actions", label: t("properties.table.actions") || "Əməliyyatlar", sortable: false },
    ],
    [t]
  );

  const handleSort = (key) => {
    if (!columns.find((c) => c.key === key)?.sortable) return;

    let direction = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc") direction = "desc";
    onSortChange?.({ key, direction });
  };

  // Optional: local sort fallback (əgər parent sort eləmirsə)
  const sortedData = useMemo(() => {
    if (!sortConfig?.key) return properties;

    const { key, direction } = sortConfig;
    const dir = direction === "desc" ? -1 : 1;

    const getVal = (row) => {
      const v = row?.[key];
      if (v == null) return "";
      return typeof v === "string" ? v.toLowerCase() : v;
    };

    return [...properties].sort((a, b) => {
      const av = getVal(a);
      const bv = getVal(b);
      if (av > bv) return 1 * dir;
      if (av < bv) return -1 * dir;
      return 0;
    });
  }, [properties, sortConfig]);

  return (
    <div className="hidden lg:block">
      <table className="w-full table-auto">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${
                  idx === columns.length - 1 ? "text-right" : ""
                } ${col.sortable ? "cursor-pointer hover:bg-blue-gray-50 dark:hover:bg-gray-700 transition-colors" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <Typography
                    variant="small"
                    className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400"
                  >
                    {col.label}
                  </Typography>

                  {col.sortable && (
                    <div className="flex flex-col">
                      <ArrowUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === col.key && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ArrowDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === col.key && sortConfig?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row, idx) => {
            const tdClass = `py-3 px-6 ${
              idx === sortedData.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
            }`;

            return (
              <tr key={row.id} className="dark:hover:bg-gray-700/50">
                <td className={tdClass}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.id}
                  </Typography>
                </td>

                <td className={tdClass}>
                  <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                    {row.name || "-"}
                  </Typography>
                </td>

                <td className={tdClass}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.floor ?? "-"}
                  </Typography>
                </td>

                <td className={tdClass}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.block ?? "-"}
                  </Typography>
                </td>

                <td className={tdClass}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.area != null ? `${row.area} m²` : "-"}
                  </Typography>
                </td>

                <td className={tdClass}>
                  <Chip
                    size="sm"
                    value={row.status || "—"}
                    color={statusColor(row.status)}
                    className="text-xs"
                  />
                </td>

                <td className={`${tdClass} text-right`}>
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
                        onClick={() => openFeePage(row)}
                        className="flex items-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <CurrencyDollarIcon className="h-4 w-4" />
                        {t("properties.actions.serviceFee") || "Service fee"}
                      </MenuItem>

                      {onView && (
                        <MenuItem
                          onClick={() => onView(row)}
                          className="flex items-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <EyeIcon className="h-4 w-4" />
                          {t("properties.actions.view") || "Bax"}
                        </MenuItem>
                      )}

                      <MenuItem
                        onClick={() => onEdit?.(row)}
                        className="flex items-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <PencilIcon className="h-4 w-4" />
                        {t("properties.actions.edit") || "Dəyiş"}
                      </MenuItem>

                      <MenuItem
                        onClick={() => onDelete?.(row)}
                        className="flex items-center gap-2 text-red-600 dark:hover:bg-gray-700"
                      >
                        <TrashIcon className="h-4 w-4" />
                        {t("properties.actions.delete") || "Sil"}
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
