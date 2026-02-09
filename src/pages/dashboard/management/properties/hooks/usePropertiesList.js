/**
 * Enhanced Properties List Hook
 * 
 * Bu hook yeni ManagementContextEnhanced və filter məntiqini istifadə edir.
 * Backend filter olmadan frontend-də filtering, sorting, pagination təmin edir.
 */

import { useState, useEffect, useMemo } from "react";
import { useManagementEnhanced } from "@/context/ManagementContextEnhanced";
import { useFilteredProperties, useProcessedList } from "@/hooks/management/useFilteredLists";
import propertiesAPI from "../api";

/**
 * Main hook for Properties list with filtering, sorting, pagination
 */
export function usePropertiesList() {
  const { state, actions } = useManagementEnhanced();
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all properties from context (normalized)
  const allProperties = useMemo(() => {
    return state.lists.properties.ids.map(
      (id) => state.lists.properties.entities[id]
    ).filter(Boolean);
  }, [state.lists.properties]);

  // Apply filters
  const filteredProperties = useFilteredProperties(allProperties, state.filters);

  // Apply sorting and pagination
  const processed = useProcessedList({
    list: filteredProperties,
    filters: state.filters,
    sortConfig,
    page,
    itemsPerPage,
    filterFn: null, // Already filtered above
  });

  // Refresh list from API
  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      await actions.refreshList("properties");
    } catch (err) {
      setError(err?.message || "Error loading properties");
      console.error("Error refreshing properties:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (state.lists.properties.ids.length === 0 && !state.loading.properties) {
      refresh();
    }
  }, []);

  return {
    // Data
    items: processed.items,
    allItems: processed.allItems,
    filteredItems: filteredProperties,
    
    // Pagination
    currentPage: processed.currentPage,
    totalPages: processed.totalPages,
    totalItems: processed.totalItems,
    filteredCount: processed.filteredCount,
    hasNextPage: processed.hasNextPage,
    hasPrevPage: processed.hasPrevPage,
    itemsPerPage,
    
    // Controls
    setPage,
    setItemsPerPage,
    setSortConfig,
    sortConfig,
    
    // State
    loading: loading || state.loading.properties,
    error,
    refresh,
  };
}


