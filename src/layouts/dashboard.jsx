import { Routes, Route, Navigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController } from "@/context";
import { useAuth } from "@/auth-context";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

function ProtectedRoute({ element, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "resident") {
      return <Navigate to="/dashboard/resident/home" replace />;
    }
    return <Navigate to="/dashboard/home" replace />;
  }

  return element;
}

const filterRoutesByRole = (routes, userRole) => {
  return routes
    .filter((route) => route.layout === "dashboard")
    .map((route) => {
      const filteredPages = route.pages
        .map((page) => {
          if (page.allowedRoles && !page.allowedRoles.includes(userRole)) {
            return null;
          }

          if (page.children && page.children.length > 0) {
            const filteredChildren = page.children.filter((child) => {
              if (child.allowedRoles && !child.allowedRoles.includes(userRole)) {
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

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const { user } = useAuth();
  
  useDocumentTitle();

  const filteredRoutes = user
    ? filterRoutesByRole(routes, user.role)
    : routes.filter((r) => r.layout === "dashboard");

  return (
    <div className="min-h-screen bg-blue-gray-50/50 dark:bg-black flex flex-col">
      <Sidenav
        routes={filteredRoutes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80 h-[calc(100vh-2rem)] flex flex-col">
        <DashboardNavbar />
        <div className="flex-1 min-h-0 overflow-auto">
          <Routes>
          {filteredRoutes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map((page) => {
                if (page.children && page.children.length > 0) {
                  return page.children.map(({ path, element, allowedRoles }) => {
                    const routePath = path.startsWith("/") ? path.substring(1) : path;
                    return (
                      <Route
                        key={path}
                        path={routePath}
                        element={<ProtectedRoute element={element} allowedRoles={allowedRoles} />}
                      />
                    );
                  });
                } else {
                  const routePath = page.path.startsWith("/") ? page.path.substring(1) : page.path;
                  return (
                    <Route
                      key={page.path}
                      path={routePath}
                      element={<ProtectedRoute element={page.element} allowedRoles={page.allowedRoles} />}
                    />
                  );
                }
              })
          )}
        </Routes>
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
