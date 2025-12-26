import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export function MtkDeleteModal({ open, onClose, mtk, onConfirm, deleting = false }) {
  const { t } = useTranslation();

  if (!open || !mtk) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="sm"
      className="dark:bg-gray-900 border border-red-600 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="dark:bg-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
          <Typography variant="h5" className="font-bold">
            {t("mtk.delete.title") || "MTK Sil"}
          </Typography>
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700 py-4">
        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
          {t("mtk.delete.message") || "Bu MTK-nı silmək istədiyinizə əminsiniz?"}
          <br />
          <strong className="text-gray-900 dark:text-white">{mtk.name}</strong> (ID: {mtk.id})
        </Typography>
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <Typography variant="small" className="text-red-700 dark:text-red-300">
            {t("mtk.delete.warning") || "Bu əməliyyat geri alına bilməz."}
          </Typography>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          disabled={deleting}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 min-w-[100px]"
        >
          {t("buttons.cancel") || t("mtk.edit.cancel")}
        </Button>
        <Button
          color="red"
          onClick={onConfirm}
          disabled={deleting}
          className="dark:bg-red-600 dark:hover:bg-red-700 min-w-[100px]"
        >
          {deleting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("mtk.deleting") || "Silinir..."}
            </span>
          ) : (
            t("buttons.delete") || t("mtk.actions.delete")
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

