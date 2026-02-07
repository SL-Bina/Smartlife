import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { useMtkColor } from "@/context";

export function MtkDeleteModal({ open, onClose, item, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const { colorCode, getGradientBackground, getRgba, defaultColor } = useMtkColor();
  
  // Default göz yormayan qırmızı ton
  const defaultRed = "#dc2626";
  const activeColor = colorCode || defaultRed;

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
      <DialogHeader 
        className="dark:text-white transition-colors"
        style={{
          background: colorCode 
            ? `linear-gradient(to right, ${getRgba(0.1)}, ${getRgba(0.05)})` 
            : "linear-gradient(to right, rgba(220, 38, 38, 0.1), rgba(185, 28, 28, 0.05))",
        }}
      >
        Silinsin?
      </DialogHeader>

      <DialogBody className="dark:text-gray-200">
        {!item ? (
          <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Seçilən MTK yoxdur</Typography>
        ) : (
          <Typography>
            <b>{item.name}</b> adlı MTK silinəcək. Davam edək?
          </Typography>
        )}
      </DialogBody>

      <DialogFooter className="flex gap-2">
        <Button variant="outlined" color="blue-gray" onClick={onClose} disabled={loading} className="dark:text-gray-300">
          Ləğv et
        </Button>
        <Button 
          onClick={submit} 
          loading={loading} 
          disabled={!item}
          className="text-white"
          style={{
            backgroundColor: activeColor,
          }}
          onMouseEnter={(e) => {
            if (!loading && item) {
              e.currentTarget.style.backgroundColor = colorCode 
                ? getRgba(0.9) 
                : "#b91c1c";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && item) {
              e.currentTarget.style.backgroundColor = activeColor;
            }
          }}
        >
          Sil
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
