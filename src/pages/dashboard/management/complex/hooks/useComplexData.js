import { useState, useEffect } from "react";
import { complexAPI } from "../api";

export function useComplexData(filters, page, refreshKey = 0) {
  const [complexes, setComplexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    itemsPerPage: 20,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchComplexes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build query params - only include non-empty filters
        const params = {
          page,
        };
        
        if (filters.name) params.name = filters.name;
        if (filters.address) params.address = filters.address;
        if (filters.status) params.status = filters.status;
        if (filters.email) params.email = filters.email;
        if (filters.phone) params.phone = filters.phone;

        const response = await complexAPI.getAll(params);
        
        if (response.success && response.data) {
          // API response structure: { success, message, data: { data: [...], current_page, last_page, total, ... } }
          const complexesData = response.data.data || [];
          setComplexes(complexesData);
          
          setPagination({
            page: response.data.current_page || page,
            itemsPerPage: response.data.per_page || 20,
            total: response.data.total || 0,
            totalPages: response.data.last_page || 1,
          });
        } else {
          setComplexes([]);
          setPagination({
            page: 1,
            itemsPerPage: 20,
            total: 0,
            totalPages: 0,
          });
        }
      } catch (err) {
        console.error("Error fetching Complex data:", err);
        setError(err.message || "Failed to fetch Complex data");
        setComplexes([]);
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

    fetchComplexes();
  }, [filters, page, refreshKey]);

  return {
    complexes,
    loading,
    error,
    pagination,
  };
}

