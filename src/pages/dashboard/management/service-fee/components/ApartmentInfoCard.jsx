import React from "react";
import { useTranslation } from "react-i18next";
import { CustomCard } from "@/components/ui/CustomCard";
import { CustomTypography } from "@/components/ui/CustomTypography";

export function ApartmentInfoCard({ property }) {
  const { t } = useTranslation();

  if (!property) return null;

  const apartmentNumber = property?.meta?.apartment_number || property?.name || "—";
  const floor = property?.meta?.floor || "—";
  const area = property?.meta?.area ? `${property.meta.area} m²` : "—";
  const blockName = property?.block?.name || property?.sub_data?.block?.name || property?.blockName || "—";
  const complexName = property?.complex?.name || property?.sub_data?.complex?.name || "—";
  const buildingName = property?.building?.name || property?.sub_data?.building?.name || "—";
  const mtkName = property?.mtk?.name || property?.sub_data?.mtk?.name || "—";

  return (
    <CustomCard className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <CustomTypography variant="h6" className="dark:text-white">
          Mənzil Məlumatları
        </CustomTypography>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <CustomTypography variant="small" className="text-gray-600 dark:text-gray-400 mb-1">
              Mənzil nömrəsi
            </CustomTypography>
            <CustomTypography variant="small" className="font-semibold text-gray-900 dark:text-white">
              {apartmentNumber}
            </CustomTypography>
          </div>
          <div>
            <CustomTypography variant="small" className="text-gray-600 dark:text-gray-400 mb-1">
              Mərtəbə
            </CustomTypography>
            <CustomTypography variant="small" className="font-semibold text-gray-900 dark:text-white">
              {floor}
            </CustomTypography>
          </div>
          <div>
            <CustomTypography variant="small" className="text-gray-600 dark:text-gray-400 mb-1">
              Sahə
            </CustomTypography>
            <CustomTypography variant="small" className="font-semibold text-gray-900 dark:text-white">
              {area}
            </CustomTypography>
          </div>
          <div>
            <CustomTypography variant="small" className="text-gray-600 dark:text-gray-400 mb-1">
              Blok
            </CustomTypography>
            <CustomTypography variant="small" className="font-semibold text-gray-900 dark:text-white">
              {blockName}
            </CustomTypography>
          </div>
          <div>
            <CustomTypography variant="small" className="text-gray-600 dark:text-gray-400 mb-1">
              Kompleks
            </CustomTypography>
            <CustomTypography variant="small" className="font-semibold text-gray-900 dark:text-white">
              {complexName}
            </CustomTypography>
          </div>
          <div>
            <CustomTypography variant="small" className="text-gray-600 dark:text-gray-400 mb-1">
              Bina
            </CustomTypography>
            <CustomTypography variant="small" className="font-semibold text-gray-900 dark:text-white">
              {buildingName}
            </CustomTypography>
          </div>
          <div>
            <CustomTypography variant="small" className="text-gray-600 dark:text-gray-400 mb-1">
              MTK
            </CustomTypography>
            <CustomTypography variant="small" className="font-semibold text-gray-900 dark:text-white">
              {mtkName}
            </CustomTypography>
          </div>
        </div>
      </div>
    </CustomCard>
  );
}

