import React from "react";

export function CustomButton({
  children,
  onClick,
  type = "button",
  variant = "filled",
  color = "blue",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  ...props
}) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const colorClasses = {
    blue: {
      filled: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
      outlined: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400 focus:ring-blue-500",
      text: "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-blue-400 focus:ring-blue-500",
    },
    red: {
      filled: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
      outlined: "border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:border-red-400 focus:ring-red-500",
      text: "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 focus:ring-red-500",
    },
    gray: {
      filled: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
      outlined: "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-500",
      text: "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-gray-500",
    },
  };

  const variantClass = colorClasses[color]?.[variant] || colorClasses.blue.filled;
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Yüklənir...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

