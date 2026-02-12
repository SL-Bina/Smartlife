import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { ExclamationTriangleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useMtkColor } from "@/store/exports";

export function BuildingDeleteModal({ open, onClose, item, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const { colorCode, getRgba, defaultColor } = useMtkColor();
  
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

  if (!open) return null;

  return (
    <Dialog 
      open={open} 
      handler={onClose} 
      size="sm" 
      className="dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl"
      dismiss={{ enabled: false }}
    >
      <DialogHeader 
        className="border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg transition-colors"
        style={{
          background: colorCode 
            ? `linear-gradient(to right, ${colorCode}20, ${colorCode}15)` 
            : 'linear-gradient(to right, rgb(239 246 255), rgb(219 234 254))',
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: activeColor }}
          >
            <ExclamationTriangleIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            Silinsin?
          </Typography>
        </div>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>

      <DialogBody className="dark:bg-gray-800 py-6">
        {!item ? (
          <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Seçilən bina yoxdur</Typography>
        ) : (
          <Typography className="text-gray-700 dark:text-gray-300">
            <b className="text-gray-900 dark:text-white">{item.name}</b> adlı bina silinəcək. Davam edək?
          </Typography>
        )}
      </DialogBody>

      <DialogFooter 
        className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800 flex gap-2"
        style={{
          borderTopColor: colorCode ? `${colorCode}30` : undefined,
        }}
      >
        <Button 
          variant="outlined" 
          color="blue-gray" 
          onClick={onClose} 
          disabled={loading} 
          className="dark:text-gray-300 dark:border-gray-600"
          style={{
            borderColor: activeColor,
            color: activeColor,
          }}
        >
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
            if (colorCode) {
              const hex = colorCode.replace("#", "");
              const r = parseInt(hex.substring(0, 2), 16);
              const g = parseInt(hex.substring(2, 4), 16);
              const b = parseInt(hex.substring(4, 6), 16);
              e.currentTarget.style.backgroundColor = `rgb(${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)})`;
            } else {
              e.currentTarget.style.backgroundColor = "#b91c1c";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = activeColor;
          }}
        >
          Sil
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
