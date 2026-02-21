import React, { useState, useEffect } from "react";
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark mode yoxlaması
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);
    
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  const pathParts = pathname.split("/").filter((el) => el !== "");
  const currentLayout = pathParts[0] || "dashboard";
  const page = pathParts.slice(1).join("/") || pathParts[0] || "";
  const fullPath = pathParts.slice(1).join("/");

  // Resident səhifələri üçün layout prefix ilə də axtarma apar
  const layoutFullPath = currentLayout === "resident" ? `resident/${fullPath}` : fullPath;

  const pageTitle = pageTitleKeyMap[layoutFullPath]
    ? t(pageTitleKeyMap[layoutFullPath])
    : pageTitleKeyMap[fullPath]
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

  // Navbar konfiqurasiyaları - Glass effect ilə
  const getNavbarColorClasses = () => {
    if (colorCode) return ""; // MTK rəngi varsa default gradient-i sil
    const transparency = getNavbarTransparency();
    const colors = {
      default: {
        light: `bg-white/80 from-white/90 via-white/85 to-white/90`,
        dark: `dark:bg-black/80 dark:from-black/90 dark:via-black/85 dark:to-black/90`,
      },
      red: {
        light: `from-red-100/80 via-red-200/75 to-red-100/80`,
        dark: `dark:bg-black/80 dark:from-black/90 dark:via-black/85 dark:to-black/90`,
      },
      blue: {
        light: `from-blue-100/80 via-blue-200/75 to-blue-100/80`,
        dark: `dark:bg-black/80 dark:from-black/90 dark:via-black/85 dark:to-black/90`,
      },
      green: {
        light: `from-green-100/80 via-green-200/75 to-green-100/80`,
        dark: `dark:bg-black/80 dark:from-black/90 dark:via-black/85 dark:to-black/90`,
      },
      purple: {
        light: `from-purple-100/80 via-purple-200/75 to-purple-100/80`,
        dark: `dark:bg-black/80 dark:from-black/90 dark:via-black/85 dark:to-black/90`,
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
      modern: "rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-3xl",
      classic: "rounded-lg sm:rounded-md md:rounded-lg border-0 sm:border-2",
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
      default: "border-0 sm:border-2 border-gray-200/50 dark:border-gray-800/50",
      red: "border-0 sm:border-2 border-red-200/50 dark:border-gray-800/50",
      blue: "border-0 sm:border-2 border-blue-200/50 dark:border-gray-800/50",
      green: "border-0 sm:border-2 border-green-200/50 dark:border-gray-800/50",
      purple: "border-0 sm:border-2 border-purple-200/50 dark:border-gray-800/50",
    };
    return borderColors[navbarColor] || borderColors.default;
  };

  const getNavbarBlurClasses = () => {
    // Glass effect üçün həmişə blur aktiv olmalıdır
    if (fixedNavbar) {
      return "backdrop-blur-md sm:backdrop-blur-xl md:backdrop-blur-2xl backdrop-saturate-150";
    }
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
      ? `${getNavbarPositionClasses()} z-[1001] ${getNavbarHeightClasses()} ${getNavbarShadowClasses()} mb-4 sm:mb-6 md:mb-8`
      : `px-2 sm:px-3 md:px-4 lg:px-6 ${getNavbarHeightClasses()} z-[1001] mb-4 sm:mb-6 md:mb-8`,
  ].filter(Boolean).join(" ");

  // Navbar rənglərini düzgün təyin et
  const getNavbarTextColor = () => {
    if (!fixedNavbar) return '';
    if (isDarkMode) {
      return '';
    } else {
      return 'navbar-light-mode';
    }
  };

  // Navbar-ın rənglərini inline style ilə təyin et
  useEffect(() => {
    if (fixedNavbar) {
      const navbarElement = document.querySelector('nav[class*="Navbar"]');
      if (navbarElement) {
        if (isDarkMode) {
          navbarElement.style.color = '#ffffff';
          // Bütün child elementlərin rənglərini təyin et
          const allElements = navbarElement.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(el);
              // Yalnız default rəngləri override et
              if (computedStyle.color === 'rgb(17, 24, 39)' || computedStyle.color === 'rgb(31, 41, 55)') {
                el.style.color = '#ffffff';
              }
            }
          });
        } else {
          navbarElement.style.color = '#111827';
          // Bütün child elementlərin rənglərini təyin et
          const allElements = navbarElement.querySelectorAll('*');
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(el);
              // Yalnız default rəngləri override et
              if (computedStyle.color === 'rgb(255, 255, 255)' || computedStyle.color === 'rgb(243, 244, 246)') {
                el.style.color = '#111827';
              }
            }
          });
        }
      }
    }
  }, [fixedNavbar, isDarkMode]);

  return (
    <Navbar
      color={fixedNavbar ? (isDarkMode ? "gray" : "white") : "transparent"}
      className={`${navbarClasses} ${getNavbarTextColor()}`}
      fullWidth
      blurred={fixedNavbar && navbarBlur === "enabled"}
      style={{
        ...getNavbarBackground(),
        borderColor: colorCode ? getRgbaColor(colorCode, 0.3) : undefined,
        position: 'relative',
        zIndex: 1001,
        ...(isDarkMode && fixedNavbar ? { 
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          color: '#ffffff',
        } : fixedNavbar && !isDarkMode ? {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          color: '#111827',
        } : {}),
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

