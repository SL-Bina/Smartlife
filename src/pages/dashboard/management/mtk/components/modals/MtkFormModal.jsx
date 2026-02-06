import React, { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { CustomDialog, DialogHeader, DialogBody, DialogFooter } from "@/components/ui/CustomDialog";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomTextarea } from "@/components/ui/CustomTextarea";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomCard, CardBody } from "@/components/ui/CustomCard";
import { CustomTypography } from "@/components/ui/CustomTypography";
import AdvancedColorPicker from "@/components/ui/AdvancedColorPicker";
import DynamicToast from "@/components/DynamicToast";
import {
  MapPinIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  XMarkIcon,
  PhotoIcon,
  CameraIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MapIcon,
} from "@heroicons/react/24/outline";

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

export function MtkFormModal({ open, mode = "create", onClose, form, onSubmit }) {
  const [saving, setSaving] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [photosPreview, setPhotosPreview] = useState([]);
  const [mapPosition, setMapPosition] = useState([40.4093, 49.8671]);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });
  const logoInputRef = React.useRef(null);
  const photosInputRef = React.useRef(null);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const isEdit = mode === "edit";
  const title = isEdit ? "MTK Redaktə et" : "Yeni MTK yarat";

  const statusOptions = [
    { value: "active", label: "Aktiv" },
    { value: "inactive", label: "Qeyri-aktiv" },
  ];

  const errorText = useMemo(() => {
    if (!form?.formData?.name?.trim()) return "Ad mütləqdir";
    return "";
  }, [form?.formData?.name]);

  // Logo preview
  React.useEffect(() => {
    if (form?.formData?.logo) {
      setLogoPreview(form.formData.logo);
    } else {
      setLogoPreview(null);
    }
  }, [form?.formData?.logo]);

  // Photos preview
  React.useEffect(() => {
    if (form?.formData?.photos && Array.isArray(form.formData.photos)) {
      setPhotosPreview(form.formData.photos);
    } else {
      setPhotosPreview([]);
    }
  }, [form?.formData?.photos]);

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
      showToast("error", "Brauzeriniz geolocation dəstəkləmir", "Xəta");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        form.updateMeta("lat", String(lat));
        form.updateMeta("lng", String(lng));
        setMapPosition([lat, lng]);
        setShowMap(true); // Xəritəni avtomatik aç
        showToast("success", "Cari yer uğurla seçildi", "Uğurlu");
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "Yerinizi təyin edə bilmədim.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Yer məlumatına icazə verilməyib. Xahiş edirik brauzer parametrlərindən icazə verin.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Yer məlumatı mövcud deyil.";
            break;
          case error.TIMEOUT:
            errorMessage = "Yer məlumatı alınarkən vaxt aşdı.";
            break;
        }
        showToast("error", errorMessage, "Xəta");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast("error", "Logo faylının ölçüsü 5MB-dan böyük ola bilməz", "Xəta");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        form.updateField("logo", reader.result);
        showToast("success", "Logo uğurla yükləndi", "Uğurlu");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotosUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const currentPhotos = form?.formData?.photos || [];

    if (files.length + currentPhotos.length > 10) {
      showToast("error", "Maksimum 10 şəkil yükləyə bilərsiniz", "Xəta");
      e.target.value = "";
      return;
    }

    const invalidFiles = [];
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        invalidFiles.push(file.name);
        return false;
      }
      return true;
    });

    if (invalidFiles.length > 0) {
      showToast("error", `${invalidFiles.join(", ")} fayl(lar)ının ölçüsü 10MB-dan böyükdür`, "Xəta");
    }

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    const newPhotos = [];
    let loadedCount = 0;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPhotos.push(reader.result);
        loadedCount++;
        if (loadedCount === validFiles.length) {
          form.updateField("photos", [...currentPhotos, ...newPhotos]);
          showToast("success", `${validFiles.length} şəkil uğurla yükləndi`, "Uğurlu");
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleRemoveLogo = () => {
    form.updateField("logo", null);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (index) => {
    const currentPhotos = form?.formData?.photos || [];
    const newPhotos = currentPhotos.filter((_, i) => i !== index);
    form.updateField("photos", newPhotos);
  };

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

  const hasCoordinates = form?.formData?.meta?.lat && form?.formData?.meta?.lng;

  return (
    <>
      <CustomDialog open={!!open} onClose={onClose} size="xl">
        <DialogHeader className=" rounded-t-lg">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-white/20 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6" />
            </div>
            <div>
              <CustomTypography variant="h5" className="font-bold">
                {title}
              </CustomTypography>
              <CustomTypography variant="small" className="font-normal">
                {isEdit ? "MTK məlumatlarını yeniləyin" : "Yeni MTK üçün məlumatları doldurun"}
              </CustomTypography>
            </div>
          </div>
          <CustomButton
            variant="text"
            size="sm"
            onClick={onClose}
            className="text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2"
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
                      label="MTK adı"
                      value={form.formData.name || ""}
                      onChange={(e) => form.updateField("name", e.target.value)}
                      error={errorText}
                      icon={<BuildingOfficeIcon className="h-5 w-5" />}
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

              {/* Logo Upload */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    Logo
                  </CustomTypography>
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <div className="relative">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-24 h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                        <CameraIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <PhotoIcon className="h-5 w-5" />
                        {logoPreview ? "Logo dəyiş" : "Logo yüklə"}
                      </label>
                      <CustomTypography variant="small" className="text-gray-500 dark:text-gray-400 mt-1">
                        Maksimum 5MB
                      </CustomTypography>
                    </div>
                  </div>
                </CardBody>
              </CustomCard>

              {/* Photos Upload */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    Şəkillər
                  </CustomTypography>
                  <div>
                    <input
                      ref={photosInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotosUpload}
                      className="hidden"
                      id="photos-upload"
                    />
                    <label
                      htmlFor="photos-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mb-2"
                    >
                      <PhotoIcon className="h-5 w-5" />
                      Şəkil yüklə
                    </label>
                    <CustomTypography variant="small" className="text-gray-500 dark:text-gray-400 block">
                      Maksimum 10 şəkil, hər biri 10MB-dan az
                    </CustomTypography>

                    {photosPreview.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {photosPreview.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={typeof photo === "string" ? photo : URL.createObjectURL(photo)}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                        <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <CustomTypography variant="small" className="text-gray-500 dark:text-gray-400">
                          Şəkil yoxdur
                        </CustomTypography>
                      </div>
                    )}
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
                      label="Email"
                      type="email"
                      value={form.formData.meta?.email || ""}
                      onChange={(e) => form.updateMeta("email", e.target.value)}
                      icon={<EnvelopeIcon className="h-5 w-5" />}
                    />
                    <CustomInput
                      label="Telefon"
                      type="tel"
                      value={form.formData.meta?.phone || ""}
                      onChange={(e) => form.updateMeta("phone", e.target.value)}
                      icon={<PhoneIcon className="h-5 w-5" />}
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
                      label="Veb sayt"
                      type="url"
                      value={form.formData.meta?.website || ""}
                      onChange={(e) => form.updateMeta("website", e.target.value)}
                      icon={<GlobeAltIcon className="h-5 w-5" />}
                      placeholder="https://example.com"
                    />

                    <AdvancedColorPicker
                      value={form.formData.meta?.color_code || ""}
                      onChange={(color) => form.updateMeta("color_code", color)}
                      label="Rəng kodu"
                    />
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
                    label="Ünvan"
                    value={form.formData.meta?.address || ""}
                    onChange={(e) => form.updateMeta("address", e.target.value)}
                    icon={<MapPinIcon className="h-5 w-5" />}
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
                      label="Latitude"
                      value={form.formData.meta?.lat || ""}
                      onChange={(e) => {
                        form.updateMeta("lat", e.target.value);
                      }}
                      onBlur={handleManualCoordinateInput}
                      type="number"
                      step="any"
                      icon={<MapPinIcon className="h-5 w-5" />}
                    />
                    <CustomInput
                      label="Longitude"
                      value={form.formData.meta?.lng || ""}
                      onChange={(e) => {
                        form.updateMeta("lng", e.target.value);
                      }}
                      onBlur={handleManualCoordinateInput}
                      type="number"
                      step="any"
                      icon={<MapPinIcon className="h-5 w-5" />}
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
          <CustomButton
            variant="outlined"
            color="gray"
            onClick={onClose}
            disabled={saving}
          >
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

      {/* Toast Notification */}
      <DynamicToast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
        duration={3000}
      />
    </>
  );
}
