import React from "react";
import { useTranslation } from "react-i18next";
import { CustomDialog } from "@/components/ui/CustomDialog";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomTypography } from "@/components/ui/CustomTypography";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function ServiceFeeDeleteModal({ open, onClose, onConfirm, serviceFee }) {
  const { t } = useTranslation();

  return (
    <CustomDialog open={open} onClose={onClose} size="md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CustomTypography variant="h6" className="dark:text-white">
                Service Fee Sil
              </CustomTypography>
              <CustomTypography variant="small" className="text-gray-600 dark:text-gray-400">
                Bu əməliyyat geri alına bilməz
              </CustomTypography>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="mb-6">
          <CustomTypography variant="small" className="text-gray-700 dark:text-gray-300">
            Əminsiniz ki, bu service fee-ni silmək istəyirsiniz?
          </CustomTypography>
          {serviceFee?.service?.name && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <CustomTypography variant="small" className="font-semibold text-gray-900 dark:text-white">
                {serviceFee.service.name}
              </CustomTypography>
              {serviceFee.price && (
                <CustomTypography variant="small" className="text-gray-600 dark:text-gray-400 mt-1">
                  Qiymət: {parseFloat(serviceFee.price).toFixed(2)} AZN
                </CustomTypography>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <CustomButton
            variant="outlined"
            onClick={onClose}
            className="dark:text-gray-300 dark:border-gray-600"
          >
            Ləğv et
          </CustomButton>
          <CustomButton
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Sil
          </CustomButton>
        </div>
      </div>
    </CustomDialog>
  );
}

