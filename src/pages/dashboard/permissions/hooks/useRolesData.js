import { useState, useEffect } from "react";
import { rolesAPI } from "../api";

export function useRolesData(refreshKey = 0) {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await rolesAPI.getAll({ page: 1, per_page: 1000 });
        
        if (response.success && response.data) {
          const rolesData = response.data.data || [];
          // API-dən gələn struktur: role_id, role_name
          // Bizim istifadə etdiyimiz struktur: id, name
          const formattedRoles = rolesData.map((role) => ({
            id: role.role_id,
            name: role.role_name,
            role_id: role.role_id,
            role_name: role.role_name,
            role_access_modules: role.role_access_modules || [],
          }));
          setRoles(formattedRoles);
          setPagination({
            page: response.data.current_page || 1,
            per_page: response.data.per_page || 20,
            total: response.data.total || rolesData.length,
            totalPages: response.data.last_page || 1,
          });
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError(err.message || "Rollar yüklənərkən xəta baş verdi");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [refreshKey]);

  return {
    roles,
    loading,
    error,
    pagination,
  };
}

