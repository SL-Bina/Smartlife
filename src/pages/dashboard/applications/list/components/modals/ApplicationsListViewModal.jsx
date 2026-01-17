import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ApplicationsListViewModal({ open, onClose, application }) {
  const { t } = useTranslation();

  if (!open || !application) return null;

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
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
        <Typography variant="h5" className="font-bold">
          {t("applications.list.detailsModal.title") || "Müraciət detalları"}
        </Typography>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("applications.list.table.id") || "ID"}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {application.id}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("applications.list.table.apartmentEmployee") || "Mənzil/İşçi"}
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
              {application.apartmentEmployee || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("applications.list.table.text") || "Mətn"}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {application.text}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("applications.list.table.department") || "Şöbə"}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {application.department || "-"}
            </Typography>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("applications.list.table.residentPriority") || "Sakin prioriteti"}
            </Typography>
            {application.residentPriority && application.residentPriority !== "-" ? (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(application.residentPriority)}`}>
                {application.residentPriority}
              </span>
            ) : (
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                -
              </Typography>
            )}
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("applications.list.table.operationPriority") || "Əməliyyat prioriteti"}
            </Typography>
            {application.operationPriority && application.operationPriority !== "-" ? (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(application.operationPriority)}`}>
                {application.operationPriority}
              </span>
            ) : (
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                -
              </Typography>
            )}
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("applications.list.table.status") || "Status"}
            </Typography>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(application.status)}`}>
              {application.status}
            </span>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
              {t("applications.list.table.date") || "Tarix"}
            </Typography>
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {application.date}
            </Typography>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-3">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buttons.close") || "Bağla"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

