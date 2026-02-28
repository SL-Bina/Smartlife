import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export function CustomSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Seçin",
  error = false,
  helperText = "",         // helper text below the select
  disabled = false,
  loading = false,
  loadingMore = false,       // when additional results are being fetched
  onScrollEnd,              // callback when user scrolls near bottom
  className = "",
  labelClassName = "",
  searchable = false,       // enable search functionality
  searchValue = "",         // current search value
  onSearchChange,           // search change handler
  searchPlaceholder = "Axtarın...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, openAbove: false });
  const [localSearchValue, setLocalSearchValue] = useState(searchValue || "");
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const calculatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = 240;
    const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    setPosition({
      left: rect.left,
      width: rect.width,
      openAbove,
      top: openAbove ? rect.top - 4 : rect.bottom + 4,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    calculatePosition();

    const handleClickOutside = (e) => {
      if (
        buttonRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      ) return;
      setIsOpen(false);
    };

    const handleScrollOrResize = () => {
      calculatePosition();
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    // Bütün scroll-lara qulaq as (modal daxili də)
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, calculatePosition]);


  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  const handleToggle = () => {
    if (!disabled && !loading) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelect = (option) => {
    onChange?.(option.value);
    setIsOpen(false);
  };

  // notify parent when scrolling near bottom
  const handleDropdownScroll = (e) => {
    if (typeof onScrollEnd === "function") {
      const { scrollTop, scrollHeight, clientHeight } = e.target;
      if (scrollHeight - scrollTop <= clientHeight + 50) {
        onScrollEnd();
      }
    }
  };

  // Handle search change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchValue(value);
    onSearchChange?.(value);
  };

  // Sync search value with prop
  useEffect(() => {
    setLocalSearchValue(searchValue || "");
  }, [searchValue]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, searchable]);

  // Filter options based on search
  const filteredOptions = searchable && localSearchValue
    ? options.filter(option => 
        option.label.toLowerCase().includes(localSearchValue.toLowerCase())
      )
    : options;

  const dropdown = isOpen
    ? createPortal(
        <div
          ref={dropdownRef}
          onScroll={handleDropdownScroll}
          style={{
            position: "fixed",
            top: position.openAbove ? "auto" : position.top,
            bottom: position.openAbove ? window.innerHeight - position.top : "auto",
            left: position.left,
            width: position.width,
            zIndex: 999999,
          }}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
        >
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-600">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={localSearchValue}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          )}
          
          {filteredOptions.length === 0 ? (
            <div className="px-3 py-2.5 text-sm text-gray-500 dark:text-gray-400">
              {localSearchValue ? "Nəticə tapılmadı" : "Seçim yoxdur"}
            </div>
          ) : (
            <>
              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(option);
                  }}
                  className={`
                    w-full px-3 py-2.5 text-left text-sm transition-colors
                    ${String(value) === String(option.value)
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
              {loadingMore && (
                <div className="px-3 py-2.5 text-center text-sm text-gray-500 dark:text-gray-400">
                  Yüklənir...
                </div>
              )}
            </>
          )}
        </div>,
        document.body
      )
    : null;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}>
          {label}
        </label>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={disabled || loading}
        className={`
          w-full px-3 py-2.5 rounded-lg border transition-all text-left flex items-center justify-between gap-2
          ${error ? "border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-600"}
          ${disabled || loading
            ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-700"
            : "bg-white dark:bg-gray-800 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
          }
          ${isOpen ? "ring-2 ring-blue-500/20 border-blue-500" : ""}
          focus:outline-none text-gray-900 dark:text-white
        `}
      >
        <span className={`truncate text-sm ${!selectedOption ? "text-gray-400 dark:text-gray-500" : ""}`}>
          {loading ? "Yüklənir..." : selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {error && typeof error === "string" && (
        <span className="text-xs text-red-500">{error}</span>
      )}

      {helperText && !error && (
        <span className="text-xs text-gray-500 dark:text-gray-400">{helperText}</span>
      )}

      {dropdown}
    </div>
  );
}