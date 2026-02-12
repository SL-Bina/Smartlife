import React from "react";

export function CustomCard({ children, className = "" }) {
  return (
    <div className={`
      rounded-2xl xl:rounded-3xl
      backdrop-blur-xl backdrop-saturate-150
      bg-white/60 dark:bg-gray-800/40
      border border-gray-200/50 dark:border-gray-700/50
      shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.2)]
      dark:shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.1)]
      ${className}
    `}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
}

// Default export for backward compatibility (if needed)
export default CustomCard;

