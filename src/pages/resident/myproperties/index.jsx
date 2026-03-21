import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import {
  BuildingOfficeIcon,
  DocumentTextIcon,
  HomeModernIcon,
  MapPinIcon,
  IdentificationIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ClockIcon,
  KeyIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import myPropertiesAPI from "./api";
import residentInvoicesAPI from "@/pages/resident/myinvoices/api";
import { setSelectedProperty } from "@/store/slices/management/propertySlice";
import { useComplexColor } from "@/hooks/useComplexColor";

const formatCurrency = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
};

export default function MyPropertiesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedPropertyId = useSelector((state) => state.property.selectedPropertyId);
  const selectedProperty = useSelector((state) => state.property.selectedProperty);
  const { color, getRgba, headerStyle } = useComplexColor();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchMyPropertyContext();
  }, [selectedPropertyId]);

  const normalizePropertyForStore = (property) => {
    if (!property) return null;
    return {
      ...property,
      sub_data: {
        ...(property.sub_data || {}),
        mtk: property?.sub_data?.mtk || property?.mtk || null,
        complex: property?.sub_data?.complex || property?.complex || null,
        building: property?.sub_data?.building || property?.building || null,
        block: property?.sub_data?.block || property?.block || null,
      },
    };
  };

  const fetchMyPropertyContext = async () => {
    try {
      setLoading(true);
      setError(null);

      const propertiesResponse = await myPropertiesAPI.getAll();
      const list = propertiesResponse?.data?.data || propertiesResponse?.data || [];
      const properties = Array.isArray(list) ? list : [];

      let activeProperty = selectedProperty;
      if (!activeProperty) {
        if (selectedPropertyId) {
          activeProperty =
            properties.find((item) => Number(item.id) === Number(selectedPropertyId)) || null;
        }
        if (!activeProperty && properties.length > 0) {
          activeProperty = properties[0];
        }
      }

      const normalized = normalizePropertyForStore(activeProperty);
      if (normalized) {
        dispatch(setSelectedProperty({ id: normalized.id, property: normalized }));
      }

      const invoicesResponse = selectedPropertyId
        ? await residentInvoicesAPI.getByProperty(selectedPropertyId)
        : await residentInvoicesAPI.getAll();

      const invoiceList =
        invoicesResponse?.data?.data?.data ??
        invoicesResponse?.data?.data ??
        invoicesResponse?.data ??
        [];

      setInvoices(Array.isArray(invoiceList) ? invoiceList : []);
    } catch (err) {
      setError(err?.message || t("properties.loadError") || "Məlumat yüklənərkən xəta baş verdi");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const propertyTitle = useMemo(() => {
    return (
      selectedProperty?.name ||
      selectedProperty?.meta?.apartment_number ||
      (selectedProperty?.id ? `Mənzil #${selectedProperty.id}` : "Mənzil seçilməyib")
    );
  }, [selectedProperty]);

  const unpaidInvoices = useMemo(() => {
    return invoices.filter((item) => ["unpaid", "not_paid", "overdue"].includes(item?.status));
  }, [invoices]);

  const unpaidCount = useMemo(() => unpaidInvoices.length, [unpaidInvoices]);

  const totalDebt = useMemo(() => {
    return unpaidInvoices.reduce((sum, item) => {
      const amount = Number(item?.amount || 0);
      const paid = Number(item?.amount_paid || 0);
      const remaining = amount - paid;
      return sum + Math.max(0, remaining);
    }, 0);
  }, [unpaidInvoices]);

  const balance = useMemo(() => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + parseFloat(inv?.amount || 0), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + parseFloat(inv?.amount_paid || 0), 0);
    return Math.max(0, totalPaid - totalInvoiced);
  }, [invoices]);

  const debt = useMemo(() => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + parseFloat(inv?.amount || 0), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + parseFloat(inv?.amount_paid || 0), 0);
    return Math.max(0, totalInvoiced - totalPaid);
  }, [invoices]);

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse" style={{ position: "relative", zIndex: 0 }}>
        <div className="h-[80px] rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl h-[70px] bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-3 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700"
            >
              <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="h-2.5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3.5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-3">
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700/60 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12" style={{ position: "relative", zIndex: 0 }}>
        <ExclamationCircleIcon className="h-12 w-12 mx-auto text-red-400 mb-3" />
        <Typography className="text-sm text-red-500 dark:text-red-400">{error}</Typography>
      </div>
    );
  }

  if (!selectedProperty) {
    return (
      <div className="space-y-6" style={{ position: "relative", zIndex: 0 }}>
        <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardBody className="text-center py-16">
            <BuildingOfficeIcon className="h-14 w-14 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <Typography className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Mənzil seçilməyib
            </Typography>
            <Typography variant="small" className="text-gray-500 dark:text-gray-400">
              Yuxarıdakı navbar-dan mənzil seçin.
            </Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  const complexName = selectedProperty?.sub_data?.complex?.name || selectedProperty?.complex?.name || "-";
  const buildingName = selectedProperty?.sub_data?.building?.name || selectedProperty?.building?.name || "-";
  const blockName = selectedProperty?.sub_data?.block?.name || selectedProperty?.block?.name || "-";
  const mtkName = selectedProperty?.sub_data?.mtk?.name || selectedProperty?.mtk?.name || "-";
  const apartmentNo = selectedProperty?.meta?.apartment_number || selectedProperty?.name || `#${selectedProperty?.id}`;
  const floor = selectedProperty?.meta?.floor || selectedProperty?.floor || "-";
  const area = selectedProperty?.meta?.area || selectedProperty?.area || null;
  const statusActive = selectedProperty?.status === "active";

  const statusColor = (s) => {
    if (["paid"].includes(s)) {
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
    }
    if (["unpaid", "not_paid"].includes(s)) {
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    }
    if (["overdue"].includes(s)) {
      return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
    }
    return "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
  };

  const statusLabel = (s) => {
    if (s === "paid") return "Ödənilib";
    if (s === "unpaid" || s === "not_paid") return "Ödənilməyib";
    if (s === "overdue") return "Vaxtı keçib";
    return s || "-";
  };

  return (
    <div className="space-y-5" style={{ position: "relative", zIndex: 0 }}>
      <div className="p-4 sm:p-6 rounded-xl shadow-lg border" style={headerStyle}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <Typography variant="h4" className="text-white font-bold">
                Mənzilim
              </Typography>
              <Typography variant="small" className="text-white/80">
                {propertyTitle}
              </Typography>
            </div>
          </div>
          <Button
            size="sm"
            variant="filled"
            className="normal-case bg-white/20 hover:bg-white/30 text-white hidden sm:inline-flex"
            onClick={() => navigate("/resident/invoices")}
          >
            Fakturalara keç
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            icon: <KeyIcon className="h-5 w-5" style={{ color }} />,
            label: "Status",
            value: statusActive ? "Aktiv" : "Qeyri-aktiv",
            sub: null,
            bg: statusActive ? getRgba(0.1) : "rgba(239,68,68,0.08)",
            valueClass: statusActive ? "text-green-600 dark:text-green-400" : "text-red-500",
          },
          {
            icon: <HomeModernIcon className="h-5 w-5" style={{ color }} />,
            label: "Mənzil №",
            value: apartmentNo,
            sub: floor !== "-" ? `${floor}-ci mərtəbə` : null,
            bg: getRgba(0.08),
            valueClass: "text-gray-800 dark:text-white",
          },
          {
            icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500" />,
            label: "Ödənilməmiş",
            value: `${unpaidCount} faktura`,
            sub: totalDebt > 0 ? `${formatCurrency(totalDebt)} ₼ borc` : "Borc yoxdur",
            bg: unpaidCount > 0 ? "rgba(239,68,68,0.07)" : "rgba(34,197,94,0.07)",
            valueClass: unpaidCount > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400",
          },
          {
            icon: <DocumentTextIcon className="h-5 w-5" style={{ color }} />,
            label: "Cəmi faktura",
            value: `${invoices.length}`,
            sub: "bu mənzilə aid",
            bg: getRgba(0.08),
            valueClass: "text-gray-800 dark:text-white",
          },
        ].map((item, i) => (
          <Card
            key={i}
            className="border dark:bg-gray-800"
            style={{ borderColor: getRgba(0.2), background: item.bg }}
          >
            <CardBody className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-lg bg-white/60 dark:bg-gray-700/60 shadow-sm">
                  {item.icon}
                </div>
                <Typography
                  variant="small"
                  className="text-gray-500 dark:text-gray-400 text-xs font-medium"
                >
                  {item.label}
                </Typography>
              </div>
              <Typography className={`font-bold text-base leading-tight ${item.valueClass}`}>
                {item.value}
              </Typography>
              {item.sub && (
                <Typography
                  variant="small"
                  className="text-gray-400 dark:text-gray-500 text-xs mt-0.5"
                >
                  {item.sub}
                </Typography>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      <Card className="border dark:bg-gray-800" style={{ borderColor: getRgba(0.25) }}>
        <CardBody className="p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mb-1">
                Cari Balans
              </Typography>
              <Typography
                variant="h4"
                className={`font-bold ${
                  balance > 0 ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {balance > 0 ? "+" : ""}
                {formatCurrency(balance)} ₼
              </Typography>
            </div>
            <div className="p-2 rounded-lg" style={{ backgroundColor: getRgba(0.12) }}>
              <CurrencyDollarIcon className="h-5 w-5" style={{ color }} />
            </div>
          </div>

          {balance > 0 && (
            <Typography variant="small" className="text-green-600 dark:text-green-400 text-xs mt-1">
              ✅ Artıqınız var: {formatCurrency(balance)} ₼
            </Typography>
          )}

          {balance === 0 && debt > 0 && (
            <Typography variant="small" className="text-red-500 dark:text-red-400 text-xs mt-1">
              ⚠️ Borcunuz var: {formatCurrency(debt)} ₼
            </Typography>
          )}

          {balance === 0 && debt === 0 && (
            <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              ➖ Balansınız sıfırdır
            </Typography>
          )}
        </CardBody>
      </Card>

      <Card className="border dark:bg-gray-800" style={{ borderColor: getRgba(0.25) }}>
        <CardBody className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg" style={{ background: getRgba(0.12) }}>
              <IdentificationIcon className="h-5 w-5" style={{ color }} />
            </div>
            <Typography className="font-semibold text-gray-900 dark:text-white">
              Mənzil məlumatları
            </Typography>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "MTK", value: mtkName, icon: <MapPinIcon className="h-4 w-4" /> },
              { label: "Kompleks", value: complexName, icon: <HomeModernIcon className="h-4 w-4" /> },
              { label: "Bina", value: buildingName, icon: <BuildingOfficeIcon className="h-4 w-4" /> },
              { label: "Blok", value: blockName, icon: <BuildingOfficeIcon className="h-4 w-4" /> },
              { label: "Mərtəbə", value: floor !== "-" ? `${floor}-ci mərtəbə` : "-", icon: <ClockIcon className="h-4 w-4" /> },
              ...(area ? [{ label: "Sahə", value: `${area} m²`, icon: <HomeModernIcon className="h-4 w-4" /> }] : []),
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40"
              >
                <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: getRgba(0.1), color }}>
                  {row.icon}
                </div>
                <div className="min-w-0">
                  <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">
                    {row.label}
                  </Typography>
                  <Typography className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                    {row.value}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="border dark:bg-gray-800" style={{ borderColor: getRgba(0.25) }}>
        <CardBody className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg" style={{ background: getRgba(0.12) }}>
                <DocumentTextIcon className="h-5 w-5" style={{ color }} />
              </div>
              <Typography className="font-semibold text-gray-900 dark:text-white">
                Son fakturalar
              </Typography>
            </div>
            <button
              onClick={() => navigate("/resident/invoices")}
              className="flex items-center gap-1 text-xs font-semibold hover:opacity-80 transition-opacity"
              style={{ color }}
            >
              Hamısı <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircleIcon className="h-10 w-10 mx-auto text-green-400 mb-2" />
              <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                Bu mənzil üçün faktura tapılmadı.
              </Typography>
            </div>
          ) : (
            <div className="space-y-2">
              {invoices.slice(0, 6).map((invoice) => {
                const unpaid = ["unpaid", "not_paid", "overdue"].includes(invoice?.status);

                return (
                  <div
                    key={invoice.id}
                    className="rounded-xl border p-3 flex items-center justify-between gap-3 dark:border-gray-700 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`p-2 rounded-lg flex-shrink-0 ${
                          unpaid ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/20"
                        }`}
                      >
                        {unpaid ? (
                          <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <Typography
                          variant="small"
                          className="font-semibold text-gray-800 dark:text-white truncate"
                        >
                          {invoice?.service?.name || "Xidmət"}
                        </Typography>
                        <Typography
                          variant="small"
                          className="text-gray-400 dark:text-gray-500 text-xs"
                        >
                          #{invoice?.id}
                          {invoice?.due_date ? ` • ${invoice.due_date}` : ""}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <Typography variant="small" className="font-bold text-gray-900 dark:text-white">
                        {formatCurrency(invoice?.amount)} ₼
                      </Typography>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor(
                          invoice?.status
                        )}`}
                      >
                        {statusLabel(invoice?.status)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}