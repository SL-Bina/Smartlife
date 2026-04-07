import { HomeIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAppColor } from "@/hooks/useAppColor";
import { filterRoutesByRole } from "@/layouts/dashboard";
import routes from "@/routes";
import { useAuth } from "@/store/hooks/useAuth";
import "./bread404.css";

const DEFAULT_404_RGB = "38, 128, 232";

const hexToRgbTuple = (value) => {
  if (typeof value !== "string") return DEFAULT_404_RGB;

  const cleaned = value.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return DEFAULT_404_RGB;

  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);

  return `${r}, ${g}, ${b}`;
};

const FloatingDigits = () => (
  <div className="error404-stage" aria-hidden="true">
    <div className="error404-shadow" />

    <div className="error404-ring error404-ring-one" />
    <div className="error404-ring error404-ring-two" />

    <div className="error404-digits-wrap">
      <span className="error404-digit error404-digit-back">404</span>
      <span className="error404-digit error404-digit-mid">404</span>
      <span className="error404-digit error404-digit-front">404</span>
    </div>

    <div className="error404-orb error404-orb-left" />
    <div className="error404-orb error404-orb-right" />
  </div>
);

export function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, hasModuleAccess } = useAuth();
  const { colorCode } = useAppColor();

  const themeVars = React.useMemo(
    () => ({
      "--error404-rgb": hexToRgbTuple(colorCode),
    }),
    [colorCode]
  );

  const getFirstPagePath = () => {
    if (!user) {
      return "/dashboard/home";
    }

    const isResident = user?.is_resident === true;
    const currentLayout = isResident ? "resident" : "dashboard";
    const filteredRoutes = filterRoutesByRole(routes, user, hasModuleAccess, currentLayout);

    for (const route of filteredRoutes) {
      if (!route.pages || route.pages.length === 0) {
        continue;
      }

      for (const page of route.pages) {
        if (page.hideInSidenav) {
          continue;
        }

        if (page.children && page.children.length > 0) {
          const firstVisibleChild = page.children.find((child) => !child.hideInSidenav);
          if (firstVisibleChild?.path) {
            const childPath = firstVisibleChild.path.startsWith("/")
              ? firstVisibleChild.path
              : `/${firstVisibleChild.path}`;

            if (childPath.startsWith("/dashboard") || childPath.startsWith("/resident")) {
              return childPath;
            }

            return `/${currentLayout}${childPath}`;
          }
        }

        if (page.path) {
          const pagePath = page.path.startsWith("/") ? page.path : `/${page.path}`;

          if (pagePath.startsWith("/dashboard") || pagePath.startsWith("/resident")) {
            return pagePath;
          }

          return `/${currentLayout}${pagePath}`;
        }
      }
    }

    return isResident ? "/resident/home" : "/dashboard/home";
  };

  const handleGoHome = () => {
    navigate(getFirstPagePath());
  };

  return (
    <section className="error404-page" style={themeVars}>
      <div className="error404-backdrop" aria-hidden="true" />
      <div className="error404-grid" aria-hidden="true" />
      <div className="error404-noise" aria-hidden="true" />

      <div className="error404-content">
        <FloatingDigits />

        <p className="error404-label">
          {t("error404.label", { defaultValue: "SMARTLIFE PORTAL" })}
        </p>
        <h1 className="error404-title">
          {t("error404.title", { defaultValue: "Səhifə tapılmadı" })}
        </h1>
        <p className="error404-text">
          {t("error404.message", {
            defaultValue:
              "Axtardiginiz sehife movcud deyil ve ya silinib. Esas panele qayidaraq davam ede bilersiniz.",
          })}
        </p>

        <button type="button" className="error404-button" onClick={handleGoHome}>
          <HomeIcon className="error404-button-icon" />
          {t("error404.goHome", { defaultValue: "Ana sehifeye qayit" })}
        </button>
      </div>
    </section>
  );
}

export default NotFound;
