import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import { CpuChipIcon, HomeIcon } from "@heroicons/react/24/outline";

import { useDynamicToast } from "@/hooks/useDynamicToast";
import { useMtkColor } from "@/store/hooks/useMtkColor";

const DeviceConnectionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getRgba: getMtkRgba, getActiveGradient } = useMtkColor();

  const { toast, showToast, closeToast } = useDynamicToast();

  const [selectedApartment, setSelectedApartment] = useState(null);
  const [selectedExternalDevice, setSelectedExternalDevice] = useState(null);
  const [mobilePanel, setMobilePanel] = useState("apartments");
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock data for apartments (bizim menziller)
  const apartments = useMemo(() => [
    { id: 1, name: "Mənzil 101", building: "Bina A", apartment: "101", devicesCount: 3, status: "active" },
    { id: 2, name: "Mənzil 102", building: "Bina A", apartment: "102", devicesCount: 2, status: "active" },
    { id: 3, name: "Mənzil 201", building: "Bina B", apartment: "201", devicesCount: 4, status: "active" },
    { id: 4, name: "Mənzil 202", building: "Bina B", apartment: "202", devicesCount: 2, status: "active" },
    { id: 5, name: "Mənzil 301", building: "Bina C", apartment: "301", devicesCount: 3, status: "inactive" },
    { id: 6, name: "Mənzil 302", building: "Bina C", apartment: "302", devicesCount: 1, status: "active" },
  ], [refreshKey]);

  // Mock data for external devices by apartment (qarşı tərəf cihazları)
  const externalDevicesByApartment = useMemo(() => ({
    1: [ // Mənzil 101 üçün cihazlar
      { id: 101, name: "External Cam 101-A", type: "camera", provider: "Provider A", status: "online", ip: "10.0.1.101" },
      { id: 102, name: "External Sensor 101-A", type: "sensor", provider: "Provider A", status: "online", ip: "10.0.1.102" },
      { id: 103, name: "External Lock 101-A", type: "lock", provider: "Provider B", status: "offline", ip: "10.0.1.103" },
    ],
    2: [ // Mənzil 102 üçün cihazlar
      { id: 104, name: "External Cam 102-A", type: "camera", provider: "Provider A", status: "online", ip: "10.0.1.104" },
      { id: 105, name: "External Sensor 102-A", type: "sensor", provider: "Provider A", status: "online", ip: "10.0.1.105" },
    ],
    3: [ // Mənzil 201 üçün cihazlar
      { id: 106, name: "External Cam 201-B", type: "camera", provider: "Provider B", status: "online", ip: "10.0.2.201" },
      { id: 107, name: "External Sensor 201-B", type: "sensor", provider: "Provider B", status: "online", ip: "10.0.2.202" },
      { id: 108, name: "External Lock 201-B", type: "lock", provider: "Provider B", status: "online", ip: "10.0.2.203" },
      { id: 109, name: "External Intercom 201-B", type: "intercom", provider: "Provider C", status: "online", ip: "10.0.2.204" },
    ],
    4: [ // Mənzil 202 üçün cihazlar
      { id: 110, name: "External Cam 202-B", type: "camera", provider: "Provider B", status: "online", ip: "10.0.2.205" },
      { id: 111, name: "External Sensor 202-B", type: "sensor", provider: "Provider B", status: "offline", ip: "10.0.2.206" },
    ],
    5: [ // Mənzil 301 üçün cihazlar
      { id: 112, name: "External Cam 301-C", type: "camera", provider: "Provider C", status: "online", ip: "10.0.3.301" },
      { id: 113, name: "External Sensor 301-C", type: "sensor", provider: "Provider C", status: "online", ip: "10.0.3.302" },
      { id: 114, name: "External Lock 301-C", type: "lock", provider: "Provider C", status: "online", ip: "10.0.3.303" },
    ],
    6: [ // Mənzil 302 üçün cihazlar
      { id: 115, name: "External Cam 302-C", type: "camera", provider: "Provider C", status: "online", ip: "10.0.3.304" },
    ]
  }), [refreshKey]);

  // Seçilmiş mənzilə görə xarici cihazları filter et
  const availableExternalDevices = useMemo(() => {
    if (!selectedApartment) return [];
    return externalDevicesByApartment[selectedApartment.id] || [];
  }, [selectedApartment, externalDevicesByApartment]);

  const handleBack = () => {
    navigate("/dashboard/devices");
  };

  const handleApartmentSelect = (apartment) => {
    setSelectedApartment(apartment);
    setSelectedExternalDevice(null); // Reset external device selection
    setMobilePanel("external");
  };

  const handleConnectDevices = async () => {
    if (!selectedApartment || !selectedExternalDevice) return;

    try {
      setSaving(true);
      
      // Mock API call - buraya real API əlavə edə bilərsən
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast({
        type: "success",
        title: t("common.success") || "Uğurlu",
        message: t("devices.connection.connected", "Mənzil və cihaz uğurla əlaqələndirildi"),
      });

      console.log("Connecting apartment to device:", {
        apartment: selectedApartment,
        externalDevice: selectedExternalDevice
      });
      
      // Reset selection after successful connection
      setSelectedApartment(null);
      setSelectedExternalDevice(null);
      setRefreshKey((p) => p + 1);
    } catch (err) {
      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: err?.message || "Əlaqələndirmə zamanı xəta baş verdi",
      });
    } finally {
      setSaving(false);
    }
  };

  const gradientStyle = { background: getActiveGradient(0.9, 0.7) };
  const borderColor = getMtkRgba(0.3);

  return (
    <div className="space-y-6">
      {/* Device Header - Same design as devices page */}
      <div
        className="relative w-full overflow-hidden rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 mt-2 sm:mt-3 md:mt-4"
        style={{ ...gradientStyle, border: `1px solid ${borderColor}`, position: "relative", zIndex: 0 }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative flex items-center gap-3 sm:gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 dark:border-gray-600/30"
              style={{ backgroundColor: getMtkRgba(0.2) }}
            >
              <CpuChipIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
            </div>
          </div>

          {/* Title + subtitle */}
          <div className="flex-1 min-w-0">
            <Typography
              variant="h4"
              className="text-white font-bold mb-1 text-lg sm:text-xl md:text-2xl"
            >
              {t("devices.connection.pageTitle", "Cihaz Elaqələndirməsi")}
            </Typography>
            <Typography className="text-white/90 dark:text-gray-300 text-xs sm:text-sm font-medium">
              {t("devices.connection.pageSubtitle", "Mənzilləri xarici cihazlarla əlaqələndirin")}
            </Typography>
          </div>

          {/* Back button */}
          <button
            onClick={handleBack}
            className="flex-shrink-0 p-2 rounded-lg backdrop-blur-sm border border-white/30 dark:border-gray-600/30 hover:bg-white/10 transition-colors"
            style={{ backgroundColor: getMtkRgba(0.2) }}
          >
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
        <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12" />
      </div> 
      {/* Responsive layout: stacked on mobile, two columns on desktop */}
      <div className="lg:hidden mb-3 flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1">
        <button
          type="button"
          onClick={() => setMobilePanel("apartments")}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
            mobilePanel === "apartments"
              ? "bg-blue-600 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {t("devices.connection.apartments", "Mənzillər")}
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel("external")}
          disabled={!selectedApartment}
          className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
            mobilePanel === "external"
              ? "bg-blue-600 text-white"
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          } ${!selectedApartment ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {t("devices.connection.externalDevices", "Xarici Cihazlar")}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 min-h-0 pr-4">

        {/* Left: Apartments */}
        <div className={`w-full lg:w-2/5 flex-shrink-0 ${mobilePanel === "apartments" ? "flex flex-col min-h-0" : "hidden lg:flex lg:flex-col lg:min-h-0"}`}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col min-h-0">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <HomeIcon className="h-5 w-5 text-blue-500" />
                {t("devices.connection.apartments", "Mənzillər")}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {t("devices.connection.selectApartment", "Əlaqələndirmək üçün mənzil seçin")}
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {apartments.map((apartment) => (
                <div
                  key={apartment.id}
                  onClick={() => handleApartmentSelect(apartment)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedApartment?.id === apartment.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {apartment.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          apartment.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {apartment.status === "active" ? "Aktiv" : "Passiv"}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {apartment.building} • {apartment.apartment}
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                          </svg>
                          {apartment.devicesCount} cihaz
                        </div>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      apartment.status === "active" ? "bg-green-500" : "bg-gray-400"
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: External Devices */}
        <div className={`w-full lg:w-3/5 flex-shrink-0 ${mobilePanel === "external" ? "flex flex-col min-h-0" : "hidden lg:flex lg:flex-col lg:min-h-0"}`}>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col min-h-0">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CpuChipIcon className="h-5 w-5 text-green-500" />
                {selectedApartment 
                  ? `${t("devices.connection.externalDevicesFor", "Xarici Cihazlar")}: ${selectedApartment.name}`
                  : t("devices.connection.externalDevices", "Xarici Cihazlar")
                }
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {selectedApartment 
                  ? t("devices.connection.selectExternalDevice", "Əlaqələndirmək üçün xarici cihazı seçin")
                  : t("devices.connection.selectApartmentFirst", "Əvvəlcə mənzil seçin")
                }
              </p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {selectedApartment ? (
                availableExternalDevices.length > 0 ? (
                  <div className="space-y-2">
                    {availableExternalDevices.map((device) => (
                      <div
                        key={device.id}
                        onClick={() => setSelectedExternalDevice(device)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedExternalDevice?.id === device.id
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {device.name}
                              </h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                device.type === "camera" ? "bg-blue-100 text-blue-800" :
                                device.type === "sensor" ? "bg-green-100 text-green-800" :
                                device.type === "lock" ? "bg-purple-100 text-purple-800" :
                                "bg-orange-100 text-orange-800"
                              }`}>
                                {device.type}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                {device.provider}
                              </div>
                              <div className="flex items-center gap-2">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                </svg>
                                {device.ip}
                              </div>
                            </div>
                          </div>
                          <div className={`w-3 h-3 rounded-full mt-1 ${
                            device.status === "online" ? "bg-green-500" : "bg-gray-400"
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {t("devices.connection.noDevices", "Cihaz yoxdur")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("devices.connection.noDevicesForApartment", "Bu mənzil üçün xarici cihaz tapılmadı")}
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {t("devices.connection.noApartmentSelected", "Mənzil seçilməyib")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("devices.connection.selectApartmentFirst", "Cihazları görmək üçün əvvəlcə mənzil seçin")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Connection Status */}
      {(selectedApartment || selectedExternalDevice) && (
        <div className="lg:hidden mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm">
            <div className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              {t("devices.connection.selectionStatus", "Seçim Statusu")}
            </div>
            <div className="space-y-1 text-blue-800 dark:text-blue-200">
              {selectedApartment && (
                <div>✓ {t("devices.connection.apartmentSelected", "Mənzil seçildi")}: {selectedApartment.name}</div>
              )}
              {selectedExternalDevice && (
                <div>✓ {t("devices.connection.externalSelected", "Xarici cihaz seçildi")}: {selectedExternalDevice.name}</div>
              )}
              {selectedApartment && selectedExternalDevice && (
                <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                  {t("devices.connection.readyToConnect", "Əlaqələndirməyə hazırdır!")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Connect Button */}
      {selectedApartment && selectedExternalDevice && (
        <div className="flex justify-center">
          <button
            onClick={handleConnectDevices}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            style={{ background: getActiveGradient() }}
          >
            {saving ? t("common.saving", "Yadda saxlanılır...") : t("devices.connection.connect", "Əlaqələndir")}
          </button>
        </div>
      )}

    </div>
  );
};

export default DeviceConnectionPage;
