import React from "react";

export function CustomTypography({
  children,
  variant = "body1",
  className = "",
  ...props
}) {
  const variants = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-bold",
    h4: "text-xl font-semibold",
    h5: "text-lg font-semibold",
    h6: "text-base font-semibold",
    body1: "text-base",
    body2: "text-sm",
    small: "text-xs",
    caption: "text-xs text-gray-500 dark:text-gray-400",
  };

  const Tag = variant.startsWith("h") ? variant : "p";

  return (
    <Tag className={`${variants[variant] || variants.body1} text-gray-900 dark:text-white ${className}`} {...props}>
      {children}
    </Tag>
  );
}

