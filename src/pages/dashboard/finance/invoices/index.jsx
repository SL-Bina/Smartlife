import React, { useState, useEffect } from "react";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import complexesAPI from "@/services/management/complexesApi";
import { useInvoicesForm, useInvoicesFilters } from "@/hooks/finance/invoices";
import propertiesAPI from "@/services/management/propertiesApi";
import {
  Skeleton,
  SummaryCards,
  Table,
  CardList,
  Pagination,
  FormModal,
  PaymentModal,
  SearchModal,
  Header,
} from "@/components/common";
import { ManagementActions } from "@/components/management/ManagementActions";
import { ViewModal } from "@/components/common/modals/ViewModal";
import { DeleteConfirmModal } from "@/components/common/modals/DeleteConfirmModal";
import DynamicToast from "@/components/DynamicToast";
import {
  getInvoiceComplexId,
  resolveComplexPrePaidEnabled,
  buildInvoicePayload,
  createInvoiceViewFields,
} from "@/utils/finance/invoices";
import {
  loadFinanceInvoices,
  createFinanceInvoice,
  updateFinanceInvoice,
  deleteFinanceInvoice,
  fetchFinanceInvoiceById,
  payFinanceInvoices,
  selectFinanceInvoices,
  selectFinanceInvoicesError,
  selectFinanceInvoicesLoading,
  selectFinanceInvoicesPagination,
  selectFinanceInvoicesTotalConsumption,
  selectFinanceInvoicesTotalPaid,
} from "@/store/slices/financeInvoicesSlice";
import {
  CreditCardIcon,
  DocumentTextIcon,
  EllipsisVerticalIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const InvoicesPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [refreshKey, setRefreshKey] = useState(0);

  const selectedMtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const selectedComplex = useAppSelector((state) => state.complex.selectedComplex);

  const {
    filters,
    apiParams,
    hasActiveFilters,
    applyFilters,
    applyStatus,
    applyName,
    removeFilter,
    clearFilters,
  } = useInvoicesFilters();

  const apiParamsWithMtk = React.useMemo(() => {
    const params = { ...apiParams };

    if (selectedMtkId) {
      params["mtk_ids[]"] = [selectedMtkId];
    } else {
      delete params["mtk_ids[]"];
    }

    return params;
  }, [apiParams, selectedMtkId]);
  
  const [formOpen, setFormOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [itemToPay, setItemToPay] = useState(null);
  const [mode, setMode] = useState("create");
  const [saving, setSaving] = useState(false);
  const [allowPartialPayment, setAllowPartialPayment] = useState(false);
  const [complexPrePaidMap, setComplexPrePaidMap] = useState({});
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const invoices = useAppSelector(selectFinanceInvoices);
  const totalPaid = useAppSelector(selectFinanceInvoicesTotalPaid);
  const totalConsumption = useAppSelector(selectFinanceInvoicesTotalConsumption);
  const loading = useAppSelector(selectFinanceInvoicesLoading);
  const error = useAppSelector(selectFinanceInvoicesError);
  const pagination = useAppSelector(selectFinanceInvoicesPagination);
  const { formData, updateField, resetForm, setFormFromInvoice } = useInvoicesForm();

  useEffect(() => {
    dispatch(
      loadFinanceInvoices({
        filters: apiParamsWithMtk,
        page,
        itemsPerPage,
      })
    );
  }, [dispatch, apiParamsWithMtk, page, refreshKey, itemsPerPage]);

  useEffect(() => {
    if (page > (pagination.totalPages || 1) && pagination.totalPages > 0) {
      setPage(1);
    }
  }, [pagination.totalPages, page]);

  useEffect(() => {
    let active = true;

    const invoiceComplexIds = Array.from(
      new Set(
        (invoices || [])
          .map((invoice) => getInvoiceComplexId(invoice))
          .filter((id) => id !== null && id !== undefined && id !== "")
      )
    );

      const missingIds = invoiceComplexIds.filter((id) => {
      const invoice = invoices.find((item) => Number(getInvoiceComplexId(item)) === Number(id));
      const inlineResolved = resolveComplexPrePaidEnabled(invoice);
      return inlineResolved === null && complexPrePaidMap[String(id)] === undefined;
    });

    if (missingIds.length === 0) {
      return () => {
        active = false;
      };
    }

    Promise.all(
      missingIds.map(async (id) => {
        try {
          const response = await complexesAPI.getById(id);
          const complexData = response?.data?.data ?? response?.data ?? null;
          return [String(id), resolveComplexPrePaidEnabled(complexData)];
        } catch {
          return [String(id), null];
        }
      })
    ).then((entries) => {
      if (!active) return;
      setComplexPrePaidMap((prev) => {
        const next = { ...prev };
        entries.forEach(([id, value]) => {
          next[id] = value;
        });
        return next;
      });
    });

    return () => {
      active = false;
    };
  }, [invoices, complexPrePaidMap]);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const isPartialPaymentAllowed = React.useCallback((invoice) => {
    const inlineResolved = resolveComplexPrePaidEnabled(invoice);
    if (inlineResolved !== null) {
      return inlineResolved;
    }

    const complexResolved = resolveComplexPrePaidEnabled(selectedComplex);
    const invoiceComplexId = getInvoiceComplexId(invoice);

    if (invoiceComplexId !== null && invoiceComplexId !== undefined && complexPrePaidMap[String(invoiceComplexId)] !== undefined) {
      return complexPrePaidMap[String(invoiceComplexId)] === true;
    }

    if (complexResolved !== null) {
      return complexResolved;
    }

    // Safe default: partial payment disabled unless explicitly enabled by config.
    return false;
  }, [complexPrePaidMap, selectedComplex]);

  const handleApplyNameSearch = (value) => {
    applyName(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    applyStatus(value);
    setPage(1);
  };

  const handleRemoveFilter = (filterKey) => {
    removeFilter(filterKey);
    setPage(1);
  };

  const handleSearch = (newFilters) => {
    applyFilters(newFilters);
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
      
      const invoiceData = await dispatch(fetchFinanceInvoiceById(item.id)).unwrap();
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
      let invoiceData = await dispatch(fetchFinanceInvoiceById(item.id)).unwrap();
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

  const handlePay = (item) => {
    setAllowPartialPayment(isPartialPaymentAllowed(item));
    setItemToPay(item);
    setPayModalOpen(true);
  };

  const handlePaySuccess = () => {
    showToast("success", "Faktura uğurla ödənildi", "Uğurlu");
    setRefreshKey((prev) => prev + 1);
  };

  const handleCreateSave = async () => {
    try {
      setSaving(true);
      const invoiceData = buildInvoicePayload(formData);
      await dispatch(createFinanceInvoice(invoiceData)).unwrap();
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
        const invoiceData = buildInvoicePayload(formData);
        await dispatch(updateFinanceInvoice({ id: selectedItem.id, invoiceData })).unwrap();
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
        await dispatch(deleteFinanceInvoice(itemToDelete.id)).unwrap();
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

  const invoiceViewFields = itemToView ? createInvoiceViewFields(t) : [];

  const getStatusColor = (status) => {
    const statusMap = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      unpaid: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      not_paid: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      overdue: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      declined: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      draft: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      pre_paid: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return statusMap[status] || statusMap.unpaid;
  };

  const getStatusLabel = (status) => t(`invoices.status.${status}`) || status;
  const getTypeLabel = (type) => t(`invoices.types.${type}`) || type;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("az-AZ", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return dateString;
    }
  };

  const calculateRemaining = (amount, amountPaid) => {
    const remaining = parseFloat(amount || 0) - parseFloat(amountPaid || 0);
    return remaining.toFixed(2);
  };

  const tableColumns = [
    { key: "id", label: t("invoices.table.id") || "ID", align: "text-left", render: (invoice) => <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-medium">{invoice.id}</Typography> },
    { key: "service", label: t("invoices.table.service") || "Xidmət", align: "text-left", render: (invoice) => <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold">{invoice.service?.name || "-"}</Typography> },
    {
      key: "property",
      label: t("invoices.table.property") || "Mənzil",
      align: "text-left",
      render: (invoice) => (
        <>
          <Typography variant="small" className="text-gray-700 dark:text-gray-300">
            {invoice.property?.name ||
              invoice.property?.meta?.apartment_number ||
              invoice.property?.apartment_number ||
              (invoice.property?.id != null
                ? `Mənzil #${invoice.property.id}`
                : invoice.property_id != null
                ? `Mənzil #${invoice.property_id}`
                : "-")}
          </Typography>
          {invoice.property?.complex?.name && <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">{invoice.property.complex.name}</Typography>}
        </>
      ),
    },
    {
      key: "residents",
      label: t("invoices.table.residents") || "Sakinlər",
      align: "text-left",
      render: (invoice) => (
        <>
          {invoice.residents && invoice.residents.length > 0 ? (
            <div className="flex flex-col gap-1">
              {invoice.residents.slice(0, 2).map((resident) => (
                <Typography key={resident.id} variant="small" className="text-gray-700 dark:text-gray-300">{resident.name}</Typography>
              ))}
              {invoice.residents.length > 2 && <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">+{invoice.residents.length - 2} daha</Typography>}
            </div>
          ) : (
            <Typography variant="small" className="text-gray-500 dark:text-gray-400">-</Typography>
          )}
        </>
      ),
    },
    { key: "type", label: t("invoices.table.type") || "Növ", align: "text-left", render: (invoice) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{getTypeLabel(invoice.type)}</Typography> },
    { key: "amount", label: t("invoices.table.amount") || "Məbləğ", align: "text-right", render: (invoice) => <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold">{parseFloat(invoice.amount || 0).toFixed(2)} ₼</Typography> },
    { key: "paidAmount", label: t("invoices.table.paidAmount") || "Ödənilmiş", align: "text-right", render: (invoice) => <Typography variant="small" className="text-green-600 dark:text-green-400 font-semibold">{parseFloat(invoice.amount_paid || 0).toFixed(2)} ₼</Typography> },
    {
      key: "remaining",
      label: t("invoices.table.remaining") || "Qalıq",
      align: "text-right",
      render: (invoice) => {
        const remaining = calculateRemaining(invoice.amount, invoice.amount_paid);
        return <Typography variant="small" className={`font-semibold ${parseFloat(remaining) > 0 ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}>{remaining} ₼</Typography>;
      },
    },
    { key: "status", label: t("invoices.table.status") || "Status", align: "text-center", render: (invoice) => <Chip value={getStatusLabel(invoice.status)} className={`${getStatusColor(invoice.status)} text-xs font-medium`} size="sm" /> },
    { key: "startDate", label: t("invoices.table.startDate") || "Başlama tarixi", align: "text-left", render: (invoice) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{formatDate(invoice.start_date)}</Typography> },
    { key: "dueDate", label: t("invoices.table.dueDate") || "Son tarix", align: "text-left", render: (invoice) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{formatDate(invoice.due_date)}</Typography> },
    { key: "paymentMethod", label: t("invoices.table.paymentMethod") || "Ödəniş metodu", align: "text-left", render: (invoice) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{invoice.payment_method?.name || "-"}</Typography> },
    {
      key: "actions",
      label: t("invoices.table.operations") || "Əməliyyatlar",
      align: "text-left",
      cellClassName: "whitespace-nowrap",
      render: (invoice) => (
        <Menu placement="left-start">
          <MenuHandler>
            <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
              <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
            </IconButton>
          </MenuHandler>
          <MenuList className="dark:bg-gray-800 dark:border-gray-800">
            <MenuItem onClick={() => handleView(invoice)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
              <EyeIcon className="h-4 w-4" />
              {t("invoices.actions.view") || "Bax"}
            </MenuItem>
            <MenuItem onClick={() => handleEdit(invoice)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("invoices.actions.edit") || "Redaktə et"}</MenuItem>
            <MenuItem onClick={() => handlePay(invoice)} className="dark:hover:bg-gray-700 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <CreditCardIcon className="h-4 w-4" />
              {t("invoices.actions.pay") || "Ödə"}
            </MenuItem>
            <MenuItem onClick={() => handleDelete(invoice)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("invoices.actions.delete") || "Sil"}</MenuItem>
          </MenuList>
        </Menu>
      ),
    },
  ];

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <Header
        icon={DocumentTextIcon}
        title={t("invoices.pageTitle") || "Faktura İdarəetməsi"}
        subtitle={
          t("invoices.pageSubtitle") ||
          "Faktura siyahısı, yarat / redaktə et / sil / bax"
        }
        className="mb-6"
      />
      <SummaryCards totalPaid={totalPaid} totalConsumption={totalConsumption} />

      <ManagementActions
        entityLevel="invoice"
        search={apiParams}
        onCreateClick={handleCreate}
        onApplyNameSearch={handleApplyNameSearch}
        onStatusChange={handleStatusChange}
        onRemoveFilter={handleRemoveFilter}
        onSearchClick={handleSearchClick}
        hasActiveFilters={hasActiveFilters}
        totalItems={pagination.total || 0}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {loading ? (
        <Skeleton tableRows={6} cardRows={4} />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Typography variant="small" className="text-red-600 dark:text-red-400">
            Xəta: {error}
          </Typography>
        </div>
      ) : (
        <>
          <Table
            rows={invoices}
            columns={tableColumns}
            loading={loading}
            emptyText={t("invoices.noData") || "Faktura tapılmadı"}
            hideOnMobile
            tableAuto
            minWidth="min-w-[1200px]"
          />
          <CardList
            invoices={invoices}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPay={handlePay}
          />
          {pagination.totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={pagination.totalPages || 1}
              onPageChange={goToPage}
              onPrev={goToPrev}
              onNext={goToNext}
            />
          )}
        </>
      )}

      <FormModal
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

      <SearchModal
        open={searchModalOpen}
        title={t("invoices.searchModal.title") || "Ətraflı Axtarış"}
        fields={[
          { key: "invoiceId", label: t("invoices.searchModal.invoiceId") || "Faktura ID", type: "text" },
          {
            key: "status",
            label: t("invoices.table.status") || "Status",
            type: "select",
            options: [
              { value: "", label: t("invoices.searchModal.all") || "Hamısı" },
              { value: "paid", label: t("invoices.status.paid") || "paid" },
              { value: "not_paid", label: t("invoices.status.not_paid") || "not_paid" },
              { value: "pending", label: t("invoices.status.pending") || "pending" },
              { value: "overdue", label: t("invoices.status.overdue") || "overdue" },
              { value: "declined", label: t("invoices.status.declined") || "declined" },
              { value: "draft", label: t("invoices.status.draft") || "draft" },
              { value: "pre_paid", label: t("invoices.status.pre_paid") || "pre_paid" },
            ],
          },
          {
            key: "type",
            label: t("invoices.searchModal.type") || "Növ",
            type: "select",
            options: [
              { value: "", label: t("invoices.searchModal.all") || "Hamısı" },
              { value: "daily", label: t("invoices.types.daily") || "daily" },
              { value: "weekly", label: t("invoices.types.weekly") || "weekly" },
              { value: "monthly", label: t("invoices.types.monthly") || "monthly" },
              { value: "quarterly", label: t("invoices.types.quarterly") || "quarterly" },
              { value: "biannually", label: t("invoices.types.biannually") || "biannually" },
              { value: "yearly", label: t("invoices.types.yearly") || "yearly" },
              { value: "one_time", label: t("invoices.types.one_time") || "one_time" },
            ],
          },
          { key: "paidAtFrom", label: t("invoices.searchModal.dateFrom") || "Başlanğıc", type: "date" },
          { key: "paidAtTo", label: t("invoices.searchModal.dateTo") || "Son", type: "date" },
          { key: "amountFrom", label: `${t("invoices.searchModal.min") || "Minimum"} (₼)`, type: "number" },
          { key: "amountTo", label: `${t("invoices.searchModal.max") || "Maksimum"} (₼)`, type: "number" },
          { key: "amountPaidFrom", label: `${t("invoices.searchModal.min") || "Minimum"} ${t("invoices.searchModal.paidAmountLabel") || "Ödənilmiş"} (₼)`, type: "number" },
          { key: "amountPaidTo", label: `${t("invoices.searchModal.max") || "Maksimum"} ${t("invoices.searchModal.paidAmountLabel") || "Ödənilmiş"} (₼)`, type: "number" },
        ]}
        searchLabel={t("invoices.searchModal.search") || "Axtar"}
        clearLabel={t("invoices.searchModal.reset") || "Təmizlə"}
        cancelLabel={t("buttons.cancel") || "Ləğv et"}
        onClose={() => setSearchModalOpen(false)}
        onSearch={handleSearch}
        currentFilters={filters}
      />

      <PaymentModal
        open={payModalOpen}
        onClose={() => {
          setPayModalOpen(false);
          setItemToPay(null);
        }}
        invoice={itemToPay}
        allowPartialPayment={allowPartialPayment}
        onPay={async (payload) => {
          await dispatch(payFinanceInvoices([payload])).unwrap();
        }}
        onSuccess={handlePaySuccess}
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
