import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Input, Checkbox } from "@material-tailwind/react";
import { Map, Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { BuildingOffice2Icon, XMarkIcon, MapPinIcon, PhotoIcon } from "@heroicons/react/24/outline";
import DynamicToast from "@/components/DynamicToast";
import complexLookupsAPI from "../../api/lookups";

const DEFAULT_COLOR = "#dc2626";
const ACTIVE_COLOR = "#3b82f6"; // Blue for complexes

export function ComplexFormModal({ open, mode = "create", onClose, form, onSubmit, mtkId = null, onEditRequest }) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });
  const [showMap, setShowMap] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: 49.8671,
    latitude: 40.4093,
    zoom: 13,
  });
  const [markerPosition, setMarkerPosition] = useState({
    longitude: 49.8671,
    latitude: 40.4093,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [mtks, setMtks] = useState([]);
  const [modules, setModules] = useState([]);
  const [loadingLookups, setLoadingLookups] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle logo upload
  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast("error", "Yalnız şəkil faylları qəbul edilir", "Xəta");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Şəkil ölçüsü 5MB-dan böyük ola bilməz", "Xəta");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      form?.updateField("meta.logo", base64);
      setLogoPreview(base64);
      showToast("success", "Logo uğurla yükləndi", "Uğurlu");
    } catch (error) {
      showToast("error", "Logo yüklənərkən xəta baş verdi", "Xəta");
    }
  };

  // Handle multiple images upload
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = [];
    const errors = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name}: Yalnız şəkil faylları qəbul edilir`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name}: Şəkil ölçüsü 5MB-dan böyük ola bilməz`);
        continue;
      }

      validFiles.push(file);
    }

    if (errors.length > 0) {
      showToast("error", errors.join(", "), "Xəta");
    }

    if (validFiles.length === 0) return;

    try {
      const base64Promises = validFiles.map(file => fileToBase64(file));
      const base64Images = await Promise.all(base64Promises);
      
      const currentImages = form?.formData?.meta?.images || [];
      const newImages = [...currentImages, ...base64Images];
      
      form?.updateField("meta.images", newImages);
      setImagePreviews(newImages);
      showToast("success", `${validFiles.length} şəkil uğurla yükləndi`, "Uğurlu");
    } catch (error) {
      showToast("error", "Şəkillər yüklənərkən xəta baş verdi", "Xəta");
    }
  };

  // Remove logo
  const handleRemoveLogo = () => {
    form?.updateField("meta.logo", "");
    setLogoPreview(null);
  };

  // Remove image by index
  const handleRemoveImage = (index) => {
    const currentImages = form?.formData?.meta?.images || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    form?.updateField("meta.images", newImages);
    setImagePreviews(newImages);
  };

  // Load previews when form data changes
  useEffect(() => {
    if (form?.formData?.meta?.logo) {
      setLogoPreview(form.formData.meta.logo);
    } else {
      setLogoPreview(null);
    }

    if (form?.formData?.meta?.images && Array.isArray(form.formData.meta.images)) {
      setImagePreviews(form.formData.meta.images);
    } else {
      setImagePreviews([]);
    }
  }, [form?.formData?.meta?.logo, form?.formData?.meta?.images]);

  const isEdit = mode === "edit";
  const title = isEdit ? "Complex Redaktə et" : "Yeni Complex Əlavə Et";

  const statusOptions = [
    { value: "active", label: "Aktiv" },
    { value: "inactive", label: "Qeyri-aktiv" },
  ];

  // Load lookups when modal opens
  useEffect(() => {
    if (open) {
      setLoadingLookups(true);
      Promise.all([
        complexLookupsAPI.getMtks(),
        complexLookupsAPI.getModules(),
      ])
        .then(([mtksData, modulesData]) => {
          setMtks(mtksData || []);
          setModules(modulesData || []);
        })
        .catch((error) => {
          console.error("Error loading lookups:", error);
        })
        .finally(() => {
          setLoadingLookups(false);
        });
    }
  }, [open]);

  // Set mtk_id from prop if provided (only for create mode)
  useEffect(() => {
    if (open && !isEdit && mtkId && form?.updateField) {
      const currentMtkId = form?.formData?.mtk_id;
      if (!currentMtkId || currentMtkId !== mtkId) {
        form.updateField("mtk_id", mtkId);
      }
    }
  }, [open, isEdit, mtkId, form?.formData?.mtk_id]);

  const errorText = useMemo(() => {
    if (!form?.formData?.name?.trim()) return "Ad mütləqdir";
    if (!form?.formData?.mtk_id) return "MTK mütləqdir";
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

  // Get user's current location when map is shown
  useEffect(() => {
    if (showMap && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const loc = { 
            latitude: Number(latitude), 
            longitude: Number(longitude) 
          };
          setUserLocation(loc);
          
          if (!form?.formData?.meta?.lat || !form?.formData?.meta?.lng) {
            setViewState(prev => ({
              ...prev,
              longitude,
              latitude,
              zoom: 15,
            }));
            setMarkerPosition({ longitude, latitude });
            form?.updateField("meta.lat", String(latitude));
            form?.updateField("meta.lng", String(longitude));
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else if (!showMap) {
      setUserLocation(null);
    }
  }, [showMap, form]);

  // Update map position when lat/lng changes
  useEffect(() => {
    const lat = form?.formData?.meta?.lat;
    const lng = form?.formData?.meta?.lng;
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      if (!isNaN(latNum) && !isNaN(lngNum)) {
        setViewState(prev => ({
          ...prev,
          longitude: lngNum,
          latitude: latNum,
        }));
        setMarkerPosition({
          longitude: lngNum,
          latitude: latNum,
        });
      }
    }
  }, [form?.formData?.meta?.lat, form?.formData?.meta?.lng]);

  const handleMapClick = useCallback((event) => {
    const lngLat = event.lngLat;
    
    if (lngLat && typeof lngLat.lng === 'number' && typeof lngLat.lat === 'number') {
      const { lng, lat } = lngLat;
      setMarkerPosition({ longitude: lng, latitude: lat });
      form?.updateField("meta.lat", String(lat));
      form?.updateField("meta.lng", String(lng));
    }
  }, [form]);

  const handleModuleToggle = (moduleId) => {
    const currentModules = form?.formData?.modules || [];
    const isSelected = currentModules.includes(moduleId);
    
    if (isSelected) {
      form?.updateField("modules", currentModules.filter(id => id !== moduleId));
    } else {
      form?.updateField("modules", [...currentModules, moduleId]);
    }
  };

  const handleAvailableModuleToggle = (moduleId) => {
    const currentModules = form?.formData?.avaliable_modules || [];
    const isSelected = currentModules.includes(moduleId);
    
    if (isSelected) {
      form?.updateField("avaliable_modules", currentModules.filter(id => id !== moduleId));
    } else {
      form?.updateField("avaliable_modules", [...currentModules, moduleId]);
    }
  };

  const submit = async () => {
    if (errorText) {
      showToast("error", errorText, "Xəta");
      return;
    }
    // If edit mode and onEditRequest is provided, delegate to parent for confirmation
    if (mode === "edit" && onEditRequest) {
      onEditRequest(form.formData);
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
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm"
              style={{ backgroundColor: getRgbaColor(ACTIVE_COLOR, 0.3) }}
            >
              <BuildingOffice2Icon className="h-6 w-6 text-white" />
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

                <CustomSelect
                  label="MTK *"
                  value={form?.formData?.mtk_id ? String(form.formData.mtk_id) : ""}
                  onChange={(value) => form?.updateField("mtk_id", value ? parseInt(value, 10) : null)}
                  options={[
                    { value: "", label: "Seçin..." },
                    ...mtks.map((mtk) => ({
                      value: String(mtk.id),
                      label: mtk.name || `MTK #${mtk.id}`,
                    })),
                  ]}
                  error={!!form?.errors?.mtk_id}
                  helperText={form?.errors?.mtk_id}
                  disabled={loadingLookups}
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

            {/* Modullar */}
            <div>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
                Modullar
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Modullar
                  </Typography>
                  <div className="max-h-48 overflow-y-auto p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
                    {modules.map((module) => {
                      const moduleId = module.module?.id || module.id;
                      const moduleName = module.module?.name || module.name;
                      const isChecked = (form?.formData?.modules || []).includes(moduleId);
                      return (
                        <label
                          key={moduleId}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleModuleToggle(moduleId)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{moduleName}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Mövcud Modullar
                  </Typography>
                  <div className="max-h-48 overflow-y-auto p-3 border border-gray-200 dark:border-gray-700 rounded-lg space-y-2">
                    {modules.map((module) => {
                      const moduleId = module.module?.id || module.id;
                      const moduleName = module.module?.name || module.name;
                      const isChecked = (form?.formData?.avaliable_modules || []).includes(moduleId);
                      return (
                        <label
                          key={moduleId}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleAvailableModuleToggle(moduleId)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{moduleName}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Koordinatlar və Xəritə */}
            <div>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
                Koordinatlar
              </Typography>
              <div className="flex items-center justify-end mb-2">
                <Button
                  variant="outlined"
                  size="sm"
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center gap-2"
                  style={{
                    borderColor: ACTIVE_COLOR,
                    color: ACTIVE_COLOR,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = ACTIVE_COLOR;
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = ACTIVE_COLOR;
                  }}
                >
                  <MapPinIcon className="h-4 w-4" />
                  {showMap ? "Xəritəni gizlət" : "Xəritədən seç"}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <CustomInput
                  label="Latitude"
                  type="text"
                  value={form?.formData?.meta?.lat || ""}
                  onChange={(e) => {
                    form?.updateField("meta.lat", e.target.value);
                    const latNum = parseFloat(e.target.value);
                    if (!isNaN(latNum) && latNum >= -90 && latNum <= 90) {
                      setViewState(prev => ({ ...prev, latitude: latNum }));
                      setMarkerPosition(prev => ({ ...prev, latitude: latNum }));
                    }
                  }}
                />

                <CustomInput
                  label="Longitude"
                  type="text"
                  value={form?.formData?.meta?.lng || ""}
                  onChange={(e) => {
                    form?.updateField("meta.lng", e.target.value);
                    const lngNum = parseFloat(e.target.value);
                    if (!isNaN(lngNum) && lngNum >= -180 && lngNum <= 180) {
                      setViewState(prev => ({ ...prev, longitude: lngNum }));
                      setMarkerPosition(prev => ({ ...prev, longitude: lngNum }));
                    }
                  }}
                />
              </div>
              
              {showMap && (
                <div 
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 mb-4 overflow-hidden" 
                  style={{ height: "400px", minHeight: "400px" }}
                >
                  <Map
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    onClick={handleMapClick}
                    style={{ width: "100%", height: "100%" }}
                    interactive={true}
                    cursor="crosshair"
                    mapStyle={{
                      version: 8,
                      sources: {
                        'osm-tiles': {
                          type: 'raster',
                          tiles: [
                            'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                          ],
                          tileSize: 256,
                          attribution: '© OpenStreetMap contributors'
                        }
                      },
                      layers: [
                        {
                          id: 'osm-tiles-layer',
                          type: 'raster',
                          source: 'osm-tiles',
                          minzoom: 0,
                          maxzoom: 22
                        }
                      ]
                    }}
                    attributionControl={true}
                  >
                    {/* Selected location marker */}
                    <Marker
                      key={`selected-loc-${markerPosition.latitude}-${markerPosition.longitude}`}
                      longitude={markerPosition.longitude}
                      latitude={markerPosition.latitude}
                      anchor="bottom"
                    >
                      <div 
                        style={{
                          width: "32px",
                          height: "32px",
                          backgroundColor: ACTIVE_COLOR,
                          borderRadius: "50% 50% 50% 0",
                          transform: "rotate(-45deg)",
                          border: "3px solid white",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                          cursor: "pointer"
                        }}
                      >
                        <div 
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            backgroundColor: ACTIVE_COLOR,
                            transform: "rotate(45deg)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <MapPinIcon 
                            className="h-5 w-5 text-white" 
                            style={{ 
                              transform: "rotate(45deg)",
                              marginTop: "2px"
                            }} 
                          />
                        </div>
                      </div>
                    </Marker>
                    
                    {/* User's current location marker */}
                    {userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number' && (
                      <Marker
                        key={`user-loc-${userLocation.latitude}-${userLocation.longitude}`}
                        longitude={userLocation.longitude}
                        latitude={userLocation.latitude}
                        anchor="center"
                        style={{ zIndex: 1000 }}
                      >
                        <div 
                          style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: "#3b82f6",
                            borderRadius: "50%",
                            border: "5px solid white",
                            boxShadow: "0 3px 15px rgba(59, 130, 246, 0.8), 0 0 0 3px rgba(59, 130, 246, 0.3)",
                            cursor: "default",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="Sizin konumunuz"
                        >
                          <div 
                            style={{
                              width: "12px",
                              height: "12px",
                              backgroundColor: "white",
                              borderRadius: "50%",
                            }}
                          />
                        </div>
                      </Marker>
                    )}
                  </Map>
                </div>
              )}
            </div>

            {/* Logo və Şəkil */}
            <div>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
                Logo və Şəkil
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo
                  </label>
                  {logoPreview ? (
                    <div className="relative">
                      <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                        <img
                          src={logoPreview}
                          alt="Logo"
                          className="w-full h-40 object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="mt-2 w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Sil
                      </button>
                      <label className="mt-2 block">
                        <span className="block w-full py-2 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium text-center cursor-pointer transition-colors">
                          Dəyişdir
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoChange}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="block">
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-gray-50 dark:bg-gray-800">
                        <PhotoIcon className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Logo yüklə
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG, GIF (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoChange}
                      />
                    </label>
                  )}
                </div>

                {/* Şəkillər */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Şəkillər
                  </label>
                  
                  {imagePreviews.length > 0 && (
                    <div className="mb-3">
                      <div className="grid grid-cols-3 gap-2">
                        {imagePreviews.map((image, index) => (
                          <div key={index} className="relative">
                            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden aspect-square">
                              <img
                                src={image}
                                alt={`Şəkil ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg"
                            >
                              <XMarkIcon className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <label className="block">
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-gray-50 dark:bg-gray-800">
                      <PhotoIcon className="h-10 w-10 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Şəkillər yüklə
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Birdən çox seçə bilərsiniz (MAX. 5MB hər biri)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Əlavə Məlumatlar */}
            <div>
              <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
                Əlavə Məlumatlar
              </Typography>
              <CustomInput
                label="Təsvir"
                value={form?.formData?.meta?.desc || ""}
                onChange={(e) => form?.updateField("meta.desc", e.target.value)}
                textarea
              />

              <CustomInput
                label="Ünvan"
                value={form?.formData?.meta?.address || ""}
                onChange={(e) => form?.updateField("meta.address", e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  label="Telefon"
                  type="tel"
                  value={form?.formData?.meta?.phone || ""}
                  onChange={(e) => form?.updateField("meta.phone", e.target.value)}
                />

                <CustomInput
                  label="E-mail"
                  type="email"
                  value={form?.formData?.meta?.email || ""}
                  onChange={(e) => form?.updateField("meta.email", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  label="Website"
                  type="url"
                  value={form?.formData?.meta?.website || ""}
                  onChange={(e) => form?.updateField("meta.website", e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rəng Kodu
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="color"
                      value={form?.formData?.meta?.color_code || DEFAULT_COLOR}
                      onChange={(e) => form?.updateField("meta.color_code", e.target.value)}
                      className="w-16 h-10 p-1 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                      containerProps={{ className: "min-w-0" }}
                    />
                    <Input
                      type="text"
                      value={form?.formData?.meta?.color_code || DEFAULT_COLOR}
                      onChange={(e) => form?.updateField("meta.color_code", e.target.value)}
                      className="flex-1"
                      placeholder="#3b82f6"
                    />
                    {form?.formData?.meta?.color_code && (
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                        style={{ backgroundColor: form?.formData?.meta?.color_code }}
                      />
                    )}
                  </div>
                </div>
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

