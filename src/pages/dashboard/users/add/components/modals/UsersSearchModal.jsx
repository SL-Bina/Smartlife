import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Select, Option, Typography } from "@material-tailwind/react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function UsersSearchModal({ open, onClose, onSearch, currentSearch = "" }) {
  const [searchParams, setSearchParams] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    role_id: "",
  });

  useEffect(() => {
    // Reset form when modal opens
    if (open) {
      setSearchParams({
        name: "",
        username: "",
        email: "",
        phone: "",
        role_id: "",
      });
    }
  }, [open]);

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
    // Simple search - just use the first non-empty value or combine them
    let searchString = "";
    if (filtered.name) {
      searchString = filtered.name;
    } else if (filtered.username) {
      searchString = filtered.username;
    } else if (filtered.email) {
      searchString = filtered.email;
    } else if (filtered.phone) {
      searchString = filtered.phone;
    }
    // If multiple fields, combine them
    if (Object.keys(filtered).length > 1) {
      searchString = Object.values(filtered).join(" ");
    }
    onSearch(searchString);
    onClose();
  };

  const handleReset = () => {
    setSearchParams({
      name: "",
      username: "",
      email: "",
      phone: "",
      role_id: "",
    });
    onSearch("");
    onClose();
  };

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
            label="Ad"
            value={searchParams.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="dark:text-gray-200"
            labelProps={{ className: "dark:text-gray-300" }}
          />
          <Input
            label="İstifadəçi adı"
            value={searchParams.username}
            onChange={(e) => handleChange("username", e.target.value)}
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

