import React, { useState, useMemo } from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useManagementEnhanced } from "@/context";
import { useMtkColor } from "@/context";
import { ComplexTableSkeleton } from "./ComplexTableSkeleton";

export function ComplexTable({ items = [], loading, onEdit, onDelete, onView }) {
  const navigate = useNavigate();
  const { state, actions } = useManagementEnhanced();
  const { colorCode, getRgba } = useMtkColor();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const buildingCountOf = (x) => (Array.isArray(x?.buildings) ? x.buildings.length : 0);

  const goBuildings = (complex) => {
    const mtkId = complex?.bind_mtk?.id || complex?.mtk_id || null;

    if (mtkId) {
      actions.setMtk(mtkId, complex?.bind_mtk || null);
    }
    actions.setComplex(complex.id, complex);

    // Navigate et
    navigate("/dashboard/management/buildings");
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
        case "mtk":
          aValue = (a?.bind_mtk?.name || a?.mtk_id || "").toLowerCase();
          bValue = (b?.bind_mtk?.name || b?.mtk_id || "").toLowerCase();
          break;
        case "address":
          aValue = (a?.meta?.address || "").toLowerCase();
          bValue = (b?.meta?.address || "").toLowerCase();
          break;
        case "status":
          aValue = (a.status || "").toLowerCase();
          bValue = (b.status || "").toLowerCase();
          break;
        case "buildings":
          aValue = buildingCountOf(a);
          bValue = buildingCountOf(b);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig]);

  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <Card className="shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardBody className="p-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1200px] table-auto">
            <thead>
              <tr className="bg-blue-gray-50 dark:bg-gray-900/40">
                <th className="p-4 text-center cursor-pointer hover:bg-blue-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => handleSort("id")}>
                  <div className="flex items-center gap-2 justify-center">
                    <Typography className="text-sm font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                      ID
                    </Typography>
                    <div className="flex flex-col">
                      <div className="flex flex-col">
                        <ChevronUpIcon
                          className={`h-3 w-3 ${sortConfig?.key === "id" && sortConfig?.direction === "asc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                            }`}
                        />
                      </div>
                      <div className="flex flex-col">
                        <ChevronDownIcon
                          className={`h-3 w-3 -mt-1 ${sortConfig?.key === "id" && sortConfig?.direction === "desc"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-blue-gray-300 dark:text-gray-600"
                            }`}
                        />
                      </div>
                    </div>
                  </div>
                </th>
                <th
                  className="p-4 text-left cursor-pointer hover:bg-blue-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort("name")}
                >

                  <div className="flex items-center gap-2 justify-center">
                    <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                      Ad
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${sortConfig?.key === "name" && sortConfig?.direction === "asc"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-blue-gray-300 dark:text-gray-600"
                          }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${sortConfig?.key === "name" && sortConfig?.direction === "desc"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-blue-gray-300 dark:text-gray-600"
                          }`}
                      />
                    </div>
                  </div>
                </th>

                <th
                  className="p-4 text-left cursor-pointer hover:bg-blue-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort("mtk")}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                      MTK
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${sortConfig?.key === "mtk" && sortConfig?.direction === "asc"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-blue-gray-300 dark:text-gray-600"
                          }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${sortConfig?.key === "mtk" && sortConfig?.direction === "desc"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-blue-gray-300 dark:text-gray-600"
                          }`}
                      />
                    </div>
                  </div>
                </th>

                <th
                  className="p-4 text-left cursor-pointer hover:bg-blue-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort("address")}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                      Ünvan
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${sortConfig?.key === "address" && sortConfig?.direction === "asc"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-blue-gray-300 dark:text-gray-600"
                          }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${sortConfig?.key === "address" && sortConfig?.direction === "desc"
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
                  <div className="flex items-center gap-2 justify-center">
                    <Typography className="text-xs text-center font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                      Status
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${sortConfig?.key === "status" && sortConfig?.direction === "asc"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-blue-gray-300 dark:text-gray-600"
                          }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${sortConfig?.key === "status" && sortConfig?.direction === "desc"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-blue-gray-300 dark:text-gray-600"
                          }`}
                      />
                    </div>
                  </div>
                </th>

                <th
                  className="p-4 text-left cursor-pointer hover:bg-blue-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleSort("buildings")}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                      Bina sayı
                    </Typography>
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={`h-3 w-3 ${sortConfig?.key === "buildings" && sortConfig?.direction === "asc"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-blue-gray-300 dark:text-gray-600"
                          }`}
                      />
                      <ChevronDownIcon
                        className={`h-3 w-3 -mt-1 ${sortConfig?.key === "buildings" && sortConfig?.direction === "desc"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-blue-gray-300 dark:text-gray-600"
                          }`}
                      />
                    </div>
                  </div>
                </th>

                <th className="p-4 text-center">
                  <Typography className="text-sm font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Əməliyyat
                  </Typography>
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <ComplexTableSkeleton rows={10} />
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
                  const isSelected = String(state.complexId || "") === String(x.id);
                  const mtkColorCode = x?.bind_mtk?.meta?.color_code || colorCode;

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
                      className={`border-b border-blue-gray-50 dark:border-gray-700 cursor-pointer transition-colors ${!mtkColorCode && isSelected ? defaultSelected : ""
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
                      onClick={() => actions.setComplex(x.id, x)}
                      title="Kompleks seç (scope)"
                    >
                      <td className="p-4 text-center">
                        <Typography className="text-base font-bold text-blue-gray-700 dark:text-gray-200">{x.id}</Typography>
                      </td>
                      <td className="p-4 text-center">
                        <Typography className="text-sm font-medium text-blue-gray-800 dark:text-white">
                          {x.name}
                        </Typography>
                      </td>

                      <td className="p-4 text-center">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x?.bind_mtk?.name || (x?.mtk_id ? `#${x.mtk_id}` : "—")}
                        </Typography>
                      </td>

                      <td className="p-4 text-center">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x?.meta?.address || "—"}
                        </Typography>
                      </td>

                      <td className="p-4 text-center items-center justify-center">
                        <div className="flex items-center justify-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${x.status === "active" || x.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : x.status === "inactive" || x.status === "Inactive"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-blue-gray-100 text-blue-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                          >
                            {x.status || "—"}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {buildingCountOf(x)}
                        </Typography>
                      </td>

                      <td className="p-4 justify-center items-center">
                        <div className="flex justify-center items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              goBuildings(x);
                            }}
                            className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                          >
                            Binalara keç
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
