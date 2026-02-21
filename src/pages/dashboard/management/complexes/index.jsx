import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Typography } from "@material-tailwind/react";
import { loadMtkById, setSelectedMtk, loadMtks } from "@/store/slices/mtkSlice";
import { setSelectedComplex, loadComplexes, loadComplexById } from "@/store/slices/complexSlice";
import { ComplexHeader } from "./components/ComplexHeader";
import { ManagementActions, ENTITY_LEVELS } from "@/components/management/ManagementActions";
import { ComplexTable } from "./components/ComplexTable";
import { ComplexPagination } from "./components/ComplexPagination";
import { ComplexFormModal } from "./components/modals/ComplexFormModal";
import { ComplexSearchModal } from "./components/modals/ComplexSearchModal";
import { useComplexForm } from "./hooks/useComplexForm";
import { useComplexData } from "./hooks/useComplexData";
import complexesAPI from "./api";
import DynamicToast from "@/components/DynamicToast";
import { ViewModal } from "@/components/management/ViewModal";
import { DeleteConfirmModal } from "@/components/management/DeleteConfirmModal";
import { BuildingOfficeIcon, MapPinIcon, InformationCircleIcon, CheckCircleIcon, PhoneIcon, EnvelopeIcon, GlobeAltIcon, CubeIcon } from "@heroicons/react/24/outline";
import ComplexSettingsModal from "./components/modals/ComplexSettingsModal";

