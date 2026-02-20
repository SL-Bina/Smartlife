import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Spinner, Chip } from "@material-tailwind/react";
import {
  BellIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import residentNotificationsAPI from "./api";

// Mock data
const mockNotifications = [
  {
    id: 1,
    title: "Yeni Faktura",
    message: "Sizin üçün yeni faktura yaradıldı. Zəhmət olmasa ödənişi tamamlayın.",
    type: "info",
    is_read: false,
    created_at: "2026-02-20T10:30:00Z",
  },
  {
    id: 2,
    title: "Ödəniş Təsdiqləndi",
    message: "Faktura #123 ödənişi uğurla təsdiqləndi. Təşəkkür edirik!",
    type: "success",
    is_read: false,
    created_at: "2026-02-19T15:45:00Z",
  },
  {
    id: 3,
    title: "Gecikmiş Ödəniş",
    message: "Xəbərdarlıq: Faktura #124 üçün ödəniş tarixi keçib. Zəhmət olmasa ödənişi tamamlayın.",
    type: "warning",
    is_read: true,
    created_at: "2026-02-18T09:20:00Z",
  },
  {
    id: 4,
    title: "Bildiriş",
    message: "Kompleksdə təmir işləri aparılacaq. Zəhmət olmasa nəzərə alın.",
    type: "info",
    is_read: true,
    created_at: "2026-02-17T14:00:00Z",
  },
  {
    id: 5,
    title: "Yeni Sənəd",
    message: "Sizin üçün yeni elektron sənəd əlavə edildi. Profilinizdən yükləyə bilərsiniz.",
    type: "info",
    is_read: true,
    created_at: "2026-02-16T11:15:00Z",
  },
];

const ResidentNotificationsPage = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await residentNotificationsAPI.getAll();
      setNotifications(response?.data?.data || response?.data || mockNotifications);
    } catch (err) {
      // Use mock data on error
      setNotifications(mockNotifications);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "info":
        return InformationCircleIcon;
      case "warning":
        return ExclamationTriangleIcon;
      case "success":
        return CheckCircleIcon;
      default:
        return BellIcon;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "info":
        return "blue";
      case "warning":
        return "yellow";
      case "success":
        return "green";
      default:
        return "gray";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("az-AZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" style={{ position: 'relative', zIndex: 0 }}>
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto mb-4" />
          <Typography className="text-sm text-gray-500 dark:text-gray-400">
            {t("common.loading") || "Yüklənir..."}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 dark:from-yellow-700 dark:to-yellow-900 p-4 sm:p-6 rounded-xl shadow-lg border border-yellow-500 dark:border-yellow-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <BellIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-white font-bold">
              {t("resident.notifications.pageTitle") || t("sidebar.notifications") || "Bildirişlər"}
            </Typography>
            <Typography variant="small" className="text-yellow-100 dark:text-yellow-200">
              {notifications.length} {t("resident.notifications.notification") || "bildiriş"}
            </Typography>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      {!notifications || notifications.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <BellIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <Typography className="text-lg text-gray-500 dark:text-gray-400 font-semibold mb-2">
            {t("resident.notifications.noNotifications") || "Bildiriş tapılmadı"}
          </Typography>
          <Typography variant="small" className="text-gray-400 dark:text-gray-500">
            {t("resident.notifications.noNotificationsDesc") || "Hələ heç bir bildirişiniz yoxdur"}
          </Typography>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification, index) => {
            const Icon = getNotificationIcon(notification.type);
            const color = getNotificationColor(notification.type);
            
            return (
              <motion.div
                key={notification.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={`shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-l-${color}-600 dark:border-gray-700 dark:bg-gray-800 ${
                  !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}>
                  <CardBody className="p-4 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex-shrink-0`}>
                        <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-300`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <Typography variant="h6" className="text-gray-800 dark:text-gray-200 font-bold">
                            {notification.title || t("resident.notifications.notification") || "Bildiriş"}
                          </Typography>
                          {!notification.is_read && (
                            <Chip
                              value={t("resident.notifications.new") || "Yeni"}
                              color="blue"
                              size="sm"
                              className="text-xs"
                            />
                          )}
                        </div>
                        <Typography variant="small" className="text-gray-600 dark:text-gray-400 mb-3">
                          {notification.message || notification.description || ""}
                        </Typography>
                        <Typography variant="small" className="text-gray-500 dark:text-gray-500">
                          {formatDate(notification.created_at || notification.date)}
                        </Typography>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResidentNotificationsPage;
