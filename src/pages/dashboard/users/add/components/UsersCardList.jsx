import React from "react";
import { Card, CardBody, Typography, Chip, Button, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, UserIcon, EnvelopeIcon, PhoneIcon, EyeIcon } from "@heroicons/react/24/outline";
const DEFAULT_COLOR = "#dc2626";

export function UsersCardList({ items = [], loading, onView, onEdit, onDelete }) {
  const colorCode = null;
  const activeColor = DEFAULT_COLOR;

  const getContrastColor = (hexColor) => {
    if (!hexColor) return "#000000";
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
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
      {items.map((item, index) => (
        <Card
          key={item?.id ?? `user-card-${index}`}
          className={`
            rounded-2xl xl:rounded-3xl
            backdrop-blur-xl backdrop-saturate-150
            border border-gray-200/50 dark:border-gray-700/50
            shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.2)]
            dark:shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]
            hover:shadow-lg transition-all
            bg-white/80 dark:bg-gray-800/40
          `}
        >
          <CardBody className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: activeColor ? `${activeColor}20` : "rgba(220, 38, 38, 0.2)",
                  }}
                >
                  <UserIcon
                    className="h-6 w-6"
                    style={{
                      color: activeColor || "#dc2626",
                    }}
                  />
                </div>
                <div>
                  <Typography variant="h6" className="text-gray-900 dark:text-white font-semibold">
                    {item.name || "—"}
                  </Typography>
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                    @{item.username || "—"}
                  </Typography>
                </div>
              </div>
              <Menu>
                <MenuHandler>
                  <IconButton variant="text" size="sm" className="dark:text-gray-300">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </IconButton>
                </MenuHandler>
                <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                  {onView && (
                    <MenuItem 
                      onClick={() => onView?.(item)}
                      className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <EyeIcon className="h-4 w-4" />
                      Bax
                    </MenuItem>
                  )}
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
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                  {item.email || "—"}
                </Typography>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <PhoneIcon className="h-4 w-4 text-gray-400" />
                <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                  {item.phone || "—"}
                </Typography>
              </div>
              {item.role && (
                <div className="mt-3">
                  <Chip
                    value={item.role.name}
                    size="sm"
                    className="dark:bg-gray-700 dark:text-gray-300"
                    style={{
                      backgroundColor: activeColor ? `${activeColor}20` : "rgba(220, 38, 38, 0.2)",
                      color: activeColor || "#dc2626",
                    }}
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

