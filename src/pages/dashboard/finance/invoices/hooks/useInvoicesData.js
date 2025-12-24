import { useState, useEffect } from "react";
import { fetchInvoices, fetchTotalPaid, fetchTotalConsumption } from "../api";

const ITEMS_PER_PAGE = 10;

export function useInvoicesData(filters, page, refreshKey = 0) {
  const [invoices, setInvoices] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalConsumption, setTotalConsumption] = useState(0);
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

        const [invoicesResult, totalPaidResult, totalConsumptionResult] = await Promise.all([
          fetchInvoices(filters, page, ITEMS_PER_PAGE),
          fetchTotalPaid(filters),
          fetchTotalConsumption(filters),
        ]);

        setInvoices(invoicesResult.data);
        setPagination(invoicesResult.pagination);
        setTotalPaid(totalPaidResult);
        setTotalConsumption(totalConsumptionResult);
      } catch (err) {
        console.error("Error loading invoices data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, page, refreshKey]);

  return {
    invoices,
    totalPaid,
    totalConsumption,
    loading,
    error,
    pagination,
  };
}

