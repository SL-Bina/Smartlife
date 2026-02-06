import React from "react";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomTypography } from "@/components/ui/CustomTypography";

export function ServiceFeeHeader({ propertyName, onBack, onCreate }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <CustomButton
            variant="outlined"
            onClick={onBack}
            className="p-2 dark:text-gray-300 dark:border-gray-600"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </CustomButton>
        )}
        <div>
          <CustomTypography variant="h5" className="dark:text-white font-bold">
            Service Fee-lər
          </CustomTypography>
          <CustomTypography variant="small" className="text-gray-600 dark:text-gray-400 mt-1">
            {propertyName}
          </CustomTypography>
        </div>
      </div>
      {onCreate && (
        <CustomButton
          onClick={onCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni Service Fee
        </CustomButton>
      )}
    </div>
  );
}

