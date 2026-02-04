import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { XMarkIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { complexAPI } from "../../../complex/api";

export function BuildingsFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false, saving = false }) {
  const { t } = useTranslation();
  const [complexes, setComplexes] = useState([]);
  const [loadingComplexes, setLoadingComplexes] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchComplexes = async () => {
        try {
          setLoadingComplexes(true);
          const response = await complexAPI.getAll({ page: 1 });
          if (response.success && response.data) {
            setComplexes(response.data.data || []);
          }
        } catch (error) {
          console.error("Error fetching complexes:", error);
        } finally {
          setLoadingComplexes(false);
        }
      };
      fetchComplexes();
    }
  }, [open]);

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="md" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
          {title}
        </Typography>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {isEdit ? t("buildings.edit.name") : t("buildings.create.name")}
          </Typography>
          <Input
            placeholder={isEdit ? t("buildings.edit.enterName") : t("buildings.create.enterName")}
            value={formData.name || ""}
            onChange={(e) => onFieldChange("name", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            containerProps={{ className: "!min-w-0" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {isEdit ? t("buildings.edit.complex") : t("buildings.create.complex")}
          </Typography>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <select
                value={formData.complex_id ? String(formData.complex_id) : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  const selectedComplex = complexes.find(c => String(c.id) === value);
                  onFieldChange("complex", selectedComplex || null);
                  onFieldChange("complex_id", selectedComplex?.id || null);
                }}
                disabled={loadingComplexes}
                className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="dark:bg-gray-800 dark:text-gray-300">
                  {t("buildings.form.selectComplex") || "Kompleks seçin"}
                </option>
                {complexes.map((complex) => (
                  <option key={complex.id} value={String(complex.id)} className="dark:bg-gray-800 dark:text-gray-300">
                    {complex.name}
                  </option>
                ))}
              </select>
            </div>
            {formData.complex_id && (
              <button
                type="button"
                onClick={() => {
                  onFieldChange("complex", null);
                  onFieldChange("complex_id", null);
                }}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={t("buttons.clear") || "Təmizlə"}
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {isEdit ? t("buildings.edit.status") : t("buildings.create.status")}
          </Typography>
          <select
            value={formData.status || "active"}
            onChange={(e) => onFieldChange("status", e.target.value)}
            className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="active" className="dark:bg-gray-800 dark:text-gray-300">
              {t("buildings.form.active") || "Aktiv"}
            </option>
            <option value="inactive" className="dark:bg-gray-800 dark:text-gray-300">
              {t("buildings.form.inactive") || "Passiv"}
            </option>
          </select>
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {isEdit ? t("buildings.edit.description") : t("buildings.create.description")}
          </Typography>
          <textarea
            placeholder={isEdit ? t("buildings.edit.enterDescription") : t("buildings.create.enterDescription")}
            value={formData.meta?.desc || ""}
            onChange={(e) => onFieldChange("meta.desc", e.target.value)}
            className="w-full px-3 py-2.5 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 resize-none"
            rows={3}
          />
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          disabled={saving}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {isEdit ? t("buildings.edit.cancel") : t("buildings.create.cancel")}
        </Button>
        <Button
          color={isEdit ? "blue" : "green"}
          onClick={onSave}
          disabled={saving}
          className={isEdit ? "dark:bg-blue-600 dark:hover:bg-blue-700" : "dark:bg-green-600 dark:hover:bg-green-700"}
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
              {isEdit ? t("buildings.edit.saving") || "Saxlanılır..." : t("buildings.create.saving") || "Yaradılır..."}
            </span>
          ) : (
            isEdit ? t("buildings.edit.save") : t("buildings.create.save")
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

