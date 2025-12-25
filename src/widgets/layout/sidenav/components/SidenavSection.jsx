import React from "react";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

export function SidenavSection({ title }) {
  if (!title) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="px-2 xl:px-3 mb-2 xl:mb-3"
    >
      <Typography
        variant="small"
        className="text-[9px] xl:text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500"
      >
        {title}
      </Typography>
    </motion.div>
  );
}

