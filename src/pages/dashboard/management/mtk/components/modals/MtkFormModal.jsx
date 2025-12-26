import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Typography,
  Select,
  Option,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import {
  InformationCircleIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";

export function MtkFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false, saving = false }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="xl"
      className="dark:bg-gray-900 border border-red-600 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="dark:bg-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
        <Typography variant="h5" className="font-bold">
          {title}
        </Typography>
      </DialogHeader>
      <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[75vh] overflow-y-auto">
        <div className="space-y-6 py-2">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("mtk.form.basicInfo")}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  {t("mtk.form.name")} <span className="text-red-500">*</span>
                </Typography>
                <Input
                  label={t("mtk.form.enterName")}
                  value={formData.name || ""}
                  onChange={(e) => onFieldChange("name", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  required
                />
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  {t("mtk.form.status")} <span className="text-red-500">*</span>
                </Typography>
                <Select
                  value={formData.status || "active"}
                  onChange={(value) => onFieldChange("status", value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                >
                  <Option value="active">{t("mtk.form.active")}</Option>
                  <Option value="inactive">{t("mtk.form.inactive")}</Option>
                </Select>
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <MapPinIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("mtk.form.metaInfo")}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  {t("mtk.form.latitude")}
                </Typography>
                <Input
                  label={t("mtk.form.enterLatitude")}
                  value={formData.meta?.lat || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Validation: -90 ilə 90 arasında olmalıdır
                    if (value === "" || (!isNaN(parseFloat(value)) && parseFloat(value) >= -90 && parseFloat(value) <= 90)) {
                      onFieldChange("meta.lat", value);
                    }
                  }}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                  placeholder="-90 ilə 90 arası"
                />
                {formData.meta?.lat && !isNaN(parseFloat(formData.meta.lat)) && (parseFloat(formData.meta.lat) < -90 || parseFloat(formData.meta.lat) > 90) && (
                  <Typography variant="small" className="text-red-500 mt-1">
                    {t("mtk.form.latValidation")}
                  </Typography>
                )}
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  {t("mtk.form.longitude")}
                </Typography>
                <Input
                  label={t("mtk.form.enterLongitude")}
                  value={formData.meta?.lng || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Validation: -180 ilə 180 arasında olmalıdır
                    if (value === "" || (!isNaN(parseFloat(value)) && parseFloat(value) >= -180 && parseFloat(value) <= 180)) {
                      onFieldChange("meta.lng", value);
                    }
                  }}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  type="number"
                  step="any"
                  min="-180"
                  max="180"
                  placeholder="-180 ilə 180 arası"
                />
                {formData.meta?.lng && !isNaN(parseFloat(formData.meta.lng)) && (parseFloat(formData.meta.lng) < -180 || parseFloat(formData.meta.lng) > 180) && (
                  <Typography variant="small" className="text-red-500 mt-1">
                    {t("mtk.form.lngValidation")}
                  </Typography>
                )}
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  {t("mtk.form.description")}
                </Typography>
                <textarea
                  placeholder={t("mtk.form.enterDescription")}
                  value={formData.meta?.desc || ""}
                  onChange={(e) => onFieldChange("meta.desc", e.target.value)}
                  className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 resize-none"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  {t("mtk.form.address")}
                </Typography>
                <Input
                  label={t("mtk.form.enterAddress")}
                  value={formData.meta?.address || ""}
                  onChange={(e) => onFieldChange("meta.address", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <EnvelopeIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("mtk.form.contactInfo") || "Əlaqə Məlumatları"}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                  {t("mtk.form.email")}
                </Typography>
                <Input
                  label={t("mtk.form.enterEmail")}
                  value={formData.meta?.email || ""}
                  onChange={(e) => onFieldChange("meta.email", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  type="email"
                />
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  <PhoneIcon className="h-4 w-4 inline mr-1" />
                  {t("mtk.form.phone")}
                </Typography>
                <Input
                  label={t("mtk.form.enterPhone")}
                  value={formData.meta?.phone || ""}
                  onChange={(e) => onFieldChange("meta.phone", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  type="tel"
                />
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  <GlobeAltIcon className="h-4 w-4 inline mr-1" />
                  {t("mtk.form.website")}
                </Typography>
                <Input
                  label={t("mtk.form.enterWebsite")}
                  value={formData.meta?.website || ""}
                  onChange={(e) => onFieldChange("meta.website", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  type="url"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Color Code Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <SwatchIcon className="h-5 w-5 text-pink-500 dark:text-pink-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("mtk.form.colorCode")}
              </Typography>
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                {t("mtk.form.enterColorCode")}
              </Typography>
              <div className="flex gap-3 items-end">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {t("mtk.form.colorPicker") || "Rəng seçin"}
                  </label>
                  <input
                    type="color"
                    value={formData.meta?.color_code || "#237832"}
                    onChange={(e) => onFieldChange("meta.color_code", e.target.value)}
                    className="w-16 h-12 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label={t("mtk.form.enterColorCode")}
                    value={formData.meta?.color_code || ""}
                    onChange={(e) => onFieldChange("meta.color_code", e.target.value)}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    placeholder="#237832"
                    pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                  />
                </div>
                {formData.meta?.color_code && (
                  <div
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: formData.meta.color_code }}
                    title={formData.meta.color_code}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-3 dark:bg-gray-800 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          disabled={saving}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 min-w-[100px]"
        >
          {isEdit ? t("mtk.edit.cancel") : t("mtk.create.cancel")}
        </Button>
        <Button
          color={isEdit ? "blue" : "green"}
          onClick={onSave}
          disabled={saving}
          className={`min-w-[120px] ${
            isEdit
              ? "dark:bg-blue-600 dark:hover:bg-blue-700"
              : "dark:bg-green-600 dark:hover:bg-green-700"
          }`}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("mtk.saving")}
            </span>
          ) : (
            isEdit ? t("mtk.edit.save") : t("mtk.create.save")
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

