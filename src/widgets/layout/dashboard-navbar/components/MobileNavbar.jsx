import React from "react";
import { Bars3Icon, BuildingOfficeIcon } from "@heroicons/react/24/solid";
import { useMaterialTailwindController, setOpenSidenav } from "@/store/exports";
import { DarkModeToggle } from "./DarkModeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";

export function MobileNavbar({ pageTitle, navbarHoverEffects }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;
  const mtk = null;
  const mtkColorCode = null;

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSidenav(dispatch, !openSidenav);
  };

  return (
    <div 
      className="flex md:hidden items-center justify-between w-full px-3 sm:px-4 py-2.5 sm:py-3 gap-2 sm:gap-3"
      style={{ 
        position: 'relative',
        zIndex: 1001,
      }}
    >
      {/* Left: Hamburger + MTK + Title */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0 overflow-hidden">
        {/* Hamburger Button */}
        <button
          type="button"
          onClick={handleMenuClick}
          className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 active:bg-gray-200 dark:active:bg-gray-600 transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md active:shadow-sm"
          aria-label="Menu aç"
          style={{ 
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            minWidth: '44px',
            minHeight: '44px',
          }}
        >
          <Bars3Icon className="h-6 w-6 sm:h-7 sm:w-7 text-gray-700 dark:text-gray-300" strokeWidth={2.5} />
        </button>

        {/* MTK Badge - Mobile */}
        {mtk && (
          <div 
            className="hidden xs:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border flex-shrink-0 shadow-sm backdrop-blur-sm"
            style={{
              background: mtkColorCode 
                ? `linear-gradient(to right, rgba(${parseInt(mtkColorCode.slice(1, 3), 16)}, ${parseInt(mtkColorCode.slice(3, 5), 16)}, ${parseInt(mtkColorCode.slice(5, 7), 16)}, 0.15), rgba(${parseInt(mtkColorCode.slice(1, 3), 16)}, ${parseInt(mtkColorCode.slice(3, 5), 16)}, ${parseInt(mtkColorCode.slice(5, 7), 16)}, 0.1))`
                : "linear-gradient(to right, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.1))",
              borderColor: mtkColorCode 
                ? `rgba(${parseInt(mtkColorCode.slice(1, 3), 16)}, ${parseInt(mtkColorCode.slice(3, 5), 16)}, ${parseInt(mtkColorCode.slice(5, 7), 16)}, 0.3)`
                : "rgba(59, 130, 246, 0.3)",
            }}
          >
            <BuildingOfficeIcon 
              className="h-4 w-4 flex-shrink-0"
              style={{
                color: mtkColorCode || "#3b82f6"
              }}
            />
            <span 
              className="text-[10px] font-semibold truncate max-w-[80px]"
              style={{
                color: mtkColorCode || "#1e40af"
              }}
            >
              {mtk.name}
            </span>
          </div>
        )}

        {/* Page Title */}
        {/* <div className="flex-1 min-w-0 px-2 sm:px-3">
          <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
            {pageTitle}
          </h1>
        </div> */}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <div className="flex items-center">
          <DarkModeToggle isMobile={true} />
        </div>
        <div className="flex items-center">
          <LanguageSelector isMobile={true} />
        </div>
        <div className="flex items-center">
          <NotificationsMenu isMobile={true} />
        </div>
        <div className="flex items-center">
          <UserMenu isMobile={true} />
        </div>
      </div>
    </div>
  );
}
