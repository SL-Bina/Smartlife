import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import {
  ArrowPathIcon,
  ChevronRightIcon,
  CpuChipIcon,
  HomeIcon,
  LinkIcon,
  NoSymbolIcon,
} from "@heroicons/react/24/outline";

import { useDynamicToast } from "@/hooks/useDynamicToast";
import { useAppSelector } from "@/store/hooks";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import complexesAPI from "@/services/management/complexesApi";
import buildingsAPI from "@/services/management/buildingsApi";
import blocksAPI from "@/services/management/blocksApi";
import propertiesAPI from "@/services/management/propertiesApi";
import { devicesAPI } from "../api";

const BASIP_ROOT_DOMAIN_ID = 4805;
const BASIP_DOMAIN_TYPE_LABELS = {
  1: "Bina",
  2: "Blok",
  3: "Mərtəbə",
  4: "Mənzil",
  5: "Kompleks",
};

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

const normalizeDomainNode = (response) => {
  const fromBody = response?.data?.body?.data;
  if (Array.isArray(fromBody) && fromBody.length > 0) {
    return fromBody[0];
  }

  const fromData = response?.data?.data;
  if (Array.isArray(fromData) && fromData.length > 0) {
    return fromData[0];
  }

  return null;
};

const getErrorMessage = (error, fallback) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (typeof error?.message === "string") return error.message;

  const firstError = error?.errors ? Object.values(error.errors)?.[0] : null;
  if (Array.isArray(firstError) && firstError[0]) return firstError[0];
  if (typeof firstError === "string") return firstError;

  return fallback;
};

const resolveEntityId = (item) => item?.id ?? item?.property_id ?? item?.block_id ?? item?.building_id ?? null;

const normalizeName = (item, fallbackPrefix) => {
  return (
    item?.name ||
    item?.title ||
    item?.label ||
    item?.apartment_number ||
    item?.number ||
    `${fallbackPrefix} #${resolveEntityId(item) ?? "-"}`
  );
};

