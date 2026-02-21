import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { NotFound } from "@/pages/404";
import { useAuth } from "@/store/hooks/useAuth";

function App() {
  const { user, isInitialized } = useAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/home" replace />}
      />
      <Route
        path="/home"
        element={
          isInitialized
            ? user?.is_resident === true
              ? <Navigate to="/resident/home" replace />
              : <Navigate to="/dashboard/home" replace />
            : <Navigate to="/auth/sign-in" replace />
        }
      />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/resident/*" element={<Dashboard />} />
      <Route path="/properties/*" element={<Dashboard />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
