import { Routes, Route } from "react-router-dom";
import {
  ChartPieIcon,
  UserIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
import routes from "@/routes";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
// ManagementProvider removed - using Redux instead

export function Auth() {
  useDocumentTitle();
  

  return (
    <div className="relative h-screen w-full overflow-hidden min-h-screen-minus-footer">
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
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;
