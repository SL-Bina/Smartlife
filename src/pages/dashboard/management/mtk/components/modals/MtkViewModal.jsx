import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { EyeIcon, XMarkIcon, BuildingOfficeIcon, MapPinIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon, PaintBrushIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";

export function MtkViewModal({ open, onClose, item }) {
  const meta = item?.meta || {};
  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { colorCode } = useMtkColor();

  // Rəng koduna görə kontrast mətn rəngi müəyyən et (ağ və ya qara)
  const getContrastColor = (hexColor) => {
    if (!hexColor) return "#000000";
    
    // Hex rəngi RGB-yə çevir
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Luminance hesabla
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Əgər luminance yüksəkdirsə (açıq rəng), qara mətn istifadə et
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  if (!open || !item) return null;

  const itemColorCode = meta.color_code;
  const activeColorCode = colorCode || itemColorCode;
  const iconBgColor = activeColorCode || '#3b82f6';
  const accentColor = activeColorCode || '#3b82f6';

  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getModalBackground = () => {
    if (activeColorCode && sidenavType === "white") {
      const color1 = getRgbaColor(activeColorCode, 0.05);
      const color2 = getRgbaColor(activeColorCode, 0.03);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    if (activeColorCode && sidenavType === "dark") {
      const color1 = getRgbaColor(activeColorCode, 0.1);
      const color2 = getRgbaColor(activeColorCode, 0.07);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    return {};
  };

  return (
    <Dialog 
      open={open} 
      handler={onClose} 
      size="lg" 
      className="
        rounded-3xl xl:rounded-[2rem]
        backdrop-blur-2xl backdrop-saturate-150
        bg-white/80 dark:bg-gray-900/80
        border border-gray-200/50 dark:border-gray-700/50
        shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.3)]
        dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]
      "
      dismiss={{ enabled: false }}
      style={{
        ...getModalBackground(),
        borderColor: activeColorCode ? getRgbaColor(activeColorCode, 0.15) : undefined,
      }}
    >
      <DialogHeader 
        className="
          border-b border-gray-200/50 dark:border-gray-700/50 
          pb-4 flex items-center justify-between 
          rounded-t-3xl xl:rounded-t-[2rem]
          backdrop-blur-sm
        "
        style={{
          background: activeColorCode 
            ? `linear-gradient(to right, ${getRgbaColor(activeColorCode, 0.08)}, ${getRgbaColor(activeColorCode, 0.05)})` 
            : 'linear-gradient(to right, rgba(239, 246, 255, 0.5), rgba(219, 234, 254, 0.3))',
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: iconBgColor }}
          >
            <EyeIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            MTK Məlumatları
          </Typography>
        </div>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>

      <DialogBody divider className="space-y-6 py-6 max-h-[70vh] overflow-y-auto bg-transparent">
        {/* Header Section */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-xl"
              style={{ 
                backgroundColor: activeColorCode ? getRgbaColor(activeColorCode, 0.15) : 'rgb(219 234 254)',
              }}
            >
              <BuildingOfficeIcon 
                className="h-6 w-6" 
                style={{ color: activeColorCode || '#2563eb' }}
              />
            </div>
            <div>
              <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                {item.name}
              </Typography>
              <Typography variant="small" className="text-gray-700 dark:text-gray-200">
                ID: {item.id}
              </Typography>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
              item.status === "active" || item.status === "Active"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : item.status === "inactive" || item.status === "Inactive"
                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                : "bg-blue-gray-100 text-blue-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {item.status || "—"}
          </span>
        </div>

        {/* Main Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Info icon={<EnvelopeIcon className="h-5 w-5" />} label="Email" value={meta.email} colorCode={activeColorCode} />
          <Info icon={<PhoneIcon className="h-5 w-5" />} label="Telefon" value={meta.phone} colorCode={activeColorCode} />
          <Info icon={<GlobeAltIcon className="h-5 w-5" />} label="Web sayt" value={meta.website} isLink colorCode={activeColorCode} />
          <Info icon={<MapPinIcon className="h-5 w-5" />} label="Koordinatlar" value={meta.lat && meta.lng ? `${meta.lat}, ${meta.lng}` : null} colorCode={activeColorCode} />
        </div>

        {/* Color Code */}
        {meta.color_code && (
          <div className="
            rounded-2xl xl:rounded-3xl
            backdrop-blur-xl backdrop-saturate-150
            border border-gray-200/50 dark:border-gray-700/50
            bg-white/60 dark:bg-gray-800/40
            p-4
          ">
            <div className="flex items-center gap-3 mb-2">
              <PaintBrushIcon className="h-5 w-5" style={{ color: colorCode || '#4b5563' }} />
              <Typography variant="small" className="font-semibold text-gray-800 dark:text-gray-100 uppercase">
                Rəng Kodu
              </Typography>
            </div>
            <div className="flex items-center justify-center">
              <span
                className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-600"
                style={{ 
                  backgroundColor: meta.color_code,
                  color: getContrastColor(meta.color_code)
                }}
              >
                {meta.color_code}
              </span>
            </div>
          </div>
        )}

        {/* Address */}
        {meta.address && (
          <Info 
            icon={<MapPinIcon className="h-5 w-5" />} 
            label="Ünvan" 
            value={meta.address} 
            fullWidth 
            colorCode={activeColorCode}
          />
        )}

        {/* Description */}
        {meta.desc && (
          <Info 
            icon={<DocumentTextIcon className="h-5 w-5" />} 
            label="Təsvir" 
            value={meta.desc} 
            fullWidth 
            colorCode={activeColorCode}
          />
        )}
      </DialogBody>

      <DialogFooter 
        className="
          border-t border-gray-200/50 dark:border-gray-700/50
          bg-transparent
          rounded-b-3xl xl:rounded-b-[2rem]
        "
        style={{
          borderTopColor: activeColorCode ? getRgbaColor(activeColorCode, 0.15) : undefined,
        }}
      >
        <Button 
          variant="outlined" 
          color="blue-gray" 
          onClick={onClose} 
          className="dark:text-gray-300 dark:border-gray-600"
          style={{
            borderColor: activeColorCode || undefined,
            color: activeColorCode || undefined,
          }}
        >
          Bağla
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

function Info({ icon, label, value, isLink = false, fullWidth = false, colorCode }) {
  if (!value) return null;
  
  const { colorCode: mtkColorCode } = useMtkColor();
  const activeColorCode = mtkColorCode || colorCode;
  const iconColor = activeColorCode || '#4b5563';

  return (
    <div className={`
      rounded-2xl xl:rounded-3xl
      backdrop-blur-xl backdrop-saturate-150
      border border-gray-200/50 dark:border-gray-700/50
      bg-white/60 dark:bg-gray-800/40
      p-4 transition-all 
      hover:shadow-[0_4px_20px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.2)]
      dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
      ${fullWidth ? "col-span-1 md:col-span-2" : ""}
    `}>
      <div className="flex items-center gap-2 mb-2">
        <div style={{ color: iconColor }}>
          {icon}
        </div>
        <Typography variant="small" className="font-semibold text-gray-800 dark:text-gray-100 uppercase">
          {label}
        </Typography>
      </div>
      <div className="text-sm font-medium text-gray-900 dark:text-white break-words pl-7">
        {isLink && value ? (
          <a
            href={value.startsWith("http") ? value : `https://${value}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {value}
          </a>
        ) : (
          value || "—"
        )}
      </div>
    </div>
  );
}
