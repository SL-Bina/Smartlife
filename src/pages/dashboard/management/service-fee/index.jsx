import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useServiceFeeData } from "./hooks/useServiceFeeData";
import { useServiceFeeForm } from "./hooks/useServiceFeeForm";
import { updateServiceFee } from "./api";
import { ServiceFeeHeader } from "./components/ServiceFeeHeader";
import { LoadingState } from "./components/LoadingState";
import { NotFoundState } from "./components/NotFoundState";
import { ApartmentInfoCard } from "./components/ApartmentInfoCard";
import { ServiceFeeFormCard } from "./components/ServiceFeeFormCard";
import { FeeHistoryCard } from "./components/FeeHistoryCard";

const PropertyServiceFeePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { apartment, feeHistory, loading, error, addHistoryEntry, updateApartmentFee } = useServiceFeeData(id);
  const { feeValue, saving, setSaving, updateFeeValue } = useServiceFeeForm(apartment);

  const handleSave = async () => {
    if (!feeValue || parseFloat(feeValue) <= 0) {
      alert(t("serviceFee.invalidFee"));
      return;
    }

    setSaving(true);
    try {
      await updateServiceFee(apartment.id, parseFloat(feeValue), t("serviceFee.reasons.manualChange"));
      
      const newHistoryEntry = {
        id: feeHistory.length + 1,
        date: new Date().toISOString().split("T")[0],
        amount: parseFloat(feeValue),
        changedBy: "Admin",
        reason: t("serviceFee.reasons.manualChange"),
      };
      
      addHistoryEntry(newHistoryEntry);
      updateApartmentFee(parseFloat(feeValue));
      alert(t("serviceFee.successMessage"));
    } catch (error) {
      console.error("Error updating service fee:", error);
      alert(t("serviceFee.errorMessage") || "Xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !apartment) {
    return <NotFoundState />;
  }

  return (
    <div>
      <ServiceFeeHeader apartmentNumber={apartment.number} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ApartmentInfoCard apartment={apartment} />
          <ServiceFeeFormCard
            apartment={apartment}
            feeValue={feeValue}
            onFeeChange={updateFeeValue}
            onSave={handleSave}
            saving={saving}
          />
        </div>

        <div className="lg:col-span-1">
          <FeeHistoryCard feeHistory={feeHistory} />
        </div>
      </div>
    </div>
  );
};

export default PropertyServiceFeePage;
