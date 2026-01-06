import React from "react";
import { Button, Typography, IconButton } from "@material-tailwind/react";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ExpenseTypesHeader({ onCreateClick, onClose }) {
  const { t } = useTranslation();

  return (
    <div className="w-full ">
      <div className="flex items-center justify-between p-4 ">
        <Typography variant="h5" className="text-black dark:text-white font-bold">
          {t("expenseTypes.pageTitle") || "Xərc növləri"}
        </Typography>
        <div className="flex items-center gap-3">
          <Button
            color="blue"
            size="sm"
            className="flex items-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={onCreateClick}
          >
            <PlusCircleIcon className="h-4 w-4" />
            {t("expenseTypes.actions.add") || "Xərc növü əlavə et"}
          </Button>
          <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
            <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}

