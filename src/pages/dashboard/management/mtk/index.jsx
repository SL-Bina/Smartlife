import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadMtks, loadMtkById } from "@/store/slices/management/mtkSlice";
import {
  Actions,
  ENTITY_LEVELS,
  DeleteConfirmModal,
  EditConfirmModal,
  ViewModal,
  Header,
  FormModal,
  SearchModal,
  Table,
  Pagination,
  Skeleton,
} from "@/components";
import { useMtkForm } from "@/hooks/management/mtk/useMtkForm";
import { useMtkData } from "@/hooks/management/mtk/useMtkData";
import mtkAPI from "@/services/management/mtkApi";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { BuildingOfficeIcon, CheckCircleIcon, EllipsisVerticalIcon, EnvelopeIcon, EyeIcon, GlobeAltIcon, InformationCircleIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";

const isFileObject = (value) => typeof File !== "undefined" && value instanceof File;

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Fayl base64-ə çevrilmədi"));
    reader.readAsDataURL(file);
  });

const toBase64IfNeeded = async (value) => {
  if (isFileObject(value)) {
    return await fileToBase64(value);
  }
  if (typeof value === "string") {
    return value;
  }
  return "";
};

const normalizeMtkPayload = async (formData) => {
  const meta = formData?.meta || {};
  const imagesSource = Array.isArray(meta.images) ? meta.images : [];

  const images = await Promise.all(
    imagesSource
      .filter((item) => item !== null && item !== undefined && item !== "")
      .map(async (item) => {
        if (isFileObject(item)) {
          return await fileToBase64(item);
        }
        return item;
      })
  );

  return {
    ...formData,
    meta: {
      ...meta,
      logo: await toBase64IfNeeded(meta.logo),
      images,
    },
  };
};

