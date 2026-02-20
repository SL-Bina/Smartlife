import React from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "@material-tailwind/react";
import { useMaterialTailwindController } from "@/store/exports";
import { useTranslation } from "react-i18next";
import { pageTitleKeyMap } from "./utils/pageTitleMap";
import { MobileNavbar } from "./components/MobileNavbar";
import { DesktopNavbar } from "./components/DesktopNavbar";

export function DashboardNavbar() {
  const [controller] = useMaterialTailwindController();
  const {
    fixedNavbar,
    navbarColor,
    navbarHeight,
    navbarStyle,
    navbarShadow,
    navbarBorder,
    navbarBlur,
    navbarTransparency,
    navbarPosition,
    navbarAnimations,
    navbarHoverEffects,
    sidenavType,
  } = controller;
  const colorCode = null;
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const pathParts = pathname.split("/").filter((el) => el !== "");
  const page = pathParts.slice(1).join("/") || pathParts[0] || "";
  const fullPath = pathParts.slice(1).join("/");

  const pageTitle = pageTitleKeyMap[fullPath]
    ? t(pageTitleKeyMap[fullPath])
    : pageTitleKeyMap[page]
      ? t(pageTitleKeyMap[page])
      : page;

  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getNavbarBackground = () => {
    if (colorCode && sidenavType === "white") {
      const color1 = getRgbaColor(colorCode, 0.1);
      const color2 = getRgbaColor(colorCode, 0.05);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    if (colorCode && sidenavType === "dark") {
      const color1 = getRgbaColor(colorCode, 0.2);
      const color2 = getRgbaColor(colorCode, 0.15);
      return {
        background: `linear-gradient(to bottom, ${color1}, ${color2}, ${color1})`,
      };
    }
    return {};
  };

  // Navbar konfiqurasiyaları - daha görünən və effektiv
  const getNavbarColorClasses = () => {
    if (colorCode) return ""; // MTK rəngi varsa default gradient-i sil
    const transparency = getNavbarTransparency();
    const colors = {
      default: {
        light: `from-white/${transparency} via-white/${Math.max(parseInt(transparency) - 15, 0)} to-white/${transparency}`,
        dark: `dark:from-gray-900/${transparency} dark:via-gray-800/${Math.max(parseInt(transparency) - 15, 0)} dark:to-gray-900/${transparency}`,
      },
      red: {
        light: `from-red-100/${transparency} via-red-200/${Math.max(parseInt(transparency) - 15, 0)} to-red-100/${transparency}`,
        dark: `dark:from-red-900/${transparency} dark:via-red-800/${Math.max(parseInt(transparency) - 15, 0)} dark:to-red-900/${transparency}`,
      },
      blue: {
        light: `from-blue-100/${transparency} via-blue-200/${Math.max(parseInt(transparency) - 15, 0)} to-blue-100/${transparency}`,
        dark: `dark:from-blue-900/${transparency} dark:via-blue-800/${Math.max(parseInt(transparency) - 15, 0)} dark:to-blue-900/${transparency}`,
      },
      green: {
        light: `from-green-100/${transparency} via-green-200/${Math.max(parseInt(transparency) - 15, 0)} to-green-100/${transparency}`,
        dark: `dark:from-green-900/${transparency} dark:via-green-800/${Math.max(parseInt(transparency) - 15, 0)} dark:to-green-900/${transparency}`,
      },
      purple: {
        light: `from-purple-100/${transparency} via-purple-200/${Math.max(parseInt(transparency) - 15, 0)} to-purple-100/${transparency}`,
        dark: `dark:from-purple-900/${transparency} dark:via-purple-800/${Math.max(parseInt(transparency) - 15, 0)} dark:to-purple-900/${transparency}`,
      },
    };
    const color = colors[navbarColor] || colors.default;
    return `bg-gradient-to-br ${color.light} ${color.dark}`;
  };

  const getNavbarHeightClasses = () => {
    const heights = {
      compact: "py-1 sm:py-1.5 md:py-2 min-h-[44px] sm:min-h-[48px] md:min-h-[52px]",
      normal: "py-2 sm:py-3 md:py-4 min-h-[56px] sm:min-h-[64px] md:min-h-[72px]",
      large: "py-3 sm:py-5 md:py-7 min-h-[72px] sm:min-h-[88px] md:min-h-[104px]",
    };
    return heights[navbarHeight] || heights.normal;
  };

  const getNavbarStyleClasses = () => {
    const styles = {
      minimalist: "rounded-none border-0",
      modern: "rounded-none sm:rounded-xl md:rounded-2xl lg:rounded-3xl",
      classic: "rounded-none sm:rounded-md md:rounded-lg border-0 sm:border-2",
    };
    return styles[navbarStyle] || styles.modern;
  };

  const getNavbarShadowClasses = () => {
    if (navbarShadow === "none") return "";
    const shadows = {
      small: "shadow-md sm:shadow-lg md:shadow-xl shadow-gray-300/50 dark:shadow-gray-900/50",
      medium: "shadow-lg sm:shadow-xl md:shadow-2xl shadow-gray-400/60 dark:shadow-gray-900/70",
      large: "shadow-xl sm:shadow-2xl md:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] shadow-gray-500/70 dark:shadow-gray-950/80",
    };
    return shadows[navbarShadow] || shadows.medium;
  };

  const getNavbarBorderClasses = () => {
    if (navbarBorder === "disabled") return "border-0";
    if (colorCode) return "border-0 sm:border-2"; // MTK rəngi varsa border class-larını sil
    const borderColors = {
      default: "border-0 sm:border-2 border-gray-300/80 dark:border-gray-600/80",
      red: "border-0 sm:border-2 border-red-300/80 dark:border-red-600/80",
      blue: "border-0 sm:border-2 border-blue-300/80 dark:border-blue-600/80",
      green: "border-0 sm:border-2 border-green-300/80 dark:border-green-600/80",
      purple: "border-0 sm:border-2 border-purple-300/80 dark:border-purple-600/80",
    };
    return borderColors[navbarColor] || borderColors.default;
  };

  const getNavbarBlurClasses = () => {
    if (navbarBlur === "disabled") return "";
    const blurIntensity = {
      enabled: "backdrop-blur-md sm:backdrop-blur-xl md:backdrop-blur-2xl backdrop-saturate-150",
    };
    return blurIntensity.enabled;
  };

  const getNavbarTransparency = () => {
    const transparency = navbarTransparency || "95";
    return transparency;
  };

  const getNavbarPositionClasses = () => {
    if (!fixedNavbar) return "";
    const positions = {
      top: "sticky top-0 sm:top-2 md:top-4",
      bottom: "sticky bottom-0 sm:bottom-2 md:bottom-4",
    };
    return positions[navbarPosition] || positions.top;
  };

  const getNavbarAnimationClasses = () => {
    if (navbarAnimations === "disabled") return "";
    return "transition-all duration-500 ease-in-out";
  };

  const getNavbarHoverClasses = () => {
    if (navbarHoverEffects === "disabled") return "";
    return "";
  };

  const navbarClasses = [
    getNavbarStyleClasses(),
    getNavbarAnimationClasses(),
    getNavbarBlurClasses(),
    getNavbarColorClasses(),
    getNavbarBorderClasses(),
    getNavbarHoverClasses(),
    fixedNavbar
      ? `${getNavbarPositionClasses()} z-[1001] ${getNavbarHeightClasses()} ${getNavbarShadowClasses()}`
      : `px-2 sm:px-3 md:px-4 lg:px-6 ${getNavbarHeightClasses()} z-[1001]`,
  ].filter(Boolean).join(" ");

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={navbarClasses}
      fullWidth
      blurred={fixedNavbar && navbarBlur === "enabled"}
      style={{
        ...getNavbarBackground(),
        borderColor: colorCode ? getRgbaColor(colorCode, 0.3) : undefined,
        position: 'relative',
        zIndex: 1001,
      }}
    >
      <MobileNavbar pageTitle={pageTitle} navbarHoverEffects={navbarHoverEffects} />
      <DesktopNavbar 
        pathParts={pathParts} 
        pageTitle={pageTitle} 
        fixedNavbar={fixedNavbar}
        navbarHoverEffects={navbarHoverEffects}
      />
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar/index.jsx";

export default DashboardNavbar;

