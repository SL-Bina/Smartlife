import React, { useMemo, useState } from "react";
import {
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

function compare(a, b, dir = "asc") {
  const order = dir === "asc" ? 1 : -1;

  const va = a ?? "";
  const vb = b ?? "";

  const na = typeof va === "number" ? va : Number(va);
  const nb = typeof vb === "number" ? vb : Number(vb);
  const bothNumeric = Number.isFinite(na) && Number.isFinite(nb) && va !== "" && vb !== "";

  if (bothNumeric) return (na - nb) * order;

  return String(va).localeCompare(String(vb), undefined, {
    sensitivity: "base",
    numeric: true,
  }) * order;
}

export function ComplexTable({ complexes, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  const [sort, setSort] = useState({ key: null, dir: "asc" });

  const toggleSort = (key) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return { key: null, dir: "asc" };
    });
  };

  const sortedComplexes = useMemo(() => {
    if (!complexes || complexes.length === 0) return [];
    if (!sort.key) return complexes;

    const list = [...complexes];

    list.sort((a, b) => {
      switch (sort.key) {
        case "id":
          return compare(a.id, b.id, sort.dir);
        case "name":
          return compare(a.name, b.name, sort.dir);
        case "address":
          return compare(a?.meta?.address, b?.meta?.address, sort.dir);
        case "buildingsCount":
          return compare(a?.buildings?.length || 0, b?.buildings?.length || 0, sort.dir);
        default:
          return 0;
      }
    });

    return list;
  }, [complexes, sort]);

  const SortIcon = ({ active, dir }) => (
    <span className={`ml-2 inline-block text-[10px] ${active ? "opacity-100" : "opacity-40"}`}>
      {active ? (dir === "asc" ? "▲" : "▼") : "↕"}
    </span>
  );

  const Th = ({ label, sortKey, right = false }) => {
    const active = sort.key === sortKey;
    return (
      <th
        onClick={() => toggleSort(sortKey)}
        className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 ${
          right ? "text-right" : "text-left"
        } cursor-pointer select-none`}
        title={t("common.sort") || "Sort"}
      >
        <Typography
          variant="small"
          className={`text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400 inline-flex items-center ${
            right ? "justify-end w-full" : ""
          }`}
        >
          {label}
          <SortIcon active={active} dir={sort.dir} />
        </Typography>
      </th>
    );
  };

  if (!complexes || complexes.length === 0) return null;

  return (
    <div className="hidden lg:block">
      <table className="w-full table-auto">
        <thead>
          <tr>
            <Th label={t("complexes.table.id")} sortKey="id" />
            <Th label={t("complexes.table.name")} sortKey="name" />
            <Th label={t("complexes.table.address")} sortKey="address" />
            <Th label={t("complexes.table.buildingsCount")} sortKey="buildingsCount" />
            <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-right">
              <Typography
                variant="small"
                className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400"
              >
                {t("complexes.table.actions")}
              </Typography>
            </th>
          </tr>
        </thead>

        <tbody>
          {sortedComplexes.map((row, key) => {
            const className = `py-3 px-6 ${
              key === sortedComplexes.length - 1
                ? ""
                : "border-b border-blue-gray-50 dark:border-gray-800"
            }`;

            return (
              <tr key={row.id} className="dark:hover:bg-gray-700/50">
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
                      <IconButton
                        size="sm"
                        variant="text"
                        color="blue-gray"
                        className="dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                      </IconButton>
                    </MenuHandler>

                    <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                      {onView && (
                        <MenuItem
                          onClick={() => onView(row)}
                          className="dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          {t("complexes.actions.view")}
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={() => onEdit(row)}
                        className="dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        {t("complexes.actions.edit")}
                      </MenuItem>
                      <MenuItem
                        onClick={() => onDelete(row)}
                        className="dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        {t("complexes.actions.delete")}
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
