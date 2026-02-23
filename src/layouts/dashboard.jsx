import { Routes, Route, Navigate } from "react-router-dom";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
} from "@/widgets/layout";
import routes from "@/routes";
import { useAuth } from "@/store/hooks/useAuth";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import AiChat from "@/widgets/layout/ai-chat";
import Footer from "@/widgets/layout/footer";
import { NotFound } from "@/pages/404";
import { getFirstActivePath, buildParentPathMap } from "@/utils/getFirstActivePath";
import "./dashboard.css";

function ProtectedRoute({ element, allowedRoles, moduleName, fallbackPath }) {
  const { user, isInitialized, hasModuleAccess } = useAuth();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-red-600 rounded-full"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth/sign-in" replace />;

  const isResident = user?.is_resident === true;
  const roleName =
    user?.role?.name?.toLowerCase() ||
    (typeof user?.role === "string" ? user.role.toLowerCase() : null);

  const isRoot = roleName === "root";

  const currentPath = window.location.pathname;
  const redirectTo = fallbackPath || (isResident ? "/resident/home" : "/dashboard/home");

  if (isResident && !currentPath.includes("/resident/")) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!isResident && currentPath.includes("/resident/")) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!isRoot) {
    if (moduleName && !hasModuleAccess(moduleName)) {
      return <Navigate to={redirectTo} replace />;
    }

    if (allowedRoles && roleName) {
      if (!allowedRoles.includes(roleName)) {
        return <Navigate to={redirectTo} replace />;
      }
    }
  }

  return element;
}

export const filterRoutesByRole = (routes, user) => {
  if (!user) return [];

  const roleName =
    user?.role?.name?.toLowerCase() ||
    (typeof user?.role === "string" ? user.role.toLowerCase() : null);

  const isRoot = roleName === "root";
  const isResident = user?.is_resident === true;

  const userModules = new Set();

  if (!isRoot) {
    if (Array.isArray(user?.role_access_modules)) {
      user.role_access_modules.forEach((m) => {
        if (m?.module_name && Array.isArray(m?.permissions) && m.permissions.length > 0) {
          userModules.add(m.module_name.toLowerCase());
        }
      });
    }

    if (userModules.size === 0 && Array.isArray(user?.modules)) {
      user.modules
        .filter((m) => Array.isArray(m?.can) && m.can.length > 0)
        .forEach((m) => {
          if (m?.name) userModules.add(m.name.toLowerCase());
        });
    }
  }

  return routes
    .filter((route) => {
      if (route.layout === "resident") return isResident;
      if (route.layout === "dashboard") return !isResident;
      return false;
    })
    .map((route) => {
      const isResidentLayout = route.layout === "resident";
      const filteredPages = route.pages
        .map((page) => {
          // Resident layout pages don't have module-based access control
          if (isResidentLayout) return page;

          const isSpecial = page.path === "/profile" || page.path === "/settings";

          // Children olan parent-larda əvvəlcə children-ları filtr et.
          // Hər hansı child keçirsə parent-ı göstər (parent group/container kimi işləyir).
          if (page.children?.length) {
            const children = page.children.filter((child) => {
              if (!isRoot) {
                if (child.moduleName) {
                  if (!userModules.has(child.moduleName.toLowerCase())) return false;
                } else {
                  return false;
                }

                if (child.allowedRoles && roleName) {
                  if (!child.allowedRoles.includes(roleName)) return false;
                }
              }

              return true;
            });

            if (!children.length) return null;

            return { ...page, children };
          }

          // Normal page (children yoxdur)
          if (!isRoot && !isSpecial) {
            if (page.moduleName) {
              if (!userModules.has(page.moduleName.toLowerCase())) return null;
            } else {
              return null;
            }
          }

          if (page.allowedRoles && roleName && !isRoot) {
            if (!page.allowedRoles.includes(roleName)) return null;
          }

          return page;
        })
        .filter(Boolean);

      if (!filteredPages.length) return null;

      return { ...route, pages: filteredPages };
    })
    .filter(Boolean);
};

