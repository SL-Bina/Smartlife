import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ChevronUpIcon, ChevronDownIcon, PencilIcon, TrashIcon, RectangleStackIcon } from "@heroicons/react/24/outline";

export function BuildingTable({ items = [], loading, onEdit, onDelete, onSelect, selectedBuildingId }) {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return items;

    return [...items].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case "id":
          aValue = a.id;
          bValue = b.id;
          break;
        case "name":
          aValue = (a.name || "").toLowerCase();
          bValue = (b.name || "").toLowerCase();
          break;
        case "status":
          aValue = (a.status || "").toLowerCase();
          bValue = (b.status || "").toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUpIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Typography className="text-sm text-gray-500 dark:text-gray-400">
          Yüklənir...
        </Typography>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <Typography className="text-sm text-gray-500 dark:text-gray-400">
          Məlumat tapılmadı
        </Typography>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
              <th
                className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center gap-2">
                  <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                    ID
                  </Typography>
                  <SortIcon columnKey="id" />
                </div>
              </th>
              <th
                className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                    Ad
                  </Typography>
                  <SortIcon columnKey="name" />
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Complex
                </Typography>
              </th>
              <th className="px-6 py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Təsvir
                </Typography>
              </th>
              <th
                className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                    Status
                  </Typography>
                  <SortIcon columnKey="status" />
                </div>
              </th>
              <th className="px-6 py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Əməliyyatlar
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedItems.map((item, index) => {
              return (
                <tr
                  key={item.id ?? `building-${index}`}
                  className="transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => onSelect?.(item)}
                  style={{
                    ...(selectedBuildingId === item.id ? { 
                      backgroundColor: 'rgba(147, 51, 234, 0.15)', // Purple for buildings
                    } : {}),
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      #{item.id ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Typography variant="small" className="font-semibold text-gray-900 dark:text-gray-100">
                      {item.name ?? "—"}
                    </Typography>
                  </td>
                  <td className="px-6 py-4">
                    {item.complex ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                        {item.complex.name || `Complex #${item.complex.id}`}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {item.meta?.desc ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300 line-clamp-2 max-w-[300px]">
                        {item.meta.desc}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {item.status === "active" ? "Aktiv" : "Qeyri-aktiv"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <Menu>
                      <MenuHandler>
                        <IconButton 
                          variant="text" 
                          size="sm" 
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </IconButton>
                      </MenuHandler>
                      <MenuList className="min-w-[160px]">
                        <MenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(item);
                          }} 
                          className="flex items-center gap-2"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Redaktə et
                        </MenuItem>
                        <MenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/management/blocks?building_id=${item.id}`);
                          }} 
                          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400"
                        >
                          <RectangleStackIcon className="h-4 w-4" />
                          Bloklara keç
                        </MenuItem>
                        <MenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(item);
                          }} 
                          className="flex items-center gap-2 text-red-600 dark:text-red-400"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Sil
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
    </div>
  );
}

