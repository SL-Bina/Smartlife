import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Chip } from "@material-tailwind/react";

export function ComplexViewModal({ open, onClose, item }) {
  const meta = item?.meta || {};

  return (
    <Dialog open={!!open} handler={onClose} size="md" className="dark:bg-gray-800">
      <DialogHeader className="dark:text-white">Kompleks məlumatı</DialogHeader>

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
              <Info label="MTK" value={item?.bind_mtk?.name || (item?.mtk_id ? `#${item.mtk_id}` : "—")} />
              <Info label="Color" value={meta.color_code} />
              <Info label="Lat" value={meta.lat} />
              <Info label="Lng" value={meta.lng} />
              <Info label="Email" value={meta.email} />
              <Info label="Phone" value={meta.phone} />
            </div>

            <Info label="Website" value={meta.website} />
            <Info label="Address" value={meta.address} />
            <Info label="Desc" value={meta.desc} />
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
