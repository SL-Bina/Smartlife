import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { useMtkColor } from "@/store/exports";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";

export function MtkDeleteModal({ open, onClose, item, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;
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

  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getModalBackground = () => {
    if (colorCode && sidenavType === "white") {
      const color1 = getRgbaColor(colorCode, 0.05);
      const color2 = getRgbaColor(colorCode, 0.03);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    if (colorCode && sidenavType === "dark") {
      const color1 = getRgbaColor(colorCode, 0.1);
      const color2 = getRgbaColor(colorCode, 0.07);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    return {};
  };

  return (
    <Dialog 
      open={!!open} 
      handler={onClose} 
      size="sm" 
      className="
        rounded-3xl xl:rounded-[2rem]
        backdrop-blur-2xl backdrop-saturate-150
        bg-white/80 dark:bg-gray-900/80
        border border-gray-200/50 dark:border-gray-700/50
        shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.3)]
        dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]
      "
      style={{
        ...getModalBackground(),
        borderColor: colorCode ? getRgbaColor(colorCode, 0.15) : undefined,
      }}
    >
      <DialogHeader 
        className="
          dark:text-white transition-colors
          border-b border-gray-200/50 dark:border-gray-700/50
          rounded-t-3xl xl:rounded-t-[2rem]
          backdrop-blur-sm
        "
        style={{
          background: colorCode 
            ? `linear-gradient(to right, ${getRgba(0.08)}, ${getRgba(0.05)})` 
            : "linear-gradient(to right, rgba(220, 38, 38, 0.08), rgba(185, 28, 28, 0.05))",
        }}
      >
        Silinsin?
      </DialogHeader>

      <DialogBody className="bg-transparent">
        {!item ? (
          <Typography className="text-sm font-medium text-gray-800 dark:text-gray-100">Seçilən MTK yoxdur</Typography>
        ) : (
          <Typography className="text-base font-medium text-gray-900 dark:text-white">
            <b className="font-bold">{item.name}</b> adlı MTK silinəcək. Davam edək?
          </Typography>
        )}
      </DialogBody>

      <DialogFooter className="
        flex gap-2
        border-t border-gray-200/50 dark:border-gray-700/50
        bg-transparent
        rounded-b-3xl xl:rounded-b-[2rem]
      ">
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
