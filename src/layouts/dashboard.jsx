import { Routes, Route, Navigate } from "react-router-dom";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  ManagementInfo,
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

  const userRole = user.role?.name?.toLowerCase() || (typeof user.role === 'string' ? user.role.toLowerCase() : null);
  const isRoot = userRole === "root";

  // Root role has access to all routes
  if (isRoot) {
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

export const filterRoutesByRole = (routes, user, hasModuleAccess) => {
  let userRole = user?.role?.name?.toLowerCase() || (typeof user?.role === 'string' ? user.role.toLowerCase() : null);

  const originalRole = user?.role?.name?.toLowerCase();
  const isRoot = originalRole === "root";
  const isResident = originalRole === "resident";

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
          // Xüsusi səhifələr - həmişə görünür (profile, settings və s.)
          const isSpecialPage = page.path === "/profile" || page.path === "/settings";
          
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

          // AllowedRoles yoxlaması - yalnız xüsusi səhifələr üçün (profile, settings)
          if (page.allowedRoles && userRole && !isRoot && isSpecialPage) {
            // Xüsusi səhifələr üçün allowedRoles yoxlaması apar
            if (!page.allowedRoles.includes(userRole)) {
              return null;
            }
          }

          // Children varsa, onları da filter et
          if (page.children && page.children.length > 0) {
            const filteredChildren = page.children.filter((child) => {
              // ModuleName yoxlaması
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
  const [controller, uiActions] = useMaterialTailwindController();
  const { sidenavType, sidenavCollapsed, sidenavSize, sidenavPosition } = controller;
  const { user, hasModuleAccess, refreshUser, isInitialized, error, clearError } = useAuth();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const bgRef = useRef(null);

  useDocumentTitle();

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Check dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') || 
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };
    
    checkDarkMode();
    
    // Watch for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);
    
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  // Parallax effect on mouse move
  useEffect(() => {
    if (!isDarkMode || !bgRef.current) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Daha güclü parallax effekti
      const x = (clientX / innerWidth - 0.5) * 40;
      const y = (clientY / innerHeight - 0.5) * 40;
      
      if (bgRef.current) {
        bgRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
      }
    };

    const handleMouseLeave = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = 'translate(0, 0) scale(1)';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDarkMode]);

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

  // Show error message if there's an auth error
  const showError = error && !user;

  return (
    <div className="min-h-screen bg-blue-gray-50/50 dark:bg-gray-900 flex flex-col relative">
      {/* Parallax Space Background for Dark Mode */}
      {isDarkMode && (
        <div 
          ref={bgRef}
          className="dashboard-dark-bg parallax-active"
        >
          <div className="nebula"></div>
        </div>
      )}
      
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
        <div className="relative z-10">
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
          className="p-4 relative z-10 dashboard-content"
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
