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
  LockOpenIcon,
  ArrowUpIcon,
  CreditCardIcon,
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
import { DEMO_STORY_GROUPS, StoriesBar } from "@/pages/resident/components/StoriesBar";

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
  const [storyGroups]                     = useState(DEMO_STORY_GROUPS);
  const [doorUnlocking, setDoorUnlocking] = useState(false);
  const [liftCalling, setLiftCalling]     = useState(false);

  useEffect(() => {
    fetchAll();
  }, [selectedPropertyId]);

  const fetchAll = async () => {
    setLoading(true);
    const params = selectedPropertyId ? { property_id: selectedPropertyId } : {};
    const [invRes, notifRes, tickRes, svcRes] = await Promise.allSettled([
      (selectedPropertyId ? residentInvoicesAPI.getByProperty(selectedPropertyId) : residentInvoicesAPI.getAll()).catch(() => null),
      residentNotificationsAPI.getAll(params).catch(() => null),
      residentTicketsAPI.getAll(params).catch(() => null),
      myServicesAPI.getAll(params).catch(() => null),
    ]);

    const invList   = invRes?.value?.data?.data?.data   ?? invRes?.value?.data?.data   ?? invRes?.value?.data   ?? [];
    const notifList = notifRes?.value?.data?.data?.data ?? notifRes?.value?.data?.data ?? notifRes?.value?.data ?? [];
    const tickList  = tickRes?.value?.data?.data?.data  ?? tickRes?.value?.data?.data  ?? tickRes?.value?.data  ?? [];
    const svcList   = svcRes?.value?.data?.data?.data   ?? svcRes?.value?.data?.data   ?? svcRes?.value?.data   ?? [];

    setInvoices(Array.isArray(invList) ? invList : []);
    setNotifications(Array.isArray(notifList) ? notifList : []);
    setTickets(Array.isArray(tickList) ? tickList : []);
    setServices(Array.isArray(svcList) ? svcList : []);
    setLoading(false);
  };

  const calculateBalance = () => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + parseFloat(inv?.amount || 0), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + parseFloat(inv?.amount_paid || 0), 0);
    const calculatedBalance = totalPaid - totalInvoiced;
    return Math.max(0, calculatedBalance);
  };

  const balance = calculateBalance();
  
  const calculateDebt = () => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + parseFloat(inv?.amount || 0), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + parseFloat(inv?.amount_paid || 0), 0);
    const debt = totalInvoiced - totalPaid;
    return Math.max(0, debt);
  };

  const debt = calculateDebt();

  const handleUnlockDoor = async () => {
    if (!selectedPropertyId) return;
    
    setDoorUnlocking(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // console.log("Qapı açıldı - Mənzil ID:", selectedPropertyId);
      // await fetch(`/api/properties/${selectedPropertyId}/unlock`, { method: 'POST' });
    } catch (error) {
      console.error("Qapı açılarkən xəta:", error);
    } finally {
      setDoorUnlocking(false);
    }
  };

  const handleCallLift = async () => {
    if (!selectedPropertyId) return;
    
    setLiftCalling(true);
    try {
      // Demo üçün sadəcə animasiya
      await new Promise(resolve => setTimeout(resolve, 1500));
      // console.log("Lift çağırıldı - Mənzil ID:", selectedPropertyId);
      // Burada real API çağrısı olacaq
      // await fetch(`/api/properties/${selectedPropertyId}/call-lift`, { method: 'POST' });
    } catch (error) {
      console.error("Lift çağırılarkən xəta:", error);
    } finally {
      setLiftCalling(false);
    }
  };

  const unpaidInvoices = invoices.filter((i) => ["unpaid", "not_paid", "overdue"].includes(i?.status));
  const totalDebt      = unpaidInvoices.reduce((s, i) => s + parseFloat(i?.amount || i?.remaining || 0), 0);
  const unreadNotifs   = notifications.filter((n) => !n?.is_read && !n?.read_at);
  const openTickets    = tickets.filter((t) => ["open", "in_progress"].includes(t?.status));

  const quickActions = [
    { label: "Fakturalar",  icon: DocumentTextIcon,       color: "#10b981", path: "/resident/invoices",       badge: unpaidInvoices.length || null },
    { label: "Ödənişlər", icon: CreditCardIcon,        color: "#3b82f6", path: "/resident/payment-history", badge: null },
    { label: "Bildirişlər", icon: BellIcon,               color: "#f59e0b", path: "/resident/notifications",  badge: unreadNotifs.length || null },
    { label: "Müraciətlər", icon: QuestionMarkCircleIcon, color: "#8b5cf6", path: "/resident/tickets",         badge: openTickets.length || null },
    { label: "E-Sənədlər",  icon: BookOpenIcon,           color: "#06b6d4", path: "/resident/e-documents",    badge: null },
    { label: "Xidmətlər",   icon: WrenchScrewdriverIcon,  color: "#f97316", path: "/resident/my-services",    badge: null },
    { label: "Profil",      icon: UserCircleIcon,          color: "#64748b", path: "/resident/profile",         badge: null },
    { label: "Ödəniş tarixçəsi", icon: CreditCardIcon,        color: "#3b82f6", path: "/resident/payment-history", badge: null },
  ];

  const propName    = selectedProperty?.name
    || (selectedProperty?.meta?.apartment_number ? `Mənzil ${selectedProperty.meta.apartment_number}` : null)
    || (selectedProperty?.id ? `Mənzil #${selectedProperty.id}` : "Mənzil");
  const complexName = selectedProperty?.sub_data?.complex?.name || selectedProperty?.complex?.name || "";
  const mtkName     = selectedProperty?.sub_data?.mtk?.name     || selectedProperty?.mtk?.name     || "";

  const Sk = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl ${className}`} />
  );

  if (loading) {
    return (
      <div className="space-y-5">
        <Sk className="h-24" />
        <div className="flex gap-3 px-1 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1.5">
              <Sk className="w-14 h-14 !rounded-full" />
              <Sk className="h-2 w-10 !rounded" />
            </div>
          ))}
        </div>

        <Sk className="h-36" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[...Array(4)].map((_, i) => <Sk key={i} className="h-28" />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Sk className="h-72" />
          <div className="flex flex-col gap-5">
            <Sk className="h-44" />
            <Sk className="h-44" />
          </div>
        </div>

        <Sk className="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-5" style={{ position: "relative", zIndex: 0 }}>

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

      {/* <StoriesBar groups={storyGroups} height={160} /> */}

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
              
              <div className="rounded-xl p-3 mb-3" style={{ background: `linear-gradient(135deg, ${getRgba(0.08)}, ${getRgba(0.03)})`, border: `1px solid ${getRgba(0.15)}` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mb-1">Cari Balans</Typography>
                    <Typography variant="h4" className={`font-bold ${balance > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} style={{ color: balance > 0 ? undefined : undefined }}>
                      {balance > 0 ? '+' : ''}{balance.toFixed(2)} ₼
                    </Typography>
                  </div>
                  <div className="p-2 rounded-lg" style={{ backgroundColor: getRgba(0.12) }}>
                    <CurrencyDollarIcon className="h-5 w-5" style={{ color }} />
                  </div>
                </div>
                {balance > 0 && (
                  <Typography variant="small" className="text-green-600 dark:text-green-400 text-xs mt-1">
                    ✅ Artıqınız var: {balance.toFixed(2)} ₼
                  </Typography>
                )}
                {balance === 0 && debt > 0 && (
                  <Typography variant="small" className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {debt > 0 ? `⚠️ Borcunuz var: ${formatCurrency(totalDebt)} ₼` : "Borcunuz yoxdur"}
                  </Typography>
                )}
                {balance === 0 && debt === 0 && (
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    ➖ Balansınız sıfırdır
                  </Typography>
                )}
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

      {selectedProperty && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          <Card className="shadow-md dark:bg-gray-800 border" style={{ borderColor: getRgba(0.25) }}>
            <CardBody className="p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: getRgba(0.12) }}>
                  <WrenchScrewdriverIcon className="h-5 w-5" style={{ color }} />
                </div>
                <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">Cihazlar</Typography>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    onClick={handleUnlockDoor}
                    disabled={doorUnlocking}
                    className="w-full h-20 sm:h-24 flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all duration-300 shadow-md hover:shadow-xl"
                    style={{ 
                      borderColor: doorUnlocking ? color : `${color}40`,
                      background: doorUnlocking 
                        ? `linear-gradient(135deg, ${color}20, ${color}10)` 
                        : `linear-gradient(135deg, ${color}08, ${color}04)`,
                      color: doorUnlocking ? `${color}dd` : color
                    }}
                  >
                    <motion.div
                      animate={doorUnlocking ? { rotate: [0, 15, -15, 15, 0] } : {}}
                      transition={{ duration: 0.6, repeat: doorUnlocking ? Infinity : 0, repeatDelay: 0.3 }}
                      className="relative"
                    >
                      <LockOpenIcon className={`h-8 w-8 ${doorUnlocking ? 'opacity-90' : 'opacity-80'}`} style={{ color }} />
                      {doorUnlocking && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      )}
                    </motion.div>
                    <div className="text-center">
                      <Typography variant="small" className={`font-semibold ${doorUnlocking ? 'opacity-90' : 'opacity-80'}`} style={{ color }}>
                        {doorUnlocking ? 'Qapı Açılır...' : 'Qapını Aç'}
                      </Typography>
                      <Typography variant="small" className="text-xs opacity-60 mt-0.5" style={{ color }}>
                        {doorUnlocking ? 'Zəhmət olmasa gözləyin' : 'Əsas girişə'}
                      </Typography>
                    </div>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    onClick={handleCallLift}
                    disabled={liftCalling}
                    className="w-full h-20 sm:h-24 flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all duration-300 shadow-md hover:shadow-xl"
                    style={{ 
                      borderColor: liftCalling ? color : `${color}40`,
                      background: liftCalling 
                        ? `linear-gradient(135deg, ${color}20, ${color}10)` 
                        : `linear-gradient(135deg, ${color}08, ${color}04)`,
                      color: liftCalling ? `${color}dd` : color
                    }}
                  >
                    <motion.div
                      animate={liftCalling ? { y: [-3, 3, -3] } : {}}
                      transition={{ duration: 1.2, repeat: liftCalling ? Infinity : 0, ease: "easeInOut" }}
                      className="relative"
                    >
                      <ArrowUpIcon className={`h-8 w-8 ${liftCalling ? 'opacity-90' : 'opacity-80'}`} style={{ color }} />
                      {liftCalling && (
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.4, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: `${color}30` }}
                        />
                      )}
                    </motion.div>
                    <div className="text-center">
                      <Typography variant="small" className={`font-semibold ${liftCalling ? 'opacity-90' : 'opacity-80'}`} style={{ color }}>
                        {liftCalling ? 'Lift Gəlir...' : 'Lifti Çağır'}
                      </Typography>
                      <Typography variant="small" className="text-xs opacity-60 mt-0.5" style={{ color }}>
                        {liftCalling ? 'Sizin mərtəbəyə' : 'Sizin mərtəbəyə'}
                      </Typography>
                    </div>
                  </Button>
                </motion.div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600">
                <Typography variant="small" className="text-gray-600 dark:text-gray-400 text-center text-xs">
                  💡 <strong>Qeyd:</strong> Bu funksiyalar demo məqsədi ilə hazırlanıb. Hazırda sadəcə animasiya var.
                </Typography>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

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

        <div className="flex flex-col gap-5">

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
                        {action.badge > 10 ? "10+" : action.badge}
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
