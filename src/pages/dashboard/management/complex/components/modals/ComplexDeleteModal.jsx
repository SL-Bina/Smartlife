import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function ComplexDeleteModal({ open, onClose, complex, onConfirm, deleting = false }) {
  const { t } = useTranslation();

  if (!open || !complex) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="md"
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {t("complexes.delete.title") || "Kompleksi sil"}
          </Typography>
        </div>
        <div
          className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 py-6">
        <Typography className="dark:text-gray-300">
          {t("complexes.delete.message") || "Bu kompleksi silmək istədiyinizə əminsiniz?"} {complex?.name}
        </Typography>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          disabled={deleting}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("complexes.delete.cancel") || "Ləğv et"}
        </Button>
        <Button
          color="red"
          onClick={onConfirm}
          disabled={deleting}
          className="dark:bg-red-600 dark:hover:bg-red-700"
        >
          {deleting
            ? t("complexes.delete.deleting") || "Silinir..."
            : t("complexes.delete.confirm") || "Sil"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
