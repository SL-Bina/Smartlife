import React from "react";
import { useTranslation } from "react-i18next";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Typography } from "@material-tailwind/react";
import { useComplexColor } from "@/hooks/useComplexColor";

export function ProfileHeader() {
  const { t } = useTranslation();
  const { headerStyle } = useComplexColor();

  return (
    <div className="p-4 sm:p-6 rounded-xl shadow-lg mb-3 flex-shrink-0 border" style={headerStyle}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <UserCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </div>
        <div>
          <Typography variant="h4" className="text-white font-bold">
            {t("profile.pageTitle") || "Profil"}
          </Typography>
          <Typography variant="small" className="text-white/80">
            {t("profile.subtitle") || "Hesab məlumatlarınız"}
          </Typography>
        </div>
      </div>
    </div>
  );
}

