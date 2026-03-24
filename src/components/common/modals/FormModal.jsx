import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import {
  XMarkIcon,
  SparklesIcon,
  ChevronDownIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PhoneIcon,
  SwatchIcon,
  PaperClipIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useAppColor } from "@/hooks/useAppColor";
import MapPicker from "@/components/ui/MapPicker";
import { CustomSelect } from "@/components/ui/CustomSelect";
import AsyncSearchSelect from "@/components/ui/AsyncSearchSelect";
import MultiSelect from "@/components/ui/MultiSelect";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const getByPath = (obj, path, fallback = "") => {
  if (!obj || !path) return fallback;
  const value = path.split(".").reduce((acc, part) => acc?.[part], obj);
  return value ?? fallback;
};

function resolveFieldIcon(type) {
  if (type === "select" || type === "async-select") return ChevronDownIcon;
  if (type === "date") return CalendarDaysIcon;
  if (type === "map") return MapPinIcon;
  if (type === "phone") return PhoneIcon;
  if (type === "color") return SwatchIcon;
  if (type === "file" || type === "files") return PaperClipIcon;
  return SparklesIcon;
}

function FieldLabel({ label, required, type }) {
  const Icon = resolveFieldIcon(type);
  return (
    <div className="mb-2.5 flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      {required ? (
        <span className="inline-flex items-center rounded-full border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-300">
          Required
        </span>
      ) : null}
    </div>
  );
}

