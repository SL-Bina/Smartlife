import { useState, useEffect } from "react";
import { fetchKPIData } from "../api";

export function useKPIData(filters, startDate, endDate, refreshKey = 0) {
  const [kpiData, setKpiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchKPIData(filters, startDate, endDate);
        setKpiData(result.data || []);
      } catch (err) {
        console.error("Error loading KPI data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, startDate, endDate, refreshKey]);

  return {
    kpiData,
    loading,
    error,
  };
}