export function Dashboard() {
  const [controller, uiActions] = useMaterialTailwindController();
  const { sidenavType, sidenavCollapsed, sidenavSize, sidenavPosition } = controller;
  const { user, hasModuleAccess, refreshUser, isInitialized, error, clearError } = useAuth();
  const [isDesktop, setIsDesktop] = useState(false);

  useDocumentTitle();

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);



  useEffect(() => {
    if (user && isInitialized) {
      const interval = setInterval(() => {
        refreshUser();
      }, 10 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user?.id, isInitialized, refreshUser]);

  const hasToken = typeof document !== 'undefined' && document.cookie.includes('smartlife_token=');

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-gray-50/50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (hasToken && !user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const filteredRoutes = filterRoutesByRole(routes, user, hasModuleAccess);
  const firstActivePath = getFirstActivePath(filteredRoutes);
  const parentPathMap = buildParentPathMap(filteredRoutes);

  const showError = error && !user;

  return (
    <div className="min-h-screen bg-blue-gray-50/50 dark:bg-gray-900 flex flex-col relative ">
      {showError && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-4 py-3 relative z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-red-600 dark:text-red-400 font-medium text-sm">
                ⚠️ {error}
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium text-sm px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      <div className="relative z-[99999]">
        <Sidenav
          routes={filteredRoutes}
          brandImg={
            sidenavType === "dark" ? "/Site_Logo/white_big.png" : "/Site_Logo/color_big.png"
          }
        />
      </div>
      <motion.div
        initial={false}
        animate={{
          marginLeft: isDesktop && sidenavPosition === "left"
            ? (sidenavCollapsed ? 80 : (sidenavSize === "small" ? 240 : sidenavSize === "large" ? 400 : 320))
            : 0,
          marginRight: isDesktop && sidenavPosition === "right"
            ? (sidenavCollapsed ? 80 : (sidenavSize === "small" ? 240 : sidenavSize === "large" ? 400 : 320))
            : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className="p-4 relative z-0 dashboard-content"
      >
        <DashboardNavbar homePath={firstActivePath} parentPathMap={parentPathMap} />
        <div className="mt-4 sm:mt-6 md:mt-8">
          <Routes>
            <Route
              path="/"
              element={<Navigate to={firstActivePath} replace />}
            />
            {filteredRoutes.map(
              ({ layout, pages }) =>
                (layout === "dashboard" || layout === "resident") &&
                pages.map((page) => {
                  if (page.children && page.children.length > 0) {
                    return page.children.map(({ path, element, allowedRoles, moduleName }) => {
                      let routePath = path;
                      if (routePath.startsWith("/dashboard/")) {
                        routePath = routePath.replace("/dashboard", "");
                      } else if (routePath.startsWith("/resident/")) {
                        routePath = routePath.replace("/resident", "");
                      } else if (!routePath.startsWith("/")) {
                        routePath = `/${routePath}`;
                      }
                      if (routePath === "/") {
                        routePath = "";
                      }
                      return (
                        <Route
                          key={path}
                          path={routePath}
                          element={<ProtectedRoute element={element} allowedRoles={allowedRoles} moduleName={moduleName} fallbackPath={firstActivePath} />}
                        />
                      );
                    });
                  } else {
                    let routePath = page.path;
                    if (routePath.startsWith("/dashboard/")) {
                      routePath = routePath.replace("/dashboard", "");
                    } else if (routePath.startsWith("/resident/")) {
                      routePath = routePath.replace("/resident", "");
                    } else if (!routePath.startsWith("/")) {
                      routePath = `/${routePath}`;
                    }
                    if (routePath === "/") {
                      routePath = "";
                    }
                    return (
                      <Route
                        key={page.path}
                        path={routePath}
                        element={<ProtectedRoute element={page.element} allowedRoles={page.allowedRoles} moduleName={page.moduleName} fallbackPath={firstActivePath} />}
                      />
                    );
                  }
                })
            )}
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </div>
      </motion.div>
      <div className="relative z-10">
        <Configurator />
        <AiChat />
        <Footer />
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
