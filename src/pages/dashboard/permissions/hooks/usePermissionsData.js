import { useState, useEffect } from "react";
import { permissionsAPI } from "../api";

export function usePermissionsData(refreshKey = 0) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await permissionsAPI.getAll({ page: 1, per_page: 1000 });
        
        if (response.success && response.data && response.data.data) {
          const modulesData = response.data.data;
          setModules(modulesData);
          setPagination({
            page: response.data.current_page || 1,
            per_page: response.data.per_page || 20,
            total: response.data.total || modulesData.length,
            totalPages: response.data.last_page || 1,
          });
        }
      } catch (err) {
        console.error("Error fetching permissions:", err);
        setError(err.message || "İcazələr yüklənərkən xəta baş verdi");
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [refreshKey]);

  return {
    modules,
    loading,
    error,
    pagination,
  };
}

