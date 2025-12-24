import { useState, useEffect } from "react";
import { fetchDeposits, fetchTotalDeposit } from "../api";

const ITEMS_PER_PAGE = 10;

export function useDepositData(filters, page, refreshKey = 0) {
  const [deposits, setDeposits] = useState([]);
  const [totalDeposit, setTotalDeposit] = useState(0);
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

        const [depositsResult, totalDepositResult] = await Promise.all([
          fetchDeposits(filters, page, ITEMS_PER_PAGE),
          fetchTotalDeposit(filters),
        ]);

        setDeposits(depositsResult.data);
        setPagination(depositsResult.pagination);
        setTotalDeposit(totalDepositResult);
      } catch (err) {
        console.error("Error loading deposit data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, page, refreshKey]);

  return {
    deposits,
    totalDeposit,
    loading,
    error,
    pagination,
  };
}

