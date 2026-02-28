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

const colorClasses = {
  blue: { bg: "bg-blue-100 dark:bg-blue-900/30", icon: "text-blue-600 dark:text-blue-300" },
  green: { bg: "bg-green-100 dark:bg-green-900/30", icon: "text-green-600 dark:text-green-300" },
  red: { bg: "bg-red-100 dark:bg-red-900/30", icon: "text-red-600 dark:text-red-300" },
  yellow: { bg: "bg-yellow-100 dark:bg-yellow-900/30", icon: "text-yellow-600 dark:text-yellow-300" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/30", icon: "text-purple-600 dark:text-purple-300" },
  indigo: { bg: "bg-indigo-100 dark:bg-indigo-900/30", icon: "text-indigo-600 dark:text-indigo-300" },
};


const ResidentHomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await residentHomeAPI.getInfo();
      setInfo(response?.data || response || null);
    } catch (err) {
      setError(err?.message || t("resident.home.infoLoadError") || "Məlumatlar yüklənərkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };


  const statCards = [
    {
      title: t("resident.home.myProperties") || "Mənim Mənzillərim",
      value: info?.properties?.length || 0,
      icon: HomeIcon,
      color: "blue",
      onClick: () => navigate("/resident/my-properties"),
    },
    {
      title: t("resident.home.invoices") || "Fakturalar",
      value: info?.invoices?.length || 0,
      icon: DocumentTextIcon,
      color: "green",
      onClick: () => navigate("/resident/invoices"),
    },
    {
      title: t("resident.home.unpaidInvoices") || "Ödənilməmiş Fakturalar",
      value: info?.unpaid_invoices || 0,
      icon: CurrencyDollarIcon,
      color: "red",
      onClick: () => navigate("/resident/invoices?status=unpaid"),
    },
    {
      title: t("resident.home.notifications") || "Bildirişlər",
      value: info?.notifications || 0,
      icon: BellIcon,
      color: "yellow",
      onClick: () => navigate("/resident/notifications"),
    },
    {
      title: t("resident.home.tickets") || "Müraciətlər",
      value: info?.tickets || 0,
      icon: QuestionMarkCircleIcon,
      color: "purple",
      onClick: () => navigate("/resident/tickets"),
    },
    {
      title: t("resident.home.documents") || "Elektron Sənədlər",
      value: info?.documents || 0,
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
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]?.bg || colorClasses.blue.bg}`}>
                    <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${colorClasses[stat.color]?.icon || colorClasses.blue.icon}`} />
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {error && (
        <Card className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 shadow-sm">
          <CardBody className="py-3 px-4">
            <Typography variant="small" className="text-red-700 dark:text-red-300">
              {error}
            </Typography>
          </CardBody>
        </Card>
      )}

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
                  <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 mb-2 ${colorClasses[stat.color]?.icon || colorClasses.blue.icon}`} />
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
