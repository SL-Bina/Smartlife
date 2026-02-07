import { Routes, Route } from "react-router-dom";
import {
  ChartPieIcon,
  UserIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import routes from "@/routes";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ManagementProvider } from "@/context";

export function Auth() {
  useDocumentTitle();
  const navbarRoutes = [
    {
      name: "dashboard",
      path: "/dashboard/home",
      icon: ChartPieIcon,
    },
    {
      name: "profile",
      path: "/dashboard/home",
      icon: UserIcon,
    },
    {
      name: "sign up",
      path: "/auth/sign-up",
      icon: UserPlusIcon,
    },
    {
      name: "sign in",
      path: "/auth/sign-in",
      icon: ArrowRightOnRectangleIcon,
    },
  ];

  return (
    <ManagementProvider>
      <div className="relative h-screen w-full overflow-hidden">
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "auth" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>
      </div>
    </ManagementProvider>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
