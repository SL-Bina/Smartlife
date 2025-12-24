import { useState, useEffect } from "react";
import { fetchDebts, fetchTotalDebt } from "../api";

const ITEMS_PER_PAGE = 10;

export function useDebtData(filters, page, refreshKey = 0) {
  const [debts, setDebts] = useState([]);
  const [totalDebt, setTotalDebt] = useState(0);
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

        const [debtsResult, totalDebtResult] = await Promise.all([
          fetchDebts(filters, page, ITEMS_PER_PAGE),
          fetchTotalDebt(filters),
        ]);

        setDebts(debtsResult.data);
        setPagination(debtsResult.pagination);
        setTotalDebt(totalDebtResult);
      } catch (err) {
        console.error("Error loading debt data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, page, refreshKey]);

  return {
    debts,
    totalDebt,
    loading,
    error,
    pagination,
  };
}

