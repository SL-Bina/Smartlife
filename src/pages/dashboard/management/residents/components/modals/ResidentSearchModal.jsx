import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Select, Option } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function ResidentSearchModal({ open, onClose, onSearch, currentSearch = {} }) {
  const [searchParams, setSearchParams] = useState({
    name: currentSearch.name || "",
    surname: currentSearch.surname || "",
    email: currentSearch.email || "",
    phone: currentSearch.phone || "",
    type: currentSearch.type || "",
    status: currentSearch.status || "",
  });

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
      name: "",
      surname: "",
      email: "",
      phone: "",
      type: "",
      status: "",
    });
  };

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800">
      <DialogHeader className="dark:bg-gray-800 dark:text-gray-200">
        Ətraflı Axtarış
      </DialogHeader>
      <DialogBody className="dark:bg-gray-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Ad"
            value={searchParams.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          />
          <Input
            label="Soyad"
            value={searchParams.surname}
            onChange={(e) => handleChange("surname", e.target.value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="E-mail"
            type="email"
            value={searchParams.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          />
          <Input
            label="Telefon"
            value={searchParams.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tip"
            value={searchParams.type}
            onChange={(value) => handleChange("type", value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          >
            <Option value="">Hamısı</Option>
            <Option value="owner">Sahib</Option>
            <Option value="tenant">Kirayəçi</Option>
          </Select>
          <Select
            label="Status"
            value={searchParams.status}
            onChange={(value) => handleChange("status", value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          >
            <Option value="">Hamısı</Option>
            <Option value="active">Aktiv</Option>
            <Option value="inactive">Qeyri-aktiv</Option>
          </Select>
        </div>
      </DialogBody>
      <DialogFooter className="dark:bg-gray-800">
        <Button
          variant="text"
          onClick={handleReset}
          className="mr-2 dark:text-gray-300"
        >
          Təmizlə
        </Button>
        <Button
          variant="text"
          onClick={onClose}
          className="mr-2 dark:text-gray-300"
        >
          Ləğv et
        </Button>
        <Button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Axtar
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

