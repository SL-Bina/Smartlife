import React, { useState, useEffect } from "react";
import { Typography, Spinner } from "@material-tailwind/react";
import {
  BellIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BellSlashIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import residentNotificationsAPI from "./api";
import { useComplexColor } from "@/hooks/useComplexColor";

const MOCK = [
  { id: 1, title: "Yeni Faktura",          message: "Sizin üçün yeni faktura yaradıldı. Zəhmət olmasa ödənişi tamamlayın.",                             type: "info",    is_read: false, created_at: "2026-02-20T10:30:00Z" },
  { id: 2, title: "Ödəniş TəsdiqIəndi",       message: "Faktura #123 ödənişi uğurla təsdiqIəndi. Təşəkkür edirik!",                                        type: "success", is_read: false, created_at: "2026-02-19T15:45:00Z" },
  { id: 3, title: "Gecikmiş Ödəniş",        message: "XəbərdarlIq: Faktura #124 üçün ödəniş tarixi keçib. Zəhmət olmasa ödənişi tamamlayın.", type: "warning", is_read: true,  created_at: "2026-02-18T09:20:00Z" },
  { id: 4, title: "Bildiriş",               message: "Kompleksdə təmir işləri aparılacaq. Zəhmət olmasa nəzərə alın.",                           type: "info",    is_read: true,  created_at: "2026-02-17T14:00:00Z" },
  { id: 5, title: "Yeni Sənəd",              message: "Sizin üçün yeni elektron sənəd əlavə edildi. Profilinizdjən yükləyə bilərsiniz.",        type: "info",    is_read: true,  created_at: "2026-02-16T11:15:00Z" },
];

const TYPE_CFG = {
  info:    { Icon: InformationCircleIcon, bar: "bg-blue-500",   bg: "bg-blue-50 dark:bg-blue-900/10",   icon: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300",   label: "Məlumat" },
  warning: { Icon: ExclamationTriangleIcon, bar: "bg-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/10", icon: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300", label: "XəbərdarlIq" },
  success: { Icon: CheckCircleIcon, bar: "bg-green-500",  bg: "bg-green-50 dark:bg-green-900/10",   icon: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300",   label: "Uğur" },
};

const fmtDate = (d) => {
  if (!d) return "-";
  try {
    const diff = Date.now() - new Date(d).getTime();
    const min  = Math.floor(diff / 60000);
    if (min < 60)   return `${min} dəq. əvvəl`;
    const hr = Math.floor(min / 60);
    if (hr  < 24)   return `${hr} saat əvvəl`;
    const dy = Math.floor(hr / 24);
    if (dy  < 7)    return `${dy} gün əvvəl`;
    return new Date(d).toLocaleDateString("az-AZ", { month: "short", day: "numeric" });
  } catch { return d; }
};

const FILTERS = [
  { key: "all",    label: "Hamısı" },
  { key: "unread", label: "Oxunmamış" },
  { key: "read",   label: "Oxunmuş" },
];

const ResidentNotificationsPage = () => {
  const selectedPropertyId = useSelector((state) => state.property.selectedPropertyId);
  const { color, getRgba, headerStyle } = useComplexColor();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { fetchNotifications(); }, [selectedPropertyId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = selectedPropertyId ? { property_id: selectedPropertyId } : {};
      const response = await residentNotificationsAPI.getAll(params);
      setNotifications(response?.data?.data || response?.data || MOCK);
    } catch {
      setNotifications(MOCK);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

  const markRead = (id) =>
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const filtered = notifications.filter((n) =>
    filter === "all" ? true : filter === "unread" ? !n.is_read : n.is_read
  );

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse" style={{ position: "relative", zIndex: 0 }}>
        {/* Header */}
        <div className="h-[80px] rounded-xl bg-gray-200 dark:bg-gray-700" />
        {/* Filter tabs */}
        <div className="h-10 w-56 rounded-xl bg-gray-200 dark:bg-gray-700" />
        {/* Notification rows */}
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl p-4 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="h-9 w-9 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="h-3.5 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5" style={{ position: "relative", zIndex: 0 }}>

      {/* ── Header ── */}
      <div className="p-4 sm:p-6 rounded-xl shadow-lg border" style={headerStyle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-white/20 rounded-lg">
              <BellIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <Typography variant="h4" className="text-white font-bold">Bildirişlər</Typography>
              <Typography variant="small" className="text-white/80">{notifications.length} bildiriş</Typography>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-medium rounded-lg border border-white/30 transition-colors"
            >
              <CheckCircleSolid className="h-3.5 w-3.5" />
              Hamısını oxunmuş et
            </button>
          )}
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-1">
        {FILTERS.map(({ key, label }) => {
          const count = key === "all" ? notifications.length
            : key === "unread" ? unreadCount
            : notifications.length - unreadCount;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                filter === key ? "text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
              style={filter === key ? { background: color } : {}}
            >
              {label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                filter === key ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Feed ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <BellSlashIcon className="h-14 w-14 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Bildiriş tapılmadı</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((notif, index) => {
              const cfg = TYPE_CFG[notif.type] || TYPE_CFG.info;
              const { Icon } = cfg;
              return (
                <motion.div
                  key={notif.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => !notif.is_read && markRead(notif.id)}
                  className={`flex items-stretch gap-0 rounded-xl overflow-hidden border cursor-pointer transition-shadow hover:shadow-md ${
                    !notif.is_read
                      ? "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
                      : "border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/60"
                  }`}
                >
                  {/* Colored left bar */}
                  <div className={`w-1 shrink-0 ${cfg.bar}`} />

                  <div className="flex items-start gap-3 p-4 flex-1 min-w-0">
                    {/* Icon */}
                    <div className={`p-2 rounded-lg shrink-0 ${cfg.icon}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`text-sm font-semibold leading-tight ${
                          !notif.is_read ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300"
                        }`}>{notif.title || "Bildiriş"}</p>
                        <div className="flex items-center gap-2 shrink-0">
                          {!notif.is_read && (
                            <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                          )}
                          <span className="text-[11px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                            {fmtDate(notif.created_at || notif.date)}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                        {notif.message || notif.description || ""}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ResidentNotificationsPage;

