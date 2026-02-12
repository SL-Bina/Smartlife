import React, { useState, useMemo } from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useManagement } from "@/store/hooks/useManagement";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";
import { MtkTableSkeleton } from "./MtkTableSkeleton";

export function MtkTable({ items = [], loading, onEdit, onDelete, onView, onGoComplex }) {
  const { state, actions } = useManagement();
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { colorCode } = useMtkColor();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const complexCountOf = (x) => {
    const v = x?.complex_count;
    if (v === 0) return 0;
    return v || "—";
  };

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

  const getContrastColor = (hexColor) => {
    if (!hexColor) return "#000000";
    
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
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
        case "address":
          aValue = (a?.meta?.address || "").toLowerCase();
          bValue = (b?.meta?.address || "").toLowerCase();
          break;
        case "status":
          aValue = (a.status || "").toLowerCase();
          bValue = (b.status || "").toLowerCase();
          break;
        case "email":
          aValue = (a?.meta?.email || "").toLowerCase();
          bValue = (b?.meta?.email || "").toLowerCase();
          break;
        case "phone":
          aValue = (a?.meta?.phone || "").toLowerCase();
          bValue = (b?.meta?.phone || "").toLowerCase();
          break;
        case "color":
          aValue = (a?.meta?.color_code || "").toLowerCase();
          bValue = (b?.meta?.color_code || "").toLowerCase();
          break;
        case "website":
          aValue = (a?.meta?.website || "").toLowerCase();
          bValue = (b?.meta?.website || "").toLowerCase();
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
            <table className="w-full min-w-[1400px] table-auto">
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
                  onClick={() => handleSort("address")}
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
                      Ünvan
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "address" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "address" && sortConfig?.direction === "desc"
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
                  onClick={() => handleSort("status")}
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
                      Status
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "status" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "status" && sortConfig?.direction === "desc"
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

                <th 
                  className={`p-4 text-left cursor-pointer transition-colors ${
                    colorCode ? "" : "hover:bg-blue-gray-100 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => handleSort("color")}
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
                      Rəng
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "color" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "color" && sortConfig?.direction === "desc"
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
                  onClick={() => handleSort("website")}
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
                      Web sayt
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "website" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "website" && sortConfig?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </th>

                <th className="p-4  justify-center items-center">
                  <Typography className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-100">
                    Əməliyyat
                  </Typography>
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <MtkTableSkeleton rows={10} />
              ) : items.length === 0 ? (
                <tr>
                  <td className="p-6" colSpan={9}>
                    <Typography className="text-sm font-medium text-gray-800 dark:text-gray-100 text-center">
                      Heç nə tapılmadı
                    </Typography>
                  </td>
                </tr>
              ) : (
                <>
                  {sortedItems.map((x) => {
                    const isSelected = String(state.mtkId || "") === String(x.id);
                    const colorCode = x?.meta?.color_code;
                    
                    const getHoverColor = (hex) => {
                      if (!hex) return null;
                      const hexClean = hex.replace("#", "");
                      const r = parseInt(hexClean.substring(0, 2), 16);
                      const g = parseInt(hexClean.substring(2, 4), 16);
                      const b = parseInt(hexClean.substring(4, 6), 16);
                      return `rgba(${r}, ${g}, ${b}, 0.06)`;
                    };
                    
                    const getSelectedColor = (hex) => {
                      if (!hex) return null;
                      const hexClean = hex.replace("#", "");
                      const r = parseInt(hexClean.substring(0, 2), 16);
                      const g = parseInt(hexClean.substring(2, 4), 16);
                      const b = parseInt(hexClean.substring(4, 6), 16);
                      return `rgba(${r}, ${g}, ${b}, 0.12)`;
                    };

                    const hoverColor = getHoverColor(colorCode);
                    const selectedColor = getSelectedColor(colorCode);
                    const defaultHover = "bg-blue-gray-50/50 dark:hover:bg-gray-700/30";
                    const defaultSelected = "bg-blue-50/60 dark:bg-gray-700/40";

                    return (
                      <tr
                        key={x.id}
                        className={`
                          border-b border-gray-200/30 dark:border-gray-700/30 
                          cursor-pointer transition-all duration-200
                          ${!colorCode && isSelected ? defaultSelected : ""}
                          hover:bg-white/40 dark:hover:bg-gray-800/30
                        `}
                        style={{
                          ...(selectedColor && isSelected && {
                            backgroundColor: selectedColor,
                          }),
                        }}
                        onMouseEnter={(e) => {
                          if (hoverColor) {
                            e.currentTarget.style.backgroundColor = hoverColor;
                          } else {
                            e.currentTarget.classList.add(...defaultHover.split(" "));
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (hoverColor) {
                            e.currentTarget.style.backgroundColor = isSelected && selectedColor ? selectedColor : '';
                          } else {
                            e.currentTarget.classList.remove(...defaultHover.split(" "));
                          }
                        }}
                        onClick={() => actions.setMtk(x.id, x)}
                        title="MTK seç (scope)"
                      >

                        <td className="p-4 text-center">
                          <Typography className="text-base text-gray-700 font-bold dark:text-gray-200">{x.id}</Typography>
                        </td>

                        <td className="p-4 text-center">
                          <Typography className="text-sm font-semibold text-gray-900 dark:text-white">
                            {x.name}
                          </Typography>
                        </td>

                        <td className="p-4 text-center">
                          <Typography className="text-sm font-medium text-gray-800 dark:text-gray-100">
                            {x?.meta?.address || "—"}
                          </Typography>
                        </td>

                        <td className="p-4 text-center items-center justify-center">
                          <div className="flex items-center justify-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                x.status === "active" || x.status === "Active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : x.status === "inactive" || x.status === "Inactive"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  : "bg-blue-gray-100 text-blue-gray-900 dark:bg-gray-700 dark:text-gray-100"
                              }`}
                            >
                              {x.status || "—"}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                            {x?.meta?.email || "—"}
                          </Typography>
                        </td>

                        <td className="p-4 text-center">
                          <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                            {x?.meta?.phone || "—"}
                          </Typography>
                        </td>

                        

                        <td className="p-4 text-center">
                          {x?.meta?.color_code ? (
                            <div className="flex items-center justify-center">
                              <span
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600"
                                style={{ 
                                  backgroundColor: x.meta.color_code,
                                  color: getContrastColor(x.meta.color_code)
                                }}
                                title={x.meta.color_code}
                              >
                                {x.meta.color_code}
                              </span>
                            </div>
                          ) : (
                            <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">—</Typography>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          {x?.meta?.website ? (
                            <a
                              href={x.meta.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {x.meta.website}
                            </a>
                          ) : (
                            <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">—</Typography>
                          )}
                        </td>

                        <td className="p-4 justify-center items-center">
                          <div className="flex justify-center items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Context-də ID-ni set et (data yükləməni context özü edəcək)
                                actions.setMtk(x.id, x);
                                onGoComplex?.();
                              }}
                              className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                            >
                              Complex-ə keç
                            </button>
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
                              <MenuList className="dark:bg-gray-800 dark:border-gray-800">
                                <MenuItem
                                  onClick={() => onView?.(x)}
                                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  Bax
                                </MenuItem>
                                <MenuItem
                                  onClick={() => onEdit?.(x)}
                                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  Düzəliş et
                                </MenuItem>
                                <MenuItem
                                  onClick={() => onDelete?.(x)}
                                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  Sil
                                </MenuItem>
                              </MenuList>
                            </Menu>
                            
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
