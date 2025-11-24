import { Routes, Route, Navigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  // Configurator,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController } from "@/context";
import { useAuth } from "@/auth-context";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

function ProtectedRoute({ element }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return element;
}

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  
  // Update document title based on current route
  useDocumentTitle();

  return (
    <div className="min-h-screen bg-blue-gray-50/50 dark:bg-black">
      <Sidenav
        routes={routes.filter((r) => r.layout === "dashboard")}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80 h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
        <DashboardNavbar />
        {/* <Configurator /> */}
        {/* <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton> */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map((page) => {
                if (page.children && page.children.length > 0) {
                  return page.children.map(({ path, element }) => {
                    // Remove leading slash for nested routes
                    const routePath = path.startsWith("/") ? path.substring(1) : path;
                    return (
                      <Route
                        key={path}
                        path={routePath}
                        element={<ProtectedRoute element={element} />}
                      />
                    );
                  });
                } else {
                  // Remove leading slash for nested routes
                  const routePath = page.path.startsWith("/") ? page.path.substring(1) : page.path;
                  return (
                    <Route
                      key={page.path}
                      path={routePath}
                      element={<ProtectedRoute element={page.element} />}
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
