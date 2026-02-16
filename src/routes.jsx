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
import { Home, Notifications, KPI, ApplicationsListPage, ApplicationsEvaluationPage, ResidentDashboard, ComplexDashboardPage, SendNotificationPage, NotificationArchivePage, SentSMSPage, CreateQueryPage, QueriesListPage, ReceptionPage, ServicesPage, ElectronicDocumentsPage } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import Profile from "./pages/dashboard/profile";
import Settings from "./pages/dashboard/settings";
import MTK from "./pages/dashboard/management/mtk";
import ComplexPage from "./pages/dashboard/management/complex";
import ResidentsPage from "./pages/dashboard/management/residents";
import BuildingsPage from "./pages/dashboard/management/buildings";
import PropertiesPage from "./pages/dashboard/management/properties";
import BlocksPage from "./pages/dashboard/management/blocks";
import ApartmentGroupsPage from "./pages/dashboard/management/apartment-groups";
// import BuildingServiceFeePage from "./pages/dashboard/management/building-service-fee";
import PropertyServiceFeePage from "./pages/dashboard/management/service-fee";
import InvoicesPage from "./pages/dashboard/finance/invoices";
import PaymentHistoryPage from "./pages/dashboard/finance/payment-history";
import ReportsPage from "./pages/dashboard/finance/reports";
import DebtorApartmentsPage from "./pages/dashboard/finance/debtor-apartments";
import ExpensesPage from "./pages/dashboard/finance/expenses";
import DepositPage from "./pages/dashboard/finance/deposit";
import TransfersPage from "./pages/dashboard/finance/transfers";
import DebtPage from "./pages/dashboard/finance/debt";
import PermissionsPage from "./pages/dashboard/permissions";
import DevicesPage from "./pages/dashboard/devices";
import UserAddPage from "./pages/dashboard/users/add";

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
        moduleName: "finance",
        moduleId: 10,
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
        icon: <BellIcon {...icon} />,
        name: "sidebar.notifications",
        path: "/notifications",
        element: <Notifications />,
        // moduleName: "notification",
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
        icon: <BuildingOfficeIcon {...icon} />,
        name: "sidebar.buildingManagement",
        moduleName: "manage",
        moduleId: 2,
        children: [
          {
            icon: <TableCellsIcon {...icon} />,
            name: "sidebar.mtk",
            path: "/management/mtk",
            element: <MTK />,
            moduleName: "mtk",
            moduleId: 3,
          },
          {
            icon: <BuildingOfficeIcon {...icon} />,
            name: "sidebar.complexes",
            path: "/management/complex",
            element: <ComplexPage />,
            moduleName: "complex",
            moduleId: 4,
          },
          {
            icon: <BuildingOffice2Icon {...icon} />,
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
            icon: <HomeModernIcon {...icon} />,
            name: "sidebar.properties",
            path: "/management/properties",
            element: <PropertiesPage />,
            moduleName: "property",
            moduleId: 7,
          },
          {
            icon: <BuildingOfficeIcon {...icon} />,
            name: "sidebar.propertyServiceFee",
            path: "/management/service-fee/:id",
            element: <PropertyServiceFeePage />,
            hideInSidenav: true,
            moduleName: "property_service",
            moduleId: 15,
          },
          {
            icon: <UsersIcon {...icon} />,
            name: "sidebar.residents",
            path: "/management/residents",
            element: <ResidentsPage />,
            moduleName: "resident",
            moduleId: 8,
          },

          // {
          //   icon: <HomeModernIcon {...icon} />,
          //   name: "sidebar.apartmentGroups",
          //   path: "/management/apartment-groups",
          //   element: <ApartmentGroupsPage />,
          //   allowedRoles: ["admin", "manager", "operator"],
          //   moduleName: "resident-group",
          //   moduleId: 9,
          // },
          // {
          //   icon: <BuildingOfficeIcon {...icon} />,
          //   name: "sidebar.buildingServiceFee",
          //   path: "/management/building-service-fee",
          //   element: <BuildingServiceFeePage />,
          //   hideInSidenav: true,
          //   allowedRoles: ["admin", "manager", "operator"],
          // },
        ],
      },
      {
        icon: <CpuChipIcon {...icon} />,
        name: "sidebar.devices",
        path: "/devices",
        element: <DevicesPage />,
        // moduleName: "device",
        // moduleId: 0,
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
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "sidebar.dashboard",
        path: "/resident/home",
        element: <ResidentDashboard />,
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "sidebar.invoices",
        path: "/resident/invoices",
        element: <InvoicesPage />,
      },
      {
        icon: <QuestionMarkCircleIcon {...icon} />,
        name: "sidebar.applicationsList",
        path: "/resident/applications",
        element: <ApplicationsListPage />,
      },
      {
        icon: <BellIcon {...icon} />,
        name: "sidebar.notifications",
        path: "/resident/notifications",
        element: <Notifications />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "sidebar.profile",
        path: "/resident/profile",
        element: <Profile />,
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
