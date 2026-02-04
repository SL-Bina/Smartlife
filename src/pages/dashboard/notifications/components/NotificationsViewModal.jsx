import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography, Chip } from "@material-tailwind/react";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function NotificationsViewModal({ open, onClose, notification }) {
  const { t } = useTranslation();

  if (!open || !notification) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <BellIcon className="h-5 w-5 text-blue-500" />
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {t("notifications.view.title") || "Bildiriş Açıqlama"}
          </Typography>
        </div>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="dark:bg-gray-800 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sol tərəf - Detallar */}
          <div className="space-y-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("notifications.view.titleField") || "Başlıq"}
              </Typography>
              <Input
                value={notification.title || ""}
                readOnly
                className="dark:text-white dark:bg-gray-700"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("notifications.view.message") || "Mesaj"}
              </Typography>
              <Input
                value={notification.description || notification.message || ""}
                readOnly
                className="dark:text-white dark:bg-gray-700"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("notifications.view.priority") || "Prioritet"}
              </Typography>
              <Chip
                value={notification.priority === "important" || notification.type === "warning" ? (t("notifications.view.important") || "Vacib") : t(`notifications.types.${notification.type}`)}
                color={notification.priority === "important" || notification.type === "warning" ? "red" : "blue"}
                className="w-fit"
              />
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("notifications.view.date") || "Tarix"}
              </Typography>
              <Input
                value={notification.fullDate || notification.date || notification.time || ""}
                readOnly
                className="dark:text-white dark:bg-gray-700"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
          </div>

          {/* Sağ tərəf - Şəkil */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("notifications.view.image") || "Şəkil"}
            </Typography>
            <div className="w-full h-64 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              {notification.image ? (
                <img
                  src={notification.image}
                  alt={notification.title || "Bildiriş şəkli"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                  Şəkil yoxdur
                </Typography>
              )}
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("notifications.view.close") || "Bağla"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

