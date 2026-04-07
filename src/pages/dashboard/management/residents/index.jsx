import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedResident, loadResidentById } from "@/store/slices/management/residentSlice";
import { setSelectedComplex } from "@/store/slices/management/complexSlice";
import { setSelectedBuilding } from "@/store/slices/management/buildingSlice";
import { setSelectedBlock } from "@/store/slices/management/blockSlice";
import { setSelectedProperty } from "@/store/slices/management/propertySlice";
import {
  Actions,
  ENTITY_LEVELS,
  DeleteConfirmModal,
  EditConfirmModal,
  ViewModal,
  Header,
  FormModal,
  SearchModal,
  Pagination,
  Skeleton,
  Table,
  PropertyBindModal,
  AddBalanceCashModal,
  ResidentExistsModal,
} from "@/components";
import { useResidentForm } from "@/hooks/management/residents/useResidentForm";
import { useResidentData } from "@/hooks/management/residents/useResidentData";
import residentsAPI from "@/services/management/residentsApi";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem, Button } from "@material-tailwind/react";
import { UserIcon, EnvelopeIcon, PhoneIcon, IdentificationIcon, CheckCircleIcon, EllipsisVerticalIcon, EyeIcon, LinkIcon } from "@heroicons/react/24/outline";
export default function ResidentsPage() {
  const dispatch = useAppDispatch();

  // Read filter values directly from Redux — ManagementActions keeps these in sync
  const selectedMtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const selectedMtk = useAppSelector((state) => state.mtk.selectedMtk);
  const selectedComplexId = useAppSelector((state) => state.complex.selectedComplexId);
  const selectedComplex = useAppSelector((state) => state.complex.selectedComplex);
  const selectedBuildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const selectedBuilding = useAppSelector((state) => state.building.selectedBuilding);
  const selectedBlockId = useAppSelector((state) => state.block.selectedBlockId);
  const selectedBlock = useAppSelector((state) => state.block.selectedBlock);
  const selectedPropertyId = useAppSelector((state) => state.property.selectedPropertyId);
  const selectedProperty = useAppSelector((state) => state.property.selectedProperty);

  const selectedResidentId = useAppSelector((state) => state.resident.selectedResidentId);
  const selectedResident = useAppSelector((state) => state.resident.selectedResident);

  const [search, setSearch] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bindModalOpen, setBindModalOpen] = useState(false);
  const [balanceModal, setBalanceModal] = useState({ open: false, propertyId: null, propertyName: "" });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [editConfirmLoading, setEditConfirmLoading] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [existsPrompt, setExistsPrompt] = useState(false);
  const [lastFormData, setLastFormData] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const form = useResidentForm();
  // Pass Redux filter values — they update whenever ManagementActions dropdowns change
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useResidentData({
    search,
    mtkId: selectedMtkId,
    complexId: selectedComplexId,
    buildingId: selectedBuildingId,
    blockId: selectedBlockId,
    propertyId: selectedPropertyId,
  });

  useEffect(() => {
    if (selectedResidentId && !selectedResident) {
      dispatch(loadResidentById(selectedResidentId));
    }
  }, [dispatch, selectedResidentId, selectedResident]);

  const handleApplyNameSearch = (value) => {
    setSearch((prev) => ({
      ...prev,
      name: value && value.trim() ? value.trim() : undefined,
    }));
  };

  const handleStatusChange = (value) => {
    setSearch((prev) => ({
      ...prev,
      status: value || undefined,
    }));
  };

  const handleRemoveFilter = (filterKey) => {
    setSearch((prev) => {
      const newSearch = { ...prev };
      delete newSearch[filterKey];
      Object.keys(newSearch).forEach((key) => {
        if (!newSearch[key] || (typeof newSearch[key] === "string" && !newSearch[key].trim())) {
          delete newSearch[key];
        }
      });
      return newSearch;
    });
  };

  const handleResetResidentFilters = () => {
    setSearch({});
    dispatch(setSelectedComplex({ id: null, complex: null }));
    dispatch(setSelectedBuilding({ id: null, building: null }));
    dispatch(setSelectedBlock({ id: null, block: null }));
    dispatch(setSelectedProperty({ id: null, property: null }));
  };

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const handleCreate = () => {
    form.resetForm();
    if (selectedMtkId) form.updateField("property.mtk_id", selectedMtkId);
    if (selectedComplexId) form.updateField("property.complex_id", selectedComplexId);
    if (selectedBuildingId) form.updateField("property.building_id", selectedBuildingId);
    if (selectedBlockId) form.updateField("property.block_id", selectedBlockId);
    if (selectedPropertyId) form.updateField("property.property_id", selectedPropertyId);
    setMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  useEffect(() => {
    if (!formOpen || mode !== "create") return;
    if (!selectedMtkId) return;

    if (String(form.formData?.property?.mtk_id || "") !== String(selectedMtkId)) {
      form.updateField("property.mtk_id", selectedMtkId);
    }
  }, [formOpen, mode, selectedMtkId, form]);

  const handleView = (item) => {
    setItemToView(item);
    setViewModalOpen(true);
  };

  const handleEdit = (item) => {
    form.setFormFromResident(item);
    setMode("edit");
    setSelected(item);
    setFormOpen(true);
  };

  const handleEditRequest = (formData) => {
    setPendingFormData(formData);
    setEditConfirmOpen(true);
  };

  const confirmEdit = async () => {
    if (!pendingFormData || !selected) return;
    setEditConfirmLoading(true);
    try {
      await residentsAPI.update(selected.id, pendingFormData);
      showToast("success", "Sakin uğurla yeniləndi", "Uğurlu");
      refresh();
      setEditConfirmOpen(false);
      setPendingFormData(null);
      setFormOpen(false);
      form.resetForm();
    } catch (error) {
      showToast("error", error.message || "Xəta baş verdi", "Xəta");
    } finally {
      setEditConfirmLoading(false);
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setDeleteLoading(true);
    try {
      await residentsAPI.delete(itemToDelete.id);
      showToast("success", "Sakin uğurla silindi", "Uğurlu");
      refresh();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      showToast("error", error.message || "Xəta baş verdi", "Xəta");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSelect = (item) => {
    dispatch(setSelectedResident({ id: item.id, resident: item }));
    showToast("success", `"${item.name} ${item.surname}" Sakin seçildi`, "Uğurlu");
  };

  const submitForm = async (formData) => {
    try {
      if (mode === "create") {
        await residentsAPI.add(formData);
        showToast("success", "Sakin uğurla əlavə edildi", "Uğurlu");
      } else {
        await residentsAPI.update(selected.id, formData);
        showToast("success", "Sakin uğurla yeniləndi", "Uğurlu");
      }
      refresh();
      form.resetForm();
    } catch (error) {
      if (error?.status === 426) {
        setLastFormData(formData);
        setExistsPrompt(true);
      }
      throw error;
    }
  };

  const handleBindExists = async (bindExists) => {
    if (!lastFormData) return;

    try {
      await residentsAPI.add({ ...lastFormData, bind_existing: bindExists });
      showToast("success", "Sakin uğurla əlavə edildi", "Uğurlu");
      refresh();
      form.resetForm();
      setFormOpen(false);
      setExistsPrompt(false);
      setLastFormData(null);
    } catch (error) {
      showToast("error", error?.message || "Xəta baş verdi", "Xəta");
    }
  };

  const handleResidentFieldChange = (field, value) => {
    const numericValue = value ? Number(value) : null;

    if (field === "property.mtk_id") {
      form.updateField("property.mtk_id", numericValue);
      form.updateField("property.complex_id", null);
      form.updateField("property.building_id", null);
      form.updateField("property.block_id", null);
      form.updateField("property.property_id", null);
      return;
    }

    if (field === "property.complex_id") {
      form.updateField("property.complex_id", numericValue);
      form.updateField("property.building_id", null);
      form.updateField("property.block_id", null);
      form.updateField("property.property_id", null);
      return;
    }

    if (field === "property.building_id") {
      form.updateField("property.building_id", numericValue);
      form.updateField("property.block_id", null);
      form.updateField("property.property_id", null);
      return;
    }

    if (field === "property.block_id") {
      form.updateField("property.block_id", numericValue);
      form.updateField("property.property_id", null);
      return;
    }

    if (field === "property.property_id") {
      form.updateField("property.property_id", numericValue);
      return;
    }

    form.updateField(field, value);
  };

  const residentFormFields = useMemo(() => {
    const isCreate = mode === "create";
    const formMtkId = form.formData?.property?.mtk_id;
    const effectiveMtkId = formMtkId || selectedMtkId;
    const formComplexId = form.formData?.property?.complex_id;
    const formBuildingId = form.formData?.property?.building_id;
    const formBlockId = form.formData?.property?.block_id;

    return [
      { key: "name", label: "Ad", type: "text", required: true },
      { key: "surname", label: "Soyad", type: "text", required: true },
      { key: "email", label: "E-mail", type: "text" },
      { key: "phone", label: "Telefon", type: "phone" },
      {
        key: "type",
        label: "Tip",
        type: "select",
        options: [
          { value: "owner", label: "Sahib" },
          { value: "tenant", label: "Kirayəçi" },
        ],
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "active", label: "Aktiv" },
          { value: "inactive", label: "Qeyri-aktiv" },
        ],
      },
      { key: "meta.father_name", label: "Ata adı", type: "text" },
      {
        key: "meta.gender",
        label: "Cins",
        type: "select",
        options: [
          { value: "male", label: "Kişi" },
          { value: "female", label: "Qadın" },
        ],
      },
      { key: "meta.personal_code", label: "Şəxsi kod", type: "text" },
      { key: "meta.birth_date", label: "Doğum tarixi", type: "date" },
      {
        key: "property.complex_id",
        label: "Kompleks",
        type: "async-select",
        endpoint: "/search/module/complex",
        searchParams: { ...(effectiveMtkId ? { mtk_ids: [effectiveMtkId] } : {}) },
        selectedLabel: selectedComplex?.name || null,
        disabled: !effectiveMtkId,
        placeholder: "Kompleks seçin",
        searchPlaceholder: "Kompleks axtar...",
        allowClear: false,
        required: isCreate,
        hidden: !isCreate,
      },
      {
        key: "property.building_id",
        label: "Bina",
        type: "async-select",
        endpoint: "/search/module/building",
        searchParams: {
          ...(effectiveMtkId ? { mtk_ids: [effectiveMtkId] } : {}),
          ...(formComplexId ? { complex_ids: [formComplexId] } : {}),
        },
        selectedLabel: selectedBuilding?.name || null,
        disabled: !formComplexId,
        placeholder: "Bina seçin",
        searchPlaceholder: "Bina axtar...",
        allowClear: false,
        hidden: !isCreate,
      },
      {
        key: "property.block_id",
        label: "Blok",
        type: "async-select",
        endpoint: "/search/module/block",
        searchParams: {
          ...(effectiveMtkId ? { mtk_ids: [effectiveMtkId] } : {}),
          ...(formComplexId ? { complex_ids: [formComplexId] } : {}),
          ...(formBuildingId ? { building_ids: [formBuildingId] } : {}),
        },
        selectedLabel: selectedBlock?.name || null,
        disabled: !formBuildingId,
        placeholder: "Blok seçin",
        searchPlaceholder: "Blok axtar...",
        allowClear: false,
        hidden: !isCreate,
      },
      {
        key: "property.property_id",
        label: "Mənzil",
        type: "async-select",
        endpoint: "/search/module/property",
        searchParams: {
          ...(effectiveMtkId ? { mtk_ids: [effectiveMtkId] } : {}),
          ...(formComplexId ? { complex_ids: [formComplexId] } : {}),
          ...(formBuildingId ? { building_ids: [formBuildingId] } : {}),
          ...(formBlockId ? { block_ids: [formBlockId] } : {}),
        },
        selectedLabel: selectedProperty?.name || selectedProperty?.apartment_number || null,
        disabled: !formComplexId,
        placeholder: "Mənzil seçin",
        searchPlaceholder: "Mənzil axtar...",
        allowClear: false,
        required: isCreate,
        hidden: !isCreate,
      },
    ];
  }, [
    mode,
    form.formData?.property?.mtk_id,
    form.formData?.property?.complex_id,
    form.formData?.property?.building_id,
    form.formData?.property?.block_id,
    selectedMtkId,
    selectedComplex,
    selectedBuilding,
    selectedBlock,
    selectedProperty,
  ]);

  const getStatusColor = (status) => {
    const normalized = String(status || "").trim().toLowerCase();
    const statusMap = {
      active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    };
    return statusMap[normalized] || "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  };

  const getStatusLabel = (status) => {
    const normalized = String(status || "").trim().toLowerCase();
    const labels = { active: "Aktiv", inactive: "Qeyri-aktiv" };
    return labels[normalized] || (status || "-");
  };

  const tableColumns = [
    {
      key: "id",
      label: "ID",
      align: "text-left",
      render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-medium">#{item.id}</Typography>,
    },
    {
      key: "fullName",
      label: "Ad Soyad",
      align: "text-left",
      render: (item) => <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">{item?.name || "-"} {item?.surname || ""}</Typography>,
    },
    {
      key: "email",
      label: "E-mail",
      align: "text-left",
      render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.email || "-"}</Typography>,
    },
    {
      key: "phone",
      label: "Telefon",
      align: "text-left",
      render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.phone || "-"}</Typography>,
    },
    {
      key: "type",
      label: "Tip",
      align: "text-left",
      render: (item) => (
        <Typography variant="small" className="text-gray-700 dark:text-gray-300">
          {item?.type === "owner" ? "Sahib" : item?.type === "tenant" ? "Kirayəçi" : item?.type || "-"}
        </Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      align: "text-left",
      render: (item) => <Chip value={getStatusLabel(item?.status)} className={`${getStatusColor(item?.status)} text-xs font-medium w-fit`} size="sm" />,
    },
    {
      key: "actions",
      label: "Əməliyyatlar",
      align: "text-left",
      cellClassName: "whitespace-nowrap",
      render: (item) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSelect(item)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedResidentId === item.id ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60"}`}
          >
            {selectedResidentId === item.id ? "Seçilib" : "Seç"}
          </button>
          <Menu placement="left-start">
            <MenuHandler>
              <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
              </IconButton>
            </MenuHandler>
            <MenuList className="dark:bg-gray-800 dark:border-gray-800">
              <MenuItem onClick={() => handleView(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                <EyeIcon className="h-4 w-4" />
                Bax
              </MenuItem>
              <MenuItem
                onClick={() => {
                  dispatch(setSelectedResident({ id: item.id, resident: item }));
                  dispatch(loadResidentById(item.id));
                  setBindModalOpen(true);
                }}
                className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <LinkIcon className="h-4 w-4" />
                Mənzillər
              </MenuItem>
              <MenuItem onClick={() => handleEdit(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Redaktə et</MenuItem>
              <MenuItem onClick={() => handleDelete(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Sil</MenuItem>
            </MenuList>
          </Menu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <Header
        icon={UserIcon}
        title="Sakinlər İdarəetməsi"
        subtitle="Sakin siyahısı, yarat / redaktə et / sil / seç / mənzil bağlama"
      />

      <Actions
        entityLevel={ENTITY_LEVELS.RESIDENT}
        search={search}
        onCreateClick={handleCreate}
        onSearchClick={() => setSearchModalOpen(true)}
        onApplyNameSearch={handleApplyNameSearch}
        onStatusChange={handleStatusChange}
        onRemoveFilter={handleRemoveFilter}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        renderExtraControls={(isMobile) => (
          <div className={isMobile ? "w-full" : "w-full md:w-auto flex-shrink-0"}>
            <Button
              type="button"
              variant="outlined"
              onClick={handleResetResidentFilters}
              className="w-full md:w-auto border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200"
              size={isMobile ? "sm" : "md"}
            >
              Sıfırla
            </Button>
          </div>
        )}
      />

      {loading ? (
        <Skeleton tableRows={6} cardRows={4} />
      ) : (
        <Table
          rows={items}
          columns={tableColumns}
          loading={false}
          emptyText="Məlumat tapılmadı"
          minWidth="min-w-[980px]"
        />
      )}

      <Pagination
        page={page}
        totalPages={lastPage}
        onPageChange={goToPage}
        summary={<>Cəm: <b>{total}</b> nəticə</>}
        prevLabel="Əvvəlki"
        nextLabel="Növbəti"
      />

      <FormModal
        open={formOpen}
        mode={mode}
        title={mode === "edit" ? "Sakini Redaktə Et" : "Yeni Sakin Əlavə Et"}
        description="Sakin məlumatlarını daxil edin və yadda saxlayın."
        fields={residentFormFields}
        formData={form.formData}
        errors={form.errors}
        onFieldChange={handleResidentFieldChange}
        onClose={() => {
          setFormOpen(false);
          form.resetForm();
        }}
        onSubmit={submitForm}
        onEditRequest={handleEditRequest}
      />

      <PropertyBindModal
        open={bindModalOpen}
        onClose={() => setBindModalOpen(false)}
        lockClose={balanceModal.open}
        residentId={selectedResidentId}
        residentName={selectedResident ? `${selectedResident.name || ''} ${selectedResident.surname || ''}`.trim() : ""}
        residentProperties={selectedResident?.property_residents}
        onSuccess={() => {
          if (selectedResidentId) {
            dispatch(loadResidentById(selectedResidentId));
          }
        }}
        onAddBalance={(propertyId, propertyName) =>
          setBalanceModal({ open: true, propertyId, propertyName })
        }
      />

      <SearchModal
        open={searchModalOpen}
        title="Sakin Axtarış"
        fields={[
          { key: "name", label: "Ad", type: "text" },
          { key: "surname", label: "Soyad", type: "text" },
          { key: "email", label: "E-mail", type: "text" },
          { key: "phone", label: "Telefon", type: "phone" },
          {
            key: "type",
            label: "Tip",
            type: "select",
            options: [
              { value: "", label: "Hamısı" },
              { value: "owner", label: "Sahib" },
              { value: "tenant", label: "Kirayəçi" },
            ],
          },
        ]}
        onClose={() => setSearchModalOpen(false)}
        onSearch={(searchParams) => {
          setSearch((prev) => ({
            ...(prev.name && { name: prev.name }),
            ...(prev.status && { status: prev.status }),
            ...searchParams,
          }));
        }}
        currentSearch={search}
      />

      <ViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setItemToView(null);
        }}
        title="Sakin Məlumatları"
        item={itemToView}
        entityName="sakin"
        fields={[
          { key: "name", label: "Ad", icon: UserIcon },
          { key: "surname", label: "Soyad", icon: UserIcon },
          { key: "email", label: "E-mail", icon: EnvelopeIcon },
          { key: "phone", label: "Telefon", icon: PhoneIcon },
          {
            key: "gender",
            label: "Cins",
            icon: UserIcon,
            format: (value) => value === "male" ? "Kişi" : value === "female" ? "Qadın" : value || "-"
          },
          {
            key: "type",
            label: "Tip",
            icon: IdentificationIcon,
            format: (value) => value === "owner" ? "Sahib" : value === "tenant" ? "Kirayəçi" : value || "-"
          },
          {
            key: "status",
            label: "Status",
            icon: CheckCircleIcon
          },
        ]}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Sakini Sil"
        itemName={itemToDelete ? `"${itemToDelete.name} ${itemToDelete.surname}"` : ""}
        entityName="sakin"
        loading={deleteLoading}
      />

      <EditConfirmModal
        open={editConfirmOpen}
        onClose={() => {
          setEditConfirmOpen(false);
          setPendingFormData(null);
        }}
        onConfirm={confirmEdit}
        title="Sakini Redaktə et"
        itemName={selected ? `"${selected.name} ${selected.surname}"` : ""}
        entityName="sakin"
        loading={editConfirmLoading}
        oldData={selected}
        newData={pendingFormData}
      /> 
      <AddBalanceCashModal
        open={balanceModal.open}
        onClose={() => setBalanceModal({ open: false, propertyId: null, propertyName: "" })}
        propertyId={balanceModal.propertyId}
        propertyName={balanceModal.propertyName}
        onSuccess={() => setBalanceModal({ open: false, propertyId: null, propertyName: "" })}
      />

      <ResidentExistsModal
        open={existsPrompt}
        onClose={() => {
          setExistsPrompt(false);
          setLastFormData(null);
        }}
        onChoose={handleBindExists}
        saving={false}
      />
    </div>
  );
}
