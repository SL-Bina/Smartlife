import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import { XMarkIcon, PhotoIcon, TrashIcon, MapPinIcon as MapPinIconSolid } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import {
  InformationCircleIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  SwatchIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";

export function MtkFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false, saving = false, removePhoto }) {
  const { t } = useTranslation();
  const [mapCenter, setMapCenter] = useState({ lat: 40.4093, lng: 49.8671 }); // Baku default
  const [mapZoom, setMapZoom] = useState(12);
  const [showMap, setShowMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const logoInputRef = useRef(null);
  const photosInputRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (formData.meta?.lat && formData.meta?.lng) {
      const lat = parseFloat(formData.meta.lat);
      const lng = parseFloat(formData.meta.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCenter({ lat, lng });
        if (mapInstanceRef.current && markerRef.current) {
          const newPosition = { lat, lng };
          mapInstanceRef.current.setCenter(newPosition);
          markerRef.current.setPosition(newPosition);
        }
      }
    }
  }, [formData.meta?.lat, formData.meta?.lng]);

  // Check if Google Maps is loaded
  useEffect(() => {
    if (showMap) {
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          setMapLoaded(true);
          clearInterval(checkGoogleMaps);
        }
      }, 100);

      // Timeout after 10 seconds
      const timeout = setTimeout(() => {
        clearInterval(checkGoogleMaps);
        if (!window.google) {
          console.error("Google Maps API failed to load");
        }
      }, 10000);

      return () => {
        clearInterval(checkGoogleMaps);
        clearTimeout(timeout);
      };
    }
  }, [showMap]);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (showMap && mapContainerRef.current && window.google && window.google.maps && !mapInstanceRef.current && mapLoaded) {
      const currentCenter = formData.meta?.lat && formData.meta?.lng
        ? { lat: parseFloat(formData.meta.lat), lng: parseFloat(formData.meta.lng) }
        : mapCenter;

      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: currentCenter,
        zoom: mapZoom,
        mapTypeControl: true,
        streetViewControl: false,
        zoomControl: true,
        fullscreenControl: true,
        gestureHandling: 'auto',
        draggable: true,
        scrollwheel: true,
        disableDoubleClickZoom: false,
      });

      const marker = new window.google.maps.Marker({
        position: currentCenter,
        map: map,
        draggable: true,
        title: t("mtk.form.pickLocation"),
      });

      map.addListener("click", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        marker.setPosition({ lat, lng });
        onFieldChange("meta.lat", lat.toString());
        onFieldChange("meta.lng", lng.toString());
        setMapCenter({ lat, lng });
      });

      marker.addListener("dragend", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        onFieldChange("meta.lat", lat.toString());
        onFieldChange("meta.lng", lng.toString());
        setMapCenter({ lat, lng });
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMap, mapLoaded]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          onFieldChange("meta.lat", lat.toString());
          onFieldChange("meta.lng", lng.toString());
          setMapCenter({ lat, lng });
          if (mapInstanceRef.current && markerRef.current) {
            const newPosition = { lat, lng };
            mapInstanceRef.current.setCenter(newPosition);
            mapInstanceRef.current.setZoom(15);
            markerRef.current.setPosition(newPosition);
          }
        },
        (error) => {
          alert(t("mtk.form.geolocationError") || "Yerinizi təyin edə bilmədim. Xahiş edirik manuel seçin.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      alert(t("mtk.form.geolocationNotSupported") || "Brauzeriniz geolocation dəstəkləmir.");
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(t("mtk.form.logoSizeError") || "Logo faylının ölçüsü 5MB-dan böyük ola bilməz");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onFieldChange("logo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotosUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const currentPhotos = formData.photos || [];
    
    if (files.length + currentPhotos.length > 10) {
      alert(t("mtk.form.maxPhotos"));
      e.target.value = "";
      return;
    }
    
    const validFiles = files.filter((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(t("mtk.form.photoSizeError") || `${file.name} faylının ölçüsü 10MB-dan böyük ola bilməz`);
        return false;
      }
      return true;
    });

    const newPhotos = [];
    let loadedCount = 0;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPhotos.push(reader.result);
        loadedCount++;
        if (loadedCount === validFiles.length) {
          onFieldChange("photos", [...currentPhotos, ...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };


  const handleRemoveLogo = () => {
    onFieldChange("logo", null);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  if (!open) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="xl"
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
          {title}
        </Typography>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[75vh] overflow-y-auto py-6">
        <div className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("mtk.form.basicInfo")}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("mtk.form.name")} <span className="text-red-500">*</span>
                </Typography>
                <Input
                  placeholder={t("mtk.form.enterName")}
                  value={formData.name || ""}
                  onChange={(e) => onFieldChange("name", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  containerProps={{ className: "!min-w-0" }}
                  required
                />
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("mtk.form.status")} <span className="text-red-500">*</span>
                </Typography>
                <select
                  value={formData.status || "active"}
                  onChange={(e) => onFieldChange("status", e.target.value)}
                  className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="active" className="dark:bg-gray-800 dark:text-gray-300">
                    {t("mtk.form.active")}
                  </option>
                  <option value="inactive" className="dark:bg-gray-800 dark:text-gray-300">
                    {t("mtk.form.inactive")}
                  </option>
                </select>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("mtk.form.logo")}
              </Typography>
              <div className="flex items-center gap-4">
                {formData.logo ? (
                  <div className="relative">
                    <img
                      src={formData.logo}
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
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <PhotoIcon className="h-5 w-5" />
                    {formData.logo ? t("mtk.form.changeLogo") : t("mtk.form.uploadLogo")}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <MapPinIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("mtk.form.metaInfo")}
              </Typography>
            </div>

            {/* Google Maps Picker */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-300">
                  {t("mtk.form.mapPicker")}
                </Typography>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outlined"
                    color="green"
                    onClick={handleGetCurrentLocation}
                    className="dark:text-green-400 dark:border-green-600"
                  >
                    {t("mtk.form.useCurrentLocation") || "Cari yer"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outlined"
                    color="blue"
                    onClick={() => setShowMap(!showMap)}
                    className="dark:text-blue-400 dark:border-blue-600"
                  >
                    {showMap ? t("mtk.form.hideMap") || "Xəritəni gizlət" : t("mtk.form.pickLocation")}
                  </Button>
                </div>
              </div>
              {showMap && (
                <div className="mb-4">
                  <div className="relative w-full h-96 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800" style={{ touchAction: 'none' }}>
                    {window.google && window.google.maps && mapLoaded ? (
                      <div ref={mapContainerRef} className="w-full h-full" style={{ pointerEvents: 'auto' }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                          <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                            {t("mtk.form.loadingMap") || "Xəritə yüklənir..."}
                          </Typography>
                        </div>
                      </div>
                    )}
                    {window.google && window.google.maps && mapLoaded && (
                      <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg z-10 max-w-xs">
                        <Typography variant="small" className="text-gray-600 dark:text-gray-300">
                          {t("mtk.form.pickLocationDescription")}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("mtk.form.latitude")}
                </Typography>
                <Input
                  placeholder={t("mtk.form.enterLatitude")}
                  value={formData.meta?.lat || ""}
                  readOnly
                  className="dark:text-white dark:bg-gray-700"
                  labelProps={{ className: "dark:text-gray-400" }}
                  containerProps={{ className: "!min-w-0" }}
                  type="number"
                  step="any"
                />
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("mtk.form.longitude")}
                </Typography>
                <Input
                  placeholder={t("mtk.form.enterLongitude")}
                  value={formData.meta?.lng || ""}
                  readOnly
                  className="dark:text-white dark:bg-gray-700"
                  labelProps={{ className: "dark:text-gray-400" }}
                  containerProps={{ className: "!min-w-0" }}
                  type="number"
                  step="any"
                />
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("mtk.form.description")}
                </Typography>
                <textarea
                  placeholder={t("mtk.form.enterDescription")}
                  value={formData.meta?.desc || ""}
                  onChange={(e) => onFieldChange("meta.desc", e.target.value)}
                  className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 resize-none"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("mtk.form.address")}
                </Typography>
                <Input
                  placeholder={t("mtk.form.enterAddress")}
                  value={formData.meta?.address || ""}
                  onChange={(e) => onFieldChange("meta.address", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  containerProps={{ className: "!min-w-0" }}
                />
              </div>
            </div>
          </div>

          {/* Photos Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <PhotoIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("mtk.form.photos")}
              </Typography>
            </div>

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
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors mb-4"
              >
                <PhotoIcon className="h-5 w-5" />
                {t("mtk.form.uploadPhotos")}
              </label>
              <Typography variant="small" className="text-gray-500 dark:text-gray-400 ml-2">
                {t("mtk.form.maxPhotos")}
              </Typography>

              {formData.photos && formData.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={typeof photo === "string" ? photo : URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto && removePhoto(index)}
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
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                    {t("mtk.form.noPhotos")}
                  </Typography>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <EnvelopeIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("mtk.form.contactInfo") || "Əlaqə Məlumatları"}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                  {t("mtk.form.email")}
                </Typography>
                <Input
                  label={t("mtk.form.enterEmail")}
                  value={formData.meta?.email || ""}
                  onChange={(e) => onFieldChange("meta.email", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  type="email"
                />
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  <PhoneIcon className="h-4 w-4 inline mr-1" />
                  {t("mtk.form.phone")}
                </Typography>
                <Input
                  label={t("mtk.form.enterPhone")}
                  value={formData.meta?.phone || ""}
                  onChange={(e) => onFieldChange("meta.phone", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  type="tel"
                />
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  <GlobeAltIcon className="h-4 w-4 inline mr-1" />
                  {t("mtk.form.website")}
                </Typography>
                <Input
                  label={t("mtk.form.enterWebsite")}
                  value={formData.meta?.website || ""}
                  onChange={(e) => onFieldChange("meta.website", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  type="url"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Color Code Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <SwatchIcon className="h-5 w-5 text-pink-500 dark:text-pink-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("mtk.form.colorCode")}
              </Typography>
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                {t("mtk.form.enterColorCode")}
              </Typography>
              <div className="flex gap-3 items-end">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {t("mtk.form.colorPicker") || "Rəng seçin"}
                  </label>
                  <input
                    type="color"
                    value={formData.meta?.color_code || "#237832"}
                    onChange={(e) => onFieldChange("meta.color_code", e.target.value)}
                    className="w-16 h-12 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label={t("mtk.form.enterColorCode")}
                    value={formData.meta?.color_code || ""}
                    onChange={(e) => onFieldChange("meta.color_code", e.target.value)}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    placeholder="#237832"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </div>
                {formData.meta?.color_code && (
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: formData.meta.color_code }}
                    title={formData.meta.color_code}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-3 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          disabled={saving}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 min-w-[100px]"
        >
          {isEdit ? t("mtk.edit.cancel") : t("mtk.create.cancel")}
        </Button>
        <Button
          color={isEdit ? "blue" : "green"}
          onClick={onSave}
          disabled={saving}
          className={`min-w-[120px] ${
            isEdit
              ? "dark:bg-blue-600 dark:hover:bg-blue-700"
              : "dark:bg-green-600 dark:hover:bg-green-700"
          }`}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("mtk.saving")}
            </span>
          ) : (
            isEdit ? t("mtk.edit.save") : t("mtk.create.save")
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

