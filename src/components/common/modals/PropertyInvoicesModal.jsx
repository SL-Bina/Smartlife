import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  HomeModernIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  Squares2X2Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  Bars3Icon,
  EyeIcon,
  PencilSquareIcon,
  CreditCardIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import api from "@/services/api";
import complexesAPI from "@/services/management/complexesApi";
import buildingsAPI from "@/services/management/buildingsApi";
import blocksAPI from "@/services/management/blocksApi";
import propertiesAPI from "@/services/management/propertiesApi";
import { useAppColor } from "@/hooks/useAppColor";
import AsyncSearchSelect from "@/components/ui/AsyncSearchSelect";
import { AddBalanceCashModal } from "./AddBalanceCashModal";

const EMPTY_ARRAY = Object.freeze([]);

const normalizeList = (response) => {
  if (response?.data?.success && response?.data?.data) {
    const payload = response.data.data;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload)) return payload;
  }

  if (Array.isArray(response?.data?.data?.data)) return response.data.data.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const normalizeName = (item, fallbackPrefix) => {
  return (
    item?.name ||
    item?.title ||
    item?.label ||
    item?.apartment_number ||
    item?.number ||
    `${fallbackPrefix} #${item?.id ?? "-"}`
  );
};

const resolveEntityId = (item) => item?.id ?? item?.property_id ?? item?.block_id ?? item?.building_id ?? null;

