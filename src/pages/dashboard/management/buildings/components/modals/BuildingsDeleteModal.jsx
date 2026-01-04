import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function BuildingsDeleteModal({ open, onClose, building, onConfirm, deleting = false }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="sm" className="dark:bg-gray-900" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:bg-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
        <Typography variant="h5" className="font-bold">
          {t("buildings.delete.title") || "Binani sil"}
        </Typography>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="h-5 w-5 text-gray-700 dark:text-white" />
        </div>
      </DialogHeader>
      <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700">
        <Typography className="dark:text-gray-300">
          {t("buildings.delete.message") || "Bu binani silmək istədiyinizə əminsiniz?"} {building?.name}
        </Typography>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
        <Button 
          variant="outlined" 
          color="blue-gray" 
          onClick={onClose} 
          disabled={deleting}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buildings.delete.cancel") || "Ləğv et"}
        </Button>
        <Button 
          color="red" 
          onClick={onConfirm} 
          disabled={deleting} 
          className="dark:bg-red-600 dark:hover:bg-red-700"
        >
          {deleting ? t("buildings.delete.deleting") || "Silinir..." : t("buildings.delete.confirm") || "Sil"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

