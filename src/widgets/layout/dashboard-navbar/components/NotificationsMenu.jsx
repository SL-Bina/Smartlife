import React, { useEffect, useCallback } from "react";
import { IconButton, Menu, MenuHandler, MenuList, MenuItem, Typography, Chip } from "@material-tailwind/react";
import { BellIcon, ClockIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { useAuth } from "@/store/hooks/useAuth";
import {
  selectNotifications,
  selectUnreadCount,
  mergeApiNotifications,
  markRead,
  normalizeApiNotification,
} from "@/store/slices/notificationsSlice";
import { notificationsAPI } from "@/pages/dashboard/notifications/api";

const MAX_VISIBLE = 5;

const TYPE_COLORS = {
  info: "blue",
  success: "green",
  warning: "amber",
  error: "red",
  danger: "red",
};

export function NotificationsMenu({ isMobile = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { getRgba: getMtkRgba } = useMtkColor();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);

  const isResident = user?.is_resident === true;
  const notificationsPath = isResident ? "/resident/notifications" : "/dashboard/notifications";

  const fetchInitial = useCallback(async () => {
    try {
      const res = await notificationsAPI.getMyNotifications(1);
      const paginatedData = res.data?.data;
      const rawItems = paginatedData?.data ?? [];
      const items = rawItems.map(normalizeApiNotification);
      dispatch(mergeApiNotifications({
        items,
        page: paginatedData?.current_page ?? 1,
        lastPage: paginatedData?.last_page ?? 1,
      }));
    } catch {
    }
  }, [dispatch]);

  useEffect(() => {
    if (notifications.length === 0) {
      fetchInitial();
    }
  }, [fetchInitial, notifications.length]);

  const handleItemClick = async (notif) => {
    if (!notif.read) {
      try {
        await notificationsAPI.markRead(notif.id);
        dispatch(markRead(notif.id));
      } catch { /* ignore */ }
    }
    navigate(notificationsPath);
  };

  const handleSeeAll = () => {
    navigate(notificationsPath);
  };

  const visibleNotifications = notifications.slice(0, MAX_VISIBLE);

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "İndicə";
    if (mins < 60) return `${mins} dəq əvvəl`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} saat əvvəl`;
    const days = Math.floor(hours / 24);
    return `${days} gün əvvəl`;
  };

  const buttonClass = isMobile
    ? "dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all p-2 relative"
    : "dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 relative rounded-xl transition-all p-1";

  const menuWidth = isMobile
    ? "w-[calc(100vw-1.5rem)] max-w-[360px]"
    : "w-80 lg:w-96";

  return (
    <Menu placement={isMobile ? "bottom-end" : "bottom-end"}>
      <MenuHandler>
        <IconButton
          variant="text"
          color="blue-gray"
          className={buttonClass}
          size="md"
        >
          <BellIcon className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-gray-700 dark:text-gray-300`} />
          {unreadCount > 0 && (
            <span
              className="absolute flex items-center justify-center rounded-full text-white font-bold leading-none border-2 border-white dark:border-gray-800"
              style={{
                backgroundColor: getMtkRgba(1),
                top: isMobile ? '1px' : '-6px',
                right: isMobile ? '1px' : '-8px',
                height: isMobile ? '16px' : '18px',
                minWidth: isMobile ? '16px' : '18px',
                fontSize: isMobile ? '9px' : '10px',
                padding: '0 5px',
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </IconButton>
      </MenuHandler>
      <MenuList className={`${menuWidth} dark:bg-gray-800 dark:border-gray-700 max-h-[440px] overflow-y-auto rounded-xl shadow-2xl p-0`}>
        <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
          <Typography variant="h6" className={`text-gray-900 dark:text-white font-bold ${isMobile ? "text-sm" : "text-base"}`}>
            {t("header.notifications") || "Bildirişlər"}
          </Typography>
          {unreadCount > 0 && (
            <Chip
              value={`${unreadCount} yeni`}
              size="sm"
              className="text-[10px] font-bold px-2 py-0.5 text-white"
              style={{ backgroundColor: getMtkRgba(1) }}
            />
          )}
        </div>

        {visibleNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <BellIcon className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
            <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
              {t("notifications.emptyTitle") || "Bildiriş yoxdur"}
            </Typography>
          </div>
        ) : (
          <div className="py-1">
            {visibleNotifications.map((notif) => (
              <MenuItem
                key={notif.id}
                className={`flex items-start gap-3 px-4 py-3 dark:hover:bg-gray-700/50 hover:bg-gray-100/50 rounded-none border-b border-gray-100 dark:border-gray-700/30 last:border-0 ${
                  !notif.read ? "bg-blue-50/40 dark:bg-blue-900/10" : ""
                }`}
                onClick={() => handleItemClick(notif)}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {!notif.read && (
                    <span
                      className="block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: getMtkRgba(1) }}
                    />
                  )}
                  {notif.read && (
                    <span className="block h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Typography
                      variant="small"
                      className={`font-semibold text-gray-900 dark:text-white truncate ${
                        isMobile ? "text-xs" : "text-sm"
                      } ${!notif.read ? "font-bold" : ""}`}
                    >
                      {notif.title || "-"}
                    </Typography>
                    <Chip
                      value={notif.type || "info"}
                      color={TYPE_COLORS[notif.type] || "blue"}
                      size="sm"
                      variant="ghost"
                      className="text-[9px] px-1.5 py-0 flex-shrink-0"
                    />
                  </div>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs truncate">
                    {notif.message || "-"}
                  </Typography>
                  <Typography variant="small" className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                    <ClockIcon className="h-3 w-3" />
                    {formatTimeAgo(notif.receivedAt)}
                  </Typography>
                </div>
              </MenuItem>
            ))}
          </div>
        )}

        <div
          className="px-4 py-2.5 border-t border-gray-200/50 dark:border-gray-700/50 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
          onClick={handleSeeAll}
        >
          <Typography
            variant="small"
            className="text-center font-semibold text-xs"
            style={{ color: getMtkRgba(1) }}
          >
            {t("notifications.seeAll") || "Hamısını gör"}
          </Typography>
        </div>
      </MenuList>
    </Menu>
  );
}