export const PropertyInvoicesModal = ({
  open,
  onClose,
  lockClose = false,
  mtkId,
  complexId,
  initialProperty,
  title = "Mənzil üzrə qaimələr",
  refreshTrigger = 0,
  onSelect,
  onApply,
  onView,
  onEdit,
  onPay,
  onDelete,
}) => {
  const { colorCode, getRgba } = useAppColor();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedComplexId, setSelectedComplexId] = useState(complexId || null);
  const [selectedComplexLabel, setSelectedComplexLabel] = useState(null);

  const [buildings, setBuildings] = useState([]);
  const [buildingsLoading, setBuildingsLoading] = useState(false);
  const [treeLoading, setTreeLoading] = useState({});

  const [expandedBuildings, setExpandedBuildings] = useState({});
  const [expandedBlocks, setExpandedBlocks] = useState({});

  const [blocksByBuilding, setBlocksByBuilding] = useState({});
  const [propertiesByBlock, setPropertiesByBlock] = useState({});
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyInvoices, setPropertyInvoices] = useState([]);
  const [propertyInvoicesLoading, setPropertyInvoicesLoading] = useState(false);
  const [propertyInvoicesError, setPropertyInvoicesError] = useState("");
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [balanceRefreshKey, setBalanceRefreshKey] = useState(0);
  const [invoiceSection, setInvoiceSection] = useState("unpaid");
  const [loadError, setLoadError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const residentResolvedPropertyIdRef = useRef(null);
  const SIDEBAR_WIDTH = 300;

  const buildingParams = useMemo(() => {
    const params = {};
    if (mtkId) params.mtk_ids = [mtkId];
    if (selectedComplexId) params.complex_ids = [selectedComplexId];
    return params;
  }, [mtkId, selectedComplexId]);

  const hierarchyParams = useMemo(() => {
    const params = {};
    if (mtkId) params.mtk_ids = [mtkId];
    return params;
  }, [mtkId]);

  const isResidentPanel = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname.includes("/resident");
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    if (!open) {
      setSearch("");
      setDebouncedSearch("");
      setSelectedComplexId(complexId || null);
      setSelectedComplexLabel(null);
      setBuildings([]);
      setExpandedBuildings({});
      setExpandedBlocks({});
      setBlocksByBuilding({});
      setPropertiesByBlock({});
      setTreeLoading({});
      setSelectedProperty(null);
      setPropertyInvoices([]);
      setPropertyInvoicesLoading(false);
      setPropertyInvoicesError("");
      setBalanceModalOpen(false);
      setLoadError("");
      setIsSidebarOpen(false);
      residentResolvedPropertyIdRef.current = null;
    }
  }, [open, complexId]);

  const formatDate = (value) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleDateString("az-AZ", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return value;
    }
  };

  const formatMoney = (value) => `${parseFloat(value || 0).toFixed(2)} ₼`;

  const getStatusTone = (status) => {
    const map = {
      paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
      unpaid: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
      not_paid: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
      overdue: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
      draft: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      pre_paid: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    };
    return map[status] || map.unpaid;
  };

  const isUnpaidStatus = useCallback((status) => ["unpaid", "not_paid", "overdue"].includes(status), []);

  const invoiceStats = useMemo(() => {
    const unpaidInvoices = propertyInvoices.filter((item) => isUnpaidStatus(item?.status));
    const paidInvoices = propertyInvoices.filter((item) => Number(item?.amount_paid || 0) > 0 || item?.status === "paid");
    const totalDebt = unpaidInvoices.reduce((sum, item) => {
      const remaining = Number(item?.amount || 0) - Number(item?.amount_paid || 0);
      return sum + Math.max(remaining, 0);
    }, 0);

    const servicesMap = propertyInvoices.reduce((acc, invoice) => {
      const serviceId = invoice?.service?.id ?? invoice?.service_id ?? invoice?.service?.name ?? "unknown";
      const serviceName = invoice?.service?.name || invoice?.service?.title || "Xidmət";
      const current = acc[serviceId] || {
        id: serviceId,
        name: serviceName,
        invoicesCount: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalRemaining: 0,
      };

      const amount = Number(invoice?.amount || 0);
      const paid = Number(invoice?.amount_paid || 0);
      current.invoicesCount += 1;
      current.totalAmount += amount;
      current.totalPaid += paid;
      current.totalRemaining += Math.max(amount - paid, 0);
      acc[serviceId] = current;
      return acc;
    }, {});

    const services = Object.values(servicesMap).sort((a, b) => b.totalRemaining - a.totalRemaining);

    return {
      unpaidInvoices,
      paidInvoices,
      services,
      totalDebt,
      totalInvoices: propertyInvoices.length,
      unpaidCount: unpaidInvoices.length,
      paidCount: paidInvoices.length,
    };
  }, [propertyInvoices, isUnpaidStatus]);

  const paymentHistory = useMemo(() => {
    return [...invoiceStats.paidInvoices].sort((a, b) => {
      const left = new Date(a?.paid_at || a?.updated_at || a?.due_date || 0).getTime();
      const right = new Date(b?.paid_at || b?.updated_at || b?.due_date || 0).getTime();
      return right - left;
    });
  }, [invoiceStats.paidInvoices]);

  useEffect(() => {
    const propertyId = selectedProperty?.id;
    if (!open || !propertyId) {
      setPropertyInvoices([]);
      setPropertyInvoicesError("");
      setPropertyInvoicesLoading(false);
      return;
    }

    setInvoiceSection("unpaid");

    let cancelled = false;

    const fetchPropertyInvoices = async () => {
      try {
        setPropertyInvoicesLoading(true);
        setPropertyInvoicesError("");

        const response = await api.get("/search/module/finance/invoice", {
          params: {
            ...(mtkId ? { "mtk_ids[]": [mtkId] } : {}),
            "property_ids[]": [propertyId],
            page: 1,
            per_page: 50,
          },
        });

        const payload = response?.data?.data;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.data)
            ? payload.data
            : [];

        if (!cancelled) {
          setPropertyInvoices(list);
        }
      } catch (error) {
        if (!cancelled) {
          setPropertyInvoices([]);
          setPropertyInvoicesError(error?.message || "Fakturalar yüklənərkən xəta baş verdi");
        }
      } finally {
        if (!cancelled) {
          setPropertyInvoicesLoading(false);
        }
      }
    };

    fetchPropertyInvoices();

    return () => {
      cancelled = true;
    };
  }, [open, selectedProperty?.id, mtkId, refreshTrigger, balanceRefreshKey]);

  const fetchBuildings = useCallback(async () => {
    if (!open) return;
    setBuildingsLoading(true);
    setLoadError("");

    try {
      const response = await api.get("/search/module/building", {
        params: {
          ...buildingParams,
          search: debouncedSearch || undefined,
          per_page: 50,
          page: 1,
        },
      });

      setBuildings(normalizeList(response));
    } catch (error) {
      setBuildings([]);
      setLoadError(error?.message || "Binalar yüklənərkən xəta baş verdi");
    } finally {
      setBuildingsLoading(false);
    }
  }, [open, buildingParams, debouncedSearch]);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  const setLoadingState = (key, value) => {
    setTreeLoading((prev) => ({ ...prev, [key]: value }));
  };

  const loadBlocks = useCallback(async (buildingId) => {
    if (!buildingId || blocksByBuilding[buildingId]) return;
    const loadKey = `blocks-${buildingId}`;

    try {
      setLoadingState(loadKey, true);
      const response = await api.get("/search/module/block", {
        params: {
          ...hierarchyParams,
          building_ids: [buildingId],
          per_page: 100,
          page: 1,
        },
      });

      setBlocksByBuilding((prev) => ({
        ...prev,
        [buildingId]: normalizeList(response),
      }));
    } catch {
      setBlocksByBuilding((prev) => ({ ...prev, [buildingId]: [] }));
    } finally {
      setLoadingState(loadKey, false);
    }
  }, [hierarchyParams, blocksByBuilding]);

  const loadProperties = useCallback(async (buildingId, blockId) => {
    if (!blockId || propertiesByBlock[blockId]) return;
    const loadKey = `properties-${blockId}`;

    try {
      setLoadingState(loadKey, true);
      const response = await api.get("/search/module/property", {
        params: {
          ...hierarchyParams,
          building_ids: buildingId ? [buildingId] : EMPTY_ARRAY,
          block_ids: [blockId],
          per_page: 200,
          page: 1,
        },
      });

      setPropertiesByBlock((prev) => ({
        ...prev,
        [blockId]: normalizeList(response),
      }));
    } catch {
      setPropertiesByBlock((prev) => ({ ...prev, [blockId]: [] }));
    } finally {
      setLoadingState(loadKey, false);
    }
  }, [hierarchyParams, propertiesByBlock]);

  useEffect(() => {
    if (!open || !initialProperty?.id) return;

    const rawComplexName =
      initialProperty.raw?.complex?.name ||
      initialProperty.raw?.complex_name ||
      initialProperty.raw?.meta?.complex_name ||
      null;
    const rawBuildingName =
      initialProperty.raw?.building?.name ||
      initialProperty.raw?.building_name ||
      initialProperty.raw?.meta?.building_name ||
      null;
    const rawBlockName =
      initialProperty.raw?.block?.name ||
      initialProperty.raw?.block_name ||
      initialProperty.raw?.meta?.block_name ||
      null;

    const preset = {
      id: initialProperty.id,
      name:
        initialProperty.name ||
        initialProperty.raw?.meta?.apartment_number ||
        normalizeName(initialProperty.raw || initialProperty, "Mənzil"),
      apartmentNumber:
        initialProperty.apartmentNumber ||
        initialProperty.raw?.meta?.apartment_number ||
        initialProperty.raw?.apartment_number ||
        null,
      complexId: initialProperty.complexId || initialProperty.raw?.complex_id || null,
      complexName:
        initialProperty.complexName ||
        rawComplexName ||
        (initialProperty.complexId ? `Kompleks #${initialProperty.complexId}` : selectedComplexLabel || "-"),
      buildingId: initialProperty.buildingId || null,
      buildingName:
        initialProperty.buildingName ||
        rawBuildingName ||
        (initialProperty.buildingId ? `Bina #${initialProperty.buildingId}` : "-"),
      blockId: initialProperty.blockId || null,
      blockName:
        initialProperty.blockName ||
        rawBlockName ||
        (initialProperty.blockId ? `Blok #${initialProperty.blockId}` : "-"),
      raw: initialProperty.raw || initialProperty,
    };

    if (initialProperty.complexId) {
      setSelectedComplexId(initialProperty.complexId);
    }

    setSelectedProperty(preset);
    onSelect?.(preset);

    if (preset.buildingId) {
      setExpandedBuildings((prev) => ({ ...prev, [preset.buildingId]: true }));
      loadBlocks(preset.buildingId);
    }
    if (preset.blockId) {
      setExpandedBlocks((prev) => ({ ...prev, [preset.blockId]: true }));
      loadProperties(preset.buildingId, preset.blockId);
    }
  }, [open, initialProperty, onSelect, loadBlocks, loadProperties, selectedComplexLabel]);

  useEffect(() => {
    if (!open || !selectedProperty?.id) return;

    const currentId = String(selectedProperty.id);
    if (residentResolvedPropertyIdRef.current === currentId) return;

    let cancelled = false;

    const applyHydratedProperty = (matched) => {
      if (!matched || cancelled) return;

      const nextComplexName = matched?.complex?.name || matched?.mtk?.name || selectedProperty?.complexName;
      const nextBuildingName = matched?.building?.name || selectedProperty?.buildingName;
      const nextBlockName = matched?.block?.name || selectedProperty?.blockName;
      const nextName =
        matched?.name ||
        matched?.meta?.apartment_number ||
        selectedProperty?.name;

      setSelectedProperty((prev) => {
        if (!prev || String(prev.id) !== currentId) return prev;
        return {
          ...prev,
          name: nextName || prev.name,
          apartmentNumber: matched?.meta?.apartment_number || prev.apartmentNumber,
          complexId: matched?.complex_id || prev.complexId,
          complexName: nextComplexName || prev.complexName,
          buildingId: matched?.building_id || prev.buildingId,
          buildingName: nextBuildingName || prev.buildingName,
          blockId: matched?.block_id || prev.blockId,
          blockName: nextBlockName || prev.blockName,
          raw: {
            ...(prev.raw || {}),
            ...matched,
          },
        };
      });

      if (matched?.complex_id) {
        setSelectedComplexId(matched.complex_id);
      }
      if (nextComplexName) {
        setSelectedComplexLabel(nextComplexName);
      }
    };

    const hydrateSelectedProperty = async () => {
      try {
        if (isResidentPanel) {
          const response = await api.get("/module/resident/config/my/properties", {
            params: {
              apartmentId: selectedProperty.id,
              property_id: selectedProperty.id,
            },
          });

          const list = normalizeList(response);
          const matched =
            list.find((item) => String(item?.id) === currentId) ||
            list.find((item) => String(item?.property_id) === currentId) ||
            list[0];

          if (matched) {
            applyHydratedProperty(matched);
            residentResolvedPropertyIdRef.current = currentId;
            return;
          }
        }

        const propertyRes = await propertiesAPI.getById(selectedProperty.id);
        const propertyData = propertyRes?.data?.data ?? propertyRes?.data ?? null;
        if (propertyData) {
          applyHydratedProperty(propertyData);
        }
        residentResolvedPropertyIdRef.current = currentId;
      } catch {
        residentResolvedPropertyIdRef.current = currentId;
      }
    };

    hydrateSelectedProperty();

    return () => {
      cancelled = true;
    };
  }, [open, selectedProperty?.id, isResidentPanel]);

  useEffect(() => {
    if (!open || !selectedProperty?.id) return;

    const isMissingOrFallback = (value, prefix) => {
      if (!value) return true;
      if (value === "-") return true;
      return typeof value === "string" && value.startsWith(prefix);
    };

    const needComplex = selectedProperty?.complexId && isMissingOrFallback(selectedProperty?.complexName, "Kompleks #");
    const needBuilding = selectedProperty?.buildingId && isMissingOrFallback(selectedProperty?.buildingName, "Bina #");
    const needBlock = selectedProperty?.blockId && isMissingOrFallback(selectedProperty?.blockName, "Blok #");

    if (!needComplex && !needBuilding && !needBlock) return;

    let cancelled = false;

    const resolveNames = async () => {
      const updates = {};

      try {
        if (needComplex) {
          const res = await complexesAPI.getById(selectedProperty.complexId);
          const complexData = res?.data?.data ?? res?.data ?? null;
          if (complexData?.name) {
            updates.complexName = complexData.name;
            setSelectedComplexLabel(complexData.name);
          }
        }
      } catch {
        // Keep existing fallback labels if lookup fails.
      }

      try {
        if (needBuilding) {
          const res = await buildingsAPI.getById(selectedProperty.buildingId);
          const buildingData = res?.data?.data ?? res?.data ?? null;
          if (buildingData?.name) {
            updates.buildingName = buildingData.name;
          }
        }
      } catch {
        // Keep existing fallback labels if lookup fails.
      }

      try {
        if (needBlock) {
          const res = await blocksAPI.getById(selectedProperty.blockId);
          const blockData = res?.data?.data ?? res?.data ?? null;
          if (blockData?.name) {
            updates.blockName = blockData.name;
          }
        }
      } catch {
        // Keep existing fallback labels if lookup fails.
      }

      if (cancelled || Object.keys(updates).length === 0) return;

      setSelectedProperty((prev) => {
        if (!prev || String(prev.id) !== String(selectedProperty.id)) return prev;
        return {
          ...prev,
          ...updates,
        };
      });
    };

    resolveNames();

    return () => {
      cancelled = true;
    };
  }, [
    open,
    selectedProperty?.id,
    selectedProperty?.complexId,
    selectedProperty?.complexName,
    selectedProperty?.buildingId,
    selectedProperty?.buildingName,
    selectedProperty?.blockId,
    selectedProperty?.blockName,
  ]);

  useEffect(() => {
    if (!open || !selectedProperty?.buildingId) return;

    const buildingId = selectedProperty.buildingId;
    const blockId = selectedProperty?.blockId;

    setExpandedBuildings((prev) => (
      prev[buildingId]
        ? prev
        : { ...prev, [buildingId]: true }
    ));

    loadBlocks(buildingId);

    if (blockId) {
      setExpandedBlocks((prev) => (
        prev[blockId]
          ? prev
          : { ...prev, [blockId]: true }
      ));
      loadProperties(buildingId, blockId);
    }
  }, [open, selectedProperty?.buildingId, selectedProperty?.blockId, loadBlocks, loadProperties]);

  const handleComplexChange = (value, option) => {
    const nextComplexId = value || null;
    setSelectedComplexId(nextComplexId);
    setSelectedComplexLabel(nextComplexId ? option?.name || option?.title || option?.label || `#${nextComplexId}` : null);

    setBuildings([]);
    setExpandedBuildings({});
    setExpandedBlocks({});
    setBlocksByBuilding({});
    setPropertiesByBlock({});
    setSelectedProperty(null);
    setLoadError("");
  };

  const handleBuildingToggle = async (building) => {
    const buildingId = resolveEntityId(building);
    if (!buildingId) return;

    const isActiveBuilding = String(selectedProperty?.buildingId) === String(buildingId);
    const isOpening = !expandedBuildings[buildingId];

    if (!isOpening && isActiveBuilding) {
      return;
    }

    setExpandedBuildings((prev) => ({
      ...prev,
      [buildingId]: isOpening,
    }));

    if (isOpening) {
      await loadBlocks(buildingId);
    }
  };

  const handleBlockToggle = async (buildingId, block) => {
    const blockId = resolveEntityId(block);
    if (!blockId) return;

    const isActiveBlock = String(selectedProperty?.blockId) === String(blockId);
    const isOpening = !expandedBlocks[blockId];

    if (!isOpening && isActiveBlock) {
      return;
    }

    setExpandedBlocks((prev) => ({
      ...prev,
      [blockId]: isOpening,
    }));

    if (isOpening) {
      await loadProperties(buildingId, blockId);
    }
  };

  const handlePropertySelect = (building, block, property) => {
    const resolvedComplexId = property?.complex_id || selectedComplexId || null;
    const model = {
      id: resolveEntityId(property),
      name: property?.name || property?.meta?.apartment_number || normalizeName(property, "Mənzil"),
      apartmentNumber: property?.meta?.apartment_number || property?.apartment_number || property?.number || null,
      complexId: resolvedComplexId,
      complexName:
        property?.complex?.name ||
        selectedComplexLabel ||
        (resolvedComplexId ? `Kompleks #${resolvedComplexId}` : "-"),
      buildingId: resolveEntityId(building),
      buildingName: normalizeName(building, "Bina"),
      blockId: resolveEntityId(block),
      blockName: normalizeName(block, "Blok"),
      raw: property,
    };

    setSelectedProperty(model);
    onSelect?.(model);
  };

  const handleApply = () => {
    if (!selectedProperty) return;
    onApply?.(selectedProperty);
  };

  const handleModalClose = () => {
    if (lockClose) return;
    onClose?.();
  };

  const renderInvoiceActions = (invoice) => {
    const hasAnyAction = onView || onEdit || onPay || onDelete;
    if (!hasAnyAction) return null;

    return (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {onView && (
          <button
            type="button"
            onClick={() => onView(invoice)}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-[11px] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <EyeIcon className="h-3.5 w-3.5" />
            Bax
          </button>
        )}
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(invoice)}
            className="inline-flex items-center gap-1 rounded-md border border-gray-300 dark:border-gray-600 px-2 py-1 text-[11px] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <PencilSquareIcon className="h-3.5 w-3.5" />
            Redaktə et
          </button>
        )}
        {onPay && (
          <button
            type="button"
            onClick={() => onPay(invoice)}
            className="inline-flex items-center gap-1 rounded-md border border-blue-200 dark:border-blue-800 px-2 py-1 text-[11px] text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <CreditCardIcon className="h-3.5 w-3.5" />
            Ödə
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(invoice)}
            className="inline-flex items-center gap-1 rounded-md border border-red-200 dark:border-red-800 px-2 py-1 text-[11px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <TrashIcon className="h-3.5 w-3.5" />
            Sil
          </button>
        )}
      </div>
    );
  };

  const headerTitle = selectedProperty
    ? `${selectedProperty?.name || selectedProperty?.apartmentNumber || "-"}`
    : (title || "Mənzil seçimi");

  if (!open) return null;

  return (
    <Dialog
      open={open}
      handler={handleModalClose}
      size="xl"
      className={`${lockClose ? "z-[20]" : "z-[60]"} w-[96vw] max-w-6xl h-[88vh] overflow-hidden rounded-lg sm:rounded-xl border-[0.5px] border-gray-200/55 dark:border-gray-700/55 bg-white dark:bg-gray-800 shadow-2xl flex flex-col`}
      dismiss={{ enabled: !lockClose }}
    >
      <DialogHeader
        className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 text-white border-b border-white/15 rounded-t-lg sm:rounded-t-xl"
        style={{ background: `linear-gradient(135deg, ${getRgba(0.95)}, ${getRgba(0.75)})` }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <HomeModernIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <Typography variant="h5" className="text-white font-bold">{headerTitle}</Typography>
            <Typography variant="small" className="text-white/90">
              Sol menyudan bina, blok və mənzil seçərək qaimə əməliyyatlarını idarə edin
            </Typography>
          </div>
        </div>

        <button
          type="button"
          onClick={handleModalClose}
          disabled={lockClose}
          className="h-9 w-9 rounded-xl grid place-items-center bg-white/15 hover:bg-white/25 transition-colors flex-shrink-0"
          aria-label="Bağla"
        >
          <XMarkIcon className="h-5 w-5 text-white" />
        </button>
      </DialogHeader>

      <DialogBody className="p-0 bg-gray-50 dark:bg-gray-900 overflow-hidden flex-1 min-h-0">
        <div className="flex h-full min-h-0">
          <motion.div
            initial={false}
            animate={{
              width: isSidebarOpen ? SIDEBAR_WIDTH : 0,
              x: isSidebarOpen ? 0 : -SIDEBAR_WIDTH,
              opacity: isSidebarOpen ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`relative overflow-hidden shrink-0 ${isSidebarOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          >
          <aside className="absolute inset-y-0 left-0 w-[300px] bg-gradient-to-b from-white to-gray-50/70 dark:from-gray-800 dark:to-gray-900/70 overflow-hidden flex flex-col min-h-0 h-full border-r border-gray-200 dark:border-gray-700">
            <div
              className="p-4 border-b border-gray-200/80 dark:border-gray-700/80"
              style={{ background: `linear-gradient(180deg, ${getRgba(0.12)}, transparent)` }}
            >
              <div className="mb-3">
                <AsyncSearchSelect
                  label="Kompleks"
                  value={selectedComplexId}
                  onChange={handleComplexChange}
                  endpoint="/search/module/complex"
                  searchParams={mtkId ? { mtk_ids: [mtkId] } : {}}
                  selectedLabel={selectedComplexLabel}
                  placeholder="Kompleks seçin"
                  searchPlaceholder="Kompleks axtar..."
                  allowClear
                  disabled={false}
                  className="text-sm"
                />
              </div>

              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Bina axtar..."
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-9 pr-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            <div
              className="overflow-y-auto px-2 py-3 flex-1 min-h-0 pr-1"
              style={{ scrollbarWidth: "thin", scrollbarColor: `${getRgba(0.5)} transparent` }}
            >
              {buildingsLoading ? (
                <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Binalar yüklənir...</div>
              ) : loadError ? (
                <div className="px-3 py-4 text-sm text-red-500">{loadError}</div>
              ) : buildings.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">Bina tapılmadı</div>
              ) : (
                buildings.map((building) => {
                  const buildingId = resolveEntityId(building);
                  const isBuildingExpanded = !!expandedBuildings[buildingId] || String(selectedProperty?.buildingId) === String(buildingId);
                  const blocks = blocksByBuilding[buildingId] || EMPTY_ARRAY;
                  const blocksLoading = !!treeLoading[`blocks-${buildingId}`];

                  return (
                    <div key={buildingId} className="mb-1">
                      <button
                        type="button"
                        onClick={() => handleBuildingToggle(building)}
                        className="w-full flex items-center justify-between rounded-xl border border-transparent px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700/70 text-gray-800 dark:text-gray-100 transition-colors"
                        style={
                          isBuildingExpanded
                            ? {
                                backgroundColor: getRgba(0.16),
                                borderColor: getRgba(0.4),
                                color: colorCode || "#2563eb",
                              }
                            : undefined
                        }
                      >
                        <span className="inline-flex items-center gap-2 min-w-0">
                          <BuildingOfficeIcon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{normalizeName(building, "Bina")}</span>
                        </span>
                        {isBuildingExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
                      </button>

                      {isBuildingExpanded && (
                        <div className="ml-3 border-l border-gray-200 dark:border-gray-700 pl-2 py-1 space-y-1">
                          {blocksLoading ? (
                            <div className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400">Bloklar yüklənir...</div>
                          ) : blocks.length === 0 ? (
                            <div className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400">Blok yoxdur</div>
                          ) : (
                            blocks.map((block) => {
                              const blockId = resolveEntityId(block);
                              const isBlockExpanded = !!expandedBlocks[blockId] || String(selectedProperty?.blockId) === String(blockId);
                              const properties = propertiesByBlock[blockId] || EMPTY_ARRAY;
                              const propertiesLoading = !!treeLoading[`properties-${blockId}`];

                              return (
                                <div key={blockId}>
                                  <button
                                    type="button"
                                    onClick={() => handleBlockToggle(buildingId, block)}
                                    className="w-full flex items-center justify-between rounded-lg border border-transparent px-2 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-gray-700/70 text-gray-700 dark:text-gray-200 transition-colors"
                                    style={
                                      isBlockExpanded
                                        ? {
                                            backgroundColor: getRgba(0.12),
                                            borderColor: getRgba(0.28),
                                            color: colorCode || "#2563eb",
                                          }
                                        : undefined
                                    }
                                  >
                                    <span className="inline-flex items-center gap-2 min-w-0">
                                      <BuildingOffice2Icon className="h-3.5 w-3.5 shrink-0" />
                                      <span className="truncate"> {normalizeName(block, "Blok")}</span>
                                    </span>
                                    {isBlockExpanded ? <ChevronDownIcon className="h-3.5 w-3.5" /> : <ChevronRightIcon className="h-3.5 w-3.5" />}
                                  </button>

                                  {isBlockExpanded && (
                                    <div className="ml-3 border-l border-gray-200 dark:border-gray-700 pl-2 py-1 space-y-1">
                                      {propertiesLoading ? (
                                        <div className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">Mənzillər yüklənir...</div>
                                      ) : properties.length === 0 ? (
                                        <div className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">Mənzil yoxdur</div>
                                      ) : (
                                        properties.map((property) => {
                                          const propertyId = resolveEntityId(property);
                                          const isActive = String(selectedProperty?.id) === String(propertyId);
                                          return (
                                            <button
                                              key={propertyId}
                                              type="button"
                                              onClick={() => handlePropertySelect(building, block, property)}
                                              className={`w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                                                isActive
                                                  ? "text-white"
                                                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/70"
                                              }`}
                                              style={
                                                isActive
                                                  ? { background: colorCode || "#2563eb" }
                                                  : undefined
                                              }
                                            >
                                              <span className="inline-flex items-center gap-2 min-w-0">
                                                <HomeModernIcon className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">{normalizeName(property, "Mənzil")}</span>
                                              </span>
                                            </button>
                                          );
                                        })
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </aside>
          </motion.div>

          <section className="flex-1 overflow-y-auto p-4 sm:p-5 min-h-0 h-full">
            <div className="mb-3 flex justify-start">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={isSidebarOpen ? "Sidebarı gizlət" : "Sidebarı göstər"}
              >
                <Bars3Icon className="h-4 w-4 mr-1.5" />
                Butun menzilleri goster
              </button>
            </div>
            <div className="rounded-xl border-[0.5px] border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm space-y-5">
              <div>
                <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">Seçilmiş mənzil</Typography>
                <Typography variant="small" className="text-gray-500 dark:text-gray-400 mt-1">
                  Qaimə əməliyyatı üçün soldan mənzil seçin.
                </Typography>
              </div>

              {!selectedProperty ? (
                <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-6 text-sm text-gray-500 dark:text-gray-400">
                  Hələ heç bir mənzil seçilməyib.
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Bina</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{selectedProperty.buildingName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Blok</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{selectedProperty.blockName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Mənzil</p>
                        <p className="font-semibold text-gray-800 dark:text-white">{selectedProperty.name}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setBalanceModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                      >
                        <BanknotesIcon className="h-4 w-4" />
                        Balansı artır
                      </button>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-200 inline-flex items-center gap-2">
                        <DocumentTextIcon className="h-4 w-4" />
                        Seçilmiş mənzilin fakturaları
                      </Typography>
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                        style={{ backgroundColor: getRgba(0.16), color: colorCode || "#2563eb" }}
                      >
                        {propertyInvoices.length} faktura
                      </span>
                    </div>

                    {propertyInvoicesLoading ? (
                      <div className="space-y-2">
                        <div className="h-12 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        <div className="h-12 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        <div className="h-12 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                      </div>
                    ) : propertyInvoicesError ? (
                      <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-300">
                        {propertyInvoicesError}
                      </div>
                    ) : propertyInvoices.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-4 text-sm text-gray-500 dark:text-gray-400">
                        Bu mənzil üçün faktura tapılmadı.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="rounded-xl p-3 sm:p-4 border dark:border-gray-700" style={{ background: getRgba(0.08), borderColor: getRgba(0.2) }}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <Typography variant="small" className="text-gray-500 dark:text-gray-400">Mənzilin ümumi borcu</Typography>
                              <Typography className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                                {formatMoney(invoiceStats.totalDebt)}
                              </Typography>
                            </div>
                            <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 bg-white/70 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700">
                              {invoiceStats.unpaidCount} ödənilməmiş
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 mt-3">
                            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 p-2 text-center">
                              <p className="text-[11px] text-gray-500 dark:text-gray-400">Cəmi</p>
                              <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{invoiceStats.totalInvoices}</p>
                            </div>
                            <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-2 text-center">
                              <p className="text-[11px] text-red-500 dark:text-red-300">Ödənilməmiş</p>
                              <p className="text-sm font-bold text-red-600 dark:text-red-300">{invoiceStats.unpaidCount}</p>
                            </div>
                            <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-2 text-center">
                              <p className="text-[11px] text-green-600 dark:text-green-300">Ödənilib</p>
                              <p className="text-sm font-bold text-green-600 dark:text-green-300">{invoiceStats.paidCount}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center rounded-xl border dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 p-0.5 gap-0.5">
                          {[
                            { id: "unpaid", label: `Ödənilməmiş (${invoiceStats.unpaidCount})`, icon: ExclamationCircleIcon },
                            { id: "history", label: `Ödəniş tarixçəsi (${paymentHistory.length})`, icon: CheckCircleIcon },
                            { id: "services", label: `Xidmətlər (${invoiceStats.services.length})`, icon: Squares2X2Icon },
                          ].map((tab) => {
                            const Icon = tab.icon;
                            const active = invoiceSection === tab.id;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                onClick={() => setInvoiceSection(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all ${
                                  active
                                    ? "text-white shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                }`}
                                style={active ? { background: colorCode || "#2563eb" } : undefined}
                              >
                                <Icon className="h-3.5 w-3.5" />
                                <span className="truncate">{tab.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2" style={{ scrollbarWidth: "thin" }}>
                          {invoiceSection === "unpaid" && (
                            invoiceStats.unpaidInvoices.length === 0 ? (
                              <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-4 text-sm text-gray-500 dark:text-gray-400">
                                Ödənilməmiş faktura yoxdur.
                              </div>
                            ) : (
                              invoiceStats.unpaidInvoices.map((invoice) => {
                                const remaining = Math.max(parseFloat(invoice?.amount || 0) - parseFloat(invoice?.amount_paid || 0), 0);
                                return (
                                  <div
                                    key={invoice?.id || `${invoice?.service_id}-${invoice?.start_date}`}
                                    className="rounded-lg border border-red-200/70 dark:border-red-800/60 bg-white dark:bg-gray-900/40 p-3"
                                  >
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                      <div>
                                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                          {invoice?.service?.name || `Faktura #${invoice?.id || "-"}`}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {invoice?.id || "-"}</p>
                                      </div>
                                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${getStatusTone(invoice?.status)}`}>
                                        {invoice?.status || "-"}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                      <p className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-300"><CurrencyDollarIcon className="h-3.5 w-3.5" /> Məbləğ: <span className="font-semibold">{formatMoney(invoice?.amount)}</span></p>
                                      <p className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CurrencyDollarIcon className="h-3.5 w-3.5" /> Ödənilib: <span className="font-semibold">{formatMoney(invoice?.amount_paid)}</span></p>
                                      <p className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400"><CurrencyDollarIcon className="h-3.5 w-3.5" /> Qalıq: <span className="font-semibold">{formatMoney(remaining)}</span></p>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 inline-flex items-center gap-1"><CalendarDaysIcon className="h-3.5 w-3.5" /> Son tarix: {formatDate(invoice?.due_date)}</div>
                                    {renderInvoiceActions(invoice)}
                                  </div>
                                );
                              })
                            )
                          )}

                          {invoiceSection === "history" && (
                            paymentHistory.length === 0 ? (
                              <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-4 text-sm text-gray-500 dark:text-gray-400">
                                Ödəniş tarixçəsi yoxdur.
                              </div>
                            ) : (
                              paymentHistory.map((invoice) => (
                                <div
                                  key={invoice?.id || `${invoice?.service_id}-${invoice?.paid_at}`}
                                  className="rounded-lg border border-green-200/70 dark:border-green-800/60 bg-white dark:bg-gray-900/40 p-3"
                                >
                                  <div className="flex items-start justify-between gap-3 mb-2">
                                    <div>
                                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{invoice?.service?.name || `Faktura #${invoice?.id || "-"}`}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">ID: {invoice?.id || "-"}</p>
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${getStatusTone(invoice?.status)}`}>
                                      {invoice?.status || "paid"}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <p className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CurrencyDollarIcon className="h-3.5 w-3.5" /> Ödənilən: <span className="font-semibold">{formatMoney(invoice?.amount_paid)}</span></p>
                                    <p className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-300"><CalendarDaysIcon className="h-3.5 w-3.5" /> Tarix: <span className="font-semibold">{formatDate(invoice?.paid_at || invoice?.updated_at || invoice?.due_date)}</span></p>
                                  </div>
                                  {renderInvoiceActions(invoice)}
                                </div>
                              ))
                            )
                          )}

                          {invoiceSection === "services" && (
                            invoiceStats.services.length === 0 ? (
                              <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-4 text-sm text-gray-500 dark:text-gray-400">
                                Xidmət məlumatı yoxdur.
                              </div>
                            ) : (
                              invoiceStats.services.map((service) => (
                                <div key={service.id} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-3">
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{service.name}</p>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{service.invoicesCount} faktura</span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                    <p className="text-gray-600 dark:text-gray-300">Cəmi: <span className="font-semibold">{formatMoney(service.totalAmount)}</span></p>
                                    <p className="text-emerald-600 dark:text-emerald-400">Ödənilib: <span className="font-semibold">{formatMoney(service.totalPaid)}</span></p>
                                    <p className="text-rose-600 dark:text-rose-400">Qalıq: <span className="font-semibold">{formatMoney(service.totalRemaining)}</span></p>
                                  </div>
                                </div>
                              ))
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4 bg-white dark:bg-gray-800">
        <Button
          variant="text"
          onClick={handleModalClose}
          disabled={lockClose}
          className="mr-2 text-gray-700 dark:text-gray-200"
        >
          Bağla
        </Button>

        <AddBalanceCashModal
          open={balanceModalOpen}
          onClose={() => setBalanceModalOpen(false)}
          propertyId={selectedProperty?.id || null}
          propertyName={selectedProperty?.name || selectedProperty?.apartmentNumber || ""}
          onSuccess={() => {
            setBalanceRefreshKey((prev) => prev + 1);
          }}
        />
      </DialogFooter>
    </Dialog>
  );
};
