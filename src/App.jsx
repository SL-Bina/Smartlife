import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { Dashboard, Auth } from "@/layouts";
import { NotFound } from "@/pages/404";

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
    </div>
  );
}

function App() {  
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/resident/*" element={<Dashboard />} />
        <Route path="/properties/*" element={<Dashboard />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
