import React from "react";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useMaterialTailwindController } from "@/store/exports";

export function SidenavSection({ title }) {
  const [controller] = useMaterialTailwindController();
  const { sidenavSize } = controller;

  // Size-based text classes
  const getTextSize = (small, medium, large) => {
    if (sidenavSize === "small") return small;
    if (sidenavSize === "large") return large;
    return medium;
  };

  if (!title) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="px-2 xl:px-3 mb-2 xl:mb-3"
    >
      <Typography
        variant="small"
        className={`${getTextSize("text-[9px] xl:text-[10px]", "text-[10px] xl:text-[11px]", "text-[11px] xl:text-xs")} font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500`}
      >
        {title}
      </Typography>
    </motion.div>
  );
}

