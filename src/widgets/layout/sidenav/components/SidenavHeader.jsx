import React from "react";
import { Link } from "react-router-dom";
import { IconButton, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/auth-context";

export function SidenavHeader({ brandName, collapsed = false }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={`relative flex-shrink-0 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-br from-red-600/5 via-red-500/3 to-transparent dark:from-red-600/10 dark:via-red-500/5 dark:to-transparent ${
      collapsed ? "px-2 py-3 xl:px-2 xl:py-4" : "px-3 py-3 xl:px-6 xl:py-6"
    }`}>
      <Link 
        to="/" 
        className={`flex items-center gap-2.5 group relative ${
          collapsed ? "xl:justify-center" : "xl:flex-col xl:gap-3"
        }`}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <div className={`rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 group-hover:shadow-xl group-hover:shadow-gray-300/50 dark:group-hover:shadow-gray-800/50 transition-all duration-300 relative overflow-hidden border border-gray-200/50 dark:border-gray-700/50 ${
            collapsed ? "w-10 h-10 xl:w-12 xl:h-12" : "w-12 h-12 xl:w-20 xl:h-20 xl:rounded-2xl"
          }`}>
            <img 
              src="/img/logo-jira.svg" 
              alt="Logo" 
              className={`object-contain ${
                collapsed ? "w-6 h-6 xl:w-7 xl:h-7" : "w-8 h-8 xl:w-14 xl:h-14"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-gray-700/30 dark:to-transparent"></div>
          </div>
        </motion.div>
        {!collapsed && (
          <div className="flex flex-col gap-0.5 xl:gap-1 min-w-0 flex-1 xl:flex-none xl:items-center">
            <Typography
              variant="h5"
              className="font-bold text-base xl:text-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent truncate xl:truncate-none"
            >
              {brandName}
            </Typography>
            <div className="flex flex-col gap-0.5 xl:gap-1 xl:items-center">
              <Typography
                variant="small"
                className="text-xs xl:text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                {t("sidebar.welcome") || "Xoş gəldin"}
              </Typography>
              {user?.username && (
                <Typography
                  variant="small"
                  className="text-sm xl:text-base font-semibold text-gray-900 dark:text-white truncate xl:truncate-none"
                >
                  {user.username}
                </Typography>
              )}
            </div>
          </div>
        )}
      </Link>
      {/* Mobile close button */}
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

