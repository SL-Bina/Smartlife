import React from "react";
import { Typography } from "@material-tailwind/react";

export function BuildingsHeader() {
  return (
    <div className="mb-4">
      <Typography variant="h4" className="text-blue-gray-900 dark:text-white">
        Binalar
      </Typography>
      <Typography className="text-blue-gray-500 dark:text-gray-400">
        Bina siyahısı, MTK + kompleks üzrə filter, yarat / edit / sil
      </Typography>
    </div>
  );
}
