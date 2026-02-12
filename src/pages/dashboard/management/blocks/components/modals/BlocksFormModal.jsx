import React, { useEffect, useMemo, useState } from "react";
import { CustomDialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/CustomDialog";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomCard, CardBody } from "@/components/ui/CustomCard";
import { CustomTypography } from "@/components/ui/CustomTypography";
import { useManagementEnhanced } from "@/store/exports";
import {
  RectangleStackIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export function BlocksFormModal({
  open,
  mode = "create",
  onClose,
  form,
  onSubmit,
  complexes = [],
  buildings = [],
  mtks = [],
  loadingMtks = false,
  loadingComplexes = false,
  loadingBuildings = false,
}) {
  const { state } = useManagementEnhanced();
  const [saving, setSaving] = useState(false);
  const [filteredComplexes, setFilteredComplexes] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const isEdit = mode === "edit";

  const title = isEdit ? "Blok Redaktə et" : "Yeni Blok yarat";

  // Complex-ləri MTK-ya görə filter et
  useEffect(() => {
    if (!form?.formData?.mtk_id) {
      setFilteredComplexes(complexes);
      if (form?.formData?.complex_id) {
        form.updateField("complex_id", null);
      }
      return;
    }

    const filtered = complexes.filter((c) => {
      const id1 = c?.bind_mtk?.id;
      const id2 = c?.mtk_id;
      return String(id1 || id2 || "") === String(form.formData.mtk_id);
    });

    setFilteredComplexes(filtered);

    if (form.formData.complex_id) {
      const currentComplex = filtered.find((c) => c.id === form.formData.complex_id);
      if (!currentComplex) {
        form.updateField("complex_id", null);
      }
    }
  }, [complexes, form?.formData?.mtk_id, form]);

  // Buildings-ləri Complex-ə görə filter et
  useEffect(() => {
    if (!form?.formData?.complex_id) {
      setFilteredBuildings(buildings);
      if (form?.formData?.building_id) {
        form.updateField("building_id", null);
      }
      return;
    }

    const filtered = buildings.filter((b) => {
      const id1 = b?.complex?.id;
      const id2 = b?.complex_id;
      return String(id1 || id2 || "") === String(form.formData.complex_id);
    });

    setFilteredBuildings(filtered);

    if (form.formData.building_id) {
      const currentBuilding = filtered.find((b) => b.id === form.formData.building_id);
      if (!currentBuilding) {
        form.updateField("building_id", null);
      }
    }
  }, [buildings, form?.formData?.complex_id, form]);

  // modal açılarkən default dəyərlər
  useEffect(() => {
    if (!open) return;
    if (!form) return;

    // MTK default
    if (!form.formData.mtk_id && state.mtkId) {
      form.updateField("mtk_id", state.mtkId);
    } else if (!form.formData.mtk_id && mtks.length > 0) {
      form.updateField("mtk_id", mtks[0].id);
    }

    // Complex default
    if (!form.formData.complex_id && state.complexId) {
      form.updateField("complex_id", state.complexId);
    } else if (!form.formData.complex_id && filteredComplexes.length > 0) {
      form.updateField("complex_id", filteredComplexes[0].id);
    }

    // Building default
    if (!form.formData.building_id && state.buildingId) {
      form.updateField("building_id", state.buildingId);
    } else if (!form.formData.building_id && filteredBuildings.length > 0) {
      form.updateField("building_id", filteredBuildings[0].id);
    }
  }, [open, form, state.mtkId, state.complexId, state.buildingId, mtks, filteredComplexes, filteredBuildings]);

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

  const buildingError = useMemo(() => {
    if (!form?.formData?.building_id) return "Bina seçilməlidir";
    return "";
  }, [form?.formData?.building_id]);

  const errorText = useMemo(() => {
    if (nameError) return nameError;
    if (mtkError) return mtkError;
    if (complexError) return complexError;
    if (buildingError) return buildingError;
    return "";
  }, [nameError, mtkError, complexError, buildingError]);

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
        <DialogHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-white/20 rounded-lg">
              <RectangleStackIcon className="h-6 w-6" />
            </div>
            <div>
              <CustomTypography variant="h5" className="font-bold text-white">
                {title}
              </CustomTypography>
              <CustomTypography variant="small" className="text-purple-100 font-normal">
                {isEdit ? "Blok məlumatlarını yeniləyin" : "Yeni blok üçün məlumatları doldurun"}
              </CustomTypography>
            </div>
          </div>
          <CustomButton
            variant="text"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2"
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
                          Blok adı <span className="text-red-500">*</span>
                        </>
                      }
                      value={form.formData.name || ""}
                      onChange={(e) => form.updateField("name", e.target.value)}
                      error={nameError || false}
                      icon={<RectangleStackIcon className="h-5 w-5" />}
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
                        // MTK dəyişəndə complex və building seçimini sıfırla
                        if (form.formData.complex_id) {
                          form.updateField("complex_id", null);
                        }
                        if (form.formData.building_id) {
                          form.updateField("building_id", null);
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
                      onChange={(value) => {
                        const newComplexId = value ? Number(value) : null;
                        form.updateField("complex_id", newComplexId);
                        // Complex dəyişəndə building seçimini sıfırla
                        if (form.formData.building_id) {
                          form.updateField("building_id", null);
                        }
                      }}
                      options={filteredComplexes.map((c) => ({ value: c.id, label: c.name }))}
                      placeholder="Kompleks seç"
                      error={complexError || false}
                      disabled={!form.formData.mtk_id || filteredComplexes.length === 0}
                    />

                    <CustomSelect
                      label={
                        <>
                          Bina <span className="text-red-500">*</span>
                        </>
                      }
                      value={form.formData.building_id}
                      onChange={(value) => form.updateField("building_id", value ? Number(value) : null)}
                      options={filteredBuildings.map((b) => ({ value: b.id, label: b.name }))}
                      placeholder="Bina seç"
                      error={buildingError || false}
                      disabled={!form.formData.complex_id || filteredBuildings.length === 0}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <CustomInput
                        label="Mərtəbə sayı"
                        type="number"
                        value={form.formData.meta?.total_floor || ""}
                        onChange={(e) => form.updateMeta("total_floor", e.target.value)}
                      />
                      <CustomInput
                        label="Mənzil sayı"
                        type="number"
                        value={form.formData.meta?.total_apartment || ""}
                        onChange={(e) => form.updateMeta("total_apartment", e.target.value)}
                      />
                    </div>
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
