import React, { useEffect, useMemo, useState } from "react";
import { CustomDialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/CustomDialog";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomCard, CardBody } from "@/components/ui/CustomCard";
import { CustomTypography } from "@/components/ui/CustomTypography";
import { useManagementEnhanced } from "@/store/exports";
import {
  HomeIcon,
  XMarkIcon,
  BuildingStorefrontIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export function PropertiesFormModal({
  open,
  mode = "create",
  onClose,
  form,
  onSubmit,
  complexes = [],
  buildings = [],
  blocks = [],
  mtks = [],
  loadingMtks = false,
  loadingComplexes = false,
  loadingBuildings = false,
  loadingBlocks = false,
}) {
  const { state } = useManagementEnhanced();
  const [saving, setSaving] = useState(false);
  const [filteredComplexes, setFilteredComplexes] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [filteredBlocks, setFilteredBlocks] = useState([]);
  const isEdit = mode === "edit";

  const title = isEdit ? "Mənzil Redaktə et" : "Yeni Mənzil yarat";

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

  // Blocks-ləri Building-ə görə filter et
  useEffect(() => {
    if (!form?.formData?.building_id) {
      setFilteredBlocks([]);
      if (form?.formData?.block_id) {
        form.updateField("block_id", null);
      }
      return;
    }

    if (!blocks || blocks.length === 0) {
      setFilteredBlocks([]);
      return;
    }

    const buildingId = form.formData.building_id;
    
    const filtered = blocks.filter((bl) => {
      // API response-dan: block.building.id və ya block.building_id
      const buildingIdFromBlock = bl?.building?.id ?? bl?.building_id ?? null;
      const matches = String(buildingIdFromBlock || "") === String(buildingId);
      return matches;
    });

    setFilteredBlocks(filtered);

    if (form.formData.block_id) {
      const currentBlock = filtered.find((bl) => String(bl.id) === String(form.formData.block_id));
      if (!currentBlock) {
        form.updateField("block_id", null);
      }
    }
  }, [blocks, form?.formData?.building_id, form]);

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

    // Block default
    if (!form.formData.block_id && state.blockId) {
      form.updateField("block_id", state.blockId);
    } else if (!form.formData.block_id && filteredBlocks.length > 0) {
      form.updateField("block_id", filteredBlocks[0].id);
    }
  }, [open, form, state.mtkId, state.complexId, state.buildingId, state.blockId, mtks, filteredComplexes, filteredBuildings, filteredBlocks]);

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

  const blockError = useMemo(() => {
    if (!form?.formData?.block_id) return "Blok seçilməlidir";
    return "";
  }, [form?.formData?.block_id]);

  const apartmentNumberError = useMemo(() => {
    if (!form?.formData?.meta?.apartment_number) return "Mənzil nömrəsi mütləqdir";
    return "";
  }, [form?.formData?.meta?.apartment_number]);

  const floorError = useMemo(() => {
    if (!form?.formData?.meta?.floor) return "Mərtəbə mütləqdir";
    return "";
  }, [form?.formData?.meta?.floor]);

  const areaError = useMemo(() => {
    if (!form?.formData?.meta?.area) return "Sahə mütləqdir";
    return "";
  }, [form?.formData?.meta?.area]);

  const errorText = useMemo(() => {
    if (nameError) return nameError;
    if (mtkError) return mtkError;
    if (complexError) return complexError;
    if (buildingError) return buildingError;
    if (blockError) return blockError;
    if (apartmentNumberError) return apartmentNumberError;
    if (floorError) return floorError;
    if (areaError) return areaError;
    return "";
  }, [nameError, mtkError, complexError, buildingError, blockError, apartmentNumberError, floorError, areaError]);

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

  const statusOptions = [
    { value: "active", label: "Aktiv" },
    { value: "inactive", label: "Qeyri-aktiv" },
  ];

  const propertyTypeOptions = [
    { value: 1, label: "Mənzil" },
  ];

  return (
    <>
      <CustomDialog open={!!open} onClose={onClose} size="xl">
        <DialogHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-white/20 rounded-lg">
              <HomeIcon className="h-6 w-6" />
            </div>
            <div>
              <CustomTypography variant="h5" className="font-bold text-white">
                {title}
              </CustomTypography>
              <CustomTypography variant="small" className="text-indigo-100 font-normal">
                {isEdit ? "Mənzil məlumatlarını yeniləyin" : "Yeni mənzil üçün məlumatları doldurun"}
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
                          Mənzil adı <span className="text-red-500">*</span>
                        </>
                      }
                      value={form.formData.name || ""}
                      onChange={(e) => form.updateField("name", e.target.value)}
                      error={nameError || false}
                      icon={<HomeIcon className="h-5 w-5" />}
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
                        // MTK dəyişəndə complex, building və block seçimini sıfırla
                        form.updateField("complex_id", null);
                        form.updateField("building_id", null);
                        form.updateField("block_id", null);
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
                        // Complex dəyişəndə building və block seçimini sıfırla
                        form.updateField("building_id", null);
                        form.updateField("block_id", null);
                      }}
                      options={filteredComplexes.map((c) => ({ value: c.id, label: c.name }))}
                      placeholder="Kompleks seç"
                      error={complexError || false}
                      disabled={!form.formData.mtk_id || filteredComplexes.length === 0}
                      icon={<BuildingStorefrontIcon className="h-5 w-5" />}
                    />

                    <CustomSelect
                      label={
                        <>
                          Bina <span className="text-red-500">*</span>
                        </>
                      }
                      value={form.formData.building_id}
                      onChange={(value) => {
                        const newBuildingId = value ? Number(value) : null;
                        form.updateField("building_id", newBuildingId);
                        // Building dəyişəndə block seçimini sıfırla
                        form.updateField("block_id", null);
                      }}
                      options={filteredBuildings.map((b) => ({ value: b.id, label: b.name }))}
                      placeholder="Bina seç"
                      error={buildingError || false}
                      disabled={!form.formData.complex_id || filteredBuildings.length === 0}
                      icon={<BuildingOfficeIcon className="h-5 w-5" />}
                    />

                    <CustomSelect
                      label={
                        <>
                          Blok <span className="text-red-500">*</span>
                        </>
                      }
                      value={form.formData.block_id}
                      onChange={(value) => {
                        const newBlockId = value ? Number(value) : null;
                        form.updateField("block_id", newBlockId);
                      }}
                      options={filteredBlocks.map((bl) => ({ value: bl.id, label: bl.name || `Block ${bl.id}` }))}
                      placeholder={loadingBlocks ? "Yüklənir..." : filteredBlocks.length === 0 ? "Blok tapılmadı" : "Blok seç"}
                      error={blockError || false}
                      disabled={!form.formData.building_id || loadingBlocks || filteredBlocks.length === 0}
                    />

                    <CustomSelect
                      label="Status"
                      value={form.formData.status || "active"}
                      onChange={(value) => form.updateField("status", value)}
                      options={statusOptions}
                      placeholder="Status seç"
                    />
                  </div>
                </CardBody>
              </CustomCard>

              {/* Meta Information */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    Mənzil məlumatları
                  </CustomTypography>
                  <div className="flex flex-col gap-4">
                    <CustomInput
                      label={
                        <>
                          Mənzil nömrəsi <span className="text-red-500">*</span>
                        </>
                      }
                      type="number"
                      value={form.formData.meta?.apartment_number || ""}
                      onChange={(e) => form.updateMeta("apartment_number", e.target.value)}
                      error={apartmentNumberError || false}
                    />

                    <CustomInput
                      label={
                        <>
                          Mərtəbə <span className="text-red-500">*</span>
                        </>
                      }
                      type="number"
                      value={form.formData.meta?.floor || ""}
                      onChange={(e) => form.updateMeta("floor", e.target.value)}
                      error={floorError || false}
                    />

                    <CustomInput
                      label={
                        <>
                          Sahə (m²) <span className="text-red-500">*</span>
                        </>
                      }
                      type="number"
                      value={form.formData.meta?.area || ""}
                      onChange={(e) => form.updateMeta("area", e.target.value)}
                      error={areaError || false}
                    />

                    <CustomSelect
                      label="Mənzil tipi"
                      value={form.formData.property_type || 1}
                      onChange={(value) => form.updateField("property_type", value ? Number(value) : 1)}
                      options={propertyTypeOptions}
                      placeholder="Mənzil tipi seç"
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
