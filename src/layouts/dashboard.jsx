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
import { useMaterialTailwindController, ManagementProvider } from "@/context";
import { useAuth } from "@/context/AuthContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import AiChat from "@/widgets/layout/ai-chat";
import Footer from "@/widgets/layout/footer";

function ProtectedRoute({ element, allowedRoles, moduleName }) {
  const { user, isInitialized, hasModuleAccess } = useAuth();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Yüklənir...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const userRole = user.role?.name?.toLowerCase() || (typeof user.role === 'string' ? user.role.toLowerCase() : null);
  const originalRole = user.role?.name?.toLowerCase();

  if (originalRole === "root") {
    return element;
  }

  if (moduleName && !hasModuleAccess(moduleName)) {
    if (userRole === "resident") {
      return <Navigate to="/dashboard/resident/home" replace />;
    }
    return <Navigate to="/dashboard/home" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    if (userRole === "resident") {
      return <Navigate to="/dashboard/resident/home" replace />;
    }
    return <Navigate to="/dashboard/home" replace />;
  }

  return element;
}

const filterRoutesByRole = (routes, user, hasModuleAccess) => {
  let userRole = user?.role?.name?.toLowerCase() || (typeof user?.role === 'string' ? user.role.toLowerCase() : null);

  const originalRole = user?.role?.name?.toLowerCase();
  const isRoot = originalRole === "root";
  const isResident = originalRole === "resident";

  return routes
    .filter((route) => {
      if (route.layout !== "dashboard") return false;

      if (route.pages && route.pages.length > 0) {
        const firstPage = route.pages[0];
        if (firstPage.path && firstPage.path.includes("/resident/")) {
          return isResident;
        }
        if (isResident && firstPage.path && !firstPage.path.includes("/resident/")) {
          return false;
        }
      }

      return true;
    })
    .map((route) => {
      const filteredPages = route.pages
        .map((page) => {
          if (page.moduleName) {
            const hasAccess = hasModuleAccess(page.moduleName);
            if (!hasAccess) {
              console.log(`🚫 Hiding page ${page.name} - no access to module ${page.moduleName}`);
              return null;
            }
          }

          if (page.allowedRoles && userRole && !isRoot) {
            if (!page.allowedRoles.includes(userRole)) {
              return null;
            }
          }

          if (page.children && page.children.length > 0) {
            const filteredChildren = page.children.filter((child) => {
              if (child.moduleName && !hasModuleAccess(child.moduleName)) {
                return false;
              }

              if (child.allowedRoles && userRole && !isRoot) {
                if (!child.allowedRoles.includes(userRole)) {
                  return false;
                }
              }
              return true;
            });

            if (filteredChildren.length === 0) {
              return null;
            }

            return {
              ...page,
              children: filteredChildren,
            };
          }

          return page;
        })
        .filter((page) => page !== null);

      return {
        ...route,
        pages: filteredPages,
      };
    });
};

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType, sidenavCollapsed, sidenavSize, sidenavPosition } = controller;
  const { user, hasModuleAccess, refreshUser, isInitialized } = useAuth();
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
    if (user) {
      const interval = setInterval(() => {
        refreshUser();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user?.id, refreshUser]);

  const hasToken = typeof document !== 'undefined' && document.cookie.includes('smartlife_token=');
  if (!isInitialized || (hasToken && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-gray-50/50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Yüklənir...</p>
        </div>
      </div>
    );
  }

  const filteredRoutes = user
    ? filterRoutesByRole(routes, user, hasModuleAccess)
    : routes.filter((r) => r.layout === "dashboard");

  return (
    <ManagementProvider>
      <div className="min-h-screen bg-blue-gray-50/50 dark:bg-black flex flex-col">
        <Sidenav
          routes={filteredRoutes}
          brandImg={
            sidenavType === "dark" ? "/Site_Logo/white_big.png" : "/Site_Logo/color_big.png"
          }
        />
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
          className="p-4"
        >
          <DashboardNavbar />
          <div className="mb-8">
            <Routes>
              {filteredRoutes.map(
                ({ layout, pages }) =>
                  layout === "dashboard" &&
                  pages.map((page) => {
                    if (page.children && page.children.length > 0) {
                      return page.children.map(({ path, element, allowedRoles, moduleName }) => {
                        const routePath = path.startsWith("/") ? path.substring(1) : path;
                        return (
                          <Route
                            key={path}
                            path={routePath}
                            element={<ProtectedRoute element={element} allowedRoles={allowedRoles} moduleName={moduleName} />}
                          />
                        );
                      });
                    } else {
                      const routePath = page.path.startsWith("/") ? page.path.substring(1) : page.path;
                      return (
                        <Route
                          key={page.path}
                          path={routePath}
                          element={<ProtectedRoute element={page.element} allowedRoles={page.allowedRoles} moduleName={page.moduleName} />}
                        />
                      );
                    }
                  })
              )}
              <Route
                path="*"
                element={
                  <Navigate
                    to={user?.role?.name?.toLowerCase() === "resident" ? "/dashboard/resident/home" : "/dashboard/home"}
                    replace
                  />
                }
              />
            </Routes>
          </div>
        </motion.div>
        <Configurator />
        <AiChat />
      </div>
      <Footer />
    </ManagementProvider>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
