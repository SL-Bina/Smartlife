import { useState, useEffect, useMemo } from "react";
import { fetchInvoices } from "@/services/finance/invoicesApi";

const ITEMS_PER_PAGE = 20;

export function useInvoicesData(filters = {}, page = 1, refreshKey = 0, itemsPerPage = ITEMS_PER_PAGE) {
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

  // JSON.stringify — object reference deyil, dəyər müqayisəsi edir
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const invoicesResult = await fetchInvoices(filters, page, itemsPerPage);
        const invoicesData   = invoicesResult.data || [];

        setInvoices(invoicesData);
        setPagination(invoicesResult.pagination);

        // Cəmi məbləğləri gələn datadan hesablayırıq (əlavə API sorğusu lazım deyil)
        const paid = invoicesData.reduce((s, inv) => s + parseFloat(inv.amount_paid || 0), 0);
        const cons = invoicesData.reduce((s, inv) => s + parseFloat(inv.amount       || 0), 0);
        setTotalPaid(parseFloat(paid.toFixed(2)));
        setTotalConsumption(parseFloat(cons.toFixed(2)));
      } catch (err) {
        console.error("Error loading invoices data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  // filtersKey — JSON string, reference problemi yoxdur
  }, [filtersKey, page, refreshKey, itemsPerPage]);

  return {
    invoices,
    totalPaid,
    totalConsumption,
    loading,
    error,
    pagination,
  };
}

