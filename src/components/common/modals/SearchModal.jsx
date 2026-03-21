import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useAppColor } from "@/hooks/useAppColor";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const EMPTY_OBJECT = Object.freeze({});

function FieldLabel({ label }) {
  return (
    <div className="mb-2.5 flex items-center justify-between gap-2">
      <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
        {label}
      </span>
    </div>
  );
}

function SearchField({ field, value, onChange, forceFullRow = false }) {
  const {
    key,
    label,
    type = "text",
    placeholder,
    options = [],
    disabled,
    rows = 3,
    colSpan = 1,
    searchable = false,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    loading = false,
    loadingMore = false,
    onScrollEnd,
  } = field;

  const commonWrapperClass = colSpan === 2 || forceFullRow ? "md:col-span-2" : "";
  const fieldCardClass = "rounded-base border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/40 p-3 sm:p-4";

  if (type === "select") {
    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`}>
        <FieldLabel label={label} />
        <CustomSelect
          value={value ?? ""}
          onChange={(selectedValue) => onChange(key, selectedValue)}
          options={options}
          placeholder={placeholder || "Seçin"}
          disabled={disabled}
          loading={loading}
          loadingMore={loadingMore}
          onScrollEnd={onScrollEnd}
          searchable={searchable}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder || "Axtarın..."}
        />
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`}>
        <FieldLabel label={label} />
        <textarea
          rows={rows}
          value={value ?? ""}
          onChange={(e) => onChange(key, e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 disabled:opacity-60 resize-y"
        />
      </div>
    );
  }

  if (type === "phone") {
    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`}>
        <FieldLabel label={label} />
        <PhoneInput
          country="az"
          enableSearch
          value={value || ""}
          onChange={(phone) => onChange(key, phone ? `+${phone}` : "")}
          inputStyle={{
            width: "100%",
            height: "42px",
            borderRadius: "0.75rem",
            border: "1px solid rgb(209 213 219)",
            background: "transparent",
            color: "inherit",
            paddingLeft: "50px",
          }}
          buttonStyle={{
            borderTopLeftRadius: "0.75rem",
            borderBottomLeftRadius: "0.75rem",
            border: "1px solid rgb(209 213 219)",
            background: "transparent",
          }}
          dropdownStyle={{
            zIndex: 9999,
            top: "100%",
            bottom: "auto",
            marginTop: "6px",
          }}
          containerClass="w-full"
          disabled={disabled}
        />
      </div>
    );
  }

  return (
    <div className={`${commonWrapperClass} ${fieldCardClass}`}>
      <FieldLabel label={label} />
      <Input
        label=" "
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(key, e.target.value)}
        placeholder={placeholder || label}
        disabled={disabled}
      />
    </div>
  );
}

function toFilteredPayload(data) {
  return Object.entries(data || {}).reduce((acc, [key, value]) => {
    if (value === null || value === undefined) return acc;
    const normalized = typeof value === "string" ? value.trim() : value;
    if (normalized === "") return acc;
    acc[key] = normalized;
    return acc;
  }, {});
}

export function SearchModal({
  open,
  onClose,
  onSearch,
  fields = [],
  formData,
  onFieldChange,
  currentSearch,
  currentFilters,
  title = "Axtarış",
  description,
  searchLabel = "Axtar",
  clearLabel = "Təmizlə",
  cancelLabel = "Ləğv et",
  size = "lg",
  extraContent,
  onClear,
}) {
  const { colorCode, getRgba } = useAppColor();
  const closeButtonRef = useRef(null);
  const safeCurrentSearch = currentSearch || EMPTY_OBJECT;
  const safeCurrentFilters = currentFilters || EMPTY_OBJECT;

  const initialData = useMemo(
    () => ({ ...safeCurrentFilters, ...safeCurrentSearch }),
    [safeCurrentFilters, safeCurrentSearch]
  );

  const [localData, setLocalData] = useState(initialData);

  useEffect(() => {
    if (open) {
      setLocalData(initialData);
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;

    const activeEl = document.activeElement;
    if (activeEl && typeof activeEl.blur === "function") {
      activeEl.blur();
    }

    const timer = setTimeout(() => {
      closeButtonRef.current?.focus?.();
    }, 0);

    return () => clearTimeout(timer);
  }, [open]);

  const resolvedData = formData || localData;
  const visibleFields = useMemo(
    () =>
      fields.filter((field) => {
        if (!field) return false;
        if (field.hidden === true) return false;
        if (typeof field.visible === "function") {
          return field.visible(resolvedData);
        }
        if (typeof field.visible === "boolean") {
          return field.visible;
        }
        return true;
      }),
    [fields, resolvedData]
  );

  if (!open) return null;

  const handleFieldChange = (key, value) => {
    if (typeof onFieldChange === "function") {
      onFieldChange(key, value);
      return;
    }

    setLocalData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch?.(toFilteredPayload(resolvedData));
    onClose?.();
  };

  const handleClear = () => {
    if (typeof onClear === "function") {
      onClear();
      return;
    }

    if (typeof onFieldChange === "function") {
      onSearch?.({});
      onClose?.();
      return;
    }

    setLocalData({});
    onSearch?.({});
    onClose?.();
  };

  return (
    <Dialog
      open={!!open}
      handler={onClose}
      size={size}
      dismiss={{ enabled: false }}
      className="w-full max-h-[92vh] overflow-hidden rounded-lg sm:rounded-xl border-[0.5px] border-gray-200/55 dark:border-gray-700/55 bg-white dark:bg-gray-800 shadow-2xl"
    >
      <DialogHeader
        className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 text-white border-b border-white/15 rounded-t-lg sm:rounded-t-xl"
        style={{ background: `linear-gradient(135deg, ${getRgba(0.95)}, ${getRgba(0.75)})` }}
      >
        <div className="min-w-0">
          <Typography variant="h5" className="font-semibold text-white text-base sm:text-lg truncate">
            {title}
          </Typography>
          {description ? (
            <Typography className="text-xs sm:text-sm font-normal text-white/90 mt-1">
              {description}
            </Typography>
          ) : null}
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

      <DialogBody className="relative z-20 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 overflow-visible">
        <div className="rounded-xl border-[0.5px] border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm space-y-4">
          {visibleFields.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 grid-flow-row-dense auto-rows-max">
              {visibleFields.map((field, index) => {
                const isLast = index === visibleFields.length - 1;
                const hasSingleSpan = (field?.colSpan || 1) === 1;
                const shouldForceFullRow = visibleFields.length % 2 === 1 && isLast && hasSingleSpan;

                return (
                <SearchField
                  key={field.key}
                  field={field}
                  value={resolvedData?.[field.key]}
                  onChange={handleFieldChange}
                  forceFullRow={shouldForceFullRow}
                />
                );
              })}
            </div>
          ) : null}

          {extraContent ? extraContent : null}
        </div>
      </DialogBody>

      <DialogFooter className="relative z-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 px-4 py-4 sm:px-6 sm:py-5 border-t border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-800 rounded-b-lg sm:rounded-b-xl">
        <Button
          variant="outlined"
          onClick={handleClear}
          className="w-full sm:w-auto rounded-xl px-6"
        >
          {clearLabel}
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          className="w-full sm:w-auto rounded-xl px-6"
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={handleSearch}
          className="w-full sm:w-auto rounded-xl px-6 text-white border-0 flex items-center justify-center gap-2"
          style={{ background: colorCode || "#2563eb" }}
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
          {searchLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
