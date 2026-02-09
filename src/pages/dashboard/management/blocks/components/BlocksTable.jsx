import React, { useState, useMemo } from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useManagement } from "@/context/ManagementContext";
import { useMtkColor } from "@/context";
import { BlocksTableSkeleton } from "./BlocksTableSkeleton";

export function BlocksTable({ items = [], loading, onEdit, onDelete, onView }) {
  const navigate = useNavigate();
  const { state, actions } = useManagement();
  const { colorCode, getRgba } = useMtkColor();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const goProperties = (block) => {
    const mtkId = state.mtkId || block?.building?.complex?.bind_mtk?.id || block?.building?.complex?.mtk_id || null;
    const complexId = state.complexId || block?.building?.complex?.id || block?.complex?.id || null;
    const buildingId = state.buildingId || block?.building?.id || block?.building_id || null;

    // Context-də ID-ləri set et (data yükləməni context özü edəcək)
    if (mtkId) {
      actions.setMtk(mtkId, block?.building?.complex?.bind_mtk || null);
    }
    if (complexId) {
      actions.setComplex(complexId, block?.complex || block?.building?.complex || null);
    }
    if (buildingId) {
      actions.setBuilding(buildingId, block?.building || null);
    }
    actions.setBlock(block.id, block);

    // Navigate et
    navigate("/dashboard/management/properties");
  };

  // Rəng koduna görə kontrast mətn rəngi müəyyən et (ağ və ya qara)
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
        case "name":
          aValue = (a.name || "").toLowerCase();
          bValue = (b.name || "").toLowerCase();
          break;
        case "complex":
          aValue = (a?.complex?.name || "").toLowerCase();
          bValue = (b?.complex?.name || "").toLowerCase();
          break;
        case "building":
          aValue = (a?.building?.name || "").toLowerCase();
          bValue = (b?.building?.name || "").toLowerCase();
          break;
        case "floor":
          aValue = a?.meta?.total_floor || 0;
          bValue = b?.meta?.total_floor || 0;
          break;
        case "apartment":
          aValue = a?.meta?.total_apartment || 0;
          bValue = b?.meta?.total_apartment || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig]);

  // Rəng kodunu rgba-ya çevir
  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // MTK rəng kodunu tap (block-dan və ya context-dən)
  const getMtkColorCode = (block) => {
    return block?.building?.complex?.bind_mtk?.meta?.color_code || 
           block?.complex?.bind_mtk?.meta?.color_code || 
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
                  onClick={() => handleSort("complex")}
                >
                  <div className="flex items-center gap-2">
                    <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                      Kompleks
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "complex" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "complex" && sortConfig?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </th>

                <th 
                  className="p-4 text-left cursor-pointer hover:bg-blue-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort("building")}
                >
                  <div className="flex items-center gap-2">
                    <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                      Bina
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "building" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "building" && sortConfig?.direction === "desc"
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
                  onClick={() => handleSort("apartment")}
                >
                  <div className="flex items-center gap-2">
                    <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                      Mənzil
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${
                          sortConfig?.key === "apartment" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                        }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${
                          sortConfig?.key === "apartment" && sortConfig?.direction === "desc"
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
                <BlocksTableSkeleton rows={10} />
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
                  const isSelected = String(state.blockId || "") === String(x.id);
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
                      onClick={() => actions.setBlock(x.id, x)}
                      title="Blok seç (scope)"
                    >
                      <td className="p-4 text-center">
                        <Typography className="text-sm font-medium text-blue-gray-800 dark:text-white">
                          {x.name}
                        </Typography>
                        <Typography className="text-xs text-blue-gray-500 dark:text-gray-400">ID: {x.id}</Typography>
                      </td>

                      <td className="p-4 text-center">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x?.complex?.name || "—"}
                        </Typography>
                      </td>

                      <td className="p-4 text-center">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x?.building?.name || "—"}
                        </Typography>
                      </td>

                      <td className="p-4 text-center">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x?.meta?.total_floor || "—"}
                        </Typography>
                      </td>

                      <td className="p-4 text-center">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x?.meta?.total_apartment || "—"}
                        </Typography>
                      </td>

                      <td className="p-4 justify-center items-center">
                        <div className="flex justify-center items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              goProperties(x);
                            }}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                          >
                            Mənzillərə keç
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
