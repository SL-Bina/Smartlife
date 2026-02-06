import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";

export function ComplexDeleteModal({ open, onClose, item, onConfirm }) {
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!item?.id) return;
    setLoading(true);
    try {
      await onConfirm?.(item);
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={!!open} handler={onClose} size="sm" className="dark:bg-gray-800">
      <DialogHeader className="dark:text-white">Silinsin?</DialogHeader>

      <DialogBody className="dark:text-gray-200">
        {!item ? (
          <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Seçilən kompleks yoxdur</Typography>
        ) : (
          <Typography>
            <b>{item.name}</b> adlı kompleks silinəcək. Davam edək?
          </Typography>
        )}
      </DialogBody>

      <DialogFooter className="flex gap-2">
        <Button variant="outlined" color="blue-gray" onClick={onClose} disabled={loading} className="dark:text-gray-300">
          Ləğv et
        </Button>
        <Button color="red" onClick={submit} loading={loading} disabled={!item}>
          Sil
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
