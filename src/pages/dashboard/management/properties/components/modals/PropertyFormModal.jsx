import React, { useMemo, useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { HomeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import DynamicToast from "@/components/DynamicToast";
import propertyLookupsAPI from "../../api/lookups";

const ACTIVE_COLOR = "#14b8a6"; // Teal for properties

export function PropertyFormModal({ open, mode = "create", onClose, form, onSubmit, mtkId = null, complexId = null, buildingId = null, blockId = null }) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });
  const [mtks, setMtks] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(false);
  const [loadingComplexes, setLoadingComplexes] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const isEdit = mode === "edit";
  const title = isEdit ? "Mənzil Redaktə et" : "Yeni Mənzil Əlavə Et";

  const statusOptions = [
    { value: "active", label: "Aktiv" },
    { value: "inactive", label: "Qeyri-aktiv" },
  ];

  // Load lookups when modal opens
  useEffect(() => {
    if (open) {
      setLoadingLookups(true);
      Promise.all([
        propertyLookupsAPI.getMtks(),
        propertyLookupsAPI.getPropertyTypes(),
      ])
        .then(([mtksData, typesData]) => {
          setMtks(mtksData || []);
          setPropertyTypes(typesData || []);
        })
        .catch((error) => {
          console.error("Error loading lookups:", error);
        })
        .finally(() => {
          setLoadingLookups(false);
        });
    }
  }, [open]);

  // Load complexes when MTK changes
  useEffect(() => {
    if (open && form?.formData?.mtk_id) {
      setLoadingComplexes(true);
      propertyLookupsAPI.getComplexes({ mtk_id: form.formData.mtk_id })
        .then((data) => {
          setComplexes(data || []);
        })
        .catch((error) => {
          console.error("Error loading complexes:", error);
          setComplexes([]);
        })
        .finally(() => {
          setLoadingComplexes(false);
        });
    } else if (open && !form?.formData?.mtk_id) {
      setComplexes([]);
      form?.updateField("complex_id", null);
      form?.updateField("building_id", null);
      form?.updateField("block_id", null);
    }
  }, [open, form?.formData?.mtk_id, form]);

  // Load buildings when Complex changes
  useEffect(() => {
    if (open && form?.formData?.complex_id) {
      setLoadingBuildings(true);
      propertyLookupsAPI.getBuildings({ complex_id: form.formData.complex_id })
        .then((data) => {
          setBuildings(data || []);
        })
        .catch((error) => {
          console.error("Error loading buildings:", error);
          setBuildings([]);
        })
        .finally(() => {
          setLoadingBuildings(false);
        });
    } else if (open && !form?.formData?.complex_id) {
      setBuildings([]);
      form?.updateField("building_id", null);
      form?.updateField("block_id", null);
    }
  }, [open, form?.formData?.complex_id, form]);

  // Load blocks when Building changes
  useEffect(() => {
    if (open && form?.formData?.building_id) {
      setLoadingBlocks(true);
      propertyLookupsAPI.getBlocks({ building_id: form.formData.building_id })
        .then((data) => {
          setBlocks(data || []);
        })
        .catch((error) => {
          console.error("Error loading blocks:", error);
          setBlocks([]);
        })
        .finally(() => {
          setLoadingBlocks(false);
        });
    } else if (open && !form?.formData?.building_id) {
      setBlocks([]);
      form?.updateField("block_id", null);
    }
  }, [open, form?.formData?.building_id, form]);

  // Set IDs from props if provided
  useEffect(() => {
    if (open && mtkId && !form?.formData?.mtk_id) {
      form?.updateField("mtk_id", mtkId);
    }
  }, [open, mtkId, form]);

  useEffect(() => {
    if (open && complexId && !form?.formData?.complex_id) {
      form?.updateField("complex_id", complexId);
    }
  }, [open, complexId, form]);

  useEffect(() => {
    if (open && buildingId && !form?.formData?.building_id) {
      form?.updateField("building_id", buildingId);
    }
  }, [open, buildingId, form]);

  useEffect(() => {
    if (open && blockId && !form?.formData?.block_id) {
      form?.updateField("block_id", blockId);
    }
  }, [open, blockId, form]);

  const errorText = useMemo(() => {
    if (!form?.formData?.name?.trim()) return "Ad mütləqdir";
    if (!form?.formData?.mtk_id) return "MTK mütləqdir";
    if (!form?.formData?.complex_id) return "Complex mütləqdir";
    if (!form?.formData?.building_id) return "Building mütləqdir";
    if (!form?.formData?.block_id) return "Block mütləqdir";
    if (!form?.formData?.property_type) return "Mənzil tipi mütləqdir";
    return "";
  }, [form?.formData]);

  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const submit = async () => {
    if (errorText) {
      showToast("error", errorText, "Xəta");
      return;
    }
    setSaving(true);
    try {
      await onSubmit?.(form.formData);
      onClose?.();
    } catch (e) {
      console.error(e);
      const errorMessage = e?.message || "Xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <Dialog 
        open={!!open} 
        handler={onClose} 
        size="xl"
        className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl"
        dismiss={{ enabled: false }}
      >
        <DialogHeader 
          className="border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between"
          style={{
            background: `linear-gradient(to right, ${getRgbaColor(ACTIVE_COLOR, 0.9)}, ${getRgbaColor(ACTIVE_COLOR, 0.7)})`,
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm"
              style={{ backgroundColor: getRgbaColor(ACTIVE_COLOR, 0.3) }}
            >
              <HomeIcon className="h-6 w-6 text-white" />
            </div>
            <Typography variant="h5" className="text-white font-bold">
              {title}
            </Typography>
          </div>
          <Button
            variant="text"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full relative z-10"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <DialogBody className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* Əsas Məlumatlar */}
            <div>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
                Əsas Məlumatlar
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  label="Ad *"
                  value={form?.formData?.name || ""}
                  onChange={(e) => form?.updateField("name", e.target.value)}
                  error={!!form?.errors?.name}
                  helperText={form?.errors?.name}
                />
                <CustomSelect
                  label="Status"
                  value={form?.formData?.status || "active"}
                  onChange={(value) => form?.updateField("status", value)}
                  options={statusOptions}
                />
              </div>
            </div>

            {/* Seçimlər */}
            <div>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
                Seçimlər
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomSelect
                  label="MTK *"
                  value={form?.formData?.mtk_id ? String(form.formData.mtk_id) : ""}
                  onChange={(value) => {
                    form?.updateField("mtk_id", value ? Number(value) : null);
                    form?.updateField("complex_id", null);
                    form?.updateField("building_id", null);
                    form?.updateField("block_id", null);
                  }}
                  options={mtks.map(mtk => ({ value: String(mtk.id), label: mtk.name }))}
                  loading={loadingLookups}
                  error={!!form?.errors?.mtk_id}
                  helperText={form?.errors?.mtk_id}
                  disabled={loadingLookups || isEdit}
                />
                <CustomSelect
                  label="Complex *"
                  value={form?.formData?.complex_id ? String(form.formData.complex_id) : ""}
                  onChange={(value) => {
                    form?.updateField("complex_id", value ? Number(value) : null);
                    form?.updateField("building_id", null);
                    form?.updateField("block_id", null);
                  }}
                  options={complexes.map(complex => ({ value: String(complex.id), label: complex.name }))}
                  loading={loadingComplexes}
                  error={!!form?.errors?.complex_id}
                  helperText={form?.errors?.complex_id}
                  disabled={loadingComplexes || !form?.formData?.mtk_id || isEdit}
                />
                <CustomSelect
                  label="Building *"
                  value={form?.formData?.building_id ? String(form.formData.building_id) : ""}
                  onChange={(value) => {
                    form?.updateField("building_id", value ? Number(value) : null);
                    form?.updateField("block_id", null);
                  }}
                  options={buildings.map(building => ({ value: String(building.id), label: building.name }))}
                  loading={loadingBuildings}
                  error={!!form?.errors?.building_id}
                  helperText={form?.errors?.building_id}
                  disabled={loadingBuildings || !form?.formData?.complex_id || isEdit}
                />
                <CustomSelect
                  label="Block *"
                  value={form?.formData?.block_id ? String(form.formData.block_id) : ""}
                  onChange={(value) => form?.updateField("block_id", value ? Number(value) : null)}
                  options={blocks.map(block => ({ value: String(block.id), label: block.name }))}
                  loading={loadingBlocks}
                  error={!!form?.errors?.block_id}
                  helperText={form?.errors?.block_id}
                  disabled={loadingBlocks || !form?.formData?.building_id || isEdit}
                />
              </div>
              <div className="mt-4">
                <CustomSelect
                  label="Mənzil Tipi *"
                  value={form?.formData?.property_type ? String(form.formData.property_type) : ""}
                  onChange={(value) => form?.updateField("property_type", value ? Number(value) : null)}
                  options={propertyTypes.map(type => ({ value: String(type.id), label: type.name || `Tip #${type.id}` }))}
                  loading={loadingLookups}
                  error={!!form?.errors?.property_type}
                  helperText={form?.errors?.property_type}
                  disabled={loadingLookups}
                />
              </div>
            </div>

            {/* Meta Məlumatlar */}
            <div>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
                Meta Məlumatlar
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomInput
                  label="Mənzil №"
                  type="number"
                  value={form?.formData?.meta?.apartment_number || ""}
                  onChange={(e) => form?.updateField("meta.apartment_number", e.target.value)}
                />
                <CustomInput
                  label="Mərtəbə"
                  type="number"
                  value={form?.formData?.meta?.floor || ""}
                  onChange={(e) => form?.updateField("meta.floor", e.target.value)}
                />
                <CustomInput
                  label="Sahə (m²)"
                  type="number"
                  value={form?.formData?.meta?.area || ""}
                  onChange={(e) => form?.updateField("meta.area", e.target.value)}
                />
              </div>
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
          <Button
            variant="outlined"
            onClick={onClose}
            className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white dark:border-gray-400 dark:text-gray-400 dark:hover:bg-gray-400"
          >
            Ləğv et
          </Button>
          <Button
            onClick={submit}
            disabled={saving || !!errorText}
            className="text-white"
            style={{ backgroundColor: ACTIVE_COLOR }}
          >
            {saving ? "Yadda saxlanılır..." : isEdit ? "Yenilə" : "Əlavə et"}
          </Button>
        </DialogFooter>
      </Dialog>

      <DynamicToast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        title={toast.title}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
}

