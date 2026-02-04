import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function PropertiesDeleteModal({
  open,
  onClose,
  item,
  onConfirm,
  deleting = false,
}) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="sm"
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <TrashIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
          <Typography variant="h6" className="dark:text-white">
            {t("properties.delete.title")}
          </Typography>
        </div>

        <div
          className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="h-5 w-5 dark:text-white" />
        </div>
      </DialogHeader>

      <DialogBody className="dark:bg-gray-800 space-y-3">
        <Typography className="text-sm text-gray-700 dark:text-gray-300">
          {t("properties.delete.confirm")}
        </Typography>

        <div className="rounded-lg border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 p-3">
          <Typography className="text-sm font-semibold text-red-700 dark:text-red-300">
            {item?.name || "—"}
          </Typography>
          <Typography className="text-xs text-red-600 dark:text-red-400">
            ID: {item?.id ?? "—"}
          </Typography>
        </div>
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2 border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          disabled={deleting}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buttons.cancel")}
        </Button>

        <Button
          color="red"
          onClick={onConfirm}
          disabled={deleting}
          className="bg-red-700 hover:bg-red-800 text-white min-w-[120px]"
        >
          {deleting ? t("buttons.deleting") : t("buttons.delete")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
