import React from "react";
import { Typography } from "@material-tailwind/react";

export function PropertiesHeader() {
  return (
    <div className="mb-4">
      <Typography variant="h4" className="text-blue-gray-900 dark:text-white">
        Mənzillər
      </Typography>
      <Typography className="text-blue-gray-500 dark:text-gray-400">
        Mənzil siyahısı, MTK + kompleks + bina + blok üzrə filter, mərtəbə görünüşü və table görünüşü
      </Typography>
    </div>
  );
}
