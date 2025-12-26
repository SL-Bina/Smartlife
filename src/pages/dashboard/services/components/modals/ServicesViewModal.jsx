import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import {
  InformationCircleIcon,
  CurrencyDollarIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export function ServicesViewModal({ open, onClose, service, onEdit }) {
  const { t } = useTranslation();

  if (!open || !service) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="lg"
      className="dark:bg-gray-900 border border-red-600 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="dark:bg-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-2">
          <EyeIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <Typography variant="h5" className="font-bold">
            {t("services.view.title") || "Servis Məlumatları"}
          </Typography>
        </div>
      </DialogHeader>
      <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[75vh] overflow-y-auto">
        <div className="space-y-6 py-2">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("services.form.basicInfo")}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("services.table.id")}
                </Typography>
                <Typography variant="paragraph" className="font-semibold dark:text-white">
                  {service.id}
                </Typography>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("services.form.name")}
                </Typography>
                <Typography variant="paragraph" className="font-semibold dark:text-white">
                  {service.name || <span className="text-gray-400 italic">{t("services.view.notProvided")}</span>}
                </Typography>
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("services.form.description")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white min-h-[60px] p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  {service.description ? service.description : <span className="text-gray-400 italic">{t("services.view.notProvided")}</span>}
                </Typography>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
                  {t("services.form.price")}
                </Typography>
                <Typography variant="paragraph" className="font-semibold text-green-600 dark:text-green-400">
                  {parseFloat(service.price || 0).toFixed(2)} ₼
                </Typography>
              </div>

              {service.created_at && (
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                    {t("services.view.createdAt") || "Yaradılma tarixi"}
                  </Typography>
                  <Typography variant="paragraph" className="dark:text-white">
                    {new Date(service.created_at).toLocaleString()}
                  </Typography>
                </div>
              )}

              {service.updated_at && (
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                    {t("services.view.updatedAt") || "Yenilənmə tarixi"}
                  </Typography>
                  <Typography variant="paragraph" className="dark:text-white">
                    {new Date(service.updated_at).toLocaleString()}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-3 dark:bg-gray-800 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 min-w-[100px]"
        >
          {t("services.view.close") || t("services.filter.close")}
        </Button>
        {onEdit && (
          <Button
            color="blue"
            onClick={() => {
              onEdit(service);
              onClose();
            }}
            className="dark:bg-blue-600 dark:hover:bg-blue-700 min-w-[100px]"
          >
            {t("services.actions.edit")}
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
}

