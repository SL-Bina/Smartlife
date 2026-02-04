import React from "react";
import { Link } from "react-router-dom";
import { IconButton, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";

export function SidenavHeader({ brandName, collapsed = false }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavSize } = controller;
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  // ✅ realtime clock
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Size-based classes
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

  // ---- Date/Time formatting (AZ default) ----
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

  // ✅ istəsən buraya real wallpaper şəkli ver:
  // məsələn: "/images/ios-wallpaper.jpg"
  const IOS_WALLPAPER_URL = ""; // <- boş qalsa gradient işləyəcək

  const iosWallpaperStyle = IOS_WALLPAPER_URL
    ? { backgroundImage: `url(${IOS_WALLPAPER_URL})` }
    : {
      backgroundImage:
        "radial-gradient(1200px 500px at 20% 10%, rgba(255,255,255,.25), transparent 60%)," +
        "radial-gradient(900px 400px at 80% 20%, rgba(255,0,85,.18), transparent 55%)," +
        "radial-gradient(900px 500px at 50% 90%, rgba(0,150,255,.18), transparent 60%)," +
        "linear-gradient(135deg, rgba(15,23,42,.95), rgba(17,24,39,.92))",
    };

  return (
    <div
      className={`relative flex-shrink-0 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-red-600/5 via-red-500/3 to-transparent dark:from-red-600/10 dark:via-red-500/5 dark:to-transparent ${collapsed ? "px-2 py-3 xl:px-2 xl:py-4" : "px-3 py-3 xl:px-6 xl:py-6"
        }`}
    >
      <Link
        to="/"
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
              src="/Vector_Logo/color_logo.svg"
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
          <div className="flex flex-col gap-0.5 xl:gap-1 min-w-0 flex-1 xl:flex-none xl:items-center">
            <Typography
              variant="h5"
              className={`font-bold ${getTextSize(
                "text-sm xl:text-base",
                "text-base xl:text-xl",
                "text-lg xl:text-2xl"
              )} bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent truncate xl:truncate-none`}
            >
              {brandName}
            </Typography>

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
          </div>
        )}
      </Link>

      {/* ✅ iOS-style mini “lockscreen clock” container */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mt-4 xl:mt-5"
        >
          <div
            className="
              relative overflow-hidden
              rounded-3xl
              border border-white/10 dark:border-white/10
              shadow-[0_18px_50px_rgba(0,0,0,.25)]
            "
            style={iosWallpaperStyle}
          >
            <div className="absolute inset-0 bg-white/5 dark:bg-black/15" />

            {/* <div className="absolute left-1/2 top-2 -translate-x-1/2 h-[10px] w-[110px] rounded-full bg-black/25 dark:bg-black/40" /> */}

            <div className="relative px-4 py-4 xl:px-5 xl:py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] xl:text-xs text-white/80 capitalize truncate">
                    {dateText}
                  </div>

                  <div className="mt-2 flex items-end gap-2">
                    <div className="text-4xl xl:text-5xl font-semibold tracking-tight text-white drop-shadow">
                      {hh}:{mm}
                    </div>
                    <div className="pb-1 text-sm xl:text-base font-semibold text-white/85">
                      {ss}
                    </div>
                  </div>

                  {/* <div className="mt-2 text-[11px] xl:text-xs text-white/75">
                    {t("sidebar.liveTime") || "Canlı saat • real-time"}
                  </div> */}
                </div>

                {/* <div className="shrink-0">
                  <div className="rounded-2xl bg-black/25 dark:bg-black/35 px-3 py-2 border border-white/10">
                    <div className="text-[10px] xl:text-[11px] text-white/80">
                      {t("sidebar.status") || "Status"}
                    </div>
                    <div className="text-xs xl:text-sm font-semibold text-white">
                      {t("common.active") || "Aktiv"}
                    </div>
                  </div>
                </div> */}
              </div>

              <div className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
            </div>
          </div>
        </motion.div>
      )}

      <IconButton
        variant="text"
        size="sm"
        ripple={false}
        className="absolute right-2 top-2 xl:right-4 xl:top-4 xl:hidden !p-2 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-lg xl:rounded-xl transition-all duration-200 hover:scale-110"
        onClick={() => setOpenSidenav(dispatch, false)}
      >
        <XMarkIcon className="h-4 w-4 xl:h-5 xl:w-5 text-gray-700 dark:text-gray-300" />
      </IconButton>
    </div>
  );
}
