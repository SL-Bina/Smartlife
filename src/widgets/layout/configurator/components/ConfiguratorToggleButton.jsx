import React from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { IconButton } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { setOpenConfigurator } from "@/store/exports";

export function ConfiguratorToggleButton({ dispatch, openConfigurator, isMobile, sidenavPosition = "left" }) {
  if (isMobile) return null;

  return (
    <motion.div
      initial={false}
      animate={{
        scale: openConfigurator ? 0 : 1,
        opacity: openConfigurator ? 0 : 1,
        left: sidenavPosition === "right" ? 24 : "auto",
        right: sidenavPosition === "right" ? "auto" : 24,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="fixed bottom-6 z-50 hidden xl:block"
    >
      <IconButton
        variant="gradient"
        size="lg"
        className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
        onClick={() => setOpenConfigurator(dispatch, true)}
      >
        <Cog6ToothIcon className="h-6 w-6 text-white" />
      </IconButton>
    </motion.div>
  );
}

