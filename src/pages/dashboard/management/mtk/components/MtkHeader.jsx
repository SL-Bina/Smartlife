import React from "react";
import { Typography } from "@material-tailwind/react";

export function MtkHeader() {
  return (
    <div className="mb-4">
      <Typography variant="h4" className="text-blue-gray-900 dark:text-white">
        MTK
      </Typography>
      <Typography className="text-blue-gray-500 dark:text-gray-400">
        MTK siyahısı, yarat / edit / sil və kompleksə keçid
      </Typography>
    </div>
  );
}
