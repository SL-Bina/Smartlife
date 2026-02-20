import React from "react";
import { Card, CardBody, Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon, CurrencyDollarIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export function PropertyCardList({ items, loading, onView, onEdit, onDelete, onServiceFee, onSelect, selectedPropertyId }) {
  const getStatusBadge = (status) => {
    const statusMap = {
      active: { label: "Aktiv", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
      inactive: { label: "Qeyri-aktiv", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
      pending: { label: "Gözləyir", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
    };
    const statusInfo = statusMap[status] || { label: status || "Naməlum", color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400" };
    return (
      <Chip
        value={statusInfo.label}
        className={`${statusInfo.color} text-xs font-medium`}
        size="sm"
      />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 lg:hidden">
        <Typography variant="small" className="text-gray-500 dark:text-gray-400">
          Yüklənir...
        </Typography>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center py-10 lg:hidden">
        <Typography variant="small" className="text-gray-500 dark:text-gray-400">
          Məlumat tapılmadı
        </Typography>
      </div>
    );
  }

  return (
    <div className="lg:hidden grid gap-4 sm:grid-cols-2 p-4">
      {items.map((item) => (
        <Card 
          key={item.id} 
          className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border ${
            selectedPropertyId === item.id 
              ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 dark:ring-blue-400/20" 
              : "border-white/20 dark:border-gray-700/50"
          }`}
        >
          <CardBody className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedPropertyId === item.id}
                  onChange={() => onSelect && onSelect(item)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <Typography variant="h6" className="text-gray-700 dark:text-gray-300 font-semibold">
                  ID: {item.id}
                </Typography>
              </div>
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                  </IconButton>
                </MenuHandler>
                <MenuList className="dark:bg-gray-800 dark:border-gray-800">
                  <MenuItem onClick={() => onView(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                    <EyeIcon className="h-4 w-4" />
                    Bax
                  </MenuItem>
                  <MenuItem onClick={() => onEdit(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                    <PencilIcon className="h-4 w-4" />
                    Redaktə et
                  </MenuItem>
                  {onServiceFee && (
                    <MenuItem onClick={() => onServiceFee(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      Servis haqqı
                    </MenuItem>
                  )}
                  <MenuItem onClick={() => onDelete(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400">
                    <TrashIcon className="h-4 w-4" />
                    Sil
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>

            <div className="space-y-2">
              <div>
                <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                  Ad
                </Typography>
                <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold">
                  {item.name || "-"}
                </Typography>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                    MTK
                  </Typography>
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                    {item.sub_data?.mtk?.name || item.bind_mtk?.name || "-"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                    Complex
                  </Typography>
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                    {item.sub_data?.complex?.name || item.bind_complex?.name || "-"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                    Building
                  </Typography>
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                    {item.sub_data?.building?.name || item.bind_building?.name || "-"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                    Block
                  </Typography>
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                    {item.sub_data?.block?.name || item.bind_block?.name || "-"}
                  </Typography>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                    Mənzil №
                  </Typography>
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold">
                    {item.meta?.apartment_number || item.apartment_number || "-"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                    Mərtəbə
                  </Typography>
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold">
                    {item.meta?.floor || item.floor || "-"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                    Sahə (m²)
                  </Typography>
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold">
                    {item.meta?.area || item.area || "-"}
                  </Typography>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                  Status
                </Typography>
                {getStatusBadge(item.status)}
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

