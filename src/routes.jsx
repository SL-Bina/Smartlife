import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  ServerStackIcon,
  RectangleStackIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  HomeModernIcon,
  UsersIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  BellIcon,
  PresentationChartLineIcon,
  QuestionMarkCircleIcon,
  ArrowDownCircleIcon,
  ArrowsRightLeftIcon,
  ShieldCheckIcon,
  InboxIcon,
  CogIcon,
  BookOpenIcon,
  CpuChipIcon,
} from "@heroicons/react/24/solid";
import { lazy } from "react";

// --- Lazy page imports (code splitting — yalnız lazım olanda yüklənir) ---
// Dashboard pages
const Home = lazy(() => import("@/pages/dashboard/home"));
const Notifications = lazy(() => import("@/pages/dashboard/notifications"));
const KPI = lazy(() => import("@/pages/dashboard/kpi"));
const ApplicationsListPage = lazy(() => import("@/pages/dashboard/applications/list"));
const ApplicationsEvaluationPage = lazy(() => import("@/pages/dashboard/applications/evaluation"));
const ComplexDashboardPage = lazy(() => import("@/pages/dashboard/complex-dashboard"));
const SendNotificationPage = lazy(() => import("@/pages/dashboard/notifications/send"));
const NotificationArchivePage = lazy(() => import("@/pages/dashboard/notifications/archive"));
const SentSMSPage = lazy(() => import("@/pages/dashboard/notifications/sent-sms"));
const CreateQueryPage = lazy(() => import("@/pages/dashboard/queries/create"));
const QueriesListPage = lazy(() => import("@/pages/dashboard/queries/list"));
const ReceptionPage = lazy(() => import("@/pages/dashboard/reception"));
const ServicesPage = lazy(() => import("@/pages/dashboard/services"));
const ElectronicDocumentsPage = lazy(() => import("@/pages/dashboard/e-documents"));
const SignIn = lazy(() => import("@/pages/auth/sign-in"));
const Profile = lazy(() => import("@/pages/dashboard/profile"));
const Settings = lazy(() => import("@/pages/dashboard/settings"));
// Management pages
const MtkPage = lazy(() => import("@/pages/dashboard/management/mtk"));
const ComplexesPage = lazy(() => import("@/pages/dashboard/management/complexes"));
const BuildingsPage = lazy(() => import("@/pages/dashboard/management/buildings"));
const BlocksPage = lazy(() => import("@/pages/dashboard/management/blocks"));
const PropertiesPage = lazy(() => import("@/pages/dashboard/management/properties"));
const ResidentsPage = lazy(() => import("@/pages/dashboard/management/residents"));
// Finance pages
const InvoicesPage = lazy(() => import("@/pages/dashboard/finance/invoices"));
const PaymentHistoryPage = lazy(() => import("@/pages/dashboard/finance/payment-history"));
const ReportsPage = lazy(() => import("@/pages/dashboard/finance/reports"));
const DebtorApartmentsPage = lazy(() => import("@/pages/dashboard/finance/debtor-apartments"));
const ExpensesPage = lazy(() => import("@/pages/dashboard/finance/expenses"));
const DepositPage = lazy(() => import("@/pages/dashboard/finance/deposit"));
const TransfersPage = lazy(() => import("@/pages/dashboard/finance/transfers"));
const DebtPage = lazy(() => import("@/pages/dashboard/finance/debt"));
// Other pages
const PermissionsPage = lazy(() => import("@/pages/dashboard/permissions"));
const DevicesPage = lazy(() => import("@/pages/dashboard/devices"));
const ParkingPage = lazy(() => import("@/pages/dashboard/parking"));
const UserAddPage = lazy(() => import("@/pages/dashboard/users/add"));
// Resident pages
const ResidentHomePage = lazy(() => import("@/pages/resident/home"));
const ResidentNotificationsPage = lazy(() => import("@/pages/resident/notifications"));
const ResidentEDocumentsPage = lazy(() => import("@/pages/resident/e-documents"));
const ResidentTicketsPage = lazy(() => import("@/pages/resident/tickets"));
const ResidentMyInvaoicesPage = lazy(() => import("@/pages/resident/myinvoices"));
const ResidentProfilePage = lazy(() => import("@/pages/resident/profile"));
const ResidentMyPropertiesPage = lazy(() => import("@/pages/resident/myproperties"));
const ResidentMyServicesPage = lazy(() => import("@/pages/resident/myservices"));
const ResidentComplexDashboardPage = lazy(() => import("@/pages/resident/complexdashboard"));
const ResidentPaymentHistoryPage = lazy(() => import("@/pages/resident/payment-history"));

