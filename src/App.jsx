import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { NotFound } from "@/pages/404";

function App() {
    return (
      <Routes>
        {/* Root path - home səhifəsinə yönləndir */}
        <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/properties/*" element={<Dashboard />} />
        <Route path="/auth/*" element={<Auth />} />
        {/* 404 yalnız mövcud olmayan path-lər üçün */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
}

export default App;


// edsfsdf