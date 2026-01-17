import React from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ApplicationsListCardList({ applications, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Tamamlandı":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Gözləmədə":
        return "bg-yellow-100 text-orange-600 dark:bg-yellow-900/30 dark:text-orange-400";
      case "Ləğv edildi":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "Yüksək":
      case "Tecili":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "Orta":
      case "5 deqiqelik":
        return "bg-yellow-100 text-orange-600 dark:bg-yellow-900/30 dark:text-orange-400";
      case "Normal":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
      {applications.map((row) => (
        <Card key={row.id} className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardBody className="space-y-2 dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                #{row.id} - {row.apartmentEmployee || "-"}
              </Typography>
              <Menu placement="left-start">
                <MenuHandler>
                  <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                    <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                  </IconButton>
                </MenuHandler>
                <MenuList className="dark:bg-gray-800 dark:border-gray-800">
                  <MenuItem onClick={() => onView(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("applications.list.actions.view") || "Bax"}
                  </MenuItem>
                  <MenuItem onClick={() => onEdit(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("applications.list.actions.edit") || "Redaktə et"}
                  </MenuItem>
                  <MenuItem onClick={() => onDelete(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                    {t("applications.list.actions.delete") || "Sil"}
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("applications.list.mobile.text") || "Mətn"}: {row.text}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("applications.list.mobile.department") || "Şöbə"}: {row.department || "-"}
            </Typography>
            {row.residentPriority && row.residentPriority !== "-" && (
              <div className="flex items-center gap-2">
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {t("applications.list.mobile.residentPriority") || "Sakin prioriteti"}:
                </Typography>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(row.residentPriority)}`}>
                  {row.residentPriority}
                </span>
              </div>
            )}
            {row.operationPriority && row.operationPriority !== "-" && (
              <div className="flex items-center gap-2">
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {t("applications.list.mobile.operationPriority") || "Əməliyyat prioriteti"}:
                </Typography>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(row.operationPriority)}`}>
                  {row.operationPriority}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {t("applications.list.mobile.status") || "Status"}:
              </Typography>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(row.status)}`}>
                {row.status}
              </span>
            </div>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("applications.list.mobile.date") || "Tarix"}: {row.date}
            </Typography>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

