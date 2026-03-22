import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  HashtagIcon,
  ChevronDownIcon,
  Bars3BottomLeftIcon,
} from "@heroicons/react/24/outline";
import { CustomSelect } from "@/components/ui/CustomSelect";
import AsyncSearchSelect from "@/components/ui/AsyncSearchSelect";
import { useAppColor } from "@/hooks/useAppColor";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const EMPTY_OBJECT = Object.freeze({});

function resolveFieldIcon(type) {
  if (type === "select") return ChevronDownIcon;
  if (type === "date") return CalendarDaysIcon;
  if (type === "number") return HashtagIcon;
  if (type === "textarea") return Bars3BottomLeftIcon;
  return MagnifyingGlassIcon;
}

function FieldLabel({ label, type }) {
  const Icon = resolveFieldIcon(type);
  return (
    <div className="mb-2.5 flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
    </div>
  );
}

function SearchField({ field, value, onChange, forceFullRow = false }) {
  const {
    key,
    label,
    description,
    icon: CustomIcon,
    accentColor,
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
    onOpen,
    endpoint,
    searchParams,
    selectedLabel,
    valueKey,
    labelKey,
    allowClear,
  } = field;

  const commonWrapperClass = colSpan === 2 || forceFullRow ? "md:col-span-2" : "";
  const fieldCardClass = "rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/70 p-3 sm:p-4 shadow-sm  transition-all duration-200";
  const Icon = CustomIcon || resolveFieldIcon(type);
  const resolvedAccent = accentColor || "#3b82f6";
  const fieldCardStyle = {
    borderColor: `${resolvedAccent}22`,
    backgroundImage: `linear-gradient(135deg, ${resolvedAccent}10 0%, transparent 45%)`,
  };

  if (type === "section") {
    return (
      <div className="md:col-span-2 pt-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-7 w-1.5 rounded-full" style={{ background: resolvedAccent }} />
          <div
            className="h-8 w-8 rounded-lg grid place-items-center border"
            style={{ backgroundColor: `${resolvedAccent}18`, borderColor: `${resolvedAccent}40` }}
          >
            <Icon className="h-4 w-4" style={{ color: resolvedAccent }} />
          </div>
          <div>
            <Typography variant="h6" className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-100 leading-none">
              {label}
            </Typography>
            {description ? (
              <Typography className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </Typography>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`} style={fieldCardStyle}>
        <FieldLabel label={label} type={type} />
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
          onOpen={onOpen}
        />
      </div>
    );
  }

  if (type === "async-select") {
    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`} style={fieldCardStyle}>
        <FieldLabel label={label} type={type} />
        <AsyncSearchSelect
          value={value ?? null}
          onChange={(selectedValue) => onChange(key, selectedValue || "")}
          endpoint={endpoint}
          searchParams={searchParams || {}}
          selectedLabel={selectedLabel || null}
          placeholder={placeholder || "Seçin"}
          searchPlaceholder={searchPlaceholder || "Axtarın..."}
          error={false}
          disabled={disabled}
          allowClear={allowClear ?? true}
          valueKey={valueKey || "id"}
          labelKey={labelKey || "name"}
          className="w-full"
        />
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`} style={fieldCardStyle}>
        <FieldLabel label={label} type={type} />
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
      <div className={`${commonWrapperClass} ${fieldCardClass}`} style={fieldCardStyle}>
        <FieldLabel label={label} type={type} />
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
    <div className={`${commonWrapperClass} ${fieldCardClass}`} style={fieldCardStyle}>
      <FieldLabel label={label} type={type} />
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
      className="w-full max-h-[92vh] overflow-hidden rounded-lg sm:rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-2xl flex flex-col"
    >
      <DialogHeader
        className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 text-white border-b border-white/15 rounded-t-lg sm:rounded-t-xl shrink-0"
        style={{
          background: `linear-gradient(135deg, ${getRgba(0.96)}, ${getRgba(0.78)})`,
          boxShadow: `inset 0 -1px 0 ${getRgba(0.35)}`,
        }}
      >
        <div className="min-w-0 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 border border-white/20 grid place-items-center flex-shrink-0">
            <FunnelIcon className="h-5 w-5 text-white" />
          </div>
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

      <DialogBody
        className="relative z-20 p-4 sm:p-6 overflow-y-auto overflow-x-hidden flex-1 min-h-0"
        style={{ background: `linear-gradient(180deg, ${getRgba(0.08)} 0%, transparent 100%)` }}
      >
        <div className="relative overflow-hidden rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white/95 dark:bg-gray-800/95 p-4 sm:p-5 shadow-lg space-y-4">
          <div
            className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full blur-2xl opacity-30"
            style={{ background: getRgba(0.45) }}
          />
          {visibleFields.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 auto-rows-max">
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

      <DialogFooter className="relative z-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 px-4 py-4 sm:px-6 sm:py-5 border-t border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-800/95 rounded-b-lg sm:rounded-b-xl shrink-0">
        <Button
          variant="outlined"
          onClick={handleClear}
          className="w-full sm:w-auto rounded-xl px-6 inline-flex items-center justify-center gap-2 border-gray-300/90 hover:bg-gray-100/80 dark:hover:bg-gray-700/70"
        >
          <XMarkIcon className="h-4 w-4" />
          {clearLabel}
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          className="w-full sm:w-auto rounded-xl px-6 border-gray-300/90 hover:bg-gray-100/80 dark:hover:bg-gray-700/70"
        >
          {cancelLabel}
        </Button>
        <Button
          onClick={handleSearch}
          className="w-full sm:w-auto rounded-xl px-6 text-white border-0 flex items-center justify-center gap-2 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${getRgba(0.95)}, ${getRgba(0.75)})`,
            boxShadow: `0 10px 25px -10px ${getRgba(0.7)}`,
          }}
        >
          <MagnifyingGlassIcon className="h-4 w-4" />
          {searchLabel}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
