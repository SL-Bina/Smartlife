import React, { useState, useMemo } from "react";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ChevronUpIcon, ChevronDownIcon, PencilIcon, TrashIcon, CurrencyDollarIcon, EyeIcon } from "@heroicons/react/24/outline";

export function PropertyTable({ items = [], loading, onView, onEdit, onDelete, onServiceFee, onSelect, selectedPropertyId }) {
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
      <div className="hidden lg:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
                <th className="px-6 py-4 text-left"><div className="h-3 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-6 py-4 text-left"><div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-6 py-4 text-left"><div className="h-3 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-6 py-4 text-left"><div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-6 py-4 text-left"><div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-6 py-4 text-left"><div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-6 py-4 text-left"><div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-6 py-4 text-left"><div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-6 py-4 text-left"><div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-6 py-4 text-left"><div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-6 py-4 text-left"><div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 20 }).map((_, i) => (
                <tr key={i} className="transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 w-12 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${60 + (i % 5) * 12}px` }} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${70 + (i % 4) * 10}px` }} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${80 + (i % 3) * 15}px` }} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${65 + (i % 4) * 12}px` }} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${50 + (i % 3) * 10}px` }} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 w-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    <div className="hidden lg:block bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
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
                  MTK
                </Typography>
              </th>
              <th className="px-6 py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Complex
                </Typography>
              </th>
              <th className="px-6 py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Building
                </Typography>
              </th>
              <th className="px-6 py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Block
                </Typography>
              </th>
              <th className="px-6 py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Mənzil №
                </Typography>
              </th>
              <th className="px-6 py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Mərtəbə
                </Typography>
              </th>
              <th className="px-6 py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Sahə (m²)
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
                  key={item.id ?? `property-${index}`}
                  className="transition-all duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  onClick={() => onSelect?.(item)}
                  style={{
                    ...(selectedPropertyId === item.id ? { 
                      backgroundColor: 'rgba(20, 184, 166, 0.15)', 
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
                    {item.sub_data?.mtk ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                        {item.sub_data.mtk.name || `MTK #${item.sub_data.mtk.id}`}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {item.sub_data?.complex ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                        {item.sub_data.complex.name || `Complex #${item.sub_data.complex.id}`}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {item.sub_data?.building ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                        {item.sub_data.building.name || `Building #${item.sub_data.building.id}`}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {item.sub_data?.block ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                        {item.sub_data.block.name || `Block #${item.sub_data.block.id}`}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.meta?.apartment_number ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                        {item.meta.apartment_number}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.meta?.floor ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                        {item.meta.floor}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.meta?.area ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                        {item.meta.area} m²
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
                        {onView && (
                          <MenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              onView?.(item);
                            }} 
                            className="flex items-center gap-2"
                          >
                            <EyeIcon className="h-4 w-4" />
                            Bax
                          </MenuItem>
                        )}
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
                            onServiceFee?.(item);
                          }} 
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
                        >
                          <CurrencyDollarIcon className="h-4 w-4" />
                          Servis haqqı
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