export default function MtkPage() {
  const dispatch = useAppDispatch();

  const selectedMtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const selectedMtk = useAppSelector((state) => state.mtk.selectedMtk);

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

  const form = useMtkForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useMtkData({ search });

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
      // Boş olanları sil
      Object.keys(newSearch).forEach((key) => {
        if (!newSearch[key] || (typeof newSearch[key] === 'string' && !newSearch[key].trim())) {
          delete newSearch[key];
        }
      });
      return newSearch;
    });
  };

  // Load MTKs to Redux on mount
  useEffect(() => {
    dispatch(loadMtks({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  // Load selected MTK if ID exists but MTK data doesn't
  useEffect(() => {
    if (selectedMtkId && !selectedMtk) {
      dispatch(loadMtkById(selectedMtkId));
    }
  }, [dispatch, selectedMtkId, selectedMtk]);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const handleCreate = () => {
    form.resetForm();
    setMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const handleView = async (item) => {
    if (!item?.id) {
      showToast("error", "MTK ID tapılmadı", "Xəta");
      return;
    }

    setViewLoading(true);
    setViewModalOpen(true);
    try {
      const response = await mtkAPI.getById(item.id);
      // API returns { data: { success, message, data } } or { success, message, data }
      const apiData = response?.data?.data || response?.data || response;
      setItemToView(apiData);
    } catch (error) {
      console.error("Error loading MTK details:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "MTK məlumatları yüklənərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
      setViewModalOpen(false);
      setItemToView(null);
    } finally {
      setViewLoading(false);
    }
  };

  const handleEdit = (item) => {
    form.setFormFromMtk(item);
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
      const payload = await normalizeMtkPayload(pendingFormData);
      await mtkAPI.update(selected.id, payload);
      showToast("success", "MTK uğurla yeniləndi", "Uğurlu");
      dispatch(loadMtks({ page: 1, per_page: 1000 }));
      if (selectedMtkId === selected.id) {
        dispatch(loadMtkById(selected.id));
      }
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
      await mtkAPI.delete(itemToDelete.id);
      showToast("success", "MTK uğurla silindi", "Uğurlu");
      refresh();
      // Reload MTKs in Redux
      dispatch(loadMtks({ page: 1, per_page: 1000 }));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      showToast("error", error.message || "Xəta baş verdi", "Xəta");
    } finally {
      setDeleteLoading(false);
    }
  };

  const submitForm = async (formData) => {
    try {
      const payload = await normalizeMtkPayload(formData);
      if (mode === "create") {
        const response = await mtkAPI.add(payload);
        showToast("success", "MTK uğurla əlavə edildi", "Uğurlu");
        // Reload MTKs in Redux
        dispatch(loadMtks({ page: 1, per_page: 1000 }));
      } else {
        await mtkAPI.update(selected.id, payload);
        showToast("success", "MTK uğurla yeniləndi", "Uğurlu");
        // Reload MTKs in Redux and update selected if it's the same
        dispatch(loadMtks({ page: 1, per_page: 1000 }));
        if (selectedMtkId === selected.id) {
          dispatch(loadMtkById(selected.id));
        }
      }
      refresh();
      form.resetForm();
    } catch (error) {
      throw error;
    }
  };

  const mtkFormFields = [
    { key: "name", label: "Ad", type: "text", required: true, colSpan: 2 },
    { key: "meta.address", label: "Ünvan", type: "text", colSpan: 2 },
    { key: "meta.phone", label: "Telefon", type: "phone" },
    { key: "meta.email", label: "E-mail", type: "email" },
    { key: "meta.website", label: "Website", type: "text", colSpan: 2 },
    {
      key: "meta.lat",
      label: "Koordinat (Xəritə)",
      type: "map",
      latKey: "meta.lat",
      lngKey: "meta.lng",
      required: true,
      colSpan: 2,
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
    { key: "meta.color_code", label: "Rəng kodu", type: "color" },
    { key: "meta.logo", label: "Logo", type: "file", accept: "image/*", colSpan: 2 },
    { key: "meta.images", label: "Şəkillər", type: "files", accept: "image/*", multiple: true, colSpan: 2 },
    { key: "meta.desc", label: "Təsvir", type: "textarea", rows: 3, colSpan: 2 },
  ];

  const getStatusColor = (status) => {
    const normalized = String(status || "").trim().toLowerCase();
    const statusMap = {
      active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      blocked: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      suspended: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      deleted: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };

    return statusMap[normalized] || "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  };

  const getStatusLabel = (status) => {
    const normalized = String(status || "").trim().toLowerCase();
    const labels = {
      active: "Aktiv",
      inactive: "Qeyri-aktiv",
      pending: "Gözləmədə",
      blocked: "Bloklanıb",
      suspended: "Dayandırılıb",
      deleted: "Silinib",
    };

    return labels[normalized] || (status || "-");
  };

  const getValidHexColor = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return null;
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(normalized) ? normalized : null;
  };

  const getMtkApiColor = (item) => {
    const directMetaColor = getValidHexColor(item?.meta?.color_code);
    if (directMetaColor) return directMetaColor;

    if (typeof item?.meta === "string") {
      try {
        const parsedMeta = JSON.parse(item.meta);
        const parsedMetaColor = getValidHexColor(parsedMeta?.color_code);
        if (parsedMetaColor) return parsedMetaColor;
      } catch {
        return null;
      }
    }

    return getValidHexColor(item?.color_code);
  };

  const mtkViewFields = [
  { key: "name", label: "Ad", icon: BuildingOfficeIcon },
  {
    key: "meta.desc",
    label: "Təsvir",
    icon: InformationCircleIcon,
    fullWidth: true,
    getValue: (item) => item?.meta?.desc,
  },
  {
    key: "meta.address",
    label: "Ünvan",
    icon: MapPinIcon,
    fullWidth: true,
    getValue: (item) => item?.meta?.address,
  },
  {
    key: "meta.phone",
    label: "Telefon",
    icon: PhoneIcon,
    getValue: (item) => item?.meta?.phone,
  },
  {
    key: "meta.email",
    label: "E-mail",
    icon: EnvelopeIcon,
    getValue: (item) => item?.meta?.email,
  },
  {
    key: "meta.website",
    label: "Website",
    icon: GlobeAltIcon,
    fullWidth: true,
    getValue: (item) => item?.meta?.website,
  },
  {
    key: "meta.lat",
    label: "Enlik (Lat)",
    icon: MapPinIcon,
    getValue: (item) => item?.meta?.lat,
  },
  {
    key: "meta.lng",
    label: "Uzunluq (Lng)",
    icon: MapPinIcon,
    getValue: (item) => item?.meta?.lng,
  },
  {
    key: "meta.color_code",
    label: "Rəng kodu",
    icon: InformationCircleIcon,
    getValue: (item) => item?.meta?.color_code,
    format: (value) => {
      if (!value) return "-";
      return (
        <div className="flex items-center gap-2">
          <span>{value}</span>
          <div
            className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: value }}
          />
        </div>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    icon: CheckCircleIcon,
  },];

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
      render: (item) => {
        const apiColor = getMtkApiColor(item);
        return (
          <Typography variant="small" className={`font-semibold ${!apiColor ? "text-gray-700 dark:text-gray-300" : ""}`} style={apiColor ? { color: apiColor } : undefined}>
            {item.name || "-"}
          </Typography>
        );
      },
    },
    {
      key: "address",
      label: "Ünvan",
      align: "text-left",
      render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.address || "-"}</Typography>,
    },
    {
      key: "contact",
      label: "Əlaqə",
      align: "text-left",
      render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.phone || item?.meta?.email || "-"}</Typography>,
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
      ),
    },
  ];

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <Header
        icon={BuildingOfficeIcon}
        title="MTK İdarəetməsi"
        subtitle="MTK siyahısı, yarat / redaktə et / sil / seç"
      />

      <Actions
        entityLevel={ENTITY_LEVELS.MTK}
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
        alwaysVisible
        hidePageNumbers
      />

      <FormModal
        open={formOpen}
        mode={mode}
        title={mode === "edit" ? "Redaktə et" : "Əlavə Et"}
        description="MTK məlumatlarını daxil edin və yadda saxlayın."
        fields={mtkFormFields}
        formData={form.formData}
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
        title="Axtarış"
        description="Axtarış kriteriyalarını daxil edin və nəticələri daraldın."
        fields={[
          { key: "name", label: "Ad", type: "text" },
          { key: "address", label: "Ünvan", type: "text" },
          { key: "phone", label: "Telefon", type: "phone" },
          { key: "email", label: "E-mail", type: "text" },
          { key: "website", label: "Website", type: "text" },
          // { key: "desc", label: "Təsvir", type: "text" },
          // { key: "lat", label: "Latitude", type: "text" },
          // { key: "lng", label: "Longitude", type: "text" },
          // { key: "color_code", label: "Rəng kodu", type: "text", colSpan: 2 },
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
        title="MTK Məlumatları"
        item={itemToView}
        entityName="MTK"
        loading={viewLoading}
        fields={mtkViewFields}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="MTK-nı Sil"
        itemName={itemToDelete ? `"${itemToDelete.name}"` : ""}
        entityName="MTK"
        loading={deleteLoading}
      />

      <EditConfirmModal
        open={editConfirmOpen}
        onClose={() => {
          setEditConfirmOpen(false);
          setPendingFormData(null);
        }}
        onConfirm={confirmEdit}
        title="MTK-nı Redaktə et"
        itemName={selected ? `"${selected.name}"` : ""}
        entityName="MTK"
        loading={editConfirmLoading}
        oldData={selected}
        newData={pendingFormData}
      />     </div>
  );
}

