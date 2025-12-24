import { useState, useEffect } from "react";
import { fetchReports } from "../api";

export function useReportsData(filters, refreshKey = 0) {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchReports(filters);
        setReports(data);
      } catch (err) {
        console.error("Error loading reports data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, refreshKey]);

  return {
    reports,
    loading,
    error,
  };
}

