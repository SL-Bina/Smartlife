import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Spinner } from "@material-tailwind/react";
import {
  CogIcon,
  EyeIcon,
  Squares2X2Icon,
  TableCellsIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import myServicesAPI from "./api";
import { ServiceDetailModal } from "./components";
import { useComplexColor } from "@/hooks/useComplexColor";


export default function MyServicesPage() {
  const { t } = useTranslation();
  const selectedPropertyId = useSelector((state) => state.property.selectedPropertyId);
  const { color, getRgba, headerStyle } = useComplexColor();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [selectedPropertyId]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = selectedPropertyId ? { property_id: selectedPropertyId } : {};
      const response = await myServicesAPI.getAll(params);
      const servicesData = response?.data?.data?.data || response?.data?.data ;
      setServices(servicesData);
      console.log("Services loaded:", servicesData);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (service) => {
    setSelectedService(service);
    setDetailModalOpen(true);
  };

  const handleRequest = async (service) => {
    try {
      await myServicesAPI.requestService({ service_id: service.id });
      fetchServices();
    } catch (err) {
      console.error("Error requesting service:", err);
    }
  };

  const handleCancel = async (service) => {
    try {
      await myServicesAPI.cancelService(service.id);
      fetchServices();
    } catch (err) {
      console.error("Error cancelling service:", err);
    }
  };

  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setSelectedService(null);
  };

  const [viewMode, setViewMode] = useState("card");

  const STATUS_CFG = {
    active:    { label: "Aktiv",      cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",    icon: <CheckCircleIcon className="h-3.5 w-3.5" /> },
    pending:   { label: "Gözləmədə",  cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: <ClockIcon className="h-3.5 w-3.5" /> },
    cancelled: { label: "Ləğv edilib", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",           icon: <XCircleIcon className="h-3.5 w-3.5" /> },
  };
  const statusCfg = (s) => STATUS_CFG[s] || { label: s || "-", cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300", icon: null };

  const formatDate = (d) => {
    if (!d) return "-";
    try { return new Date(d).toLocaleDateString("az-AZ", { year: "numeric", month: "short", day: "numeric" }); }
    catch { return d; }
  };

  const activeCount    = services.filter((s) => s.status === "active").length;
  const pendingCount   = services.filter((s) => s.status === "pending").length;
  const cancelledCount = services.filter((s) => s.status === "cancelled").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20" style={{ position: "relative", zIndex: 0 }}>
        <Spinner className="h-8 w-8" style={{ color }} />
      </div>
    );
  }

  return (
    <div className="space-y-5" style={{ position: "relative", zIndex: 0 }}>

      {/* ── Header ── */}
      <div className="p-4 sm:p-6 rounded-xl shadow-lg border" style={headerStyle}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <CogIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-white font-bold">Xidmətlərim</Typography>
            <Typography variant="small" className="text-white/80">{services.length} xidmət</Typography>
          </div>
        </div>
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Cəmi",       value: services.length, cls: "text-gray-900 dark:text-white",        bg: getRgba(0.07) },
          { label: "Aktiv",      value: activeCount,     cls: "text-green-600 dark:text-green-400",   bg: "rgba(34,197,94,0.07)" },
          { label: "Gözləmədə", value: pendingCount,    cls: "text-yellow-600 dark:text-yellow-400", bg: "rgba(234,179,8,0.07)" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl p-3 text-center border dark:border-gray-700" style={{ background: s.bg, borderColor: getRgba(0.15) }}>
            <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">{s.label}</Typography>
            <Typography className={`font-bold text-xl ${s.cls}`}>{s.value}</Typography>
          </div>
        ))}
      </div>

      {services.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
          <CogIcon className="h-14 w-14 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <Typography className="font-semibold text-gray-500 dark:text-gray-400">Xidmət tapılmadı</Typography>
          <Typography variant="small" className="text-gray-400 dark:text-gray-500">Hazırda heç bir xidmətiniz yoxdur</Typography>
        </div>
      ) : (
        <>
          {/* ── View toggle ── */}
          <div className="flex items-center gap-2">
            <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs font-medium whitespace-nowrap">Görünüş:</Typography>
            <div className="flex items-center rounded-xl border dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 p-0.5 gap-0.5">
              {[
                { id: "card",  Icon: Squares2X2Icon, label: "Kart" },
                { id: "table", Icon: TableCellsIcon,  label: "Cədvəl" },
              ].map(({ id, Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === id ? "text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                  style={viewMode === id ? { background: color } : {}}
                >
                  <Icon className="h-3.5 w-3.5" />{label}
                </button>
              ))}
            </div>
          </div>

          {/* ── CARD VIEW ── */}
          {viewMode === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, index) => {
                const cfg = statusCfg(service.status);
                return (
                  <motion.div key={service.id || index} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.04 }}>
                    <Card className="border dark:bg-gray-800 hover:shadow-lg transition-shadow" style={{ borderColor: getRgba(0.2) }}>
                      <CardBody className="p-4">
                        {/* top */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-2 rounded-xl flex-shrink-0" style={{ background: getRgba(0.1) }}>
                              <WrenchScrewdriverIcon className="h-5 w-5" style={{ color }} />
                            </div>
                            <div className="min-w-0">
                              <Typography className="font-bold text-gray-900 dark:text-white text-sm truncate">
                                {service.name || "Xidmət"}
                              </Typography>
                              <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs truncate">
                                {service.description || ""}
                              </Typography>
                            </div>
                          </div>
                          <span className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.cls}`}>
                            {cfg.icon}{cfg.label}
                          </span>
                        </div>

                        {/* price / date */}
                        <div className="space-y-1.5 mb-3">
                          {(service.price || service.amount) && (
                            <div className="flex items-center gap-1.5">
                              <CurrencyDollarIcon className="h-3.5 w-3.5 text-gray-400" />
                              <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                                Qiymət: <span className="font-semibold text-gray-800 dark:text-white">{service.price || service.amount} ₼</span>
                              </Typography>
                            </div>
                          )}
                          {service.next_date && (
                            <div className="flex items-center gap-1.5">
                              <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                              <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">
                                Növbəti: <span className="font-medium text-gray-600 dark:text-gray-300">{formatDate(service.next_date)}</span>
                              </Typography>
                            </div>
                          )}
                          {service.start_date && (
                            <div className="flex items-center gap-1.5">
                              <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                              <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">
                                Başlanğıc: <span className="font-medium text-gray-600 dark:text-gray-300">{formatDate(service.start_date)}</span>
                              </Typography>
                            </div>
                          )}
                        </div>

                        {/* action */}
                        <button
                          onClick={() => handleView(service)}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <EyeIcon className="h-3.5 w-3.5" /> Ətraflı
                        </button>
                      </CardBody>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── TABLE VIEW ── */}
          {viewMode === "table" && (
            <div className="rounded-xl border dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: getRgba(0.08) }}>
                      {["#", "Xidmət", "Qiymət", "Başlanğıc", "Növbəti ödəniş", "Status", ""].map((h) => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, i) => {
                      const cfg = statusCfg(service.status);
                      return (
                        <tr key={service.id || i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                          <td className="px-3 py-2.5 text-gray-400 dark:text-gray-500 text-xs">#{service.id}</td>
                          <td className="px-3 py-2.5">
                            <Typography variant="small" className="font-semibold text-gray-800 dark:text-white truncate max-w-[160px]">
                              {service.name || "Xidmət"}
                            </Typography>
                            {service.description && (
                              <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs truncate max-w-[160px]">{service.description}</Typography>
                            )}
                          </td>
                          <td className="px-3 py-2.5 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                            {service.price || service.amount ? `${service.price || service.amount} ₼` : "-"}
                          </td>
                          <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{formatDate(service.start_date)}</td>
                          <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{formatDate(service.next_date)}</td>
                          <td className="px-3 py-2.5">
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold w-fit ${cfg.cls}`}>
                              {cfg.icon}{cfg.label}
                            </span>
                          </td>
                          <td className="px-3 py-2.5">
                            <button onClick={() => handleView(service)} title="Ətraflı" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-500 dark:text-gray-400">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <ServiceDetailModal
        service={selectedService}
        open={detailModalOpen}
        onClose={handleCloseModal}
        onRequest={handleRequest}
        onCancel={handleCancel}
      />
    </div>
  );
}