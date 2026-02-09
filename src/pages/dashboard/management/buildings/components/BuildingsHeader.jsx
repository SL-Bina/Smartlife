import React from "react";
import { Typography } from "@material-tailwind/react";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { useMtkColor } from "@/context";

export function BuildingsHeader() {
  const { colorCode, getGradientBackground, getRgba, defaultColor } = useMtkColor();
  
  // Default göz yormayan qırmızı ton (#dc2626 - red-600)
  const defaultRed = "#dc2626";
  const activeColor = colorCode || defaultRed;
  
  // Gradient background - rəng kodu yoxdursa default qırmızı istifadə et
  const gradientStyle = activeColor === defaultRed
    ? {
        background: "linear-gradient(to right, #dc2626, #b91c1c, #dc2626)",
      }
    : getGradientBackground("to right", 0.9, 0.7);
  
  // Border rəngi - rəng kodu yoxdursa default qırmızı istifadə et
  const borderColor = colorCode 
    ? (getRgba(0.3) || "rgba(220, 38, 38, 0.3)")
    : "rgba(220, 38, 38, 0.3)";
  
  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl shadow-lg p-6 mb-4 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
      style={{
        ...gradientStyle,
        border: `1px solid ${borderColor}`,
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative flex items-center gap-4">
        <div className="flex-shrink-0">
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 dark:border-gray-600/30"
            style={{
              backgroundColor: colorCode 
                ? (getRgba(0.2) || "rgba(220, 38, 38, 0.2)")
                : "rgba(220, 38, 38, 0.2)",
            }}
          >
            <BuildingOffice2Icon className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <div className="flex-1">
          <Typography 
            variant="h4" 
            className="text-white font-bold mb-1 flex items-center gap-2"
          >
            Binalar
          </Typography>
          <Typography className="text-white/90 dark:text-gray-300 text-sm font-medium">
            Bina siyahısı, MTK + kompleks üzrə filter, yarat / edit / sil
          </Typography>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
    </div>
  );
}
