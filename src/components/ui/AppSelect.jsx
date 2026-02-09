import React, { useMemo } from "react";
import { Menu, MenuHandler, MenuList, MenuItem, Button, Typography } from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

/**
 * Universal dropdown select (MaterialTailwind Select-in yerinə stabil variant)
 *
 * props:
 * - items: array
 * - value: selected value (string|number|null)
 * - onChange: (value, item|null) => void
 * - placeholder: string
 * - loading: boolean
 * - disabled: boolean
 * - allowAll: boolean (default true)
 * - allLabel: string (default "Hamısı")
 * - getValue: (item) => string|number   (default item.id)
 * - getLabel: (item) => string          (default item.name)
 * - maxHeight: number (px)
 */
export default function AppSelect({
  items = [],
  value = null,
  onChange,
  placeholder = "Seç",
  loading = false,
  disabled = false,
  allowAll = true,
  allLabel = "Hamısı",
  getValue = (x) => x?.id,
  getLabel = (x) => x?.name,
  maxHeight = 320,
  buttonProps = {},
  menuProps = {},
}) {
  const normalizedValue = value === undefined ? null : value;

  const selectedItem = useMemo(() => {
    if (normalizedValue === null || normalizedValue === "" || normalizedValue === undefined) return null;
    return items.find((x) => String(getValue(x)) === String(normalizedValue)) || null;
  }, [items, normalizedValue, getValue]);

  const label = loading
    ? "Yüklənir..."
    : selectedItem
      ? String(getLabel(selectedItem) ?? "")
      : placeholder;

  const handlePickAll = () => onChange?.(null, null);

  const handlePick = (item) => {
    const v = getValue(item);
    onChange?.(v, item);
  };

  return (
    <Menu placement="bottom-start" allowHover={false} offset={5}>
      <MenuHandler>
        <Button
          variant="outlined"
          color="blue-gray"
          disabled={disabled || loading}
          className={`w-full justify-between flex items-center gap-2 dark:text-gray-200 dark:border-gray-700 ${
            disabled ? "opacity-70" : ""
          }`}
          {...buttonProps}
        >
          <span className="truncate">{label}</span>
          <ChevronDownIcon className="h-4 w-4 opacity-70" />
        </Button>
      </MenuHandler>

      <MenuList
        className="dark:bg-gray-800 dark:border-gray-700 max-h-[320px] overflow-y-auto scrollbar-thin z-[9999]"
        style={{ maxHeight, overflowY: "auto", zIndex: 9999 }}
        {...menuProps}
      >
        {allowAll ? (
          <MenuItem className="dark:text-gray-200 dark:hover:bg-gray-700" onClick={handlePickAll}>
            {allLabel}
          </MenuItem>
        ) : null}

        {!loading && items.length === 0 ? (
          <div className="px-3 py-2">
            <Typography className="text-xs text-blue-gray-500 dark:text-gray-300">
              Heç nə tapılmadı
            </Typography>
          </div>
        ) : null}

        {items.map((x, idx) => (
          <MenuItem
            key={`${String(getValue(x))}-${idx}`}
            className="dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={() => handlePick(x)}
          >
            {String(getLabel(x) ?? "—")}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
