import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
} from "@/widgets/layout";
import myPropertiesAPI from "@/pages/resident/myproperties/api";  
import routes from "@/routes";
import { useAuth } from "@/store/hooks/useAuth";
import { setSelectedProperty } from "@/store/slices/management/propertySlice";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import AiChat from "@/widgets/layout/ai-chat";
import Footer from "@/widgets/layout/footer";
import { NotFound } from "@/pages/404";
import { getFirstActivePath, buildParentPathMap } from "@/utils/getFirstActivePath";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import { useDynamicToast } from "@/hooks/useDynamicToast";
import { addNotification } from "@/store/slices/notificationsSlice";
import DynamicToastContainer from "@/components/ui/DynamicToastContainer";
import "./dashboard.css";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

function ProtectedRoute({ element, allowedRoles, moduleName, fallbackPath }) {
  const { user, isInitialized, hasModuleAccess } = useAuth();
  const selectedPropertyId = useSelector((state) => state.property.selectedPropertyId);
  const properties = useSelector((state) => state.property.properties);

  if (!isInitialized) {
    return null;
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
          if (isResidentLayout) return page;

          const isSpecial = page.path === "/profile" || page.path === "/settings";

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
  const dispatch = useDispatch();
  const selectedPropertyId = useSelector((state) => state.property.selectedPropertyId);
  const [residentPropertyCount, setResidentPropertyCount] = useState(null);
  const [residentReady, setResidentReady] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const { showToast: showWsToast } = useDynamicToast();
    const token = getCookie('smartlife_token');

  useDocumentTitle();

  // Real-time WebSocket notifications
  useNotificationsSocket(
    user,
    token,
    useCallback((notif) => {
      // Redux store-a əlavə et (bell badge yenilənsin)
      dispatch(addNotification(notif));
      // Toast göstər
      showWsToast({
        type: notif.type === "warning" ? "info" : (notif.type || "info"),
        title: notif.title,
        message: notif.message,
        duration: 5000,
      });
    }, [dispatch, showWsToast])
  );

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

  const selectedProperty = useSelector((state) => state.property.selectedProperty);

  // Single effect: fetch fresh property list for residents so colors (sub_data.complex) are
  // always up-to-date at entry. Also acts as a gate: residentReady stays false until the
  // properties request settles, which keeps the global loading screen alive long enough for
  // useComplexColor to have correct data before any page renders.
  useEffect(() => {
    if (!user) return;

    if (!user.is_resident) {
      setResidentReady(true);
      return;
    }

    setResidentReady(false);
    myPropertiesAPI.getAll()
      .then((resp) => {
        const list = resp?.data?.data || resp?.data || [];
        const propertiesList = Array.isArray(list) ? list : [];
        setResidentPropertyCount(propertiesList.length);

        if (propertiesList.length > 0) {
          // Always sync with full API data so sub_data.complex.color is present
          const freshProperty =
            propertiesList.find((p) => p.id === selectedPropertyId) || propertiesList[0];
          dispatch(
            setSelectedProperty({ id: freshProperty?.id ?? null, property: freshProperty ?? null })
          );
        }
      })
      .catch(() => setResidentPropertyCount(0))
      .finally(() => setResidentReady(true));
  }, [user?.id]);

  const hasToken = typeof document !== 'undefined' && document.cookie.includes('smartlife_token=');

  // Only block rendering while: (1) auth hasn't resolved yet, OR
  // (2) user is a resident and their properties haven't loaded yet.
  // Without this guard, a fresh browser with no cookie (user === null) would
  // leave residentReady=false forever and the loading spinner would never clear.
  if (!isInitialized || (user?.is_resident === true && !residentReady)) {
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

  let filteredRoutes = filterRoutesByRole(routes, user, hasModuleAccess);

  const firstActivePath = getFirstActivePath(filteredRoutes);
  const parentPathMap = buildParentPathMap(filteredRoutes);

  const showError = error && !user;

  return (
    <div className=" bg-blue-gray-50/50 dark:bg-gray-900 flex flex-col relative min-h-screen pb-5">
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
        <div className="mt-4 sm:mt-6 md:mt-8 min-h-screen-minus-footer">
          <Suspense fallback={null}>
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
          </Suspense>
        </div>
      </motion.div>
      <div className="relative z-10">
        <Configurator />
        <AiChat />
        <Footer />
      </div>

      {/* Global toast stack (iOS Dynamic Island style) */}
      <DynamicToastContainer />
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
