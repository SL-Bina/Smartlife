import { useState, useEffect } from "react";
import { fetchExpenseTypes } from "../api";

const ITEMS_PER_PAGE = 10;

export function useExpenseTypesData(page, refreshKey = 0) {
  const [expenseTypes, setExpenseTypes] = useState([]);
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

        const result = await fetchExpenseTypes(page, ITEMS_PER_PAGE);

        setExpenseTypes(result.data);
        setPagination(result.pagination);
      } catch (err) {
        console.error("Error loading expense types data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, refreshKey]);

  return {
    expenseTypes,
    loading,
    error,
    pagination,
  };
}

