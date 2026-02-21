import React, { useState, useEffect } from "react";
import { Spinner, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useInvoicesData } from "./hooks/useInvoicesData";
import { useInvoicesForm } from "./hooks/useInvoicesForm";
import { createInvoice, updateInvoice, deleteInvoice, fetchInvoiceById } from "./api";
import propertiesAPI from "@/pages/dashboard/management/properties/api";
import { InvoicesHeader } from "./components/InvoicesHeader";
import { InvoicesSummaryCard } from "./components/InvoicesSummaryCard";
import { ManagementActions } from "@/components/management/ManagementActions";
import { InvoicesTable } from "./components/InvoicesTable";
import { InvoicesCardList } from "./components/InvoicesCardList";
import { InvoicesPagination } from "./components/InvoicesPagination";
import { InvoicesFormModal } from "./components/modals/InvoicesFormModal";
import { InvoicesSearchModal } from "./components/modals/InvoicesSearchModal";
import { ViewModal } from "@/components/management/ViewModal";
import { DeleteConfirmModal } from "@/components/management/DeleteConfirmModal";
import DynamicToast from "@/components/DynamicToast";
import {
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const InvoicesPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState({});
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const [formOpen, setFormOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [mode, setMode] = useState("create");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const { invoices, totalPaid, totalConsumption, loading, error, pagination } = useInvoicesData(
    search,
    page,
    refreshKey,
    itemsPerPage
  );
  const { formData, updateField, resetForm, setFormFromInvoice } = useInvoicesForm();

  useEffect(() => {
    if (page > (pagination.totalPages || 1) && pagination.totalPages > 0) {
      setPage(1);
    }
  }, [pagination.totalPages, page]);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const handleApplyNameSearch = (value) => {
    setSearch((prev) => ({
      ...prev,
      name: value && value.trim() ? value.trim() : undefined,
    }));
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setSearch((prev) => ({
      ...prev,
      status: value || undefined,
    }));
    setPage(1);
  };

  const handleRemoveFilter = (filterKey) => {
    setSearch((prev) => {
      const newSearch = { ...prev };
      delete newSearch[filterKey];
      Object.keys(newSearch).forEach((key) => {
        if (!newSearch[key] || (typeof newSearch[key] === 'string' && !newSearch[key].trim())) {
          delete newSearch[key];
        }
      });
      return newSearch;
    });
    setPage(1);
  };

  const handleSearch = (searchParams) => {
    setSearch((prev) => ({
      ...prev,
      ...searchParams,
    }));
    setPage(1);
  };

  const handleSearchClick = () => {
    setSearchModalOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setMode("create");
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleView = async (item) => {
    try {
      setViewLoading(true);
      setItemToView(null);
      setViewModalOpen(true);
      
      const invoiceData = await fetchInvoiceById(item.id);
      setItemToView(invoiceData);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      showToast("error", "Faktura məlumatları yüklənərkən xəta baş verdi", "Xəta");
      setViewModalOpen(false);
    } finally {
      setViewLoading(false);
    }
  };

  const handleEdit = async (item) => {
    setSelectedItem(item);
    setMode("edit");
    setFormOpen(true);
    setFormLoading(true);
    try {
      let invoiceData = await fetchInvoiceById(item.id);
      const prop = invoiceData.property || invoiceData.apartment;
      const hasBuildingBlock = (inv) => {
        const b = inv?.building_id ?? inv?.property?.building_id ?? inv?.property?.building?.id ?? inv?.apartment?.building_id ?? inv?.apartment?.building?.id;
        const bl = inv?.block_id ?? inv?.property?.block_id ?? inv?.property?.block?.id ?? inv?.apartment?.block_id ?? inv?.apartment?.block?.id;
        return b != null && bl != null;
      };
      if ((invoiceData.property_id ?? prop?.id) && !hasBuildingBlock(invoiceData)) {
        try {
          const propId = invoiceData.property_id ?? prop?.id;
          const res = await propertiesAPI.getById(propId);
          const propDetail = res?.data?.data ?? res?.data ?? (typeof res === "object" ? res : null);
          if (propDetail) {
            const buildingId = propDetail.building_id ?? propDetail.building?.id ?? null;
            const blockId = propDetail.block_id ?? propDetail.block?.id ?? null;
            invoiceData = {
              ...invoiceData,
              property: {
                ...(prop || {}),
                ...propDetail,
                building_id: buildingId ?? propDetail.building_id,
                block_id: blockId ?? propDetail.block_id,
                building: propDetail.building ?? prop?.building,
                block: propDetail.block ?? prop?.block,
              },
            };
          }
        } catch (err) {
          console.error("Error fetching property for edit:", err);
        }
      }
      setFormFromInvoice(invoiceData);
    } catch (error) {
      console.error("Error fetching invoice for edit:", error);
      showToast("error", error.response?.data?.message || "Faktura məlumatları yüklənərkən xəta baş verdi", "Xəta");
      setFormOpen(false);
      setSelectedItem(null);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      setSaving(true);
      // Map form data to API structure
      const invoiceData = {
        property_id: formData.property_id,
        service_id: formData.service_id,
        amount: parseFloat(formData.amount),
        start_date: formData.start_date,
        due_date: formData.due_date,
        type: formData.type,
        status: formData.status || "unpaid",
        ...(formData.meta?.desc && {
          meta: {
            desc: formData.meta.desc
          }
        })
      };
      await createInvoice(invoiceData);
      showToast("success", "Faktura uğurla əlavə edildi", "Uğurlu");
      setFormOpen(false);
      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error creating invoice:", error);
      showToast("error", error.response?.data?.message || "Faktura əlavə edilərkən xəta baş verdi", "Xəta");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async () => {
    try {
      setSaving(true);
      if (selectedItem) {
        // Map form data to API structure
        const invoiceData = {
          property_id: formData.property_id,
          service_id: formData.service_id,
          amount: parseFloat(formData.amount),
          start_date: formData.start_date,
          due_date: formData.due_date,
          type: formData.type,
          status: formData.status || "unpaid",
          ...(formData.meta?.desc && {
            meta: {
              desc: formData.meta.desc
            }
          })
        };
        await updateInvoice(selectedItem.id, invoiceData);
        showToast("success", "Faktura uğurla yeniləndi", "Uğurlu");
        setFormOpen(false);
        setSelectedItem(null);
        resetForm();
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      showToast("error", error.response?.data?.message || "Faktura yenilənərkən xəta baş verdi", "Xəta");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      if (itemToDelete) {
        await deleteInvoice(itemToDelete.id);
        showToast("success", "Faktura uğurla silindi", "Uğurlu");
        setDeleteModalOpen(false);
        setItemToDelete(null);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      showToast("error", error.response?.data?.message || "Faktura silinərkən xəta baş verdi", "Xəta");
    } finally {
      setDeleteLoading(false);
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= (pagination.totalPages || 1)) {
      setPage(pageNumber);
    }
  };

  const goToPrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (page < (pagination.totalPages || 1)) {
      setPage((prev) => prev + 1);
    }
  };

  const invoiceViewFields = itemToView ? [
    { key: "id", label: "ID", icon: DocumentTextIcon },
    { 
      key: "service.name", 
      label: "Xidmət", 
      icon: BuildingOfficeIcon,
      getValue: (item) => item?.service?.name || "-"
    },
    { 
      key: "property.name", 
      label: "Mənzil", 
      icon: BuildingOfficeIcon,
      getValue: (item) => item?.property?.name || "-"
    },
    { 
      key: "property.complex.name", 
      label: "Kompleks", 
      icon: BuildingOfficeIcon,
      getValue: (item) => item?.property?.complex?.name || "-"
    },
    { 
      key: "residents", 
      label: "Sakinlər", 
      icon: UserGroupIcon,
      customRender: (item) => {
        const residents = item?.residents || [];
        if (residents.length === 0) return "-";
        return (
          <div className="flex flex-col gap-1">
            {residents.map((resident) => (
              <span key={resident.id} className="text-sm">{resident.name}</span>
            ))}
          </div>
        );
      }
    },
    { 
      key: "amount", 
      label: "Məbləğ", 
      icon: CurrencyDollarIcon,
      format: (value) => `${parseFloat(value || 0).toFixed(2)} ₼`
    },
    { 
      key: "amount_paid", 
      label: "Ödənilmiş məbləğ", 
      icon: CurrencyDollarIcon,
      format: (value) => `${parseFloat(value || 0).toFixed(2)} ₼`
    },
    { 
      key: "remaining", 
      label: "Qalıq", 
      icon: CurrencyDollarIcon,
      getValue: (item) => {
        const remaining = parseFloat(item?.amount || 0) - parseFloat(item?.amount_paid || 0);
        return remaining.toFixed(2);
      },
      format: (value) => `${value} ₼`
    },
    { 
      key: "status", 
      label: "Status", 
      icon: CheckCircleIcon,
      format: (value) => {
        const statusMap = {
          paid: "Ödənilib",
          not_paid: "Ödənilməmiş",
          pending: "Gözləyir",
          overdue: "Gecikmiş",
          declined: "Rədd edilib",
          draft: "Qaralama",
          pre_paid: "Ön ödəniş",
        };
        return statusMap[value] || value;
      }
    },
    { 
      key: "type", 
      label: "Növ", 
      icon: DocumentTextIcon,
      format: (value) => {
        const typeMap = {
          daily: "Günlük",
          monthly: "Aylıq",
          yearly: "İllik",
          one_time: "Bir dəfəlik",
          weekly: "Həftəlik",
          quarterly: "Rüblük",
          biannually: "Yarımillik",
        };
        return typeMap[value] || value;
      }
    },
    { 
      key: "start_date", 
      label: "Başlama tarixi", 
      icon: CalendarIcon,
      format: (value) => {
        if (!value) return "-";
        try {
          return new Date(value).toLocaleDateString("az-AZ");
        } catch {
          return value;
        }
      }
    },
    { 
      key: "due_date", 
      label: "Son tarix", 
      icon: CalendarIcon,
      format: (value) => {
        if (!value) return "-";
        try {
          return new Date(value).toLocaleDateString("az-AZ");
        } catch {
          return value;
        }
      }
    },
    { 
      key: "paid_at", 
      label: "Ödəniş tarixi", 
      icon: CalendarIcon,
      format: (value) => {
        if (!value) return "-";
        try {
          return new Date(value).toLocaleDateString("az-AZ");
        } catch {
          return value;
        }
      }
    },
    { 
      key: "payment_method.name", 
      label: "Ödəniş metodu", 
      icon: CreditCardIcon,
      getValue: (item) => item?.payment_method?.name || "-"
    },
    { 
      key: "meta.desc", 
      label: "Təsvir", 
      icon: DocumentTextIcon,
      getValue: (item) => item?.meta?.desc || "-",
      fullWidth: true
    },
  ] : [];

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <InvoicesHeader />
      {/* <InvoicesSummaryCard totalPaid={totalPaid} totalConsumption={totalConsumption} /> */}

      <ManagementActions
        entityLevel="invoice"
        search={search}
        onCreateClick={handleCreate}
        onApplyNameSearch={handleApplyNameSearch}
        onStatusChange={handleStatusChange}
        onRemoveFilter={handleRemoveFilter}
        onSearchClick={handleSearchClick}
        totalItems={pagination.total || 0}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Spinner className="h-6 w-6 dark:text-blue-400" />
          <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
            Yüklənir...
          </Typography>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Typography variant="small" className="text-red-600 dark:text-red-400">
            Xəta: {error}
          </Typography>
        </div>
      ) : (
        <>
          <InvoicesTable 
            invoices={invoices} 
            loading={loading}
            onView={handleView} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
          />
          <InvoicesCardList
            invoices={invoices}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {pagination.totalPages > 1 && (
            <InvoicesPagination
              page={page}
              totalPages={pagination.totalPages || 1}
              onPageChange={goToPage}
              onPrev={goToPrev}
              onNext={goToNext}
            />
          )}
        </>
      )}

      <InvoicesFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedItem(null);
          resetForm();
        }}
        title={mode === "create" ? "Yeni faktura əlavə et" : "Fakturanı redaktə et"}
        formData={formData}
        onFieldChange={updateField}
        onSave={mode === "create" ? handleCreateSave : handleEditSave}
        isEdit={mode === "edit"}
        saving={saving}
        formLoading={formLoading}
      />

      <ViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setItemToView(null);
        }}
        title="Faktura məlumatları"
        item={itemToView}
        fields={invoiceViewFields}
        entityName="faktura"
        loading={viewLoading}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Fakturanı sil"
        itemName={itemToDelete ? `ID: ${itemToDelete.id}` : ""}
        entityName="faktura"
        loading={deleteLoading}
      />

      <InvoicesSearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSearch={handleSearch}
        currentSearch={search}
      />

      <DynamicToast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        title={toast.title}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </div>
  );
};

export default InvoicesPage;
