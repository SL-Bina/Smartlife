import { useState, useEffect } from "react";
import { fetchPropertyById, fetchServiceFeeList } from "../api";

export function useServiceFeeData(propertyId) {
  const [property, setProperty] = useState(null);
  const [serviceFees, setServiceFees] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async (page = 1) => {
    if (!propertyId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [propertyData, serviceFeeResponse] = await Promise.all([
        fetchPropertyById(propertyId),
        fetchServiceFeeList(propertyId, { page }),
      ]);

      setProperty(propertyData);
      
      if (serviceFeeResponse?.success && serviceFeeResponse?.data) {
        setServiceFees(serviceFeeResponse.data.data || []);
        setPagination({
          current_page: serviceFeeResponse.data.current_page || 1,
          last_page: serviceFeeResponse.data.last_page || 1,
          per_page: serviceFeeResponse.data.per_page || 10,
          total: serviceFeeResponse.data.total || 0,
        });
      } else {
        setServiceFees([]);
      }
    } catch (err) {
      console.error("Error loading service fee data:", err);
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [propertyId]);

  const refreshData = () => {
    loadData(pagination.current_page);
  };

  return {
    property,
    serviceFees,
    pagination,
    loading,
    error,
    refreshData,
    loadPage: (page) => loadData(page),
  };
}

