import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import api from "@/services/api";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


export function AsyncSearchSelect({
  label,
  value,
  onChange,
  placeholder = "Seçin",
  searchPlaceholder = "Axtar...",
  error = false,
  disabled = false,
  className = "",
  labelClassName = "",
  endpoint,
  searchParams = {},
  labelKey = "name",
  valueKey = "id",
  selectedLabel = null,
  perPage = 20,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const selectRef = useRef(null);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const updateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const searchParamsKey = JSON.stringify(searchParams);
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParamsKey]);

  const parseResponse = useCallback((response) => {
    let data = [];
    let lastPage = 1;

    if (response.data?.success && response.data?.data) {
      const responseData = response.data.data;
      if (Array.isArray(responseData.data)) {
        data = responseData.data;
        lastPage = responseData.last_page || 1;
      } else if (Array.isArray(responseData)) {
        data = responseData;
      }
    } else if (response.data?.data && Array.isArray(response.data.data.data)) {
      data = response.data.data.data;
      lastPage = response.data.data.last_page || 1;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      data = response.data.data;
    } else if (Array.isArray(response.data)) {
      data = response.data;
    }

    return { data, lastPage };
  }, []);

  const fetchOptions = useCallback(async ({ search = "", pageNum = 1 } = {}) => {
    if (!endpoint) return;
    setLoading(true);
    try {
      const params = {
        ...searchParamsRef.current,
        per_page: perPage,
        page: pageNum,
      };

      if (search && search.trim()) {
        params.search = search.trim();
      }

      const response = await api.get(endpoint, { params });
      const { data, lastPage } = parseResponse(response);
      if (pageNum === 1) {
        setOptions(data);
      } else {
        setOptions((prev) => [...prev, ...data]);
      }
      setPage(pageNum);
      setHasMore(pageNum < lastPage);
    } catch (error) {
      console.error("AsyncSearchSelect fetch error:", error);
      if (pageNum === 1) setOptions([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [endpoint, perPage, parseResponse]);

  const loadMoreData = useCallback(async (search, pageNum) => {
    if (!endpoint || loadingMore) return;
    setLoadingMore(true);
    try {
      await fetchOptions({ search, pageNum });
    } catch (e) {
      console.error("AsyncSearchSelect load more error:", e);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [endpoint, loadingMore, fetchOptions]);

  const handleListScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !loadingMore && !loading) {
      loadMoreData(debouncedSearch, page + 1);
    }
  }, [hasMore, loadingMore, loading, page, debouncedSearch, loadMoreData]);

  useEffect(() => {
    if (!endpoint || disabled) return;
    fetchOptions({ search: debouncedSearch, pageNum: 1 });
  }, [endpoint, searchParamsKey, disabled, debouncedSearch, fetchOptions]);

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      setHasMore(true);
      fetchOptions({ search: debouncedSearch, pageNum: 1 });
    }
  }, [debouncedSearch, isOpen, fetchOptions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
      updateDropdownPosition();
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const getSelectedLabel = () => {
    if (!value) return null;
    if (!Array.isArray(options)) return selectedLabel;
    const selected = options.find((opt) => String(opt[valueKey]) === String(value));
    if (selected) {
      return selected[labelKey] || selected.apartment_number || `#${selected[valueKey]}`;
    }
    return selectedLabel;
  };

  const displayLabel = getSelectedLabel();

  const handleSelect = (option) => {
    onChange?.(option[valueKey], option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(null, null);
  };

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) {
        updateDropdownPosition();
        setPage(1);
        setHasMore(true);
        setOptions([]);
        setSearchTerm("");
      }
      setIsOpen(!isOpen);
    }
  };

  const dropdown = isOpen && createPortal(
    <div
      ref={dropdownRef}
      className="fixed bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl overflow-hidden"
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 99999,
      }}
    >
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      <div
        ref={listRef}
        className="max-h-52 overflow-y-auto"
        onScroll={handleListScroll}
      >
        <button
          type="button"
          onClick={() => handleSelect({ [valueKey]: "", [labelKey]: "Hamısı" })}
          className={`
            w-full px-3 py-2 text-left text-sm transition-colors
            ${!value
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
              : "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            }
          `}
        >
          Hamısı
        </button>

        {loading ? (
          <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400 text-center">
            <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500 mr-2" />
            Yüklənir...
          </div>
        ) : options.length === 0 ? (
          <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? "Nəticə tapılmadı" : "Seçim yoxdur"}
          </div>
        ) : (
          <>
            {options.map((option) => (
              <button
                key={option[valueKey]}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-3 py-2 text-left text-sm transition-colors
                  ${String(value) === String(option[valueKey])
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  }
                `}
              >
                {option[labelKey] || option.apartment_number || `#${option[valueKey]}`}
              </button>
            ))}
            {loadingMore && (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                <div className="inline-block animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-blue-500 mr-2" />
                Daha çox yüklənir...
              </div>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );

  return (
    <div className={`flex flex-col gap-1 relative ${className}`} ref={selectRef}>
      {label && (
        <label className={`text-sm font-medium text-gray-700 dark:text-gray-300 ${labelClassName}`}>
          {label}
        </label>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
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
        <span
          className={`
    flex-1 min-w-0 truncate
    ${displayLabel ? "" : "text-gray-400 dark:text-gray-500"}
  `}
        >
          {displayLabel || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <XMarkIcon
              className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={handleClear}
            />
          )}
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {dropdown}

      {error && typeof error === "string" && (
        <span className="text-xs text-red-500 mt-1">{error}</span>
      )}
    </div>
  );
}

export default AsyncSearchSelect;
