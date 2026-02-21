import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import "./dashboard.css";

function ProtectedRoute({ element, allowedRoles, moduleName, currentLayout }) {
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

  const isResident = user?.is_resident === true;
  const userRole = user.role?.name?.toLowerCase() || (typeof user.role === 'string' ? user.role.toLowerCase() : null);
  const isRoot = userRole === "root";

  // Resident istifadəçi /dashboard-dadırsa → /resident-ə yönləndir
  if (isResident && currentLayout === "dashboard") {
    return <Navigate to="/resident" replace />;
  }

  // Qeyri-resident istifadəçi /resident-dədirdirsa → /dashboard-a yönləndir
  if (!isResident && currentLayout === "resident") {
    return <Navigate to="/dashboard" replace />;
  }

  // Root role has access to all dashboard routes
  if (isRoot) {
    return element;
  }

  if (moduleName && !hasModuleAccess(moduleName)) {
    return <Navigate to={`/${currentLayout}`} replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to={`/${currentLayout}`} replace />;
  }

  return element;
}

export const filterRoutesByRole = (routes, user, hasModuleAccess, currentLayout) => {
  let userRole = user?.role?.name?.toLowerCase() || (typeof user?.role === 'string' ? user.role.toLowerCase() : null);

  const originalRole = user?.role?.name?.toLowerCase();
  const isRoot = originalRole === "root";
  const isResident = user?.is_resident === true;

  // Build module access map from role_access_modules (preferred) or modules (fallback)
  const userModuleNames = new Set();
  
  if (isRoot) {
    // Root has access to all modules - don't filter
  } else {
    if (user?.role_access_modules && Array.isArray(user.role_access_modules) && user.role_access_modules.length > 0) {
      user.role_access_modules.forEach((m) => {
        if (m.module_name && m.permissions && Array.isArray(m.permissions) && m.permissions.length > 0) {
          userModuleNames.add(m.module_name.toLowerCase());
        }
      });
    }
    
    if (userModuleNames.size === 0 && user?.modules && Array.isArray(user.modules)) {
      user.modules
        .filter((m) => m?.can && Array.isArray(m.can) && m.can.length > 0)
        .forEach((m) => {
          if (m?.name) {
            userModuleNames.add(m.name.toLowerCase());
          }
        });
    }
  }

  return routes
    .filter((route) => {
      // Yalnız cari layout-a uyğun route-ları göstər
      return route.layout === currentLayout;
    })
    .map((route) => {
      const filteredPages = route.pages
        .map((page) => {
          // Resident layout-da modul yoxlaması lazım deyil
          if (currentLayout === "resident") {
            return page;
          }

          // Aşağıdakı yoxlamalar yalnız dashboard layout üçündür
          const isSpecialPage = page.path === "/profile" || page.path === "/settings";
          
          if (page.children && page.children.length > 0) {
            // Parent - yalnız children-ın modullarına görə açılır
          } else {
            let hasModuleAccess = false;
            if (page.moduleName) {
              if (isRoot) {
                hasModuleAccess = true;
              } else {
                const moduleNameLower = page.moduleName.toLowerCase();
                hasModuleAccess = userModuleNames.has(moduleNameLower);
                if (!hasModuleAccess) {
                  return null;
                }
              }
            } else {
              if (isRoot) {
                hasModuleAccess = true;
              } else if (isSpecialPage) {
                hasModuleAccess = true;
              } else {
                return null;
              }
            }
          }

          if (page.allowedRoles && userRole && !isRoot && isSpecialPage) {
            if (!page.allowedRoles.includes(userRole)) {
              return null;
            }
          }

          if (page.children && page.children.length > 0) {
            const filteredChildren = page.children.filter((child) => {
              let childHasModuleAccess = false;
              if (child.moduleName) {
                if (isRoot) {
                  childHasModuleAccess = true;
                } else {
                  const moduleNameLower = child.moduleName.toLowerCase();
                  childHasModuleAccess = userModuleNames.has(moduleNameLower);
                  if (!childHasModuleAccess) {
                    return false;
                  }
                }
              } else {
                childHasModuleAccess = false;
              }

              if (child.allowedRoles && userRole && !isRoot) {
                if (childHasModuleAccess) {
                  // OK
                } else {
                  if (!child.allowedRoles.includes(userRole)) {
                    return false;
                  }
                }
              } else if (!childHasModuleAccess && !isRoot) {
                return false;
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

// İstifadəçinin sidebar-da gördüyü ilk səhifənin path-ini qaytarır (layout-a nisbətən)
function getFirstPagePath(filteredRoutes) {
  for (const route of filteredRoutes) {
    if (route.pages) {
      for (const page of route.pages) {
        if (page.hideInSidenav) continue;
        if (page.children && page.children.length > 0) {
          const firstChild = page.children.find(c => !c.hideInSidenav);
          if (firstChild?.path) return firstChild.path;
        } else if (page.path) {
          return page.path;
        }
      }
    }
  }
  return "/home"; // fallback
}

export function Dashboard() {
  const [controller, uiActions] = useMaterialTailwindController();
  const { sidenavType, sidenavCollapsed, sidenavSize, sidenavPosition } = controller;
  const { user, hasModuleAccess, refreshUser, isInitialized, error, clearError } = useAuth();
  const [isDesktop, setIsDesktop] = useState(false);
  const { pathname } = useLocation();

  // URL-dən cari layout-u təyin et
  const currentLayout = pathname.startsWith("/resident") ? "resident" : "dashboard";

  useDocumentTitle();

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);



  // Refresh user data periodically (only if user is logged in and initialized)
  useEffect(() => {
    if (user && isInitialized) {
      // Refresh every 10 minutes instead of 5 to reduce API calls
      const interval = setInterval(() => {
        refreshUser();
      }, 10 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user?.id, isInitialized, refreshUser]);

  const hasToken = typeof document !== 'undefined' && document.cookie.includes('smartlife_token=');
  
  // İnitialize olunmayıbsa loading göstər
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

  // User yoxdursa və token varsa, sign-in-ə yönləndir
  if (hasToken && !user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // User yoxdursa, sign-in-ə yönləndir
  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const filteredRoutes = filterRoutesByRole(routes, user, hasModuleAccess, currentLayout);
  const homePath = getFirstPagePath(filteredRoutes);

  // Show error message if there's an auth error
  const showError = error && !user;

  return (
    <div className="min-h-screen bg-blue-gray-50/50 dark:bg-gray-900 flex flex-col relative">
      
      {/* Error Banner */}
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
            homePath={`/${currentLayout}${homePath}`}
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
          className="p-4 relative z-0 dashboard-content min-h-screen-minus-footer"
        >
          <DashboardNavbar homePath={`/${currentLayout}${homePath}`} filteredRoutes={filteredRoutes} />
          <div className="mt-4 sm:mt-6 md:mt-8">
            <Routes>
              {/* Root path - sidebar-dakı ilk səhifəyə yönləndir */}
              <Route 
                path="/" 
                element={<Navigate to={homePath} replace />}
              />
              {filteredRoutes.map(
                ({ layout, pages }) =>
                  layout === currentLayout &&
                  pages.map((page) => {
                    if (page.children && page.children.length > 0) {
                      return page.children.map(({ path, element, allowedRoles, moduleName }) => {
                        let routePath = path;
                        if (!routePath.startsWith("/")) {
                          routePath = `/${routePath}`;
                        }
                        return (
                          <Route
                            key={path}
                            path={routePath}
                            element={<ProtectedRoute element={element} allowedRoles={allowedRoles} moduleName={moduleName} currentLayout={currentLayout} />}
                          />
                        );
                      });
                    } else {
                      let routePath = page.path;
                      if (!routePath.startsWith("/")) {
                        routePath = `/${routePath}`;
                      }
                      return (
                        <Route
                          key={page.path}
                          path={routePath}
                          element={<ProtectedRoute element={page.element} allowedRoles={page.allowedRoles} moduleName={page.moduleName} currentLayout={currentLayout} />}
                        />
                      );
                    }
                  })
              )}
              {/* 404 yalnız mövcud olmayan path-lər üçün */}
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
          {/* <ManagementInfo /> */}
          <Footer />
        </div>
      </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
