import React, { useState } from "react";
import { Button, Input, Select, Option, Typography } from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DeviceActions({
  filterName = "",
  filterStatus = "",
  onNameSearch,
  onStatusChange,
  onCreateClick,
  total = 0,
  itemsPerPage = 10,
}) {
  const { t } = useTranslation();
  const [localName, setLocalName] = useState(filterName);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onNameSearch?.(localName);
  };

  const handleBlur = () => {
    onNameSearch?.(localName);
  };

  const handleClearName = () => {
    setLocalName("");
    onNameSearch?.("");
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 flex-wrap">
      {/* Left: search inputs */}
      <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
        {/* Name search */}
        <div className="relative w-full sm:w-56">
          <Input
            label={t("devices.filter.name") || "Ad axtar..."}
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            icon={
              localName ? (
                <XMarkIcon
                  className="h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-600"
                  onClick={handleClearName}
                />
              ) : (
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              )
            }
            className="!text-sm"
            containerProps={{ className: "!min-w-0" }}
          />
        </div>

        {/* Status filter */}
        <div className="w-full sm:w-40">
          <Select
            label={t("devices.filter.status") || "Status"}
            value={filterStatus}
            onChange={(val) => onStatusChange?.(val || "")}
            className="!text-sm"
          >
            <Option value="">{t("common.all") || "Hamısı"}</Option>
            <Option value="Onlayn">{t("devices.filter.online") || "Onlayn"}</Option>
            <Option value="Offline">{t("devices.filter.offline") || "Offline"}</Option>
          </Select>
        </div>

        {/* Total count */}
        {total > 0 && (
          <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs hidden sm:block">
            {t("devices.table.total") || "Cəm"}: <b>{total}</b>
          </Typography>
        )}
      </div>

      {/* Right: create button */}
      <Button
        size="sm"
        color="blue"
        onClick={onCreateClick}
        className="flex items-center gap-2 flex-shrink-0"
      >
        <PlusIcon className="h-4 w-4" />
        {t("devices.actions.add") || "Əlavə et"}
      </Button>
    </div>
  );
}
