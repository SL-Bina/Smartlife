import React from "react";
import { NavLink } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { useTranslation } from "react-i18next";

export function SidenavSubMenuItem({ icon, name, path, layout, isParentPath }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { t } = useTranslation();

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
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-500/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              onClick={() => {
                if (window.innerWidth < 1280) {
                  setOpenSidenav(dispatch, false);
                }
              }}
            >
              <div
                className={`flex-shrink-0 w-5 h-5 xl:w-6 xl:h-6 rounded-md flex items-center justify-center ${
                  isActive
                    ? "bg-white/20"
                    : "bg-gray-200/30 dark:bg-gray-700/30"
                }`}
              >
                {React.cloneElement(icon, {
                  className: `w-3 h-3 xl:w-3.5 xl:h-3.5 ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`,
                })}
              </div>
              <Typography
                variant="small"
                className={`text-xs xl:text-sm font-medium truncate ${
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