const formatDateTime = (value) => {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString("az-AZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
};

const getBasipDomainTypeLabel = (typeId) => {
  if (!typeId) return "Naməlum";
  return BASIP_DOMAIN_TYPE_LABELS[typeId] || `Type ${typeId}`;
};

const DeviceConnectionPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getRgba: getMtkRgba, getActiveGradient } = useMtkColor();
  const { showToast } = useDynamicToast();

  const selectedMtkFromStore = useAppSelector((state) => state?.mtk?.selectedMtk);
  const selectedMtkIdFromStore = useAppSelector((state) => state?.mtk?.selectedMtkId);
  const selectedComplexIdFromStore = useAppSelector((state) => state?.complex?.selectedComplexId);
  const selectedBuildingIdFromStore = useAppSelector((state) => state?.building?.selectedBuildingId);
  const selectedBlockIdFromStore = useAppSelector((state) => state?.block?.selectedBlockId);
  const selectedPropertyIdFromStore = useAppSelector((state) => state?.property?.selectedPropertyId);

  const [complexOptions, setComplexOptions] = useState([]);
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [propertyOptions, setPropertyOptions] = useState([]);

  const mtkId = selectedMtkIdFromStore ? String(selectedMtkIdFromStore) : "";
  const [complexId, setComplexId] = useState(selectedComplexIdFromStore ? String(selectedComplexIdFromStore) : "");
  const [buildingId, setBuildingId] = useState(selectedBuildingIdFromStore ? String(selectedBuildingIdFromStore) : "");
  const [blockId, setBlockId] = useState(selectedBlockIdFromStore ? String(selectedBlockIdFromStore) : "");
  const [propertyId, setPropertyId] = useState(selectedPropertyIdFromStore ? String(selectedPropertyIdFromStore) : "");

  const [loadingComplexes, setLoadingComplexes] = useState(false);
  const [loadingBuildings, setLoadingBuildings] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingProperties, setLoadingProperties] = useState(false);

  const [basipPath, setBasipPath] = useState([]);
  const [loadingBasipRoot, setLoadingBasipRoot] = useState(false);
  const [loadingBasipNodeId, setLoadingBasipNodeId] = useState(null);
  const [basipError, setBasipError] = useState("");

  const [bindings, setBindings] = useState([]);
  const [bindingsLoading, setBindingsLoading] = useState(false);
  const [bindingsPage, setBindingsPage] = useState(1);
  const [bindingsLastPage, setBindingsLastPage] = useState(1);
  const [bindingsTotal, setBindingsTotal] = useState(0);

  const [binding, setBinding] = useState(false);
  const [unbindingId, setUnbindingId] = useState(null);
  const [mobileStep, setMobileStep] = useState(1);

  const selectedMtk = selectedMtkFromStore || null;

  const selectedComplex = useMemo(
    () => complexOptions.find((item) => String(resolveEntityId(item)) === String(complexId)) || null,
    [complexOptions, complexId]
  );

  const selectedBuilding = useMemo(
    () => buildingOptions.find((item) => String(resolveEntityId(item)) === String(buildingId)) || null,
    [buildingOptions, buildingId]
  );

  const selectedBlock = useMemo(
    () => blockOptions.find((item) => String(resolveEntityId(item)) === String(blockId)) || null,
    [blockOptions, blockId]
  );

  const selectedProperty = useMemo(
    () => propertyOptions.find((item) => String(resolveEntityId(item)) === String(propertyId)) || null,
    [propertyOptions, propertyId]
  );

  const currentBasipNode = basipPath.length > 0 ? basipPath[basipPath.length - 1] : null;
  const basipChildren = currentBasipNode?.children || [];
  const basipBlockedReason = !mtkId
    ? "Əvvəlcə sistemdə MTK seçilməlidir."
    : !complexId
      ? "BAS-IP ağacını görmək üçün əvvəlcə kompleks seçin."
      : "";

  const missingRequirements = useMemo(() => {
    const missing = [];
    if (!mtkId) missing.push("MTK");
    if (!complexId) missing.push("Kompleks");
    if (!buildingId) missing.push("Bina");
    if (!blockId) missing.push("Blok");
    if (!propertyId) missing.push("Mənzil");
    if (!currentBasipNode?.id) missing.push("BAS-IP node");
    return missing;
  }, [mtkId, complexId, buildingId, blockId, propertyId, currentBasipNode?.id]);

  const canBind =
    !binding &&
    Boolean(mtkId) &&
    Boolean(complexId) &&
    Boolean(buildingId) &&
    Boolean(blockId) &&
    Boolean(propertyId) &&
    Boolean(currentBasipNode?.id);

  const localSelectionReady = Boolean(mtkId && complexId && buildingId && blockId && propertyId);
  const basipSelectionReady = Boolean(currentBasipNode?.id);

  const steps = useMemo(
    () => [
      { id: 1, label: "Lokal obyekt seç", done: Boolean(mtkId && complexId && buildingId && blockId && propertyId) },
      { id: 2, label: "BAS-IP node seç", done: Boolean(currentBasipNode?.id) },
      { id: 3, label: "Əlaqələndirməni təsdiqlə", done: canBind },
    ],
    [mtkId, complexId, buildingId, blockId, propertyId, currentBasipNode?.id, canBind]
  );

  const loadBasipRoot = useCallback(async () => {
    if (!complexId) {
      setBasipPath([]);
      setBasipError("");
      return;
    }

    setLoadingBasipRoot(true);
    setBasipError("");

    try {
      const response = await devicesAPI.getBasipDomainDetail(BASIP_ROOT_DOMAIN_ID, {
        complex_id: Number(complexId),
        ...(mtkId ? { mtk_id: Number(mtkId) } : {}),
      });
      const rootNode = normalizeDomainNode(response);

      if (!rootNode?.id) {
        throw new Error("BAS-IP domain cavabı boş gəldi");
      }

      setBasipPath([rootNode]);
    } catch (error) {
      const msg = getErrorMessage(error, "BAS-IP kök domain yüklənmədi");
      setBasipError(msg);
      setBasipPath([]);
    } finally {
      setLoadingBasipRoot(false);
    }
  }, [complexId, mtkId]);

  const loadBindings = useCallback(async (page = 1) => {
    if (!complexId) {
      setBindings([]);
      setBindingsPage(1);
      setBindingsLastPage(1);
      setBindingsTotal(0);
      return;
    }

    setBindingsLoading(true);

    try {
      const response = await devicesAPI.getBasipBindActions({
        page,
        complex_id: Number(complexId),
        ...(mtkId ? { mtk_id: Number(mtkId) } : {}),
      });
      const payload = response?.data?.data || {};
      const rows = Array.isArray(payload?.data) ? payload.data : [];

      setBindings(rows);
      setBindingsPage(Number(payload?.current_page) || 1);
      setBindingsLastPage(Number(payload?.last_page) || 1);
      setBindingsTotal(Number(payload?.total) || rows.length);
    } catch (error) {
      setBindings([]);
      setBindingsPage(1);
      setBindingsLastPage(1);
      setBindingsTotal(0);
      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: getErrorMessage(error, "Əlaqələndirmə siyahısı yüklənmədi"),
      });
    } finally {
      setBindingsLoading(false);
    }
  }, [complexId, mtkId, showToast, t]);

  useEffect(() => {
    let cancelled = false;

    const fetchComplexes = async () => {
      if (!mtkId) {
        setComplexOptions([]);
        setComplexId("");
        return;
      }

      setLoadingComplexes(true);

      try {
        const response = await complexesAPI.search({
          mtk_ids: [Number(mtkId)],
          page: 1,
          per_page: 1000,
        });
        const list = normalizeList(response);

        if (cancelled) return;
        setComplexOptions(list);

        setComplexId((prev) => {
          if (prev && list.some((item) => String(resolveEntityId(item)) === String(prev))) {
            return prev;
          }

          if (
            selectedComplexIdFromStore &&
            list.some((item) => String(resolveEntityId(item)) === String(selectedComplexIdFromStore))
          ) {
            return String(selectedComplexIdFromStore);
          }

          return "";
        });
      } catch (error) {
        if (!cancelled) {
          setComplexOptions([]);
          showToast({
            type: "error",
            title: t("common.error") || "Xəta",
            message: getErrorMessage(error, "Kompleks siyahısı yüklənmədi"),
          });
        }
      } finally {
        if (!cancelled) setLoadingComplexes(false);
      }
    };

    fetchComplexes();

    return () => {
      cancelled = true;
    };
  }, [mtkId, selectedComplexIdFromStore, showToast, t]);

  useEffect(() => {
    let cancelled = false;

    const fetchBuildings = async () => {
      if (!mtkId || !complexId) {
        setBuildingOptions([]);
        setBuildingId("");
        return;
      }

      setLoadingBuildings(true);

      try {
        const response = await buildingsAPI.search({
          mtk_ids: [Number(mtkId)],
          complex_ids: [Number(complexId)],
          page: 1,
          per_page: 1000,
        });
        const list = normalizeList(response);

        if (cancelled) return;
        setBuildingOptions(list);

        setBuildingId((prev) => {
          if (prev && list.some((item) => String(resolveEntityId(item)) === String(prev))) {
            return prev;
          }

          if (
            selectedBuildingIdFromStore &&
            list.some((item) => String(resolveEntityId(item)) === String(selectedBuildingIdFromStore))
          ) {
            return String(selectedBuildingIdFromStore);
          }

          return "";
        });
      } catch (error) {
        if (!cancelled) {
          setBuildingOptions([]);
          showToast({
            type: "error",
            title: t("common.error") || "Xəta",
            message: getErrorMessage(error, "Bina siyahısı yüklənmədi"),
          });
        }
      } finally {
        if (!cancelled) setLoadingBuildings(false);
      }
    };

    fetchBuildings();

    return () => {
      cancelled = true;
    };
  }, [mtkId, complexId, selectedBuildingIdFromStore, showToast, t]);

  useEffect(() => {
    let cancelled = false;

    const fetchBlocks = async () => {
      if (!mtkId || !complexId || !buildingId) {
        setBlockOptions([]);
        setBlockId("");
        return;
      }

      setLoadingBlocks(true);

      try {
        const response = await blocksAPI.search({
          mtk_ids: [Number(mtkId)],
          complex_ids: [Number(complexId)],
          building_ids: [Number(buildingId)],
          page: 1,
          per_page: 1000,
        });
        const list = normalizeList(response);

        if (cancelled) return;
        setBlockOptions(list);

        setBlockId((prev) => {
          if (prev && list.some((item) => String(resolveEntityId(item)) === String(prev))) {
            return prev;
          }

          if (
            selectedBlockIdFromStore &&
            list.some((item) => String(resolveEntityId(item)) === String(selectedBlockIdFromStore))
          ) {
            return String(selectedBlockIdFromStore);
          }

          return "";
        });
      } catch (error) {
        if (!cancelled) {
          setBlockOptions([]);
          showToast({
            type: "error",
            title: t("common.error") || "Xəta",
            message: getErrorMessage(error, "Blok siyahısı yüklənmədi"),
          });
        }
      } finally {
        if (!cancelled) setLoadingBlocks(false);
      }
    };

    fetchBlocks();

    return () => {
      cancelled = true;
    };
  }, [mtkId, complexId, buildingId, selectedBlockIdFromStore, showToast, t]);

  useEffect(() => {
    let cancelled = false;

    const fetchProperties = async () => {
      if (!mtkId || !complexId || !buildingId || !blockId) {
        setPropertyOptions([]);
        setPropertyId("");
        return;
      }

      setLoadingProperties(true);

      try {
        const response = await propertiesAPI.search({
          mtk_ids: [Number(mtkId)],
          complex_ids: [Number(complexId)],
          building_ids: [Number(buildingId)],
          block_ids: [Number(blockId)],
          page: 1,
          per_page: 1000,
        });
        const list = normalizeList(response);

        if (cancelled) return;
        setPropertyOptions(list);

        setPropertyId((prev) => {
          if (prev && list.some((item) => String(resolveEntityId(item)) === String(prev))) {
            return prev;
          }

          if (
            selectedPropertyIdFromStore &&
            list.some((item) => String(resolveEntityId(item)) === String(selectedPropertyIdFromStore))
          ) {
            return String(selectedPropertyIdFromStore);
          }

          return "";
        });
      } catch (error) {
        if (!cancelled) {
          setPropertyOptions([]);
          showToast({
            type: "error",
            title: t("common.error") || "Xəta",
            message: getErrorMessage(error, "Mənzil siyahısı yüklənmədi"),
          });
        }
      } finally {
        if (!cancelled) setLoadingProperties(false);
      }
    };

    fetchProperties();

    return () => {
      cancelled = true;
    };
  }, [mtkId, complexId, buildingId, blockId, selectedPropertyIdFromStore, showToast, t]);

  useEffect(() => {
    loadBasipRoot();
  }, [complexId, loadBasipRoot]);

  useEffect(() => {
    loadBindings(1);
  }, [complexId, loadBindings]);

  useEffect(() => {
    setMobileStep((prev) => {
      if (prev > 1 && !localSelectionReady) return 1;
      if (prev > 2 && !basipSelectionReady) return 2;
      return prev;
    });
  }, [localSelectionReady, basipSelectionReady]);

  const handleBack = () => {
    navigate("/dashboard/devices");
  };

  const handleComplexChange = (value) => {
    setComplexId(value);
    setBuildingId("");
    setBlockId("");
    setPropertyId("");
  };

  const handleBuildingChange = (value) => {
    setBuildingId(value);
    setBlockId("");
    setPropertyId("");
  };

  const handleBlockChange = (value) => {
    setBlockId(value);
    setPropertyId("");
  };

  const handleOpenBasipChild = async (child) => {
    if (!child?.id || !complexId) return;

    setLoadingBasipNodeId(child.id);

    try {
      const response = await devicesAPI.getBasipDomainDetail(child.id, {
        complex_id: Number(complexId),
        ...(mtkId ? { mtk_id: Number(mtkId) } : {}),
      });
      const detailNode = normalizeDomainNode(response);

      if (!detailNode?.id) {
        throw new Error("Domain detail tapılmadı");
      }

      setBasipPath((prev) => [...prev, detailNode]);
      setBasipError("");
    } catch (error) {
      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: getErrorMessage(error, "BAS-IP alt domain yüklənmədi"),
      });
    } finally {
      setLoadingBasipNodeId(null);
    }
  };

  const handleBasipBreadcrumbClick = (index) => {
    setBasipPath((prev) => prev.slice(0, index + 1));
  };

  const handleBind = async () => {
    if (!canBind) return;

    const payload = {
      mtk_id: Number(mtkId),
      complex_id: Number(complexId),
      building_id: Number(buildingId),
      block_id: Number(blockId),
      property_id: Number(propertyId),
      basip_property_id: Number(currentBasipNode.id),
    };

    try {
      setBinding(true);
      await devicesAPI.bindBasipAction(payload);

      showToast({
        type: "success",
        title: t("common.success") || "Uğurlu",
        message: t("devices.connection.bindSuccess", "Əlaqələndirmə uğurla yaradıldı"),
      });

      await loadBindings(bindingsPage || 1);
    } catch (error) {
      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: getErrorMessage(error, "Əlaqələndirmə yaradılmadı"),
      });
    } finally {
      setBinding(false);
    }
  };

  const handleUnbind = async (item) => {
    if (!item?.id) return;

    const payload = {
      id: item.id,
      mtk_id: Number(item?.mtk?.id),
      complex_id: Number(item?.complex?.id),
      building_id: Number(item?.building?.id),
      block_id: Number(item?.block?.id),
      property_id: Number(item?.property?.id),
      basip_property_id: Number(item?.basip_property_id),
    };

    try {
      setUnbindingId(item.id);
      await devicesAPI.unbindBasipAction(payload);

      showToast({
        type: "success",
        title: t("common.success") || "Uğurlu",
        message: t("devices.connection.unbindSuccess", "Əlaqə uğurla silindi"),
      });

      await loadBindings(bindingsPage || 1);
    } catch (error) {
      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: getErrorMessage(error, "Əlaqə silinmədi"),
      });
    } finally {
      setUnbindingId(null);
    }
  };

  const gradientStyle = { background: getActiveGradient(0.9, 0.7) };
  const borderColor = getMtkRgba(0.3);

  return (
    <div className="space-y-6">
      <div
        className="relative w-full overflow-hidden rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 mt-2 sm:mt-3 md:mt-4"
        style={{ ...gradientStyle, border: `1px solid ${borderColor}`, position: "relative", zIndex: 0 }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative flex items-center gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 dark:border-gray-600/30"
              style={{ backgroundColor: getMtkRgba(0.2) }}
            >
              <LinkIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <Typography variant="h4" className="text-white font-bold mb-1 text-lg sm:text-xl md:text-2xl">
              {t("devices.connection.pageTitle", "BAS-IP Əlaqələndirmə")}
            </Typography>
            <Typography className="text-white/90 dark:text-gray-300 text-xs sm:text-sm font-medium">
              {t("devices.connection.pageSubtitle", "SmartLife və BAS-IP property uyğunlaşdırması")}
            </Typography>
          </div>

          <button
            onClick={handleBack}
            className="flex-shrink-0 p-2 rounded-lg backdrop-blur-sm border border-white/30 dark:border-gray-600/30 hover:bg-white/10 transition-colors"
            style={{ backgroundColor: getMtkRgba(0.2) }}
          >
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
        <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12" />
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-3">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Addım-addım axın</div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs md:text-sm ${
                step.done
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200"
                  : "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300"
              }`}
            >
              <span className="font-bold mr-2">{step.id}.</span>
              {step.label}
            </div>
          ))}
        </div>
        {missingRequirements.length > 0 ? (
          <div className="text-xs rounded-lg border border-amber-200 bg-amber-50 text-amber-800 px-3 py-2 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
            Çatışmayan seçimlər: {missingRequirements.join(", ")}
          </div>
        ) : (
          <div className="text-xs rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 px-3 py-2 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
            Bütün seçimlər tamamlandı, əlaqələndirmə yaratmağa hazırsınız.
          </div>
        )}
      </div>

      <div className="xl:hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setMobileStep(1)}
            className={`rounded-lg px-2 py-2 text-xs font-semibold border ${
              mobileStep === 1
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700"
            }`}
          >
            1. Lokal
          </button>
          <button
            type="button"
            onClick={() => setMobileStep(2)}
            disabled={!localSelectionReady}
            className={`rounded-lg px-2 py-2 text-xs font-semibold border ${
              mobileStep === 2
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700"
            } disabled:opacity-50`}
          >
            2. BAS-IP
          </button>
          <button
            type="button"
            onClick={() => setMobileStep(3)}
            disabled={!localSelectionReady || !basipSelectionReady}
            className={`rounded-lg px-2 py-2 text-xs font-semibold border ${
              mobileStep === 3
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700"
            } disabled:opacity-50`}
          >
            3. Təsdiq
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setMobileStep((prev) => Math.max(1, prev - 1))}
            disabled={mobileStep === 1}
            className="rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            Geri
          </button>

          <button
            type="button"
            onClick={() => setMobileStep((prev) => Math.min(3, prev + 1))}
            disabled={(mobileStep === 1 && !localSelectionReady) || (mobileStep === 2 && !basipSelectionReady) || mobileStep === 3}
            className="rounded-lg border border-blue-300 dark:border-blue-700 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 disabled:opacity-50"
          >
            Növbəti
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${mobileStep === 1 ? "block" : "hidden"} xl:block`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <HomeIcon className="h-5 w-5 text-blue-500" />
              {t("devices.connection.smartlifeSide", "SmartLife tərəfi")}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t("devices.connection.selectLocalHierarchy", "MTK, kompleks, bina, blok və mənzil seçin")}
            </p>
          </div>

          <div className="p-4 space-y-3">
            <div className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-3 py-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">MTK (sistemdən)</div>
              <div className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">
                {selectedMtk ? normalizeName(selectedMtk, "MTK") : "Seçilməyib"}
              </div>
              {mtkId ? (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">ID: {mtkId}</div>
              ) : (
                <div className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  Davam etmək üçün əvvəlcə sistemdə MTK seçin.
                </div>
              )}
            </div>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Kompleks
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                value={complexId}
                onChange={(e) => handleComplexChange(e.target.value)}
                disabled={!mtkId || loadingComplexes}
              >
                <option value="">Seçin</option>
                {complexOptions.map((item) => (
                  <option key={resolveEntityId(item)} value={String(resolveEntityId(item))}>
                    {normalizeName(item, "Kompleks")}
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">BAS-IP sorğuları bu kompleks kontekstində göndərilir.</div>
            </label>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Bina
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                value={buildingId}
                onChange={(e) => handleBuildingChange(e.target.value)}
                disabled={!complexId || loadingBuildings}
              >
                <option value="">Seçin</option>
                {buildingOptions.map((item) => (
                  <option key={resolveEntityId(item)} value={String(resolveEntityId(item))}>
                    {normalizeName(item, "Bina")}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Blok
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                value={blockId}
                onChange={(e) => handleBlockChange(e.target.value)}
                disabled={!buildingId || loadingBlocks}
              >
                <option value="">Seçin</option>
                {blockOptions.map((item) => (
                  <option key={resolveEntityId(item)} value={String(resolveEntityId(item))}>
                    {normalizeName(item, "Blok")}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Mənzil
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                disabled={!blockId || loadingProperties}
              >
                <option value="">Seçin</option>
                {propertyOptions.map((item) => (
                  <option key={resolveEntityId(item)} value={String(resolveEntityId(item))}>
                    {normalizeName(item, "Mənzil")}
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Seçilən dəyər bind sorğusunda `property_id` kimi istifadə olunur.</div>
            </label>

            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 text-xs text-blue-900 dark:text-blue-100 space-y-1">
              <div>MTK: {selectedMtk ? normalizeName(selectedMtk, "MTK") : "-"}</div>
              <div>Kompleks: {selectedComplex ? normalizeName(selectedComplex, "Kompleks") : "-"}</div>
              <div>Bina: {selectedBuilding ? normalizeName(selectedBuilding, "Bina") : "-"}</div>
              <div>Blok: {selectedBlock ? normalizeName(selectedBlock, "Blok") : "-"}</div>
              <div>Mənzil: {selectedProperty ? normalizeName(selectedProperty, "Mənzil") : "-"}</div>
            </div>
          </div>
        </div>

        <div className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${mobileStep === 2 ? "block" : "hidden"} xl:block`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CpuChipIcon className="h-5 w-5 text-green-500" />
                BAS-IP tərəfi
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Domain detail axını: {BASIP_ROOT_DOMAIN_ID} kökündən budaqlanır
              </p>
            </div>

            <button
              type="button"
              onClick={loadBasipRoot}
              disabled={loadingBasipRoot}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Yenilə
            </button>
          </div>

          <div className="p-4 space-y-3">
            {basipBlockedReason ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
                {basipBlockedReason}
              </div>
            ) : null}

            {basipError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{basipError}</div>
            ) : null}

            {loadingBasipRoot ? (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-5 text-sm text-gray-500 dark:text-gray-400 text-center">
                BAS-IP domain yüklənir...
              </div>
            ) : null}

            {!loadingBasipRoot && currentBasipNode ? (
              <>
                <div className="flex flex-wrap items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 px-2 py-2">
                  {basipPath.map((node, index) => (
                    <React.Fragment key={node.id}>
                      <button
                        type="button"
                        onClick={() => handleBasipBreadcrumbClick(index)}
                        className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        {node.name} ({node.id})
                      </button>
                      {index !== basipPath.length - 1 ? <ChevronRightIcon className="h-3 w-3 text-gray-400" /> : null}
                    </React.Fragment>
                  ))}
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 px-3 py-2 text-xs text-green-900 dark:text-green-100 space-y-1">
                  <div>Aktiv node: {currentBasipNode.name}</div>
                  <div>Domain ID: {currentBasipNode.id}</div>
                  <div>Alt node sayı: {Array.isArray(currentBasipNode.children) ? currentBasipNode.children.length : 0}</div>
                  <div>User sayı: {Array.isArray(currentBasipNode.users) ? currentBasipNode.users.length : 0}</div>
                </div>

                {basipChildren.length > 0 ? (
                  <div className="space-y-2 max-h-[280px] overflow-auto pr-1">
                    {basipChildren.map((child) => {
                      const isLoadingNode = loadingBasipNodeId === child.id;

                      return (
                        <div
                          key={child.id}
                          className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center justify-between gap-2"
                        >
                          <div>
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{child.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {child.id} | {getBasipDomainTypeLabel(child.domain_type_id)}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenBasipChild(child)}
                            disabled={isLoadingNode}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-700 px-2.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
                          >
                            <ChevronRightIcon className="h-4 w-4" />
                            {isLoadingNode ? "Yüklənir..." : "Daxil ol"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
                    Bu node altında child yoxdur. Əlaqələndirmə üçün bunu basip_property_id kimi istifadə edə bilərsiniz.
                  </div>
                )}
              </>
            ) : (
              !basipBlockedReason && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-5 text-sm text-gray-500 dark:text-gray-400 text-center">
                  BAS-IP node məlumatı hələ yüklənməyib.
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className={`${mobileStep === 3 ? "block" : "hidden"} xl:block`}>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          <div>
            SmartLife: {selectedProperty ? normalizeName(selectedProperty, "Mənzil") : "-"} | BAS-IP: {currentBasipNode?.name || "-"}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Basip Property ID: {currentBasipNode?.id || "-"}
          </div>
        </div>

        <button
          type="button"
          onClick={handleBind}
          disabled={!canBind}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: getActiveGradient() }}
        >
          <LinkIcon className="h-4 w-4" />
          {binding ? "Əlaqələndirilir..." : "3-cü addım: Əlaqələndir"}
        </button>
        </div>
      </div>

      <div className={`${mobileStep === 3 ? "block" : "hidden"} xl:block`}>
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
          <h2 className="font-semibold text-gray-900 dark:text-white">Mövcud əlaqələr</h2>
          <button
            type="button"
            onClick={() => loadBindings(bindingsPage)}
            disabled={bindingsLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
          >
            <ArrowPathIcon className="h-4 w-4" />
            Yenilə
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-3 py-2 text-left">MTK</th>
                <th className="px-3 py-2 text-left">Kompleks</th>
                <th className="px-3 py-2 text-left">Bina</th>
                <th className="px-3 py-2 text-left">Blok</th>
                <th className="px-3 py-2 text-left">Mənzil</th>
                <th className="px-3 py-2 text-left">Basip ID</th>
                <th className="px-3 py-2 text-left">Yaranma</th>
                <th className="px-3 py-2 text-right">Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {bindingsLoading ? (
                <tr>
                  <td className="px-3 py-8 text-center text-gray-500 dark:text-gray-400" colSpan={8}>
                    Yüklənir...
                  </td>
                </tr>
              ) : bindings.length === 0 ? (
                <tr>
                  <td className="px-3 py-8 text-center text-gray-500 dark:text-gray-400" colSpan={8}>
                    Əlaqə tapılmadı.
                  </td>
                </tr>
              ) : (
                bindings.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-3 py-2">{item?.mtk?.name || "-"}</td>
                    <td className="px-3 py-2">{item?.complex?.name || "-"}</td>
                    <td className="px-3 py-2">{item?.building?.name || "-"}</td>
                    <td className="px-3 py-2">{item?.block?.name || "-"}</td>
                    <td className="px-3 py-2">{item?.property?.name || "-"}</td>
                    <td className="px-3 py-2">{item?.basip_property_id ?? "-"}</td>
                    <td className="px-3 py-2">{formatDateTime(item?.created_at)}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleUnbind(item)}
                        disabled={unbindingId === item.id}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 dark:border-red-800 px-2.5 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-60"
                      >
                        <NoSymbolIcon className="h-4 w-4" />
                        {unbindingId === item.id ? "Silinir..." : "Unbind"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
          <div>Cəmi: {bindingsTotal}</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadBindings(Math.max(1, bindingsPage - 1))}
              disabled={bindingsPage <= 1 || bindingsLoading}
              className="rounded border border-gray-300 dark:border-gray-700 px-2 py-1 disabled:opacity-50"
            >
              Əvvəlki
            </button>
            <span>
              Səhifə {bindingsPage} / {bindingsLastPage}
            </span>
            <button
              type="button"
              onClick={() => loadBindings(Math.min(bindingsLastPage, bindingsPage + 1))}
              disabled={bindingsPage >= bindingsLastPage || bindingsLoading}
              className="rounded border border-gray-300 dark:border-gray-700 px-2 py-1 disabled:opacity-50"
            >
              Növbəti
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DeviceConnectionPage;
