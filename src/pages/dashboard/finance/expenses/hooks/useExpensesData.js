import { useState, useEffect } from "react";
import { fetchExpenses, fetchTotalExpenses, fetchTotalExpensesByMethod } from "../api";

const ITEMS_PER_PAGE = 10;

export function useExpensesData(filters, page, refreshKey = 0) {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [bankTotal, setBankTotal] = useState(0);
  const [cashTotal, setCashTotal] = useState(0);
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

        const [expensesResult, totalExpensesResult, bankTotalResult, cashTotalResult] = await Promise.all([
          fetchExpenses(filters, page, ITEMS_PER_PAGE),
          fetchTotalExpenses(filters),
          fetchTotalExpensesByMethod(filters, "Bank"),
          fetchTotalExpensesByMethod(filters, "Nağd"),
        ]);

        setExpenses(expensesResult.data);
        setPagination(expensesResult.pagination);
        setTotalExpenses(totalExpensesResult);
        setBankTotal(bankTotalResult);
        setCashTotal(cashTotalResult);
      } catch (err) {
        console.error("Error loading expenses data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters, page, refreshKey]);

  return {
    expenses,
    totalExpenses,
    bankTotal,
    cashTotal,
    loading,
    error,
    pagination,
  };
}

