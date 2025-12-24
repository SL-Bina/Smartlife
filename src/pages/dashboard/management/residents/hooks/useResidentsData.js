import { useState, useEffect } from "react";
import { fetchResidents } from "../api";

const ITEMS_PER_PAGE = 10;

export function useResidentsData(filters, page, refreshKey = 0) {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    itemsPerPage: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchResidents(filters, page, ITEMS_PER_PAGE);

        setResidents(result.data);
        setPagination(result.pagination);
      } catch (err) {
        console.error("Error loading residents data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, page, refreshKey]);

  return {
    residents,
    loading,
    error,
    pagination,
  };
}

