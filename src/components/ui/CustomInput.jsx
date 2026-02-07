import React from "react";

export function CustomInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  error = false,
  readOnly = false,
  disabled = false,
  icon,
  className = "",
  labelClassName = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          className={`
            w-full px-3 py-2.5 rounded-lg border transition-all
            ${icon ? "pl-10" : ""}
            ${readOnly ? "bg-gray-50 dark:bg-gray-700 cursor-not-allowed" : "bg-white dark:bg-gray-800"}
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none
          `}
          {...props}
        />
      </div>
      {error && typeof error === "string" && (
        <span className="text-xs text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
}

