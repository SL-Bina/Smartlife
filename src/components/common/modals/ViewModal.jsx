import React, { useEffect, useRef } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Spinner } from "@material-tailwind/react";
import { XMarkIcon, EyeIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useAppColor } from "@/hooks/useAppColor";

export function ViewModal({
  open,
  onClose,
  title = "Məlumatları Göstər",
  item = null,
  fields = [],
  loading = false,
}) {
  const { colorCode, getRgba } = useAppColor();
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const activeEl = document.activeElement;
    if (activeEl && typeof activeEl.blur === "function") activeEl.blur();
    const timer = setTimeout(() => closeButtonRef.current?.focus?.(), 0);
    return () => clearTimeout(timer);
  }, [open]);

  if (!open) return null;

  const getFieldValue = (field, source) => {
    if (typeof field.getValue === "function") return field.getValue(source);
    if (!field.key) return undefined;
    return field.key.split(".").reduce((acc, part) => acc?.[part], source);
  };

  const getStatusBadge = (value) => {
    const normalized = String(value ?? "").trim().toLowerCase();

    if (normalized === "active" || value === true) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircleIcon className="h-3.5 w-3.5" /> Aktiv
        </span>
      );
    }

    if (normalized === "inactive" || value === false) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <XCircleIcon className="h-3.5 w-3.5" /> Qeyri-aktiv
        </span>
      );
    }

    return null;
  };

  const renderValue = (field, rawValue, source) => {
    if (typeof field.format === "function") {
      const formatted = field.format(rawValue, source);
      if (formatted === null || formatted === undefined || formatted === "") {
        return <span className="text-gray-400 dark:text-gray-500 italic">-</span>;
      }
      return formatted;
    }

    if (rawValue === null || rawValue === undefined || rawValue === "") {
      return <span className="text-gray-400 dark:text-gray-500 italic">-</span>;
    }

    return String(rawValue);
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="xl"
      dismiss={{ enabled: false }}
      className="w-full max-h-[92vh] overflow-hidden rounded-lg sm:rounded-xl border-[0.5px] border-gray-200/55 dark:border-gray-700/55 bg-white dark:bg-gray-800 shadow-2xl"
    >
      <DialogHeader
        className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 text-white border-b border-white/15 rounded-t-lg sm:rounded-t-xl"
        style={{ background: `linear-gradient(135deg, ${getRgba(0.95)}, ${getRgba(0.75)})` }}
      >
        <div className="min-w-0 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 grid place-items-center">
            <EyeIcon className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <Typography variant="h5" className="font-semibold text-white text-base sm:text-lg truncate">
              {title}
            </Typography>
            {(item?.id || item?.user_data?.id) ? (
              <Typography className="text-xs sm:text-sm font-normal text-white/90 mt-1 truncate">
                ID: #{item?.user_data?.id || item?.id}
              </Typography>
            ) : null}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          ref={closeButtonRef}
          className="h-9 w-9 rounded-xl grid place-items-center bg-white/15 hover:bg-white/25 transition-colors flex-shrink-0"
          aria-label="Bağla"
        >
          <XMarkIcon className="h-5 w-5 text-white" />
        </button>
      </DialogHeader>

      <DialogBody className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto max-h-[64vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner className="h-10 w-10 text-blue-500 mb-3" />
            <Typography variant="small" className="text-gray-500 dark:text-gray-400">
              Məlumatlar yüklənir...
            </Typography>
          </div>
        ) : !item ? (
          <div className="flex flex-col items-center justify-center py-12">
            <InformationCircleIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
            <Typography variant="small" className="text-gray-500 dark:text-gray-400">
              Məlumat tapılmadı
            </Typography>
          </div>
        ) : (
          <div className="rounded-xl border-[0.5px] border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {fields.map((field, index) => {
                if (typeof field.customRender === "function") {
                  return (
                    <div
                      key={`${field.key || "custom"}-${index}`}
                      className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/40 p-3 sm:p-4 ${field.fullWidth ? "md:col-span-2" : ""}`}
                    >
                      {field.customRender(item, field)}
                    </div>
                  );
                }

                const value = getFieldValue(field, item);
                const statusBadge = (field.key === "status" || field.key?.includes("status")) ? getStatusBadge(value) : null;
                const Icon = field.icon;

                return (
                  <div
                    key={`${field.key || "field"}-${index}`}
                    className={`rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/40 p-3 sm:p-4 ${field.fullWidth ? "md:col-span-2" : ""}`}
                  >
                    <div className="mb-2.5 flex items-center gap-2">
                      {Icon ? <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" /> : null}
                      <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
                        {field.label}
                      </span>
                    </div>

                    {statusBadge ? (
                      statusBadge
                    ) : (
                      <Typography variant="paragraph" className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">
                        {renderValue(field, value, item)}
                      </Typography>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2.5 px-4 py-4 sm:px-6 sm:py-5 border-t border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-800 rounded-b-lg sm:rounded-b-xl">
        <Button
          onClick={onClose}
          className="rounded-xl px-6 text-white border-0"
          style={{ background: colorCode || "#2563eb" }}
        >
          Bağla
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