const icon = {
  className: "w-5 h-5 text-inherit dark:text-white",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "sidebar.dashboard",
        path: "/home",
        element: <Home />,
        moduleName: "dashboard",
        moduleId: 1,
      },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "sidebar.finance",
        // Submenu - modul yoxdur, yalnız children-ın modullarına görə açılır
        children: [
          {
            icon: <DocumentTextIcon {...icon} />,
            name: "sidebar.invoices",
            path: "/finance/invoices",
            element: <InvoicesPage />,
            moduleName: "invoice",
            moduleId: 11,
          },
          {
            icon: <TableCellsIcon {...icon} />,
            name: "sidebar.paymentHistory",
            path: "/finance/payment-history",
            element: <PaymentHistoryPage />,
          },
          {
            icon: <ChartBarIcon {...icon} />,
            name: "sidebar.reports",
            path: "/finance/reports",
            element: <ReportsPage />,
          },
          {
            icon: <ExclamationTriangleIcon {...icon} />,
            name: "sidebar.debtorApartments",
            path: "/finance/debtor-apartments",
            element: <DebtorApartmentsPage />,
          },
          {
            icon: <CurrencyDollarIcon {...icon} />,
            name: "sidebar.expenses",
            path: "/finance/expenses",
            element: <ExpensesPage />,
          },
          {
            icon: <ArrowDownCircleIcon {...icon} />,
            name: "sidebar.deposit",
            path: "/finance/deposit",
            element: <DepositPage />,
            allowedRoles: ["admin", "manager"],
          },
          {
            icon: <ArrowsRightLeftIcon {...icon} />,
            name: "sidebar.transfers",
            path: "/finance/transfers",
            element: <TransfersPage />,
            allowedRoles: ["admin", "manager"],
          },
          {
            icon: <DocumentTextIcon {...icon} />,
            name: "sidebar.debt",
            path: "/finance/debt",
            element: <DebtPage />,
            allowedRoles: ["admin", "manager"],
          },
        ],
      },
      {
        icon: <BuildingOfficeIcon {...icon} />,
        name: "sidebar.buildingManagement",
        moduleName: "manage",
        moduleId: 2,
        children: [
          {
            icon: <BuildingOfficeIcon {...icon} />,
            name: "sidebar.mtk",
            path: "/management/mtk",
            element: <MtkPage />,
            moduleName: "mtk",
            moduleId: 3,
          },
          {
            icon: <BuildingOffice2Icon {...icon} />,
            name: "sidebar.complexes",
            path: "/management/complexes",
            element: <ComplexesPage />,
            moduleName: "complex",
            moduleId: 4,
          },
          {
            icon: <HomeModernIcon {...icon} />,
            name: "sidebar.buildings",
            path: "/management/buildings",
            element: <BuildingsPage />,
            moduleName: "building",
            moduleId: 5,
          },
          {
            icon: <RectangleStackIcon {...icon} />,
            name: "sidebar.blocks",
            path: "/management/blocks",
            element: <BlocksPage />,
            moduleName: "block",
            moduleId: 6,
          },
          {
            icon: <HomeIcon {...icon} />,
            name: "sidebar.properties",
            path: "/management/properties",
            element: <PropertiesPage />,
            moduleName: "property",
            moduleId: 7,
          },
          {
            icon: <UsersIcon {...icon} />,
            name: "sidebar.residents",
            path: "/management/residents",
            element: <ResidentsPage />,
            moduleName: "resident",
            moduleId: 8,
          },
        ],
      },
      {
        icon: <CogIcon {...icon} />,
        name: "sidebar.services",
        path: "/services",
        element: <ServicesPage />,
        moduleName: "service",
        moduleId: 12,
      },
      {
        icon: <CpuChipIcon {...icon} />,
        name: "sidebar.devices",
        path: "/devices",
        element: <DevicesPage />,
        moduleName: "device",
        // moduleId: 0,
      },
      {
        name: "sidebar.parking",
        path: "/parking",
        element: <ParkingPage />,
        icon: <BuildingOfficeIcon {...icon} />,
        moduleName: "parking",
        // moduleId: 0,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "sidebar.notifications",
        path: "/notifications",
        element: <Notifications />,
        moduleName: "notifcation",
        // moduleId: 0,
      },
      {
        icon: <QuestionMarkCircleIcon {...icon} />,
        name: "sidebar.applications",
        // moduleName: "application",
        // moduleId: 0,
        children: [
          {
            icon: <TableCellsIcon {...icon} />,
            name: "sidebar.applicationsList",
            path: "/applications/list",
            element: <ApplicationsListPage />,
          },
          {
            icon: <ChartBarIcon {...icon} />,
            name: "sidebar.applicationsEvaluation",
            path: "/applications/evaluation",
            element: <ApplicationsEvaluationPage />,
          },
        ],
      },
      {
        icon: <BellIcon {...icon} />,
        name: "sidebar.notificationsAndQueries",
        // moduleName: "notification_query",
        // moduleId: 0,
        children: [
          {
            icon: <BellIcon {...icon} />,
            name: "sidebar.sendNotification",
            path: "/notifications/send",
            element: <SendNotificationPage />,
          },
          {
            icon: <BellIcon {...icon} />,
            name: "sidebar.notificationArchive",
            path: "/notifications/archive",
            element: <NotificationArchivePage />,
          },
          {
            icon: <BellIcon {...icon} />,
            name: "sidebar.sentSMS",
            path: "/notifications/sent-sms",
            element: <SentSMSPage />,
          },
          {
            icon: <QuestionMarkCircleIcon {...icon} />,
            name: "sidebar.createQuery",
            path: "/queries/create",
            element: <CreateQueryPage />,
          },
          {
            icon: <QuestionMarkCircleIcon {...icon} />,
            name: "sidebar.queries",
            path: "/queries",
            element: <QueriesListPage />,
          },
        ],
      },
      {
        icon: <PresentationChartLineIcon {...icon} />,
        name: "sidebar.complexDashboard",
        path: "/complex-dashboard",
        element: <ComplexDashboardPage />,
        // moduleName: "complex_dashboard",
        // moduleId: 0,
      },
      {
        icon: <PresentationChartLineIcon {...icon} />,
        name: "sidebar.kpi",
        path: "/kpi",
        element: <KPI />,
        // moduleName: "kpi",
        // moduleId: 0,
      },
      {
        icon: <BookOpenIcon {...icon} />,
        name: "sidebar.electronicDocuments",
        path: "/e-documents",
        element: <ElectronicDocumentsPage />,
        // moduleName: "electronic_document",
        // moduleId: 0,
      },
      {
        icon: <InboxIcon {...icon} />,
        name: "sidebar.reception",
        path: "/reception",
        element: <ReceptionPage />,
        // moduleName: "reception",
        // moduleId: 0,
      },
      {
        icon: <ShieldCheckIcon {...icon} />,
        name: "sidebar.permissions",
        path: "/permissions",
        element: <PermissionsPage />,
        moduleName: "permission",
        moduleId: 13,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "sidebar.users",
        path: "/users",
        element: <UserAddPage />,
        moduleName: "user",
        moduleId: 16,
        hideInSidenav: false,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "sidebar.profile",
        path: "/profile",
        element: <Profile />,
        // moduleName: "profile",
        // moduleId: 0,
      },
      {
        icon: <CogIcon {...icon} />,
        name: "sidebar.settings",
        path: "/settings",
        element: <Settings />,
        hideInSidenav: true,
        // moduleName: "settings",
        // moduleId: 0,
      },
    ],
  },
  {
    layout: "resident",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "sidebar.dashboard",
        path: "/home",
        element: <ResidentHomePage />,
      },
      {
        icon: <PresentationChartLineIcon {...icon} />,
        name: "sidebar.complexDashboard",
        path: "/complex-dashboard",
        element: <ResidentComplexDashboardPage />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "sidebar.myInvoices",
        path: "/invoices",
        element: <ResidentMyInvaoicesPage />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Ödəniş Tarixcəsi",
        path: "/payment-history",
        element: <ResidentPaymentHistoryPage />,
      },
      {
        icon: <BuildingOfficeIcon {...icon} />,
        name: "sidebar.myProperty",
        path: "/my-properties",
        element: <ResidentMyPropertiesPage />,
      },
      {
        icon: <CogIcon {...icon} />,
        name: "sidebar.myServices",
        path: "/my-services",
        element: <ResidentMyServicesPage />,
      },
      {
        icon: <QuestionMarkCircleIcon {...icon} />,
        name: "sidebar.applicationsList",
        path: "/tickets",
        element: <ResidentTicketsPage />,
      },
      {
        icon: <BookOpenIcon {...icon} />,
        name: "sidebar.eDocuments",
        path: "/e-documents",
        element: <ResidentEDocumentsPage />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "sidebar.notifications",
        path: "/notifications",
        element: <ResidentNotificationsPage />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "sidebar.profile",
        path: "/profile",
        element: <ResidentProfilePage />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "sign-in",
        element: <SignIn />,
        hideInSidenav: true,
      },
    ],
  },
];

export default routes;
