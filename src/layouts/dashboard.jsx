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

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes.filter((r) => r.layout === "dashboard")}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
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
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map((page) =>
                page.children && page.children.length > 0
                  ? page.children.map(({ path, element }) => (
                      <Route
                        key={path}
                        exact
                        path={path}
                        element={<ProtectedRoute element={element} />}
                      />
                    ))
                  : (
                      <Route
                        key={page.path}
                        exact
                        path={page.path}
                        element={<ProtectedRoute element={page.element} />}
                      />
                    )
              )
          )}
        </Routes>
       
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
