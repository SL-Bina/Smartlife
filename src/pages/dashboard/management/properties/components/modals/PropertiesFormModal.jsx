import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { usePropertiesLookups } from "../../hooks/usePropertiesLookups";

export function PropertiesFormModal({
  open,
  onClose,
  title,
  formData,
  onFieldChange,
  onSave,
  isEdit = false,
  saving = false,
}) {
  const { t } = useTranslation();
  const [localError, setLocalError] = useState(null);

  const { loading, mtks, complexes, buildings, blocks } = usePropertiesLookups(open, formData);

  if (!open) return null;

  const validate = () => {
    if (!formData.name) return t("properties.form.errors.name");
    if (!formData.mtk_id) return t("properties.form.errors.mtk");
    if (!formData.complex_id) return t("properties.form.errors.complex");
    if (!formData.building_id) return t("properties.form.errors.building");
    if (!formData.block_id) return t("properties.form.errors.block");
    if (!formData.meta?.apartment_number) return t("properties.form.errors.apartmentNumber");
    if (!formData.meta?.floor) return t("properties.form.errors.floor");
    if (!formData.meta?.area) return t("properties.form.errors.area");
    return null;
  };

  const handleSubmit = () => {
    const err = validate();
    setLocalError(err);
    if (err) return;
    onSave?.();
  };

  // parent dəyişəndə child-ları sıfırla (bu hissə səndə necə lazımdırsa saxla)
  const setMtk = (val) => {
    onFieldChange("mtk_id", val);
    onFieldChange("complex_id", "");
    onFieldChange("building_id", "");
    onFieldChange("block_id", "");
  };

  const setComplex = (val) => {
    onFieldChange("complex_id", val);
    onFieldChange("building_id", "");
    onFieldChange("block_id", "");
  };

  const setBuilding = (val) => {
    onFieldChange("building_id", val);
    onFieldChange("block_id", "");
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="lg"
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
          {title}
        </Typography>
        <div
          className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>

      <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 space-y-4 py-6">
        {(loading || saving) && (
          <div className="flex items-center gap-2 text-sm text-blue-gray-400 dark:text-gray-400">
            <Spinner className="h-4 w-4" /> {t("common.loading") || "Yüklənir..."}
          </div>
        )}

        {localError && (
          <div className="p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <Typography variant="small" className="text-red-700 dark:text-red-300 text-xs">
              {localError}
            </Typography>
          </div>
        )}

        {/* Name */}
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("properties.form.fields.name")} *
          </Typography>
          <Input
            value={formData.name || ""}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>

        {/* Selects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* MTK */}
          <div>
            <Typography variant="small" className="mb-2 font-semibold dark:text-gray-300">
              {t("properties.form.fields.mtk")} *
            </Typography>
            <select
              value={formData.mtk_id || ""}
              onChange={(e) => setMtk(e.target.value)}
              className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">{t("common.select") || "Seçin..."}</option>
              {(mtks || []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Complex */}
          <div>
            <Typography variant="small" className="mb-2 font-semibold dark:text-gray-300">
              {t("properties.form.fields.complex")} *
            </Typography>
            <select
              value={formData.complex_id || ""}
              onChange={(e) => setComplex(e.target.value)}
              disabled={!formData.mtk_id}
              className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">{t("common.select") || "Seçin..."}</option>
              {(complexes || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Building */}
          <div>
            <Typography variant="small" className="mb-2 font-semibold dark:text-gray-300">
              {t("properties.form.fields.building")} *
            </Typography>
            <select
              value={formData.building_id || ""}
              onChange={(e) => setBuilding(e.target.value)}
              disabled={!formData.complex_id}
              className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">{t("common.select") || "Seçin..."}</option>
              {(buildings || []).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Block */}
          <div>
            <Typography variant="small" className="mb-2 font-semibold dark:text-gray-300">
              {t("properties.form.fields.block")} *
            </Typography>
            <select
              value={formData.block_id || ""}
              onChange={(e) => onFieldChange("block_id", e.target.value)}
              disabled={!formData.building_id}
              className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">{t("common.select") || "Seçin..."}</option>
              {(blocks || []).map((bl) => (
                <option key={bl.id} value={bl.id}>
                  {bl.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Meta fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Typography variant="small" className="mb-2 font-semibold dark:text-gray-300">
              {t("properties.form.fields.apartmentNumber")} *
            </Typography>
            <Input
              value={formData.meta?.apartment_number ?? ""}
              onChange={(e) => onFieldChange("meta.apartment_number", e.target.value)}
              className="dark:text-white"
              type="number"
            />
          </div>

          <div>
            <Typography variant="small" className="mb-2 font-semibold dark:text-gray-300">
              {t("properties.form.fields.floor")} *
            </Typography>
            <Input
              value={formData.meta?.floor ?? ""}
              onChange={(e) => onFieldChange("meta.floor", e.target.value)}
              className="dark:text-white"
              type="number"
            />
          </div>

          <div>
            <Typography variant="small" className="mb-2 font-semibold dark:text-gray-300">
              {t("properties.form.fields.area")} *
            </Typography>
            <Input
              value={formData.meta?.area ?? ""}
              onChange={(e) => onFieldChange("meta.area", e.target.value)}
              className="dark:text-white"
              type="number"
            />
          </div>
        </div>

        {/* Type + Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Typography variant="small" className="mb-2 font-semibold dark:text-gray-300">
              {t("properties.form.fields.propertyType")} *
            </Typography>
            <select
              value={formData.property_type ?? 1}
              onChange={(e) => onFieldChange("property_type", e.target.value)}
              className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value={1}>{t("properties.form.types.1")}</option>
              {/* <option value={2}>{t("properties.form.types.2")}</option> */}
            </select>
          </div>

          <div>
            <Typography variant="small" className="mb-2 font-semibold dark:text-gray-300">
              {t("properties.form.fields.status")} *
            </Typography>
            <select
              value={formData.status || "active"}
              onChange={(e) => onFieldChange("status", e.target.value)}
              className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="active">{t("common.active") || "Aktiv"}</option>
              <option value="inactive">{t("common.inactive") || "Passiv"}</option>
            </select>
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="flex justify-end gap-3 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          disabled={saving}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buttons.cancel") || "İmtina"}
        </Button>
        <Button
          color={isEdit ? "blue" : "green"}
          onClick={handleSubmit}
          disabled={saving}
          className={isEdit ? "dark:bg-blue-600 dark:hover:bg-blue-700" : "dark:bg-green-600 dark:hover:bg-green-700"}
        >
          {saving ? (t("buttons.saving") || "Saxlanılır...") : (t("buttons.save") || "Yadda saxla")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
