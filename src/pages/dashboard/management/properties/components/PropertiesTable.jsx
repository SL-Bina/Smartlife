import React, { useState, useMemo } from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem, Button } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ChevronUpIcon, ChevronDownIcon, EyeIcon, PencilIcon, TrashIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useManagementEnhanced, useMtkColor } from "@/context";
import { PropertiesTableSkeleton } from "./PropertiesTableSkeleton";

export function PropertiesTable({
  properties = [],
  onView,
  onEdit,
  onDelete,
  loading = false,
}) {
  const navigate = useNavigate();
  const { state, actions } = useManagementEnhanced();
  const { colorCode, getRgba } = useMtkColor();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const openFeePage = (apartment) => {
    navigate(`/dashboard/management/service-fee/${apartment.id}`);
  };

  // Rəng koduna görə kontrast mətn rəngi müəyyən et
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
    if (!sortConfig.key) return properties;

    return [...properties].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case "name":
          aValue = (a.name || "").toLowerCase();
          bValue = (b.name || "").toLowerCase();
          break;
        case "floor":
          aValue = a.meta?.floor || a.floor || 0;
          bValue = b.meta?.floor || b.floor || 0;
          break;
        case "block":
          aValue = (a.blockName || a.block?.name || "").toLowerCase();
          bValue = (b.blockName || b.block?.name || "").toLowerCase();
          break;
        case "area":
          aValue = a.meta?.area || a.area || 0;
          bValue = b.meta?.area || b.area || 0;
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
  }, [properties, sortConfig]);

  // MTK rəng kodunu tap
  const getMtkColorCode = (property) => {
    return property?.block?.building?.complex?.bind_mtk?.meta?.color_code || 
           property?.block?.complex?.bind_mtk?.meta?.color_code || 
           colorCode;
  };

  return (
    <Card className="shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardBody className="p-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1200px] table-auto">
            <thead>
              <tr className="bg-blue-gray-50 dark:bg-gray-900/40">
                <th 
                  className="p-4 text-left cursor-pointer hover:bg-blue-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-2">
                    <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
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
                  className="p-4 text-left cursor-pointer hover:bg-blue-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort("floor")}
                >
                  <div className="flex items-center gap-2">
                    <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                      Mərtəbə
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "floor" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "floor" && sortConfig?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </th>

                <th 
                  className="p-4 text-left cursor-pointer hover:bg-blue-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort("block")}
                >
                  <div className="flex items-center gap-2">
                    <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                      Blok
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "block" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "block" && sortConfig?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </th>

                <th 
                  className="p-4 text-left cursor-pointer hover:bg-blue-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort("area")}
                >
                  <div className="flex items-center gap-2">
                    <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                      Sahə
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "area" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "area" && sortConfig?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </th>

                <th 
                  className="p-4 text-left cursor-pointer hover:bg-blue-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
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

                <th className="p-4 text-right">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Əməliyyat
                  </Typography>
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <PropertiesTableSkeleton rows={10} />
              ) : sortedItems.length === 0 ? (
                <tr>
                  <td className="p-6" colSpan={6}>
                    <Typography className="text-sm text-blue-gray-500 dark:text-gray-300 text-center">
                      Heç nə tapılmadı
                    </Typography>
                  </td>
                </tr>
              ) : (
                sortedItems.map((x) => {
                  const isSelected = String(state.propertyId || "") === String(x.id);
                  const mtkColorCode = getMtkColorCode(x);
                  
                  // Rəng kodunu rgba-ya çevir (15% opacity)
                  const getHoverColor = (hex) => {
                    if (!hex) return null;
                    const hexClean = hex.replace("#", "");
                    const r = parseInt(hexClean.substring(0, 2), 16);
                    const g = parseInt(hexClean.substring(2, 4), 16);
                    const b = parseInt(hexClean.substring(4, 6), 16);
                    return `rgba(${r}, ${g}, ${b}, 0.15)`;
                  };
                  
                  // Rəng kodunu rgba-ya çevir (25% opacity)
                  const getSelectedColor = (hex) => {
                    if (!hex) return null;
                    const hexClean = hex.replace("#", "");
                    const r = parseInt(hexClean.substring(0, 2), 16);
                    const g = parseInt(hexClean.substring(2, 4), 16);
                    const b = parseInt(hexClean.substring(4, 6), 16);
                    return `rgba(${r}, ${g}, ${b}, 0.25)`;
                  };

                  const hoverColor = getHoverColor(mtkColorCode);
                  const selectedColor = getSelectedColor(mtkColorCode);
                  const defaultHover = "bg-blue-gray-50/50 dark:hover:bg-gray-700/30";
                  const defaultSelected = "bg-blue-50/60 dark:bg-gray-700/40";

                  return (
                    <tr
                      key={x.id}
                      className={`border-b border-blue-gray-50 dark:border-gray-700 cursor-pointer transition-colors ${
                        !mtkColorCode && isSelected ? defaultSelected : ""
                      }`}
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
                      onClick={() => actions.setProperty(x.id, x)}
                      title="Mənzil seç (scope)"
                    >
                      <td className="p-4 text-center">
                        <Typography className="text-sm font-medium text-blue-gray-800 dark:text-white">
                          {x.name || "—"}
                        </Typography>
                        <Typography className="text-xs text-blue-gray-500 dark:text-gray-400">ID: {x.id}</Typography>
                      </td>

                      <td className="p-4 text-center">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x.meta?.floor || x.floor || "—"}
                        </Typography>
                      </td>

                      <td className="p-4 text-center">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x.blockName || x.block?.name || "—"}
                        </Typography>
                      </td>

                      <td className="p-4 text-center">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x.meta?.area || x.area ? `${x.meta?.area || x.area} m²` : "—"}
                        </Typography>
                      </td>

                      <td className="p-4 text-center items-center justify-center">
                        <div className="flex items-center justify-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              x.status === "active" || x.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {x.status === "active" || x.status === "Active" ? "Aktiv" : "Qeyri-aktiv"}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 justify-center items-center">
                        <div className="flex justify-center items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openFeePage(x);
                            }}
                            className="px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors flex items-center gap-1"
                          >
                            <CurrencyDollarIcon className="h-4 w-4" />
                            Ödəniş
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
                })
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
