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
import "./dashboard.css";

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

  const isResident = user?.is_resident === true;
  const userRole = user.role?.name?.toLowerCase() || (typeof user.role === 'string' ? user.role.toLowerCase() : null);
  const isRoot = userRole === "root";

  // If user is resident, check if route is for residents
  const currentPath = window.location.pathname;
  if (isResident && !currentPath.includes("/resident/")) {
    // Resident users can only access resident routes
    return <Navigate to="/resident/home" replace />;
  }

  // Non-resident users cannot access resident routes
  if (!isResident && currentPath.includes("/resident/")) {
    return <Navigate to="/dashboard/home" replace />;
  }

  // Root role has access to all routes (except resident routes if not resident)
  if (isRoot && !isResident) {
    return element;
  }

  if (moduleName && !hasModuleAccess(moduleName)) {
    if (isResident) {
      return <Navigate to="/resident/home" replace />;
    }
    return <Navigate to="/dashboard/home" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    if (isResident) {
      return <Navigate to="/resident/home" replace />;
    }
    return <Navigate to="/dashboard/home" replace />;
  }

  return element;
}

export const filterRoutesByRole = (routes, user, hasModuleAccess, currentLayoutParam) => {
  let userRole = user?.role?.name?.toLowerCase() || (typeof user?.role === 'string' ? user.role.toLowerCase() : null);

  const originalRole = user?.role?.name?.toLowerCase();
  const isRoot = originalRole === "root";
  const isResident = user?.is_resident === true;
  const currentLayout = currentLayoutParam ?? (window.location.pathname.startsWith("/resident") ? "resident" : "dashboard");

  // Build module access map from role_access_modules (preferred) or modules (fallback)
  const userModuleNames = new Set();
  
  if (isRoot) {
    // Root has access to all modules - don't filter
  } else {
    // Check role_access_modules first (more accurate)
    if (user?.role_access_modules && Array.isArray(user.role_access_modules) && user.role_access_modules.length > 0) {
      user.role_access_modules.forEach((m) => {
        if (m.module_name && m.permissions && Array.isArray(m.permissions) && m.permissions.length > 0) {
          userModuleNames.add(m.module_name.toLowerCase());
        }
      });
    }
    
    // Fallback to modules (for backward compatibility)
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
      if (route.layout !== currentLayout) return false;
      return true;
    })
    .map((route) => {
      const filteredPages = route.pages
        .map((page) => {
          // Layout filter already applied above, no path-based resident checks needed

          // Resident users don't need module checks - they only see resident routes
          if (isResident) {
            // For resident users, all resident routes are visible (no module check needed)
            // We already filtered out non-resident routes above
            return page;
          }

          // Xüsusi səhifələr - həmişə görünür (profile, settings və s.)
          const isSpecialPage = page.path === "/profile" || page.path === "/settings";
          
          // Əgər children varsa, parent-in modul yoxlamasını keçiririk
          // Submenu o zaman açılasın ki, daxilində hansısa modul aktivdirsə
          if (page.children && page.children.length > 0) {
            // Parent səhifənin öz modulu yoxdur - yalnız children-ın modullarına görə açılır
            // hasModuleAccess yoxlamasını keçiririk
          } else {
            // Children yoxdursa, normal modul yoxlaması aparırıq
            // ModuleName yoxlaması - Root üçün keçir, digərləri üçün user-in modullarına görə filter et
            let hasModuleAccess = false;
            if (page.moduleName) {
              if (isRoot) {
                // Root üçün bütün modullar görünür
                hasModuleAccess = true;
              } else {
                const moduleNameLower = page.moduleName.toLowerCase();
                hasModuleAccess = userModuleNames.has(moduleNameLower);
                if (!hasModuleAccess) {
                  return null; // Modul yoxdursa və ya icazəsi yoxdursa, səhifəni göstərmə
                }
              }
            } else {
              // ModuleName yoxdursa
              if (isRoot) {
                // Root üçün bütün səhifələr görünür
                hasModuleAccess = true;
              } else if (isSpecialPage) {
                // Xüsusi səhifələr (profile, settings) həmişə görünür
                hasModuleAccess = true;
              } else {
                // Digər səhifələr üçün modul icazəsi yoxdursa, görünməməlidir
                // allowedRoles yoxlaması aparmırıq, çünki yalnız modul icazəsi olan səhifələr görünməlidir
                return null;
              }
            }
          }

          // AllowedRoles yoxlaması - yalnız xüsusi səhifələr üçün (profile, settings)
          if (page.allowedRoles && userRole && !isRoot && isSpecialPage) {
            // Xüsusi səhifələr üçün allowedRoles yoxlaması apar
            if (!page.allowedRoles.includes(userRole)) {
              return null;
            }
          }

          // Children varsa, onları da filter et
          // Submenu o zaman açılasın ki, daxilində hansısa modul aktivdirsə
          if (page.children && page.children.length > 0) {
            const filteredChildren = page.children.filter((child) => {
              // If user is resident, only show resident routes (no module check needed)
              if (isResident) {
                if (child.path && !child.path.includes("/resident/")) {
                  return false; // Hide non-resident routes for residents
                }
                // For resident users, all resident routes are visible (no module check)
                return true;
              } else {
                // If user is not resident, hide resident routes
                if (child.path && child.path.includes("/resident/")) {
                  return false; // Hide resident routes for non-residents
                }
              }

              // ModuleName yoxlaması (only for non-resident users)
              let childHasModuleAccess = false;
              if (child.moduleName) {
                if (isRoot) {
                  // Root üçün bütün modullar görünür
                  childHasModuleAccess = true;
                } else {
                  const moduleNameLower = child.moduleName.toLowerCase();
                  childHasModuleAccess = userModuleNames.has(moduleNameLower);
                  if (!childHasModuleAccess) {
                    return false; // Modul yoxdursa və ya icazəsi yoxdursa, child görünməməlidir
                  }
                }
              } else {
                // ModuleName yoxdursa, allowedRoles yoxlaması aparılmalıdır
                childHasModuleAccess = false;
              }

              // AllowedRoles yoxlaması - Root üçün və modul icazəsi olanlar üçün keçir
              if (child.allowedRoles && userRole && !isRoot) {
                // Əgər modul varsa və icazəsi varsa, allowedRoles yoxlamasını keçir
                if (childHasModuleAccess) {
                  // Modul var, icazəsi var - allowedRoles yoxlamasını keçir
                } else {
                  // Modul yoxdursa və ya icazəsi yoxdursa, allowedRoles yoxlamasını apar
                  if (!child.allowedRoles.includes(userRole)) {
                    return false;
                  }
                }
              } else if (!childHasModuleAccess && !isRoot) {
                // Əgər modul yoxdursa və allowedRoles də yoxdursa, child görünməməlidir
                return false;
              }
              return true;
            });

            // Əgər heç bir child görünmürsə, parent səhifəni də göstərmə
            // Submenu o zaman açılasın ki, daxilində hansısa modul aktivdirsə
            if (filteredChildren.length === 0) {
              return null;
            }

            // Parent səhifənin öz modulu yoxdur - yalnız children-ın modullarına görə açılır
            // Buna görə parent-in modul yoxlamasını keçiririk
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

  const currentLayout = window.location.pathname.startsWith("/resident") ? "resident" : "dashboard";
  const filteredRoutes = filterRoutesByRole(routes, user, hasModuleAccess, currentLayout);

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
          <DashboardNavbar />
          <div className="mt-4 sm:mt-6 md:mt-8">
            <Routes>
              {/* Root path - home səhifəsinə yönləndir (resident üçün resident/home) */}
              <Route 
                path="/" 
                element={
                  user?.is_resident === true 
                    ? <Navigate to="/resident/home" replace /> 
                    : <Navigate to="/home" replace />
                } 
              />
              {filteredRoutes.map(
                ({ layout, pages }) => {
                  const currentLayout = window.location.pathname.startsWith("/resident") ? "resident" : "dashboard";
                  if (layout !== currentLayout) return null;
                  return pages.map((page) => {
                    if (page.children && page.children.length > 0) {
                      return page.children.map(({ path, element, allowedRoles, moduleName }) => {
                        // Path-i düzgün formatla - /dashboard prefix-i olmadan, amma / ilə başlamalıdır
                        const currentLayout = window.location.pathname.startsWith("/resident") ? "resident" : "dashboard";
                        let routePath = path;
                        if (routePath.startsWith(`/${currentLayout}/`)) {
                          routePath = routePath.replace(`/${currentLayout}/`, "");
                        } else if (routePath.startsWith("/")) {
                          routePath = routePath.slice(1);
                        }
                        // /dashboard altında olduğumuz üçün path-dən /dashboard-ı çıxarırıq
                        if (routePath === "/") {
                          routePath = "";
                        }
                        return (
                          <Route
                            key={path}
                            path={routePath}
                            element={<ProtectedRoute element={element} allowedRoles={allowedRoles} moduleName={moduleName} />}
                          />
                        );
                      });
                    } else {
                      // Path-i düzgün formatla - cari layout prefix-i olmadan, nisbi path olmalıdır
                      const currentLayout = window.location.pathname.startsWith("/resident") ? "resident" : "dashboard";
                      let routePath = page.path;
                      if (routePath.startsWith(`/${currentLayout}/`)) {
                        routePath = routePath.replace(`/${currentLayout}/`, "");
                      } else if (routePath.startsWith("/")) {
                        routePath = routePath.slice(1);
                      }
                      // /dashboard altında olduğumuz üçün path-dən /dashboard-ı çıxarırıq
                      if (routePath === "/") {
                        routePath = "";
                      }
                      return (
                        <Route
                          key={page.path}
                          path={routePath}
                          element={<ProtectedRoute element={page.element} allowedRoles={page.allowedRoles} moduleName={page.moduleName} />}
                        />
                      );
                    }
                  });
                }
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
