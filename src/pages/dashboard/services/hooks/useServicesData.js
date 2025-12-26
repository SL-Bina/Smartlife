import { useState, useEffect, useMemo } from "react";
import { servicesAPI } from "../api";

const ITEMS_PER_PAGE = 10;

export function useServicesData(filters, page, refreshKey = 0) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await servicesAPI.getAll();
        
        if (response.success && response.data) {
          setServices(response.data);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error("Error fetching Services data:", err);
        setError(err.message || "Failed to fetch Services data");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [refreshKey]);

  const filteredData = useMemo(() => {
    let filtered = [...services];
    
    // Name filter
    if (filters.name) {
      filtered = filtered.filter((item) =>
        item.name?.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    return filtered;
  }, [services, filters]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return {
    services: pageData,
    loading,
    error,
    pagination: {
      page,
      itemsPerPage: ITEMS_PER_PAGE,
      total: filteredData.length,
      totalPages,
    },
  };
}

