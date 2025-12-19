import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
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
  UserGroupIcon,
  InboxIcon,
  CogIcon,
  BookOpenIcon,
  CpuChipIcon,
} from "@heroicons/react/24/solid";
import { Home, Tables, Notifications, KPI, ApplicationsListPage, ApplicationsEvaluationPage, ResidentDashboard, ComplexDashboardPage, SendNotificationPage, NotificationArchivePage, SentSMSPage, CreateQueryPage, QueriesListPage, ReceptionPage, ServicesPage, ElectronicDocumentsPage } from "@/pages/dashboard";
import Profile from "./pages/dashboard/profile";
import Settings from "./pages/dashboard/settings";
import { SignIn } from "@/pages/auth";
import MTK from "./pages/dashboard/mtk";
import ComplexPage from "./pages/dashboard/complex";
import ResidentsPage from "./pages/dashboard/residents";
import BuildingsPage from "./pages/dashboard/buildings";
import PropertiesPage from "./pages/dashboard/properties";
import DevicesPage from "./pages/devices";
import BlocksPage from "./pages/dashboard/blocks";
import ApartmentGroupsPage from "./pages/dashboard/apartment-groups";
import BuildingServiceFeePage from "./pages/dashboard/building-service-fee";
import PropertyServiceFeePage from "./pages/dashboard/service-fee";
import InvoicesPage from "./pages/dashboard/finance/invoices";
import PaymentHistoryPage from "./pages/dashboard/finance/payment-history";
import ReportsPage from "./pages/dashboard/finance/reports";
import DebtorApartmentsPage from "./pages/dashboard/finance/debtor-apartments";
import ExpensesPage from "./pages/dashboard/finance/expenses";
import DepositPage from "./pages/dashboard/finance/deposit";
import TransfersPage from "./pages/dashboard/finance/transfers";
import DebtPage from "./pages/dashboard/finance/debt";
import UserRightsPage from "./pages/dashboard/user-rights";
import UserPermissionsPage from "./pages/dashboard/user-permissions";

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
        allowedRoles: ["admin", "manager", "operator", "viewer"],
        moduleName: "dashboard", // API modül ismi
      },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "sidebar.finance",
        allowedRoles: ["admin", "manager", "operator"],
        moduleName: "finance", // API modül ismi
        children: [
          {
            icon: <DocumentTextIcon {...icon} />,
            name: "sidebar.invoices",
            path: "/finance/invoices",
            element: <InvoicesPage />,
            allowedRoles: ["admin", "manager", "operator"],
          },
          {
            icon: <TableCellsIcon {...icon} />,
            name: "sidebar.paymentHistory",
            path: "/finance/payment-history",
            element: <PaymentHistoryPage />,
            allowedRoles: ["admin", "manager", "operator"],
          },
          {
            icon: <ChartBarIcon {...icon} />,
            name: "sidebar.reports",
            path: "/finance/reports",
            element: <ReportsPage />,
            allowedRoles: ["admin", "manager"],
          },
          {
            icon: <ExclamationTriangleIcon {...icon} />,
            name: "sidebar.debtorApartments",
            path: "/finance/debtor-apartments",
            element: <DebtorApartmentsPage />,
            allowedRoles: ["admin", "manager", "operator"],
          },
          {
            icon: <CurrencyDollarIcon {...icon} />,
            name: "sidebar.expenses",
            path: "/finance/expenses",
            element: <ExpensesPage />,
            allowedRoles: ["admin", "manager"],
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
        allowedRoles: ["admin", "manager", "operator", "viewer"],
      },
      {
        icon: <QuestionMarkCircleIcon {...icon} />,
        name: "sidebar.applications",
        allowedRoles: ["admin", "manager", "operator", "viewer"],
        children: [
          {
            icon: <TableCellsIcon {...icon} />,
            name: "sidebar.applicationsList",
            path: "/applications/list",
            element: <ApplicationsListPage />,
            allowedRoles: ["admin", "manager", "operator", "viewer"],
          },
          {
            icon: <ChartBarIcon {...icon} />,
            name: "sidebar.applicationsEvaluation",
            path: "/applications/evaluation",
            element: <ApplicationsEvaluationPage />,
            allowedRoles: ["admin", "manager"],
          },
        ],
      },
      {
        icon: <BellIcon {...icon} />,
        name: "sidebar.notificationsAndQueries",
        allowedRoles: ["admin", "manager", "operator", "viewer"],
        children: [
          {
            icon: <BellIcon {...icon} />,
            name: "sidebar.sendNotification",
            path: "/notifications/send",
            element: <SendNotificationPage />,
            allowedRoles: ["admin", "manager", "operator"],
          },
          {
            icon: <BellIcon {...icon} />,
            name: "sidebar.notificationArchive",
            path: "/notifications/archive",
            element: <NotificationArchivePage />,
            allowedRoles: ["admin", "manager", "operator", "viewer"],
          },
          {
            icon: <BellIcon {...icon} />,
            name: "sidebar.sentSMS",
            path: "/notifications/sent-sms",
            element: <SentSMSPage />,
            allowedRoles: ["admin", "manager", "operator", "viewer"],
          },
          {
            icon: <QuestionMarkCircleIcon {...icon} />,
            name: "sidebar.createQuery",
            path: "/queries/create",
            element: <CreateQueryPage />,
            allowedRoles: ["admin", "manager", "operator"],
          },
          {
            icon: <QuestionMarkCircleIcon {...icon} />,
            name: "sidebar.queries",
            path: "/queries",
            element: <QueriesListPage />,
            allowedRoles: ["admin", "manager", "operator", "viewer"],
          },
        ],
      },
      {
        icon: <PresentationChartLineIcon {...icon} />,
        name: "sidebar.complexDashboard",
        path: "/complex-dashboard",
        element: <ComplexDashboardPage />,
        allowedRoles: ["admin", "manager", "operator", "viewer"],
      },
      {
        icon: <PresentationChartLineIcon {...icon} />,
        name: "sidebar.kpi",
        path: "/kpi",
        element: <KPI />,
        allowedRoles: ["admin", "manager"],
      },
      {
        icon: <BuildingOfficeIcon {...icon} />,
        name: "sidebar.buildingManagement",
        allowedRoles: ["admin", "manager", "operator"],
        children: [
          {
            icon: <TableCellsIcon {...icon} />,
            name: "sidebar.mtk",
            path: "/mtk",
            element: <MTK />,
            allowedRoles: ["admin", "manager"],
            moduleName: "mtk", // API modül ismi
          },
          {
            icon: <BuildingOfficeIcon {...icon} />,
            name: "sidebar.complexes",
            path: "/complex",
            element: <ComplexPage />,
            allowedRoles: ["admin", "manager", "operator"],
            moduleName: "complex", // API modül ismi
          },
          {
            icon: <BuildingOffice2Icon {...icon} />,
            name: "sidebar.buildings",
            path: "/buildings",
            element: <BuildingsPage />,
            allowedRoles: ["admin", "manager", "operator"],
            moduleName: "building", // API modül ismi
          },
          {
            icon: <RectangleStackIcon {...icon} />,
            name: "sidebar.blocks",
            path: "/blocks",
            element: <BlocksPage />,
            allowedRoles: ["admin", "manager", "operator"],
            moduleName: "block", // API modül ismi
          },
          {
            icon: <HomeModernIcon {...icon} />,
            name: "sidebar.properties",
            path: "/properties",
            element: <PropertiesPage />,
            allowedRoles: ["admin", "manager", "operator", "viewer"],
            moduleName: "apartment", // API modül ismi (apartment = properties)
          },
          {
            icon: <BuildingOfficeIcon {...icon} />,
            name: "sidebar.propertyServiceFee",
            path: "/service-fee/:id",
            element: <PropertyServiceFeePage />,
            hideInSidenav: true,
            allowedRoles: ["admin", "manager", "operator"],
          },
          {
            icon: <UsersIcon {...icon} />,
            name: "sidebar.residents",
            path: "/residents",
            element: <ResidentsPage />,
            allowedRoles: ["admin", "manager", "operator", "viewer"],
            moduleName: "resident", // API modül ismi
          },
          
          {
            icon: <HomeModernIcon {...icon} />,
            name: "sidebar.apartmentGroups",
            path: "/apartment-groups",
            element: <ApartmentGroupsPage />,
            allowedRoles: ["admin", "manager", "operator"],
          },
          {
            icon: <BuildingOfficeIcon {...icon} />,
            name: "sidebar.buildingServiceFee",
            path: "/building-service-fee",
            element: <BuildingServiceFeePage />,
            hideInSidenav: true,
            allowedRoles: ["admin", "manager", "operator"],
          },
        ],
      },
      {
            icon: <CpuChipIcon {...icon} />,
            name: "sidebar.devices",
            path: "/devices",
            element: <DevicesPage />,
            allowedRoles: ["admin", "manager", "operator", "viewer"],
          },
      {
        icon: <CogIcon {...icon} />,
        name: "sidebar.services",
        path: "/services",
        element: <ServicesPage />,
        allowedRoles: ["admin", "manager", "operator", "viewer"],
        moduleName: "service", // API modül ismi
      },
      {
        icon: <BookOpenIcon {...icon} />,
        name: "sidebar.electronicDocuments",
        path: "/electronic-documents",
        element: <ElectronicDocumentsPage />,
        allowedRoles: ["admin", "manager", "operator", "viewer"],
      },
      {
        icon: <InboxIcon {...icon} />,
        name: "sidebar.reception",
        path: "/reception",
        element: <ReceptionPage />,
        allowedRoles: ["admin", "manager", "operator", "viewer"],
      },
      {
        icon: <UserGroupIcon {...icon} />,
        name: "sidebar.userRights",
        path: "/user-rights",
        element: <UserRightsPage />,
        allowedRoles: ["admin"],
      },
      {
        icon: <ShieldCheckIcon {...icon} />,
        name: "sidebar.userPermissions",
        path: "/user-permissions",
        element: <UserPermissionsPage />,
        hideInSidenav: true,
        allowedRoles: ["admin"],
        moduleName: "permission", // API modül ismi
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "sidebar.profile",
        path: "/profile",
        element: <Profile />,
        allowedRoles: ["admin", "manager", "operator", "viewer"], // Sakin üçün ayrı profil var
      },
      {
        icon: <CogIcon {...icon} />,
        name: "sidebar.settings",
        path: "/settings",
        element: <Settings />,
        hideInSidenav: true, // Sidebar'da gösterme, sadece header menüsünden erişilebilir
        allowedRoles: ["admin", "manager", "operator", "viewer", "resident"],
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
        allowedRoles: ["resident"],
      },
      {
        icon: <DocumentTextIcon {...icon} />,
        name: "sidebar.invoices",
        path: "/resident/invoices",
        element: <InvoicesPage />,
        allowedRoles: ["resident"],
      },
      {
        icon: <QuestionMarkCircleIcon {...icon} />,
        name: "sidebar.applicationsList",
        path: "/resident/applications",
        element: <ApplicationsListPage />,
        allowedRoles: ["resident"],
      },
      {
        icon: <BellIcon {...icon} />,
        name: "sidebar.notifications",
        path: "/resident/notifications",
        element: <Notifications />,
        allowedRoles: ["resident"],
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "sidebar.profile",
        path: "/resident/profile",
        element: <Profile />,
        allowedRoles: ["resident"],
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
