import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem, Card, CardBody } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ChevronUpIcon, ChevronDownIcon, PencilIcon, TrashIcon, CheckCircleIcon, HomeIcon } from "@heroicons/react/24/outline";

const DEFAULT_COLOR = "#6366f1"; // Indigo for blocks

export function BlockTable({ items = [], loading, onEdit, onDelete, onSelect, selectedBlockId }) {
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
                  Complex
                </Typography>
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Building
                </Typography>
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Mərtəbə sayı
                </Typography>
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Mənzil sayı
                </Typography>
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
              const isSelected = selectedBlockId === item.id;
              
              return (
                <tr
                  key={item.id ?? `block-${index}`}
                  className="transition-all duration-200 cursor-pointer"
                  onClick={() => onSelect?.(item)}
                  style={{
                    ...(isSelected ? {
                      backgroundColor: 'rgba(99, 102, 241, 0.15)', // Indigo for blocks
                    } : {}),
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
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircleIcon className="h-3 w-3 xl:h-4 xl:w-4 text-white" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 xl:px-2.5 py-0.5 xl:py-1 rounded-md text-xs font-semibold font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      #{item.id ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <Typography variant="small" className="font-semibold text-gray-900 dark:text-gray-100 text-xs xl:text-sm">
                      {item.name ?? "—"}
                    </Typography>
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    {item.complex ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-xs xl:text-sm">
                        {item.complex.name || `Complex #${item.complex.id}`}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs xl:text-sm">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    {item.building ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-xs xl:text-sm">
                        {item.building.name || `Building #${item.building.id}`}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs xl:text-sm">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap">
                    {item.meta?.total_floor ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-xs xl:text-sm">
                        {item.meta.total_floor}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs xl:text-sm">
                        —
                      </Typography>
                    )}
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap">
                    {item.meta?.total_apartment ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-xs xl:text-sm">
                        {item.meta.total_apartment}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs xl:text-sm">
                        —
                      </Typography>
                    )}
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
                            navigate(`/dashboard/management/properties?block_id=${item.id}`);
                          }} 
                          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400"
                        >
                          <HomeIcon className="h-4 w-4" />
                          Mənzillərə keç
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

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-3 p-3 sm:p-4">
        {sortedItems.map((item, index) => {
          const isSelected = selectedBlockId === item.id;
          
          return (
            <Card
              key={item.id ?? `block-${index}`}
              className={`transition-all duration-200 cursor-pointer ${
                isSelected ? "ring-2 ring-offset-2 ring-indigo-500" : ""
              }`}
              onClick={() => onSelect?.(item)}
              style={{
                ...(isSelected ? {
                  backgroundColor: 'rgba(99, 102, 241, 0.15)',
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
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <Typography variant="small" className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                        {item.name ?? "—"}
                      </Typography>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mt-1">
                        #{item.id ?? "—"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
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
                            navigate(`/dashboard/management/properties?block_id=${item.id}`);
                          }} 
                          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400"
                        >
                          <HomeIcon className="h-4 w-4" />
                          Mənzillərə keç
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
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3">
                  <div>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                      Complex
                    </Typography>
                    {item.complex ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                        {item.complex.name || `Complex #${item.complex.id}`}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-sm">
                        —
                      </Typography>
                    )}
                  </div>
                  <div>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                      Building
                    </Typography>
                    {item.building ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                        {item.building.name || `Building #${item.building.id}`}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-sm">
                        —
                      </Typography>
                    )}
                  </div>
                  <div>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                      Mərtəbə sayı
                    </Typography>
                    {item.meta?.total_floor ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                        {item.meta.total_floor}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-sm">
                        —
                      </Typography>
                    )}
                  </div>
                  <div>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                      Mənzil sayı
                    </Typography>
                    {item.meta?.total_apartment ? (
                      <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                        {item.meta.total_apartment}
                      </Typography>
                    ) : (
                      <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-sm">
                        —
                      </Typography>
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
