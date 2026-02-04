import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function BuildingsViewModal({ open, onClose, building }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
          {t("buildings.view.title") || "Bina məlumatları"}
        </Typography>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="h-5 w-5 dark:text-white cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[75vh] overflow-y-auto">
        {building ? (
          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                <Typography variant="h6" className="font-semibold dark:text-white">
                  {t("buildings.view.basicInfo") || "Əsas Məlumatlar"}
                </Typography>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                    {t("buildings.view.id") || "ID"}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    #{building.id}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                    {t("buildings.view.name") || "Ad"}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                    {building.name || "-"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                    {t("buildings.view.complex") || "Kompleks"}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {building.complex?.name || "-"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                    {t("buildings.view.status") || "Status"}
                  </Typography>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      building.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {building.status === "active" ? (t("buildings.status.active") || "Aktiv") : (t("buildings.status.inactive") || "Passiv")}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {building.meta?.desc && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                  <Typography variant="h6" className="font-semibold dark:text-white">
                    {t("buildings.view.description") || "Təsvir"}
                  </Typography>
                </div>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300 whitespace-pre-wrap">
                  {building.meta.desc}
                </Typography>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Typography variant="small" color="blue-gray" className="dark:text-gray-400">
              {t("buildings.view.noData") || "Məlumat tapılmadı"}
            </Typography>
          </div>
        )}
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button variant="outlined" color="blue-gray" onClick={onClose} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
          {t("buildings.view.close") || "Bağla"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

