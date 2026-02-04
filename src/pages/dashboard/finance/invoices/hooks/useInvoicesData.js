import { useState, useEffect } from "react";
import { fetchInvoices, fetchTotalPaid, fetchTotalConsumption } from "../api";

const ITEMS_PER_PAGE = 10;

export function useInvoicesData(filters, page, refreshKey = 0, sortConfig = { key: null, direction: "asc" }) {
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

        // Fetch all data without pagination for sorting
        const [allInvoicesResult, totalPaidResult, totalConsumptionResult] = await Promise.all([
          fetchInvoices(filters, 1, 10000), // Fetch all data
          fetchTotalPaid(filters),
          fetchTotalConsumption(filters),
        ]);

        let sortedData = allInvoicesResult.data;

        // Natural sort function for strings with numbers
        const naturalSort = (a, b) => {
          const aStr = String(a).toLowerCase();
          const bStr = String(b).toLowerCase();
          
          // Split into parts: text and numbers
          const aParts = aStr.match(/(\d+|\D+)/g) || [];
          const bParts = bStr.match(/(\d+|\D+)/g) || [];
          
          const maxLength = Math.max(aParts.length, bParts.length);
          
          for (let i = 0; i < maxLength; i++) {
            const aPart = aParts[i] || "";
            const bPart = bParts[i] || "";
            
            // If both are numbers, compare numerically
            if (/^\d+$/.test(aPart) && /^\d+$/.test(bPart)) {
              const aNum = parseInt(aPart, 10);
              const bNum = parseInt(bPart, 10);
              if (aNum !== bNum) {
                return aNum - bNum;
              }
            } else {
              // Compare as strings
              if (aPart !== bPart) {
                return aPart < bPart ? -1 : 1;
              }
            }
          }
          
          return 0;
        };

        // Apply sorting if sortConfig is provided
        if (sortConfig.key) {
          sortedData = [...allInvoicesResult.data].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle numeric values
            if (sortConfig.key === "id" || sortConfig.key === "amount" || sortConfig.key === "paidAmount" || sortConfig.key === "remaining") {
              // Remove currency symbols and parse
              aValue = parseFloat(String(aValue).replace(/[₼,\s]/g, "")) || 0;
              bValue = parseFloat(String(bValue).replace(/[₼,\s]/g, "")) || 0;
            }
            // Handle date values
            else if (sortConfig.key === "invoiceDate" || sortConfig.key === "paymentDate") {
              if (sortConfig.key === "paymentDate" && (!aValue || !bValue)) {
                if (!aValue && !bValue) return 0;
                if (!aValue) return 1;
                if (!bValue) return -1;
              }
              const aDate = aValue ? new Date(aValue) : new Date(0);
              const bDate = bValue ? new Date(bValue) : new Date(0);
              if (isNaN(aDate.getTime()) || isNaN(bDate.getTime())) {
                aValue = String(aValue || "");
                bValue = String(bValue || "");
              } else {
                aValue = aDate.getTime();
                bValue = bDate.getTime();
              }
            }
            // Handle string values with natural sort (for serviceName, owner, etc.)
            else if (typeof aValue === "string" && typeof bValue === "string") {
              const comparison = naturalSort(aValue, bValue);
              return sortConfig.direction === "asc" ? comparison : -comparison;
            }

            // Compare values for numeric and date
            if (typeof aValue === "number" || typeof bValue === "number") {
              if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
              }
              if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
              }
              return 0;
            }

            // Fallback string comparison
            if (typeof aValue === "string" && typeof bValue === "string") {
              aValue = aValue.toLowerCase();
              bValue = bValue.toLowerCase();
              if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
              }
              if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
              }
            }
            
            return 0;
          });
        }

        // Apply pagination after sorting
        const total = sortedData.length;
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedData = sortedData.slice(startIndex, endIndex);

        setInvoices(paginatedData);
        setPagination({
          page,
          itemsPerPage: ITEMS_PER_PAGE,
          total,
          totalPages: Math.ceil(total / ITEMS_PER_PAGE),
        });
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
  }, [filters, page, refreshKey, sortConfig]);

  return {
    invoices,
    totalPaid,
    totalConsumption,
    loading,
    error,
    pagination,
  };
}