export default function ComplexesPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  // URL-dən mtk_id götür
  const urlMtkId = searchParams.get("mtk_id");

  // Redux-dan selected MTK ID götür
  const selectedMtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const selectedMtk = useAppSelector((state) => state.mtk.selectedMtk);
  const mtks = useAppSelector((state) => state.mtk.mtks);

  // Redux-dan selected Complex ID götür
  const selectedComplexId = useAppSelector((state) => state.complex.selectedComplexId);
  const selectedComplex = useAppSelector((state) => state.complex.selectedComplex);

  // Local state for mtkId filter
  const [mtkId, setMtkId] = useState(() => {
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      return !isNaN(id) ? id : null;
    }
    return selectedMtkId || null;
  });

  const [search, setSearch] = useState({});

  const [paramModalOpen, setParamModalOpen] = useState(false);
  const [paramItem, setParamItem] = useState(null);

  const handleOpenParams = (item) => {
    setItemToView(item);
    setSettingsModalOpen(true);
  };

  // Sync mtkId with URL changes or Redux changes
  useEffect(() => {
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      if (!isNaN(id) && id !== mtkId) {
        setMtkId(id);
      }
    } else if (selectedMtkId && selectedMtkId !== mtkId) {
      // URL-də yoxdursa, Redux-dan oxu
      setMtkId(selectedMtkId);
    }
  }, [urlMtkId, selectedMtkId]);
  const [formOpen, setFormOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToView, setItemToView] = useState(null);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const updateField = (field, value) => {
    setSelected({ ...selected, [field]: value });
  };

  const config = useAppSelector((state) => state.complex.selectedComplex?.config);

  const form = useComplexForm();
  const { items, loading, page, lastPage, total, itemsPerPage, setItemsPerPage, goToPage, refresh } = useComplexData({ search, mtkId });

  const mtkInitializedRef = useRef(false);

  useEffect(() => {
    dispatch(loadMtks({ page: 1, per_page: 1000 }));
    dispatch(loadComplexes({ page: 1, per_page: 1000 }));
  }, [dispatch]);

  // Load selected Complex if ID exists but Complex data doesn't
  useEffect(() => {
    if (selectedComplexId && !selectedComplex) {
      dispatch(loadComplexById(selectedComplexId));
    }
  }, [dispatch, selectedComplexId, selectedComplex]);

  // MTK seçim mantığı: URL > Cookie > İlk MTK (sadece bir kez çalışır)
  useEffect(() => {
    // Zaten initialize edildiyse tekrar çalıştırma
    if (mtkInitializedRef.current) {
      return;
    }

    // MTK listesi henüz yüklenmediyse bekle
    if (mtks.length === 0) {
      return;
    }

    // 1. URL'de mtk_id varsa, onu kullan
    if (urlMtkId) {
      const id = parseInt(urlMtkId, 10);
      if (!isNaN(id)) {
        mtkInitializedRef.current = true;
        if (id !== selectedMtkId || !selectedMtk) {
          // MTK'yı yüklə və Redux'a kaydet (cookie'ye de yazılacak)
          dispatch(loadMtkById(id)).then((result) => {
            if (result.payload) {
              dispatch(setSelectedMtk({ id, mtk: result.payload }));
            }
          });
        }
        return;
      }
    }

    // 2. Cookie'den gelen selectedMtkId varsa, onu kullan
    if (selectedMtkId) {
      mtkInitializedRef.current = true;
      if (!selectedMtk) {
        // MTK verisi yoksa yükle
        dispatch(loadMtkById(selectedMtkId)).then((result) => {
          if (result.payload) {
            dispatch(setSelectedMtk({ id: selectedMtkId, mtk: result.payload }));
          }
        });
      }
      // URL'i güncelle
      if (!urlMtkId) {
        navigate(`/dashboard/management/complexes?mtk_id=${selectedMtkId}`, { replace: true });
      }
      return;
    }

    // 3. Hiçbiri yoksa, ilk MTK'yı otomatik seç
    if (mtks.length > 0) {
      const firstMtk = mtks[0];
      if (firstMtk && firstMtk.id) {
        mtkInitializedRef.current = true;
        // İlk MTK'yı yükle ve seç
        dispatch(loadMtkById(firstMtk.id)).then((result) => {
          if (result.payload) {
            dispatch(setSelectedMtk({ id: firstMtk.id, mtk: result.payload }));
            // URL'i de güncelle
            navigate(`/dashboard/management/complexes?mtk_id=${firstMtk.id}`, { replace: true });
          }
        });
      }
    }
  }, [urlMtkId, selectedMtkId, selectedMtk, mtks, dispatch, navigate]);

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

  // Filter change handler for ManagementActions
  const handleFilterChange = async (filterType, value, filtersToReset = []) => {
    if (filterType === "mtk") {
      // Update local state immediately for instant filter
      setMtkId(value);

      if (value) {
        // MTK'yı yüklə və Redux'a kaydet (cookie'ye de yazılacak)
        try {
          const result = await dispatch(loadMtkById(value));
          if (result.payload) {
            dispatch(setSelectedMtk({ id: value, mtk: result.payload }));
          }
        } catch (error) {
          console.error("Error loading MTK:", error);
        }

        // URL-i yenilə
        navigate(`/dashboard/management/complexes?mtk_id=${value}`, { replace: true });
      } else {
        // MTK seçimini temizle (cookie'den de silinecek)
        dispatch(setSelectedMtk({ id: null, mtk: null }));
        navigate("/dashboard/management/complexes", { replace: true });
      }
    }
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

  const handleGoToBuildings = (complexId) => {
    navigate(`/dashboard/management/buildings?complex_id=${complexId}`);
  };

  const submitForm = async (formData) => {
    try {
      if (mode === "create") {
        await complexesAPI.add(formData);
        showToast("success", "Complex uğurla əlavə edildi", "Uğurlu");
      } else {
        await complexesAPI.update(selected.id, formData);
        showToast("success", "Complex uğurla yeniləndi", "Uğurlu");
      }
      refresh();
      form.resetForm();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <ComplexHeader />

      <ManagementActions
        entityLevel={ENTITY_LEVELS.COMPLEX}
        search={search}
        filterValues={{ mtkId }}
        onFilterChange={handleFilterChange}
        onCreateClick={handleCreate}
        onSearchClick={() => setSearchModalOpen(true)}
        onApplyNameSearch={handleApplyNameSearch}
        onStatusChange={handleStatusChange}
        onRemoveFilter={handleRemoveFilter}
        totalItems={total}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <ComplexTable
        items={items}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onGoToBuildings={handleGoToBuildings}
        onSelect={handleSelect}
        selectedComplexId={selectedComplexId}
        onOpenParams={handleOpenParams}   // 🔥 bunu əlavə et
      />

      {lastPage > 1 && (
        <ComplexPagination
          page={page}
          lastPage={lastPage}
          onPageChange={goToPage}
          total={total}
        />
      )}

      <ComplexFormModal
        open={formOpen}
        mode={mode}
        onClose={() => {
          setFormOpen(false);
          form.resetForm();
        }}
        form={form}
        onSubmit={submitForm}
        mtkId={mtkId}
      />

      <ComplexSearchModal
        open={searchModalOpen}
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
        fields={[
          { key: "name", label: "Ad", icon: BuildingOfficeIcon },
          {
            key: "meta.desc",
            label: "Təsvir",
            icon: InformationCircleIcon,
            fullWidth: true,
            getValue: (item) => item?.meta?.desc
          },
          {
            key: "meta.address",
            label: "Ünvan",
            icon: MapPinIcon,
            fullWidth: true,
            getValue: (item) => item?.meta?.address
          },
          {
            key: "meta.phone",
            label: "Telefon",
            icon: PhoneIcon,
            getValue: (item) => item?.meta?.phone
          },
          {
            key: "meta.email",
            label: "E-mail",
            icon: EnvelopeIcon,
            getValue: (item) => item?.meta?.email
          },
          {
            key: "meta.website",
            label: "Website",
            icon: GlobeAltIcon,
            fullWidth: true,
            getValue: (item) => item?.meta?.website
          },
          {
            key: "meta.lat",
            label: "Enlik (Lat)",
            icon: MapPinIcon,
            getValue: (item) => item?.meta?.lat
          },
          {
            key: "meta.lng",
            label: "Uzunluq (Lng)",
            icon: MapPinIcon,
            getValue: (item) => item?.meta?.lng
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
            }
          },
          {
            key: "modules",
            label: "Modullar",
            icon: CubeIcon,
            fullWidth: true,
            customRender: (item, field) => {
              const modules = item?.modules || [];
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
                    {modules.map((moduleId, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      >
                        Modul #{moduleId}
                      </span>
                    ))}
                  </div>
                </>
              );
            }
          },
          {
            key: "avaliable_services",
            label: "Mövcud xidmətlər",
            icon: InformationCircleIcon,
            getValue: (item) => item?.avaliable_services,
            format: (value) => value ? String(value) : "Yoxdur"
          },
          {
            key: "status",
            label: "Status",
            icon: CheckCircleIcon
          },
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
                      </div>
                    ))}
                  </div>
                </>
              );
            }
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
        title="Complex-i Sil"
        itemName={itemToDelete ? `"${itemToDelete.name}"` : ""}
        entityName="complex"
        loading={deleteLoading}
      />

      <ComplexSettingsModal
        open={settingsModalOpen}
        onClose={() => {
          setSettingsModalOpen(false);
          setItemToView(null);
        }}
        complexId={itemToView?.id}
        complexData={itemToView}
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

