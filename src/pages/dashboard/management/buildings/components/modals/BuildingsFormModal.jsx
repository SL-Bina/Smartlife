import React, { useEffect, useMemo, useState, useRef } from "react";
import { CustomDialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/CustomDialog";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomTextarea } from "@/components/ui/CustomTextarea";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomCard, CardBody } from "@/components/ui/CustomCard";
import { CustomTypography } from "@/components/ui/CustomTypography";
import { useManagementEnhanced, useMtkColor } from "@/store/exports";
import {
  BuildingOffice2Icon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export function BuildingFormModal({ open, mode = "create", onClose, form, onSubmit }) {
  const { state } = useManagementEnhanced();
  const { colorCode, getRgba, defaultColor } = useMtkColor();
  const [saving, setSaving] = useState(false);
  const isEdit = mode === "edit";
  const prevMtkIdRef = useRef(null);
  
  // Context-dən MTK və Complex məlumatlarını al
  const mtks = state.mtks || [];
  const complexes = state.complexes || [];
  const loadingMtks = state.loading?.mtks || false;
  const mtkId = form?.formData?.mtk_id;

  const title = isEdit ? "Bina Redaktə et" : "Yeni Bina yarat";
  
  // Default göz yormayan qırmızı ton
  const defaultRed = "#dc2626";
  const activeColor = colorCode || defaultColor || defaultRed;

  const statusOptions = [
    { value: "active", label: "Aktiv" },
    { value: "inactive", label: "Qeyri-aktiv" },
  ];

  // Complex-ləri MTK-ya görə filter et (useMemo ilə memoize et)
  const filteredComplexes = useMemo(() => {
    if (!mtkId) {
      return complexes;
    }

    // Context-dən indexed maps istifadə et
    const complexIds = state.indexedMaps?.complexIdsByMtkId?.[mtkId] || [];
    return complexes.filter(c => complexIds.includes(c.id));
  }, [complexes, mtkId, state.indexedMaps]);

  // MTK dəyişəndə kompleks seçimini sıfırla
  useEffect(() => {
    if (!form?.updateField) return;
    
    const currentMtkId = form?.formData?.mtk_id;
    const currentComplexId = form?.formData?.complex_id;
    
    // MTK dəyişibsə və kompleks seçilibsə, yoxla
    if (prevMtkIdRef.current !== null && prevMtkIdRef.current !== currentMtkId && currentComplexId) {
      const currentComplex = filteredComplexes.find((c) => c.id === currentComplexId);
      if (!currentComplex) {
        form.updateField("complex_id", null);
      }
    }
    
    prevMtkIdRef.current = currentMtkId;
  }, [mtkId, filteredComplexes, form?.updateField, form?.formData?.complex_id]);

  // modal açılarkən default dəyərlər
  useEffect(() => {
    if (!open) return;
    if (!form || !form.updateField) return;

    const currentMtkId = form.formData.mtk_id;
    const currentComplexId = form.formData.complex_id;

    // MTK default
    if (!currentMtkId) {
      if (state.mtkId) {
        form.updateField("mtk_id", state.mtkId);
      } else if (mtks.length > 0) {
        form.updateField("mtk_id", mtks[0].id);
      }
    }

    // Complex default - yalnız filteredComplexes hazır olduqda
    // Bu effect-i yalnız bir dəfə işləmək üçün filteredComplexes.length-i dependency-dən çıxardıq
    if (!currentComplexId && filteredComplexes.length > 0) {
      if (state.complexId && filteredComplexes.some(c => c.id === state.complexId)) {
        form.updateField("complex_id", state.complexId);
      } else if (filteredComplexes.length > 0) {
        form.updateField("complex_id", filteredComplexes[0].id);
      }
    }
  }, [open, state.mtkId, state.complexId, mtks.length]);

  const nameError = useMemo(() => {
    if (!form?.formData?.name?.trim()) return "Ad mütləqdir";
    return "";
  }, [form?.formData?.name]);

  const mtkError = useMemo(() => {
    if (!form?.formData?.mtk_id) return "MTK seçilməlidir";
    return "";
  }, [form?.formData?.mtk_id]);

  const complexError = useMemo(() => {
    if (!form?.formData?.complex_id) return "Kompleks seçilməlidir";
    return "";
  }, [form?.formData?.complex_id]);

  const errorText = useMemo(() => {
    if (nameError) return nameError;
    if (mtkError) return mtkError;
    if (complexError) return complexError;
    return "";
  }, [nameError, mtkError, complexError]);

  const submit = async () => {
    if (errorText) return;
    setSaving(true);
    try {
      await onSubmit?.(form.formData);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <CustomDialog open={!!open} onClose={onClose} size="xl">
        <DialogHeader 
          className="rounded-t-lg transition-colors"
          style={{
            background: colorCode 
              ? `linear-gradient(to right, ${getRgba(0.2)}, ${getRgba(0.15)})` 
              : `linear-gradient(to right, rgba(220, 38, 38, 0.2), rgba(185, 28, 28, 0.15))`,
          }}
        >
          <div className="flex items-center gap-3 flex-1">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: activeColor }}
            >
              <BuildingOffice2Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <CustomTypography variant="h5" className="font-bold text-gray-900 dark:text-white">
                {title}
              </CustomTypography>
              <CustomTypography variant="small" className="text-gray-600 dark:text-gray-300 font-normal">
                {isEdit ? "Bina məlumatlarını yeniləyin" : "Yeni bina üçün məlumatları doldurun"}
              </CustomTypography>
            </div>
          </div>
          <CustomButton
            variant="text"
            size="sm"
            onClick={onClose}
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2"
            style={{
              borderColor: activeColor,
            }}
          >
            <XMarkIcon className="h-5 w-5" />
          </CustomButton>
        </DialogHeader>

        <DialogBody className="max-h-[75vh] overflow-y-auto">
          {!form ? (
            <div className="text-center py-8">
              <CustomTypography variant="body2" className="text-gray-500 dark:text-gray-300">
                Form hazır deyil
              </CustomTypography>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Basic Information */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    Əsas məlumatlar
                  </CustomTypography>
                  <div className="flex flex-col gap-4">
                    <CustomInput
                      label={
                        <>
                          Bina adı <span className="text-red-500">*</span>
                        </>
                      }
                      value={form.formData.name || ""}
                      onChange={(e) => form.updateField("name", e.target.value)}
                      error={nameError || false}
                      icon={<BuildingOffice2Icon className="h-5 w-5" />}
                    />

                    <CustomSelect
                      label={
                        <>
                          MTK <span className="text-red-500">*</span>
                        </>
                      }
                      value={form.formData.mtk_id}
                      onChange={(value) => {
                        const newMtkId = value ? Number(value) : null;
                        form.updateField("mtk_id", newMtkId);
                        // MTK dəyişəndə kompleks seçimini sıfırla
                        if (form.formData.complex_id) {
                          form.updateField("complex_id", null);
                        }
                      }}
                      options={mtks.map((m) => ({ value: m.id, label: m.name }))}
                      placeholder="MTK seç"
                      error={mtkError || false}
                      disabled={loadingMtks || mtks.length === 0}
                    />

                    <CustomSelect
                      label={
                        <>
                          Kompleks <span className="text-red-500">*</span>
                        </>
                      }
                      value={form.formData.complex_id}
                      onChange={(value) => form.updateField("complex_id", value ? Number(value) : null)}
                      options={filteredComplexes.map((c) => ({ value: c.id, label: c.name }))}
                      placeholder="Kompleks seç"
                      error={complexError || false}
                      disabled={!form.formData.mtk_id || filteredComplexes.length === 0}
                    />

                    <CustomSelect
                      label="Status"
                      value={form.formData.status || "active"}
                      onChange={(value) => form.updateField("status", value)}
                      options={statusOptions}
                      placeholder="Status seç"
                    />

                    <CustomTextarea
                      label="Təsvir"
                      value={form.formData.meta?.desc || ""}
                      onChange={(e) => form.updateMeta("desc", e.target.value)}
                      rows={4}
                      icon={<DocumentTextIcon className="h-5 w-5" />}
                    />
                  </div>
                </CardBody>
              </CustomCard>
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <CustomButton variant="outlined" color="gray" onClick={onClose} disabled={saving}>
            Ləğv et
          </CustomButton>
          <CustomButton
            color="red"
            onClick={submit}
            disabled={!!errorText || saving}
            loading={saving}
          >
            {saving ? "Yadda saxlanılır..." : isEdit ? "Yenilə" : "Yarat"}
          </CustomButton>
        </DialogFooter>
      </CustomDialog>
    </>
  );
}
