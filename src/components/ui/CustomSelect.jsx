import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export function CustomSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Seçin",
  error = false,
  disabled = false,
  className = "",
  labelClassName = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`flex flex-col gap-1 relative ${className}`} ref={selectRef}>
      {label && (
        <label className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}>
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2.5 rounded-lg border transition-all text-left flex items-center justify-between
          ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700" : "bg-white dark:bg-gray-800 cursor-pointer"}
          ${isOpen ? "ring-2 ring-blue-500/20 border-blue-500" : ""}
          text-gray-900 dark:text-white
          focus:outline-none
        `}
      >
        <span className={selectedOption ? "" : "text-gray-400 dark:text-gray-500"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">Seçim yoxdur</div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-3 py-2 text-left text-sm transition-colors
                  ${value === option.value
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                `}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      )}

      {error && typeof error === "string" && (
        <span className="text-xs text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
}

