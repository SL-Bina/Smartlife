import React, { useMemo, useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { RectangleStackIcon, XMarkIcon } from "@heroicons/react/24/outline";
import DynamicToast from "@/components/DynamicToast";
import blockLookupsAPI from "../../api/lookups";
import buildingsAPI from "../../../buildings/api";

const ACTIVE_COLOR = "#6366f1"; // Indigo for blocks

export function BlockFormModal({ open, mode = "create", onClose, form, onSubmit, complexId = null, buildingId = null, mtkId = null, onEditRequest }) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });
  const [complexes, setComplexes] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loadingComplexes, setLoadingComplexes] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const isEdit = mode === "edit";
  const title = isEdit ? "Blok Redaktə et" : "Yeni Blok Əlavə Et";

  // Load complexes when modal opens
  useEffect(() => {
    if (open) {
      setLoadingComplexes(true);
      const params = {};
      if (mtkId) {
        params.mtk_id = mtkId;
      }
      blockLookupsAPI.getComplexes(params)
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
    }
  }, [open, mtkId]);

  // Load buildings when complex_id changes
  useEffect(() => {
    if (open && form?.formData?.complex_id) {
      setLoadingBuildings(true);
      // Use search endpoint for filtering like ManagementActions
      buildingsAPI.search({ 
        complex_ids: [form.formData.complex_id],
        per_page: 1000 
      })
        .then((res) => {
          const data = res?.data?.data?.data || [];
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
    }
  }, [open, form?.formData?.complex_id, form]);

  // Set complex_id from prop if provided (only for create mode)
  useEffect(() => {
    if (open && !isEdit && complexId && form?.updateField) {
      const currentComplexId = form?.formData?.complex_id;
      if (!currentComplexId || currentComplexId !== complexId) {
        form.updateField("complex_id", complexId);
      }
    }
  }, [open, isEdit, complexId, form?.formData?.complex_id]);

  // Set building_id from prop if provided (only for create mode)
  useEffect(() => {
    if (open && !isEdit && buildingId && form?.updateField) {
      const currentBuildingId = form?.formData?.building_id;
      if (!currentBuildingId || currentBuildingId !== buildingId) {
        form.updateField("building_id", buildingId);
      }
    }
  }, [open, isEdit, buildingId, form?.formData?.building_id]);

  const errorText = useMemo(() => {
    if (!form?.formData?.name?.trim()) return "Ad mütləqdir";
    if (!form?.formData?.complex_id) return "Complex mütləqdir";
    if (!form?.formData?.building_id) return "Building mütləqdir";
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
    // If edit mode and onEditRequest is provided, delegate to parent for confirmation
    if (mode === "edit" && onEditRequest) {
      onEditRequest(form.formData);
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
        size="lg"
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
              <RectangleStackIcon className="h-6 w-6 text-white" />
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomSelect
                  label="Complex *"
                  value={form?.formData?.complex_id ? String(form.formData.complex_id) : ""}
                  onChange={(value) => {
                    form?.updateField("complex_id", value ? Number(value) : null);
                    // Complex dəyişəndə Building-i təmizlə
                    form?.updateField("building_id", null);
                  }}
                  options={complexes.map(complex => ({ value: String(complex.id), label: complex.name }))}
                  loading={loadingComplexes}
                  error={!!form?.errors?.complex_id}
                  helperText={form?.errors?.complex_id}
                  disabled={loadingComplexes}
                />
                <CustomSelect
                  label="Building *"
                  value={form?.formData?.building_id ? String(form.formData.building_id) : ""}
                  onChange={(value) => form?.updateField("building_id", value ? Number(value) : null)}
                  options={buildings.map(building => ({ value: String(building.id), label: building.name }))}
                  loading={loadingBuildings}
                  error={!!form?.errors?.building_id}
                  helperText={form?.errors?.building_id}
                  disabled={loadingBuildings || !form?.formData?.complex_id}
                />
              </div>
            </div>

            {/* Meta Məlumatlar */}
            <div>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
                Meta Məlumatlar
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  label="Mərtəbə sayı"
                  type="number"
                  value={form?.formData?.meta?.total_floor || ""}
                  onChange={(e) => form?.updateField("meta.total_floor", e.target.value)}
                />
                <CustomInput
                  label="Mənzil sayı"
                  type="number"
                  value={form?.formData?.meta?.total_apartment || ""}
                  onChange={(e) => form?.updateField("meta.total_apartment", e.target.value)}
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

