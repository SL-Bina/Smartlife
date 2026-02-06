import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useServiceFeeData } from "./hooks/useServiceFeeData";
import { createServiceFee, updateServiceFee, deleteServiceFee } from "./api";
import { ServiceFeeHeader } from "./components/ServiceFeeHeader";
import { LoadingState } from "./components/LoadingState";
import { NotFoundState } from "./components/NotFoundState";
import { ApartmentInfoCard } from "./components/ApartmentInfoCard";
import { ServiceFeeTable } from "./components/ServiceFeeTable";
import { ServiceFeeFormModal } from "./components/modals/ServiceFeeFormModal";
import { ServiceFeeDeleteModal } from "./components/modals/ServiceFeeDeleteModal";
import DynamicToast from "@/components/DynamicToast";
import { servicesAPI } from "@/pages/dashboard/services/api";

const PropertyServiceFeePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { property, serviceFees, pagination, loading, error, refreshData, loadPage } = useServiceFeeData(id);
  
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedServiceFee, setSelectedServiceFee] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [toast, setToast] = useState(null);

  // Load services for dropdown
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoadingServices(true);
        const response = await servicesAPI.getAll({ per_page: 1000 });
        const servicesList = response?.data?.data || response?.data || [];
        setServices(servicesList);
      } catch (err) {
        console.error("Error loading services:", err);
      } finally {
        setLoadingServices(false);
      }
    };
    loadServices();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const openCreate = () => {
    setSelectedServiceFee(null);
    setFormModalOpen(true);
  };

  const openEdit = (serviceFee) => {
    setSelectedServiceFee(serviceFee);
    setFormModalOpen(true);
  };

  const openDelete = (serviceFee) => {
    setSelectedServiceFee(serviceFee);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    try {
      
      if (selectedServiceFee) {
        // Update
        await updateServiceFee(id, selectedServiceFee.id, formData);
        showToast("success", "Service fee uğurla yeniləndi");
      } else {
        // Create
        await createServiceFee(id, formData);
        showToast("success", "Service fee uğurla əlavə edildi");
      }
      setFormModalOpen(false);
      refreshData();
    } catch (err) {
      console.error("Submit Error:", err);
      const errorMessage = err?.message || (err?.errors ? Object.values(err.errors || {})[0]?.[0] : null) || "Xəta baş verdi";
      showToast("error", errorMessage);
    }
  };

  const handleDelete = async () => {
    if (!selectedServiceFee) return;
    
    try {
      await deleteServiceFee(id, selectedServiceFee.id);
      showToast("success", "Service fee uğurla silindi");
      setDeleteModalOpen(false);
      refreshData();
    } catch (err) {
      const errorMessage = err?.message || "Xəta baş verdi";
      showToast("error", errorMessage);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !property) {
    return <NotFoundState />;
  }

  return (
    <div className="space-y-6">
      <ServiceFeeHeader 
        propertyName={property?.name || property?.meta?.apartment_number || `Mənzil ${id}`}
        onBack={() => navigate("/management/properties")}
        onCreate={openCreate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ServiceFeeTable
            serviceFees={serviceFees}
            loading={loading}
            pagination={pagination}
            onPageChange={loadPage}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        </div>

        <div className="lg:col-span-1">
          <ApartmentInfoCard property={property} />
        </div>
      </div>

      {formModalOpen && (
        <ServiceFeeFormModal
          open={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSubmit={handleSubmit}
          serviceFee={selectedServiceFee}
          services={services}
          loadingServices={loadingServices}
        />
      )}

      {deleteModalOpen && selectedServiceFee && (
        <ServiceFeeDeleteModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          serviceFee={selectedServiceFee}
        />
      )}

      {toast && (
        <DynamicToast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PropertyServiceFeePage;
