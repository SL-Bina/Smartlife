import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Chip,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/store/exports";
import {
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export function ResidentDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalInvoices: 0,
    unpaidInvoices: 0,
    totalApplications: 0,
    pendingApplications: 0,
    unreadNotifications: 0,
    totalDebt: 0,
  });

  useEffect(() => {
    setStats({
      totalInvoices: 12,
      unpaidInvoices: 3,
      totalApplications: 8,
      pendingApplications: 2,
      unreadNotifications: 5,
      totalDebt: 450.50,
    });
  }, []);

  const statCards = [
    {
      title: t("residentDashboard.totalInvoices"),
      value: stats.totalInvoices,
      icon: DocumentTextIcon,
      color: "blue",
      onClick: () => navigate("/dashboard/resident/invoices"),
    },
    {
      title: t("residentDashboard.unpaidInvoices"),
      value: stats.unpaidInvoices,
      icon: CurrencyDollarIcon,
      color: "red",
      onClick: () => navigate("/dashboard/resident/invoices"),
    },
    {
      title: t("residentDashboard.totalApplications"),
      value: stats.totalApplications,
      icon: QuestionMarkCircleIcon,
      color: "green",
      onClick: () => navigate("/dashboard/resident/applications"),
    },
    {
      title: t("residentDashboard.pendingApplications"),
      value: stats.pendingApplications,
      icon: QuestionMarkCircleIcon,
      color: "orange",
      onClick: () => navigate("/dashboard/resident/applications"),
    },
    {
      title: t("residentDashboard.unreadNotifications"),
      value: stats.unreadNotifications,
      icon: BellIcon,
      color: "purple",
      onClick: () => navigate("/dashboard/resident/notifications"),
    },
    {
      title: t("residentDashboard.totalDebt"),
      value: `${stats.totalDebt} AZN`,
      icon: CurrencyDollarIcon,
      color: "red",
      onClick: () => navigate("/dashboard/resident/invoices"),
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Section title bar */}
      <div className="w-full bg-black dark:bg-gray-800 my-2 sm:my-3 lg:my-4 p-3 sm:p-4 rounded-lg shadow-lg mb-3 sm:mb-4 lg:mb-5 border border-red-600 dark:border-gray-700 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Typography variant="h5" className="text-white font-bold text-lg sm:text-xl">
              {t("residentDashboard.pageTitle")}
            </Typography>
            <Typography variant="small" className="text-white/90 dark:text-white/90 mt-1 text-xs sm:text-sm font-medium">
              {t("residentDashboard.welcome")}, {user?.fullName || "Sakin"}
            </Typography>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className="border border-red-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 cursor-pointer hover:shadow-xl transition-shadow"
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
                <div className={`bg-${stat.color}-100 dark:bg-${stat.color}-900/30 p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 text-${stat.color}-600 dark:text-${stat.color}-300`} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border border-red-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 mt-4 sm:mt-6">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 p-3 sm:p-4 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
        >
          <Typography variant="h6" color="blue-gray" className="font-bold dark:text-white text-base sm:text-lg">
            {t("residentDashboard.quickActions")}
          </Typography>
        </CardHeader>
        <CardBody className="p-4 sm:p-6 dark:bg-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <Button
              variant="outlined"
              color="blue"
              className="flex items-center justify-center gap-2 dark:text-blue-300 dark:border-blue-600"
              onClick={() => navigate("/dashboard/resident/invoices")}
            >
              <DocumentTextIcon className="h-5 w-5" />
              {t("residentDashboard.viewInvoices")}
            </Button>
            <Button
              variant="outlined"
              color="green"
              className="flex items-center justify-center gap-2 dark:text-green-300 dark:border-green-600"
              onClick={() => navigate("/dashboard/resident/applications")}
            >
              <QuestionMarkCircleIcon className="h-5 w-5" />
              {t("residentDashboard.viewApplications")}
            </Button>
            <Button
              variant="outlined"
              color="purple"
              className="flex items-center justify-center gap-2 dark:text-purple-300 dark:border-purple-600"
              onClick={() => navigate("/dashboard/resident/notifications")}
            >
              <BellIcon className="h-5 w-5" />
              {t("residentDashboard.viewNotifications")}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default ResidentDashboard;

