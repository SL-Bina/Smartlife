import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Spinner,
  Chip,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import {
  BuildingOfficeIcon,
  UsersIcon,
  HomeModernIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";
import { StatisticsCard } from "@/widgets/cards";

const mockComplexData = {
  totalComplexes: 5,
  totalBuildings: 25,
  totalApartments: 450,
  totalResidents: 1200,
  totalIncome: 125000,
  totalExpenses: 85000,
  pendingApplications: 15,
  completedApplications: 120,
};

const mockRecentActivities = [
  {
    id: 1,
    type: "payment",
    description: "Mənzil 101 üçün ödəniş qeydə alındı",
    amount: "150.00 AZN",
    date: "2025-01-15 10:30",
    status: "completed",
  },
  {
    id: 2,
    type: "application",
    description: "Yeni müraciət yaradıldı - Təmizlik",
    apartment: "Mənzil 205",
    date: "2025-01-15 09:15",
    status: "pending",
  },
  {
    id: 3,
    type: "notification",
    description: "Yeni bildiriş göndərildi",
    target: "Bina 1, Blok A",
    date: "2025-01-15 08:00",
    status: "sent",
  },
  {
    id: 4,
    type: "resident",
    description: "Yeni sakin qeydiyyata alındı",
    name: "Məmməd Məmmədov",
    apartment: "Mənzil 312",
    date: "2025-01-14 16:45",
    status: "completed",
  },
  {
    id: 5,
    type: "expense",
    description: "Xərc qeydə alındı - Təmizlik",
    amount: "250.00 AZN",
    date: "2025-01-14 14:20",
    status: "completed",
  },
];

const ComplexDashboardPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const statisticsCards = [
    {
      color: "blue",
      icon: BuildingOfficeIcon,
      title: t("complexDashboard.statistics.totalComplexes"),
      value: mockComplexData.totalComplexes.toString(),
      footer: {
        color: "text-green-500",
        value: "+2",
        label: t("complexDashboard.statistics.thisMonth"),
      },
    },
    {
      color: "orange",
      icon: BuildingOfficeIcon,
      title: t("complexDashboard.statistics.totalBuildings"),
      value: mockComplexData.totalBuildings.toString(),
      footer: {
        color: "text-blue-500",
        value: "+5",
        label: t("complexDashboard.statistics.thisMonth"),
      },
    },
    {
      color: "green",
      icon: HomeModernIcon,
      title: t("complexDashboard.statistics.totalApartments"),
      value: mockComplexData.totalApartments.toString(),
      footer: {
        color: "text-green-500",
        value: "+12",
        label: t("complexDashboard.statistics.thisMonth"),
      },
    },
    {
      color: "purple",
      icon: UsersIcon,
      title: t("complexDashboard.statistics.totalResidents"),
      value: mockComplexData.totalResidents.toString(),
      footer: {
        color: "text-green-500",
        value: "+25",
        label: t("complexDashboard.statistics.thisMonth"),
      },
    },
    {
      color: "green",
      icon: CurrencyDollarIcon,
      title: t("complexDashboard.statistics.totalIncome"),
      value: `${mockComplexData.totalIncome.toLocaleString()} AZN`,
      footer: {
        color: "text-green-500",
        value: "+15%",
        label: t("complexDashboard.statistics.vsLastMonth"),
      },
    },
    {
      color: "red",
      icon: CurrencyDollarIcon,
      title: t("complexDashboard.statistics.totalExpenses"),
      value: `${mockComplexData.totalExpenses.toLocaleString()} AZN`,
      footer: {
        color: "text-red-500",
        value: "+8%",
        label: t("complexDashboard.statistics.vsLastMonth"),
      },
    },
    {
      color: "yellow",
      icon: ExclamationTriangleIcon,
      title: t("complexDashboard.statistics.pendingApplications"),
      value: mockComplexData.pendingApplications.toString(),
      footer: {
        color: "text-yellow-500",
        value: "-3",
        label: t("complexDashboard.statistics.thisWeek"),
      },
    },
    {
      color: "blue",
      icon: ChartBarIcon,
      title: t("complexDashboard.statistics.completedApplications"),
      value: mockComplexData.completedApplications.toString(),
      footer: {
        color: "text-green-500",
        value: "+18",
        label: t("complexDashboard.statistics.thisWeek"),
      },
    },
  ];

  const getActivityTypeColor = (type) => {
    switch (type) {
      case "payment":
        return "green";
      case "application":
        return "blue";
      case "notification":
        return "purple";
      case "resident":
        return "orange";
      case "expense":
        return "red";
      default:
        return "gray";
    }
  };

  const getActivityTypeLabel = (type) => {
    switch (type) {
      case "payment":
        return t("complexDashboard.activityTypes.payment");
      case "application":
        return t("complexDashboard.activityTypes.application");
      case "notification":
        return t("complexDashboard.activityTypes.notification");
      case "resident":
        return t("complexDashboard.activityTypes.resident");
      case "expense":
        return t("complexDashboard.activityTypes.expense");
      default:
        return type;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "green";
      case "pending":
        return "yellow";
      case "sent":
        return "blue";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return t("complexDashboard.status.completed");
      case "pending":
        return t("complexDashboard.status.pending");
      case "sent":
        return t("complexDashboard.status.sent");
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8">
      {/* Statistics Cards */}
      <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statisticsCards.map(({ icon: Icon, footer, ...stat }) => (
          <StatisticsCard
            key={stat.title}
            {...stat}
            icon={<Icon className="h-6 w-6" />}
            footer={
              footer && (
                <Typography
                  variant="small"
                  className={`flex items-center gap-1 font-normal ${footer.color}`}
                >
                  <span>{footer.value}</span>
                  <span className="text-blue-gray-600 dark:text-gray-400">{footer.label}</span>
                </Typography>
              )
            }
          />
        ))}
      </div>

      {/* Summary Card */}
      <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black mb-6">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 p-6 dark:bg-black"
        >
          <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-white">
            {t("complexDashboard.summary.title")}
          </Typography>
          <Typography
            variant="small"
            className="font-normal text-blue-gray-500 dark:text-gray-400"
          >
            {t("complexDashboard.summary.subtitle")}
          </Typography>
        </CardHeader>
        <CardBody className="px-6 pb-6 dark:bg-black">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                {t("complexDashboard.summary.netProfit")}
              </Typography>
              <Typography variant="h5" className="text-blue-600 dark:text-blue-400 font-bold">
                {(mockComplexData.totalIncome - mockComplexData.totalExpenses).toLocaleString()} AZN
              </Typography>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                {t("complexDashboard.summary.occupancyRate")}
              </Typography>
              <Typography variant="h5" className="text-green-600 dark:text-green-400 font-bold">
                {Math.round((mockComplexData.totalResidents / (mockComplexData.totalApartments * 2.5)) * 100)}%
              </Typography>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                {t("complexDashboard.summary.averageIncome")}
              </Typography>
              <Typography variant="h5" className="text-purple-600 dark:text-purple-400 font-bold">
                {Math.round(mockComplexData.totalIncome / mockComplexData.totalComplexes).toLocaleString()} AZN
              </Typography>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                {t("complexDashboard.summary.applicationCompletion")}
              </Typography>
              <Typography variant="h5" className="text-orange-600 dark:text-orange-400 font-bold">
                {Math.round((mockComplexData.completedApplications / (mockComplexData.completedApplications + mockComplexData.pendingApplications)) * 100)}%
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Recent Activities Table */}
      <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 p-6 dark:bg-black"
        >
          <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-white">
            {t("complexDashboard.recentActivities.title")}
          </Typography>
          <Typography
            variant="small"
            className="font-normal text-blue-gray-500 dark:text-gray-400"
          >
            {t("complexDashboard.recentActivities.subtitle")}
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pb-2 dark:bg-black">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("complexDashboard.recentActivities.table.type")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("complexDashboard.recentActivities.table.description")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("complexDashboard.recentActivities.table.amount")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("complexDashboard.recentActivities.table.status")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("complexDashboard.recentActivities.table.date")}
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockRecentActivities.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-black"
                        : "bg-gray-50 dark:bg-black/50"
                    } hover:bg-blue-gray-50 dark:hover:bg-gray-800/70 transition-colors`}
                  >
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Chip
                        value={getActivityTypeLabel(row.type)}
                        color={getActivityTypeColor(row.type)}
                        className="dark:bg-blue-600 dark:text-white"
                      />
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.description}
                        {row.apartment && ` - ${row.apartment}`}
                        {row.name && ` - ${row.name}`}
                        {row.target && ` - ${row.target}`}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.amount || "-"}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Chip
                        value={getStatusLabel(row.status)}
                        color={getStatusColor(row.status)}
                        className="dark:bg-green-600 dark:text-white"
                      />
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.date}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ComplexDashboardPage;
