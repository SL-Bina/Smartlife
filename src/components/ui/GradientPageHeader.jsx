/**
 * GradientPageHeader - Full gradient banner with icon, title, subtitle.
 * Replaces the repeated pattern:
 *   <div className="...bg-gradient-to-r from-red-600 to-red-800 ...">
 */
import React from "react";
import { Typography } from "@material-tailwind/react";
import { useAppColor } from "@/hooks/useAppColor";

const SVG_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C%2Fg%3E%3C%2Fsvg%3E")`;

export function GradientPageHeader({
  icon: Icon,
  title,
  subtitle,
  children,
  className = "",
}) {
  const { getRgba } = useAppColor();

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 mt-2 sm:mt-3 md:mt-4 ${className}`}
      style={{
        background: `linear-gradient(to right, ${getRgba(0.95)}, ${getRgba(0.75)})`,
        border: `1px solid ${getRgba(0.35)}`,
        position: "relative",
        zIndex: 0,
      }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: SVG_PATTERN }} />
      </div>

      <div className="relative flex items-center gap-3 sm:gap-4">
        {Icon && (
          <div className="flex-shrink-0">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30"
              style={{ backgroundColor: getRgba(0.2) }}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
            </div>
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <Typography
              variant="h4"
              className="text-white font-bold mb-1 text-lg sm:text-xl md:text-2xl"
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography className="text-white/90 text-xs sm:text-sm font-medium">
              {subtitle}
            </Typography>
          )}
          {children}
        </div>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
      <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12" />
    </div>
  );
}

export default GradientPageHeader;
