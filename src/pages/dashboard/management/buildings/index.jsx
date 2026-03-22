import React, { useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadMtks } from "@/store/slices/management/mtkSlice";
import { loadComplexes } from "@/store/slices/management/complexSlice";
import { setSelectedBuilding, loadBuildings, loadBuildingById } from "@/store/slices/management/buildingSlice";
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
} from "@/components";
import { useBuildingForm } from "@/hooks/management/buildings/useBuildingForm";
import { useBuildingData } from "@/hooks/management/buildings/useBuildingData";
import buildingsAPI from "@/services/management/buildingsApi";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { BuildingOfficeIcon, CheckCircleIcon, InformationCircleIcon, EllipsisVerticalIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function BuildingsPage() {
  const dispatch = useAppDispatch();
  
  const mtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const complexId = useAppSelector((state) => state.complex.selectedComplexId);
  const selectedComplex = useAppSelector((state) => state.complex.selectedComplex);
  const complexes = useAppSelector((state) => state.complex.complexes || []);
  const selectedBuildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const selectedBuilding = useAppSelector((state) => state.building.selectedBuilding);
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
  const form = useBuildingForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useBuildingData({ search, complexId, mtkId });

  useEffect(() => {
    dispatch(loadMtks({ page: 1, per_page: 1000 }));
    dispatch(loadComplexes({ page: 1, per_page: 1000 }));
    dispatch(loadBuildings({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedBuildingId && !selectedBuilding) {
      dispatch(loadBuildingById(selectedBuildingId));
    }
  }, [dispatch, selectedBuildingId, selectedBuilding]);

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
        if (!newSearch[key] || (typeof newSearch[key] === 'string' && !newSearch[key].trim())) {
          delete newSearch[key];
        }
      });
      return newSearch;
    });
  };

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const handleCreate = () => {
    form.resetForm();
    if (complexId) {
      form.updateField("complex_id", complexId);
    }
    setMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const handleView = async (item) => {
    if (!item?.id) {
      showToast("error", "Bina ID tapılmadı", "Xəta");
      return;
    }

    setViewLoading(true);
    setViewModalOpen(true);
    try {
      const response = await buildingsAPI.getById(item.id);
      const apiData = response?.data?.data || response?.data || response;
      setItemToView(apiData);
    } catch (error) {
      console.error("Error loading Building details:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "Bina məlumatları yüklənərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
      setViewModalOpen(false);
      setItemToView(null);
    } finally {
      setViewLoading(false);
    }
  };

  const handleEdit = (item) => {
    form.setFormFromBuilding(item);
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

    const payload = {
      complex_id: pendingFormData?.complex_id !== null && pendingFormData?.complex_id !== undefined && pendingFormData?.complex_id !== ""
        ? Number(pendingFormData.complex_id)
        : null,
      name: pendingFormData?.name || "",
      meta: {
        desc: pendingFormData?.meta?.desc || "",
      },
      status: pendingFormData?.status || "active",
    };

    try {
      await buildingsAPI.update(selected.id, payload);
      showToast("success", "Bina uğurla yeniləndi", "Uğurlu");
      refresh();
      dispatch(loadBuildings({ page: 1, per_page: 1000 }));
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
    dispatch(setSelectedBuilding({ id: item.id, building: item }));
    showToast("success", `"${item.name}" Bina seçildi`, "Uğurlu");
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleteLoading(true);
    try {
      await buildingsAPI.delete(itemToDelete.id);
      showToast("success", "Bina uğurla silindi", "Uğurlu");
      refresh();
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      showToast("error", error.message || "Xəta baş verdi", "Xəta");
    } finally {
      setDeleteLoading(false);
    }
  };

  const submitForm = async (formData) => {
    const payload = {
      complex_id: formData?.complex_id !== null && formData?.complex_id !== undefined && formData?.complex_id !== ""
        ? Number(formData.complex_id)
        : null,
      name: formData?.name || "",
      meta: {
        desc: formData?.meta?.desc || "",
      },
      status: formData?.status || "active",
    };

    try {
      if (mode === "create") {
        await buildingsAPI.add(payload);
        showToast("success", "Bina uğurla əlavə edildi", "Uğurlu");
      } else {
        await buildingsAPI.update(selected.id, payload);
        showToast("success", "Bina uğurla yeniləndi", "Uğurlu");
      }
      refresh();
      form.resetForm();
    } catch (error) {
      throw error;
    }
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
      key: "desc",
      label: "Təsvir",
      align: "text-left",
      render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.desc || "-"}</Typography>,
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedBuildingId === item.id ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60"}`}
          >
            {selectedBuildingId === item.id ? "Seçilib" : "Seç"}
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

  const buildingFormFields = useMemo(() => {
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
        placeholder: "Complex seçin",
        searchPlaceholder: "Complex adı ilə axtarın...",
        selectedLabel:
          (complexes || []).find((complex) => String(complex.id) === String(form.formData?.complex_id))?.name ||
          selectedComplex?.name ||
          null,
        allowClear: false,
      },
      {
        key: "name",
        label: "Ad",
        type: "text",
        required: true,
        placeholder: "Məsələn: Block -2038",
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
        key: "meta.desc",
        label: "Təsvir",
        type: "textarea",
        rows: 3,
        colSpan: 2,
        placeholder: "Bina haqqında qısa məlumat",
      },
    ];
  }, [complexes, mtkId, selectedComplex, form.formData?.complex_id]);

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <Header
        icon={BuildingOfficeIcon}
        title="Binalar İdarəetməsi"
        subtitle="Bina siyahısı, yarat / redaktə et / sil / seç"
      />

      <Actions
        entityLevel={ENTITY_LEVELS.BUILDING}
        // search={search}
        onCreateClick={handleCreate}
        // onSearchClick={() => setSearchModalOpen(true)}
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
          minWidth="min-w-[820px]"
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
        title={mode === "edit" ? "Bina Redaktə et" : "Yeni Bina Əlavə Et"}
        description="Bina məlumatlarını daxil edin və yadda saxlayın."
        fields={buildingFormFields}
        formData={form.formData}
        errors={form.errors}
        onFieldChange={form.updateField}
        onClose={() => {
          setFormOpen(false);
          form.resetForm();
        }}
        onSubmit={submitForm}
        onEditRequest={handleEditRequest}
      />

      <SearchModal
        open={searchModalOpen}
        title="Bina Axtarış"
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
        title="Bina Məlumatları"
        item={itemToView}
        entityName="bina"
        loading={viewLoading}
        fields={[
          { key: "name", label: "Ad", icon: BuildingOfficeIcon },
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
            key: "meta.desc", 
            label: "Təsvir",
            icon: InformationCircleIcon,
            fullWidth: true,
            getValue: (item) => item?.meta?.desc
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
        title="Binayı Sil"
        itemName={itemToDelete ? `"${itemToDelete.name}"` : ""}
        entityName="bina"
        loading={deleteLoading}
      />
      <EditConfirmModal
        open={editConfirmOpen}
        onClose={() => {
          setEditConfirmOpen(false);
          setPendingFormData(null);
        }}
        onConfirm={confirmEdit}
        title="Binanı Redaktə et"
        itemName={selected ? `"${selected.name}"` : ""}
        entityName="bina"
        loading={editConfirmLoading}
        oldData={selected}
        newData={pendingFormData}
      />     </div>
  );
}

