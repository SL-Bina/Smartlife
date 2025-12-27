import React from "react";
import { useLocation } from "react-router-dom";
import { SidenavSection } from "./SidenavSection";
import { SidenavMenuItem } from "./SidenavMenuItem";

export function SidenavMenu({ routes, openMenus, setOpenMenus, collapsed = false }) {
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
    <div className={`flex-1 py-3 xl:py-4 ${
      collapsed 
        ? "px-1 xl:px-1 overflow-hidden" 
        : "px-2 xl:px-3 overflow-y-auto overflow-x-hidden custom-sidenav-scrollbar"
    }`}>
      {routes.map(({ layout, title, pages }, key) => (
        <div key={key} className={collapsed ? "mb-2 xl:mb-3" : "mb-4 xl:mb-6"}>
          {!collapsed && <SidenavSection title={title} />}
          <ul className={collapsed ? "space-y-1" : "space-y-0.5 xl:space-y-1"}>
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
                  collapsed={collapsed}
                />
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

