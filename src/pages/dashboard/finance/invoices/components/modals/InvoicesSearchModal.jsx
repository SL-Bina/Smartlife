import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Select, Option, Typography } from "@material-tailwind/react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function InvoicesSearchModal({ open, onClose, onSearch, currentSearch = {} }) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useState({
    service_name: "",
    property_name: "",
    complex_name: "",
    status: "",
    amount_min: "",
    amount_max: "",
    start_date: "",
    due_date: "",
  });

  useEffect(() => {
    // Reset form when modal opens
    if (open) {
      setSearchParams({
        service_name: currentSearch.service_name || "",
        property_name: currentSearch.property_name || "",
        complex_name: currentSearch.complex_name || "",
        status: currentSearch.status || "",
        amount_min: currentSearch.amount_min || "",
        amount_max: currentSearch.amount_max || "",
        start_date: currentSearch.start_date || "",
        due_date: currentSearch.due_date || "",
      });
    }
  }, [open, currentSearch]);

  const handleChange = (field, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    const filtered = Object.fromEntries(
      Object.entries(searchParams).filter(([_, value]) => value && value.toString().trim())
    );
    onSearch(filtered);
    onClose();
  };

  const handleReset = () => {
    setSearchParams({
      service_name: "",
      property_name: "",
      complex_name: "",
      status: "",
      amount_min: "",
      amount_max: "",
      start_date: "",
      due_date: "",
    });
    onSearch({});
    onClose();
  };

  // Set z-index for modal portal
  useEffect(() => {
    if (open) {
      const observer = new MutationObserver(() => {
        const portal = document.querySelector('[role="dialog"]');
        if (portal) {
          portal.style.zIndex = '999999';
          const backdrop = document.querySelector('.backdrop-blur-sm');
          if (backdrop) {
            backdrop.style.zIndex = '999998';
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    }
  }, [open]);

  return (
    <Dialog 
      open={open} 
      handler={onClose} 
      size="lg" 
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5 text-blue-500" />
          <Typography variant="h5" className="font-bold">
            Ətraflı Axtarış
          </Typography>
        </div>
        <div 
          className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" 
          onClick={onClose}
        >
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="dark:bg-gray-800 space-y-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Xidmət adı"
            value={searchParams.service_name}
            onChange={(e) => handleChange("service_name", e.target.value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          />
          <Input
            label="Mənzil adı"
            value={searchParams.property_name}
            onChange={(e) => handleChange("property_name", e.target.value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Kompleks adı"
            value={searchParams.complex_name}
            onChange={(e) => handleChange("complex_name", e.target.value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          />
          <Select
            label="Status"
            value={searchParams.status}
            onChange={(value) => handleChange("status", value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          >
            <Option value="">Hamısı</Option>
            <Option value="paid">Ödənilib</Option>
            <Option value="not_paid">Ödənilməmiş</Option>
            <Option value="pending">Gözləyir</Option>
            <Option value="overdue">Gecikmiş</Option>
            <Option value="declined">Rədd edilib</Option>
            <Option value="draft">Qaralama</Option>
            <Option value="pre_paid">Ön ödəniş</Option>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Minimum məbləğ"
            type="number"
            value={searchParams.amount_min}
            onChange={(e) => handleChange("amount_min", e.target.value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          />
          <Input
            label="Maksimum məbləğ"
            type="number"
            value={searchParams.amount_max}
            onChange={(e) => handleChange("amount_max", e.target.value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Başlama tarixi"
            type="date"
            value={searchParams.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          />
          <Input
            label="Son tarix"
            type="date"
            value={searchParams.due_date}
            onChange={(e) => handleChange("due_date", e.target.value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          />
        </div>
      </DialogBody>
      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <Button
          variant="text"
          color="gray"
          onClick={handleReset}
          className="mr-2"
        >
          Təmizlə
        </Button>
        <Button
          variant="text"
          color="gray"
          onClick={onClose}
          className="mr-2"
        >
          Ləğv et
        </Button>
        <Button
          variant="filled"
          color="blue"
          onClick={handleSearch}
          className="flex items-center gap-2"
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
          Axtar
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

