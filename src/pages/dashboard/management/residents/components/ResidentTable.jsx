import React, { useState, useMemo } from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem, Tooltip, Button } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ChevronUpIcon, ChevronDownIcon, PencilIcon, TrashIcon, CheckCircleIcon, UserIcon, EnvelopeIcon, PhoneIcon, EyeIcon } from "@heroicons/react/24/outline";
import { BlindsIcon } from "lucide-react";

export function ResidentTable({ items = [], loading, onView, onEdit, onBind, onDelete, onSelect, selectedResidentId }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [bindOpen, setBindOpen] = useState(false);

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
          aValue = ((a.name || "") + " " + (a.surname || "")).toLowerCase();
          bValue = ((b.name || "") + " " + (b.surname || "")).toLowerCase();
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
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left"><div className="h-3 w-18 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left"><div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left"><div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left"><div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left"><div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" /></th>
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-right"><div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto" /></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-200/50 dark:border-gray-700/50" style={{ opacity: 1 - (i / 3) * 0.9 }}>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${80 + (i % 5) * 18}px` }} />
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${100 + (i % 4) * 20}px` }} />
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4">
                    <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 text-right">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse ml-auto" />
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
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  ID
                </Typography>
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:opacity-70 transition-opacity"
                >
                  <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                    Ad Soyad
                  </Typography>
                  <SortIcon columnKey="name" />
                </button>
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  E-mail
                </Typography>
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Telefon
                </Typography>
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Tip
                </Typography>
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1 hover:opacity-70 transition-opacity"
                >
                  <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                    Status
                  </Typography>
                  <SortIcon columnKey="status" />
                </button>
              </th>
              <th className="px-4 xl:px-6 py-3 xl:py-4 text-right">
                <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                  Əməliyyatlar
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors ${selectedResidentId === item.id ? "bg-blue-50/50 dark:bg-blue-900/20" : ""
                  }`}
              >
                <td className="px-4 xl:px-6 py-3 xl:py-4">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-medium">
                    #{item.id}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-medium">
                    {item.name} {item.surname}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4">
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                    {item.email || "-"}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4">
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                    {item.phone || "-"}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4">
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                    {item.type || "-"}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                  >
                    {item.status === "active" ? "Aktiv" : "Qeyri-aktiv"}
                  </span>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-right">
                  <Menu>
                    <MenuHandler>
                      <IconButton variant="text" size="sm" className="text-gray-600 dark:text-gray-400">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </IconButton>
                    </MenuHandler>
                    <MenuList>
                      {onView && (
                        <MenuItem onClick={() => onView(item)} className="flex items-center">
                          <EyeIcon className="h-4 w-4 mr-2" />
                          Bax
                        </MenuItem>
                      )}
                      {onSelect && (
                        <MenuItem onClick={() => onSelect(item)} className="flex items-center">
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Seç
                        </MenuItem>
                      )}
                      {onBind && (
                        <MenuItem onClick={() => onBind(item)} className="flex items-center">
                          <BlindsIcon className="h-4 w-4 mr-2" />
                          Mənzillər
                        </MenuItem>
                      )}
                      {onEdit && (
                        <MenuItem onClick={() => onEdit(item)} className="flex items-center">
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Redaktə et
                        </MenuItem>
                      )}
                      {onDelete && (
                        <MenuItem onClick={() => onDelete(item)} className="flex items-center text-red-500">
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Sil
                        </MenuItem>
                      )}
                    </MenuList>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-3 p-3">
        {sortedItems.map((item) => (
          <Card key={item.id} className={`shadow-md ${selectedResidentId === item.id ? "ring-2 ring-blue-500" : ""}`}>
            <CardBody className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Typography variant="h6" className="text-gray-800 dark:text-gray-200 font-semibold mb-1">
                    {item.name} {item.surname}
                  </Typography>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                    ID: #{item.id}
                  </Typography>
                </div>
                <Menu>
                  <MenuHandler>
                    <IconButton variant="text" size="sm">
                      <EllipsisVerticalIcon className="h-5 w-5" />
                    </IconButton>
                  </MenuHandler>
                  <MenuList>
                    {onView && (
                      <MenuItem onClick={() => onView(item)} className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-2" />
                        Bax
                      </MenuItem>
                    )}


                    {onSelect && (
                      <MenuItem onClick={() => onSelect(item)} className="flex items-center">
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        Seç
                      </MenuItem>
                    )}
                    {onBind && (
                      <MenuItem onClick={() => onBind(item)} className="flex items-center">
                        <BlindsIcon className="h-4 w-4 mr-2" />
                        Mənzillər
                      </MenuItem>
                    )}
                    {onEdit && (
                      <MenuItem onClick={() => onEdit(item)} className="flex items-center">
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Redaktə et
                      </MenuItem>
                    )}
                    {onDelete && (
                      <MenuItem onClick={() => onDelete(item)} className="flex items-center text-red-500">
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Sil
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              </div>
              <div className="space-y-2">
                {item.email && (
                  <div className="flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                      {item.email}
                    </Typography>
                  </div>
                )}
                {item.phone && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-gray-400" />
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                      {item.phone}
                    </Typography>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                  >
                    {item.status === "active" ? "Aktiv" : "Qeyri-aktiv"}
                  </span>
                  {item.type && (
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                      {item.type}
                    </Typography>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

