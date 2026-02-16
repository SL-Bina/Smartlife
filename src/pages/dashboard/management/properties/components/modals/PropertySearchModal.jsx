import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { CustomInput } from "@/components/ui/CustomInput";

const ACTIVE_COLOR = "#14b8a6"; // Teal for properties

export function PropertySearchModal({ open, onClose, onSearch, currentSearch = {} }) {
  const [searchData, setSearchData] = useState({
    name: "",
    status: "",
    property_type: "",
    area: "",
    floor: "",
    apartment_number: "",
  });

  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return `rgba(20, 184, 166, ${opacity})`;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  useEffect(() => {
    if (open && currentSearch) {
      setSearchData({
        name: currentSearch.name || "",
        status: currentSearch.status || "",
        property_type: currentSearch.property_type || "",
        area: currentSearch.area || "",
        floor: currentSearch.floor || "",
        apartment_number: currentSearch.apartment_number || "",
      });
    }
  }, [open, currentSearch]);

  const handleFieldChange = (field, value) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    const filteredData = Object.entries(searchData).reduce((acc, [key, value]) => {
      if (value && value.toString().trim()) {
        acc[key] = value.toString().trim();
      }
      return acc;
    }, {});
    
    onSearch?.(filteredData);
    onClose?.();
  };

  const handleClear = () => {
    const emptyData = {
      name: "",
      status: "",
      property_type: "",
      area: "",
      floor: "",
      apartment_number: "",
    };
    setSearchData(emptyData);
    onSearch?.({});
    onClose?.();
  };

  const statusOptions = [
    { value: "", label: "Hamısı" },
    { value: "active", label: "Aktiv" },
    { value: "inactive", label: "Qeyri-aktiv" },
  ];

  if (!open) return null;

  return (
    <Dialog 
      open={!!open} 
      handler={onClose} 
      size="lg"
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
            <FunnelIcon className="h-6 w-6 text-white" />
          </div>
          <Typography variant="h5" className="text-white font-bold">
            Mənzil Axtarış və Filtrləmə
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
                label="Ad"
                value={searchData.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="Mənzil adına görə axtarış"
                className="dark:text-white"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={searchData.status}
                  onChange={(e) => handleFieldChange("status", e.target.value)}
                  className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-teal-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Meta Məlumatlar */}
          <div>
            <Typography variant="h6" className="text-gray-900 dark:text-white mb-4 font-semibold flex items-center gap-2">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: ACTIVE_COLOR }}></div>
              Meta Məlumatlar
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomInput
                label="Mənzil Tipi"
                type="number"
                value={searchData.property_type}
                onChange={(e) => handleFieldChange("property_type", e.target.value)}
                placeholder="Mənzil tipi ID"
                className="dark:text-white"
              />
              <CustomInput
                label="Sahə (m²)"
                type="number"
                value={searchData.area}
                onChange={(e) => handleFieldChange("area", e.target.value)}
                placeholder="Sahəyə görə axtarış"
                className="dark:text-white"
              />
              <CustomInput
                label="Mərtəbə"
                type="number"
                value={searchData.floor}
                onChange={(e) => handleFieldChange("floor", e.target.value)}
                placeholder="Mərtəbəyə görə axtarış"
                className="dark:text-white"
              />
              <CustomInput
                label="Mənzil №"
                type="number"
                value={searchData.apartment_number}
                onChange={(e) => handleFieldChange("apartment_number", e.target.value)}
                placeholder="Mənzil nömrəsinə görə axtarış"
                className="dark:text-white"
              />
            </div>
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
        <Button
          variant="outlined"
          onClick={handleClear}
          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center gap-2"
        >
          <XMarkIcon className="h-5 w-5" />
          Təmizlə
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            onClick={onClose}
            className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white dark:border-gray-400 dark:text-gray-400 dark:hover:bg-gray-400 flex items-center gap-2"
          >
            <XMarkIcon className="h-5 w-5" />
            Ləğv et
          </Button>
          <Button
            onClick={handleSearch}
            className="text-white flex items-center gap-2"
            style={{ backgroundColor: ACTIVE_COLOR }}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            Axtarış
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}

