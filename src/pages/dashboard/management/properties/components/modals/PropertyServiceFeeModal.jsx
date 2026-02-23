import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Input } from "@material-tailwind/react";
import { CurrencyDollarIcon, XMarkIcon, PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import DynamicToast from "@/components/DynamicToast";
import propertyServiceFeeAPI from "../../api/serviceFee";
import api from "@/services/api";

const ACTIVE_COLOR = "#14b8a6"; 

export function PropertyServiceFeeModal({ open, propertyId, propertyName, onClose }) {
  const [serviceFees, setServiceFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedServiceFeeId, setSelectedServiceFeeId] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });

  const [formData, setFormData] = useState({
    service_id: null,
    status: "active",
    price: "",
    start_date: "",
    last_date: "",
    next_date: "",
    type: "monthly",
  });

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const typeOptions = [
    { value: "daily", label: "Günlük" },
    { value: "weekly", label: "Həftəlik" },
    { value: "monthly", label: "Aylıq" },
    { value: "quarterly", label: "Rüblük" },
    { value: "yearly", label: "İllik" },
  ];

  const statusOptions = [
    { value: "active", label: "Aktiv" },
    { value: "inactive", label: "Qeyri-aktiv" },
  ];

  // Load services
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

  // Load service fees
  useEffect(() => {
    if (open && propertyId) {
      setLoading(true);
      propertyServiceFeeAPI.getList(propertyId)
        .then((response) => {
          setServiceFees(response?.data?.data?.data || []);
        })
        .catch((error) => {
          console.error("Error loading service fees:", error);
          showToast("error", "Servis haqları yüklənərkən xəta baş verdi", "Xəta");
          setServiceFees([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (open && !propertyId) {
      showToast("error", "Mənzil seçilməyib", "Xəta");
    }
  }, [open, propertyId]);

  const handleCreate = () => {
    setFormData({
      service_id: null,
      status: "active",
      price: "",
      start_date: "",
      last_date: "",
      next_date: "",
      type: "monthly",
    });
    setFormMode("create");
    setSelectedServiceFeeId(null);
    setFormOpen(true);
  };

  const handleEdit = (serviceFee) => {
    setFormData({
      service_id: serviceFee.service_id,
      status: serviceFee.status || "active",
      price: serviceFee.price || "",
      start_date: serviceFee.start_date || "",
      last_date: serviceFee.last_date || "",
      next_date: serviceFee.next_date || "",
      type: serviceFee.type || "monthly",
    });
    setFormMode("edit");
    setSelectedServiceFeeId(serviceFee.id);
    setFormOpen(true);
  };

  const handleDelete = async (serviceFee) => {
    if (!window.confirm(`Bu servis haqqını silmək istədiyinizə əminsiniz?`)) {
      return;
    }

    try {
      await propertyServiceFeeAPI.delete(propertyId, serviceFee.id);
      showToast("success", "Servis haqqı uğurla silindi", "Uğurlu");
      // Reload service fees
      const response = await propertyServiceFeeAPI.getList(propertyId);
      setServiceFees(response?.data?.data?.data || []);
    } catch (error) {
      const errorMessage = error?.message || "Servis haqqı silinərkən xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
    }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called", { propertyId, formData, formMode });
    
    if (submitting) {
      console.log("Already submitting, ignoring...");
      return;
    }
    
    if (!propertyId) {
      showToast("error", "Mənzil seçilməyib", "Xəta");
      return;
    }
    if (!formData.service_id) {
      showToast("error", "Servis seçilməlidir", "Xəta");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      showToast("error", "Qiymət düzgün daxil edilməlidir", "Xəta");
      return;
    }

    setSubmitting(true);

    // Tarix validasiyası
    if (formData.start_date && formData.last_date) {
      const startDate = new Date(formData.start_date);
      const lastDate = new Date(formData.last_date);
      if (lastDate < startDate) {
        showToast("error", "Son tarix başlanğıc tarixdən sonra və ya bərabər olmalıdır", "Xəta");
        return;
      }
    }

    if (formData.last_date && formData.next_date) {
      const lastDate = new Date(formData.last_date);
      const nextDate = new Date(formData.next_date);
      if (nextDate <= lastDate) {
        showToast("error", "Növbəti tarix son tarixdən sonra olmalıdır", "Xəta");
        return;
      }
    }

    try {
      const submitData = {
        property_id: propertyId,
        service_id: formData.service_id,
        status: formData.status,
        price: parseFloat(formData.price),
        type: formData.type,
        ...(formData.start_date && { start_date: formData.start_date }),
        ...(formData.last_date && { last_date: formData.last_date }),
        ...(formData.next_date && { next_date: formData.next_date }),
      };

      console.log("Submitting data:", submitData);

      if (formMode === "edit") {
        const response = await propertyServiceFeeAPI.update(propertyId, selectedServiceFeeId, submitData);
        console.log("Update response:", response);
        showToast("success", "Servis haqqı uğurla yeniləndi", "Uğurlu");
      } else {
        const response = await propertyServiceFeeAPI.add(propertyId, submitData);
        console.log("Add response:", response);
        
        // API response strukturunu yoxla
        if (response?.data?.success !== false) {
          showToast("success", "Servis haqqı uğurla əlavə edildi", "Uğurlu");
        } else {
          throw new Error(response?.data?.message || "Servis haqqı əlavə edilərkən xəta baş verdi");
        }
      }

      setFormOpen(false);
      // Reset form
      setFormData({
        service_id: null,
        status: "active",
        price: "",
        start_date: "",
        last_date: "",
        next_date: "",
        type: "monthly",
      });
      
      // Reload service fees
      const listResponse = await propertyServiceFeeAPI.getList(propertyId);
      setServiceFees(listResponse?.data?.data?.data || []);
    } catch (error) {
      console.error("Error submitting service fee:", error);
      const errorData = error?.response?.data || error;
      let errorMessage = "Servis haqqı yadda saxlanarkən xəta baş verdi";
      
      if (errorData?.errors) {
        // Validation errors-i formatla
        const errors = Object.entries(errorData.errors)
          .map(([key, value]) => {
            const fieldName = key === "property_id" ? "Mənzil" : 
                             key === "last_date" ? "Son tarix" :
                             key === "next_date" ? "Növbəti tarix" :
                             key === "start_date" ? "Başlanğıc tarix" : key;
            return Array.isArray(value) ? `${fieldName}: ${value.join(", ")}` : `${fieldName}: ${value}`;
          })
          .join("; ");
        errorMessage = errors || errorData.message || errorMessage;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      showToast("error", errorMessage, "Xəta");
    } finally {
      setSubmitting(false);
    }
  };

  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  // Set z-index for modal portal
  useEffect(() => {
    if (open) {
      const observer = new MutationObserver(() => {
        const portal = document.querySelector('[role="dialog"]');
        if (portal) {
          portal.style.zIndex = '999999';
          const backdrop = document.querySelector('.backdrop-blur-sm');
          if (backdrop) {
            backdrop.style.zIndex = '999998';
          }
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => observer.disconnect();
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      <Dialog 
        open={!!open} 
        handler={onClose} 
        size="xl"
        className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl"
        dismiss={{ enabled: false }}
      >
        <DialogHeader 
          className="border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between"
          style={{
            background: `linear-gradient(to right, ${getRgbaColor(ACTIVE_COLOR, 0.9)}, ${getRgbaColor(ACTIVE_COLOR, 0.7)})`,
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm"
              style={{ backgroundColor: getRgbaColor(ACTIVE_COLOR, 0.3) }}
            >
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <Typography variant="h5" className="text-white font-bold">
                Servis Haqqı İdarəetməsi
              </Typography>
              <Typography variant="small" className="text-white/90">
                {propertyName}
              </Typography>
            </div>
          </div>
          <Button
            variant="text"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full relative z-10"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </DialogHeader>

        <DialogBody className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={handleCreate}
                variant="outlined"
                className="flex items-center gap-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
                size="sm"
              >
                <PlusIcon className="h-4 w-4" />
                Servis haqqı əlavə et
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <Typography className="text-sm text-gray-500 dark:text-gray-400">
                  Yüklənir...
                </Typography>
              </div>
            ) : serviceFees.length === 0 ? (
              <div className="text-center py-12">
                <Typography className="text-sm text-gray-500 dark:text-gray-400">
                  Servis haqqı tapılmadı
                </Typography>
              </div>
            ) : (
              <div className="space-y-3">
                {serviceFees.map((serviceFee) => (
                  <div
                    key={serviceFee.id}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Typography variant="h6" className="text-gray-900 dark:text-white mb-2">
                          {serviceFee.service?.name || "Servis"}
                        </Typography>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                              Qiymət:
                            </Typography>
                            <Typography variant="small" className="text-gray-900 dark:text-white font-semibold">
                              {serviceFee.price} AZN
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                              Tip:
                            </Typography>
                            <Typography variant="small" className="text-gray-900 dark:text-white">
                              {typeOptions.find(opt => opt.value === serviceFee.type)?.label || serviceFee.type}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                              Başlanğıc:
                            </Typography>
                            <Typography variant="small" className="text-gray-900 dark:text-white">
                              {serviceFee.start_date || "—"}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                              Növbəti:
                            </Typography>
                            <Typography variant="small" className="text-gray-900 dark:text-white">
                              {serviceFee.next_date || "—"}
                            </Typography>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              serviceFee.status === "active"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {serviceFee.status === "active" ? "Aktiv" : "Qeyri-aktiv"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="text"
                          size="sm"
                          onClick={() => handleEdit(serviceFee)}
                          className="text-blue-600 dark:text-blue-400"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="text"
                          size="sm"
                          onClick={() => handleDelete(serviceFee)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button
            variant="outlined"
            onClick={onClose}
            className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white dark:border-gray-400 dark:text-gray-400 dark:hover:bg-gray-400"
          >
            Bağla
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Form Modal */}
      <Dialog 
        open={formOpen} 
        handler={() => setFormOpen(false)} 
        size="lg"
        className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl"
        dismiss={{ enabled: false }}
      >
        <DialogHeader 
          className="border-b border-gray-200 dark:border-gray-700 pb-4"
          style={{
            background: `linear-gradient(to right, ${getRgbaColor(ACTIVE_COLOR, 0.9)}, ${getRgbaColor(ACTIVE_COLOR, 0.7)})`,
          }}
        >
          <Typography variant="h5" className="text-white font-bold">
            {formMode === "edit" ? "Servis Haqqı Redaktə et" : "Yeni Servis Haqqı Əlavə Et"}
          </Typography>
        </DialogHeader>

        <DialogBody className="p-6">
          <div className="space-y-4">
            <CustomSelect
              label="Servis *"
              value={formData.service_id ? String(formData.service_id) : ""}
              onChange={(value) => setFormData(prev => ({ ...prev, service_id: value ? Number(value) : null }))}
              options={services.map(service => ({ value: String(service.id), label: service.name }))}
              loading={loadingServices}
              disabled={loadingServices}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                label="Qiymət *"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              />
              <CustomSelect
                label="Tip *"
                value={formData.type}
                onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                options={typeOptions}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomInput
                label="Başlanğıc tarix"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              />
              {/* <CustomInput
                label="Son tarix"
                type="date"
                value={formData.last_date}
                onChange={(e) => setFormData(prev => ({ ...prev, last_date: e.target.value }))}
              />
              <CustomInput
                label="Növbəti tarix"
                type="date"
                value={formData.next_date}
                onChange={(e) => setFormData(prev => ({ ...prev, next_date: e.target.value }))}
              /> */}
            </div>
            <CustomSelect
              label="Status"
              value={formData.status}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              options={statusOptions}
            />
          </div>
        </DialogBody>

        <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
          <Button
            variant="outlined"
            onClick={() => setFormOpen(false)}
            className="border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white dark:border-gray-400 dark:text-gray-400 dark:hover:bg-gray-400"
          >
            Ləğv et
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="text-white"
            style={{ backgroundColor: ACTIVE_COLOR }}
            disabled={submitting}
          >
            {submitting ? "Göndərilir..." : formMode === "edit" ? "Yenilə" : "Əlavə et"}
          </Button>
        </DialogFooter>
      </Dialog>

      <DynamicToast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        title={toast.title}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
}

