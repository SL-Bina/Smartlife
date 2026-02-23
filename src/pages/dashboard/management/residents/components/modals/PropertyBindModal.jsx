import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Button, Typography, Card, CardBody, Chip
} from "@material-tailwind/react";
import { 
  XMarkIcon, HomeIcon, LinkIcon, BuildingOfficeIcon,
  MapPinIcon, UserIcon, Square3Stack3DIcon,
  TrashIcon, PlusIcon, CheckCircleIcon, 
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { CustomSelect } from "@/components/ui/CustomSelect";
import DynamicToast from "@/components/DynamicToast";
import propertyLookupsAPI from "../../../properties/api/lookups";
import propertiesAPI from "../../../properties/api";
import residentAPI from "../../../residents/api";

const ACTIVE_COLOR = "#3b82f6";

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

  const [mtks, setMtks] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [propertyPage, setPropertyPage] = useState(1);
  const [hasMoreProperties, setHasMoreProperties] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [toast, setToast] = useState({ open: false });

  const showToast = (type, message, title = "") =>
    setToast({ open: true, type, message, title });

  const canBind = mtkId && complexId && propertyId;

  // load MTK
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    propertyLookupsAPI.getMtks()
      .then(data => {
        setMtks(data || []);
      })
      .catch(error => {
        console.error("MTK-lər yüklənərkən xəta:", error);
        showToast("error", "MTK-lər yüklənərkən xəta baş verdi");
      })
      .finally(() => setLoading(false));
  }, [open]);

  // load complexes
  useEffect(() => {
    if (!mtkId) {
      setComplexes([]);
      setProperties([]);
      return;
    }
    setLoading(true);
    propertyLookupsAPI.getComplexes({ mtk_id: mtkId })
      .then(data => {
        setComplexes(data || []);
        setProperties([]);
        setComplexId(null);
        setPropertyId(null);
      })
      .catch(error => {
        console.error("Komplekslər yüklənərkən xəta:", error);
        showToast("error", "Komplekslər yüklənərkən xəta baş verdi");
      })
      .finally(() => setLoading(false));
  }, [mtkId]);

  // load properties
  useEffect(() => {
    if (!complexId) {
      setProperties([]);
      setPropertyPage(1);
      setHasMoreProperties(true);
      return;
    }
    setLoading(true);
    setPropertyPage(1);
    setHasMoreProperties(true);
    
    // Use search endpoint for filtering like ManagementActions
    propertiesAPI.search({ 
      complex_id: complexId, 
      page: 1, 
      per_page: 20 
    })
      .then(res => {
        const data = res?.data?.data?.data || [];
        setProperties(data);
        setPropertyId(null);
        setHasMoreProperties(data.length === 20);
      })
      .catch(error => {
        console.error("Mənzillər yüklənərkən xəta:", error);
        showToast("error", "Mənzillər yüklənərkən xəta baş verdi");
      })
      .finally(() => setLoading(false));
  }, [complexId]);

  // load more properties (infinite scroll)
  const loadMoreProperties = async () => {
    if (!complexId || loadingMore || !hasMoreProperties) return;
    
    setLoadingMore(true);
    const nextPage = propertyPage + 1;
    
    try {
      const res = await propertiesAPI.search({ 
        complex_id: complexId, 
        page: nextPage, 
        per_page: 20 
      });
      const newProperties = res?.data?.data?.data || [];
      
      setProperties(prev => [...prev, ...newProperties]);
      setPropertyPage(nextPage);
      setHasMoreProperties(newProperties.length === 20);
    } catch (error) {
      console.error("Daha çox mənzil yüklənərkən xəta:", error);
      showToast("error", "Daha çox mənzil yüklənərkən xəta baş verdi");
    } finally {
      setLoadingMore(false);
    }
  };

  // handle scroll for infinite scroll
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      loadMoreProperties();
    }
  };

  // close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (complexId) {
        const dropdown = document.getElementById(`property-dropdown-${complexId}`);
        if (dropdown && !dropdown.contains(event.target) && !event.target.closest('button')) {
          dropdown.classList.add('hidden');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [complexId]);

  const bind = async () => {
    try {
      setSaving(true);
      await residentAPI.bindProperty(residentId, {
        mtk_id: mtkId,
        complex_id: complexId,
        property_id: propertyId
      });
      showToast("success", "Bağlandı", "Uğurlu");
      onSuccess?.();
    } catch (e) {
      showToast("error", "Xəta baş verdi", "Xəta");
    } finally {
      setSaving(false);
    }
  };

  const unbind = async (prop) => {
    try {
      setSaving(true);
      await residentAPI.unbindProperty(residentId, {
        mtk_id: prop.mtk_id,
        complex_id: prop.complex_id,
        property_id: prop.id
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
              <div className="space-y-2">
                <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  MTK
                </Typography>
                <div className="relative">
                  <CustomSelect
                    placeholder="MTK seçin"
                    value={mtkId ? String(mtkId) : ""}
                    onChange={v => {
                      setMtkId(Number(v));
                      setComplexId(null);
                      setPropertyId(null);
                    }}
                    options={mtks.map(x => ({ value: String(x.id), label: x.name }))}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                  {loading && !mtkId && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <ArrowPathIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Kompleks
                </Typography>
                <div className="relative">
                  <CustomSelect
                    placeholder="Kompleks seçin"
                    value={complexId ? String(complexId) : ""}
                    onChange={v => {
                      setComplexId(Number(v));
                      setPropertyId(null);
                    }}
                    disabled={!mtkId}
                    options={complexes.map(x => ({ value: String(x.id), label: x.name }))}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 disabled:opacity-50"
                  />
                  {loading && mtkId && !complexId && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <ArrowPathIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Typography variant="small" className="font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Mənzil
                </Typography>
                <div className="relative">
                  {/* Custom dropdown with infinite scroll */}
                  <div className="relative">
                    <button
                      type="button"
                      disabled={!complexId}
                      onClick={() => {
                        const dropdown = document.getElementById(`property-dropdown-${complexId}`);
                        if (dropdown) {
                          dropdown.classList.toggle('hidden');
                        }
                      }}
                      className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 disabled:opacity-50 px-4 py-2 text-left flex items-center justify-between"
                    >
                      <span className="text-gray-900 dark:text-white">
                        {propertyId ? properties.find(p => p.id === propertyId)?.name || `Mənzil #${propertyId}` : "Mənzil seçin"}
                      </span>
                      <div className="flex items-center gap-2">
                        {loading && complexId && !propertyId && (
                          <ArrowPathIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
                        )}
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    {/* Dropdown with infinite scroll */}
                    {complexId && (
                      <div 
                        id={`property-dropdown-${complexId}`}
                        className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto hidden"
                        onScroll={handleScroll}
                      >
                        {properties.length === 0 && !loading ? (
                          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            Mənzil tapılmadı
                          </div>
                        ) : (
                          <>
                            {properties.map(property => (
                              <div
                                key={property.id}
                                onClick={() => {
                                  setPropertyId(property.id);
                                  document.getElementById(`property-dropdown-${complexId}`).classList.add('hidden');
                                }}
                                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-900 dark:text-white"
                              >
                                {property.name || `Mənzil #${property.id}`}
                              </div>
                            ))}
                            {loadingMore && (
                              <div className="p-4 text-center">
                                <ArrowPathIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
                              </div>
                            )}
                            {!hasMoreProperties && properties.length > 0 && (
                              <div className="p-2 text-center text-gray-500 dark:text-gray-400 text-sm">
                                Bütün mənzillər yükləndi
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
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
                                {p.name || `Mənzil #${p.id}`}
                              </Typography>
                              <Typography variant="small" className="text-green-100">
                                ID: #{p.id}
                              </Typography>
                            </div>
                          </div>
                          <div className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border-0">
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
                              <BuildingOfficeIcon className="h-4 w-4" />
                              <Typography variant="small" className="font-semibold uppercase tracking-wider">
                                Kompleks
                              </Typography>
                            </div>
                            <Typography variant="h6" className="text-gray-800 dark:text-white font-bold">
                              {p.complex?.name || "-"}
                            </Typography>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <Square3Stack3DIcon className="h-4 w-4" />
                              <Typography variant="small" className="font-semibold uppercase tracking-wider">
                                Sahə
                              </Typography>
                            </div>
                            <Typography variant="h6" className="text-gray-800 dark:text-white font-bold">
                              {p.area ? `${p.area} m²` : "-"}
                            </Typography>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <MapPinIcon className="h-4 w-4" />
                              <Typography variant="small" className="font-semibold uppercase tracking-wider">
                                Mərtəbə
                              </Typography>
                            </div>
                            <Typography variant="h6" className="text-gray-800 dark:text-white font-bold">
                              {p.floor ? `${p.floor}-ci mərtəbə` : "-"}
                            </Typography>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                              <UserIcon className="h-4 w-4" />
                              <Typography variant="small" className="font-semibold uppercase tracking-wider">
                                Mənzil Nömrəsi
                              </Typography>
                            </div>
                            <Typography variant="h6" className="text-gray-800 dark:text-white font-bold">
                              {p.apartment_number || "-"}
                            </Typography>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Chip 
                              value={p.status || "Aktiv"} 
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