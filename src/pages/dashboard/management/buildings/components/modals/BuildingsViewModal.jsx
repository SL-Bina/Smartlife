import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Chip } from "@material-tailwind/react";

export function BuildingViewModal({ open, onClose, item }) {
  const meta = item?.meta || {};

  return (
    <Dialog open={!!open} handler={onClose} size="md" className="dark:bg-gray-800">
      <DialogHeader className="dark:text-white">Bina məlumatı</DialogHeader>

      <DialogBody className="dark:text-gray-200">
        {!item ? (
          <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Məlumat yoxdur</Typography>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <Typography className="text-lg font-semibold">{item.name}</Typography>
              <Chip value={item.status || "—"} color={item.status === "active" ? "green" : "blue-gray"} size="sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Info label="Kompleks" value={item?.complex?.name} />
              <Info label="Desc" value={meta.desc} />
            </div>
          </div>
        )}
      </DialogBody>

      <DialogFooter>
        <Button variant="outlined" color="blue-gray" onClick={onClose} className="dark:text-gray-300">
          Bağla
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-blue-gray-50 dark:border-gray-700 p-3">
      <div className="text-xs text-blue-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-sm text-blue-gray-900 dark:text-white break-words">{value || "—"}</div>
    </div>
  );
}
