import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Chip, Button } from "@material-tailwind/react";
import {
  HomeIcon,
  DocumentTextIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  CalendarIcon,
  UserCircleIcon,
  WrenchScrewdriverIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import residentInvoicesAPI from "@/pages/resident/myinvoices/api";
import residentNotificationsAPI from "@/pages/resident/notifications/api";
import residentTicketsAPI from "@/pages/resident/tickets/api";
import myServicesAPI from "@/pages/resident/myservices/api";
import { useComplexColor } from "@/hooks/useComplexColor";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("az-AZ", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
};

const formatCurrency = (val) => {
  const num = parseFloat(val);
  if (isNaN(num)) return "0.00";
  return num.toFixed(2);
};

const invoiceStatusConfig = {
  paid:     { label: "Ödənilib",        cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  not_paid: { label: "Ödənilməyib",     cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  unpaid:   { label: "Ödənilməyib",     cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  overdue:  { label: "Gecikmiş",         cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  partial:  { label: "Qismən ödənilib", cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
};

const ticketStatusConfig = {
  open:        { label: "Açıq",        cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",         icon: ClockIcon },
  in_progress: { label: "İcrada",      cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: WrenchScrewdriverIcon },
  closed:      { label: "Bağlı",       cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",            icon: CheckCircleIcon },
  resolved:    { label: "Həll edildi", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",     icon: CheckCircleIcon },
};

// ─── Component ────────────────────────────────────────────────────────────────
const ResidentHomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectedPropertyId = useSelector((state) => state.property.selectedPropertyId);
  const selectedProperty   = useSelector((state) => state.property.selectedProperty);
  const { color, getRgba, headerStyle } = useComplexColor();

  const [loading, setLoading]             = useState(true);
  const [invoices, setInvoices]           = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [tickets, setTickets]             = useState([]);
  const [services, setServices]           = useState([]);

  useEffect(() => {
    fetchAll();
  }, [selectedPropertyId]);

  const fetchAll = async () => {
    setLoading(true);
    const params = selectedPropertyId ? { property_id: selectedPropertyId } : {};
    const [, invRes, notifRes, tickRes, svcRes] = await Promise.allSettled([
      new Promise((r) => setTimeout(r, 1400)),
      (selectedPropertyId ? residentInvoicesAPI.getByProperty(selectedPropertyId) : residentInvoicesAPI.getAll()).catch(() => null),
      residentNotificationsAPI.getAll(params).catch(() => null),
      residentTicketsAPI.getAll(params).catch(() => null),
      myServicesAPI.getAll(params).catch(() => null),
    ]);

    const invList   = invRes.value?.data?.data?.data   ?? invRes.value?.data?.data   ?? invRes.value?.data   ?? [];
    const notifList = notifRes.value?.data?.data?.data ?? notifRes.value?.data?.data ?? notifRes.value?.data ?? [];
    const tickList  = tickRes.value?.data?.data?.data  ?? tickRes.value?.data?.data  ?? tickRes.value?.data  ?? [];
    const svcList   = svcRes.value?.data?.data?.data   ?? svcRes.value?.data?.data   ?? svcRes.value?.data   ?? [];

    setInvoices(Array.isArray(invList) ? invList : []);
    setNotifications(Array.isArray(notifList) ? notifList : []);
    setTickets(Array.isArray(tickList) ? tickList : []);
    setServices(Array.isArray(svcList) ? svcList : []);
    setLoading(false);
  };

  // ── Computed stats ─────────────────────────────────────────────────────────
  const unpaidInvoices = invoices.filter((i) => ["unpaid", "not_paid", "overdue"].includes(i?.status));
  const totalDebt      = unpaidInvoices.reduce((s, i) => s + parseFloat(i?.amount || i?.remaining || 0), 0);
  const unreadNotifs   = notifications.filter((n) => !n?.is_read && !n?.read_at);
  const openTickets    = tickets.filter((t) => ["open", "in_progress"].includes(t?.status));

  // ── Quick action tiles ─────────────────────────────────────────────────────
  const quickActions = [
    { label: "Fakturalar",  icon: DocumentTextIcon,       color: "#10b981", path: "/resident/invoices",       badge: unpaidInvoices.length || null },
    { label: "Bildirişlər", icon: BellIcon,               color: "#f59e0b", path: "/resident/notifications",  badge: unreadNotifs.length || null },
    { label: "Müraciətlər", icon: QuestionMarkCircleIcon, color: "#8b5cf6", path: "/resident/tickets",         badge: openTickets.length || null },
    { label: "E-Sənədlər",  icon: BookOpenIcon,           color: "#06b6d4", path: "/resident/e-documents",    badge: null },
    { label: "Xidmətlər",   icon: WrenchScrewdriverIcon,  color: "#f97316", path: "/resident/my-services",    badge: null },
    { label: "Profil",      icon: UserCircleIcon,          color: "#64748b", path: "/resident/profile",         badge: null },
  ];

  // ── Property meta ──────────────────────────────────────────────────────────
  const propName    = selectedProperty?.name
    || (selectedProperty?.meta?.apartment_number ? `Mənzil ${selectedProperty.meta.apartment_number}` : null)
    || (selectedProperty?.id ? `Mənzil #${selectedProperty.id}` : "Mənzil");
  const complexName = selectedProperty?.sub_data?.complex?.name || selectedProperty?.complex?.name || "";
  const mtkName     = selectedProperty?.sub_data?.mtk?.name     || selectedProperty?.mtk?.name     || "";

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5" style={{ position: "relative", zIndex: 0 }}>
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: `linear-gradient(135deg, ${getRgba(0.9)}, ${getRgba(0.6)})` }}
        >
          <HomeIcon className="h-10 w-10 text-white" />
        </div>
        <div className="text-center space-y-1">
          <Typography variant="h5" className="font-bold text-gray-800 dark:text-white">
            {complexName || propName || "Sakin Paneli"}
          </Typography>
          <Typography variant="small" className="text-gray-500 dark:text-gray-400">Yüklənir...</Typography>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ backgroundColor: getRgba(0.7), animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5" style={{ position: "relative", zIndex: 0 }}>

      {/* ── Header banner ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="p-4 sm:p-6 rounded-xl shadow-lg border" style={headerStyle}>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <HomeIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <Typography variant="h4" className="text-white font-bold leading-tight">
                  Xoş gəldiniz
                </Typography>
                <Typography variant="small" className="text-white/75">
                  {complexName ? `${complexName} — Sakin Paneli` : "Sizin şəxsi paneliniz"}
                </Typography>
              </div>
            </div>
            {selectedProperty && (
              <Chip
                size="sm"
                value={selectedProperty?.status === "active" ? "Aktiv" : "Qeyri-aktiv"}
                className={`flex-shrink-0 font-semibold ${
                  selectedProperty?.status === "active"
                    ? "bg-green-500/20 text-white border border-green-300/40"
                    : "bg-red-500/20 text-white border border-red-300/40"
                }`}
              />
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Property card ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
        {selectedProperty ? (
          <Card
            className="shadow-md dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-all duration-300 border overflow-hidden"
            style={{ borderColor: getRgba(0.35) }}
            onClick={() => navigate("/resident/my-properties")}
          >
            <div className="p-4 sm:p-5" style={{ background: `linear-gradient(135deg, ${getRgba(0.11)}, ${getRgba(0.04)})` }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl flex-shrink-0" style={{ backgroundColor: getRgba(0.16) }}>
                    <HomeIcon className="h-6 w-6" style={{ color }} />
                  </div>
                  <div className="min-w-0">
                    <Typography variant="h6" className="font-bold text-gray-900 dark:text-white truncate">{propName}</Typography>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                      {complexName && (
                        <div className="flex items-center gap-1">
                          <BuildingOfficeIcon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">{complexName}</Typography>
                        </div>
                      )}
                      {mtkName && (
                        <div className="flex items-center gap-1">
                          <MapPinIcon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                          <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">{mtkName}</Typography>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 flex-shrink-0">
                  <Typography variant="small" className="text-xs hidden sm:block">Ətraflı</Typography>
                  <ChevronRightIcon className="h-4 w-4" />
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t" style={{ borderColor: getRgba(0.18) }}>
                {[
                  { label: "Bina",    value: selectedProperty?.sub_data?.building?.name || selectedProperty?.building?.name || `#${selectedProperty?.building_id || "-"}` },
                  { label: "Blok",    value: selectedProperty?.sub_data?.block?.name || selectedProperty?.block?.name || `#${selectedProperty?.block_id || "-"}` },
                  { label: "Sahə",    value: selectedProperty?.meta?.area ? `${selectedProperty.meta.area} m²` : selectedProperty?.area ? `${selectedProperty.area} m²` : "-" },
                  { label: "Mərtəbə", value: selectedProperty?.meta?.floor || selectedProperty?.floor || "-" },
                ].map((item, i) => (
                  <div key={i}>
                    <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs">{item.label}</Typography>
                    <Typography className="font-semibold text-gray-800 dark:text-white text-sm mt-0.5">{item.value}</Typography>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ) : (
          <Card
            className="shadow-sm dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:shadow-md transition-all"
            onClick={() => navigate("/resident/my-properties")}
          >
            <CardBody className="flex items-center gap-4 py-5 px-5">
              <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700">
                <HomeIcon className="h-7 w-7 text-gray-400" />
              </div>
              <div>
                <Typography variant="h6" className="text-gray-700 dark:text-gray-300 font-semibold">Mənzil seçilməyib</Typography>
                <Typography variant="small" className="text-gray-500 dark:text-gray-400">Yuxarıdakı navbar-dan mənzil seçin</Typography>
              </div>
            </CardBody>
          </Card>
        )}
      </motion.div>

      {/* ── 4 stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Ümumi Faktura",
            value: invoices.length,
            sub: unpaidInvoices.length ? `${unpaidInvoices.length} ödənilməmiş` : "Hamısı ödənilib",
            icon: DocumentTextIcon,
            accent: "#10b981",
            path: "/resident/invoices",
          },
          {
            label: "Borc Məbləği",
            value: `${formatCurrency(totalDebt)} ₼`,
            sub: unpaidInvoices.length ? `${unpaidInvoices.length} faktura` : "Borcunuz yoxdur",
            icon: CurrencyDollarIcon,
            accent: totalDebt > 0 ? "#ef4444" : "#10b981",
            path: "/resident/invoices",
          },
          {
            label: "Açıq Müraciət",
            value: openTickets.length,
            sub: `${tickets.length} ümumi müraciət`,
            icon: QuestionMarkCircleIcon,
            accent: "#8b5cf6",
            path: "/resident/tickets",
          },
          {
            label: "Bildiriş",
            value: notifications.length,
            sub: unreadNotifs.length ? `${unreadNotifs.length} oxunmamış` : "Hamısı oxunub",
            icon: BellIcon,
            accent: "#f59e0b",
            path: "/resident/notifications",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.07 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="shadow-md dark:bg-gray-800 cursor-pointer hover:shadow-lg transition-all border"
              style={{ borderColor: `${stat.accent}33` }}
              onClick={() => navigate(stat.path)}
            >
              <CardBody className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.accent}1a` }}>
                    <stat.icon className="h-5 w-5" style={{ color: stat.accent }} />
                  </div>
                  <ChevronRightIcon className="h-4 w-4 text-gray-300 dark:text-gray-600 mt-0.5" />
                </div>
                <Typography variant="h4" className="font-bold text-gray-900 dark:text-white text-xl sm:text-2xl">
                  {stat.value}
                </Typography>
                <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 font-medium">
                  {stat.label}
                </Typography>
                <Typography variant="small" className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                  {stat.sub}
                </Typography>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Recent invoices + notifications ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent invoices */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="shadow-md dark:bg-gray-800 border" style={{ borderColor: getRgba(0.25) }}>
            <CardBody className="p-0">
              <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: getRgba(0.12) }}>
                    <DocumentTextIcon className="h-4 w-4" style={{ color }} />
                  </div>
                  <Typography variant="h6" className="font-bold text-gray-800 dark:text-white text-sm">Son Fakturalar</Typography>
                </div>
                <Button variant="text" size="sm" className="flex items-center gap-1 normal-case text-xs p-1" style={{ color }} onClick={() => navigate("/resident/invoices")}>
                  Hamısı <ArrowRightIcon className="h-3 w-3" />
                </Button>
              </div>
              {invoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                  <DocumentTextIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                  <Typography variant="small" className="text-gray-400 dark:text-gray-500">Faktura tapılmadı</Typography>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-gray-700/60">
                  {invoices.slice(0, 5).map((inv, i) => {
                    const statusCfg = invoiceStatusConfig[inv?.status] || { label: inv?.status || "-", cls: "bg-gray-100 text-gray-600" };
                    const isPaid = inv?.status === "paid";
                    return (
                      <div key={inv?.id || i} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-1.5 rounded-lg flex-shrink-0 ${isPaid ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"}`}>
                            {isPaid
                              ? <CheckCircleSolid className="h-4 w-4 text-green-600 dark:text-green-400" />
                              : <ExclamationCircleIcon className="h-4 w-4 text-red-500 dark:text-red-400" />
                            }
                          </div>
                          <div className="min-w-0">
                            <Typography className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                              {inv?.service?.name || inv?.title || `Faktura #${inv?.id}`}
                            </Typography>
                            <Typography variant="small" className="text-xs text-gray-400 dark:text-gray-500">
                              {inv?.due_date ? formatDate(inv.due_date) : formatDate(inv?.start_date)}
                            </Typography>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                          <Typography className="text-sm font-bold text-gray-900 dark:text-white">
                            {formatCurrency(inv?.amount)} ₼
                          </Typography>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusCfg.cls}`}>
                            {statusCfg.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        {/* Right column: notifications + services */}
        <div className="flex flex-col gap-5">

          {/* Recent notifications */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
            <Card className="shadow-md dark:bg-gray-800 border" style={{ borderColor: getRgba(0.25) }}>
              <CardBody className="p-0">
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: getRgba(0.12) }}>
                      <BellIcon className="h-4 w-4" style={{ color }} />
                    </div>
                    <Typography variant="h6" className="font-bold text-gray-800 dark:text-white text-sm">Son Bildirişlər</Typography>
                    {unreadNotifs.length > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>
                        {unreadNotifs.length}
                      </span>
                    )}
                  </div>
                  <Button variant="text" size="sm" className="flex items-center gap-1 normal-case text-xs p-1" style={{ color }} onClick={() => navigate("/resident/notifications")}>
                    Hamısı <ArrowRightIcon className="h-3 w-3" />
                  </Button>
                </div>
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                    <BellIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                    <Typography variant="small" className="text-gray-400 dark:text-gray-500">Bildiriş tapılmadı</Typography>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50 dark:divide-gray-700/60">
                    {notifications.slice(0, 5).map((notif, i) => {
                      const isRead = notif?.is_read || notif?.read_at;
                      return (
                        <div
                          key={notif?.id || i}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                          onClick={() => navigate("/resident/notifications")}
                        >
                          <div className="flex-shrink-0 mt-1.5">
                            {isRead
                              ? <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600" />
                              : <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                            }
                          </div>
                          <div className="min-w-0 flex-1">
                            <Typography className={`text-sm truncate ${isRead ? "text-gray-500 dark:text-gray-400 font-normal" : "text-gray-800 dark:text-white font-semibold"}`}>
                              {notif?.title || notif?.subject || "Bildiriş"}
                            </Typography>
                            {(notif?.message || notif?.body) && (
                              <Typography variant="small" className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-2">
                                {notif.message || notif.body}
                              </Typography>
                            )}
                            <div className="flex items-center gap-1 mt-1">
                              <CalendarIcon className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                              <Typography variant="small" className="text-[10px] text-gray-400 dark:text-gray-500">
                                {formatDate(notif?.created_at || notif?.date)}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>

          {/* Recent services */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
            <Card className="shadow-md dark:bg-gray-800 border" style={{ borderColor: getRgba(0.25) }}>
              <CardBody className="p-0">
                <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg" style={{ backgroundColor: getRgba(0.12) }}>
                      <WrenchScrewdriverIcon className="h-4 w-4" style={{ color }} />
                    </div>
                    <Typography variant="h6" className="font-bold text-gray-800 dark:text-white text-sm">Xidmətlərim</Typography>
                  </div>
                  <Button variant="text" size="sm" className="flex items-center gap-1 normal-case text-xs p-1" style={{ color }} onClick={() => navigate("/resident/my-services")}>
                    Hamısı <ArrowRightIcon className="h-3 w-3" />
                  </Button>
                </div>
                {services.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                    <WrenchScrewdriverIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                    <Typography variant="small" className="text-gray-400 dark:text-gray-500">Xidmət tapılmadı</Typography>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50 dark:divide-gray-700/60 p-6">
                    {services.slice(0, 5).map((svc, i) => (
                      <div
                        key={svc?.id || i}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                        onClick={() => navigate("/resident/my-services")}
                      >
                        <div className="p-1.5 rounded-lg flex-shrink-0" style={{ backgroundColor: getRgba(0.12) }}>
                          <WrenchScrewdriverIcon className="h-4 w-4" style={{ color }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Typography className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                            {typeof svc?.service === "string" ? svc.service : svc?.service?.name || svc?.name || `Xidmət #${svc?.id}`}
                          </Typography>
                          {(svc?.description || svc?.service?.description) && (
                            <Typography variant="small" className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1">
                              {svc?.description || svc?.service?.description}
                            </Typography>
                          )}
                        </div>
                        {svc?.status && (
                          <span className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                            {svc.status}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>

        </div>
      </div>

      {/* ── Recent tickets ── */}
      {tickets.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="shadow-md dark:bg-gray-800 border" style={{ borderColor: getRgba(0.25) }}>
            <CardBody className="p-0">
              <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: getRgba(0.12) }}>
                    <QuestionMarkCircleIcon className="h-4 w-4" style={{ color }} />
                  </div>
                  <Typography variant="h6" className="font-bold text-gray-800 dark:text-white text-sm">Son Müraciətlər</Typography>
                </div>
                <Button variant="text" size="sm" className="flex items-center gap-1 normal-case text-xs p-1" style={{ color }} onClick={() => navigate("/resident/tickets")}>
                  Hamısı <ArrowRightIcon className="h-3 w-3" />
                </Button>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-700/60">
                {tickets.slice(0, 4).map((ticket, i) => {
                  const statusCfg = ticketStatusConfig[ticket?.status] || { label: ticket?.status || "-", cls: "bg-gray-100 text-gray-600", icon: ClockIcon };
                  const StatusIcon = statusCfg.icon;
                  return (
                    <div key={ticket?.id || i} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1.5 rounded-lg flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                          <StatusIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <Typography className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                            {ticket?.title || ticket?.subject || `Müraciət #${ticket?.id}`}
                          </Typography>
                          <div className="flex items-center gap-2 mt-0.5">
                            {ticket?.ticket_number && (
                              <Typography variant="small" className="text-xs text-gray-400 dark:text-gray-500">{ticket.ticket_number}</Typography>
                            )}
                            <Typography variant="small" className="text-xs text-gray-400 dark:text-gray-500">
                              {formatDate(ticket?.created_at)}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <span className={`flex-shrink-0 ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusCfg.cls}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* ── Quick access grid ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
        <Card className="shadow-md dark:bg-gray-800 border" style={{ borderColor: getRgba(0.2) }}>
          <CardBody className="p-4 sm:p-5">
            <Typography variant="h6" className="font-bold text-gray-800 dark:text-white mb-4 text-sm">Tez Keçid</Typography>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {quickActions.map((action, i) => (
                <motion.div key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    type="button"
                    onClick={() => navigate(action.path)}
                    className="relative w-full flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-700/50 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${action.color}18` }}>
                      <action.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: action.color }} />
                    </div>
                    <Typography variant="small" className="text-center text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 font-medium leading-tight">
                      {action.label}
                    </Typography>
                    {action.badge > 0 && (
                      <span
                        className="absolute -top-1 -right-1 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: action.color }}
                      >
                        {action.badge > 9 ? "9+" : action.badge}
                      </span>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </CardBody>
        </Card>
      </motion.div>

    </div>
  );
};

export default ResidentHomePage;
