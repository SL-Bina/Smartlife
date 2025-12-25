import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { layoutTitleKeyMap, pageTitleKeyMap } from "../utils/pageTitleMap";

export function NavbarBreadcrumbs({ pathParts, fixedNavbar }) {
  const { t } = useTranslation();
  const layout = pathParts[0] || "";

  const layoutTitle = layoutTitleKeyMap[layout]
    ? t(layoutTitleKeyMap[layout])
    : layout;

  const translatePathSegment = (segment) => {
    if (pageTitleKeyMap[segment]) {
      return t(pageTitleKeyMap[segment]);
    }
    if (segment === "management") {
      return t("sidebar.buildingManagement");
    }
    return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  };

  const breadcrumbItems = [];
  if (pathParts.length > 1) {
    breadcrumbItems.push({
      label: layoutTitle,
      path: `/${layout}`,
    });

    let currentPath = "";
    for (let i = 1; i < pathParts.length; i++) {
      currentPath += (currentPath ? "/" : "") + pathParts[i];
      const segment = pathParts[i];
      const isLast = i === pathParts.length - 1;

      let translatedLabel;
      if (isLast && pageTitleKeyMap[currentPath]) {
        translatedLabel = t(pageTitleKeyMap[currentPath]);
      } else if (pageTitleKeyMap[segment]) {
        translatedLabel = t(pageTitleKeyMap[segment]);
      } else {
        translatedLabel = translatePathSegment(segment);
      }

      breadcrumbItems.push({
        label: translatedLabel,
        path: `/${layout}/${currentPath}`,
        isLast: isLast,
      });
    }
  } else {
    breadcrumbItems.push({
      label: layoutTitle,
      path: `/${layout}`,
      isLast: true,
    });
  }

  return (
    <Breadcrumbs className={`bg-transparent p-0 ${fixedNavbar ? "mt-1 mb-1" : "mb-1"}`}>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {item.isLast ? (
            <Typography variant="small" className="font-bold text-gray-900 dark:text-white text-xs lg:text-sm truncate">
              {item.label}
            </Typography>
          ) : (
            <Link to={item.path}>
              <Typography variant="small" className="font-semibold text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 text-xs lg:text-sm truncate">
                {item.label}
              </Typography>
            </Link>
          )}
        </React.Fragment>
      ))}
    </Breadcrumbs>
  );
}

