import {
  BanknotesIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  UsersIcon,
  CheckCircleIcon,
  CreditCardIcon,
  UserMinusIcon,
  BuildingOfficeIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";

export const getPaymentStatistics = (t) => [
  {
    titleKey: "dashboard.paymentStats.currentMonthPayments",
    subtitleKey: "dashboard.paymentStats.paidServicesCount",
    value: "4",
    icon: BanknotesIcon,
  },
  {
    titleKey: "dashboard.paymentStats.paidInvoicesCount",
    value: "12",
    icon: DocumentTextIcon,
  },
  {
    titleKey: "dashboard.paymentStats.totalIncome",
    value: "1018.00 AZN",
    icon: CurrencyDollarIcon,
  },
];

export const getPaymentDynamicsData = (t) => ({
  months: ["Yan", "Fev", "Mar", "Apr", "May", "İyn", "İyl", "Avq", "Sen", "Okt", "Noy", "Dek"], // Months will be translated in component
  series: [
    {
      nameKey: "dashboard.paymentTypes.cash",
      data: [200, 300, 400, 500, 600, 700, 800, 900, 1000, 1400, 1200, 1100],
      color: "#3B82F6",
    },
    {
      nameKey: "dashboard.paymentTypes.online",
      data: [100, 150, 200, 250, 300, 350, 400, 450, 500, 500, 450, 400],
      color: "#8B5CF6",
    },
    {
      nameKey: "dashboard.paymentTypes.terminal",
      data: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160],
      color: "#10B981",
    },
    {
      nameKey: "dashboard.paymentTypes.posTerminal",
      data: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140],
      color: "#F59E0B",
    },
  ],
});

export const getEmployeePerformanceData = (t) => ({
  employees: [
    "Hesen_8 hese... (Mühafizə)",
    "Qiyas Hesenl... (Mühafizə)",
    "xish Abbas... (Texniki şöbə)",
    "Emil Bedelov (Təmizlik)",
  ],
  series: [
    {
      nameKey: "dashboard.employeeMetrics.assignedRequests",
      data: [45, 52, 38, 42],
      color: "#3B82F6",
    },
    {
      nameKey: "dashboard.employeeMetrics.completedRequests",
      data: [30, 35, 25, 28],
      color: "#8B5CF6",
    },
    {
      nameKey: "dashboard.employeeMetrics.cancelledRequests",
      data: [5, 7, 3, 4],
      color: "#10B981",
    },
    {
      nameKey: "dashboard.employeeMetrics.avgResolutionTime",
      data: [12, 10, 15, 11],
      color: "#F59E0B",
    },
    {
      nameKey: "dashboard.employeeMetrics.successRate",
      data: [66, 67, 65, 66],
      color: "#EC4899",
    },
    {
      nameKey: "dashboard.employeeMetrics.cancellationRate",
      data: [11, 13, 8, 10],
      color: "#06B6D4",
    },
    {
      nameKey: "dashboard.employeeMetrics.totalRate",
      data: [77, 80, 73, 76],
      color: "#84CC16",
    },
  ],
});

export const getApplicationStatusData = (t) => [
  { nameKey: "dashboard.applicationStatus.pending", value: 172, percentage: 55.0, color: "#F59E0B" },
  { nameKey: "dashboard.applicationStatus.completed", value: 67, percentage: 21.4, color: "#10B981" },
  { nameKey: "dashboard.applicationStatus.accepted", value: 41, percentage: 13.1, color: "#84CC16" },
  { nameKey: "dashboard.applicationStatus.inProgress", value: 27, percentage: 8.6, color: "#3B82F6" },
  { nameKey: "dashboard.applicationStatus.cancelled", value: 6, percentage: 1.9, color: "#EF4444" },
];

export const getDepartmentStats = (t) => [
  {
    nameKey: "dashboard.charts.technicalDepartment",
    total: 122,
    completed: 17,
    successRate: 13.9,
  },
  {
    nameKey: "dashboard.charts.security",
    total: 76,
    completed: 26,
    successRate: 34.2,
  },
  {
    nameKey: "dashboard.charts.cleaning",
    total: 23,
    completed: 11,
    successRate: 47.8,
  },
  {
    nameKey: "dashboard.charts.reception",
    total: 16,
    completed: 1,
    successRate: 6.3,
  },
  {
    nameKey: "dashboard.charts.buildingManagement",
    total: 5,
    completed: 1,
    successRate: 20.0,
  },
];

export const getResidentStats = (t) => [
  {
    titleKey: "dashboard.residentStats.totalResidents",
    value: "79",
    icon: UsersIcon,
  },
  {
    titleKey: "dashboard.residentStats.activeResidents",
    value: "23",
    icon: CheckCircleIcon,
  },
  {
    titleKey: "dashboard.residentStats.onlinePayingResidents",
    value: "1",
    icon: CreditCardIcon,
  },
  {
    titleKey: "dashboard.residentStats.passiveResidents",
    value: "56",
    icon: UserMinusIcon,
  },
  {
    titleKey: "dashboard.residentStats.buildings",
    value: "3",
    icon: BuildingOfficeIcon,
  },
  {
    titleKey: "dashboard.residentStats.apartments",
    value: "87",
    icon: HomeIcon,
  },
];

