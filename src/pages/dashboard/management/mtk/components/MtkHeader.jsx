import React from "react";
import { Typography } from "@material-tailwind/react";

export function MtkHeader() {
  return (
    <div>
      <Typography variant="h4" className="text-blue-gray-900 dark:text-white font-bold mb-2">
        MTK İdarəetməsi
      </Typography>
      <Typography className="text-blue-gray-500 dark:text-gray-400 text-sm">
        MTK siyahısı, yarat / edit / sil və kompleksə keçid
      </Typography>
    </div>
  );
}
