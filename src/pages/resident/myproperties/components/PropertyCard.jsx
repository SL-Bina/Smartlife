import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  HomeIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function PropertyCard({ property, onView }) {
  const { t } = useTranslation();

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden group">
      <CardBody className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <HomeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <Typography variant="h6" className="text-gray-800 dark:text-gray-200 font-bold">
                {property.name}
              </Typography>
            </div>
            <div className="space-y-1">
              {property.complex && (
                <div className="flex items-center gap-2">
                  <BuildingOfficeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                    {property.complex.name}
                  </Typography>
                </div>
              )}
              {property.mtk && (
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                    {property.mtk.name}
                  </Typography>
                </div>
              )}
            </div>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              property.status === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {property.status === "active" ? t("properties.status.active") || "Aktiv" : t("properties.status.inactive") || "Qeyri-aktiv"}
          </span>
        </div>

        {property.meta && (
          <div className="space-y-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {property.meta.area && (
              <div className="flex justify-between items-center">
                <Typography variant="small" className="text-gray-600 dark:text-gray-400 font-medium">
                  {t("properties.area") || "Sahə"}:
                </Typography>
                <Typography variant="small" className="text-gray-800 dark:text-gray-200 font-bold">
                  {property.meta.area} m²
                </Typography>
              </div>
            )}
            {property.meta.floor && (
              <div className="flex justify-between items-center">
                <Typography variant="small" className="text-gray-600 dark:text-gray-400 font-medium">
                  {t("properties.floor") || "Mərtəbə"}:
                </Typography>
                <Typography variant="small" className="text-gray-800 dark:text-gray-200 font-bold">
                  {property.meta.floor}
                </Typography>
              </div>
            )}
            {property.meta.apartment_number && (
              <div className="flex justify-between items-center">
                <Typography variant="small" className="text-gray-600 dark:text-gray-400 font-medium">
                  {t("properties.apartmentNumber") || "Mənzil nömrəsi"}:
                </Typography>
                <Typography variant="small" className="text-gray-800 dark:text-gray-200 font-bold">
                  {property.meta.apartment_number}
                </Typography>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outlined"
            size="sm"
            onClick={() => onView(property)}
            className="w-full flex items-center justify-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <EyeIcon className="h-4 w-4" />
            {t("properties.viewDetails") || "Ətraflı bax"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

