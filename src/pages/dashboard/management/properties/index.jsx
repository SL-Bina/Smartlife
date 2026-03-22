import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSelectedProperty, loadProperties, loadPropertyById } from "@/store/slices/management/propertySlice";
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
  ServiceFeeModal,
  AddBalanceCashModal,
} from "@/components";
import { usePropertyForm } from "@/hooks/management/properties/usePropertyForm";
import { usePropertyData } from "@/hooks/management/properties/usePropertyData";
import propertiesAPI from "@/services/management/propertiesApi";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { 
  HomeIcon, 
  IdentificationIcon, 
  BuildingOfficeIcon, 
  InformationCircleIcon, 
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  Square3Stack3DIcon,
  BuildingOffice2Icon,
  Squares2X2Icon,
  TableCellsIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  CurrencyDollarIcon,
  BanknotesIcon
} from "@heroicons/react/24/outline";

export default function PropertiesPage() {
  const dispatch = useAppDispatch();

  const mtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const complexId = useAppSelector((state) => state.complex.selectedComplexId);
  const buildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const blockId = useAppSelector((state) => state.block.selectedBlockId);
  const selectedComplex = useAppSelector((state) => state.complex.selectedComplex);
  const selectedBuilding = useAppSelector((state) => state.building.selectedBuilding);
  const selectedBlock = useAppSelector((state) => state.block.selectedBlock);
  const selectedPropertyId = useAppSelector((state) => state.property.selectedPropertyId);
  const selectedProperty = useAppSelector((state) => state.property.selectedProperty);

  const [search, setSearch] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [serviceFeeModalOpen, setServiceFeeModalOpen] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [itemForBalance, setItemForBalance] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [editConfirmLoading, setEditConfirmLoading] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("create");
  const [propertyTypeOptions, setPropertyTypeOptions] = useState([]);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const form = usePropertyForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = usePropertyData({
    search,
    mtkId,
    complexId,
    buildingId,
    blockId,
  });

  // Load Properties to Redux on mount
  useEffect(() => {
    dispatch(loadProperties({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  // Load selected Property if ID exists but Property data doesn't
  useEffect(() => {
    if (selectedPropertyId && !selectedProperty) {
      dispatch(loadPropertyById(selectedPropertyId));
    }
  }, [dispatch, selectedPropertyId, selectedProperty]);

  // Artıq URL sync lazim deyil - Redux state istifadə edirik

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const normalizePropertyPayload = (raw = {}) => ({
    mtk_id: mtkId || (raw?.mtk_id ? Number(raw.mtk_id) : null),
    complex_id: raw?.complex_id !== null && raw?.complex_id !== undefined && raw?.complex_id !== "" ? Number(raw.complex_id) : null,
    building_id: raw?.building_id !== null && raw?.building_id !== undefined && raw?.building_id !== "" ? Number(raw.building_id) : null,
    block_id: raw?.block_id !== null && raw?.block_id !== undefined && raw?.block_id !== "" ? Number(raw.block_id) : null,
    name: raw?.name || "",
    meta: {
      apartment_number:
        raw?.meta?.apartment_number !== null && raw?.meta?.apartment_number !== undefined && raw?.meta?.apartment_number !== ""
          ? Number(raw.meta.apartment_number)
          : null,
      floor: raw?.meta?.floor !== null && raw?.meta?.floor !== undefined && raw?.meta?.floor !== "" ? Number(raw.meta.floor) : null,
      area: raw?.meta?.area !== null && raw?.meta?.area !== undefined && raw?.meta?.area !== "" ? Number(raw.meta.area) : null,
    },
    property_type: raw?.property_type !== null && raw?.property_type !== undefined && raw?.property_type !== "" ? Number(raw.property_type) : null,
    status: raw?.status || "active",
  });

  const handlePropertyFieldChange = (field, value) => {
    if (field === "complex_id") {
      form.updateField("complex_id", value ? Number(value) : null);
      form.updateField("building_id", null);
      form.updateField("block_id", null);
      return;
    }

    if (field === "building_id") {
      form.updateField("building_id", value ? Number(value) : null);
      form.updateField("block_id", null);
      return;
    }

    if (field === "block_id" || field === "property_type") {
      form.updateField(field, value ? Number(value) : null);
      return;
    }

    form.updateField(field, value);
  };

  const handleCreate = () => {
    form.resetForm();
    if (mtkId) {
      form.updateField("mtk_id", mtkId);
    }
    if (complexId) {
      form.updateField("complex_id", complexId);
    }
    if (buildingId) {
      form.updateField("building_id", buildingId);
    }
    if (blockId) {
      form.updateField("block_id", blockId);
    }
    setMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const handleEdit = (property) => {
    // console.log("editing property:", property);
    form.setFormFromProperty(property);
    setMode("edit");
    setSelected(property);
    setFormOpen(true);
  };

  useEffect(() => {
    if (!formOpen) return;

    propertiesAPI
      .getPropertyTypes({ per_page: 1000 })
      .then((types) => {
        const mapped = (types || []).map((type) => ({
          value: type.id,
          label: type.name || `Tip #${type.id}`,
        }));
        setPropertyTypeOptions(mapped);
      })
      .catch(() => setPropertyTypeOptions([]));
  }, [formOpen]);

  const handleEditRequest = (formData) => {
    setPendingFormData(formData);
    setEditConfirmOpen(true);
  };

  const confirmEdit = async () => {
    if (!pendingFormData) return;
    const propertyId = pendingFormData.id || (selected && selected.id);
    if (!propertyId) {
      showToast("error", "Mənzil ID tapılmadı", "Xəta");
      return;
    }
    setEditConfirmLoading(true);
    try {
      const payload = normalizePropertyPayload(pendingFormData);
      await propertiesAPI.update(propertyId, payload);
      showToast("success", "Mənzil uğurla yeniləndi", "Uğurlu");
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

  const handleSelect = (item) => {
    dispatch(setSelectedProperty({ id: item.id, property: item }));
    showToast("success", `"${item.name || item.apartment_number || `Mənzil #${item.id}`}" Mənzil seçildi`, "Uğurlu");
  };

  const handleView = (item) => {
    setItemToView(item);
    setViewModalOpen(true);
  };

  const handleDelete = (property) => {
    setItemToDelete(property);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleteLoading(true);
    try {
      await propertiesAPI.delete(itemToDelete.id);
      showToast("success", "Mənzil uğurla silindi", "Uğurlu");
      refresh();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      const errorMessage = error?.message || "Mənzil silinərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleServiceFee = (property) => {
    setSelected(property);
    setServiceFeeModalOpen(true);
  };

  const handleAddBalance = (property) => {
    setItemForBalance(property);
    setBalanceModalOpen(true);
  };

  const submitForm = async (formData) => {
    try {
      const payload = normalizePropertyPayload(formData);
      if (mode === "edit") {
        // Redaktə rejimində form.formData.id istifadə et, ad axtarışı etmə
        const propertyId = form.formData.id;
        if (!propertyId) {
          throw new Error("Mənzil ID tapılmadı");
        }
        
        // Debug log - backend-ə gedən məlumatları yoxla
        // console.log("Backend-ə göndərilən PATCH data:", {
        //   propertyId,
        //   formData,
        //   endpoint: `/module/properties/${propertyId}`
        // });
        
        await propertiesAPI.update(propertyId, payload);
        showToast("success", "Mənzil uğurla yeniləndi", "Uğurlu");
      } else {
        await propertiesAPI.add(payload);
        showToast("success", "Mənzil uğurla əlavə edildi", "Uğurlu");
      }
      refresh();
    } catch (error) {
      const errorMessage = error?.message || "Mənzil yadda saxlanarkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
      throw error;
    }
  };

  const handleApplyNameSearch = (value) => {
    setSearch((prev) => ({
      ...prev,
      name: value || undefined,
    }));
  };

  const handleStatusChange = (value) => {
    setSearch((prev) => ({
      ...prev,
      status: value || undefined,
    }));
  };

  // Filter state artıq ManagementActions tərəfindən Redux-da idarə olunur

  const handleRemoveFilter = (key) => {
    setSearch((prev) => {
      const newSearch = { ...prev };
      delete newSearch[key];
      return newSearch;
    });
  };

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
    { key: "id", label: "ID", align: "text-left", render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-medium">#{item.id}</Typography> },
    { key: "name", label: "Ad", align: "text-left", render: (item) => <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">{item?.name || "-"}</Typography> },
    { key: "mtk", label: "MTK", align: "text-left", render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.sub_data?.mtk?.name || "-"}</Typography> },
    { key: "complex", label: "Complex", align: "text-left", render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.sub_data?.complex?.name || "-"}</Typography> },
    { key: "building", label: "Bina", align: "text-left", render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.sub_data?.building?.name || "-"}</Typography> },
    { key: "block", label: "Blok", align: "text-left", render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.sub_data?.block?.name || "-"}</Typography> },
    { key: "apartment", label: "Mənzil №", align: "text-left", render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.apartment_number || "-"}</Typography> },
    { key: "floor", label: "Mərtəbə", align: "text-left", render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.floor || "-"}</Typography> },
    { key: "area", label: "Sahə", align: "text-left", render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.area || "-"}</Typography> },
    { key: "status", label: "Status", align: "text-left", render: (item) => <Chip value={getStatusLabel(item?.status)} className={`${getStatusColor(item?.status)} text-xs font-medium w-fit`} size="sm" /> },
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedPropertyId === item.id ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60"}`}
          >
            {selectedPropertyId === item.id ? "Seçilib" : "Seç"}
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
              <MenuItem onClick={() => handleServiceFee(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                <CurrencyDollarIcon className="h-4 w-4" />
                Servis haqqı
              </MenuItem>
              <MenuItem onClick={() => handleAddBalance(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                <BanknotesIcon className="h-4 w-4" />
                Balans artır
              </MenuItem>
              <MenuItem onClick={() => handleEdit(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Redaktə et</MenuItem>
              <MenuItem onClick={() => handleDelete(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Sil</MenuItem>
            </MenuList>
          </Menu>
        </div>
      ),
    },
  ];

  const propertyFormFields = useMemo(() => {
    return [
      {
        key: "complex_id",
        label: "Complex",
        type: "async-select",
        required: true,
        endpoint: "/search/module/complex",
        searchParams: {
          ...(mtkId ? { mtk_ids: [mtkId] } : {}),
        },
        selectedLabel:
          selected?.sub_data?.complex?.name ||
          selected?.bind_complex?.name ||
          selectedComplex?.name ||
          null,
        placeholder: "Complex seçin",
        searchPlaceholder: "Complex axtar...",
        allowClear: false,
      },
      {
        key: "building_id",
        label: "Bina",
        type: "async-select",
        required: true,
        endpoint: "/search/module/building",
        searchParams: {
          ...(mtkId ? { mtk_ids: [mtkId] } : {}),
          ...(form.formData?.complex_id ? { complex_ids: [form.formData.complex_id] } : {}),
        },
        selectedLabel:
          selected?.sub_data?.building?.name ||
          selected?.bind_building?.name ||
          selectedBuilding?.name ||
          null,
        placeholder: "Bina seçin",
        searchPlaceholder: "Bina axtar...",
        disabled: !form.formData?.complex_id,
        allowClear: false,
      },
      {
        key: "block_id",
        label: "Blok",
        type: "async-select",
        required: true,
        endpoint: "/search/module/block",
        searchParams: {
          ...(mtkId ? { mtk_ids: [mtkId] } : {}),
          ...(form.formData?.complex_id ? { complex_ids: [form.formData.complex_id] } : {}),
          ...(form.formData?.building_id ? { building_ids: [form.formData.building_id] } : {}),
        },
        selectedLabel:
          selected?.sub_data?.block?.name ||
          selected?.bind_block?.name ||
          selectedBlock?.name ||
          null,
        placeholder: "Blok seçin",
        searchPlaceholder: "Blok axtar...",
        disabled: !form.formData?.building_id,
        allowClear: false,
      },
      {
        key: "name",
        label: "Ad",
        type: "text",
        required: true,
        placeholder: "Məs: Apartment 5",
      },
      {
        key: "property_type",
        label: "Mənzil tipi",
        type: "select",
        required: true,
        options: propertyTypeOptions,
        placeholder: "Tip seçin",
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { value: "active", label: "Aktiv" },
          { value: "inactive", label: "Qeyri-aktiv" },
        ],
      },
      {
        key: "meta.apartment_number",
        label: "Mənzil №",
        type: "number",
        required: true,
        placeholder: "Məs: 12",
      },
      {
        key: "meta.floor",
        label: "Mərtəbə",
        type: "number",
        required: true,
        placeholder: "Məs: 12",
      },
      {
        key: "meta.area",
        label: "Sahə",
        type: "number",
        required: true,
        placeholder: "Məs: 14",
      },
    ];
  }, [
    mtkId,
    form.formData?.complex_id,
    form.formData?.building_id,
    form.formData?.property_type,
    propertyTypeOptions,
    selected,
    selectedComplex,
    selectedBuilding,
    selectedBlock,
  ]);

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <Header
        icon={HomeIcon}
        title="Mənzillər İdarəetməsi"
        subtitle="Mənzil siyahısı, yarat / redaktə et / sil / seç / servis haqqı"
      />

      <Actions
        entityLevel={ENTITY_LEVELS.PROPERTY}
        search={search}
        onCreateClick={handleCreate}
        onSearchClick={() => setSearchModalOpen(true)}
        onApplyNameSearch={handleApplyNameSearch}
        onStatusChange={handleStatusChange}
        onRemoveFilter={handleRemoveFilter}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {loading ? (
        <Skeleton tableRows={6} cardRows={4} />
      ) : (
        <Table
          rows={items}
          columns={tableColumns}
          loading={false}
          emptyText="Məlumat tapılmadı"
          minWidth="min-w-[1120px]"
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
        title={mode === "edit" ? "Mənzil Redaktə et" : "Yeni Mənzil Əlavə Et"}
        description="Mənzil məlumatlarını daxil edin və yadda saxlayın."
        fields={propertyFormFields}
        formData={form.formData}
        errors={form.errors}
        onFieldChange={handlePropertyFieldChange}
        onClose={() => {
          setFormOpen(false);
          form.resetForm();
        }}
        onSubmit={submitForm}
        onEditRequest={handleEditRequest}
      />

      <SearchModal
        open={searchModalOpen}
        title="Mənzil Axtarış"
        fields={[
          { key: "name", label: "Ad", type: "text" },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "", label: "Hamısı" },
              { value: "active", label: "Aktiv" },
              { value: "inactive", label: "Qeyri-aktiv" },
            ],
          },
          { key: "property_type", label: "Mənzil tipi", type: "text" },
          { key: "area", label: "Sahə", type: "text" },
          { key: "floor", label: "Mərtəbə", type: "text" },
          { key: "apartment_number", label: "Mənzil №", type: "text" },
        ]}
        onClose={() => setSearchModalOpen(false)}
        onSearch={(searchParams) => {
          // Keep name and status from current search, merge with advanced search params
          setSearch((prev) => ({
            ...(prev.name && { name: prev.name }),
            ...(prev.status && { status: prev.status }),
            ...searchParams,
          }));
        }}
        currentSearch={search}
      />

      <ServiceFeeModal
        open={serviceFeeModalOpen}
        propertyId={selected?.id}
        propertyName={selected?.name || selected?.apartment_number || `Mənzil #${selected?.id}`}
        onClose={() => {
          setServiceFeeModalOpen(false);
          setSelected(null);
        }}
      />

      <AddBalanceCashModal
        open={balanceModalOpen}
        onClose={() => {
          setBalanceModalOpen(false);
          setItemForBalance(null);
        }}
        propertyId={itemForBalance?.id}
        propertyName={itemForBalance?.name || itemForBalance?.apartment_number || (itemForBalance?.id ? `Mənzil #${itemForBalance.id}` : "")}
        onSuccess={() => {
          showToast("success", "Balans uğurla əlavə edildi", "Uğurlu");
          refresh();
        }}
      />

      <ViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setItemToView(null);
        }}
        title="Mənzil Məlumatları"
        item={itemToView}
        entityName="mənzil"
        fields={[
          { key: "name", label: "Ad", icon: HomeIcon },
          { 
            key: "meta.apartment_number", 
            label: "Mənzil Nömrəsi", 
            icon: IdentificationIcon,
            getValue: (item) => item.meta?.apartment_number || item.apartment_number
          },
          { 
            key: "meta.area", 
            label: "Sahə (m²)", 
            icon: Square3Stack3DIcon,
            getValue: (item) => item.meta?.area ? `${item.meta.area} m²` : null
          },
          { 
            key: "meta.floor", 
            label: "Mərtəbə", 
            icon: BuildingOffice2Icon,
            getValue: (item) => item.meta?.floor || null
          },
          { 
            key: "sub_data.block.name", 
            label: "Blok",
            icon: BuildingOfficeIcon,
            getValue: (item) => item.sub_data?.block?.name || item.bind_block?.name
          },
          { 
            key: "sub_data.building.name", 
            label: "Bina",
            icon: BuildingOfficeIcon,
            getValue: (item) => item.sub_data?.building?.name || item.bind_building?.name
          },
          { 
            key: "sub_data.complex.name", 
            label: "Complex",
            icon: BuildingOfficeIcon,
            getValue: (item) => item.sub_data?.complex?.name || item.bind_complex?.name
          },
          { 
            key: "sub_data.mtk.name", 
            label: "MTK",
            icon: BuildingOfficeIcon,
            getValue: (item) => item.sub_data?.mtk?.name || item.bind_mtk?.name
          },
          { 
            key: "sub_data.mtk.meta.address", 
            label: "MTK Ünvanı",
            icon: MapPinIcon,
            fullWidth: true,
            getValue: (item) => item.sub_data?.mtk?.meta?.address || item.bind_mtk?.meta?.address
          },
          { 
            key: "sub_data.mtk.meta.phone", 
            label: "MTK Telefon",
            icon: PhoneIcon,
            getValue: (item) => item.sub_data?.mtk?.meta?.phone || item.bind_mtk?.meta?.phone
          },
          { 
            key: "sub_data.mtk.meta.email", 
            label: "MTK E-mail",
            icon: EnvelopeIcon,
            getValue: (item) => item.sub_data?.mtk?.meta?.email || item.bind_mtk?.meta?.email
          },
          { 
            key: "sub_data.mtk.meta.website", 
            label: "MTK Website",
            icon: GlobeAltIcon,
            getValue: (item) => item.sub_data?.mtk?.meta?.website || item.bind_mtk?.meta?.website
          },
          { 
            key: "sub_data.complex.meta.address", 
            label: "Complex Ünvanı",
            icon: MapPinIcon,
            fullWidth: true,
            getValue: (item) => item.sub_data?.complex?.meta?.address || item.bind_complex?.meta?.address
          },
          { 
            key: "sub_data.complex.meta.phone", 
            label: "Complex Telefon",
            icon: PhoneIcon,
            getValue: (item) => item.sub_data?.complex?.meta?.phone || item.bind_complex?.meta?.phone
          },
          { 
            key: "sub_data.complex.meta.email", 
            label: "Complex E-mail",
            icon: EnvelopeIcon,
            getValue: (item) => item.sub_data?.complex?.meta?.email || item.bind_complex?.meta?.email
          },
          { 
            key: "sub_data.building.meta.desc", 
            label: "Bina Təsviri",
            icon: InformationCircleIcon,
            fullWidth: true,
            getValue: (item) => item.sub_data?.building?.meta?.desc || item.bind_building?.meta?.desc
          },
          { 
            key: "sub_data.block.meta.total_floor", 
            label: "Blok Ümumi Mərtəbə",
            icon: BuildingOffice2Icon,
            getValue: (item) => item.sub_data?.block?.meta?.total_floor || null
          },
          { 
            key: "sub_data.block.meta.total_apartment", 
            label: "Blok Ümumi Mənzil Sayı",
            icon: HomeIcon,
            getValue: (item) => item.sub_data?.block?.meta?.total_apartment || null
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
        title="Mənzili Sil"
        itemName={itemToDelete ? `"${itemToDelete.name}"` : ""}
        entityName="mənzil"
        loading={deleteLoading}
      />

      <EditConfirmModal
        open={editConfirmOpen}
        onClose={() => {
          setEditConfirmOpen(false);
          setPendingFormData(null);
        }}
        onConfirm={confirmEdit}
        title="Mənzili Redaktə et"
        itemName={selected ? `"${selected.name || selected.apartment_number || `Mənzil #${selected.id}`}"` : ""}
        entityName="mənzil"
        loading={editConfirmLoading}
        oldData={selected}
        newData={pendingFormData}
      />     </div>
  );
}

