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
} from "@heroicons/react/24/solid";
import { Home, Tables, Notifications, KPI, ApplicationsListPage, ApplicationsEvaluationPage, ResidentDashboard } from "@/pages/dashboard";
import Profile from "./pages/dashboard/profile";
import { SignIn } from "@/pages/auth";
import MTK from "./pages/dashboard/mtk";
import ComplexPage from "./pages/dashboard/complex";
import ResidentsPage from "./pages/dashboard/residents";
import BuildingsPage from "./pages/dashboard/buildings";
import PropertiesPage from "./pages/dashboard/properties";
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
      },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "sidebar.finance",
        allowedRoles: ["admin", "manager", "operator"],
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
          },
          {
            icon: <BuildingOfficeIcon {...icon} />,
            name: "sidebar.complexes",
            path: "/complex",
            element: <ComplexPage />,
            allowedRoles: ["admin", "manager", "operator"],
          },
          {
            icon: <BuildingOffice2Icon {...icon} />,
            name: "sidebar.buildings",
            path: "/buildings",
            element: <BuildingsPage />,
            allowedRoles: ["admin", "manager", "operator"],
          },
          {
            icon: <RectangleStackIcon {...icon} />,
            name: "sidebar.blocks",
            path: "/blocks",
            element: <BlocksPage />,
            allowedRoles: ["admin", "manager", "operator"],
          },
          {
            icon: <HomeModernIcon {...icon} />,
            name: "sidebar.properties",
            path: "/properties",
            element: <PropertiesPage />,
            allowedRoles: ["admin", "manager", "operator", "viewer"],
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
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "sidebar.profile",
        path: "/profile",
        element: <Profile />,
        allowedRoles: ["admin", "manager", "operator", "viewer"], // Sakin üçün ayrı profil var
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
