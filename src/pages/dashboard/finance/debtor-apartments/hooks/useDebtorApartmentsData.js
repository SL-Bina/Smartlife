import { useState, useEffect } from "react";
import { fetchDebtorApartments, fetchTotalDebt } from "../api";

const ITEMS_PER_PAGE = 10;

export function useDebtorApartmentsData(filters, page, refreshKey = 0) {
  const [apartments, setApartments] = useState([]);
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

        const [apartmentsResult, totalDebtResult] = await Promise.all([
          fetchDebtorApartments(filters, page, ITEMS_PER_PAGE),
          fetchTotalDebt(filters),
        ]);

        setApartments(apartmentsResult.data);
        setPagination(apartmentsResult.pagination);
        setTotalDebt(totalDebtResult);
      } catch (err) {
        console.error("Error loading debtor apartments data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, page, refreshKey]);

  return {
    apartments,
    totalDebt,
    loading,
    error,
    pagination,
  };
}

