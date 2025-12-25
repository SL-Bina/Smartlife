import React from "react";
import { useLocation } from "react-router-dom";
import { SidenavSection } from "./SidenavSection";
import { SidenavMenuItem } from "./SidenavMenuItem";

export function SidenavMenu({ routes, openMenus, setOpenMenus }) {
  const location = useLocation();

  React.useEffect(() => {
    setOpenMenus((current) => {
      const updated = {};

      routes.forEach(({ layout, pages }) => {
        pages.forEach((page) => {
          if (Array.isArray(page.children) && page.children.length > 0) {
            const hasActiveChild = page.children.some(
              (child) => `/${layout}${child.path}` === location.pathname
            );

            if (hasActiveChild) {
              updated[page.name] = true;
            }
          }
        });
      });

      return updated;
    });
  }, [location.pathname, routes]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 xl:px-3 py-3 xl:py-4 custom-sidenav-scrollbar">
      {routes.map(({ layout, title, pages }, key) => (
        <div key={key} className="mb-4 xl:mb-6">
          <SidenavSection title={title} />
          <ul className="space-y-0.5 xl:space-y-1">
            {pages
              .filter((page) => !page.hideInSidenav)
              .map((page) => (
                <SidenavMenuItem
                  key={page.name}
                  page={page}
                  layout={layout}
                  routes={routes}
                  openMenus={openMenus}
                  setOpenMenus={setOpenMenus}
                />
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

