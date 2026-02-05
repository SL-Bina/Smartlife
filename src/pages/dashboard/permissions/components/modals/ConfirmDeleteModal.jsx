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

export function ConfirmDeleteModal({
  open,
  onClose,
  title,
  description,
  onConfirm,
  loading = false,
}) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="sm"
      className="dark:bg-gray-900 border border-red-600 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
        <Typography variant="h6" className="font-bold">
          {title || (t("common.deleteConfirm") || "Silməyə əminsiniz?")}
        </Typography>
      </DialogHeader>

      <DialogBody className="dark:bg-gray-800">
        <Typography variant="small" className="text-gray-700 dark:text-gray-300">
          {description || (t("common.deleteWarn") || "Bu əməliyyat geri qaytarılmır.")}
        </Typography>
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-3">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          disabled={loading}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buttons.cancel") || "Ləğv et"}
        </Button>

        <Button
          color="red"
          onClick={onConfirm}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700"
        >
          {loading ? (t("buttons.deleting") || "Silinir...") : (t("buttons.delete") || "Sil")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
