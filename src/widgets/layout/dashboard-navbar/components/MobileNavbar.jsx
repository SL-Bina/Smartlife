import React from "react";
import { IconButton, Typography } from "@material-tailwind/react";
import { Bars3Icon, BuildingOfficeIcon } from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenSidenav, useManagementEnhanced, useMtkColor } from "@/context";
import { DarkModeToggle } from "./DarkModeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";

export function MobileNavbar({ pageTitle, navbarHoverEffects }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;
  const { mtk } = useManagementEnhanced();
  const { colorCode } = useMtkColor();
  
  // MTK rəng kodunu al (mtk-dan və ya context-dən)
  const mtkColorCode = mtk?.meta?.color_code || colorCode;
  
  // Rəng kodunu rgba-ya çevir
  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Mobil cihazlarda hover effects-i azalt (touch cihazlarda hover işləmir)
  const hoverClass = navbarHoverEffects === "enabled" 
    ? "active:scale-110 active:brightness-110 transition-all duration-200 ease-out" 
    : "active:scale-95";

  return (
    <div className="flex md:hidden items-center justify-between w-full gap-2 sm:gap-3">
      {/* Left: Hamburger + MTK + Title */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
        <IconButton
          variant="text"
          color="blue-gray"
          className={`dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0 rounded-full transition-all p-1.5 sm:p-2 ${
            navbarHoverEffects === "enabled" ? "active:scale-110 active:rotate-12 active:shadow-lg" : "active:scale-95"
          }`}
          onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          size="sm"
        >
          <Bars3Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 dark:text-gray-300" />
        </IconButton>
        
        {/* MTK Badge - Mobile */}
        {mtk && (
          <div 
            className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-md border flex-shrink-0"
            style={{
              background: mtkColorCode 
                ? `linear-gradient(to right, ${getRgbaColor(mtkColorCode, 0.15)}, ${getRgbaColor(mtkColorCode, 0.1)})`
                : "linear-gradient(to right, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.1))",
              borderColor: mtkColorCode 
                ? getRgbaColor(mtkColorCode, 0.3)
                : "rgba(59, 130, 246, 0.3)",
            }}
          >
            <BuildingOfficeIcon 
              className="h-3.5 w-3.5 flex-shrink-0"
              style={{
                color: mtkColorCode || "#3b82f6"
              }}
            />
            <Typography 
              variant="small" 
              className="text-[10px] font-semibold truncate max-w-[80px]"
              style={{
                color: mtkColorCode || "#1e40af"
              }}
            >
              {mtk.name}
            </Typography>
          </div>
        )}
        
        <Typography
          variant="h6"
          className={`text-gray-900 dark:text-white text-sm sm:text-base font-bold truncate ${hoverClass}`}
        >
          {pageTitle}
        </Typography>
      </div>

      {/* Right: Actions - All Separate */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <div className={hoverClass}>
          <DarkModeToggle isMobile={true} />
        </div>
        <div className={hoverClass}>
          <LanguageSelector isMobile={true} />
        </div>
        <div className={hoverClass}>
          <NotificationsMenu isMobile={true} />
        </div>
        <div className={hoverClass}>
          <UserMenu isMobile={true} />
        </div>
      </div>
    </div>
  );
}
