import React, { useMemo, useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { HomeIcon, XMarkIcon } from "@heroicons/react/24/outline";
import DynamicToast from "@/components/DynamicToast";
import propertyLookupsAPI from "../../api/lookups";
import mtkAPI from "../../../mtk/api";
import complexesAPI from "../../../complexes/api";
import buildingsAPI from "../../../buildings/api";
import blocksAPI from "../../../blocks/api";

const ACTIVE_COLOR = "#14b8a6";

const getRgbaColor = (hex, opacity = 1) => {
  if (!hex) return null;
  const hexClean = hex.replace("#", "");
  const r = parseInt(hexClean.substring(0, 2), 16);
  const g = parseInt(hexClean.substring(2, 4), 16);
  const b = parseInt(hexClean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const statusOptions = [
  { value: "active", label: "Aktiv" },
  { value: "inactive", label: "Qeyri-aktiv" },
];

export function PropertyFormModal({
  open,
  mode = "create",
  onClose,
  form,
  onSubmit,
  mtkId = null,
  complexId = null,
  buildingId = null,
  blockId = null,
}) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const [mtks, setMtks] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [loadingMtks, setLoadingMtks] = useState(false);
  const [loadingComplexes, setLoadingComplexes] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);

  const isEdit = mode === "edit";
  const title = isEdit ? "Mənzil Redaktə et" : "Yeni Mənzil Əlavə Et";

  const showToast = (type, message, ttl = "") =>
    setToast({ open: true, type, message, title: ttl });
  useEffect(() => {
    if (!open || isEdit) return;
    if (mtkId) form?.updateField("mtk_id", mtkId);
    if (complexId) form?.updateField("complex_id", complexId);
    if (buildingId) form?.updateField("building_id", buildingId);
    if (blockId) form?.updateField("block_id", blockId);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    setLoadingMtks(true);
    propertyLookupsAPI.getMtks()
      .then((data) => setMtks(data || []))
      .catch(console.error)
      .finally(() => setLoadingMtks(false));
  }, [open]);
  useEffect(() => {
    if (!open) return;
    setLoadingTypes(true);
    propertyLookupsAPI.getPropertyTypes()
      .then((data) => setPropertyTypes(data || []))
      .catch(console.error)
      .finally(() => setLoadingTypes(false));
  }, [open]);
  useEffect(() => {
    if (!open || !form?.formData?.mtk_id) {
      setComplexes([]);
      return;
    }
    setLoadingComplexes(true);
    complexesAPI.search({
      mtk_ids: [form.formData.mtk_id],
      per_page: 1000,
    })
      .then((res) => {
        const data = res?.data?.data?.data || [];
        setComplexes(data || []);
      })
      .catch((error) => {
        console.error("Error loading complexes:", error);
        setComplexes([]);
      })
      .finally(() => {
        setLoadingComplexes(false);
      });
  }, [open, form?.formData?.mtk_id]);
  useEffect(() => {
    if (!open || !form?.formData?.complex_id) {
      setBuildings([]);
      return;
    }
    setLoadingBuildings(true);
    buildingsAPI.search({
      complex_ids: [form.formData.complex_id],
      per_page: 1000,
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
  }, [open, form?.formData?.complex_id]);
  useEffect(() => {
    if (!open || !form?.formData?.building_id) {
      setBlocks([]);
      return;
    }
    setLoadingBlocks(true);
    blocksAPI.search({
      building_ids: [form.formData.building_id],
      per_page: 1000,
    })
      .then((res) => {
        const data = res?.data?.data?.data || [];
        setBlocks(data || []);
      })
      .catch((error) => {
        console.error("Error loading blocks:", error);
        setBlocks([]);
      })
      .finally(() => {
        setLoadingBlocks(false);
      });
  }, [open, form?.formData?.building_id]);

  const errorText = useMemo(() => {
    if (!form?.formData?.name?.trim()) return "Ad mütləqdir";

    if (!form?.formData?.property_type) return "Mənzil tipi mütləqdir";
    return "";
  }, [form?.formData]);

  const submit = async () => {
    if (errorText) {
      showToast("error", errorText, "Xəta");
      return;
    }
    setSaving(true);
    
    // Debug log to check if submit is being called
    console.log("PropertyFormModal submit called:", {
      isEdit,
      formData: form.formData,
      mode
    });
    
    try {
      if (isEdit) {
        // Edit mode - send update request
        console.log("Sending update request with data:", form.formData);
        await onSubmit?.(form.formData, true); // Pass true for edit mode
      } else {
        // Create mode - send create request
        console.log("Sending create request with data:", form.formData);
        await onSubmit?.(form.formData, false); // Pass false for create mode
      }
      onClose?.();
    } catch (e) {
      console.error("Submit error:", e);
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
            background: `linear-gradient(to right, ${getRgbaColor(ACTIVE_COLOR, 0.9)}, ${getRgbaColor(ACTIVE_COLOR, 0.7)})`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
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
            className="text-white hover:bg-white/20 rounded-full"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <DialogBody className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">

            {/* Əsas Məlumatlar */}
            <div>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }} />
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

            {/* Seçimlər - hər biri müstəqil */}
            <div>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }} />
                Seçimlər
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomSelect
                  label="MTK *"
                  value={form?.formData?.mtk_id ? String(form.formData.mtk_id) : ""}
                  onChange={(value) => form?.updateField("mtk_id", value ? Number(value) : null)}
                  options={mtks.map((m) => ({ value: String(m.id), label: m.name }))}
                  loading={loadingMtks}
                  disabled={loadingMtks }
                  placeholder="MTK seçin"
                  error={!!form?.errors?.mtk_id}
                />
                <CustomSelect
                  label="Complex *"
                  value={form?.formData?.complex_id ? String(form.formData.complex_id) : ""}
                  onChange={(value) => form?.updateField("complex_id", value ? Number(value) : null)}
                  options={complexes.map((c) => ({ value: String(c.id), label: c.name }))}
                  loading={loadingComplexes}
                  disabled={loadingComplexes }
                  placeholder="Complex seçin"
                  error={!!form?.errors?.complex_id}
                />
                <CustomSelect
                  label="Building *"
                  value={form?.formData?.building_id ? String(form.formData.building_id) : ""}
                  onChange={(value) => form?.updateField("building_id", value ? Number(value) : null)}
                  options={buildings.map((b) => ({ value: String(b.id), label: b.name }))}
                  loading={loadingBuildings}
                  disabled={loadingBuildings }
                  placeholder="Building seçin"
                  error={!!form?.errors?.building_id}
                />
                <CustomSelect
                  label="Block *"
                  value={form?.formData?.block_id ? String(form.formData.block_id) : ""}
                  onChange={(value) => form?.updateField("block_id", value ? Number(value) : null)}
                  options={blocks.map((b) => ({ value: String(b.id), label: b.name }))}
                  loading={loadingBlocks}
                  disabled={loadingBlocks }
                  placeholder="Block seçin"
                  error={!!form?.errors?.block_id}
                />
              </div>
              <div className="mt-4">
                <CustomSelect
                  label="Mənzil Tipi *"
                  value={form?.formData?.property_type ? String(form.formData.property_type) : ""}
                  onChange={(value) => form?.updateField("property_type", value ? Number(value) : null)}
                  options={propertyTypes.map((t) => ({
                    value: String(t.id),
                    label: t.name || `Tip #${t.id}`,
                  }))}
                  loading={loadingTypes}
                  disabled={loadingTypes}
                  placeholder="Tip seçin"
                  error={!!form?.errors?.property_type}
                />
              </div>
            </div>

            {/* Meta Məlumatlar */}
            <div>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }} />
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