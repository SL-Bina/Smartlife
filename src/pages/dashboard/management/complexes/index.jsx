import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { loadMtkById, setSelectedMtk, loadMtks } from "@/store/slices/management/mtkSlice";
import { setSelectedComplex, loadComplexes, loadComplexById } from "@/store/slices/management/complexSlice";
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
  SettingsModal,
} from "@/components";
import { useComplexForm } from "@/hooks/management/complexes/useComplexForm";
import { useComplexData } from "@/hooks/management/complexes/useComplexData";
import complexesAPI from "@/services/management/complexesApi";
import { BuildingOfficeIcon, MapPinIcon, InformationCircleIcon, CheckCircleIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, CubeIcon, EllipsisVerticalIcon, EyeIcon, CreditCardIcon, PhotoIcon } from "@heroicons/react/24/outline";
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

const normalizeComplexPayload = async (formData) => {
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

export default function ComplexesPage() {
  const dispatch = useAppDispatch();

  // Redux-dan filter state (global) - table filtering üçün
  const mtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const selectedMtk = useAppSelector((state) => state.mtk.selectedMtk);
  const mtks = useAppSelector((state) => state.mtk.mtks);
  const authModules = useAppSelector((state) => state.auth.user?.modules || []);
  const selectedComplexId = useAppSelector((state) => state.complex.selectedComplexId);
  const selectedComplex = useAppSelector((state) => state.complex.selectedComplex);

  const [search, setSearch] = useState({});

  const handleOpenParams = (item) => {
    setItemToView(item);
    setSettingsModalOpen(true);
  };

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

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [moduleOptions, setModuleOptions] = useState([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const form = useComplexForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useComplexData({ search, mtkId });

  const toModuleOptions = React.useCallback((input) => {
    const asArray = Array.isArray(input)
      ? input
      : Array.isArray(input?.data)
      ? input.data
      : Array.isArray(input?.items)
      ? input.items
      : [];

    return asArray
      .map((item) => {
        const source = item?.module || item;
        const id = source?.id ?? source?.module_id ?? item?.id ?? item?.module_id;
        const label =
          source?.name ||
          source?.title ||
          source?.module_name ||
          item?.name ||
          item?.title ||
          item?.module_name ||
          (id ? `Module ${id}` : "");

        if (id === null || id === undefined || id === "") return null;
        return { value: id, label };
      })
      .filter(Boolean);
  }, []);

  useEffect(() => {
    dispatch(loadMtks({ page: 1, per_page: 1000 }));
    dispatch(loadComplexes({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  const loadModules = React.useCallback(async () => {
    if (modulesLoading) return;

    setModulesLoading(true);
    try {
      const modules = await complexesAPI.getModules();
      const mapped = toModuleOptions(modules);

      if (mapped.length > 0) {
        setModuleOptions(mapped);
      } else {
        setModuleOptions(toModuleOptions(authModules));
      }
    } catch {
      setModuleOptions(toModuleOptions(authModules));
    } finally {
      setModulesLoading(false);
    }
  }, [modulesLoading, toModuleOptions, authModules]);

  const loadMtksOnOpen = React.useCallback(() => {
    if (!mtks || mtks.length === 0) {
      dispatch(loadMtks({ page: 1, per_page: 1000 }));
    }
  }, [dispatch, mtks]);

  useEffect(() => {
    if (formOpen && moduleOptions.length === 0) {
      loadModules();
    }
  }, [formOpen, moduleOptions.length, loadModules]);

  const complexFormFields = useMemo(() => {
    const mtkOptions = (mtks || []).map((item) => ({ value: item.id, label: item.name }));

    return [
      { key: "name", label: "Ad", type: "text", required: true },
      {
        key: "mtk_id",
        label: "MTK",
        type: "select",
        options: mtkOptions,
        required: true,
        hidden: !!mtkId,
        onOpen: loadMtksOnOpen,
      },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [
          { value: "active", label: "Aktiv" },
          { value: "inactive", label: "Qeyri-aktiv" },
        ],
        required: true,
      },
      { key: "meta.desc", label: "Təsvir", type: "textarea", rows: 3, colSpan: 2 },
      { key: "meta.address", label: "Ünvan", type: "text", colSpan: 2 },
      { key: "meta.phone", label: "Telefon", type: "phone" },
      { key: "meta.email", label: "E-mail", type: "text" },
      { key: "meta.website", label: "Website", type: "text" },
      { key: "meta.color_code", label: "Rəng", type: "color" },
      { key: "meta.logo", label: "Logo", type: "file", accept: "image/*", colSpan: 2 },
      { key: "meta.images", label: "Şəkillər", type: "files", accept: "image/*", multiple: true, colSpan: 2 },
      {
        key: "meta.lat",
        label: "Koordinatlar",
        type: "map",
        latKey: "meta.lat",
        lngKey: "meta.lng",
        colSpan: 2,
      },
      {
        key: "modules",
        label: "Modules",
        type: "multiselect",
        options: moduleOptions,
        onOpen: loadModules,
      },
      {
        key: "avaliable_modules",
        label: "Avaliable Modules",
        type: "multiselect",
        options: moduleOptions,
        onOpen: loadModules,
      },
    ];
  }, [mtks, mtkId, moduleOptions, loadModules, loadMtksOnOpen]);

  const moduleLabelMap = useMemo(() => {
    const map = new Map();

    [...toModuleOptions(authModules), ...(moduleOptions || [])].forEach((item) => {
      const key = item?.value;
      const label = item?.label;
      if (key !== null && key !== undefined && key !== "" && label) {
        map.set(String(key), label);
      }
    });

    return map;
  }, [authModules, moduleOptions, toModuleOptions]);

  // Load selected Complex if ID exists but Complex data doesn't
  useEffect(() => {
    if (selectedComplexId && !selectedComplex) {
      dispatch(loadComplexById(selectedComplexId));
    }
  }, [dispatch, selectedComplexId, selectedComplex]);

  const handleNameSearchChange = (value) => {
    // Bu funksiya artıq istifadə olunmur, amma uyğunluq üçün saxlanılır
  };

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
    // Əgər MTK ID varsa, form-a əlavə et
    if (mtkId) {
      form.updateField("mtk_id", mtkId);
    }
    setMode("create");
    setSelected(null);
    setFormOpen(true);
  };

  const handleView = async (item) => {
    if (!item?.id) {
      showToast("error", "Complex ID tapılmadı", "Xəta");
      return;
    }

    setViewLoading(true);
    setViewModalOpen(true);
    try {
      if (!moduleOptions?.length) {
        await loadModules();
      }

      const response = await complexesAPI.getById(item.id);
      // API returns { data: { success, message, data } } or { success, message, data }
      const apiData = response?.data?.data || response?.data || response;
      setItemToView(apiData);
    } catch (error) {
      console.error("Error loading Complex details:", error);
      const errorMessage = error?.message || error?.response?.data?.message || "Complex məlumatları yüklənərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
      setViewModalOpen(false);
      setItemToView(null);
    } finally {
      setViewLoading(false);
    }
  };

  const handleEdit = (item) => {
    form.setFormFromComplex(item);
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
      const payload = await normalizeComplexPayload(pendingFormData);
      await complexesAPI.update(selected.id, payload);
      showToast("success", "Complex uğurla yeniləndi", "Uğurlu");
      refresh();
      dispatch(loadComplexes({ page: 1, per_page: 1000 }));
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
      await complexesAPI.delete(itemToDelete.id);
      showToast("success", "Complex uğurla silindi", "Uğurlu");
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
    dispatch(setSelectedComplex({ id: item.id, complex: item }));
    showToast("success", `"${item.name}" Complex seçildi`, "Uğurlu");
  };

  const submitForm = async (formData) => {
    try {
      const payload = await normalizeComplexPayload(formData);
      if (mode === "create") {
        await complexesAPI.add(payload);
        showToast("success", "Complex uğurla əlavə edildi", "Uğurlu");
      } else {
        await complexesAPI.update(selected.id, payload);
        showToast("success", "Complex uğurla yeniləndi", "Uğurlu");
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
      key: "mtk",
      label: "MTK",
      align: "text-left",
      render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.mtk?.name || "-"}</Typography>,
    },
    {
      key: "address",
      label: "Ünvan",
      align: "text-left",
      render: (item) => <Typography variant="small" className="text-gray-700 dark:text-gray-300">{item?.meta?.address || "-"}</Typography>,
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedComplexId === item.id ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60"}`}
          >
            {selectedComplexId === item.id ? "Seçilib" : "Seç"}
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
              <MenuItem onClick={() => handleOpenParams(item)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                <CreditCardIcon className="h-4 w-4" />
                Parametrlər
              </MenuItem>
              <MenuItem onClick={() => handleEdit(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Redaktə et</MenuItem>
              <MenuItem onClick={() => handleDelete(item)} className="dark:text-gray-300 dark:hover:bg-gray-700">Sil</MenuItem>
            </MenuList>
          </Menu>
        </div>
      ),
    },
  ];

  const complexViewFields = useMemo(() => [
    { key: "id", label: "ID", icon: InformationCircleIcon },
    { key: "name", label: "Ad", icon: BuildingOfficeIcon },
    {
      key: "bind_mtk.name",
      label: "Bağlı MTK",
      icon: BuildingOfficeIcon,
      getValue: (item) => item?.bind_mtk?.name || "-",
    },
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
      key: "meta.logo",
      label: "Logo",
      icon: PhotoIcon,
      fullWidth: true,
      customRender: (item, field) => {
        const logo = item?.meta?.logo;
        const isImage = typeof logo === "string" && (logo.startsWith("data:image") || /^https?:\/\//.test(logo) || logo.startsWith("/"));

        return (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                {field.label}
              </Typography>
            </div>

            {isImage ? (
              <div className="w-full max-w-[220px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <img src={logo} alt="Complex logo" className="w-full h-32 object-cover" />
              </div>
            ) : (
              <Typography variant="paragraph" className="text-gray-400 dark:text-gray-500 italic text-sm">
                Logo yoxdur
              </Typography>
            )}
          </>
        );
      },
    },
    {
      key: "meta.images",
      label: "Şəkillər",
      icon: PhotoIcon,
      fullWidth: true,
      customRender: (item, field) => {
        const images = Array.isArray(item?.meta?.images) ? item.meta.images : [];
        const validImages = images.filter((img) => typeof img === "string" && img);

        return (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                {field.label}
              </Typography>
            </div>

            {validImages.length === 0 ? (
              <Typography variant="paragraph" className="text-gray-400 dark:text-gray-500 italic text-sm">
                Şəkil yoxdur
              </Typography>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {validImages.map((image, index) => (
                  <div key={`${image}-${index}`} className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <img src={image} alt={`Complex şəkil ${index + 1}`} className="w-full h-24 object-cover" />
                  </div>
                ))}
              </div>
            )}
          </>
        );
      },
    },
    {
      key: "modules",
      label: "Modullar",
      icon: CubeIcon,
      fullWidth: true,
      customRender: (item, field) => {
        const modules = Array.isArray(item?.modules) ? item.modules : [];
        if (!modules || modules.length === 0) {
          return (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                  {field.label}
                </Typography>
              </div>
              <Typography variant="paragraph" className="text-gray-400 dark:text-gray-500 italic text-sm">
                Modul yoxdur
              </Typography>
            </>
          );
        }
        return (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                {field.label}
              </Typography>
            </div>
            <div className="flex flex-wrap gap-2">
              {modules.map((moduleItem, index) => {
                const moduleSource = typeof moduleItem === "object" ? moduleItem?.module || moduleItem : moduleItem;
                const moduleId =
                  typeof moduleSource === "object"
                    ? moduleSource?.id ?? moduleSource?.module_id ?? moduleItem?.id ?? moduleItem?.module_id
                    : moduleSource;
                const inlineName =
                  typeof moduleSource === "object"
                    ? moduleSource?.name ?? moduleSource?.title ?? moduleSource?.module_name ?? moduleItem?.name ?? moduleItem?.title ?? moduleItem?.module_name
                    : null;
                const fallbackLabel = moduleId !== null && moduleId !== undefined ? `Modul #${moduleId}` : `Modul ${index + 1}`;
                const label = inlineName || (moduleId !== null && moduleId !== undefined ? moduleLabelMap.get(String(moduleId)) : null) || fallbackLabel;
                const key = moduleId !== null && moduleId !== undefined ? `${moduleId}-${index}` : `module-${index}`;

                return (
                  <span
                    key={key}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </>
        );
      },
    },
    {
      key: "avaliable_services",
      label: "Mövcud xidmətlər",
      icon: InformationCircleIcon,
      fullWidth: true,
      customRender: (item, field) => {
        const services = item?.avaliable_services;

        return (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                {field.label}
              </Typography>
            </div>

            {!services || (Array.isArray(services) && services.length === 0) ? (
              <Typography variant="paragraph" className="text-gray-400 dark:text-gray-500 italic text-sm">
                Yoxdur
              </Typography>
            ) : Array.isArray(services) ? (
              <div className="flex flex-wrap gap-2">
                {services.map((service, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    {typeof service === "object" ? (service?.name || `Xidmət #${service?.id || index + 1}`) : String(service)}
                  </span>
                ))}
              </div>
            ) : (
              <Typography variant="paragraph" className="text-gray-900 dark:text-gray-100 text-sm">
                {String(services)}
              </Typography>
            )}
          </>
        );
      },
    },
    {
      key: "config.pre_paid",
      label: "Pre Paid",
      icon: InformationCircleIcon,
      getValue: (item) => item?.config?.pre_paid ?? "-",
      format: (value) => {
        if (value === true || String(value).toLowerCase() === "true" || value === "1") return "Aktiv";
        if (value === false || String(value).toLowerCase() === "false" || value === "0") return "Deaktiv";
        return value || "-";
      },
    },
    {
      key: "config.mail",
      label: "Mail Konfiqurasiya",
      icon: EnvelopeIcon,
      fullWidth: true,
      customRender: (item, field) => {
        const mail = item?.config?.mail;

        return (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                {field.label}
              </Typography>
            </div>

            {!mail ? (
              <Typography variant="paragraph" className="text-gray-400 dark:text-gray-500 italic text-sm">
                Konfiqurasiya yoxdur
              </Typography>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(mail).map(([key, value]) => (
                  <div key={key} className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <Typography variant="small" className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      {key}
                    </Typography>
                    <Typography variant="small" className="text-gray-900 dark:text-gray-100 break-all">
                      {value === null || value === undefined || value === "" ? "-" : String(value)}
                    </Typography>
                  </div>
                ))}
              </div>
            )}
          </>
        );
      },
    },
    {
      key: "config.integrations.device",
      label: "Device Integrations",
      icon: InformationCircleIcon,
      fullWidth: true,
      customRender: (item, field) => {
        const device = item?.config?.integrations?.device;

        return (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                {field.label}
              </Typography>
            </div>

            {!device ? (
              <Typography variant="paragraph" className="text-gray-400 dark:text-gray-500 italic text-sm">
                Integration yoxdur
              </Typography>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(device).map(([key, value]) => (
                  <div key={key} className="p-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <Typography variant="small" className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                      {key}
                    </Typography>
                    <Typography variant="small" className="text-gray-900 dark:text-gray-100 break-all">
                      {value === null || value === undefined || value === "" ? "-" : String(value)}
                    </Typography>
                  </div>
                ))}
              </div>
            )}
          </>
        );
      },
    },
    {
      key: "config.sms_api_details",
      label: "SMS API Details",
      icon: InformationCircleIcon,
      fullWidth: true,
      customRender: (item, field) => {
        const sms = item?.config?.sms_api_details;
        const list = Array.isArray(sms) ? sms : [];

        return (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                {field.label}
              </Typography>
            </div>

            {list.length === 0 ? (
              <Typography variant="paragraph" className="text-gray-400 dark:text-gray-500 italic text-sm">
                Məlumat yoxdur
              </Typography>
            ) : (
              <pre className="text-xs p-3 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-x-auto">
                {JSON.stringify(list, null, 2)}
              </pre>
            )}
          </>
        );
      },
    },
    {
      key: "config.complex_service_module",
      label: "Complex Service Module",
      icon: InformationCircleIcon,
      fullWidth: true,
      customRender: (item, field) => {
        const modules = item?.config?.complex_service_module;
        const list = Array.isArray(modules) ? modules : [];

        return (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                {field.label}
              </Typography>
            </div>

            {list.length === 0 ? (
              <Typography variant="paragraph" className="text-gray-400 dark:text-gray-500 italic text-sm">
                Məlumat yoxdur
              </Typography>
            ) : (
              <pre className="text-xs p-3 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-x-auto">
                {JSON.stringify(list, null, 2)}
              </pre>
            )}
          </>
        );
      },
    },
    {
      key: "config.payment_gateway_details",
      label: "Payment Gateway Details",
      icon: InformationCircleIcon,
      fullWidth: true,
      customRender: (item, field) => {
        const gateways = item?.config?.payment_gateway_details;
        const list = Array.isArray(gateways) ? gateways : [];

        return (
          <>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                {field.label}
              </Typography>
            </div>

            {list.length === 0 ? (
              <Typography variant="paragraph" className="text-gray-400 dark:text-gray-500 italic text-sm">
                Məlumat yoxdur
              </Typography>
            ) : (
              <pre className="text-xs p-3 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-x-auto">
                {JSON.stringify(list, null, 2)}
              </pre>
            )}
          </>
        );
      },
    },
    { key: "status", label: "Status", icon: CheckCircleIcon },
    {
      key: "buildings",
      label: "Binalar",
      icon: BuildingOfficeIcon,
      fullWidth: true,
      customRender: (item, field) => {
        const buildings = item?.buildings || [];
        if (!buildings || buildings.length === 0) {
          return (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                  {field.label}
                </Typography>
              </div>
              <Typography variant="paragraph" className="text-gray-400 dark:text-gray-500 italic text-sm">
                Bina yoxdur
              </Typography>
            </>
          );
        }
        return (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <field.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">
                {field.label} ({buildings.length})
              </Typography>
            </div>
            <div className="space-y-2">
              {buildings.map((building, index) => (
                <div key={index} className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
                  <Typography variant="small" className="font-semibold text-gray-900 dark:text-white text-sm">
                    {building.name || `Bina #${building.id || index + 1}`}
                  </Typography>
                  <Typography variant="small" className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                    ID: {building?.id || "-"} • Complex ID: {building?.complex_id || "-"}
                  </Typography>
                  <Typography variant="small" className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                    Status: {building?.status || "-"}
                  </Typography>
                  <Typography variant="small" className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                    Təsvir: {building?.meta?.desc || "-"}
                  </Typography>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-[11px] mt-1">
                    Created: {building?.created_at || "-"}
                  </Typography>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-[11px] mt-1">
                    Updated: {building?.updated_at || "-"}
                  </Typography>
                </div>
              ))}
            </div>
          </>
        );
      },
    },
  ], [moduleLabelMap]);

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <Header
        icon={BuildingOfficeIcon}
        title="Complex İdarəetməsi"
        subtitle="Complex siyahısı, yarat / redaktə et / sil / seç"
      />

      <Actions
        entityLevel={ENTITY_LEVELS.COMPLEX}
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
        title={mode === "edit" ? "Complex Redaktə et" : "Yeni Complex Əlavə Et"}
        description="Complex məlumatlarını daxil edin və yadda saxlayın."
        fields={complexFormFields}
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
        title="Kompleks Axtarış"
        fields={[
          { key: "name", label: "Ad", type: "text" },
          { key: "address", label: "Ünvan", type: "text" },
          { key: "phone", label: "Telefon", type: "phone" },
          { key: "email", label: "E-mail", type: "text" },
          { key: "website", label: "Website", type: "text" },
          // { key: "color_code", label: "Rəng kodu", type: "text" },
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
        title="Complex Məlumatları"
        item={itemToView}
        entityName="complex"
        loading={viewLoading}
        fields={complexViewFields}
      />

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Complex-i Sil"
        itemName={itemToDelete ? `"${itemToDelete.name}"` : ""}
        entityName="complex"
        loading={deleteLoading}
      />

      <EditConfirmModal
        open={editConfirmOpen}
        onClose={() => {
          setEditConfirmOpen(false);
          setPendingFormData(null);
        }}
        onConfirm={confirmEdit}
        title="Complex-i Redaktə et"
        itemName={selected ? `"${selected.name}"` : ""}
        entityName="complex"
        loading={editConfirmLoading}
        oldData={selected}
        newData={pendingFormData}
      />

      <SettingsModal
        open={settingsModalOpen}
        onClose={() => {
          setSettingsModalOpen(false);
          setItemToView(null);
        }}
        onSaved={(savedConfig) => {
          refresh();
          setItemToView((prev) => (prev ? { ...prev, config: savedConfig } : prev));
        }}
        complexId={itemToView?.id}
        complexData={itemToView}
      />     </div>
  );
}

