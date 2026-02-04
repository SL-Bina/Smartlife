import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Typography } from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";

export function ConfiguratorSection({
  title,
  icon,
  iconColor = "from-blue-500 to-blue-600",
  isOpen,
  onToggle,
  children,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${iconColor} flex items-center justify-center shadow-md`}>
            {icon}
          </div>
          <Typography
            variant="h6"
            className="font-semibold text-gray-900 dark:text-white text-sm"
          >
            {title}
          </Typography>
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          } text-gray-400 dark:text-gray-500`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-gray-100 dark:border-gray-700"
          >
            <div className="p-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

