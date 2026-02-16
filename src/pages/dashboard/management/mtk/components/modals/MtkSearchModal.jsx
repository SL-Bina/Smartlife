import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography, Select, Option } from "@material-tailwind/react";
import { Map, Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useMtkColor } from "@/store/exports";

export function MtkSearchModal({ open, onClose, onSearch, currentSearch = {} }) {
  const { colorCode, getRgba, getActiveGradient } = useMtkColor();
  const activeColorCode = colorCode || "#3b82f6";
  
  // Helper function to convert hex to rgba
  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return getRgba(opacity);
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  const [searchData, setSearchData] = useState({
    phone: "",
    email: "",
    website: "",
    desc: "",
    lat: "",
    lng: "",
    color_code: "",
  });
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

  useEffect(() => {
    if (open && currentSearch) {
      setSearchData({
        phone: currentSearch.phone || "",
        email: currentSearch.email || "",
        website: currentSearch.website || "",
        desc: currentSearch.desc || "",
        lat: currentSearch.lat || "",
        lng: currentSearch.lng || "",
        color_code: currentSearch.color_code || "",
      });
      
      // Update map position if coordinates exist
      if (currentSearch.lat && currentSearch.lng) {
        const latNum = parseFloat(currentSearch.lat);
        const lngNum = parseFloat(currentSearch.lng);
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
    }
  }, [open, currentSearch]);

  // Update map position when lat/lng changes
  useEffect(() => {
    const lat = searchData.lat;
    const lng = searchData.lng;
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
  }, [searchData.lat, searchData.lng]);

  const handleMapClick = useCallback((event) => {
    const lngLat = event.lngLat;
    if (lngLat && typeof lngLat.lng === 'number' && typeof lngLat.lat === 'number') {
      const { lng, lat } = lngLat;
      setMarkerPosition({ longitude: lng, latitude: lat });
      handleFieldChange("lat", String(lat));
      handleFieldChange("lng", String(lng));
    }
  }, []);

  const handleFieldChange = (field, value) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    // Yalnız doldurulmuş sahələri göndər
    const filteredData = Object.entries(searchData).reduce((acc, [key, value]) => {
      if (value && value.trim()) {
        acc[key] = value.trim();
      }
      return acc;
    }, {});
    
    onSearch?.(filteredData);
    onClose?.();
  };

  const handleClear = () => {
    const emptyData = {
      phone: "",
      email: "",
      website: "",
      desc: "",
      lat: "",
      lng: "",
      color_code: "",
    };
    setSearchData(emptyData);
    onSearch?.({});
    onClose?.();
  };


  if (!open) return null;

  return (
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
          background: getActiveGradient(0.9, 0.7),
          borderColor: getRgba(0.2),
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg bg-white/20 backdrop-blur-sm"
            style={{ backgroundColor: getRgbaColor(activeColorCode, 0.3) }}
          >
            <FunnelIcon className="h-6 w-6 text-white" />
          </div>
          <Typography variant="h5" className="text-white font-bold">
            MTK Axtarış və Filtrləmə
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
          {/* Əlaqə Məlumatları */}
          <div>
            <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: activeColorCode }}></div>
              Əlaqə Məlumatları
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                label="Telefon"
                value={searchData.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                placeholder="Telefon nömrəsinə görə axtarış"
                className="dark:text-white"
              />
              <CustomInput
                label="E-mail"
                type="email"
                value={searchData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder="E-mail ünvanına görə axtarış"
                className="dark:text-white"
              />
              <CustomInput
                label="Website"
                value={searchData.website}
                onChange={(e) => handleFieldChange("website", e.target.value)}
                placeholder="Website URL-ə görə axtarış"
                className="dark:text-white"
              />
            </div>
          </div>

          {/* Yerləşmə və Digər Məlumatlar */}
          <div>
            <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: activeColorCode }}></div>
              Yerləşmə və Digər Məlumatlar
            </Typography>
            <div className="flex items-center justify-end mb-2">
              <Button
                variant="outlined"
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2"
                style={{
                  borderColor: activeColorCode,
                  color: activeColorCode,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = activeColorCode;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = activeColorCode;
                }}
              >
                <MapPinIcon className="h-4 w-4" />
                {showMap ? "Xəritəni gizlət" : "Xəritədən seç"}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <CustomInput
                label="Enlem (Latitude)"
                type="number"
                value={searchData.lat}
                onChange={(e) => {
                  handleFieldChange("lat", e.target.value);
                  const latNum = parseFloat(e.target.value);
                  if (!isNaN(latNum) && latNum >= -90 && latNum <= 90) {
                    setViewState(prev => ({ ...prev, latitude: latNum }));
                    setMarkerPosition(prev => ({ ...prev, latitude: latNum }));
                  }
                }}
                placeholder="Enlem koordinatı"
                className="dark:text-white"
              />
              <CustomInput
                label="Boylam (Longitude)"
                type="number"
                value={searchData.lng}
                onChange={(e) => {
                  handleFieldChange("lng", e.target.value);
                  const lngNum = parseFloat(e.target.value);
                  if (!isNaN(lngNum) && lngNum >= -180 && lngNum <= 180) {
                    setViewState(prev => ({ ...prev, longitude: lngNum }));
                    setMarkerPosition(prev => ({ ...prev, longitude: lngNum }));
                  }
                }}
                placeholder="Boylam koordinatı"
                className="dark:text-white"
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
                  <Marker
                    key={`marker-${markerPosition.latitude}-${markerPosition.longitude}`}
                    longitude={markerPosition.longitude}
                    latitude={markerPosition.latitude}
                    anchor="bottom"
                  >
                    <div 
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: activeColorCode,
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
                          backgroundColor: activeColorCode,
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
                </Map>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <CustomInput
                  label="Təsvir"
                  value={searchData.desc}
                  onChange={(e) => handleFieldChange("desc", e.target.value)}
                  placeholder="Təsvirə görə axtarış"
                  textarea
                  className="dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center gap-3">
                  <CustomInput
                    label="Rəng Kodu (Hex)"
                    value={searchData.color_code}
                    onChange={(e) => handleFieldChange("color_code", e.target.value)}
                    placeholder="#000000"
                    className="flex-1 dark:text-white"
                  />
                  {searchData.color_code && (
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm mt-6"
                      style={{ backgroundColor: searchData.color_code }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={handleClear}
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center gap-2"
          >
            <XMarkIcon className="h-5 w-5" />
            Təmizlə
          </Button>
          <Button
            variant="outlined"
            onClick={onClose}
            className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white dark:border-gray-400 dark:text-gray-400 dark:hover:bg-gray-400 flex items-center gap-2"
          >
            <XMarkIcon className="h-5 w-5" />
            Ləğv et
          </Button>
        </div>
        <Button
          onClick={handleSearch}
          className="text-white flex items-center gap-2"
          style={{ backgroundColor: activeColorCode }}
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
          Axtarış
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
