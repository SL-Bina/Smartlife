import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadComplexes } from "@/store/slices/management/complexSlice";
import { loadBuildings } from "@/store/slices/management/buildingSlice";
import { setSelectedBlock, loadBlocks, loadBlockById } from "@/store/slices/management/blockSlice";
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
} from "@/components/common";
import { useBlockForm } from "@/hooks/management/blocks/useBlockForm";
import { useBlockData } from "@/hooks/management/blocks/useBlockData";
import blocksAPI from "@/services/management/blocksApi";
import DynamicToast from "@/components/DynamicToast";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { BuildingOfficeIcon, CheckCircleIcon, InformationCircleIcon, EllipsisVerticalIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function BlocksPage() {
  const dispatch = useAppDispatch();

  // Redux-dan filter state (global) - ManagementActions tərəfindən idarə olunur
  const mtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const complexId = useAppSelector((state) => state.complex.selectedComplexId);
  const buildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const complexes = useAppSelector((state) => state.complex.complexes || []);
  const buildings = useAppSelector((state) => state.building.buildings || []);
  const selectedBlockId = useAppSelector((state) => state.block.selectedBlockId);
  const selectedBlock = useAppSelector((state) => state.block.selectedBlock);

  const [search, setSearch] = useState({});
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [editConfirmLoading, setEditConfirmLoading] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const form = useBlockForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useBlockData({
    search,
    complexId,
    buildingId,
    mtkId,
  });

  const normalizeBlockPayload = (raw = {}) => {
    const totalFloorRaw = raw?.meta?.total_floor;
    const totalApartmentRaw = raw?.meta?.total_apartment;

    const payload = {
      complex_id: raw?.complex_id !== null && raw?.complex_id !== undefined && raw?.complex_id !== "" ? Number(raw.complex_id) : null,
      building_id: raw?.building_id !== null && raw?.building_id !== undefined && raw?.building_id !== "" ? Number(raw.building_id) : null,
      name: raw?.name || "",
      meta: {
        total_floor: totalFloorRaw !== null && totalFloorRaw !== undefined && totalFloorRaw !== "" ? Number(totalFloorRaw) : null,
        total_apartment: totalApartmentRaw !== null && totalApartmentRaw !== undefined && totalApartmentRaw !== "" ? Number(totalApartmentRaw) : null,
      },
    };

    if (raw?.status) {
      payload.status = raw.status;
    }

    return payload;
  };

  // Load Blocks to Redux on mount
  useEffect(() => {
    dispatch(loadComplexes({ page: 1, per_page: 1000 }));
    dispatch(loadBuildings({ page: 1, per_page: 1000 }));
    dispatch(loadBlocks({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  const buildingOptionsByComplex = useMemo(() => {
    const selectedComplexId = form.formData?.complex_id;
    if (!selectedComplexId) return [];

    const normalizedComplexId = String(selectedComplexId);
    return (buildings || [])
      .filter((building) => {
        const currentComplexId = building?.complex?.id ?? building?.complex_id;
        return currentComplexId !== null && currentComplexId !== undefined && String(currentComplexId) === normalizedComplexId;
      })
      .map((building) => ({
        value: building.id,
        label: building.name || `Bina #${building.id}`,
      }));
  }, [buildings, form.formData?.complex_id]);

  useEffect(() => {
    if (!formOpen) return;

    const selectedComplexId = form.formData?.complex_id;
    if (!selectedComplexId) return;

    const currentBuildingId = form.formData?.building_id;
    const hasCurrentBuilding = currentBuildingId !== null && currentBuildingId !== undefined && currentBuildingId !== "";
    const isCurrentBuildingValid = hasCurrentBuilding
      ? buildingOptionsByComplex.some((option) => String(option.value) === String(currentBuildingId))
      : false;

    if (!isCurrentBuildingValid) {
      const firstBuilding = buildingOptionsByComplex[0];
      form.updateField("building_id", firstBuilding ? firstBuilding.value : null);
    }
  }, [formOpen, form.formData?.complex_id, form.formData?.building_id, buildingOptionsByComplex, form]);

  const handleBlockFieldChange = (field, value) => {
    if (field === "complex_id") {
      form.updateField("complex_id", value);

      const firstBuildingForComplex = (buildings || []).find((building) => {
        const currentComplexId = building?.complex?.id ?? building?.complex_id;
        return (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          currentComplexId !== null &&
          currentComplexId !== undefined &&
          String(currentComplexId) === String(value)
        );
      });

      form.updateField("building_id", firstBuildingForComplex ? firstBuildingForComplex.id : null);
      return;
    }

    form.updateField(field, value);
  };

  // Load selected Block if ID exists but Block data doesn't
  useEffect(() => {
    if (selectedBlockId && !selectedBlock) {
      dispatch(loadBlockById(selectedBlockId));
    }
  }, [dispatch, selectedBlockId, selectedBlock]);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const handleCreate = () => {
    form.resetForm();
    if (complexId) {
      form.updateField("complex_id", complexId);
    }

    const prefComplexId = complexId || form.formData?.complex_id;
    const initialBuilding = (buildings || []).find((building) => {
      const currentComplexId = building?.complex?.id ?? building?.complex_id;
      return (
        prefComplexId !== null &&
        prefComplexId !== undefined &&
        prefComplexId !== "" &&
        currentComplexId !== null &&
        currentComplexId !== undefined &&
        String(currentComplexId) === String(prefComplexId)
      );
    });

    if (buildingId) {
      form.updateField("building_id", buildingId);
    } else if (initialBuilding?.id) {
      form.updateField("building_id", initialBuilding.id);
    }

    setMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const handleEdit = (block) => {
    form.setFormFromBlock(block);
    setMode("edit");
    setSelected(block);
    setFormOpen(true);
  };

  const handleEditRequest = (formData) => {
    setPendingFormData(formData);
    setEditConfirmOpen(true);
  };

  const confirmEdit = async () => {
    if (!pendingFormData) return;
    const blockId = pendingFormData.id || (selected && selected.id);
    if (!blockId) {
      showToast("error", "Blok ID tapılmadı", "Xəta");
      return;
    }
    setEditConfirmLoading(true);
    try {
      const payload = normalizeBlockPayload(pendingFormData);
      await blocksAPI.update(blockId, payload);
      showToast("success", "Blok uğurla yeniləndi", "Uğurlu");
      refresh();
      dispatch(loadBlocks({ page: 1, per_page: 1000 }));
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
    dispatch(setSelectedBlock({ id: item.id, block: item }));
    showToast("success", `"${item.name}" Blok seçildi`, "Uğurlu");
  };

  const handleView = async (item) => {
    if (!item?.id) {
      showToast("error", "Blok ID tapılmadı", "Xəta");
      return;
    }

    setViewLoading(true);
    setViewModalOpen(true);
    try {
      const response = await blocksAPI.getById(item.id);
      const apiData = response?.data?.data || response?.data || response;
      setItemToView(apiData);
    } catch (error) {
      console.error("Error loading Block details:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "Blok məlumatları yüklənərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
      setViewModalOpen(false);
      setItemToView(null);
    } finally {
      setViewLoading(false);
    }
  };

  const handleDelete = (block) => {
    setItemToDelete(block);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleteLoading(true);
    try {
      await blocksAPI.delete(itemToDelete.id);
      showToast("success", "Blok uğurla silindi", "Uğurlu");
      refresh();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      const errorMessage = error?.message || "Blok silinərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
    } finally {
      setDeleteLoading(false);
    }
  };

  const submitForm = async (formData) => {
    try {
      const payload = normalizeBlockPayload(formData);
      if (mode === "edit") {
        const blockId = selected?.id || form.formData.id || items.find((item) => item.name === formData.name)?.id;
        if (!blockId) {
          throw new Error("Blok ID tapılmadı");
        }
        await blocksAPI.update(blockId, payload);
        showToast("success", "Blok uğurla yeniləndi", "Uğurlu");
      } else {
        await blocksAPI.add(payload);
        showToast("success", "Blok uğurla əlavə edildi", "Uğurlu");
      }
      refresh();
    } catch (error) {
      const errorMessage = error?.message || "Blok yadda saxlanarkən xəta baş verdi";
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
    {
      key: "id",
      label: "ID",
      align: "text-left",
      render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-medium">#{item.id}</Typography>,
    },
    {
      key: "name",
      label: "Ad",
      align: "text-left",
      render: (item) => <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">{item.name || "-"}</Typography>,
    },
    {
      key: "complex",
      label: "Complex",
      align: "text-left",
      render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.complex?.name || "-"}</Typography>,
    },
    {
      key: "building",
      label: "Bina",
      align: "text-left",
      render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.building?.name || "-"}</Typography>,
    },
    {
      key: "totalFloor",
      label: "Mərtəbə",
      align: "text-left",
      render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.total_floor || "-"}</Typography>,
    },
    {
      key: "totalApartment",
      label: "Mənzil",
      align: "text-left",
      render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.total_apartment || "-"}</Typography>,
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedBlockId === item.id ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60"}`}
          >
            {selectedBlockId === item.id ? "Seçilib" : "Seç"}
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
              <MenuItem onClick={() => handleEdit(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Redaktə et</MenuItem>
              <MenuItem onClick={() => handleDelete(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Sil</MenuItem>
            </MenuList>
          </Menu>
        </div>
      ),
    },
  ];

  const blockFormFields = useMemo(() => {
    const complexOptions = (complexes || []).map((complex) => ({
      value: complex.id,
      label: complex.name || `Complex #${complex.id}`,
    }));

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
          (complexes || []).find((complex) => String(complex.id) === String(form.formData?.complex_id))?.name || null,
        allowClear: false,
        placeholder: "Complex seçin",
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
          (buildings || []).find((building) => String(building.id) === String(form.formData?.building_id))?.name || null,
        disabled: !form.formData?.complex_id,
        allowClear: false,
        placeholder: "Bina seçin",
      },
      {
        key: "name",
        label: "Ad",
        type: "text",
        required: true,
        placeholder: "Məsələn: Block-a1",
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "active", label: "Aktiv" },
          { value: "inactive", label: "Qeyri-aktiv" },
        ],
        placeholder: "Status seçin",
      },
      {
        key: "meta.total_floor",
        label: "Ümumi mərtəbə sayı",
        type: "number",
        required: true,
        placeholder: "Məsələn: 16",
      },
      {
        key: "meta.total_apartment",
        label: "Ümumi mənzil sayı",
        type: "number",
        required: true,
        placeholder: "Məsələn: 280",
      },
    ];
  }, [complexes, buildings, mtkId, form.formData?.complex_id, form.formData?.building_id]);

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <Header
        icon={BuildingOfficeIcon}
        title="Bloklar İdarəetməsi"
        subtitle="Blok siyahısı, yarat / redaktə et / sil / seç"
      />

      <Actions
        entityLevel={ENTITY_LEVELS.BLOCK}
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
        title={mode === "edit" ? "Blok Redaktə et" : "Yeni Blok Əlavə Et"}
        description="Blok məlumatlarını daxil edin və yadda saxlayın."
        fields={blockFormFields}
        formData={form.formData}
        errors={form.errors}
        onFieldChange={handleBlockFieldChange}
        onClose={() => {
          setFormOpen(false);
          form.resetForm();
        }}
        onSubmit={submitForm}
        onEditRequest={handleEditRequest}
      />

      <SearchModal
        open={searchModalOpen}
        title="Blok Axtarış"
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

      <ViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setItemToView(null);
        }}
        title="Blok Məlumatları"
        item={itemToView}
        entityName="blok"
        loading={viewLoading}
        fields={[
          { key: "name", label: "Ad", icon: BuildingOfficeIcon },
          { 
            key: "building.name", 
            label: "Bina",
            icon: BuildingOfficeIcon,
            getValue: (item) => item?.building?.name
          },
          { 
            key: "building.id", 
            label: "Bina ID",
            icon: BuildingOfficeIcon,
            getValue: (item) => item?.building?.id
          },
          { 
            key: "complex.name", 
            label: "Complex",
            icon: BuildingOfficeIcon,
            getValue: (item) => item?.complex?.name
          },
          { 
            key: "complex.id", 
            label: "Complex ID",
            icon: BuildingOfficeIcon,
            getValue: (item) => item?.complex?.id
          },
          { 
            key: "meta.total_floor", 
            label: "Ümumi mərtəbə sayı",
            icon: InformationCircleIcon,
            getValue: (item) => item?.meta?.total_floor
          },
          { 
            key: "meta.total_apartment", 
            label: "Ümumi mənzil sayı",
            icon: InformationCircleIcon,
            getValue: (item) => item?.meta?.total_apartment
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
        title="Bloku Sil"
        itemName={itemToDelete ? `"${itemToDelete.name}"` : ""}
        entityName="blok"
        loading={deleteLoading}
      />

      <EditConfirmModal
        open={editConfirmOpen}
        onClose={() => {
          setEditConfirmOpen(false);
          setPendingFormData(null);
        }}
        onConfirm={confirmEdit}
        title="Bloku Redaktə et"
        itemName={selected ? `"${selected.name}"` : ""}
        entityName="blok"
        loading={editConfirmLoading}
        oldData={selected}
        newData={pendingFormData}
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
}

