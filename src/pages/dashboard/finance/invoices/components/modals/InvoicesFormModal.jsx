import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { XMarkIcon, XCircleIcon, BuildingOfficeIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function InvoicesFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false, saving = false }) {
  const { t } = useTranslation();
  const [buildings, setBuildings] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingApartments, setLoadingApartments] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open) {
      const fetchBuildings = async () => {
        try {
          setLoadingBuildings(true);
          const response = await buildingsAPI.getAll({ page: 1, per_page: 1000 });
          if (response.success && response.data) {
            setBuildings(response.data.data || []);
          }
        } catch (error) {
          console.error("Error fetching buildings:", error);
        } finally {
          setLoadingBuildings(false);
        }
      };
      fetchBuildings();
      setErrors({});
      setTouched({});
    }
  }, [open]);

  useEffect(() => {
    if (open && formData.building_id) {
      setBlocks([
        { id: 1, name: "Blok A" },
        { id: 2, name: "Blok B" },
        { id: 3, name: "Blok C" },
      ]);
    } else {
      setBlocks([]);
      setApartments([]);
    }
  }, [open, formData.building_id]);

  useEffect(() => {
    if (open && formData.block_id) {
      setApartments([
        { id: 1, name: "Mənzil 1" },
        { id: 2, name: "Mənzil 2" },
        { id: 3, name: "Mənzil 3" },
      ]);
    } else {
      setApartments([]);
    }
  }, [open, formData.block_id]);

  useEffect(() => {
    if (formData.dateStart && formData.dateEnd && formData.dateEnd < formData.dateStart) {
      setErrors((prev) => ({
        ...prev,
        dateEnd: t("invoices.form.dateEndError") || "Bitmə tarixi başlama tarixindən sonra olmalıdır",
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.dateEnd;
        return newErrors;
      });
    }
  }, [formData.dateStart, formData.dateEnd, t]);

  if (!open) return null;

  const handleFloorChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
      onFieldChange("floor", value);
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case "building_id":
        if (!formData.building_id) {
          newErrors.building_id = t("invoices.form.required") || "Bu sahə mütləqdir";
        } else {
          delete newErrors.building_id;
        }
        break;
      case "block_id":
        if (!formData.block_id) {
          newErrors.block_id = t("invoices.form.required") || "Bu sahə mütləqdir";
        } else {
          delete newErrors.block_id;
        }
        break;
      case "floor":
        if (!formData.floor || formData.floor === "") {
          newErrors.floor = t("invoices.form.required") || "Bu sahə mütləqdir";
        } else if (parseFloat(formData.floor) < 0) {
          newErrors.floor = t("invoices.form.floorError") || "Mərtəbə mənfi ola bilməz";
        } else {
          delete newErrors.floor;
        }
        break;
      case "apartment_id":
        if (!formData.apartment_id) {
          newErrors.apartment_id = t("invoices.form.required") || "Bu sahə mütləqdir";
        } else {
          delete newErrors.apartment_id;
        }
        break;
      case "amount":
        if (formData.amount && parseFloat(formData.amount) < 0) {
          newErrors.amount = t("invoices.form.amountError") || "Məbləğ mənfi ola bilməz";
        } else {
          delete newErrors.amount;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleSave = () => {
    const requiredFields = ["building_id", "block_id", "floor", "apartment_id"];
    const newErrors = {};
    let hasErrors = false;

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field] === "") {
        newErrors[field] = t("invoices.form.required") || "Bu sahə mütləqdir";
        hasErrors = true;
      }
    });

    if (formData.dateStart && formData.dateEnd && formData.dateEnd < formData.dateStart) {
      newErrors.dateEnd = t("invoices.form.dateEndError") || "Bitmə tarixi başlama tarixindən sonra olmalıdır";
      hasErrors = true;
    }

    setErrors(newErrors);
    setTouched({
      building_id: true,
      block_id: true,
      floor: true,
      apartment_id: true,
    });

    if (!hasErrors) {
      onSave();
    }
  };

  const hasError = (field) => touched[field] && errors[field];

  return (
    <Dialog open={open} handler={onClose} size="xl" className="dark:bg-gray-900" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:bg-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BuildingOfficeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <Typography variant="h5" className="font-bold">
            {title}
          </Typography>
        </div>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="h-5 w-5 text-gray-700 dark:text-white" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-6 dark:bg-gray-800 dark:border-gray-700 max-h-[75vh] overflow-y-auto py-6 px-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <Typography variant="h6" className="font-semibold dark:text-white">
              {t("invoices.form.basicInfo") || "Əsas Məlumatlar"}
            </Typography>
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-1.5 font-medium dark:text-gray-300">
              {t("invoices.form.title") || "Başlıq"}
            </Typography>
            <Input
              label={t("invoices.form.enterTitle") || "Başlıq"}
              value={formData.title || ""}
              onChange={(e) => onFieldChange("title", e.target.value)}
              onBlur={() => handleBlur("title")}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              error={hasError("title")}
            />
            {hasError("title") && (
              <Typography variant="small" className="mt-1 text-red-500">
                {errors.title}
              </Typography>
            )}
          </div>

          <div>
            <Typography variant="small" color="blue-gray" className="mb-1.5 font-medium dark:text-gray-300">
              {t("invoices.form.amount") || "Məbləğ (AZN)"}
            </Typography>
            <Input
              type="number"
              label={t("invoices.form.enterAmount") || "Məbləğ"}
              value={formData.amount || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || (!isNaN(value) && parseFloat(value) >= 0)) {
                  onFieldChange("amount", value);
                  validateField("amount");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                  e.preventDefault();
                }
              }}
              onBlur={() => handleBlur("amount")}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              min="0"
              step="0.01"
              error={hasError("amount")}
            />
            {hasError("amount") && (
              <Typography variant="small" className="mt-1 text-red-500">
                {errors.amount}
              </Typography>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Typography variant="small" color="blue-gray" className="font-medium dark:text-gray-300">
                {t("invoices.form.dateRange") || "Tarix aralığı"}
              </Typography>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  type="date"
                  label={t("invoices.form.startDate") || "Başlama tarixi"}
                  value={formData.dateStart || ""}
                  onChange={(e) => onFieldChange("dateStart", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                />
              </div>
              <div>
                <Input
                  type="date"
                  label={t("invoices.form.endDate") || "Bitmə tarixi"}
                  value={formData.dateEnd || ""}
                  onChange={(e) => onFieldChange("dateEnd", e.target.value)}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  error={hasError("dateEnd")}
                />
                {hasError("dateEnd") && (
                  <Typography variant="small" className="mt-1 text-red-500">
                    {errors.dateEnd}
                  </Typography>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <Typography variant="h6" className="font-semibold dark:text-white">
              {t("invoices.form.apartmentInfo") || "Mənzil Məlumatları"}
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1.5 font-medium dark:text-gray-300">
                {t("invoices.form.building") || "Bina"}
                <span className="text-red-500 ml-1">*</span>
              </Typography>
              <div className="flex items-center gap-2">
                <select
                  value={formData.building_id ? String(formData.building_id) : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const selectedBuilding = buildings.find((b) => String(b.id) === value);
                    onFieldChange("building", selectedBuilding || null);
                    onFieldChange("building_id", selectedBuilding?.id || null);
                    onFieldChange("block_id", null);
                    onFieldChange("block", null);
                    onFieldChange("apartment_id", null);
                    onFieldChange("apartment", null);
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.building_id;
                      return newErrors;
                    });
                  }}
                  onBlur={() => handleBlur("building_id")}
                  disabled={loadingBuildings}
                  className={`flex-1 px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                    hasError("building_id")
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <option value="" disabled>
                    {loadingBuildings
                      ? t("invoices.form.loading") || "Yüklənir..."
                      : t("invoices.form.selectBuilding") || "Bina seçin..."}
                  </option>
                  {buildings.map((building) => (
                    <option key={building.id} value={String(building.id)}>
                      {building.name}
                    </option>
                  ))}
                </select>
                {formData.building_id && (
                  <button
                    type="button"
                    onClick={() => {
                      onFieldChange("building", null);
                      onFieldChange("building_id", null);
                      onFieldChange("block_id", null);
                      onFieldChange("block", null);
                      onFieldChange("apartment_id", null);
                      onFieldChange("apartment", null);
                    }}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={t("buttons.clear") || "Təmizlə"}
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              {hasError("building_id") && (
                <Typography variant="small" className="mt-1 text-red-500">
                  {errors.building_id}
                </Typography>
              )}
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-1.5 font-medium dark:text-gray-300">
                {t("invoices.form.block") || "Blok"}
                <span className="text-red-500 ml-1">*</span>
              </Typography>
              <div className="flex items-center gap-2">
                <select
                  value={formData.block_id ? String(formData.block_id) : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const selectedBlock = blocks.find((b) => String(b.id) === value);
                    onFieldChange("block", selectedBlock || null);
                    onFieldChange("block_id", selectedBlock?.id || null);
                    onFieldChange("apartment_id", null);
                    onFieldChange("apartment", null);
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.block_id;
                      return newErrors;
                    });
                  }}
                  onBlur={() => handleBlur("block_id")}
                  disabled={loadingBlocks || !formData.building_id}
                  className={`flex-1 px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                    hasError("block_id")
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <option value="" disabled>
                    {!formData.building_id
                      ? t("invoices.form.selectBuildingFirst") || "Əvvəlcə bina seçin"
                      : loadingBlocks
                      ? t("invoices.form.loading") || "Yüklənir..."
                      : t("invoices.form.selectBlock") || "Blok seçin"}
                  </option>
                  {blocks.map((block) => (
                    <option key={block.id} value={String(block.id)}>
                      {block.name}
                    </option>
                  ))}
                </select>
                {formData.block_id && (
                  <button
                    type="button"
                    onClick={() => {
                      onFieldChange("block", null);
                      onFieldChange("block_id", null);
                      onFieldChange("apartment_id", null);
                      onFieldChange("apartment", null);
                    }}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={t("buttons.clear") || "Təmizlə"}
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              {hasError("block_id") && (
                <Typography variant="small" className="mt-1 text-red-500">
                  {errors.block_id}
                </Typography>
              )}
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-1.5 font-medium dark:text-gray-300">
                {t("invoices.form.floor") || "Mərtəbə"}
                <span className="text-red-500 ml-1">*</span>
              </Typography>
              <Input
                type="number"
                label={t("invoices.form.enterFloor") || "Mərtəbə daxil edin..."}
                value={formData.floor || ""}
                onChange={handleFloorChange}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                    e.preventDefault();
                  }
                }}
                onBlur={() => handleBlur("floor")}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                min="0"
                error={hasError("floor")}
              />
              {hasError("floor") && (
                <Typography variant="small" className="mt-1 text-red-500">
                  {errors.floor}
                </Typography>
              )}
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-1.5 font-medium dark:text-gray-300">
                {t("invoices.form.apartment") || "Mənzil"}
                <span className="text-red-500 ml-1">*</span>
              </Typography>
              <div className="flex items-center gap-2">
                <select
                  value={formData.apartment_id ? String(formData.apartment_id) : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const selectedApartment = apartments.find((a) => String(a.id) === value);
                    onFieldChange("apartment", selectedApartment || null);
                    onFieldChange("apartment_id", selectedApartment?.id || null);
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.apartment_id;
                      return newErrors;
                    });
                  }}
                  onBlur={() => handleBlur("apartment_id")}
                  disabled={loadingApartments || !formData.block_id}
                  className={`flex-1 px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
                    hasError("apartment_id")
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <option value="" disabled>
                    {!formData.block_id
                      ? t("invoices.form.selectBlockFirst") || "Əvvəlcə blok seçin"
                      : loadingApartments
                      ? t("invoices.form.loading") || "Yüklənir..."
                      : t("invoices.form.selectApartment") || "Mənzil seçin..."}
                  </option>
                  {apartments.map((apartment) => (
                    <option key={apartment.id} value={String(apartment.id)}>
                      {apartment.name}
                    </option>
                  ))}
                </select>
                {formData.apartment_id && (
                  <button
                    type="button"
                    onClick={() => {
                      onFieldChange("apartment", null);
                      onFieldChange("apartment_id", null);
                    }}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={t("buttons.clear") || "Təmizlə"}
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              {hasError("apartment_id") && (
                <Typography variant="small" className="mt-1 text-red-500">
                  {errors.apartment_id}
                </Typography>
              )}
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-between items-center gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4 px-6">
        <Typography variant="small" className="text-gray-500 dark:text-gray-400">
          <span className="text-red-500">*</span> {t("invoices.form.requiredFields") || "Mütləq sahələr"}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={onClose}
            disabled={saving}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            color="green"
            onClick={handleSave}
            disabled={saving}
            className="dark:bg-green-600 dark:hover:bg-green-700 border border-green-300 dark:border-green-500 shadow-md hover:shadow-lg transition-all"
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
                {t("invoices.form.saving") || "Saxlanılır..."}
              </span>
            ) : (
              t("invoices.form.confirm") || "Təsdiq et"
            )}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
}
