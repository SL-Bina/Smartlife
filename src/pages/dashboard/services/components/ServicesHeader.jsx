import React from "react";
import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/outline";
import { useMtkColor } from "@/store/hooks/useMtkColor";

const SVG_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C%2Fsvg%3E")`;

export function ServicesHeader() {
  const { t } = useTranslation();
  const { getRgba, getActiveGradient } = useMtkColor();

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 mt-2 sm:mt-3 md:mt-4"
      style={{
        background: getActiveGradient(0.9, 0.7),
        border: `1px solid ${getRgba(0.3)}`,
        position: "relative",
        zIndex: 0,
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: SVG_PATTERN }} />
      </div>

      <div className="relative flex items-center gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30"
            style={{ backgroundColor: getRgba(0.2) }}
          >
            <WrenchScrewdriverIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <Typography variant="h4" className="text-white font-bold mb-0.5 sm:mb-1 text-base sm:text-lg md:text-xl lg:text-2xl">
            {t("services.pageTitle") || "Servisl\u0259rin \u0130dar\u0259etm\u0259si"}
          </Typography>
          <Typography className="text-white/90 text-xs sm:text-sm font-medium">
            {t("services.pageSubtitle") || "Servisl\u0259ri yarat, redakt\u0259 et, sil v\u0259 izl\u0259"}
          </Typography>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-white/5 rounded-full -mr-10 sm:-mr-16 -mt-10 sm:-mt-16" />
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12" />
    </div>
  );
}

