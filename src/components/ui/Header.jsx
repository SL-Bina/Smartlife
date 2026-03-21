import React from "react";
import { GradientPageHeader } from "@/components/ui/GradientPageHeader";

export function Header({ icon, title, subtitle, className = "", children }) {
  return (
    <GradientPageHeader
      icon={icon}
      title={title}
      subtitle={subtitle}
      className={className}
    >
      {children}
    </GradientPageHeader>
  );
}

export default Header;
