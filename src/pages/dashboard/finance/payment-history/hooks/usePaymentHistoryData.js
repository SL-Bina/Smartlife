import { useState, useEffect } from "react";
import { fetchPaymentHistory, fetchTotalAmount } from "../api";

const ITEMS_PER_PAGE = 10;

export function usePaymentHistoryData(filters, page, refreshKey = 0) {
  const [payments, setPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
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

        const [paymentsResult, totalAmountResult] = await Promise.all([
          fetchPaymentHistory(filters, page, ITEMS_PER_PAGE),
          fetchTotalAmount(filters),
        ]);

        setPayments(paymentsResult.data);
        setPagination(paymentsResult.pagination);
        setTotalAmount(totalAmountResult);
      } catch (err) {
        console.error("Error loading payment history data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, page, refreshKey]);

  return {
    payments,
    totalAmount,
    loading,
    error,
    pagination,
  };
}

