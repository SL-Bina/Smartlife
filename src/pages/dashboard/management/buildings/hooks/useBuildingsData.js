import { useState, useEffect } from "react";
import { buildingsAPI } from "../api";

export function useBuildingsData(filters, page, refreshKey = 0) {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    itemsPerPage: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query params - only include non-empty filters
        const params = {
          page,
        };
        
        if (filters.name) params.name = filters.name;
        if (filters.complex) params.complex = filters.complex;
        if (filters.status) params.status = filters.status;

        const response = await buildingsAPI.getAll(params);
        
        if (response.success && response.data) {
          // API response structure: { success, message, data: { data: [...], current_page, last_page, total, ... } }
          const buildingsData = response.data.data || [];
          setBuildings(buildingsData);
          
          setPagination({
            page: response.data.current_page || page,
            itemsPerPage: response.data.per_page || 20,
            total: response.data.total || 0,
            totalPages: response.data.last_page || 1,
          });
        } else {
          setBuildings([]);
          setPagination({
            page: 1,
            itemsPerPage: 20,
            total: 0,
            totalPages: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching Buildings data:", err);
        setError(err.message || "Failed to fetch Buildings data");
        setBuildings([]);
        setPagination({
          page: 1,
          itemsPerPage: 20,
          total: 0,
          totalPages: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBuildings();
  }, [filters, page, refreshKey]);

  return {
    buildings,
    loading,
    error,
    pagination,
  };
}

