import { useState, useEffect } from "react";
import { fetchTransfers, fetchTotalTransfers } from "../api";

const ITEMS_PER_PAGE = 10;

export function useTransfersData(filters, page, refreshKey = 0) {
  const [transfers, setTransfers] = useState([]);
  const [totalTransfers, setTotalTransfers] = useState(0);
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

        const [transfersResult, totalTransfersResult] = await Promise.all([
          fetchTransfers(filters, page, ITEMS_PER_PAGE),
          fetchTotalTransfers(filters),
        ]);

        setTransfers(transfersResult.data);
        setPagination(transfersResult.pagination);
        setTotalTransfers(totalTransfersResult);
      } catch (err) {
        console.error("Error loading transfers data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, page, refreshKey]);

  return {
    transfers,
    totalTransfers,
    loading,
    error,
    pagination,
  };
}

