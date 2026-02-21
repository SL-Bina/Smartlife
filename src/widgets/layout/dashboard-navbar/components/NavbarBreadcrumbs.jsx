import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { layoutTitleKeyMap, pageTitleKeyMap } from "../utils/pageTitleMap";

export function NavbarBreadcrumbs({ pathParts, fixedNavbar, navbarHoverEffects, homePath, parentPathMap = {} }) {
  const { t } = useTranslation();
  const layout = pathParts[0] || "";

  const layoutTitle = layoutTitleKeyMap[layout]
    ? t(layoutTitleKeyMap[layout])
    : layout;

  // Layout link — sidebar-dakı ilk aktiv səhifəyə yönləndirir
  const layoutHomePath = homePath || `/${layout}/home`;

  const translatePathSegment = (segment) => {
    if (pageTitleKeyMap[segment]) {
      return t(pageTitleKeyMap[segment]);
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  const breadcrumbItems = [];

  // "home" seqmentini çıxar — layout adı artıq home-u əks etdirir
  const filteredParts = pathParts.slice(1).filter((seg) => seg !== "home");

  if (filteredParts.length > 0) {
    breadcrumbItems.push({
      label: layoutTitle,
      path: layoutHomePath,
    });

    let currentPath = "";
    for (let i = 0; i < filteredParts.length; i++) {
      currentPath += (currentPath ? "/" : "") + filteredParts[i];
      const segment = filteredParts[i];
      const isLast = i === filteredParts.length - 1;

      let translatedLabel;
      if (isLast && pageTitleKeyMap[currentPath]) {
        translatedLabel = t(pageTitleKeyMap[currentPath]);
      } else if (pageTitleKeyMap[segment]) {
        translatedLabel = t(pageTitleKeyMap[segment]);
      } else {
        translatedLabel = translatePathSegment(segment);
      }

      // Parent segment (məs. "management") → ilk aktiv child-a yönləndir
      let itemPath = `/${layout}/${currentPath}`;
      if (!isLast && parentPathMap[segment]) {
        itemPath = `/${layout}${parentPathMap[segment]}`;
      }

      breadcrumbItems.push({
        label: translatedLabel,
        path: itemPath,
        isLast: isLast,
      });
    }
  } else {
    // home səhifəsində və ya layout root-unda yalnız layout adını göstər
    breadcrumbItems.push({
      label: layoutTitle,
      path: layoutHomePath,
      isLast: true,
    });
  }

  // Responsive hover effects
  const hoverClass = navbarHoverEffects === "enabled" 
    ? "transition-all duration-300 hover:scale-110 hover:brightness-110 active:scale-105" 
    : "active:scale-95";

  return (
    <Breadcrumbs className={`bg-transparent p-0 ${fixedNavbar ? "mt-1 mb-1" : "mb-1"}`}>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {item.isLast ? (
            <Typography variant="small" className={`font-bold text-gray-900 dark:text-white text-xs lg:text-sm truncate ${hoverClass}`}>
              {item.label}
            </Typography>
          ) : (
            <Link to={item.path} className={hoverClass}>
              <Typography variant="small" className={`font-semibold text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-xs lg:text-sm truncate ${
                navbarHoverEffects === "enabled" ? "transition-all duration-300 hover:scale-110 hover:font-bold" : ""
              }`}>
                {item.label}
              </Typography>
            </Link>
          )}
        </React.Fragment>
      ))}
    </Breadcrumbs>
  );
}

