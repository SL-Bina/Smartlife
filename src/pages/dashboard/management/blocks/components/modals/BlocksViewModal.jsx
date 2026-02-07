import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";

export function BlocksViewModal({ open, onClose, item }) {
  if (!item) return null;

  return (
    <Dialog open={!!open} handler={onClose} size="lg" className="dark:bg-gray-800">
      <DialogHeader className="dark:text-white">Blok məlumatları</DialogHeader>

      <DialogBody className="dark:text-gray-200">
        <div className="flex flex-col gap-4">
          <div>
            <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400 mb-1">
              Ad
            </Typography>
            <Typography className="text-blue-gray-900 dark:text-white font-semibold">{item.name || "—"}</Typography>
          </div>

          <div>
            <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400 mb-1">
              ID
            </Typography>
            <Typography className="text-blue-gray-900 dark:text-white">{item.id || "—"}</Typography>
          </div>

          <div>
            <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400 mb-1">
              Kompleks
            </Typography>
            <Typography className="text-blue-gray-900 dark:text-white">
              {item?.complex?.name || "—"}
            </Typography>
          </div>

          <div>
            <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400 mb-1">
              Bina
            </Typography>
            <Typography className="text-blue-gray-900 dark:text-white">
              {item?.building?.name || "—"}
            </Typography>
          </div>

          <div>
            <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400 mb-1">
              Mərtəbə sayı
            </Typography>
            <Typography className="text-blue-gray-900 dark:text-white">
              {item?.meta?.total_floor || "—"}
            </Typography>
          </div>

          <div>
            <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400 mb-1">
              Mənzil sayı
            </Typography>
            <Typography className="text-blue-gray-900 dark:text-white">
              {item?.meta?.total_apartment || "—"}
            </Typography>
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="flex gap-2">
        <Button variant="outlined" color="blue-gray" onClick={onClose} className="dark:text-gray-300">
          Bağla
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

