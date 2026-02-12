import React, { useEffect, useMemo, useState } from "react";
import { CustomDialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/CustomDialog";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomTextarea } from "@/components/ui/CustomTextarea";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomCard, CardBody } from "@/components/ui/CustomCard";
import { CustomTypography } from "@/components/ui/CustomTypography";
import AdvancedColorPicker from "@/components/ui/AdvancedColorPicker";
import MapPicker from "@/components/ui/MapPicker";
import { useManagementEnhanced, useMtkColor } from "@/store/exports";
import {
  BuildingOffice2Icon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  XMarkIcon,
  MapIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// Leaflet marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function LocationMarker({ position, onPositionChange }) {
  const [markerPosition, setMarkerPosition] = useState(position || [40.4093, 49.8671]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const newPos = [lat, lng];
      setMarkerPosition(newPos);
      onPositionChange?.(lat, lng);
    },
  });

  useEffect(() => {
    if (position && Array.isArray(position) && position.length === 2) {
      setMarkerPosition(position);
    }
  }, [position]);

  return <Marker position={markerPosition} />;
}

export function ComplexFormModal({ open, mode = "create", onClose, form, onSubmit, mtks = [] }) {
  const { state, actions } = useManagementEnhanced();
  const { colorCode, getRgba, defaultColor } = useMtkColor();
  const [saving, setSaving] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapPosition, setMapPosition] = useState([40.4093, 49.8671]);
  const isEdit = mode === "edit";

  const title = isEdit ? "Kompleks Redaktə et" : "Yeni Kompleks yarat";
  
  // Default göz yormayan qırmızı ton
  const defaultRed = "#dc2626";
  const activeColor = colorCode || defaultColor || defaultRed;

  const statusOptions = [
    { value: "active", label: "Aktiv" },
    { value: "inactive", label: "Qeyri-aktiv" },
  ];

  // modal açılarkən mtk_id context-dən götür (yalnız create modunda)
  useEffect(() => {
    if (!open) return;
    if (!form) return;
    
    // Edit modunda form-da artıq MTK varsa, heç nə etmə
    if (isEdit && form.formData.mtk_id) return;

    // Create modunda: context-dən MTK götür və form-a yaz
    if (!isEdit) {
      if (state.mtkId) {
        form.updateField("mtk_id", state.mtkId);
      } else if (mtks.length > 0) {
        // Context-də MTK yoxdursa, birinci MTK-nı seç və context-ə yaz
        const firstMtk = mtks[0];
        form.updateField("mtk_id", firstMtk.id);
        actions.setMtk(firstMtk.id, firstMtk);
      }
    }
  }, [open, form, state.mtkId, mtks, isEdit, actions]);

  // Map position update
  useEffect(() => {
    if (form?.formData?.meta?.lat && form?.formData?.meta?.lng) {
      const lat = parseFloat(form.formData.meta.lat);
      const lng = parseFloat(form.formData.meta.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapPosition([lat, lng]);
      }
    }
  }, [form?.formData?.meta?.lat, form?.formData?.meta?.lng]);

  const nameError = useMemo(() => {
    if (!form?.formData?.name?.trim()) return "Ad mütləqdir";
    return "";
  }, [form?.formData?.name]);

  const mtkError = useMemo(() => {
    // Context-dən və ya form-dan MTK yoxlanılır
    const currentMtkId = state.mtkId || form?.formData?.mtk_id;
    if (!currentMtkId) return "MTK seçilməlidir";
    return "";
  }, [state.mtkId, form?.formData?.mtk_id]);

  const latError = useMemo(() => {
    if (!form?.formData?.meta?.lat?.trim()) return "Latitude mütləqdir";
    return "";
  }, [form?.formData?.meta?.lat]);

  const lngError = useMemo(() => {
    if (!form?.formData?.meta?.lng?.trim()) return "Longitude mütləqdir";
    return "";
  }, [form?.formData?.meta?.lng]);

  const descError = useMemo(() => {
    if (!form?.formData?.meta?.desc?.trim()) return "Təsvir mütləqdir";
    return "";
  }, [form?.formData?.meta?.desc]);

  const addressError = useMemo(() => {
    if (!form?.formData?.meta?.address?.trim()) return "Ünvan mütləqdir";
    return "";
  }, [form?.formData?.meta?.address]);

  const colorCodeError = useMemo(() => {
    if (!form?.formData?.meta?.color_code?.trim()) return "Rəng kodu mütləqdir";
    return "";
  }, [form?.formData?.meta?.color_code]);

  const phoneError = useMemo(() => {
    if (!form?.formData?.meta?.phone?.trim()) return "Telefon mütləqdir";
    return "";
  }, [form?.formData?.meta?.phone]);

  const emailError = useMemo(() => {
    if (!form?.formData?.meta?.email?.trim()) return "Email mütləqdir";
    return "";
  }, [form?.formData?.meta?.email]);

  const websiteError = useMemo(() => {
    if (!form?.formData?.meta?.website?.trim()) return "Veb sayt mütləqdir";
    return "";
  }, [form?.formData?.meta?.website]);

  const errorText = useMemo(() => {
    if (nameError) return nameError;
    if (mtkError) return mtkError;
    if (latError) return latError;
    if (lngError) return lngError;
    if (descError) return descError;
    if (addressError) return addressError;
    if (colorCodeError) return colorCodeError;
    if (phoneError) return phoneError;
    if (emailError) return emailError;
    if (websiteError) return websiteError;
    return "";
  }, [nameError, mtkError, latError, lngError, descError, addressError, colorCodeError, phoneError, emailError, websiteError]);

  const handleMapClick = (lat, lng) => {
    form.updateMeta("lat", String(lat));
    form.updateMeta("lng", String(lng));
    setMapPosition([lat, lng]);
  };

  const handleManualCoordinateInput = () => {
    const lat = parseFloat(form?.formData?.meta?.lat);
    const lng = parseFloat(form?.formData?.meta?.lng);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      setMapPosition([lat, lng]);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        form.updateMeta("lat", String(lat));
        form.updateMeta("lng", String(lng));
        setMapPosition([lat, lng]);
        setShowMap(true);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const submit = async () => {
    if (errorText) return;
    setSaving(true);
    try {
      // Context-dən MTK-nı form-a yaz (əgər form-da yoxdursa)
      const payload = {
        ...form.formData,
        mtk_id: state.mtkId || form.formData.mtk_id,
      };
      await onSubmit?.(payload);
      onClose?.();
    } finally {
      setSaving(false);
    }
  };

  const hasCoordinates = form?.formData?.meta?.lat && form?.formData?.meta?.lng;

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
                {isEdit ? "Kompleks məlumatlarını yeniləyin" : "Yeni kompleks üçün məlumatları doldurun"}
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
                          Kompleks adı <span className="text-red-500">*</span>
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
                      value={state.mtkId || form.formData.mtk_id}
                      onChange={(value) => {
                        const newMtkId = value ? Number(value) : null;
                        const selectedMtk = mtks.find((m) => m.id === newMtkId);
                        
                        // Context-ə yaz (bu hər yerdə görünəcək)
                        actions.setMtk(newMtkId, selectedMtk || null);
                        
                        // Form-a da yaz
                        form.updateField("mtk_id", newMtkId);
                        
                        // MTK dəyişəndə (yalnız create modunda) form-u təmizlə
                        if (!isEdit && (state.mtkId || form.formData.mtk_id) !== newMtkId) {
                          form.updateField("name", "");
                          form.updateField("status", "active");
                          form.updateMeta("lat", "");
                          form.updateMeta("lng", "");
                          form.updateMeta("desc", "");
                          form.updateMeta("address", "");
                          form.updateMeta("phone", "");
                          form.updateMeta("email", "");
                          form.updateMeta("website", "");
                          form.updateMeta("color_code", "");
                          form.updateField("modules", [1, 2]);
                          form.updateField("avaliable_modules", [1, 2]);
                        }
                      }}
                      options={mtks.map((m) => ({ value: m.id, label: m.name }))}
                      placeholder="MTK seç"
                      error={mtkError || false}
                    />

                    <CustomSelect
                      label="Status"
                      value={form.formData.status || "active"}
                      onChange={(value) => form.updateField("status", value)}
                      options={statusOptions}
                      placeholder="Status seç"
                    />

                    <CustomTextarea
                      label={
                        <>
                          Təsvir <span className="text-red-500">*</span>
                        </>
                      }
                      value={form.formData.meta?.desc || ""}
                      onChange={(e) => form.updateMeta("desc", e.target.value)}
                      rows={4}
                      icon={<DocumentTextIcon className="h-5 w-5" />}
                      error={descError || false}
                    />
                  </div>
                </CardBody>
              </CustomCard>

              {/* Contact Information */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    Əlaqə məlumatları
                  </CustomTypography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomInput
                      label={
                        <>
                          Email <span className="text-red-500">*</span>
                        </>
                      }
                      type="email"
                      value={form.formData.meta?.email || ""}
                      onChange={(e) => form.updateMeta("email", e.target.value)}
                      icon={<EnvelopeIcon className="h-5 w-5" />}
                      error={emailError || false}
                    />
                    <CustomInput
                      label={
                        <>
                          Telefon <span className="text-red-500">*</span>
                        </>
                      }
                      type="tel"
                      value={form.formData.meta?.phone || ""}
                      onChange={(e) => form.updateMeta("phone", e.target.value)}
                      icon={<PhoneIcon className="h-5 w-5" />}
                      error={phoneError || false}
                    />
                  </div>
                </CardBody>
              </CustomCard>

              {/* Other Information */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    Digər məlumatlar
                  </CustomTypography>
                  <div className="flex flex-col gap-4">
                    <CustomInput
                      label={
                        <>
                          Veb sayt <span className="text-red-500">*</span>
                        </>
                      }
                      type="url"
                      value={form.formData.meta?.website || ""}
                      onChange={(e) => form.updateMeta("website", e.target.value)}
                      icon={<GlobeAltIcon className="h-5 w-5" />}
                      placeholder="https://example.com"
                      error={websiteError || false}
                    />

                    <div className="flex flex-col gap-2">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Rəng kodu <span className="text-red-500">*</span>
                        </label>
                        <AdvancedColorPicker
                          value={form.formData.meta?.color_code || ""}
                          onChange={(color) => form.updateMeta("color_code", color)}
                          label=""
                        />
                      </div>
                      {colorCodeError && (
                        <span className="text-xs text-red-500">{colorCodeError}</span>
                      )}
                    </div>
                  </div>
                </CardBody>
              </CustomCard>

              {/* Location Information */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    Ünvan
                  </CustomTypography>
                  <CustomInput
                    label={
                      <>
                        Ünvan <span className="text-red-500">*</span>
                      </>
                    }
                    value={form.formData.meta?.address || ""}
                    onChange={(e) => form.updateMeta("address", e.target.value)}
                    icon={<MapPinIcon className="h-5 w-5" />}
                    error={addressError || false}
                  />
                </CardBody>
              </CustomCard>

              {/* Coordinates */}
              <CustomCard>
                <CardBody>
                  <div className="flex items-center justify-between mb-4">
                    <CustomTypography variant="h6" className="text-gray-900 dark:text-white font-semibold">
                      Koordinatlar
                    </CustomTypography>
                    <div className="flex items-center gap-2">
                      <CustomButton
                        type="button"
                        variant="outlined"
                        size="sm"
                        color="green"
                        onClick={handleGetCurrentLocation}
                        className="flex items-center gap-2"
                      >
                        <MapIcon className="h-4 w-4" />
                        Cari yer
                      </CustomButton>
                      <CustomButton
                        type="button"
                        variant="outlined"
                        size="sm"
                        color="blue"
                        onClick={() => setShowMap(!showMap)}
                        className="flex items-center gap-2"
                      >
                        <MapPinIcon className="h-4 w-4" />
                        {showMap ? "Xəritəni gizlət" : "Xəritəni göstər"}
                        {showMap ? (
                          <ChevronUpIcon className="h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4" />
                        )}
                      </CustomButton>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomInput
                      label={
                        <>
                          Latitude <span className="text-red-500">*</span>
                        </>
                      }
                      value={form.formData.meta?.lat || ""}
                      onChange={(e) => {
                        form.updateMeta("lat", e.target.value);
                      }}
                      onBlur={handleManualCoordinateInput}
                      type="number"
                      step="any"
                      icon={<MapPinIcon className="h-5 w-5" />}
                      error={latError || false}
                    />
                    <CustomInput
                      label={
                        <>
                          Longitude <span className="text-red-500">*</span>
                        </>
                      }
                      value={form.formData.meta?.lng || ""}
                      onChange={(e) => {
                        form.updateMeta("lng", e.target.value);
                      }}
                      onBlur={handleManualCoordinateInput}
                      type="number"
                      step="any"
                      icon={<MapPinIcon className="h-5 w-5" />}
                      error={lngError || false}
                    />
                  </div>

                  {showMap && (
                    <div className="mt-4 w-full h-[400px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                      <MapContainer
                        key={`${mapPosition[0]}-${mapPosition[1]}`}
                        center={mapPosition}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                        className="z-0"
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker position={mapPosition} onPositionChange={handleMapClick} />
                      </MapContainer>
                    </div>
                  )}

                  {hasCoordinates ? (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <CustomTypography variant="small" className="text-green-700 dark:text-green-300 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Koordinatlar seçilib
                      </CustomTypography>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <CustomTypography variant="small" className="text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Koordinatlar seçilməyib - xəritədə klikləyin və ya əl ilə daxil edin
                      </CustomTypography>
                    </div>
                  )}
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
