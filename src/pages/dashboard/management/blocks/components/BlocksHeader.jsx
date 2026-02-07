import React from "react";
import { Typography } from "@material-tailwind/react";

export function BlocksHeader() {
  return (
    <div className="mb-4">
      <Typography variant="h4" className="text-blue-gray-900 dark:text-white">
        Bloklar
      </Typography>
      <Typography className="text-blue-gray-500 dark:text-gray-400">
        Blok siyahısı, MTK + kompleks + bina üzrə filter, yarat / edit / sil
      </Typography>
    </div>
  );
}
