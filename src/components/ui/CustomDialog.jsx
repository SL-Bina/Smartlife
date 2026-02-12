import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function CustomDialog({ open, onClose, children, size = "lg", className = "", style = {} }) {
  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`
          relative 
          rounded-3xl xl:rounded-[2rem]
          backdrop-blur-2xl backdrop-saturate-150
          bg-white/80 dark:bg-gray-900/80
          border border-gray-200/50 dark:border-gray-700/50
          shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.3)]
          dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)]
          ${sizeClasses[size]} w-full ${className}
        `}
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children, className = "" }) {
  return (
    <div className={`
      flex items-center justify-between p-6 
      border-b border-gray-200/50 dark:border-gray-700/50
      rounded-t-3xl xl:rounded-t-[2rem]
      backdrop-blur-sm
      bg-transparent
      ${className}
    `}>
      {children}
    </div>
  );
}

export function DialogBody({ children, className = "" }) {
  return (
    <div className={`p-6 bg-transparent ${className}`}>
      {children}
    </div>
  );
}

export function DialogFooter({ children, className = "" }) {
  return (
    <div className={`
      flex items-center justify-end gap-3 p-6 
      border-t border-gray-200/50 dark:border-gray-700/50
      bg-transparent
      rounded-b-3xl xl:rounded-b-[2rem]
      ${className}
    `}>
      {children}
    </div>
  );
}

