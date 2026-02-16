import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem, Tooltip } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ChevronUpIcon, ChevronDownIcon, PencilIcon, TrashIcon, GlobeAltIcon, MapPinIcon, EnvelopeIcon, PhoneIcon, BuildingOffice2Icon, HomeModernIcon } from "@heroicons/react/24/outline";

const DEFAULT_COLOR = "#dc2626";

export function ComplexTable({ items = [], loading, onEdit, onDelete, onGoToBuildings, onSelect, selectedComplexId }) {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

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
                  MTK
                </Typography>
              </th>
              <th className="px-6 py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Ünvan
                </Typography>
              </th>
              <th className="px-6 py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Əlaqə
                </Typography>
              </th>
              <th className="px-6 py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Website
                </Typography>
              </th>
              <th className="px-6 py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Binalar
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
              const itemColorCode = item.meta?.color_code || DEFAULT_COLOR;
              const hoverColor = getRgbaColor(itemColorCode, 0.08);
              const buildingsCount = item.buildings?.length || 0;
              
              return (
                <tr
                  key={item.id ?? `complex-${index}`}
                  className="transition-all duration-200 cursor-pointer"
                  onClick={() => onSelect?.(item)}
                  onMouseEnter={(e) => {
                    if (hoverColor) {
                      e.currentTarget.style.backgroundColor = hoverColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '';
                  }}
                  style={{
                    ...(selectedComplexId === item.id && itemColorCode ? { 
                      backgroundColor: getRgbaColor(itemColorCode, 0.15),
                    } : {}),
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold font-mono"
                      style={{
                        backgroundColor: item.meta?.color_code ? getRgbaColor(item.meta.color_code, 0.1) : 'rgba(0, 0, 0, 0.05)',
                        color: item.meta?.color_code || '#6b7280',
                      }}
                    >
                      #{item.id ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.meta?.color_code && (
                        <Tooltip content={item.meta.color_code}>
                          <div
                            className="w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 shadow-sm flex-shrink-0"
                            style={{ backgroundColor: item.meta.color_code }}
                          />
                        </Tooltip>
                      )}
                      <div className="min-w-0">
                        <Typography variant="small" className="font-semibold text-gray-900 dark:text-gray-100">
                          {item.name ?? "—"}
                        </Typography>
                        {item.meta?.desc && (
                          <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 truncate max-w-[200px]">
                            {item.meta.desc}
                          </Typography>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.bind_mtk ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                        {item.bind_mtk.name || `MTK #${item.bind_mtk.id}`}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {item.meta?.address ? (
                      <div className="flex items-start gap-2 max-w-[250px]">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <Typography variant="small" className="text-gray-700 dark:text-gray-300 line-clamp-2">
                          {item.meta.address}
                        </Typography>
                      </div>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      {item.meta?.phone && (
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                            {item.meta.phone}
                          </Typography>
                        </div>
                      )}
                      {item.meta?.email && (
                        <div className="flex items-center gap-2">
                          <EnvelopeIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <Typography variant="small" className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                            {item.meta.email}
                          </Typography>
                        </div>
                      )}
                      {!item.meta?.phone && !item.meta?.email && (
                        <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                          —
                        </Typography>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.meta?.website ? (
                      <a
                        href={item.meta.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors max-w-[200px]"
                      >
                        <GlobeAltIcon className="h-4 w-4 flex-shrink-0" />
                        <Typography variant="small" className="truncate">
                          {item.meta.website.replace(/^https?:\/\//, '')}
                        </Typography>
                      </a>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onGoToBuildings?.(item.id);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <HomeModernIcon className="h-3.5 w-3.5" />
                      {buildingsCount} bina
                    </button>
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
                            onDelete?.(item);
                          }} 
                          className="flex items-center gap-2 text-red-600 dark:text-red-400"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Sil
                        </MenuItem>
                        <MenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            onGoToBuildings?.(item.id);
                          }} 
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
                        >
                          <HomeModernIcon className="h-4 w-4" />
                          Binalara keç
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
