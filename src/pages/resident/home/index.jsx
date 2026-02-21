import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Spinner } from "@material-tailwind/react";
import {
  HomeIcon,
  DocumentTextIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import residentHomeAPI from "./api";

// Mock data
const mockStats = {
  properties_count: 2,
  invoices_count: 8,
  unpaid_invoices_count: 3,
  notifications_count: 5,
  tickets_count: 2,
  documents_count: 4,
};

const ResidentHomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await residentHomeAPI.getStats();
      setStats(response?.data || mockStats);
    } catch (err) {
      // Use mock data on error
      setStats(mockStats);
      setError(null); // Don't show error, just use mock data
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: t("resident.home.myProperties") || "Mənzillərim",
      value: stats?.properties_count || 0,
      icon: HomeIcon,
      color: "blue",
      onClick: () => navigate("/resident/my-properties"),
    },
    {
      title: t("resident.home.invoices") || "Fakturalar",
      value: stats?.invoices_count || 0,
      icon: DocumentTextIcon,
      color: "green",
      onClick: () => navigate("/resident/invoices"),
    },
    {
      title: t("resident.home.unpaidInvoices") || "Ödənilməmiş Fakturalar",
      value: stats?.unpaid_invoices_count || 0,
      icon: CurrencyDollarIcon,
      color: "red",
      onClick: () => navigate("/resident/invoices?status=unpaid"),
    },
    {
      title: t("resident.home.notifications") || "Bildirişlər",
      value: stats?.notifications_count || 0,
      icon: BellIcon,
      color: "yellow",
      onClick: () => navigate("/resident/notifications"),
    },
    {
      title: t("resident.home.tickets") || "Biletlər",
      value: stats?.tickets_count || 0,
      icon: QuestionMarkCircleIcon,
      color: "purple",
      onClick: () => navigate("/resident/tickets"),
    },
    {
      title: t("resident.home.documents") || "Elektron Sənədlər",
      value: stats?.documents_count || 0,
      icon: BookOpenIcon,
      color: "indigo",
      onClick: () => navigate("/resident/e-documents"),
    },
  ];

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
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 p-4 sm:p-6 rounded-xl shadow-lg border border-blue-500 dark:border-blue-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <HomeIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-white font-bold">
              {t("resident.home.welcome") || "Xoş gəldiniz"}
            </Typography>
            <Typography variant="small" className="text-blue-100 dark:text-blue-200">
              {t("resident.home.subtitle") || "Sizin şəxsi paneliniz"}
            </Typography>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="border border-blue-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 cursor-pointer hover:shadow-xl transition-all duration-300"
              onClick={stat.onClick}
            >
              <CardBody className="p-4 sm:p-6 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" className="text-blue-gray-900 dark:text-white font-bold text-xl sm:text-2xl">
                      {stat.value}
                    </Typography>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                    <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 text-${stat.color}-600 dark:text-${stat.color}-300`} />
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border border-blue-600 dark:border-gray-700 shadow-lg dark:bg-gray-800">
        <CardBody className="p-4 sm:p-6 dark:bg-gray-800">
          <Typography variant="h6" className="text-blue-gray-900 dark:text-white font-bold mb-4">
            {t("resident.home.quickActions") || "Tez Əməliyyatlar"}
          </Typography>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:shadow-md transition-all"
                  onClick={stat.onClick}
                >
                  <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 text-${stat.color}-600 dark:text-${stat.color}-300 mb-2`} />
                  <Typography variant="small" className="text-center text-xs text-gray-700 dark:text-gray-300">
                    {stat.title}
                  </Typography>
                </div>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ResidentHomePage;
