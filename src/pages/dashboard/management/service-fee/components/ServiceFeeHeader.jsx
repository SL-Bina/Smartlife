import React from "react";
import { Button } from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function ServiceFeeHeader({ apartmentNumber }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="w-full bg-black dark:bg-gray-800 my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <Button
          variant="text"
          color="white"
          className="p-2 dark:text-white dark:hover:bg-gray-800"
          onClick={() => navigate("/dashboard/management/properties")}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h3 className="text-white font-bold">
          {t("serviceFee.pageTitle")} - {apartmentNumber}
        </h3>
      </div>
    </div>
  );
}

