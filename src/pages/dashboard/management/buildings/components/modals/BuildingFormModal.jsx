import React, { useMemo, useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { HomeModernIcon, XMarkIcon } from "@heroicons/react/24/outline";
import DynamicToast from "@/components/DynamicToast";
import buildingLookupsAPI from "../../api/lookups";

const ACTIVE_COLOR = "#9333ea";

export function BuildingFormModal({ open, mode = "create", onClose, form, onSubmit, complexId = null, mtkId = null }) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });
  const [complexes, setComplexes] = useState([]);
  const [mtks, setMtks] = useState([]);
  const [loadingComplexes, setLoadingComplexes] = useState(false);
  const [loadingMtks, setLoadingMtks] = useState(false);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const isEdit = mode === "edit";
  const title = isEdit ? "Bina Redaktə et" : "Yeni Bina Əlavə Et";

  const statusOptions = [
    { value: "active", label: "Aktiv" },
    { value: "inactive", label: "Qeyri-aktiv" },
  ];

  // useEffect(() => {
  //   if (open) {
  //     setLoadingMtks(true);
  //     buildingLookupsAPI.getMtks()
  //       .then((data) => {
  //         setMtks(data || []);
  //       })
  //       .catch((error) => {
  //         console.error("Error loading MTKs:", error);
  //         setMtks([]);
  //       })
  //       .finally(() => {
  //         setLoadingMtks(false);
  //       });
  //   }
  // }, [open]);

  useEffect(() => {
    if (open) {
      setLoadingComplexes(true);
      const params = {};
      if (form?.formData?.mtk_id) {
        params.mtk_id = form.formData.mtk_id;
      } else if (mtkId) {
        params.mtk_id = mtkId;
      }
      buildingLookupsAPI.getComplexes(params)
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
  }, [open, form?.formData?.mtk_id, mtkId]);

  useEffect(() => {
    if (open && !isEdit && complexId && form?.updateField) {
      const currentComplexId = form?.formData?.complex_id;
      if (!currentComplexId || currentComplexId !== complexId) {
        form.updateField("complex_id", complexId);
      }
    }
  }, [open, isEdit, complexId, form?.formData?.complex_id]);

  useEffect(() => {
    if (form?.formData?.mtk_id) {
      form?.updateField("complex_id", null);
    }
  }, [form?.formData?.mtk_id, form]);

  const errorText = useMemo(() => {
    if (!form?.formData?.name?.trim()) return "Ad mütləqdir";
    if (!form?.formData?.complex_id) return "Complex mütləqdir";
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
              <HomeModernIcon className="h-6 w-6 text-white" />
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

                {/* <CustomSelect
                  label="MTK"
                  value={form?.formData?.mtk_id ? String(form.formData.mtk_id) : ""}
                  onChange={(value) => {
                    form?.updateField("mtk_id", value ? parseInt(value, 10) : null);
                    form?.updateField("complex_id", null);
                  }}
                  options={[
                    { value: "", label: "Seçin..." },
                    ...mtks.map((mtk) => ({
                      value: String(mtk.id),
                      label: mtk.name || `MTK #${mtk.id}`,
                    })),
                  ]}
                  loading={loadingMtks}
                  disabled={loadingMtks && !isEdit}
                /> */}

                <CustomSelect
                  label="Complex *"
                  value={form?.formData?.complex_id ? String(form.formData.complex_id) : ""}
                  onChange={(value) => form?.updateField("complex_id", value ? parseInt(value, 10) : null)}
                  options={[
                    { value: "", label: "Seçin..." },
                    ...complexes.map((complex) => ({
                      value: String(complex.id),
                      label: complex.name || `Complex #${complex.id}`,
                    })),
                  ]}
                  error={!!form?.errors?.complex_id}
                  helperText={form?.errors?.complex_id}
                  loading={loadingComplexes}
                  // disabled={loadingComplexes || (!form?.formData?.mtk_id )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <CustomSelect
                  label="Status"
                  value={form?.formData?.status || "active"}
                  onChange={(value) => form?.updateField("status", value)}
                  options={statusOptions}
                />
              </div>
            </div>

            <div>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
                Əlavə Məlumatlar
              </Typography>
              <CustomInput
                label="Təsvir"
                value={form?.formData?.meta?.desc || ""}
                onChange={(e) => form?.updateField("meta.desc", e.target.value)}
                multiline
                rows={3}
              />
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

