import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { EyeIcon, XMarkIcon, BuildingOfficeIcon, MapPinIcon, EnvelopeIcon, PhoneIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useMtkColor } from "@/store/exports";

export function BuildingViewModal({ open, onClose, item }) {
  const meta = item?.meta || {};
  const { colorCode, getRgba, defaultColor } = useMtkColor();
  
  // Default göz yormayan qırmızı ton
  const defaultRed = "#dc2626";
  const activeColor = colorCode || defaultRed;

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

  const headerBgColor = colorCode ? `${colorCode}20` : undefined; // 20% opacity
  const iconBgColor = colorCode || defaultColor || '#3b82f6'; // Default blue if no color

  return (
    <Dialog 
      open={open} 
      handler={onClose} 
      size="lg" 
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
            style={{ backgroundColor: iconBgColor }}
          >
            <EyeIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            Bina Məlumatları
          </Typography>
        </div>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>

      <DialogBody divider className="space-y-6 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div 
              className="p-3 rounded-xl"
              style={{ 
                backgroundColor: colorCode ? `${colorCode}20` : 'rgb(219 234 254)',
              }}
            >
              <BuildingOfficeIcon 
                className="h-6 w-6" 
                style={{ color: colorCode || '#2563eb' }}
              />
            </div>
            <div>
              <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
                {item.name}
              </Typography>
              <Typography variant="small" className="text-gray-500 dark:text-gray-400">
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
          <Info icon={<BuildingOfficeIcon className="h-5 w-5" />} label="Kompleks" value={item?.complex?.name || "—"} colorCode={colorCode} />
          <Info icon={<EnvelopeIcon className="h-5 w-5" />} label="Email" value={meta.email} colorCode={colorCode} />
          <Info icon={<PhoneIcon className="h-5 w-5" />} label="Telefon" value={meta.phone} colorCode={colorCode} />
        </div>

        {/* Description */}
        {meta.desc && (
          <Info 
            icon={<DocumentTextIcon className="h-5 w-5" />} 
            label="Təsvir" 
            value={meta.desc} 
            fullWidth 
            colorCode={colorCode}
          />
        )}

        {/* Address */}
        {meta.address && (
          <Info 
            icon={<MapPinIcon className="h-5 w-5" />} 
            label="Ünvan" 
            value={meta.address} 
            fullWidth 
            colorCode={colorCode}
          />
        )}
      </DialogBody>

      <DialogFooter 
        className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800"
        style={{
          borderTopColor: colorCode ? `${colorCode}30` : undefined,
        }}
      >
        <Button 
          variant="outlined" 
          color="blue-gray" 
          onClick={onClose} 
          className="dark:text-gray-300 dark:border-gray-600"
          style={{
            borderColor: activeColor,
            color: activeColor,
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

  const iconColor = colorCode || '#4b5563';

  return (
    <div className={`rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50 transition-all hover:shadow-md ${fullWidth ? "col-span-1 md:col-span-2" : ""}`}>
      <div className="flex items-center gap-2 mb-2">
        <div style={{ color: iconColor }}>
          {icon}
        </div>
        <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300 uppercase">
          {label}
        </Typography>
      </div>
      <div className="text-sm text-gray-900 dark:text-white break-words pl-7">
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
