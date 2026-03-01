import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem, Tooltip, Button } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ChevronUpIcon, ChevronDownIcon, PencilIcon, TrashIcon, CheckCircleIcon, GlobeAltIcon, MapPinIcon, EnvelopeIcon, PhoneIcon, BuildingOffice2Icon, EyeIcon } from "@heroicons/react/24/outline";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";
import { useMtkColor } from "@/store/exports";

const DEFAULT_COLOR = "#dc2626";

export function MtkTable({ items = [], loading, onView, onEdit, onDelete, onSelect, selectedMtkId }) {
  const navigate = useNavigate();
  const [controller] = useMaterialTailwindController();
  const { colorCode, getRgba } = useMtkColor();
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
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 relative z-0">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left"><div className="h-3 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left"><div className="h-3 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left"><div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left"><div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left"><div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left"><div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left"><div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left"><div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} style={{ opacity: 1 - (i / 3) * 0.9 }}>
                  {/* Seç */}
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 xl:w-6 xl:h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    </div>
                  </td>
                  {/* ID */}
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap">
                    <div className="h-6 w-12 bg-gray-100 dark:bg-gray-700 rounded-md animate-pulse" />
                  </td>
                  {/* Ad */}
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${60 + (i % 5) * 15}px` }} />
                    </div>
                  </td>
                  {/* Ünvan */}
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${80 + (i % 4) * 20}px` }} />
                  </td>
                  {/* Əlaqə */}
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-3.5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </td>
                  {/* Website */}
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${70 + (i % 3) * 15}px` }} />
                  </td>
                  {/* Status */}
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap">
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  </td>
                  {/* Əməliyyatlar */}
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap">
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
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 relative z-0">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Seç
                </Typography>
              </th>
              <th
                className="px-4 xl:px-6 py-3 xl:py-4 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors"
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
                className="px-4 xl:px-6 py-3 xl:py-4 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-2">
                  <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                    Ad
                  </Typography>
                  <SortIcon columnKey="name" />
                </div>
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Ünvan
                </Typography>
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Əlaqə
                </Typography>
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Website
                </Typography>
              </th>
              <th
                className="px-4 xl:px-6 py-3 xl:py-4 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                    Status
                  </Typography>
                  <SortIcon columnKey="status" />
                </div>
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Əməliyyatlar
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedItems.map((item, index) => {
              const itemColorCode = item.meta?.color_code || DEFAULT_COLOR;
              const isSelected = selectedMtkId === item.id;
              const hoverColor = getRgbaColor(itemColorCode, 0.08);
              
              return (
                <tr
                  key={item.id ?? `mtk-${index}`}
                  className={`transition-all duration-200 cursor-pointer ${
                    isSelected ? "ring-2 ring-offset-2" : ""
                  }`}
                  onClick={() => onSelect?.(item)}
                  style={{
                    ...(isSelected && colorCode ? { 
                      backgroundColor: getRgba(colorCode, 0.08),
                      ringColor: colorCode,
                    } : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (hoverColor && !isSelected) {
                      e.currentTarget.style.backgroundColor = hoverColor;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected || !colorCode) {
                      e.currentTarget.style.backgroundColor = '';
                    } else {
                      e.currentTarget.style.backgroundColor = getRgba(colorCode, 0.08);
                    }
                  }}
                >
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect?.(item);
                        }}
                        className={`w-5 h-5 xl:w-6 xl:h-6 rounded-full flex items-center justify-center transition-all ${
                          isSelected 
                            ? "bg-current text-white shadow-md" 
                            : "bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                        style={isSelected && colorCode ? { backgroundColor: colorCode } : {}}
                      >
                        {isSelected && (
                          <CheckCircleIcon className="h-3 w-3 xl:h-4 xl:w-4 text-white" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap">
                    <span
                      className="inline-flex items-center px-2 xl:px-2.5 py-0.5 xl:py-1 rounded-md text-xs font-semibold font-mono"
                      style={{
                        backgroundColor: item.meta?.color_code ? getRgbaColor(item.meta.color_code, 0.1) : 'rgba(0, 0, 0, 0.05)',
                        color: item.meta?.color_code || '#6b7280',
                      }}
                    >
                      #{item.id ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <div className="flex items-center gap-2 xl:gap-3">
                      {item.meta?.color_code && (
                        <Tooltip content={item.meta.color_code}>
                          <div
                            className="w-2.5 h-2.5 xl:w-3 xl:h-3 rounded-full border-2 border-white dark:border-gray-800 shadow-sm flex-shrink-0"
                            style={{ backgroundColor: item.meta.color_code }}
                          />
                        </Tooltip>
                      )}
                      <div className="min-w-0">
                        <Typography variant="small" className="font-semibold text-gray-900 dark:text-gray-100 text-xs xl:text-sm">
                          {item.name ?? "—"}
                        </Typography>
                        {item.meta?.desc && (
                          <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 truncate max-w-[150px] xl:max-w-[200px]">
                            {item.meta.desc}
                          </Typography>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    {item.meta?.address ? (
                      <div className="flex items-start gap-2 max-w-[200px] xl:max-w-[250px]">
                        <MapPinIcon className="h-3.5 w-3.5 xl:h-4 xl:w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <Typography variant="small" className="text-gray-700 dark:text-gray-300 line-clamp-2 text-xs xl:text-sm">
                          {item.meta.address}
                        </Typography>
                      </div>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs xl:text-sm">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <div className="space-y-1 xl:space-y-1.5">
                      {item.meta?.phone && (
                        <div className="flex items-center gap-1.5 xl:gap-2">
                          <PhoneIcon className="h-3.5 w-3.5 xl:h-4 xl:w-4 text-gray-400 flex-shrink-0" />
                          <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-xs xl:text-sm">
                            {item.meta.phone}
                          </Typography>
                        </div>
                      )}
                      {item.meta?.email && (
                        <div className="flex items-center gap-1.5 xl:gap-2">
                          <EnvelopeIcon className="h-3.5 w-3.5 xl:h-4 xl:w-4 text-gray-400 flex-shrink-0" />
                          <Typography variant="small" className="text-gray-700 dark:text-gray-300 truncate max-w-[150px] xl:max-w-[200px] text-xs xl:text-sm">
                            {item.meta.email}
                          </Typography>
                        </div>
                      )}
                      {!item.meta?.phone && !item.meta?.email && (
                        <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs xl:text-sm">
                          —
                        </Typography>
                      )}
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    {item.meta?.website ? (
                      <a
                        href={item.meta.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 xl:gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors max-w-[150px] xl:max-w-[200px]"
                      >
                        <GlobeAltIcon className="h-3.5 w-3.5 xl:h-4 xl:w-4 flex-shrink-0" />
                        <Typography variant="small" className="truncate text-xs xl:text-sm">
                          {item.meta.website.replace(/^https?:\/\//, '')}
                        </Typography>
                      </a>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs xl:text-sm">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 xl:px-2.5 py-0.5 xl:py-1 rounded-full text-xs font-semibold ${
                        item.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {item.status === "active" ? "Aktiv" : "Qeyri-aktiv"}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <Menu placement="bottom-end">
                      <MenuHandler>
                        <IconButton 
                          variant="text" 
                          size="sm" 
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <EllipsisVerticalIcon className="h-4 w-4 xl:h-5 xl:w-5" />
                        </IconButton>
                      </MenuHandler>
                      <MenuList className="min-w-[160px] !z-[9999]">
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
                            onSelect?.(item);
                          }} 
                          className="flex items-center gap-2"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          Seç
                        </MenuItem>
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
                            navigate(`/dashboard/management/complexes?mtk_id=${item.id}`);
                          }} 
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
                        >
                          <BuildingOffice2Icon className="h-4 w-4" />
                          Complexlərə keç
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

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-3 p-3 sm:p-4">
        {sortedItems.map((item, index) => {
          const itemColorCode = item.meta?.color_code || DEFAULT_COLOR;
          const isSelected = selectedMtkId === item.id;
          
          return (
            <Card
              key={item.id ?? `mtk-${index}`}
              className={`transition-all duration-200 cursor-pointer ${
                isSelected ? "ring-2 ring-offset-2" : ""
              }`}
              onClick={() => onSelect?.(item)}
              style={{
                ...(isSelected && colorCode ? { 
                  backgroundColor: getRgba(colorCode, 0.08),
                  ringColor: colorCode,
                } : {}),
              }}
            >
              <CardBody className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect?.(item);
                      }}
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected 
                          ? "bg-current text-white shadow-md" 
                          : "bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                      style={isSelected && colorCode ? { backgroundColor: colorCode } : {}}
                    >
                      {isSelected && (
                        <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      )}
                    </button>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {item.meta?.color_code && (
                        <div
                          className="w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 shadow-sm flex-shrink-0"
                          style={{ backgroundColor: item.meta.color_code }}
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <Typography variant="small" className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                          {item.name ?? "—"}
                        </Typography>
                        {item.meta?.desc && (
                          <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 line-clamp-1">
                            {item.meta.desc}
                          </Typography>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                        item.status === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {item.status === "active" ? "Aktiv" : "Qeyri-aktiv"}
                    </span>
                    <Menu placement="bottom-end">
                      <MenuHandler>
                        <IconButton 
                          variant="text" 
                          size="sm" 
                          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <EllipsisVerticalIcon className="h-5 w-5" />
                        </IconButton>
                      </MenuHandler>
                      <MenuList className="min-w-[160px] !z-[9999]">
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
                            onSelect?.(item);
                          }} 
                          className="flex items-center gap-2"
                        >
                          <CheckCircleIcon className="h-4 w-4" />
                          Seç
                        </MenuItem>
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
                            navigate(`/dashboard/management/complexes?mtk_id=${item.id}`);
                          }} 
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
                        >
                          <BuildingOffice2Icon className="h-4 w-4" />
                          Complexlərə keç
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold font-mono flex-shrink-0"
                      style={{
                        backgroundColor: item.meta?.color_code ? getRgbaColor(item.meta.color_code, 0.1) : 'rgba(0, 0, 0, 0.05)',
                        color: item.meta?.color_code || '#6b7280',
                      }}
                    >
                      ID: #{item.id ?? "—"}
                    </span>
                  </div>

                  {item.meta?.address && (
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm line-clamp-2">
                        {item.meta.address}
                      </Typography>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {item.meta?.phone && (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
                          {item.meta.phone}
                        </Typography>
                      </div>
                    )}
                    {item.meta?.email && (
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm truncate">
                          {item.meta.email}
                        </Typography>
                      </div>
                    )}
                    {item.meta?.website && (
                      <a
                        href={item.meta.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
                      >
                        <GlobeAltIcon className="h-4 w-4 flex-shrink-0" />
                        <Typography variant="small" className="text-xs sm:text-sm truncate">
                          {item.meta.website.replace(/^https?:\/\//, '')}
                        </Typography>
                      </a>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
