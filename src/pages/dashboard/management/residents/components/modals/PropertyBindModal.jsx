import React, { useState, useMemo } from "react";
import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Button, Typography, Card, CardBody, Chip
} from "@material-tailwind/react";
import { 
  XMarkIcon, HomeIcon, LinkIcon, BuildingOfficeIcon,
  Square3Stack3DIcon, TrashIcon, PlusIcon, CheckCircleIcon
} from "@heroicons/react/24/outline";
import { AsyncSearchSelect } from "@/components/ui/AsyncSearchSelect";
import DynamicToast from "@/components/DynamicToast";
import residentAPI from "../../../residents/api";

export function PropertyBindModal({
  open,
  onClose,
  residentId,
  residentProperties = [],
  onSuccess
}) {

  const [mtkId, setMtkId] = useState(null);
  const [complexId, setComplexId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);

  const [selectedLabels, setSelectedLabels] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ open: false });

  const showToast = (type, message, title = "") =>
    setToast({ open: true, type, message, title });

  const canBind = mtkId && complexId && propertyId;

  // Search params for cascading selects (same pattern as ManagementActions)
  const complexSearchParams = useMemo(() => {
    const params = {};
    if (mtkId) params.mtk_ids = [mtkId];
    return params;
  }, [mtkId]);

  const propertySearchParams = useMemo(() => {
    const params = {};
    if (mtkId) params.mtk_ids = [mtkId];
    if (complexId) params.complex_ids = [complexId];
    return params;
  }, [mtkId, complexId]);

  // Unique keys to force re-render when parent changes
  const complexSelectKey = `complex-${mtkId || 'null'}`;
  const propertySelectKey = `property-${mtkId || 'null'}-${complexId || 'null'}`;

  const handleMtkChange = (val, option) => {
    setMtkId(val || null);
    setComplexId(null);
    setPropertyId(null);
    setSelectedLabels(prev => {
      const next = { ...prev };
      if (val && option) {
        next.mtk = option.name || `#${val}`;
      } else {
        delete next.mtk;
      }
      delete next.complex;
      delete next.property;
      return next;
    });
  };

  const handleComplexChange = (val, option) => {
    setComplexId(val || null);
    setPropertyId(null);
    setSelectedLabels(prev => {
      const next = { ...prev };
      if (val && option) {
        next.complex = option.name || `#${val}`;
      } else {
        delete next.complex;
      }
      delete next.property;
      return next;
    });
  };

  const handlePropertyChange = (val, option) => {
    setPropertyId(val || null);
    setSelectedLabels(prev => {
      const next = { ...prev };
      if (val && option) {
        next.property = option.name || option.apartment_number || `#${val}`;
      } else {
        delete next.property;
      }
      return next;
    });
  };

  const bind = async () => {
    if (!canBind || !residentId) return;
    try {
      setSaving(true);
      await residentAPI.bindProperty(residentId, {
        mtk_id: mtkId,
        complex_id: complexId,
        property_id: propertyId
      });
      showToast("success", "Bağlandı", "Uğurlu");
      onSuccess?.();
      // Reset selections after successful bind
      setMtkId(null);
      setComplexId(null);
      setPropertyId(null);
      setSelectedLabels({});
    } catch (e) {
      showToast("error", "Xəta baş verdi", "Xəta");
    } finally {
      setSaving(false);
    }
  };

  const unbind = async (prop) => {
    if (!residentId || !prop) return;
    try {
      setSaving(true);
      await residentAPI.unbindProperty(residentId, {
        mtk_id: prop.mtk_id,
        complex_id: prop.complex_id,
        property_id: prop.property_id
      });
      showToast("success", "Silindi", "Uğurlu");
      onSuccess?.();
    } catch (e) {
      showToast("error", "Xəta baş verdi", "Xəta");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <>
      <Dialog open={open} handler={onClose} size="xl" className="backdrop-blur-sm">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <LinkIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <Typography variant="h5" className="text-white font-bold">
                  Mənzil Bağlama
                </Typography>
                <Typography variant="small" className="text-blue-100">
                  Sakin üçün mənzil əlavə edin və ya idarə edin
                </Typography>
              </div>
            </div>
            <Button 
              variant="text" 
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2"
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <DialogBody className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
          
          {/* ADD NEW PROPERTY SECTION */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-600 rounded-lg">
                <PlusIcon className="h-5 w-5 text-white" />
              </div>
              <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">
                Yeni Mənzil Bağla
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* MTK Select */}
              <div>
                <AsyncSearchSelect
                  label="MTK"
                  value={mtkId}
                  onChange={handleMtkChange}
                  endpoint="/search/module/mtk"
                  selectedLabel={selectedLabels.mtk}
                  placeholder="MTK seçin"
                  searchPlaceholder="MTK axtar..."
                />
              </div>

              {/* Complex Select */}
              <div>
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
              </div>

              {/* Property Select */}
              <div>
                <AsyncSearchSelect
                  key={propertySelectKey}
                  label="Mənzil"
                  value={propertyId}
                  onChange={handlePropertyChange}
                  endpoint="/search/module/property"
                  searchParams={propertySearchParams}
                  selectedLabel={selectedLabels.property}
                  disabled={!complexId}
                  placeholder="Mənzil seçin"
                  searchPlaceholder="Mənzil axtar..."
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                disabled={!canBind || saving}
                onClick={bind}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                {saving ? "Bağlanır..." : "Mənzili Bağla"}
              </Button>
            </div>
          </div>

          {/* CURRENT PROPERTIES SECTION */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-600 rounded-lg">
                <HomeIcon className="h-5 w-5 text-white" />
              </div>
              <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">
                Bağlı Mənzillər ({residentProperties.length})
              </Typography>
            </div>

            {residentProperties.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <Typography variant="h6" className="text-gray-500 dark:text-gray-400 mb-2">
                  Hələ bağlı mənzil yoxdur
                </Typography>
                <Typography variant="small" className="text-gray-400 dark:text-gray-500">
                  Yuxarıdan yeni mənzil əlavə edin
                </Typography>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {residentProperties.map(p => (
                  <Card key={p.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardBody className="p-0">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                              <HomeIcon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <Typography variant="h6" className="font-bold text-white">
                                {p.property?.name || `Mənzil #${p.property_id}`}
                              </Typography>
                              <Typography variant="small" className="text-green-100">
                                ID: #{p.property_id}
                              </Typography>
                            </div>
                          </div>
                          <div className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border-0 flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Aktiv
                          </div>
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Square3Stack3DIcon className="h-4 w-4" />
                              <Typography variant="small" className="font-semibold uppercase tracking-wider">
                                MTK
                              </Typography>
                            </div>
                            <Typography variant="h6" className="text-gray-800 dark:text-white font-bold">
                              {p.mtk?.name || "-"}
                            </Typography>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <BuildingOfficeIcon className="h-4 w-4" />
                              <Typography variant="small" className="font-semibold uppercase tracking-wider">
                                Kompleks
                              </Typography>
                            </div>
                            <Typography variant="h6" className="text-gray-800 dark:text-white font-bold">
                              {p.complex?.name || "-"}
                            </Typography>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Chip 
                              value="Aktiv"
                              className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-0"
                            />
                          </div>
                          <Button
                            size="sm"
                            variant="gradient"
                            color="red"
                            onClick={() => unbind(p)}
                            disabled={saving}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Bağlantını sil
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter className="bg-gray-50 dark:bg-gray-800 rounded-b-xl border-t border-gray-200 dark:border-gray-700 p-6">
          <Button 
            variant="outlined" 
            onClick={onClose}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-8 py-3 rounded-lg font-semibold"
          >
            Bağla
          </Button>
        </DialogFooter>
      </Dialog>

      <DynamicToast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        title={toast.title}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
}

export default PropertyBindModal;
