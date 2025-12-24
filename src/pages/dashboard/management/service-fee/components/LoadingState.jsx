import React from "react";
import { Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function LoadingState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Spinner className="h-8 w-8" />
      <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
        {t("serviceFee.loading")}
      </Typography>
    </div>
  );
}

