import React, { useState, useMemo, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Chip } from "@material-tailwind/react";
import {
  XMarkIcon,
  HomeIcon,
  LinkIcon,
  BuildingOfficeIcon,
  Square3Stack3DIcon,
  TrashIcon,
  PlusIcon,
  CheckCircleIcon,
  BanknotesIcon,
  UserCircleIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import { AsyncSearchSelect } from "@/components/ui/AsyncSearchSelect";
import { BindConfirmModal } from "./BindConfirmModal";
import { UnbindConfirmModal } from "./UnbindConfirmModal";
import residentAPI from "@/services/management/residentsApi";
import { useAppColor } from "@/hooks/useAppColor";

export function PropertyBindModal({
  open,
  onClose,
  lockClose = false,
  residentId,
  residentName = "",
  residentProperties = [],
  onSuccess,
  onAddBalance,
}) {
  const { colorCode, getRgba } = useAppColor();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [mtkId, setMtkId] = useState(null);
  const [complexId, setComplexId] = useState(null);
  const [buildingId, setBuildingId] = useState(null);
  const [blockId, setBlockId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);

  const [selectedLabels, setSelectedLabels] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false });

  const [unbindTarget, setUnbindTarget] = useState(null);
  const [bindConfirm, setBindConfirm] = useState(false);

  const showToast = (type, message, title = "") => setToast({ open: true, type, message, title });
  const canBind = mtkId && complexId && propertyId;

  useEffect(() => {
    if (!open) {
      setIsPickerOpen(false);
      setMtkId(null);
      setComplexId(null);
      setBuildingId(null);
      setBlockId(null);
      setPropertyId(null);
      setSelectedLabels({});
    }
  }, [open]);

  const complexSearchParams = useMemo(() => {
    const params = {};
    if (mtkId) params.mtk_ids = [mtkId];
    return params;
  }, [mtkId]);

  const buildingSearchParams = useMemo(() => {
    const params = {};
    if (mtkId) params.mtk_ids = [mtkId];
    if (complexId) params.complex_ids = [complexId];
    return params;
  }, [mtkId, complexId]);

  const blockSearchParams = useMemo(() => {
    const params = {};
    if (mtkId) params.mtk_ids = [mtkId];
    if (complexId) params.complex_ids = [complexId];
    if (buildingId) params.building_ids = [buildingId];
    return params;
  }, [mtkId, complexId, buildingId]);

  const propertySearchParams = useMemo(() => {
    const params = {};
    if (mtkId) params.mtk_ids = [mtkId];
    if (complexId) params.complex_ids = [complexId];
    if (buildingId) params.building_ids = [buildingId];
    if (blockId) params.block_ids = [blockId];
    return params;
  }, [mtkId, complexId, buildingId, blockId]);

  const complexSelectKey = `complex-${mtkId || "null"}`;
  const buildingSelectKey = `building-${mtkId || "null"}-${complexId || "null"}`;
  const blockSelectKey = `block-${mtkId || "null"}-${complexId || "null"}-${buildingId || "null"}`;
  const propertySelectKey = `property-${mtkId || "null"}-${complexId || "null"}-${buildingId || "null"}-${blockId || "null"}`;

  const handleMtkChange = (val, option) => {
    setMtkId(val || null);
    setComplexId(null);
    setBuildingId(null);
    setBlockId(null);
    setPropertyId(null);
    setSelectedLabels((prev) => {
      const next = { ...prev };
      if (val && option) next.mtk = option.name || `#${val}`;
      else delete next.mtk;
      delete next.complex;
      delete next.building;
      delete next.block;
      delete next.property;
      return next;
    });
  };

  const handleComplexChange = (val, option) => {
    setComplexId(val || null);
    setBuildingId(null);
    setBlockId(null);
    setPropertyId(null);
    setSelectedLabels((prev) => {
      const next = { ...prev };
      if (val && option) next.complex = option.name || `#${val}`;
      else delete next.complex;
      delete next.building;
      delete next.block;
      delete next.property;
      return next;
    });
  };

  const handleBuildingChange = (val, option) => {
    setBuildingId(val || null);
    setBlockId(null);
    setPropertyId(null);
    setSelectedLabels((prev) => {
      const next = { ...prev };
      if (val && option) next.building = option.name || `#${val}`;
      else delete next.building;
      delete next.block;
      delete next.property;
      return next;
    });
  };

  const handleBlockChange = (val, option) => {
    setBlockId(val || null);
    setPropertyId(null);
    setSelectedLabels((prev) => {
      const next = { ...prev };
      if (val && option) next.block = option.name || `#${val}`;
      else delete next.block;
      delete next.property;
      return next;
    });
  };

  const handlePropertyChange = (val, option) => {
    setPropertyId(val || null);
    setSelectedLabels((prev) => {
      const next = { ...prev };
      if (val && option) next.property = option.name || option.apartment_number || `#${val}`;
      else delete next.property;
      return next;
    });
  };

  const bind = async () => {
    if (!canBind || !residentId) return;
    try {
      setSaving(true);
      const payload = {
        mtk_id: mtkId,
        complex_id: complexId,
        property_id: propertyId,
      };
      await residentAPI.bindProperty(residentId, payload);
      showToast("success", "Bağlandı", "Uğurlu");
      onSuccess?.();
      setMtkId(null);
      setComplexId(null);
      setBuildingId(null);
      setBlockId(null);
      setPropertyId(null);
      setSelectedLabels({});
      setIsPickerOpen(false);
    } catch (e) {
      const msg = e?.message || e?.data?.message || "Xəta baş verdi";
      showToast("error", msg, "Xəta");
    } finally {
      setSaving(false);
      setBindConfirm(false);
    }
  };

  const confirmUnbind = async () => {
    if (!residentId || !unbindTarget) return;
    try {
      setSaving(true);
      await residentAPI.unbindProperty(residentId, {
        mtk_id: unbindTarget.mtk_id,
        complex_id: unbindTarget.complex_id,
        property_id: unbindTarget.property_id,
      });
      showToast("success", "Silindi", "Uğurlu");
      onSuccess?.();
    } catch (e) {
      const msg = e?.message || e?.data?.message || "Xəta baş verdi";
      showToast("error", msg, "Xəta");
    } finally {
      setSaving(false);
      setUnbindTarget(null);
    }
  };

  if (!open) return null;

  return (
    <>
      <Dialog
        open={open}
        handler={() => {
          if (!lockClose && !unbindTarget && !bindConfirm) onClose();
        }}
        size="xl"
        dismiss={{ enabled: !lockClose && !unbindTarget && !bindConfirm }}
        className="w-full max-h-[92vh] overflow-hidden rounded-lg sm:rounded-xl border-[0.5px] border-gray-200/55 dark:border-gray-700/55 bg-white dark:bg-gray-800 shadow-2xl"
      >
        <DialogHeader
          className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 text-white border-b border-white/15 rounded-t-lg sm:rounded-t-xl"
          style={{ background: `linear-gradient(135deg, ${getRgba(0.95)}, ${getRgba(0.75)})` }}
        >
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><LinkIcon className="h-6 w-6 text-white" /></div>
              <div>
                <Typography variant="h5" className="text-white font-bold">Sakinin Mənzilləri</Typography>
                <Typography variant="small" className="text-white/90">Mənzilləri idarə edin, yeni mənzil əlavə edin və balans əməliyyatlarını edin</Typography>
              </div>
            </div>
            <button
              type="button"
                onClick={() => {
                  if (!lockClose) onClose();
                }}
                disabled={lockClose}
              className="h-9 w-9 rounded-xl grid place-items-center bg-white/15 hover:bg-white/25 transition-colors flex-shrink-0"
              aria-label="Bağla"
            >
              <XMarkIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        </DialogHeader>

        <DialogBody className="p-0 bg-slate-50 dark:bg-gray-900 overflow-hidden">
          <div className="max-h-[68vh] overflow-y-auto p-4 sm:p-6 space-y-4">
            <div
              className="rounded-2xl border border-gray-200/75 dark:border-gray-700/70 p-4 sm:p-5"
              style={{ background: `linear-gradient(180deg, ${getRgba(0.12)}, transparent)` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-xl grid place-items-center text-white" style={{ background: colorCode || "#2563eb" }}>
                    <UserCircleIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Sakin</Typography>
                    <Typography variant="h6" className="text-gray-800 dark:text-white font-bold">
                      {residentName || `Sakin #${residentId || "-"}`}
                    </Typography>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Chip
                    value={`Mənzil sayı: ${residentProperties.length}`}
                    className="rounded-full px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  />
                  <Chip
                    value={residentProperties.length > 0 ? "Aktiv bağlar var" : "Bağ yoxdur"}
                    className="rounded-full px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200/75 dark:border-gray-700/70 bg-white dark:bg-gray-800 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg grid place-items-center bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    <HomeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">Bağlı Mənzillər</Typography>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400">Buradan sakinə bağlı mənzilləri idarə et</Typography>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => setIsPickerOpen((prev) => !prev)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4"
                  style={{ background: colorCode || "#2563eb" }}
                >
                  <PlusIcon className="h-4 w-4" />
                  {isPickerOpen ? "Seçimi gizlət" : "Əlavə et"}
                </Button>
              </div>

              {isPickerOpen && (
                <div className="mt-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4 space-y-4">
                  <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-200">Mənzil seçimi</Typography>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <AsyncSearchSelect
                      label="MTK"
                      value={mtkId}
                      onChange={handleMtkChange}
                      endpoint="/search/module/mtk"
                      selectedLabel={selectedLabels.mtk}
                      placeholder="MTK seçin"
                      searchPlaceholder="MTK axtar..."
                    />
                    <AsyncSearchSelect
                      key={complexSelectKey}
                      label="Kompleks"
                      value={complexId}
                      onChange={handleComplexChange}
                      endpoint="/search/module/complex"
                      searchParams={complexSearchParams}
                      selectedLabel={selectedLabels.complex}
                      disabled={!mtkId}
                      placeholder="Kompleks seçin"
                      searchPlaceholder="Kompleks axtar..."
                    />
                    <AsyncSearchSelect
                      key={buildingSelectKey}
                      label="Bina"
                      value={buildingId}
                      onChange={handleBuildingChange}
                      endpoint="/search/module/building"
                      searchParams={buildingSearchParams}
                      selectedLabel={selectedLabels.building}
                      disabled={!complexId}
                      placeholder="Bina seçin"
                      searchPlaceholder="Bina axtar..."
                    />
                    <AsyncSearchSelect
                      key={blockSelectKey}
                      label="Blok"
                      value={blockId}
                      onChange={handleBlockChange}
                      endpoint="/search/module/block"
                      searchParams={blockSearchParams}
                      selectedLabel={selectedLabels.block}
                      disabled={!buildingId}
                      placeholder="Blok seçin"
                      searchPlaceholder="Blok axtar..."
                    />
                  </div>

                  <AsyncSearchSelect
                    key={propertySelectKey}
                    label="Mənzil *"
                    value={propertyId}
                    onChange={handlePropertyChange}
                    endpoint="/search/module/property"
                    searchParams={propertySearchParams}
                    selectedLabel={selectedLabels.property}
                    disabled={!complexId}
                    placeholder="Mənzil seçin"
                    searchPlaceholder="Mənzil axtar..."
                  />

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                    <Button
                      variant="outlined"
                      color="blue-gray"
                      onClick={() => setIsPickerOpen(false)}
                      disabled={saving}
                    >
                      Ləğv et
                    </Button>
                    <Button
                      onClick={() => setBindConfirm(true)}
                      disabled={!canBind || saving}
                      className="inline-flex items-center justify-center gap-2"
                      style={{ background: colorCode || "#2563eb" }}
                    >
                      <LinkIcon className="h-4 w-4" />
                      {saving ? "Bağlanır..." : "Mənzili bağla"}
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-3">
                {residentProperties.length === 0 ? (
                  <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/40 py-10 text-center">
                    <HomeIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <Typography variant="h6" className="text-gray-600 dark:text-gray-300">Bu sakin üçün hələ mənzil bağlı deyil</Typography>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 mt-1">Əlavə et düyməsi ilə mənzil seçə bilərsən</Typography>
                  </div>
                ) : (
                  residentProperties.map((p) => {
                    const propertyTitle = p.property?.name || p.property?.apartment_number || `Mənzil #${p.property_id}`;
                    return (
                      <div
                        key={p.id}
                        className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                          <div className="space-y-2 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-lg grid place-items-center text-white" style={{ background: colorCode || "#2563eb" }}>
                                <HomeIcon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0">
                                <Typography variant="paragraph" className="font-bold text-gray-800 dark:text-white truncate">{propertyTitle}</Typography>
                                <Typography variant="small" className="text-gray-500 dark:text-gray-400">ID: #{p.property_id}</Typography>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                              <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <Square3Stack3DIcon className="h-4 w-4" />
                                <span>{p.mtk?.name || "MTK yoxdur"}</span>
                              </div>
                              <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                <BuildingOfficeIcon className="h-4 w-4" />
                                <span>{p.complex?.name || "Kompleks yoxdur"}</span>
                              </div>
                              {(p.building?.name || p.block?.name) && (
                                <div className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 sm:col-span-2">
                                  <RectangleGroupIcon className="h-4 w-4" />
                                  <span>
                                    {[p.building?.name, p.block?.name].filter(Boolean).join(" / ")}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2 lg:items-end">
                            <Chip
                              value="Aktiv"
                              className="rounded-full px-3 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              icon={<CheckCircleIcon className="h-4 w-4" />}
                            />
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outlined"
                                color="green"
                                onClick={() => onAddBalance?.(p.property_id, propertyTitle)}
                                disabled={saving}
                                className="inline-flex items-center gap-1.5"
                              >
                                <BanknotesIcon className="h-4 w-4" />
                                Balans artır
                              </Button>
                              <Button
                                size="sm"
                                variant="gradient"
                                color="red"
                                onClick={() => setUnbindTarget(p)}
                                disabled={saving}
                                className="inline-flex items-center gap-1.5"
                              >
                                <TrashIcon className="h-4 w-4" />
                                Bağlantını sil
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 px-4 py-4 sm:px-6 sm:py-5 border-t border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-800 rounded-b-lg sm:rounded-b-xl">
          <Button variant="outlined" onClick={onClose} disabled={lockClose} className="w-full sm:w-auto rounded-xl px-6">Bağla</Button>
        </DialogFooter>
      </Dialog>

      <BindConfirmModal open={bindConfirm} onClose={() => setBindConfirm(false)} onConfirm={bind} labels={{ ...selectedLabels, resident: residentName }} loading={saving} />

      <UnbindConfirmModal
        open={!!unbindTarget}
        onClose={() => setUnbindTarget(null)}
        onConfirm={confirmUnbind}
        labels={{
          resident: residentName,
          mtk: unbindTarget?.mtk?.name || (unbindTarget?.mtk_id ? `#${unbindTarget.mtk_id}` : undefined),
          complex: unbindTarget?.complex?.name || (unbindTarget?.complex_id ? `#${unbindTarget.complex_id}` : undefined),
          building: unbindTarget?.building?.name || (unbindTarget?.building_id ? `#${unbindTarget.building_id}` : undefined),
          block: unbindTarget?.block?.name || (unbindTarget?.block_id ? `#${unbindTarget.block_id}` : undefined),
          property: unbindTarget?.property?.name || unbindTarget?.property?.apartment_number || (unbindTarget?.property_id ? `#${unbindTarget.property_id}` : undefined),
        }}
        loading={saving}
      />
    </>
  );
}

export default PropertyBindModal;
