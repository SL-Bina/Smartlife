import React from "react";
import { NavLink } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useTranslation } from "react-i18next";

export function SidenavSubMenuItem({ icon, name, path, layout, isParentPath, mtkColorCode = null }) {
  
  // Rəng kodunu rgba-ya çevir
  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Aktiv menu item üçün rəng
  const getActiveGradient = () => {
    if (mtkColorCode) {
      const color1 = getRgbaColor(mtkColorCode, 0.9);
      const color2 = getRgbaColor(mtkColorCode, 1);
      return {
        background: `linear-gradient(to right, ${color1}, ${color2})`,
        boxShadow: `0 4px 6px -1px ${getRgbaColor(mtkColorCode, 0.3)}, 0 2px 4px -1px ${getRgbaColor(mtkColorCode, 0.2)}`,
      };
    }
    return {};
  };
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavSize } = controller;
  const { t } = useTranslation();

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

  const getIconBoxSize = (small, medium, large) => {
    if (sidenavSize === "small") return small;
    if (sidenavSize === "large") return large;
    return medium;
  };

  return (
    <li>
      <NavLink
        to={`/${layout}${path}`}
        end={isParentPath}
      >
        {({ isActive }) => (
          <motion.div
            whileHover={{ x: 4 }}
            transition={{
              type: "spring",
              stiffness: 400,
            }}
          >
            <div
              className={`flex items-center gap-2 xl:gap-2.5 px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg xl:rounded-lg transition-all duration-200 ${
                isActive
                  ? mtkColorCode ? "text-white" : "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-500/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              style={isActive && mtkColorCode ? getActiveGradient() : {}}
              onClick={() => {
                if (window.innerWidth < 1280) {
                  setOpenSidenav(dispatch, false);
                }
              }}
            >
              <div
                className={`flex-shrink-0 ${getIconBoxSize("w-4 h-4 xl:w-5 xl:h-5", "w-5 h-5 xl:w-6 xl:h-6", "w-6 h-6 xl:w-7 xl:h-7")} rounded-md flex items-center justify-center ${
                  isActive
                    ? "bg-white/20"
                    : "bg-gray-200/30 dark:bg-gray-700/30"
                }`}
              >
                {React.cloneElement(icon, {
                  className: `${getIconSize("w-2.5 h-2.5 xl:w-3 xl:h-3", "w-3 h-3 xl:w-3.5 xl:h-3.5", "w-3.5 h-3.5 xl:w-4 xl:h-4")} ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`,
                })}
              </div>
              <Typography
                variant="small"
                className={`${getTextSize("text-[10px] xl:text-xs", "text-xs xl:text-sm", "text-sm xl:text-base")} font-medium truncate ${
                  isActive
                    ? "text-white"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {name.startsWith("sidebar.")
                  ? t(name)
                  : name}
              </Typography>
            </div>
          </motion.div>
        )}
      </NavLink>
    </li>
  );
}