function FormField({ field, value, error, onChange, formData }) {
  const {
    key,
    label,
    description,
    icon: CustomIcon,
    accentColor,
    type = "text",
    placeholder,
    required,
    options = [],
    disabled,
    rows = 3,
    colSpan = 1,
    accept,
    multiple = false,
    searchable = false,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    loading = false,
    loadingMore = false,
    onScrollEnd,
    onOpen,
    latKey,
    lngKey,
    endpoint,
    searchParams,
    selectedLabel,
    valueKey,
    labelKey,
    allowClear,
    customRender,
  } = field;

  const commonWrapperClass = colSpan === 2 ? "md:col-span-2" : "";
  const fieldCardClass = "rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-900/70 p-3 sm:p-4 shadow-sm  transition-all duration-200";
  const [mapOpen, setMapOpen] = useState(false);
  const Icon = CustomIcon || resolveFieldIcon(type);
  const resolvedAccent = accentColor || "#3b82f6";

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

  const filePreviewItems = useMemo(() => {
    if (!(type === "file" || type === "files")) return [];

    const isMultiple = multiple || type === "files";
    const rawItems = isMultiple ? (Array.isArray(value) ? value : []) : value ? [value] : [];

    return rawItems
      .filter((item) => item !== null && item !== undefined && item !== "")
      .map((item, index) => {
        if (item instanceof File) {
          const src = URL.createObjectURL(item);
          return {
            key: `${item.name}-${index}`,
            sourceIndex: index,
            src,
            name: item.name,
            isImage: item.type?.startsWith("image/"),
            isObjectUrl: true,
          };
        }

        if (typeof item === "string") {
          const isImage =
            item.startsWith("data:image") ||
            /^https?:\/\/.+\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(item) ||
            /^\/.*\.(png|jpe?g|gif|webp|svg)$/i.test(item);

          return {
            key: `existing-${index}`,
            sourceIndex: index,
            src: item,
            name: `Şəkil ${index + 1}`,
            isImage,
            isObjectUrl: false,
          };
        }

        return {
          key: `file-${index}`,
          sourceIndex: index,
          src: "",
          name: `Fayl ${index + 1}`,
          isImage: false,
          isObjectUrl: false,
        };
      });
  }, [type, multiple, value]);

  useEffect(() => {
    return () => {
      filePreviewItems.forEach((item) => {
        if (item.isObjectUrl && item.src) {
          URL.revokeObjectURL(item.src);
        }
      });
    };
  }, [filePreviewItems]);

  if (type === "select") {
    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`}>
        <FieldLabel label={label} required={required} type={type} />
        <CustomSelect
          value={value ?? ""}
          onChange={(selectedValue) => onChange(key, selectedValue)}
          options={options}
          placeholder={placeholder || "Seçin"}
          error={error || false}
          disabled={disabled}
          loading={loading}
          loadingMore={loadingMore}
          onScrollEnd={onScrollEnd}
          onOpen={onOpen}
          searchable={searchable}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder || "Axtarın..."}
        />
      </div>
    );
  }

  if (type === "async-select") {
    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`}>
        <AsyncSearchSelect
          label={label}
          value={value ?? null}
          onChange={(selectedValue, selectedOption) => onChange(key, selectedValue, selectedOption)}
          endpoint={endpoint}
          searchParams={searchParams || {}}
          selectedLabel={selectedLabel || null}
          placeholder={placeholder || "Seçin"}
          searchPlaceholder={searchPlaceholder || "Axtarın..."}
          error={error || false}
          disabled={disabled}
          allowClear={allowClear ?? false}
          valueKey={valueKey || "id"}
          labelKey={labelKey || "name"}
          className="w-full"
        />
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`}>
        <FieldLabel label={label} required={required} type={type} />
        <textarea
          rows={rows}
          value={value ?? ""}
          onChange={(e) => onChange(key, e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 disabled:opacity-60 resize-y"
        />
        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      </div>
    );
  }

  if (type === "phone") {
    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`}>
        <FieldLabel label={label} required={required} type={type} />
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
          dropdownStyle={{ zIndex: 70 }}
          containerClass="w-full"
          disabled={disabled}
        />
        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      </div>
    );
  }

  if (type === "color") {
    const normalizedColor = typeof value === "string" && value ? value : "#dc2626";
    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`}>
        <FieldLabel label={label} required={required} type={type} />

        <div className="flex items-center gap-3 mb-3">
          <input
            type="color"
            value={normalizedColor}
            onChange={(e) => onChange(key, e.target.value)}
            disabled={disabled}
            className="h-10 w-14 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-1 cursor-pointer"
          />
          <div
            className="h-10 w-10 rounded-xl border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: normalizedColor }}
          />
          <Input
            label="Hex"
            value={normalizedColor}
            onChange={(e) => onChange(key, e.target.value)}
            placeholder="#dc2626"
            disabled={disabled}
          />
        </div>

        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      </div>
    );
  }

  if (type === "multiselect") {
    const selectedValues = Array.isArray(value) ? value : [];
    const normalizedOptions = (options || []).map((option) => ({
      id: option?.id ?? option?.value,
      name: option?.name ?? option?.label ?? option?.title,
    }));

    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`}>
        <FieldLabel label={label} required={required} type={type} />
        <MultiSelect
          label=""
          options={normalizedOptions}
          value={selectedValues}
          onChange={(selected) => onChange(key, selected)}
          onOpen={onOpen}
        />
        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      </div>
    );
  }

  if (type === "file" || type === "files") {
    const isMultiple = multiple || type === "files";
    const filesValue = isMultiple ? (Array.isArray(value) ? value : []) : value;

    const handleRemoveAt = (indexToRemove) => {
      if (isMultiple) {
        const existingFiles = Array.isArray(filesValue) ? filesValue : [];
        onChange(
          key,
          existingFiles.filter((_, index) => index !== indexToRemove)
        );
      } else {
        onChange(key, null);
      }
    };

    const getDisplayText = () => {
      if (isMultiple) {
        if (filesValue.length === 0) return "Fayl seçilməyib";
        const names = filesValue.map((item, index) => {
          if (item instanceof File) return item.name;
          return `Mövcud şəkil ${index + 1}`;
        });
        return names.join(", ");
      }

      if (!filesValue) return "Fayl seçilməyib";
      if (filesValue instanceof File) return filesValue.name;
      if (typeof filesValue === "string") return "Mövcud fayl";
      return "Fayl seçilib";
    };

    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`}>
        <FieldLabel label={label} required={required} type={type} />
        <input
          type="file"
          accept={accept}
          multiple={isMultiple}
          disabled={disabled}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (isMultiple) {
              const existingFiles = Array.isArray(filesValue) ? filesValue : [];
              onChange(key, [...existingFiles, ...files]);
            } else {
              onChange(key, files[0] || null);
            }
            e.target.value = "";
          }}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3.5 py-2.5 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 dark:file:bg-gray-700 file:px-3 file:py-1.5 file:text-sm file:text-gray-700 dark:file:text-gray-200"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{getDisplayText()}</p>

        {filePreviewItems.length > 0 ? (
          <div className="mt-3">
            {isMultiple ? (
              <>
                <div className="mb-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onChange(key, [])}
                    className="rounded-lg border border-red-200 dark:border-red-700/40 bg-red-50 dark:bg-red-900/20 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    Hamısını sil
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filePreviewItems.map((item) => (
                    <div key={item.key} className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <button
                        type="button"
                        onClick={() => handleRemoveAt(item.sourceIndex)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 hover:bg-black/80 text-white grid place-items-center z-10"
                        aria-label="Şəkli sil"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                      {item.isImage ? (
                        <img src={item.src} alt={item.name} className="w-full h-20 object-cover" />
                      ) : (
                        <div className="h-20 grid place-items-center text-xs text-gray-500 dark:text-gray-400 px-2 text-center">
                          {item.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full max-w-[220px]">
                <button
                  type="button"
                  onClick={() => handleRemoveAt(0)}
                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 hover:bg-black/80 text-white grid place-items-center z-10"
                  aria-label="Logo sil"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
                {filePreviewItems[0]?.isImage ? (
                  <img src={filePreviewItems[0].src} alt={filePreviewItems[0].name} className="w-full h-28 object-cover" />
                ) : (
                  <div className="h-28 grid place-items-center text-xs text-gray-500 dark:text-gray-400 px-2 text-center">
                    {filePreviewItems[0]?.name}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}

        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      </div>
    );
  }

  if (type === "map") {
    const mapLatKey = latKey || key;
    const mapLngKey = lngKey;
    const currentLat = getByPath(formData, mapLatKey, "");
    const currentLng = mapLngKey ? getByPath(formData, mapLngKey, "") : "";

    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`}>
        <FieldLabel label={label} required={required} type={type} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <Input label="Latitude" value={currentLat || ""} readOnly />
          <Input label="Longitude" value={currentLng || ""} readOnly />
        </div>

        <Button
          type="button"
          variant="outlined"
          className="rounded-xl"
          onClick={() => setMapOpen(true)}
          disabled={disabled}
        >
          Xəritədən koordinat seç
        </Button>

        <MapPicker
          open={mapOpen}
          onClose={() => setMapOpen(false)}
          lat={currentLat}
          lng={currentLng}
          onSelect={(lat, lng) => {
            onChange(mapLatKey, String(lat));
            if (mapLngKey) {
              onChange(mapLngKey, String(lng));
            }
          }}
        />

        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      </div>
    );
  }

  if (type === "custom") {
    if (typeof customRender !== "function") {
      return null;
    }

    return (
      <div className={`${commonWrapperClass} ${fieldCardClass}`}>
        <FieldLabel label={label} required={required} type={type} />
        <div className="mt-2 mb-2">
          {customRender()}
        </div>
        {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className={`${commonWrapperClass} ${fieldCardClass}`}>
      <FieldLabel label={label} required={required} type={type} />
      <Input
        label=" "
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(key, e.target.value)}
        placeholder={placeholder || label}
        disabled={disabled}
        error={!!error}
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

export function FormModal({
  open,
  onClose,
  title = "Form",
  description,
  fields = [],
  formData = {},
  errors = {},
  onFieldChange,
  onSubmit,
  onEditRequest,
  mode = "create",
  saving = false,
  submitLabel,
  cancelLabel = "Ləğv et",
  size = "lg",
}) {
  const { colorCode, getRgba } = useAppColor();
  const [localSaving, setLocalSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const closeButtonRef = useRef(null);

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

  useEffect(() => {
    if (!open) {
      setSubmitAttempted(false);
    }
  }, [open]);

  const visibleFields = useMemo(
    () =>
      fields.filter((field) => {
        if (!field) return false;
        if (field.hidden === true) return false;
        if (typeof field.visible === "function") {
          return field.visible(formData);
        }
        if (typeof field.visible === "boolean") {
          return field.visible;
        }
        return true;
      }),
    [fields, formData]
  );

  const packedFields = useMemo(() => {
    const next = [];
    let rowFill = 0;

    visibleFields.forEach((field) => {
      const span = field?.colSpan === 2 ? 2 : 1;

      if (span === 2) {
        if (rowFill === 1 && next.length > 0) {
          const lastIndex = next.length - 1;
          const lastField = next[lastIndex];
          if (lastField && (lastField.colSpan || 1) === 1) {
            next[lastIndex] = { ...lastField, colSpan: 2 };
          }
          rowFill = 0;
        }

        next.push(field);
        rowFill = 0;
        return;
      }

      next.push(field);
      rowFill = rowFill === 0 ? 1 : 0;
    });

    if (rowFill === 1 && next.length > 0) {
      const lastIndex = next.length - 1;
      const lastField = next[lastIndex];
      if (lastField && (lastField.colSpan || 1) === 1) {
        next[lastIndex] = { ...lastField, colSpan: 2 };
      }
    }

    return next;
  }, [visibleFields]);

  const requiredErrors = useMemo(() => {
    const map = {};
    visibleFields.forEach((field) => {
      if (!field?.required) return;

      if (field.type === "map") {
        const latPath = field.latKey || field.key;
        const lngPath = field.lngKey;
        const rawLat = getByPath(formData, latPath, "");
        const rawLng = lngPath ? getByPath(formData, lngPath, "") : "";
        const normalizedLat = typeof rawLat === "string" ? rawLat.trim() : rawLat;
        const normalizedLng = typeof rawLng === "string" ? rawLng.trim() : rawLng;

        if (
          normalizedLat === "" ||
          normalizedLat === null ||
          normalizedLat === undefined ||
          (lngPath && (normalizedLng === "" || normalizedLng === null || normalizedLng === undefined))
        ) {
          map[field.key] = "Koordinat seçmək mütləqdir";
        }
        return;
      }

      const rawValue = getByPath(formData, field.key, "");
      const normalizedValue = typeof rawValue === "string" ? rawValue.trim() : rawValue;
      if (normalizedValue === "" || normalizedValue === null || normalizedValue === undefined) {
        map[field.key] = "Bu sahə mütləqdir";
      }
    });
    return map;
  }, [visibleFields, formData]);

  if (!open) return null;

  const isInvalid = Object.keys(requiredErrors).length > 0;
  const isBusy = saving || localSaving;

  const handleSubmit = async () => {
    if (isBusy) return;

    if (isInvalid) {
      setSubmitAttempted(true);
      return;
    }

    if (mode === "edit" && onEditRequest) {
      onEditRequest(formData);
      return;
    }

    setLocalSaving(true);
    try {
      await onSubmit?.(formData);
      onClose?.();
    } finally {
      setLocalSaving(false);
    }
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
            <SparklesIcon className="h-5 w-5 text-white" />
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
        <div className="relative overflow-hidden rounded-xl border border-gray-200/70 dark:border-gray-700/70 bg-white/95 dark:bg-gray-800/95 p-4 sm:p-5 shadow-lg">
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl opacity-30"
            style={{ background: getRgba(0.45) }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {packedFields.map((field) => {
              const fieldValue = getByPath(formData, field.key, "");
              const fieldError = errors[field.key] || (submitAttempted ? requiredErrors[field.key] : undefined);
              return (
                <FormField
                  key={field.key}
                  field={field}
                  value={fieldValue}
                  error={fieldError}
                  onChange={onFieldChange}
                  formData={formData}
                />
              );
            })}
          </div>
        </div>
      </DialogBody>

      <DialogFooter className="relative z-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 px-4 py-4 sm:px-6 sm:py-5 border-t border-gray-200/80 dark:border-gray-700/80 bg-white/95 dark:bg-gray-800/95 rounded-b-lg sm:rounded-b-xl shrink-0">
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isBusy}
          className="w-full sm:w-auto rounded-xl px-6 inline-flex items-center justify-center gap-2 border-gray-300/90 hover:bg-gray-100/80 dark:hover:bg-gray-700/70"
        >
          <XMarkIcon className="h-4 w-4" />
          {cancelLabel}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isBusy}
          className="w-full sm:w-auto rounded-xl px-6 text-white border-0 disabled:opacity-60 inline-flex items-center justify-center gap-2 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${getRgba(0.95)}, ${getRgba(0.75)})`,
            boxShadow: `0 10px 25px -10px ${getRgba(0.7)}`,
          }}
        >
          <CheckIcon className="h-4 w-4" />
          {isBusy ? "Yadda saxlanılır..." : submitLabel || "Yadda saxla"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
