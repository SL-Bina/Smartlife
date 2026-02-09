import React from "react";
import { useLocation } from "react-router-dom";
import { useMtkColor } from "@/context";
import { SidenavSection } from "./SidenavSection";
import { SidenavMenuItem } from "./SidenavMenuItem";

export function SidenavMenu({ routes, openMenus, setOpenMenus, collapsed = false, flatMenu = false, expandAll = false }) {
  const location = useLocation();
  
  // MTK rəng kodunu al (localStorage-dən də oxuyur)
  const { colorCode } = useMtkColor();
  const mtkColorCode = colorCode;

  React.useEffect(() => {
    if (expandAll) {
      // If expandAll is true, open all menus with children
      setOpenMenus((current) => {
        const updated = {};
        routes.forEach(({ layout, pages }) => {
          pages.forEach((page) => {
            if (Array.isArray(page.children) && page.children.length > 0) {
              updated[page.name] = true;
            }
          });
        });
        return updated;
      });
    } else {
      // Normal behavior: only open menus with active children
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
    }
  }, [location.pathname, routes, expandAll]);

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
              .filter((page) => {
                // hideInSidenav yoxlaması
                if (page.hideInSidenav) return false;
                
                // Əgər children varsa, ən azı bir child görünməlidir
                if (page.children && Array.isArray(page.children) && page.children.length > 0) {
                  const visibleChildren = page.children.filter((child) => !child.hideInSidenav);
                  if (visibleChildren.length === 0) return false;
                }
                
                return true;
              })
              .map((page) => (
                <SidenavMenuItem
                  key={page.name}
                  page={page}
                  layout={layout}
                  routes={routes}
                  openMenus={openMenus}
                  setOpenMenus={setOpenMenus}
                  collapsed={collapsed}
                  flatMenu={flatMenu}
                  expandAll={expandAll}
                  mtkColorCode={mtkColorCode}
                />
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

