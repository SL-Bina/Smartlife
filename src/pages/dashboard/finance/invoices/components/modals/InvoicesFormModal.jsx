import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography, Spinner } from "@material-tailwind/react";
import { XMarkIcon, XCircleIcon, BuildingOfficeIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import api from "@/services/api";
import buildingsAPI from "@/pages/dashboard/management/buildings/api";
import blocksAPI from "@/pages/dashboard/management/blocks/api";
import propertiesAPI from "@/pages/dashboard/management/properties/api";

export function InvoicesFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false, saving = false, formLoading = false }) {
  const { t } = useTranslation();
  const [buildings, setBuildings] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [properties, setProperties] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Set z-index for portal container when modal is open
  useEffect(() => {
    if (open) {
      // Find all dialog elements and their portal containers
      const setDialogZIndex = () => {
        // Find dialog by role
        const dialogs = document.querySelectorAll('div[role="dialog"]');
        dialogs.forEach((dialog) => {
          // Set z-index on dialog itself
          if (dialog instanceof HTMLElement) {
            dialog.style.zIndex = '999999';
          }
          // Find parent portal container
          let parent = dialog.parentElement;
          while (parent && parent !== document.body) {
            if (parent instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(parent);
              if (computedStyle.position === 'fixed' || computedStyle.position === 'absolute') {
                parent.style.zIndex = '999999';
              }
            }
            parent = parent.parentElement;
          }
        });
        
        // Find backdrop elements
        const backdrops = document.querySelectorAll('[class*="backdrop"]');
        backdrops.forEach((backdrop) => {
          if (backdrop instanceof HTMLElement) {
            backdrop.style.zIndex = '999998';
          }
        });
      };
      
      // Set immediately and also after a short delay (for portal rendering)
      setDialogZIndex();
      const timeout = setTimeout(setDialogZIndex, 10);
      
      return () => clearTimeout(timeout);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setErrors({});
      setTouched({});
    }
  }, [open]);

  // Load buildings on modal open
  useEffect(() => {
    if (open) {
      setLoadingBuildings(true);
      buildingsAPI.getAll({ per_page: 1000 })
        .then((response) => {
          setBuildings(response?.data?.data?.data || []);
        })
        .catch((error) => {
          console.error("Error loading buildings:", error);
          setBuildings([]);
        })
        .finally(() => {
          setLoadingBuildings(false);
        });
    }
  }, [open]);

  // Load blocks when building is selected
  useEffect(() => {
    if (open && formData.building_id) {
      setLoadingBlocks(true);
      blocksAPI.getAll({ building_id: formData.building_id, per_page: 1000 })
        .then((response) => {
          setBlocks(response?.data?.data?.data || []);
        })
        .catch((error) => {
          console.error("Error loading blocks:", error);
          setBlocks([]);
        })
        .finally(() => {
          setLoadingBlocks(false);
        });
    } else {
      setBlocks([]);
      setProperties([]);
    }
  }, [open, formData.building_id]);

  // Load properties when block is selected
  useEffect(() => {
    if (open && formData.block_id) {
      setLoadingProperties(true);
      propertiesAPI.getAll({ block_id: formData.block_id, per_page: 1000 })
        .then((response) => {
          setProperties(response?.data?.data?.data || []);
        })
        .catch((error) => {
          console.error("Error loading properties:", error);
          setProperties([]);
        })
        .finally(() => {
          setLoadingProperties(false);
        });
    } else {
      setProperties([]);
    }
  }, [open, formData.block_id]);

  // Load services on modal open
  useEffect(() => {
    if (open) {
      setLoadingServices(true);
      api.get("/module/services/list", { params: { per_page: 1000 } })
        .then((response) => {
          setServices(response?.data?.data?.data || []);
        })
        .catch((error) => {
          console.error("Error loading services:", error);
          setServices([]);
        })
        .finally(() => {
          setLoadingServices(false);
        });
    }
  }, [open]);

  useEffect(() => {
    if (formData.start_date && formData.due_date && formData.due_date < formData.start_date) {
      setErrors((prev) => ({
        ...prev,
        due_date: t("invoices.form.dateEndError") || "Son tarix başlama tarixindən sonra olmalıdır",
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.due_date;
        return newErrors;
      });
    }
  }, [formData.start_date, formData.due_date, t]);

  if (!open) return null;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case "property_id":
        if (!formData.property_id) {
          newErrors.property_id = t("invoices.form.required") || "Bu sahə mütləqdir";
        } else {
          delete newErrors.property_id;
        }
        break;
      case "service_id":
        if (!formData.service_id) {
          newErrors.service_id = t("invoices.form.required") || "Bu sahə mütləqdir";
        } else {
          delete newErrors.service_id;
        }
        break;
      case "amount":
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
          newErrors.amount = t("invoices.form.amountError") || "Məbləğ düzgün daxil edilməlidir";
        } else {
          delete newErrors.amount;
        }
        break;
      case "start_date":
        if (!formData.start_date) {
          newErrors.start_date = t("invoices.form.required") || "Bu sahə mütləqdir";
        } else {
          delete newErrors.start_date;
        }
        break;
      case "due_date":
        if (!formData.due_date) {
          newErrors.due_date = t("invoices.form.required") || "Bu sahə mütləqdir";
        } else if (formData.start_date && formData.due_date < formData.start_date) {
          newErrors.due_date = t("invoices.form.dateEndError") || "Son tarix başlama tarixindən sonra olmalıdır";
        } else {
          delete newErrors.due_date;
        }
        break;
      case "type":
        if (!formData.type) {
          newErrors.type = t("invoices.form.required") || "Bu sahə mütləqdir";
        } else {
          delete newErrors.type;
        }
        break;
      case "status":
        if (!formData.status) {
          newErrors.status = t("invoices.form.required") || "Bu sahə mütləqdir";
        } else {
          delete newErrors.status;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  const handleSave = () => {
    const newErrors = {};
    let hasErrors = false;

    // Validate required fields
    if (!formData.service_id) {
      newErrors.service_id = t("invoices.form.required") || "Bu sahə mütləqdir";
      hasErrors = true;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = t("invoices.form.amountError") || "Məbləğ düzgün daxil edilməlidir";
      hasErrors = true;
    }

    if (!formData.start_date) {
      newErrors.start_date = t("invoices.form.required") || "Bu sahə mütləqdir";
      hasErrors = true;
    }

    if (!formData.due_date) {
      newErrors.due_date = t("invoices.form.required") || "Bu sahə mütləqdir";
      hasErrors = true;
    }

    if (!formData.type) {
      newErrors.type = t("invoices.form.required") || "Bu sahə mütləqdir";
      hasErrors = true;
    }

    if (!formData.status) {
      newErrors.status = t("invoices.form.required") || "Bu sahə mütləqdir";
      hasErrors = true;
    }

    if (!formData.property_id) {
      newErrors.property_id = t("invoices.form.required") || "Bu sahə mütləqdir";
      hasErrors = true;
    }

    // Validate date range
    if (formData.start_date && formData.due_date && formData.due_date < formData.start_date) {
      newErrors.due_date = t("invoices.form.dateEndError") || "Son tarix başlama tarixindən sonra olmalıdır";
      hasErrors = true;
    }

    setErrors(newErrors);
    setTouched({
      property_id: true,
      service_id: true,
      amount: true,
      start_date: true,
      due_date: true,
      type: true,
      status: true,
    });

    if (!hasErrors) {
      onSave();
    }
  };

  const hasError = (field) => touched[field] && errors[field];

  return (
    <Dialog 
      open={open} 
      handler={onClose} 
      size="xl" 
      className="dark:bg-gray-900 max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl" 
      dismiss={{ enabled: false }} 
      style={{ zIndex: 999999 }}
    >
      <DialogHeader className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white border-0 pb-4 sm:pb-5 flex items-center justify-between flex-shrink-0 px-5 sm:px-7 shadow-lg">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <div className="p-2 sm:p-2.5 bg-white/20 dark:bg-white/10 rounded-xl flex-shrink-0 backdrop-blur-sm shadow-md">
            <BuildingOfficeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <Typography variant="h5" className="font-bold text-base sm:text-lg md:text-xl truncate text-white drop-shadow-sm">
            {title}
          </Typography>
        </div>
        <div className="cursor-pointer p-2 sm:p-2.5 rounded-xl transition-all hover:bg-white/20 dark:hover:bg-white/10 flex-shrink-0 backdrop-blur-sm" onClick={onClose}>
          <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-6 dark:bg-gray-900 dark:border-gray-700 overflow-y-auto flex-1 min-h-0 py-5 sm:py-7 px-5 sm:px-7 scrollbar-thin bg-gray-50">
        {formLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[240px] gap-4 py-8">
            <Spinner className="h-12 w-12 text-blue-500" />
            <Typography variant="paragraph" className="text-gray-600 dark:text-gray-400">
              {t("invoices.form.loading") || "Yüklənir..."}
            </Typography>
          </div>
        ) : (
          <>
          <div className="space-y-5 bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-200 dark:border-blue-700">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BuildingOfficeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="h6" className="font-bold text-gray-800 dark:text-white text-lg">
                {t("invoices.form.basicInfo") || "Əsas Məlumatlar"}
              </Typography>
            </div>

            <div className="space-y-2">
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold text-gray-700 dark:text-gray-300 text-sm">
              {t("invoices.form.service") || "Xidmət"}
              <span className="text-red-500 ml-1 font-bold">*</span>
            </Typography>
            <select
              value={formData.service_id ? String(formData.service_id) : ""}
              onChange={(e) => {
                const value = e.target.value;
                onFieldChange("service_id", value ? Number(value) : null);
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.service_id;
                  return newErrors;
                });
              }}
              onBlur={() => handleBlur("service_id")}
              disabled={loadingServices}
              className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                hasError("service_id")
                  ? "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <option value="" disabled>
                {loadingServices ? (t("invoices.form.loading") || "Yüklənir...") : (t("invoices.form.selectService") || "Xidmət seçin...")}
              </option>
              {services.map((service) => (
                <option key={service.id} value={String(service.id)}>
                  {service.name}
                </option>
              ))}
            </select>
            {hasError("service_id") && (
              <Typography variant="small" className="mt-1.5 text-red-500 font-medium">
                {errors.service_id}
              </Typography>
            )}
          </div>

          <div className="space-y-2">
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold text-gray-700 dark:text-gray-300 text-sm">
              {t("invoices.form.amount") || "Məbləğ (AZN)"}
              <span className="text-red-500 ml-1 font-bold">*</span>
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
              className="dark:text-white !border-2"
              labelProps={{ className: "dark:text-gray-400" }}
              min="0"
              step="0.01"
              error={hasError("amount")}
              containerProps={{ className: "!min-w-0" }}
            />
            {hasError("amount") && (
              <Typography variant="small" className="mt-1.5 text-red-500 font-medium">
                {errors.amount}
              </Typography>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Typography variant="small" color="blue-gray" className="font-bold text-gray-800 dark:text-gray-300 text-base">
                {t("invoices.form.dateRange") || "Tarix aralığı"}
              </Typography>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  {t("invoices.form.startDate") || "Başlama tarixi"}
                  <span className="text-red-500 ml-1 font-bold">*</span>
                </Typography>
                <Input
                  type="date"
                  label={t("invoices.form.startDate") || "Başlama tarixi"}
                  value={formData.start_date || ""}
                  onChange={(e) => onFieldChange("start_date", e.target.value)}
                  onBlur={() => handleBlur("start_date")}
                  className="dark:text-white !border-2"
                  labelProps={{ className: "dark:text-gray-400" }}
                  error={hasError("start_date")}
                  containerProps={{ className: "!min-w-0" }}
                />
                {hasError("start_date") && (
                  <Typography variant="small" className="mt-1.5 text-red-500 font-medium">
                    {errors.start_date}
                  </Typography>
                )}
              </div>
              <div className="space-y-2">
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  {t("invoices.form.dueDate") || "Son tarix"}
                  <span className="text-red-500 ml-1 font-bold">*</span>
                </Typography>
                <Input
                  type="date"
                  label={t("invoices.form.dueDate") || "Son tarix"}
                  value={formData.due_date || ""}
                  onChange={(e) => onFieldChange("due_date", e.target.value)}
                  onBlur={() => handleBlur("due_date")}
                  className="dark:text-white !border-2"
                  labelProps={{ className: "dark:text-gray-400" }}
                  error={hasError("due_date")}
                  containerProps={{ className: "!min-w-0" }}
                />
                {hasError("due_date") && (
                  <Typography variant="small" className="mt-1.5 text-red-500 font-medium">
                    {errors.due_date}
                  </Typography>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  {t("invoices.form.type") || "Tip"}
                  <span className="text-red-500 ml-1 font-bold">*</span>
                </Typography>
                <select
                  value={formData.type || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    onFieldChange("type", value);
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.type;
                      return newErrors;
                    });
                  }}
                  onBlur={() => handleBlur("type")}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 ${
                    hasError("type")
                      ? "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <option value="" disabled>{t("invoices.form.selectType") || "Tip seçin..."}</option>
                  <option value="daily">{t("invoices.form.types.daily") || "Günlük"}</option>
                  <option value="weekly">{t("invoices.form.types.weekly") || "Həftəlik"}</option>
                  <option value="monthly">{t("invoices.form.types.monthly") || "Aylıq"}</option>
                  <option value="quarterly">{t("invoices.form.types.quarterly") || "Rüblük"}</option>
                  <option value="yearly">{t("invoices.form.types.yearly") || "İllik"}</option>
                  <option value="one_time">{t("invoices.form.types.one_time") || "Bir dəfəlik"}</option>
                  <option value="biannually">{t("invoices.form.types.biannually") || "Yarımillik"}</option>
                </select>
                {hasError("type") && (
                  <Typography variant="small" className="mt-1.5 text-red-500 font-medium">
                    {errors.type}
                  </Typography>
                )}
              </div>
              <div className="space-y-2">
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                  {t("invoices.form.status") || "Status"}
                  <span className="text-red-500 ml-1 font-bold">*</span>
                </Typography>
                <select
                  value={formData.status || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    onFieldChange("status", value);
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.status;
                      return newErrors;
                    });
                  }}
                  onBlur={() => handleBlur("status")}
                  className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 ${
                    hasError("status")
                      ? "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <option value="" disabled>{t("invoices.form.selectStatus") || "Status seçin..."}</option>
                  <option value="pending">{t("invoices.form.statuses.pending") || "Gözləyir"}</option>
                  <option value="pre_paid">{t("invoices.form.statuses.pre_paid") || "Ön ödəniş"}</option>
                  <option value="paid">{t("invoices.form.statuses.paid") || "Ödənilib"}</option>
                  <option value="overdue">{t("invoices.form.statuses.overdue") || "Gecikmiş"}</option>
                  <option value="declined">{t("invoices.form.statuses.declined") || "Rədd edilib"}</option>
                  <option value="unpaid">{t("invoices.form.statuses.unpaid") || "Ödənilməmiş"}</option>
                  <option value="draft">{t("invoices.form.statuses.draft") || "Qaralama"}</option>
                </select>
                {hasError("status") && (
                  <Typography variant="small" className="mt-1.5 text-red-500 font-medium">
                    {errors.status}
                  </Typography>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                {t("invoices.form.description") || "Təsvir"}
              </Typography>
              <Input
                label={t("invoices.form.enterDescription") || "Təsvir daxil edin..."}
                value={formData.meta?.desc || ""}
                onChange={(e) => onFieldChange("meta.desc", e.target.value)}
                className="dark:text-white !border-2"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-5 bg-white dark:bg-gray-800 rounded-xl p-5 sm:p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 pb-3 border-b-2 border-green-200 dark:border-green-700">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <BuildingOfficeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <Typography variant="h6" className="font-bold text-gray-800 dark:text-white text-lg">
              {t("invoices.form.apartmentInfo") || "Mənzil Məlumatları"}
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                {t("invoices.form.building") || "Bina"}
                <span className="text-red-500 ml-1 font-bold">*</span>
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
                    onFieldChange("property_id", null);
                    onFieldChange("property", null);
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.building_id;
                      return newErrors;
                    });
                  }}
                  onBlur={() => handleBlur("building_id")}
                  disabled={loadingBuildings}
                  className={`flex-1 px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    hasError("building_id")
                      ? "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
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
                      onFieldChange("property_id", null);
                      onFieldChange("property", null);
                    }}
                    className="flex-shrink-0 p-2.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm hover:shadow-md"
                    title={t("buttons.clear") || "Təmizlə"}
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              {hasError("building_id") && (
                <Typography variant="small" className="mt-1.5 text-red-500 font-medium">
                  {errors.building_id}
                </Typography>
              )}
            </div>

            <div className="space-y-2">
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                {t("invoices.form.block") || "Blok"}
                <span className="text-red-500 ml-1 font-bold">*</span>
              </Typography>
              <div className="flex items-center gap-2">
                <select
                  value={formData.block_id ? String(formData.block_id) : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const selectedBlock = blocks.find((b) => String(b.id) === value);
                    onFieldChange("block", selectedBlock || null);
                    onFieldChange("block_id", selectedBlock?.id || null);
                    onFieldChange("property_id", null);
                    onFieldChange("property", null);
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.block_id;
                      return newErrors;
                    });
                  }}
                  onBlur={() => handleBlur("block_id")}
                  disabled={loadingBlocks || !formData.building_id}
                  className={`flex-1 px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    hasError("block_id")
                      ? "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
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
                      onFieldChange("property_id", null);
                      onFieldChange("property", null);
                    }}
                    className="flex-shrink-0 p-2.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm hover:shadow-md"
                    title={t("buttons.clear") || "Təmizlə"}
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              {hasError("block_id") && (
                <Typography variant="small" className="mt-1.5 text-red-500 font-medium">
                  {errors.block_id}
                </Typography>
              )}
            </div>

            <div className="space-y-2">
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold text-gray-700 dark:text-gray-300 text-sm">
                {t("invoices.form.property") || "Mənzil"}
                <span className="text-red-500 ml-1 font-bold">*</span>
              </Typography>
              <div className="flex items-center gap-2">
                <select
                  value={formData.property_id ? String(formData.property_id) : ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    const selectedProperty = properties.find((p) => String(p.id) === value);
                    onFieldChange("property", selectedProperty || null);
                    onFieldChange("property_id", selectedProperty?.id || null);
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.property_id;
                      return newErrors;
                    });
                  }}
                  onBlur={() => handleBlur("property_id")}
                  disabled={loadingProperties || !formData.block_id}
                  className={`flex-1 px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-all shadow-sm hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                    hasError("property_id")
                      ? "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <option value="" disabled>
                    {!formData.block_id
                      ? t("invoices.form.selectBlockFirst") || "Əvvəlcə blok seçin"
                      : loadingProperties
                      ? t("invoices.form.loading") || "Yüklənir..."
                      : t("invoices.form.selectProperty") || "Mənzil seçin..."}
                  </option>
                  {properties.map((property) => (
                    <option key={property.id} value={String(property.id)}>
                      {property.name || property.apartment_number || `Mənzil #${property.id}`}
                    </option>
                  ))}
                </select>
                {formData.property_id && (
                  <button
                    type="button"
                    onClick={() => {
                      onFieldChange("property", null);
                      onFieldChange("property_id", null);
                    }}
                    className="flex-shrink-0 p-2.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm hover:shadow-md"
                    title={t("buttons.clear") || "Təmizlə"}
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              {hasError("property_id") && (
                <Typography variant="small" className="mt-1.5 text-red-500 font-medium">
                  {errors.property_id}
                </Typography>
              )}
            </div>
          </div>
        </div>
          </>
        )}
      </DialogBody>
      <DialogFooter className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-3 dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 pt-4 sm:pt-5 px-5 sm:px-7 flex-shrink-0 bg-gray-50 shadow-lg">
        <Typography variant="small" className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm text-center sm:text-left order-2 sm:order-1 font-medium">
          <span className="text-red-500 font-bold">*</span> {t("invoices.form.requiredFields") || "Mütləq sahələr"}
        </Typography>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={onClose}
            disabled={saving}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold transition-all hover:shadow-md border-2"
          >
            {t("buttons.cancel") || "Ləğv et"}
          </Button>
          <Button
            color="green"
            onClick={handleSave}
            disabled={saving}
            className="dark:bg-green-600 dark:hover:bg-green-700 border-2 border-green-300 dark:border-green-500 shadow-md hover:shadow-lg transition-all w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
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
