import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { XMarkIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { CustomDialog, DialogHeader, DialogBody, DialogFooter } from "./CustomDialog";
import { CustomInput } from "./CustomInput";
import { CustomButton } from "./CustomButton";
import { CustomTypography } from "./CustomTypography";

// Leaflet marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function LocationMarker({ position, onPositionChange }) {
  const [markerPosition, setMarkerPosition] = useState(position || [40.4093, 49.8671]); // Baku default

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

export default function MapPicker({ open, onClose, lat, lng, onSelect }) {
  const [selectedLat, setSelectedLat] = useState(lat || "");
  const [selectedLng, setSelectedLng] = useState(lng || "");
  const [mapPosition, setMapPosition] = useState(
    lat && lng ? [parseFloat(lat), parseFloat(lng)] : [40.4093, 49.8671]
  );

  useEffect(() => {
    if (open) {
      if (lat && lng) {
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);
        if (!isNaN(latNum) && !isNaN(lngNum)) {
          setSelectedLat(lat);
          setSelectedLng(lng);
          setMapPosition([latNum, lngNum]);
        }
      } else {
        setSelectedLat("");
        setSelectedLng("");
        setMapPosition([40.4093, 49.8671]);
      }
    }
  }, [open, lat, lng]);

  const handleMapClick = (lat, lng) => {
    setSelectedLat(String(lat));
    setSelectedLng(String(lng));
    setMapPosition([lat, lng]);
  };

  const handleManualInput = () => {
    const latNum = parseFloat(selectedLat);
    const lngNum = parseFloat(selectedLng);
    if (!isNaN(latNum) && !isNaN(lngNum) && latNum >= -90 && latNum <= 90 && lngNum >= -180 && lngNum <= 180) {
      setMapPosition([latNum, lngNum]);
    }
  };

  const handleConfirm = () => {
    if (selectedLat && selectedLng) {
      onSelect?.(selectedLat, selectedLng);
      onClose?.();
    }
  };

  return (
    <CustomDialog open={!!open} onClose={onClose} size="xl">
      <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-white/20 rounded-lg">
            <MapPinIcon className="h-6 w-6" />
          </div>
          <div>
            <CustomTypography variant="h5" className="font-bold text-white">
              Koordinat seç
            </CustomTypography>
            <CustomTypography variant="small" className="text-blue-100 font-normal">
              Xəritədə klikləyin və ya koordinatları əl ilə daxil edin
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

      <DialogBody>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CustomInput
              label="Latitude"
              value={selectedLat}
              onChange={(e) => setSelectedLat(e.target.value)}
              onBlur={handleManualInput}
              type="number"
              step="any"
            />
            <CustomInput
              label="Longitude"
              value={selectedLng}
              onChange={(e) => setSelectedLng(e.target.value)}
              onBlur={handleManualInput}
              type="number"
              step="any"
            />
          </div>

          <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
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

          <CustomTypography variant="small" className="text-gray-500 dark:text-gray-400">
            Xəritədə klikləyin və ya koordinatları əl ilə daxil edin
          </CustomTypography>
        </div>
      </DialogBody>

      <DialogFooter>
        <CustomButton variant="outlined" color="gray" onClick={onClose}>
          Ləğv et
        </CustomButton>
        <CustomButton color="blue" onClick={handleConfirm} disabled={!selectedLat || !selectedLng}>
          Təsdiq et
        </CustomButton>
      </DialogFooter>
    </CustomDialog>
  );
}
