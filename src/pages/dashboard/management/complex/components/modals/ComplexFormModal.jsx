import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  InformationCircleIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ComplexFormModal({
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

  if (!open) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="xl"
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
      <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[75vh] overflow-y-auto">
        <div className="space-y-6 py-2">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("complexes.form.basicInfo") || "Əsas Məlumatlar"}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("complexes.form.name")} <span className="text-red-500">*</span>
                </Typography>
                <Input
                  placeholder={t("complexes.form.enterName")}
                  value={formData.name || ""}
                  onChange={(e) => onFieldChange("name", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  containerProps={{ className: "!min-w-0" }}
                  required
                />
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("complexes.form.status")} <span className="text-red-500">*</span>
                </Typography>
                <select
                  value={formData.status || "active"}
                  onChange={(e) => onFieldChange("status", e.target.value)}
                  className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option value="active" className="dark:bg-gray-800 dark:text-gray-300">
                    {t("complexes.form.active") || "Aktiv"}
                  </option>
                  <option value="inactive" className="dark:bg-gray-800 dark:text-gray-300">
                    {t("complexes.form.inactive") || "Passiv"}
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <MapPinIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("complexes.form.metaInfo") || "Yerləşmə Məlumatları"}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("complexes.form.latitude") || "Enlik"}
                </Typography>
                <Input
                  placeholder={t("complexes.form.enterLatitude") || "Enlik daxil edin"}
                  value={formData.meta?.lat || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === "" ||
                      (!isNaN(parseFloat(value)) && parseFloat(value) >= -90 && parseFloat(value) <= 90)
                    ) {
                      onFieldChange("meta.lat", value);
                    }
                  }}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  containerProps={{ className: "!min-w-0" }}
                  type="number"
                  step="any"
                  min="-90"
                  max="90"
                />
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  {t("complexes.form.longitude") || "Uzunluq"}
                </Typography>
                <Input
                  label={t("complexes.form.enterLongitude") || "Uzunluq daxil edin"}
                  value={formData.meta?.lng || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      value === "" ||
                      (!isNaN(parseFloat(value)) && parseFloat(value) >= -180 && parseFloat(value) <= 180)
                    ) {
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
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  {t("complexes.form.description") || "Təsvir"}
                </Typography>
                <textarea
                  placeholder={t("complexes.form.enterDescription") || "Təsvir daxil edin"}
                  value={formData.meta?.desc || ""}
                  onChange={(e) => onFieldChange("meta.desc", e.target.value)}
                  className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 resize-none"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  {t("complexes.form.address") || "Ünvan"}
                </Typography>
                <Input
                  label={t("complexes.form.enterAddress") || "Ünvan daxil edin"}
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
                {t("complexes.form.contactInfo") || "Əlaqə Məlumatları"}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                  <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                  {t("complexes.form.email") || "Email"}
                </Typography>
                <Input
                  label={t("complexes.form.enterEmail") || "Email daxil edin"}
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
                  {t("complexes.form.phone") || "Telefon"}
                </Typography>
                <Input
                  label={t("complexes.form.enterPhone") || "Telefon daxil edin"}
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
                  {t("complexes.form.website") || "Veb sayt"}
                </Typography>
                <Input
                  label={t("complexes.form.enterWebsite") || "Veb sayt daxil edin"}
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
                {t("complexes.form.colorCode") || "Rəng Kodu"}
              </Typography>
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-300">
                {t("complexes.form.enterColorCode") || "Rəng kodu daxil edin"}
              </Typography>
              <div className="flex gap-3 items-end">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {t("complexes.form.colorPicker") || "Rəng seçin"}
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
                    label={t("complexes.form.enterColorCode") || "Rəng kodu"}
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
      <DialogFooter className="flex justify-end gap-3 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          disabled={saving}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 min-w-[100px]"
        >
          {isEdit ? t("complexes.edit.cancel") : t("complexes.create.cancel")}
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
              {isEdit
                ? t("complexes.edit.saving") || "Saxlanılır..."
                : t("complexes.create.saving") || "Saxlanılır..."}
            </span>
          ) : (
            isEdit ? t("complexes.edit.save") : t("complexes.create.save")
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
