import React from "react";
import { Card, CardBody, Typography, Chip, Button, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, BuildingOfficeIcon, MapPinIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { useManagementEnhanced } from "@/store/exports";

export function MtkCardList({ items = [], loading, onEdit, onDelete, onView, onGoComplex }) {
  const { state, actions } = useManagementEnhanced();

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

  const complexCountOf = (x) => {
    const v = x?.complex_count;
    if (v === 0) return 0;
    return v || "—";
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="dark:bg-gray-800 shadow-sm animate-pulse">
            <CardBody className="p-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-12">
        <Typography className="text-sm font-medium text-gray-800 dark:text-gray-100">
Heç nə tapılmadı
        </Typography>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((x) => {
        const isSelected = String(state.mtkId || "") === String(x.id);
        const colorCode = x?.meta?.color_code;
        
        const getHoverColor = (hex) => {
          if (!hex) return null;
          const hexClean = hex.replace("#", "");
          const r = parseInt(hexClean.substring(0, 2), 16);
          const g = parseInt(hexClean.substring(2, 4), 16);
          const b = parseInt(hexClean.substring(4, 6), 16);
          return `rgba(${r}, ${g}, ${b}, 0.1)`;
        };

        return (
          <Card 
            key={x.id} 
            className={`
              rounded-2xl xl:rounded-3xl
              backdrop-blur-xl backdrop-saturate-150
              border
              transition-all cursor-pointer
              ${isSelected 
                ? colorCode 
                  ? "ring-2 ring-offset-2" 
                  : "border-blue-500 dark:border-blue-400"
                : "border-gray-200/50 dark:border-gray-700/50"
              }
              ${colorCode && isSelected ? "" : "bg-white/80 dark:bg-gray-800/50"}
              shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.2)]
              dark:shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]
              hover:shadow-[0_6px_28px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]
              dark:hover:shadow-[0_6px_28px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]
            `}
            style={{
              ...(isSelected && colorCode && {
                borderColor: colorCode,
                ringColor: colorCode,
                backgroundColor: getHoverColor(colorCode),
              }),
            }}
            onClick={() => actions.setMtk(x.id, x)}
          >
            <CardBody className="p-4 flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-700 dark:text-gray-300 flex-shrink-0" />
                    <Typography className="text-base font-bold text-gray-900 dark:text-white truncate">
                      {x.name}
                    </Typography>
                  </div>
                  <Typography className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    ID: {x.id} • Complex: {complexCountOf(x)}
                  </Typography>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Chip 
                    value={x.status || "—"} 
                    size="sm" 
                    color={x.status === "active" ? "green" : "blue-gray"}
                    className="text-xs"
                  />
                  <Menu placement="left-start">
                    <MenuHandler>
                      <IconButton
                        size="sm"
                        variant="text"
                        color="blue-gray"
                        className="dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                      </IconButton>
                    </MenuHandler>
                    <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onView?.(x);
                        }}
                        className="dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Bax
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(x);
                        }}
                        className="dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Düzəliş et
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(x);
                        }}
                        className="dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Sil
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                {x?.meta?.address && (
                  <div className="flex items-start gap-2 text-sm">
                    <MapPinIcon className="h-4 w-4 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                    <Typography className="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1 break-words">
                      {x.meta.address}
                    </Typography>
                  </div>
                )}

                {x?.meta?.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <EnvelopeIcon className="h-4 w-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    <Typography className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {x.meta.email}
                    </Typography>
                  </div>
                )}

                {x?.meta?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <PhoneIcon className="h-4 w-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    <Typography className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {x.meta.phone}
                    </Typography>
                  </div>
                )}

                {x?.meta?.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <GlobeAltIcon className="h-4 w-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    <a
                      href={x.meta.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {x.meta.website}
                    </a>
                  </div>
                )}

                {x?.meta?.color_code && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-4 w-4 rounded border border-gray-200 dark:border-gray-600 flex-shrink-0" style={{ backgroundColor: x.meta.color_code }}></div>
                    <Typography className="text-xs font-medium text-gray-800 dark:text-gray-200 font-mono">
                      {x.meta.color_code}
                    </Typography>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Button
                  size="sm"
                  variant="outlined"
                  color="blue"
                  className="flex-1 min-w-[100px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.setMtk(x.id, x);
                    onGoComplex?.();
                  }}
                >
                  Complex-ə keç
                </Button>
                <Button
                  size="sm"
                  variant="outlined"
                  color="gray"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView?.(x);
                  }}
                >
                  Bax
                </Button>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
