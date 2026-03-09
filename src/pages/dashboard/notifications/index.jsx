import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Typography,
  Card,
  CardBody,
  Button,
  Spinner,
  Chip,
  IconButton,
} from "@material-tailwind/react";
import {
  BellIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  EyeIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNotifications,
  selectNotificationsPage,
  selectNotificationsLastPage,
  mergeApiNotifications,
  markAllRead,
  markRead,
  normalizeApiNotification,
} from "@/store/slices/notificationsSlice";
import { notificationsAPI } from "./api";
import { NotificationsViewModal } from "./components/NotificationsViewModal";
import { useMtkColor } from "@/store/hooks/useMtkColor";

const TYPE_COLORS = {
  info: "blue",
  success: "green",
  warning: "amber",
  error: "red",
  danger: "red",
};

const TYPE_LABELS = {
  info: "Məlumat",
  success: "Uğurlu",
  warning: "Xəbərdarlıq",
  error: "Xəta",
  danger: "Xəta",
};

export function Notifications() {
  const { getRgba: getMtkRgba, getActiveGradient } = useMtkColor();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const currentPage = useSelector(selectNotificationsPage);
  const lastPage = useSelector(selectNotificationsLastPage);
  const [sortConfig, setSortConfig] = useState({ column: "date", direction: "desc" });
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPage = useCallback(async (page, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);
    try {
      const res = await notificationsAPI.getMyNotifications(page);
      const paginatedData = res.data?.data;
      const rawItems = paginatedData?.data ?? [];
      const items = rawItems.map(normalizeApiNotification);
      dispatch(mergeApiNotifications({
        items,
        page: paginatedData?.current_page ?? page,
        lastPage: paginatedData?.last_page ?? 1,
      }));
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const sortedNotifications = useMemo(() => {
    const sorted = [...notifications];
    sorted.sort((a, b) => {
      if (sortConfig.column === "title") {
        const cmp = (a.title || "").localeCompare(b.title || "");
        return sortConfig.direction === "asc" ? cmp : -cmp;
      }
      const aTime = new Date(a.receivedAt || 0).getTime();
      const bTime = new Date(b.receivedAt || 0).getTime();
      return sortConfig.direction === "asc" ? aTime - bTime : bTime - aTime;
    });
    return sorted;
  }, [notifications, sortConfig]);

  const hasMore = currentPage < lastPage;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSort = (column) => {
    setSortConfig((prev) => ({
      column,
      direction: prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcons = (column) => (
    <div className="flex flex-col">
      <ArrowUpIcon className={`h-3 w-3 ${sortConfig.column === column && sortConfig.direction === "asc" ? "text-white" : "text-white/40"}`} />
      <ArrowDownIcon className={`h-3 w-3 -mt-0.5 ${sortConfig.column === column && sortConfig.direction === "desc" ? "text-white" : "text-white/40"}`} />
    </div>
  );

  const handleView = async (notification) => {
    setSelectedNotification(notification);
    setViewModalOpen(true);
    if (!notification.read) {
      try {
        await notificationsAPI.markRead(notification.id);
        dispatch(markRead(notification.id));
      } catch { /* ignore */ }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
    } catch { /* ignore */ } finally {
      dispatch(markAllRead());
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) fetchPage(currentPage + 1, true);
  };

  return (
    <div className="pb-6">
      {/* ── Header Banner ── */}
      <div
        className="relative w-full overflow-hidden rounded-xl shadow-lg p-4 sm:p-5 md:p-6 mt-2 sm:mt-3 md:mt-4 mb-4"
        style={{ background: getActiveGradient(0.95, 0.75), border: `1px solid ${getMtkRgba(0.35)}` }}
      >
        {/* subtle pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E")` }} />
        <div className="relative flex items-center gap-3 sm:gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center border border-white/30" style={{ backgroundColor: getMtkRgba(0.2) }}>
              <BellIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <Typography variant="h4" className="text-white font-bold mb-1 text-lg sm:text-xl md:text-2xl">
              {t("notifications.pageTitle") || "Bildirişlər"}
            </Typography>
            <Typography className="text-white/80 text-xs sm:text-sm">
              {t("notifications.pageSubtitle") || "Bütün sistem bildirişləriniz"}
            </Typography>
          </div>
          {unreadCount > 0 && (
            <span className="flex-shrink-0 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
              {unreadCount} oxunmamış
            </span>
          )}
        </div>
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
        <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12" />
      </div>

      {/* ── Action Bar ── */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400 text-sm">
            Cəmi: <span className="font-semibold text-blue-gray-900 dark:text-white">{notifications.length}</span> bildiriş
          </Typography>
        </div>
        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outlined"
            className="flex items-center gap-1.5 text-xs dark:border-gray-600 dark:text-gray-300"
            style={{ borderColor: getMtkRgba(0.5), color: getMtkRgba(1) }}
            onClick={handleMarkAllRead}
          >
            <CheckCircleIcon className="h-4 w-4" />
            Hamısını oxunmuş et
          </Button>
        )}
      </div>

      {/* ── Table Card ── */}
      <Card className="border dark:border-gray-700 shadow-sm dark:bg-gray-800" style={{ borderColor: getMtkRgba(0.5) }}>
        <CardBody className="p-0 dark:bg-gray-800 rounded-xl">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner className="h-8 w-8" style={{ color: getMtkRgba(1) }} />
            </div>
          ) : sortedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-gray-50 dark:bg-gray-700">
                <BellIcon className="h-7 w-7 text-blue-gray-300 dark:text-gray-400" />
              </div>
              <Typography variant="h6" className="mb-2 dark:text-white">
                {t("notifications.emptyTitle") || "Bildiriş yoxdur"}
              </Typography>
              <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                {t("notifications.emptySubtitle") || "Yeni hadisələr baş verdikdə bildirişlər burada görünəcək."}
              </Typography>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr style={{ background: getActiveGradient(0.85, 0.65) }}>
                      <th className="py-3 px-4 text-left w-8">
                        <Typography variant="small" className="text-[11px] font-semibold uppercase text-white/80">#</Typography>
                      </th>
                      <th
                        className="py-3 px-4 text-left cursor-pointer select-none"
                        onClick={() => handleSort("title")}
                      >
                        <div className="flex items-center gap-2">
                          <Typography variant="small" className="text-[11px] font-semibold uppercase text-white/80">
                            Başlıq
                          </Typography>
                          {getSortIcons("title")}
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left">
                        <Typography variant="small" className="text-[11px] font-semibold uppercase text-white/80">Tip</Typography>
                      </th>
                      <th
                        className="py-3 px-4 text-left cursor-pointer select-none"
                        onClick={() => handleSort("date")}
                      >
                        <div className="flex items-center gap-2">
                          <Typography variant="small" className="text-[11px] font-semibold uppercase text-white/80">Tarix</Typography>
                          {getSortIcons("date")}
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left">
                        <Typography variant="small" className="text-[11px] font-semibold uppercase text-white/80">Status</Typography>
                      </th>
                      <th className="py-3 px-4 text-right">
                        <Typography variant="small" className="text-[11px] font-semibold uppercase text-white/80">Əməliyyat</Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedNotifications.map((notif, idx) => (
                      <tr
                        key={notif.id}
                        className={`border-b border-blue-gray-50 dark:border-gray-700 hover:bg-blue-gray-50/40 dark:hover:bg-gray-700/50 transition-colors ${!notif.read ? "bg-blue-50/40 dark:bg-blue-900/10" : ""}`}
                      >
                        <td className="py-3 px-4">
                          <Typography variant="small" className="font-normal text-blue-gray-500 dark:text-gray-400 text-xs">
                            {idx + 1}
                          </Typography>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-2">
                            {!notif.read && (
                              <span className="mt-1.5 h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: getMtkRgba(1) }} />
                            )}
                            <div className="min-w-0">
                              <Typography variant="small" className="font-semibold text-blue-gray-900 dark:text-white leading-tight truncate max-w-xs">
                                {notif.title || "-"}
                              </Typography>
                              <Typography variant="small" className="font-normal text-blue-gray-500 dark:text-gray-400 text-xs truncate max-w-xs mt-0.5">
                                {notif.message || "-"}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Chip
                            value={TYPE_LABELS[notif.type] || notif.type || "Məlumat"}
                            color={TYPE_COLORS[notif.type] || "blue"}
                            size="sm"
                            variant="ghost"
                            className="text-xs w-fit"
                          />
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <Typography variant="small" className="font-normal text-blue-gray-700 dark:text-gray-300 text-xs">
                            {notif.receivedAt ? new Date(notif.receivedAt).toLocaleString("az-AZ") : "-"}
                          </Typography>
                        </td>
                        <td className="py-3 px-4">
                          <Chip
                            value={notif.read ? "Oxunub" : "Yeni"}
                            color={notif.read ? "gray" : "blue"}
                            size="sm"
                            variant={notif.read ? "ghost" : "filled"}
                            className="text-xs w-fit"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <IconButton
                            variant="text"
                            size="sm"
                            style={{ color: getMtkRgba(1) }}
                            onClick={() => handleView(notif)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3 p-3">
                {sortedNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`border rounded-lg p-3 dark:border-gray-700 ${!notif.read ? "border-l-4" : ""}`}
                    style={!notif.read ? { borderLeftColor: getMtkRgba(1) } : {}}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {!notif.read && <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: getMtkRgba(1) }} />}
                          <Typography variant="small" className="font-semibold dark:text-white truncate">
                            {notif.title || "-"}
                          </Typography>
                        </div>
                        <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400 text-xs mb-2">
                          {notif.message || "-"}
                        </Typography>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Chip value={TYPE_LABELS[notif.type] || "Məlumat"} color={TYPE_COLORS[notif.type] || "blue"} size="sm" variant="ghost" className="text-xs" />
                          <Chip value={notif.read ? "Oxunub" : "Yeni"} color={notif.read ? "gray" : "blue"} size="sm" variant={notif.read ? "ghost" : "filled"} className="text-xs" />
                          <Typography variant="small" className="text-blue-gray-400 dark:text-gray-500 text-xs">
                            {notif.receivedAt ? new Date(notif.receivedAt).toLocaleString("az-AZ") : "-"}
                          </Typography>
                        </div>
                      </div>
                      <IconButton variant="text" size="sm" style={{ color: getMtkRgba(1) }} onClick={() => handleView(notif)}>
                        <EyeIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center py-4 border-t border-blue-gray-50 dark:border-gray-700">
                  <Button
                    size="sm"
                    variant="outlined"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 text-xs"
                    style={{ borderColor: getMtkRgba(0.5), color: getMtkRgba(1) }}
                  >
                    {loadingMore && <Spinner className="h-3.5 w-3.5" />}
                    Daha çox yüklə
                  </Button>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      <NotificationsViewModal
        open={viewModalOpen}
        onClose={() => { setViewModalOpen(false); setSelectedNotification(null); }}
        notification={selectedNotification}
      />
    </div>
  );
}

export default Notifications;

