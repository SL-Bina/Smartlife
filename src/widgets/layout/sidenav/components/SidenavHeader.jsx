import React from "react";
import { Link } from "react-router-dom";
import { IconButton, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";
import { setOpenSidenav } from "@/store/slices/uiSlice";
import { useAppDispatch } from "@/store/hooks";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/store/hooks/useAuth";
import { useSelector } from "react-redux";

export function SidenavHeader({ brandName, collapsed = false, isLowHeight = false, homePath = "/dashboard/home" }) {
  // homePath artıq tam absolute path-dir (məs: /resident/home və ya /dashboard/home)
  const [controller, actions] = useMaterialTailwindController();
  const { sidenavSize } = controller;
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const selectedProperty = useSelector((state) => state.property.selectedProperty);
  const [isMobile, setIsMobile] = React.useState(false);

  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const getTextSize = (small, medium, large) => {
    if (sidenavSize === "small") return small;
    if (sidenavSize === "large") return large;
    return medium;
  };

  const getIconSize = (small, medium, large) => {
    if (sidenavSize === "small") return small;
    if (sidenavSize === "large") return large;
    return medium;
  };

  const getLogoSize = (small, medium, large) => {
    if (sidenavSize === "small") return small;
    if (sidenavSize === "large") return large;
    return medium;
  };

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const locale = i18n?.language || "az-AZ";

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  const dateText = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(now);

  const getHeaderPadding = () => {
    if (collapsed) return "px-2 py-2 xl:px-2 xl:py-3";
    if (isLowHeight) return "px-3 py-2 xl:px-4 xl:py-3";
    return "px-3 py-3 xl:px-6 xl:py-5";
  };

  // compute header gradient based on complex color if available
  const complexColor =
    selectedProperty?.sub_data?.complex?.meta?.color_code ||
    selectedProperty?.sub_data?.mtk?.meta?.color_code ||
    null;
  const headerStyle = complexColor
    ? { background: complexColor }
    : null;

  return (
    <div
      className={`relative flex-shrink-0 border-b border-gray-200/50 dark:border-gray-700/50 ${getHeaderPadding()}`}
      style={headerStyle}
    >
      <Link
        to={homePath}
        className={`flex items-center gap-2.5 group relative ${collapsed ? "xl:justify-center" : "xl:flex-col xl:gap-3"
          }`}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
          <div
            className={`rounded-xl bg-white flex items-center justify-center shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 group-hover:shadow-xl group-hover:shadow-gray-300/50 dark:group-hover:shadow-gray-800/50 transition-all duration-300 relative overflow-hidden border border-gray-200/50 dark:border-gray-700/50 ${collapsed
              ? getLogoSize("w-10 h-10 xl:w-10 xl:h-10", "w-10 h-10 xl:w-12 xl:h-12", "w-12 h-12 xl:w-14 xl:h-14")
              : getLogoSize("w-10 h-10 xl:w-16 xl:h-16", "w-12 h-12 xl:w-20 xl:h-20 xl:rounded-2xl", "w-14 h-14 xl:w-24 xl:h-24 xl:rounded-2xl")
              }`}
          >
            <img
              src={
                selectedProperty?.sub_data?.complex?.logo ||
                selectedProperty?.sub_data?.complex?.meta?.logo ||
                "/Vector_Logo/color_logo.svg"
              }
              alt="Logo"
              className={`object-contain ${collapsed
                ? getIconSize("w-7 h-7 xl:w-6 xl:h-6", "w-6 h-6 xl:w-7 xl:h-7", "w-7 h-7 xl:w-8 xl:h-8")
                : getIconSize("w-8 h-8 xl:w-10 xl:h-10", "w-8 h-8 xl:w-14 xl:h-14", "w-10 h-10 xl:w-18 xl:h-18")
                }`}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-700/30 dark:to-transparent" />
          </div>
        </motion.div>

        {!collapsed && (
          <div className={`flex flex-col ${isLowHeight ? "gap-0.5" : "gap-0.5 xl:gap-1"} min-w-0 flex-1 xl:flex-none xl:items-center`}>
            <Typography
              variant="h5"
              className={`font-bold ${getTextSize(
                isLowHeight ? "text-xs xl:text-sm" : "text-sm xl:text-base",
                isLowHeight ? "text-sm xl:text-base" : "text-base xl:text-xl",
                isLowHeight ? "text-base xl:text-lg" : "text-lg xl:text-2xl"
              )} bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent truncate xl:truncate-none`}
            >
              {brandName}
            </Typography>

            {!isLowHeight && (
              <div className="flex flex-col gap-0.5 xl:gap-1 xl:items-center">
                <Typography
                  variant="small"
                  className={`${getTextSize(
                    "text-[10px] xl:text-xs",
                    "text-xs xl:text-sm",
                    "text-sm xl:text-base"
                  )} font-medium text-gray-600 dark:text-gray-400`}
                >
                  {t("sidebar.welcome") || "Xoş gəldin"}
                </Typography>

                {user?.username && (
                  <Typography
                    variant="small"
                    className={`${getTextSize(
                      "text-xs xl:text-sm",
                      "text-sm xl:text-base",
                      "text-base xl:text-lg"
                    )} font-semibold text-gray-900 dark:text-white truncate xl:truncate-none`}
                  >
                    {user.username}
                  </Typography>
                )}
              </div>
            )}
          </div>
        )}
      </Link>

      {!collapsed && !isLowHeight && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`${isLowHeight ? "hidden" : "mt-2 xl:mt-3"}`}
        >
          <div
            className="
              relative overflow-hidden
              rounded-3xl xl:rounded-[2rem]
              backdrop-blur-3xl backdrop-saturate-150
              bg-gradient-to-br from-white/30 via-white/15 to-white/10
              dark:from-white/10 dark:via-white/5 dark:to-black/20
              border border-white/30 dark:border-white/15
              shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.3)]
              dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]
            "
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent dark:from-white/15 dark:via-white/5 dark:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/3 to-transparent dark:from-black/8 dark:to-transparent" />
            
            <div className="absolute inset-[1px] rounded-3xl xl:rounded-[2rem] bg-gradient-to-br from-white/20 via-transparent to-transparent dark:from-white/8 dark:to-transparent pointer-events-none" />
            
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/25 to-transparent dark:from-white/10 dark:to-transparent rounded-t-3xl xl:rounded-t-[2rem] pointer-events-none" />

            <div className={`relative ${isLowHeight ? "px-3 py-2.5 xl:px-4 xl:py-3" : "px-4 py-3.5 xl:px-5 xl:py-4"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className={`${isLowHeight ? "text-[9px] xl:text-[10px]" : "text-[10px] xl:text-[11px]"} text-gray-800/90 dark:text-white/90 capitalize truncate font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]`}>
                    {dateText}
                  </div>

                  <div className={`${isLowHeight ? "mt-0.5" : "mt-1.5"} flex items-end gap-1.5`}>
                    <div className={`${isLowHeight ? "text-xl xl:text-2xl" : "text-2xl xl:text-3xl"} font-bold tracking-tight text-gray-900 dark:text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.2)]`}>
                      {hh}:{mm}
                    </div>
                    <div className={`pb-0.5 ${isLowHeight ? "text-[10px] xl:text-xs" : "text-xs xl:text-sm"} font-semibold text-gray-700/90 dark:text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.15)]`}>
                      {ss}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -bottom-6 left-1/2 h-16 w-56 -translate-x-1/2 rounded-full bg-gradient-to-t from-gray-300/15 via-gray-200/10 to-transparent dark:from-white/8 dark:via-white/5 dark:to-transparent blur-2xl" />
            </div>
          </div>
        </motion.div>
      )}

      <IconButton
        variant="text"
        size="sm"
        ripple={false}
        className="absolute right-2 top-2 xl:right-4 xl:top-4 xl:hidden !p-2 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-lg xl:rounded-xl transition-all duration-200 hover:scale-110"
        onClick={() => actions.setOpenSidenav(false)}
      >
        <XMarkIcon className="h-4 w-4 xl:h-5 xl:w-5 text-gray-700 dark:text-gray-300" />
      </IconButton>
    </div>
  );
}
