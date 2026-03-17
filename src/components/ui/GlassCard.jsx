import React from "react";

export function GlassCard({
  children,
  className = "",
  blur = "md",
  tone = "light",
  border = true,
  shadow = true,
  rounded = "2xl",
  ...props
}) {
  const roundedMap = {
    none: "",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };

  const blurClass =
    blur === "none"
      ? ""
      : blur === "sm"
        ? "backdrop-blur-sm"
        : blur === "lg"
          ? "backdrop-blur-lg"
          : blur === "xl"
            ? "backdrop-blur-xl"
            : "backdrop-blur-md";

  const toneClass =
    tone === "dark"
      ? "bg-slate-900/45 text-white dark:bg-slate-900/55"
      : tone === "neutral"
        ? "bg-white/35 text-blue-gray-900 dark:bg-gray-900/35 dark:text-white"
        : "bg-white/65 text-blue-gray-900 dark:bg-gray-900/65 dark:text-white";

  const borderClass = border ? "border border-white/30 dark:border-white/10" : "";
  const shadowClass = shadow ? "shadow-2xl" : "";
  const roundedClass = roundedMap[rounded] ?? "rounded-2xl";

  return (
    <div className={`${toneClass} ${blurClass} ${borderClass} ${shadowClass} ${roundedClass} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export default GlassCard;
