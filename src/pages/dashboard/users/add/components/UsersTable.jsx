import React, { useState, useMemo } from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";
import { UsersTableSkeleton } from "./UsersTableSkeleton";

const DEFAULT_COLOR = "#dc2626";

export function UsersTable({ items = [], loading, onEdit, onDelete }) {
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const colorCode = null;
  const activeColor = DEFAULT_COLOR;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getTableBackground = () => {
    if (colorCode && sidenavType === "white") {
      const color1 = getRgbaColor(colorCode, 0.04);
      const color2 = getRgbaColor(colorCode, 0.02);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    if (colorCode && sidenavType === "dark") {
      const color1 = getRgbaColor(colorCode, 0.08);
      const color2 = getRgbaColor(colorCode, 0.05);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    return {};
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
        case "username":
          aValue = (a.username || "").toLowerCase();
          bValue = (b.username || "").toLowerCase();
          break;
        case "email":
          aValue = (a.email || "").toLowerCase();
          bValue = (b.email || "").toLowerCase();
          break;
        case "phone":
          aValue = (a.phone || "").toLowerCase();
          bValue = (b.phone || "").toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig]);

  const cardTypes = {
    dark: colorCode ? "" : "dark:bg-gray-800/50",
    white: colorCode ? "" : "bg-white/80 dark:bg-gray-800/50",
    transparent: "",
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

  return (
    <Card 
      className={`
        rounded-2xl xl:rounded-3xl
        backdrop-blur-xl backdrop-saturate-150
        border
        ${cardTypes[sidenavType] || ""} 
        ${colorCode ? "" : "border-gray-200/50 dark:border-gray-700/50"}
        shadow-[0_4px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.2)]
        dark:shadow-[0_4px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]
        overflow-hidden
      `}
      style={{
        ...getTableBackground(),
        borderColor: colorCode ? getRgbaColor(colorCode, 0.15) : undefined,
      }}
    >
      <CardBody className="p-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1000px] table-auto">
            <thead>
              <tr className={`
                ${colorCode ? "" : "bg-gradient-to-b from-gray-50/80 to-gray-100/50 dark:from-gray-900/60 dark:to-gray-800/40"}
                backdrop-blur-sm
              `}>
                <th 
                  className={`p-4 text-left cursor-pointer transition-colors ${
                    colorCode ? "" : "hover:bg-blue-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleSort("id")}
                  onMouseEnter={(e) => {
                    if (colorCode) {
                      e.currentTarget.style.backgroundColor = getRgbaColor(colorCode, 0.08);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (colorCode) {
                      e.currentTarget.style.backgroundColor = "";
                    }
                  }}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Typography className="text-xs text-center font-semibold uppercase text-gray-800 dark:text-gray-100">
                      ID
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "id" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "id" && sortConfig?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </th>
                <th 
                  className={`p-4 text-left cursor-pointer transition-colors ${
                    colorCode ? "" : "hover:bg-blue-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleSort("name")}
                  onMouseEnter={(e) => {
                    if (colorCode) {
                      e.currentTarget.style.backgroundColor = getRgbaColor(colorCode, 0.08);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (colorCode) {
                      e.currentTarget.style.backgroundColor = "";
                    }
                  }}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Typography className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-100">
                      Ad
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "name" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "name" && sortConfig?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </th>
                <th 
                  className={`p-4 text-left cursor-pointer transition-colors ${
                    colorCode ? "" : "hover:bg-blue-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleSort("username")}
                  onMouseEnter={(e) => {
                    if (colorCode) {
                      e.currentTarget.style.backgroundColor = getRgbaColor(colorCode, 0.08);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (colorCode) {
                      e.currentTarget.style.backgroundColor = "";
                    }
                  }}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Typography className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-100">
                      İstifadəçi adı
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "username" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "username" && sortConfig?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </th>
                <th 
                  className={`p-4 text-left cursor-pointer transition-colors ${
                    colorCode ? "" : "hover:bg-blue-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleSort("email")}
                  onMouseEnter={(e) => {
                    if (colorCode) {
                      e.currentTarget.style.backgroundColor = getRgbaColor(colorCode, 0.08);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (colorCode) {
                      e.currentTarget.style.backgroundColor = "";
                    }
                  }}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Typography className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-100">
                      Email
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "email" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "email" && sortConfig?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </th>
                <th 
                  className={`p-4 text-left cursor-pointer transition-colors ${
                    colorCode ? "" : "hover:bg-blue-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleSort("phone")}
                  onMouseEnter={(e) => {
                    if (colorCode) {
                      e.currentTarget.style.backgroundColor = getRgbaColor(colorCode, 0.08);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (colorCode) {
                      e.currentTarget.style.backgroundColor = "";
                    }
                  }}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Typography className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-100">
                      Telefon
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "phone" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "phone" && sortConfig?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </th>
                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-100">
                    Rol
                  </Typography>
                </th>
                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-100">
                    Əməliyyatlar
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <UsersTableSkeleton rows={10} />
              ) : sortedItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <Typography className="text-sm text-gray-500 dark:text-gray-400">
                      İstifadəçi tapılmadı
                    </Typography>
                  </td>
                </tr>
              ) : (
                sortedItems.map((item, index) => (
                  <tr 
                    key={item?.id ?? `user-${index}`} 
                    className="hover:bg-blue-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 transition-colors"
                    onMouseEnter={(e) => {
                      if (colorCode) {
                        e.currentTarget.style.backgroundColor = getRgbaColor(colorCode, 0.05);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (colorCode) {
                        e.currentTarget.style.backgroundColor = "";
                      }
                    }}
                  >
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-800 dark:text-gray-200">
                        {item.id ?? "—"}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-800 dark:text-gray-200">
                        {item.name || "—"}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-800 dark:text-gray-200">
                        {item.username || "—"}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-800 dark:text-gray-200">
                        {item.email || "—"}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-800 dark:text-gray-200">
                        {item.phone || "—"}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography variant="small" className="text-gray-800 dark:text-gray-200">
                        {item.role?.name || "—"}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Menu>
                        <MenuHandler>
                          <IconButton variant="text" size="sm" className="dark:text-gray-300">
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </IconButton>
                        </MenuHandler>
                        <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                          <MenuItem 
                            onClick={() => onEdit?.(item)}
                            className="dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            Redaktə et
                          </MenuItem>
                          <MenuItem 
                            onClick={() => onDelete?.(item)}
                            className="dark:text-gray-300 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
                          >
                            Sil
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}

