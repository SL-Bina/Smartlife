import React, { useMemo, useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import { CustomInput } from "@/components/ui/CustomInput";
import AsyncSearchSelect from "@/components/ui/AsyncSearchSelect";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import DynamicToast from "@/components/DynamicToast";
import { ResidentExistsModal } from "./ResidentExistsModal";
import mtkAPI from "../../../mtk/api";
import complexesAPI from "../../../complexes/api";
import buildingsAPI from "../../../buildings/api";
import blocksAPI from "../../../blocks/api";
import propertiesAPI from "../../../properties/api";

const ACTIVE_COLOR = "#3b82f6";

const getRgbaColor = (hex, opacity = 1) => {
  if (!hex) return null;
  const hexClean = hex.replace("#", "");
  const r = parseInt(hexClean.substring(0, 2), 16);
  const g = parseInt(hexClean.substring(2, 4), 16);
  const b = parseInt(hexClean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const genderOptions = [
  { value: "male", label: "Kişi" },
  { value: "female", label: "Qadın" },
];

const typeOptions = [
  { value: "owner", label: "Sahib" },
  { value: "tenant", label: "Kirayəçi" },
];

const statusOptions = [
  { value: "active", label: "Aktiv" },
  { value: "inactive", label: "Qeyri-aktiv" },
];

export function ResidentFormModal({
  open,
  mode = "create",
  onClose,
  form,
  onSubmit,
  onEditRequest,
  mtkId = null,
  complexId = null,
  buildingId = null,
  blockId = null,
  propertyId = null,
}) {
  const [saving, setSaving] = useState(false);
  const [existsPrompt, setExistsPrompt] = useState(false);
  const [lastFormData, setLastFormData] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    type: "info",
    message: "",
    title: "",
  });

  const [mtks, setMtks] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [properties, setProperties] = useState([]);

  const [loadingMtks, setLoadingMtks] = useState(false);
  const [loadingComplexes, setLoadingComplexes] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);

  const isEdit = mode === "edit";
  const title = isEdit ? "Sakini Redaktə Et" : "Yeni Sakin Əlavə Et";

  const showToast = (type, message, ttl = "") =>
    setToast({ open: true, type, message, title: ttl });

  const selectedMtkId = form?.formData?.property?.mtk_id || null;
  const selectedComplexId = form?.formData?.property?.complex_id || null;
  const selectedBuildingId = form?.formData?.property?.building_id || null;
  const selectedBlockId = form?.formData?.property?.block_id || null;
  const selectedPropertyId = form?.formData?.property?.property_id || null;

  const selectedMtkLabel = selectedMtkId ? mtks.find((m) => m.id === selectedMtkId)?.name || `MTK #${selectedMtkId}` : "";
  const selectedComplexLabel = selectedComplexId ? complexes.find((c) => c.id === selectedComplexId)?.name || `Kompleks #${selectedComplexId}` : "";
  const selectedBuildingLabel = selectedBuildingId ? buildings.find((b) => b.id === selectedBuildingId)?.name || `Bina #${selectedBuildingId}` : "";
  const selectedBlockLabel = selectedBlockId ? blocks.find((b) => b.id === selectedBlockId)?.name || `Blok #${selectedBlockId}` : "";
  const selectedPropertyLabel = selectedPropertyId ? properties.find((p) => p.id === selectedPropertyId)?.name || properties.find((p) => p.id === selectedPropertyId)?.apartment_number || `Mənzil #${selectedPropertyId}` : "";

  useEffect(() => {
    if (!open || isEdit) return;
    if (mtkId) form?.updateField("property.mtk_id", mtkId);
    if (complexId) form?.updateField("property.complex_id", complexId);
    if (buildingId) form?.updateField("property.building_id", buildingId);
    if (blockId) form?.updateField("property.block_id", blockId);
    if (propertyId) form?.updateField("property.property_id", propertyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isEdit, mtkId, complexId, buildingId, blockId, propertyId]);

  useEffect(() => {
    if (!open) return;
    setLoadingMtks(true);
    mtkAPI.getAll({ per_page: 1000 })
      .then((res) => {
        const data = res?.data?.data?.data || [];
        setMtks(data || []);
      })
      .catch((error) => {
        console.error("Error loading MTKs:", error);
        setMtks([]);
      })
      .finally(() => setLoadingMtks(false));
  }, [open]);

  useEffect(() => {
    if (!open || !selectedMtkId) {
      setComplexes([]);
      return;
    }
    setLoadingComplexes(true);
    complexesAPI.search({ mtk_ids: [selectedMtkId], per_page: 1000 })
      .then((res) => {
        const data = res?.data?.data?.data || [];
        setComplexes(data || []);
      })
      .catch((error) => {
        console.error("Error loading complexes:", error);
        setComplexes([]);
      })
      .finally(() => setLoadingComplexes(false));
  }, [open, selectedMtkId]);

  useEffect(() => {
    if (!open || !selectedComplexId) {
      setBuildings([]);
      return;
    }
    setLoadingBuildings(true);
    buildingsAPI.search({ complex_ids: [selectedComplexId], per_page: 1000 })
      .then((res) => {
        const data = res?.data?.data?.data || [];
        setBuildings(data || []);
      })
      .catch((error) => {
        console.error("Error loading buildings:", error);
        setBuildings([]);
      })
      .finally(() => setLoadingBuildings(false));
  }, [open, selectedComplexId]);

  useEffect(() => {
    if (!open || !selectedBuildingId) {
      setBlocks([]);
      return;
    }
    setLoadingBlocks(true);
    blocksAPI.search({ building_ids: [selectedBuildingId], per_page: 1000 })
      .then((res) => {
        const data = res?.data?.data?.data || [];
        setBlocks(data || []);
      })
      .catch((error) => {
        console.error("Error loading blocks:", error);
        setBlocks([]);
      })
      .finally(() => setLoadingBlocks(false));
  }, [open, selectedBuildingId]);

  useEffect(() => {
    if (!open || !selectedComplexId) {
      setProperties([]);
      return;
    }
    setLoadingProperties(true);
    const payload = { complex_ids: [selectedComplexId], per_page: 1000 };
    if (selectedBuildingId) payload.building_ids = [selectedBuildingId];
    if (selectedBlockId) payload.block_ids = [selectedBlockId];

    propertiesAPI.search(payload)
      .then((res) => {
        const data = res?.data?.data?.data || res?.data?.data?.items || [];
        setProperties(data || []);
      })
      .catch((error) => {
        console.error("Error loading properties:", error);
        setProperties([]);
      })
      .finally(() => setLoadingProperties(false));
  }, [open, selectedComplexId, selectedBuildingId, selectedBlockId]);

  const errorText = useMemo(() => {
    if (!form?.formData?.name?.trim()) return "Ad mütləqdir";
    if (!form?.formData?.surname?.trim()) return "Soyad mütləqdir";

    if (!form?.formData?.property?.mtk_id) return "MTK mütləqdir";
    if (!form?.formData?.property?.complex_id) return "Kompleks mütləqdir";
    if (!form?.formData?.property?.property_id) return "Mənzil mütləqdir";

    return "";
  }, [form?.formData]);

  const handleMtkChange = (value) => {
    const numericValue = value ? Number(value) : null;
    form?.updateField("property.mtk_id", numericValue);
    form?.updateField("property.complex_id", null);
    form?.updateField("property.building_id", null);
    form?.updateField("property.block_id", null);
    form?.updateField("property.property_id", null);
  };

  const handleComplexChange = (value) => {
    const numericValue = value ? Number(value) : null;
    form?.updateField("property.complex_id", numericValue);
    form?.updateField("property.building_id", null);
    form?.updateField("property.block_id", null);
    form?.updateField("property.property_id", null);
  };

  const handleBuildingChange = (value) => {
    const numericValue = value ? Number(value) : null;
    form?.updateField("property.building_id", numericValue);
    form?.updateField("property.block_id", null);
    form?.updateField("property.property_id", null);
  };

  const handleBlockChange = (value) => {
    const numericValue = value ? Number(value) : null;
    form?.updateField("property.block_id", numericValue);
    form?.updateField("property.property_id", null);
  };

  const handlePropertyChange = (value) => {
    const numericValue = value ? Number(value) : null;
    form?.updateField("property.property_id", numericValue);
  };

  const submit = async () => {
    if (errorText) {
      showToast("error", errorText, "Xəta");
      return;
    }

    if (isEdit && onEditRequest) {
      onEditRequest(form.formData);
      return;
    }

    setSaving(true);

    try {
      await onSubmit?.(form.formData);
      showToast("success", "Sakin uğurla yadda saxlanıldı", "Uğurlu");
      onClose?.();
    } catch (e) {
      if (
        e?.status === 426 ||
        e?.code === 426 ||
        e?.response?.status === 426
      ) {
        setLastFormData(form.formData);
        setExistsPrompt(true);
      } else {
        showToast("error", e?.message || "Xəta baş verdi", "Xəta");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBindExists = async (bindExists) => {
    if (!lastFormData) return;

    setSaving(true);
    try {
      await onSubmit({ ...lastFormData, bind_existing: bindExists });
      showToast("success", "Sakin uğurla əlavə edildi", "Uğurlu");
      setExistsPrompt(false);
      setLastFormData(null);
      onClose?.();
    } catch (e) {
      showToast("error", e?.message || "Xəta baş verdi", "Xəta");
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
            background: `linear-gradient(to right, ${getRgbaColor(
              ACTIVE_COLOR,
              0.9
            )}, ${getRgbaColor(ACTIVE_COLOR, 0.7)})`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: getRgbaColor(ACTIVE_COLOR, 0.3) }}
            >
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            <Typography variant="h5" className="text-white font-bold">
              {title}
            </Typography>
          </div>

          <Button
            variant="text"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <DialogBody className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            <div>
              <Typography
                variant="h6"
                className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2"
              >
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: ACTIVE_COLOR }}
                />
                Əsas Məlumatlar
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomInput
                  label="Ad *"
                  value={form?.formData?.name || ""}
                  onChange={(e) => form?.updateField("name", e.target.value)}
                  error={!!form?.errors?.name}
                  helperText={form?.errors?.name}
                />
                <CustomInput
                  label="Soyad *"
                  value={form?.formData?.surname || ""}
                  onChange={(e) => form?.updateField("surname", e.target.value)}
                  error={!!form?.errors?.surname}
                  helperText={form?.errors?.surname}
                />
                <CustomInput
                  label="Ata Adı"
                  value={form?.formData?.meta?.father_name || ""}
                  onChange={(e) =>
                    form?.updateField("meta.father_name", e.target.value)
                  }
                  error={!!form?.errors?.["meta.father_name"]}
                  helperText={form?.errors?.["meta.father_name"]}
                />
              </div>
            </div>

            <div>
              <Typography
                variant="h6"
                className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2"
              >
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: ACTIVE_COLOR }}
                />
                Əlaqə Məlumatları
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  label="E-mail"
                  type="email"
                  value={form?.formData?.email || ""}
                  onChange={(e) => form?.updateField("email", e.target.value)}
                  error={!!form?.errors?.email}
                  helperText={form?.errors?.email}
                />
                <CustomInput
                  label="Telefon"
                  value={form?.formData?.phone || ""}
                  onChange={(e) => form?.updateField("phone", e.target.value)}
                  error={!!form?.errors?.phone}
                  helperText={form?.errors?.phone}
                />
              </div>
            </div>

            <div>
              <Typography
                variant="h6"
                className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2"
              >
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: ACTIVE_COLOR }}
                />
                Şəxsi Məlumatlar
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomSelect
                  label="Cins"
                  value={form?.formData?.meta?.gender || ""}
                  onChange={(value) => form?.updateField("meta.gender", value)}
                  options={genderOptions}
                />
                <CustomInput
                  label="Şəxsi Kod"
                  value={form?.formData?.meta?.personal_code || ""}
                  onChange={(e) =>
                    form?.updateField("meta.personal_code", e.target.value)
                  }
                />
                <CustomInput
                  label="Doğum Tarixi"
                  type="date"
                  value={form?.formData?.meta?.birth_date || ""}
                  onChange={(e) =>
                    form?.updateField("meta.birth_date", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <Typography
                variant="h6"
                className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2"
              >
                <div
                  className="w-1 h-6 rounded-full"
                  style={{ backgroundColor: ACTIVE_COLOR }}
                />
                Tip və Status
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomSelect
                  label="Tip"
                  value={form?.formData?.type || "owner"}
                  onChange={(value) => form?.updateField("type", value)}
                  options={typeOptions}
                />
                <CustomSelect
                  label="Status"
                  value={form?.formData?.status || "active"}
                  onChange={(value) => form?.updateField("status", value)}
                  options={statusOptions}
                />
              </div>
            </div>

            {!isEdit && (
              <div>
                <Typography
                  variant="h6"
                  className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2"
                >
                  <div
                    className="w-1 h-6 rounded-full"
                    style={{ backgroundColor: ACTIVE_COLOR }}
                  />
                  Mənzil Seçimi
                </Typography>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AsyncSearchSelect
                    label="MTK *"
                    value={selectedMtkId || null}
                    selectedLabel={selectedMtkLabel}
                    onChange={handleMtkChange}
                    endpoint="/search/module/mtk"
                    placeholder="MTK seçin"
                    searchPlaceholder="MTK axtar..."
                    error={!!form?.errors?.["property.mtk_id"]}
                    allowClear={false}
                    valueKey="id"
                    labelKey="name"
                    className="w-full"
                  />

                  <AsyncSearchSelect
                    label="Kompleks *"
                    value={selectedComplexId || null}
                    selectedLabel={selectedComplexLabel}
                    onChange={handleComplexChange}
                    endpoint="/search/module/complex"
                    searchParams={{ mtk_ids: selectedMtkId ? [selectedMtkId] : [] }}
                    placeholder="Kompleks seçin"
                    searchPlaceholder="Kompleks axtar..."
                    disabled={!selectedMtkId}
                    error={!!form?.errors?.["property.complex_id"]}
                    allowClear={false}
                    valueKey="id"
                    labelKey="name"
                    className="w-full"
                  />

                  <AsyncSearchSelect
                    label="Bina"
                    value={selectedBuildingId || null}
                    selectedLabel={selectedBuildingLabel}
                    onChange={handleBuildingChange}
                    endpoint="/search/module/building"
                    searchParams={{ complex_ids: selectedComplexId ? [selectedComplexId] : [] }}
                    placeholder="Bina seçin"
                    searchPlaceholder="Bina axtar..."
                    disabled={!selectedComplexId}
                    error={!!form?.errors?.["property.building_id"]}
                    allowClear={false}
                    valueKey="id"
                    labelKey="name"
                    className="w-full"
                  />

                  <AsyncSearchSelect
                    label="Blok"
                    value={selectedBlockId || null}
                    selectedLabel={selectedBlockLabel}
                    onChange={handleBlockChange}
                    endpoint="/search/module/block"
                    searchParams={{ building_ids: selectedBuildingId ? [selectedBuildingId] : [] }}
                    placeholder="Blok seçin"
                    searchPlaceholder="Blok axtar..."
                    disabled={!selectedBuildingId}
                    error={!!form?.errors?.["property.block_id"]}
                    allowClear={false}
                    valueKey="id"
                    labelKey="name"
                    className="w-full"
                  />

                  <div className="md:col-span-2">
                    <AsyncSearchSelect
                      label="Mənzil *"
                      value={selectedPropertyId || null}
                      selectedLabel={selectedPropertyLabel}
                      onChange={handlePropertyChange}
                      endpoint="/search/module/property"
                      searchParams={{
                        complex_ids: selectedComplexId ? [selectedComplexId] : [],
                        building_ids: selectedBuildingId ? [selectedBuildingId] : [],
                        block_ids: selectedBlockId ? [selectedBlockId] : [],
                      }}
                      placeholder="Mənzil seçin"
                      searchPlaceholder="Mənzil axtar..."
                      disabled={!selectedComplexId}
                      error={!!form?.errors?.["property.property_id"]}
                      allowClear={false}
                      valueKey="id"
                      labelKey="name"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
          <Button
            variant="outlined"
            onClick={onClose}
            className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white dark:border-gray-400 dark:text-gray-400"
          >
            Ləğv et
          </Button>

          <Button
            onClick={submit}
            disabled={saving}
            className="text-white"
            style={{ backgroundColor: ACTIVE_COLOR }}
          >
            {saving ? "Yadda saxlanılır..." : isEdit ? "Yenilə" : "Əlavə et"}
          </Button>
        </DialogFooter>
      </Dialog>

      <ResidentExistsModal
        open={existsPrompt}
        onClose={() => {
          setExistsPrompt(false);
          setLastFormData(null);
        }}
        onChoose={handleBindExists}
        saving={saving}
      />

      <DynamicToast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        title={toast.title}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
      />
    </>
  );
}