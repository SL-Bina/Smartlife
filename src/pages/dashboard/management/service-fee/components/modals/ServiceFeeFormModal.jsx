import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CustomDialog } from "@/components/ui/CustomDialog";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomTypography } from "@/components/ui/CustomTypography";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function ServiceFeeFormModal({ open, onClose, onSubmit, serviceFee, services, loadingServices }) {
  const { t } = useTranslation();
  const isEdit = !!serviceFee;

  const [formData, setFormData] = useState({
    service_id: null,
    price: "",
    start_date: "",
    last_date: "",
    next_date: "",
    type: "monthly",
    status: "active",
  });

  useEffect(() => {
    if (serviceFee) {
      setFormData({
        service_id: serviceFee.service_id || null,
        price: serviceFee.price || "",
        start_date: serviceFee.start_date || "",
        last_date: serviceFee.last_date || "",
        next_date: serviceFee.next_date || "",
        type: serviceFee.type || "monthly",
        status: serviceFee.status || "active",
      });
    } else {
      setFormData({
        service_id: null,
        price: "",
        start_date: "",
        last_date: "",
        next_date: "",
        type: "monthly",
        status: "active",
      });
    }
  }, [serviceFee, open]);

  const serviceOptions = useMemo(() => {
    return services.map((s) => ({
      value: s.id,
      label: s.name,
    }));
  }, [services]);

  const typeOptions = [
    { value: "weekly", label: "Həftəlik" },
    { value: "monthly", label: "Aylıq" },
    { value: "yearly", label: "İllik" },
  ];

  const statusOptions = [
    { value: "active", label: "Aktiv" },
    { value: "inactive", label: "Qeyri-aktiv" },
  ];

  const serviceError = useMemo(() => {
    if (!formData.service_id) return "Service seçilməlidir";
    return null;
  }, [formData.service_id]);

  const priceError = useMemo(() => {
    if (!formData.price) return "Qiymət mütləqdir";
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      return "Qiymət müsbət rəqəm olmalıdır";
    }
    return null;
  }, [formData.price]);

  const startDateError = useMemo(() => {
    if (!formData.start_date) return "Başlanğıc tarixi mütləqdir";
    return null;
  }, [formData.start_date]);

  const lastDateError = useMemo(() => {
    if (formData.last_date && formData.start_date) {
      const startDate = new Date(formData.start_date);
      const lastDate = new Date(formData.last_date);
      if (lastDate < startDate) {
        return "Son tarix başlanğıc tarixindən sonra olmalıdır";
      }
    }
    return null;
  }, [formData.last_date, formData.start_date]);

  const hasErrors = useMemo(() => {
    return !!(serviceError || priceError || startDateError || lastDateError);
  }, [serviceError, priceError, startDateError, lastDateError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasErrors) return;
    onSubmit(formData);
  };

  return (
    <CustomDialog open={open} onClose={onClose} size="lg">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <CustomTypography variant="h6" className="text-white">
              {isEdit ? "Service Fee Redaktə Et" : "Yeni Service Fee Əlavə Et"}
            </CustomTypography>
            <CustomTypography variant="small" className="text-indigo-100 mt-1">
              {isEdit ? "Service fee məlumatlarını yeniləyin" : "Yeni service fee əlavə edin"}
            </CustomTypography>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        <div>
          <CustomSelect
            label={
              <span>
                Service <span className="text-red-500">*</span>
              </span>
            }
            value={formData.service_id}
            onChange={(value) => setFormData({ ...formData, service_id: value })}
            options={serviceOptions}
            error={serviceError}
            disabled={loadingServices}
            placeholder={loadingServices ? "Yüklənir..." : "Service seçin"}
          />
        </div>

        <div>
          <CustomInput
            label={
              <span>
                Qiymət <span className="text-red-500">*</span>
              </span>
            }
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            error={priceError}
            placeholder="0.00"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <CustomInput
              label={
                <span>
                  Başlanğıc tarixi <span className="text-red-500">*</span>
                </span>
              }
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              error={startDateError}
            />
          </div>
          <div>
            <CustomInput
              label="Son tarix"
              type="date"
              value={formData.last_date}
              onChange={(e) => setFormData({ ...formData, last_date: e.target.value })}
              error={lastDateError}
            />
          </div>
        </div>

        <div>
          <CustomInput
            label="Növbəti tarix"
            type="date"
            value={formData.next_date}
            onChange={(e) => setFormData({ ...formData, next_date: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <CustomSelect
              label="Tip"
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
              options={typeOptions}
            />
          </div>
          <div>
            <CustomSelect
              label="Status"
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value })}
              options={statusOptions}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <CustomButton
            type="button"
            variant="outlined"
            onClick={onClose}
            className="dark:text-gray-300 dark:border-gray-600"
          >
            Ləğv et
          </CustomButton>
          <CustomButton
            type="submit"
            disabled={hasErrors}
            className="bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
          >
            {isEdit ? "Yenilə" : "Əlavə et"}
          </CustomButton>
        </div>
      </form>
    </CustomDialog>
  );
}

