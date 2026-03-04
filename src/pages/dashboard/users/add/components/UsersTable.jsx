import React, { useState, useMemo } from "react";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ChevronUpIcon, ChevronDownIcon, EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { UsersTableSkeleton } from "./UsersTableSkeleton";

function SortIcons({ colKey, sortConfig }) {
  return (
    <div className="flex flex-col">
      <ChevronUpIcon className={`h-3 w-3 ${sortConfig?.key === colKey && sortConfig?.direction === "asc" ? "text-red-500" : "text-gray-400"}`} />
      <ChevronDownIcon className={`h-3 w-3 -mt-1 ${sortConfig?.key === colKey && sortConfig?.direction === "desc" ? "text-red-500" : "text-gray-400"}`} />
    </div>
  );
}

function ThSort({ label, colKey, sortConfig, onSort }) {
  return (
    <th
      onClick={colKey ? () => onSort(colKey) : undefined}
      className={`px-4 xl:px-6 py-3 text-left ${colKey ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors" : ""}`}
    >
      <div className="flex items-center gap-1.5">
        <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
          {label}
        </Typography>
        {colKey && <SortIcons colKey={colKey} sortConfig={sortConfig} />}
      </div>
    </th>
  );
}

export function UsersTable({ items = [], loading, onView, onEdit, onDelete }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return items;
    return [...items].sort((a, b) => {
      let aValue, bValue;
      switch (sortConfig.key) {
        case "id": aValue = a.id; bValue = b.id; break;
        case "name": aValue = (a.name || "").toLowerCase(); bValue = (b.name || "").toLowerCase(); break;
        case "username": aValue = (a.username || "").toLowerCase(); bValue = (b.username || "").toLowerCase(); break;
        case "email": aValue = (a.email || "").toLowerCase(); bValue = (b.email || "").toLowerCase(); break;
        case "phone": aValue = (a.phone || "").toLowerCase(); bValue = (b.phone || "").toLowerCase(); break;
        default: return 0;
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig]);

  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
        <UsersTableSkeleton rows={8} />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return null;
  }

  const COLS = [
    { label: "ID", key: "id" },
    { label: "Ad", key: "name" },
    { label: "İstifadəçi adı", key: "username" },
    { label: "Email", key: "email" },
    { label: "Telefon", key: "phone" },
    { label: "Rol", key: null },
    { label: "Əməliyyatlar", key: null },
  ];

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
              {COLS.map((col) => (
                <ThSort
                  key={col.label}
                  label={col.label}
                  colKey={col.key}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedItems.map((item, index) => (
              <tr
                key={item?.id ?? `user-${index}`}
                className="transition-all duration-200 hover:bg-red-50/40 dark:hover:bg-red-900/10"
              >
                <td className="px-4 xl:px-6 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold font-mono bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300">
                    #{item.id ?? "—"}
                  </span>
                </td>
                <td className="px-4 xl:px-6 py-3">
                  <Typography variant="small" className="font-semibold text-gray-900 dark:text-gray-100 text-xs xl:text-sm">
                    {item.name || "—"}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-xs xl:text-sm font-mono">
                    {item.username || "—"}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3">
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400 text-xs xl:text-sm">
                    {item.email || "—"}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3">
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400 text-xs xl:text-sm">
                    {item.phone || "—"}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3">
                  {item.role?.name ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {item.role.name}
                    </span>
                  ) : (
                    <Typography variant="small" className="text-gray-400 text-xs">—</Typography>
                  )}
                </td>
                <td className="px-4 xl:px-6 py-3" onClick={(e) => e.stopPropagation()}>
                  <Menu placement="bottom-end">
                    <MenuHandler>
                      <IconButton variant="text" size="sm" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <EllipsisVerticalIcon className="h-4 w-4 xl:h-5 xl:w-5" />
                      </IconButton>
                    </MenuHandler>
                    <MenuList className="min-w-[160px] !z-[9999] dark:bg-gray-800 dark:border-gray-700">
                      {onView && (
                        <MenuItem onClick={() => onView(item)} className="flex items-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                          <EyeIcon className="h-4 w-4" />
                          Bax
                        </MenuItem>
                      )}
                      <MenuItem onClick={() => onEdit?.(item)} className="flex items-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700">
                        <PencilIcon className="h-4 w-4" />
                        Redaktə et
                      </MenuItem>
                      <MenuItem onClick={() => onDelete?.(item)} className="flex items-center gap-2 text-red-600 dark:text-red-400 dark:hover:bg-gray-700">
                        <TrashIcon className="h-4 w-4" />
                        Sil
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
