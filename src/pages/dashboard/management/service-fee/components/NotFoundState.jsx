import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function NotFoundState() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Typography variant="h6" color="blue-gray" className="dark:text-white">
        {t("serviceFee.notFound")}
      </Typography>
      <Button
        variant="text"
        color="blue"
        onClick={() => navigate("/dashboard/management/properties")}
        className="mt-4 dark:text-blue-400 dark:hover:bg-blue-900/20"
      >
        {t("serviceFee.goBack")}
      </Button>
    </div>
  );
}

