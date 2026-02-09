/**
 * Enhanced Properties Detail Hook
 * 
 * Bu hook property detail məlumatını yükləyir və cache edir.
 */

import { useState, useEffect } from "react";
import { useManagementEnhanced } from "@/context/ManagementContextEnhanced";
import propertiesAPI from "../api";

/**
 * Hook for loading and managing property detail
 */
export function usePropertiesDetail(propertyId) {
  const { state, actions } = useManagementEnhanced();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if property is already in context
  const propertyFromContext = useMemo(() => {
    if (!propertyId) return null;
    return state.lists.properties.entities[propertyId] || null;
  }, [propertyId, state.lists.properties.entities]);

  // Check if it's the selected property
  const isSelected = state.propertyId === propertyId;
  const selectedProperty = state.property;

  // Determine which property to use
  const property = isSelected && selectedProperty
    ? selectedProperty
    : propertyFromContext;

  // Load property detail if not in context
  useEffect(() => {
    if (!propertyId) return;
    if (property) return; // Already loaded

    const loadDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await propertiesAPI.getById(propertyId);
        const propertyData = res?.data?.data || res?.data || null;
        
        if (propertyData) {
          // Update context
          actions.setProperty(propertyId, propertyData);
        }
      } catch (err) {
        setError(err?.message || "Error loading property");
        console.error("Error loading property detail:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [propertyId, property, actions]);

  return {
    property,
    loading,
    error,
    isSelected,
  };
}


