import React, { useState, useEffect, useMemo, useRef } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon, UserIcon } from "@heroicons/react/24/outline";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import DynamicToast from "@/components/DynamicToast";
import { useAppSelector } from "@/store/hooks";
import propertyLookupsAPI from "../../../properties/api/lookups";
import propertiesAPI from "../../../properties/api/index";
import mtkAPI from "../../../mtk/api";
import complexesAPI from "../../../complexes/api";

const ACTIVE_COLOR = "#3b82f6";

export function ResidentFormModal({
  open,
  mode = "create",
  onClose,
  form,
  onSubmit
}) {
  // Redux-dan filter ID-ləri al
  const mtkId = useAppSelector((state) => state.mtk.selectedMtkId);
  const complexId = useAppSelector((state) => state.complex.selectedComplexId);
  const buildingId = useAppSelector((state) => state.building.selectedBuildingId);
  const blockId = useAppSelector((state) => state.block.selectedBlockId);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });
  const [mtks, setMtks] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(false);
  const [loadingComplexes, setLoadingComplexes] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);
  
  const PER_PAGE = 30;
  
  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const isEdit = mode === "edit";
  const title = isEdit ? "Sakini Redaktə Et" : "Yeni Sakin Əlavə Et";

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

  const formMtkId = form?.formData?.property?.mtk_id;
  const formComplexId = form?.formData?.property?.complex_id;

  useEffect(() => {
    if (open) {
      setLoadingLookups(true);
      mtkAPI.getAll({ per_page: 1000 })
        .then((res) => {
          const data = res?.data?.data?.data || [];
          setMtks(data || []);
        })
        .catch((error) => {
          console.error("Error loading MTKs:", error);
          setMtks([]);
        })
        .finally(() => {
          setLoadingLookups(false);
        });
    }
  }, [open]);

  useEffect(() => {
    if (open && mode === "create" && mtkId && mtks.length > 0 && !form?.formData?.property?.mtk_id) {
      form?.updateField("property.mtk_id", mtkId);
    }
  }, [open, mode, mtkId, mtks.length, form]);

  useEffect(() => {
    if (open && mode === "create" && complexId && complexes.length > 0 && !form?.formData?.property?.complex_id) {
      form?.updateField("property.complex_id", complexId);
    }
  }, [open, mode, complexId, complexes.length, form]);

  useEffect(() => {
    if (open && formMtkId) {
      setLoadingComplexes(true);
      // Use search endpoint for complexes like ManagementActions
      complexesAPI.search({ 
        mtk_ids: [formMtkId],
        per_page: 1000 
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
    } else if (open && !formMtkId) {
      setComplexes([]);
    }
  }, [open, formMtkId]);

  // Load properties when complex changes
  useEffect(() => {
    if (open && formComplexId) {
      setLoadingProperties(true);
      console.log("Loading properties for complex:", formComplexId);
      // Use search endpoint for properties like ManagementActions
      propertiesAPI.search({ 
        complex_ids: [formComplexId], 
        per_page: 1000 
      })
        .then((response) => {
          console.log("Properties loaded:", response);
          const data = response?.data?.data?.data || [];
          setProperties(data);
        })
        .catch((error) => {
          console.error("Error loading properties:", error);
          setProperties([]);
        })
        .finally(() => setLoadingProperties(false));
    } else if (open && !formComplexId) {
      setProperties([]);
    }
  }, [open, formComplexId]);

  const errorText = useMemo(() => {
    if (!form?.formData?.name?.trim()) return "Ad mütləqdir";
    if (!form?.formData?.surname?.trim()) return "Soyad mütləqdir";
    if (!form?.formData?.property?.mtk_id) return "MTK mütləqdir";
    if (!form?.formData?.property?.complex_id) return "Kompleks mütləqdir";
    if (!form?.formData?.property?.property_id) return "Mənzil mütləqdir";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errorText) {
      showToast("error", errorText, "Xəta");
      return;
    }
    setSaving(true);
    try {
      await onSubmit(form.formData);
      showToast("success", mode === "create" ? "Sakin uğurla əlavə edildi" : "Sakin uğurla yeniləndi", "Uğurlu");
      onClose();
    } catch (error) {
      showToast("error", error.message || "Xəta baş verdi", "Xəta");
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
        style={{ zIndex: 9999 }}
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
            className="text-white hover:bg-white/20 rounded-full relative z-10"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <DialogBody className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-6">
              <div>
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                  <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
                  Əsas Məlumatlar
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CustomInput
                    label="Ad *"
                    value={form.formData.name || ""}
                    onChange={(e) => form.updateField("name", e.target.value)}
                    error={form.errors?.name}
                  />
                  <CustomInput
                    label="Soyad *"
                    value={form.formData.surname || ""}
                    onChange={(e) => form.updateField("surname", e.target.value)}
                    error={form.errors?.surname}
                  />
                  <CustomInput
                    label="Ata Adı"
                    value={form.formData.father_name || ""}
                    onChange={(e) => form.updateField("father_name", e.target.value)}
                    error={form.errors?.father_name}
                  />
                </div>
              </div>

              <div>
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                  <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
                  Əlaqə Məlumatları
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    label="E-mail"
                    type="email"
                    value={form.formData.email || ""}
                    onChange={(e) => form.updateField("email", e.target.value)}
                    error={form.errors?.email}
                  />
                  <CustomInput
                    label="Telefon"
                    value={form.formData.phone || ""}
                    onChange={(e) => form.updateField("phone", e.target.value)}
                    error={form.errors?.phone}
                  />
                </div>
              </div>

              <div>
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                  <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
                  Şəxsi Məlumatlar
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CustomSelect
                    label="Cins"
                    value={form.formData.meta?.gender || ""}
                    onChange={(value) => form.updateField("meta.gender", value)}
                    options={genderOptions}
                  />
                  <CustomInput
                    label="Şəxsi Kod"
                    value={form.formData.meta?.personal_code || ""}
                    onChange={(e) => form.updateField("meta.personal_code", e.target.value)}
                  />
                  <CustomInput
                    label="Doğum Tarixi"
                    type="date"
                    value={form.formData.meta?.birth_date || ""}
                    onChange={(e) => form.updateField("meta.birth_date", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                  <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
                  Tip və Status
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomSelect
                    label="Tip"
                    value={form.formData.type || "owner"}
                    onChange={(value) => form.updateField("type", value)}
                    options={typeOptions}
                  />
                  <CustomSelect
                    label="Status"
                    value={form.formData.status || "active"}
                    onChange={(value) => form.updateField("status", value)}
                    options={statusOptions}
                  />
                </div>
              </div>

              <div>
                <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                  <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
                  Mənzil Seçimi
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CustomSelect
                    label="MTK *"
                    value={form.formData.property?.mtk_id ? String(form.formData.property.mtk_id) : ""}
                    onChange={(value) => {
                      form.updateField("property.mtk_id", value ? Number(value) : null);
                      form.updateField("property.complex_id", null);
                      form.updateField("property.property_id", null);
                      setComplexes([]);
                      setProperties([]);
                    }}
                    options={mtks.map(mtk => ({ value: String(mtk.id), label: mtk.name }))}
                    disabled={loadingLookups}
                    loading={loadingLookups}
                    error={form.errors?.property?.mtk_id}
                  />
                  <CustomSelect
                    label="Kompleks *"
                    value={form.formData.property?.complex_id ? String(form.formData.property.complex_id) : ""}
                    onChange={(value) => {
                      form.updateField("property.complex_id", value ? Number(value) : null);
                      form.updateField("property.property_id", null);
                    }}
                    options={complexes.map(complex => ({ value: String(complex.id), label: complex.name }))}
                    disabled={loadingComplexes || !form.formData.property?.mtk_id}
                    loading={loadingComplexes}
                    error={form.errors?.property?.complex_id}
                  />
                  <CustomSelect
                    label="Mənzil *"
                    value={form.formData.property?.property_id ? String(form.formData.property.property_id) : ""}
                    onChange={(value) => {
                      console.log("Property selected:", value);
                      form.updateField("property.property_id", value ? Number(value) : null);
                    }}
                    options={[
                      { value: "", label: "-- Mənzil seçin --" },
                      ...properties.map((p) => ({
                        value: String(p.id),
                        label: `${p.sub_data?.building?.name || 'Bina'} | ${p.sub_data?.block?.name || 'Blok'} | ${p.name || p.meta?.apartment_number || `Mənzil #${p.id}`}`,
                      })),
                    ]}
                    loading={loadingProperties}
                    disabled={loadingProperties || !form.formData.property?.complex_id}
                    placeholder="Mənzil seçin"
                    error={!!form.errors?.property?.property_id}
                    helperText={form.errors?.property?.property_id}
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
              type="submit"
              disabled={saving || !!errorText}
              className="text-white"
              style={{ backgroundColor: ACTIVE_COLOR }}
            >
              {saving ? "Yadda saxlanılır..." : isEdit ? "Yenilə" : "Əlavə et"}
            </Button>
          </DialogFooter>
        </form>
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
