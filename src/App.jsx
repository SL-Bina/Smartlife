import { Routes, Route } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import { NotFound } from "@/pages/404";

function App() {
    return (
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/properties/*" element={<Dashboard />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
}

export default App;


// edsfsdf