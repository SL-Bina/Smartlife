import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

/**
 * DeviceFilterModal
 * Props:
 *   open         - boolean
 *   onClose      - () => void
 *   filterName   - string
 *   filterBuilding - string
 *   filterStatus - string
 *   onChange     - (field, value) => void
 *   onApply      - () => void
 *   onClear      - () => void
 */
export function DeviceFilterModal({
  open,
  onClose,
  filterName,
  filterBuilding,
  filterStatus,
  onChange,
  onApply,
  onClear,
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} handler={onClose} size="sm" className="dark:bg-gray-900">
      <DialogHeader className="dark:bg-gray-800 dark:text-white">
        {t("devices.filter.title") || "Filtrlə"}
      </DialogHeader>

      <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("devices.filter.name") || "Ad"}
          </Typography>
          <Input
            label={t("devices.filter.enterName") || "Ad daxil edin"}
            value={filterName}
            onChange={(e) => onChange("name", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>

        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("devices.filter.building") || "Bina"}
          </Typography>
          <Input
            label={t("devices.filter.enterBuilding") || "Bina daxil edin"}
            value={filterBuilding}
            onChange={(e) => onChange("building", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>

        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("devices.filter.status") || "Status"}
          </Typography>
          <Select
            label={t("devices.filter.enterStatus") || "Status seçin"}
            value={filterStatus}
            onChange={(val) => onChange("status", val || "")}
            className="dark:text-white"
          >
            <Option value="Onlayn">{t("devices.filter.online") || "Onlayn"}</Option>
            <Option value="Offline">{t("devices.filter.offline") || "Offline"}</Option>
          </Select>
        </div>
      </DialogBody>

      <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 dark:border-gray-700">
        <Button
          variant="text"
          color="blue-gray"
          onClick={onClear}
          className="dark:text-gray-300 dark:hover:bg-gray-700"
        >
          {t("devices.filter.clear") || "Təmizlə"}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={onClose}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t("devices.filter.close") || "Bağla"}
          </Button>
          <Button
            color="blue"
            onClick={onApply}
            className="dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {t("devices.filter.apply") || "Tətbiq et"}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
