import React, { useState, useMemo } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Card, CardBody, Chip } from "@material-tailwind/react";
import { XMarkIcon, HomeIcon, LinkIcon, BuildingOfficeIcon, Square3Stack3DIcon, TrashIcon, PlusIcon, CheckCircleIcon, BanknotesIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { AsyncSearchSelect } from "@/components/ui/AsyncSearchSelect";
import { BindConfirmModal } from "./BindConfirmModal";
import { UnbindConfirmModal } from "./UnbindConfirmModal";
import residentAPI from "@/services/management/residentsApi";
import { useAppColor } from "@/hooks/useAppColor";

export function PropertyBindModal({
  open,
  onClose,
  residentId,
  residentName = "",
  residentProperties = [],
  onSuccess,
  onAddBalance,
}) {
  const { colorCode, getRgba } = useAppColor();
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
          if (!unbindTarget && !bindConfirm) onClose();
        }}
        size="xl"
        dismiss={{ enabled: !unbindTarget && !bindConfirm }}
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
                <Typography variant="h5" className="text-white font-bold">Mənzil Bağlama</Typography>
                <Typography variant="small" className="text-white/90">Sakin üçün mənzil əlavə edin və ya idarə edin</Typography>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-xl grid place-items-center bg-white/15 hover:bg-white/25 transition-colors flex-shrink-0"
              aria-label="Bağla"
            >
              <XMarkIcon className="h-5 w-5 text-white" />
            </button>
          </div>
        </DialogHeader>

        <DialogBody className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto max-h-[64vh]">
          <div className="rounded-xl border-[0.5px] border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-600"><UserCircleIcon className="h-5 w-5 text-white" /></div>
              <div>
                <Typography variant="small" className="font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Sakin</Typography>
                <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">{residentName || `Sakin #${residentId || "-"}`}</Typography>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-[0.5px] border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg" style={{ background: colorCode || "#2563eb" }}><PlusIcon className="h-5 w-5 text-white" /></div>
              <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">Yeni Mənzil Bağla</Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <AsyncSearchSelect label="MTK" value={mtkId} onChange={handleMtkChange} endpoint="/search/module/mtk" selectedLabel={selectedLabels.mtk} placeholder="MTK seçin" searchPlaceholder="MTK axtar..." />
              <AsyncSearchSelect key={complexSelectKey} label="Kompleks" value={complexId} onChange={handleComplexChange} endpoint="/search/module/complex" searchParams={complexSearchParams} selectedLabel={selectedLabels.complex} disabled={!mtkId} placeholder="Kompleks seçin" searchPlaceholder="Kompleks axtar..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <AsyncSearchSelect key={buildingSelectKey} label="Bina " value={buildingId} onChange={handleBuildingChange} endpoint="/search/module/building" searchParams={buildingSearchParams} selectedLabel={selectedLabels.building} disabled={!complexId} placeholder="Bina seçin" searchPlaceholder="Bina axtar..." />
              <AsyncSearchSelect key={blockSelectKey} label="Blok " value={blockId} onChange={handleBlockChange} endpoint="/search/module/block" searchParams={blockSearchParams} selectedLabel={selectedLabels.block} disabled={!buildingId} placeholder="Blok seçin" searchPlaceholder="Blok axtar..." />
            </div>

            <div className="mb-6">
              <AsyncSearchSelect key={propertySelectKey} label="Mənzil *" value={propertyId} onChange={handlePropertyChange} endpoint="/search/module/property" searchParams={propertySearchParams} selectedLabel={selectedLabels.property} disabled={!complexId} placeholder="Mənzil seçin" searchPlaceholder="Mənzil axtar..." />
            </div>

            <div className="flex justify-end">
              <Button
                disabled={!canBind || saving}
                onClick={() => setBindConfirm(true)}
                className="text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                style={{ background: colorCode || "#2563eb" }}
              >
                <PlusIcon className="h-4 w-4" />
                {saving ? "Bağlanır..." : "Mənzili Bağla"}
              </Button>
            </div>
          </div>

          <div className="rounded-xl border-[0.5px] border-gray-200/70 dark:border-gray-700/70 bg-white dark:bg-gray-800 p-4 sm:p-5 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-600 rounded-lg"><HomeIcon className="h-5 w-5 text-white" /></div>
              <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">Bağlı Mənzillər ({residentProperties.length})</Typography>
            </div>

            {residentProperties.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <Typography variant="h6" className="text-gray-500 dark:text-gray-400 mb-2">Hələ bağlı mənzil yoxdur</Typography>
                <Typography variant="small" className="text-gray-400 dark:text-gray-500">Yuxarıdan yeni mənzil əlavə edin</Typography>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {residentProperties.map((p) => (
                  <Card key={p.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardBody className="p-0">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm"><HomeIcon className="h-6 w-6 text-white" /></div>
                            <div>
                              <Typography variant="h6" className="font-bold text-white">{p.property?.name || `Mənzil #${p.property_id}`}</Typography>
                              <Typography variant="small" className="text-green-100">ID: #{p.property_id}</Typography>
                            </div>
                          </div>
                          <div className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border-0 flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />Aktiv
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Square3Stack3DIcon className="h-4 w-4" />
                              <Typography variant="small" className="font-semibold uppercase tracking-wider">MTK</Typography>
                            </div>
                            <Typography variant="h6" className="text-gray-800 dark:text-white font-bold">{p.mtk?.name || "-"}</Typography>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <BuildingOfficeIcon className="h-4 w-4" />
                              <Typography variant="small" className="font-semibold uppercase tracking-wider">Kompleks</Typography>
                            </div>
                            <Typography variant="h6" className="text-gray-800 dark:text-white font-bold">{p.complex?.name || "-"}</Typography>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-4" />

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Chip value="Aktiv" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outlined"
                              color="green"
                              onClick={() => onAddBalance?.(p.property_id, p.property?.name || p.property?.apartment_number || `Mənzil #${p.property_id}`)}
                              disabled={saving}
                              className="flex items-center gap-1.5"
                            >
                              <BanknotesIcon className="h-4 w-4" />Balans əlavə et
                            </Button>
                            <Button
                              size="sm"
                              variant="gradient"
                              color="red"
                              onClick={() => setUnbindTarget(p)}
                              disabled={saving}
                              className="flex items-center gap-2"
                            >
                              <TrashIcon className="h-4 w-4" />Bağlantını sil
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 px-4 py-4 sm:px-6 sm:py-5 border-t border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-800 rounded-b-lg sm:rounded-b-xl">
          <Button variant="outlined" onClick={onClose} className="w-full sm:w-auto rounded-xl px-6">Bağla</Button>
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
      />     </>
  );
}

export default PropertyBindModal;
