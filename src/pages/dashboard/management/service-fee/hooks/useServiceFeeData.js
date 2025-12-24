import { useState, useEffect } from "react";
import { fetchApartmentById, fetchServiceFeeHistory } from "../api";

export function useServiceFeeData(apartmentId) {
  const [apartment, setApartment] = useState(null);
  const [feeHistory, setFeeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apartmentId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [apartmentData, historyData] = await Promise.all([
          fetchApartmentById(apartmentId),
          fetchServiceFeeHistory(apartmentId),
        ]);

        setApartment(apartmentData);
        setFeeHistory(historyData);
      } catch (err) {
        console.error("Error loading service fee data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [apartmentId]);

  const addHistoryEntry = (entry) => {
    setFeeHistory((prev) => [entry, ...prev]);
  };

  const updateApartmentFee = (newFee) => {
    setApartment((prev) => (prev ? { ...prev, serviceFee: newFee } : null));
  };

  return {
    apartment,
    feeHistory,
    loading,
    error,
    addHistoryEntry,
    updateApartmentFee,
  };
}

