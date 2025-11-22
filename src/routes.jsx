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
} from "@heroicons/react/24/solid";
import { Home, Tables, Notifications, KPI, ApplicationsListPage, ApplicationsEvaluationPage } from "@/pages/dashboard";
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
      },
      // {
      //   icon: <TableCellsIcon {...icon} />,
      //   name: "tables",
      //   path: "/tables",
      //   element: <Tables />,
      // },
      {
        icon: <BanknotesIcon {...icon} />,
        name: "sidebar.finance",
        children: [
          {
            icon: <DocumentTextIcon {...icon} />,
            name: "sidebar.invoices",
            path: "/finance/invoices",
            element: <InvoicesPage />,
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
          },
          {
            icon: <ArrowsRightLeftIcon {...icon} />,
            name: "sidebar.transfers",
            path: "/finance/transfers",
            element: <TransfersPage />,
          },
          {
            icon: <DocumentTextIcon {...icon} />,
            name: "sidebar.debt",
            path: "/finance/debt",
            element: <DebtPage />,
          },
        ],
      },
      {
        icon: <BellIcon {...icon} />,
        name: "sidebar.notifications",
        path: "/notifications",
        element: <Notifications />,
      },
      {
        icon: <QuestionMarkCircleIcon {...icon} />,
        name: "sidebar.applications",
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
        icon: <PresentationChartLineIcon {...icon} />,
        name: "sidebar.kpi",
        path: "/kpi",
        element: <KPI />,
      },
      {
        icon: <BuildingOfficeIcon {...icon} />,
        name: "sidebar.buildingManagement",
        children: [
          {
            icon: <TableCellsIcon {...icon} />,
            name: "sidebar.mtk",
            path: "/mtk",
            element: <MTK />,
          },
          {
            icon: <BuildingOfficeIcon {...icon} />,
            name: "sidebar.complexes",
            path: "/complex",
            element: <ComplexPage />,
          },
          {
            icon: <BuildingOffice2Icon {...icon} />,
            name: "sidebar.buildings",
            path: "/buildings",
            element: <BuildingsPage />,
          },
          {
            icon: <RectangleStackIcon {...icon} />,
            name: "sidebar.blocks",
            path: "/blocks",
            element: <BlocksPage />,
          },
          {
            icon: <HomeModernIcon {...icon} />,
            name: "sidebar.properties",
            path: "/properties",
            element: <PropertiesPage />,
          },
          {
            icon: <BuildingOfficeIcon {...icon} />,
            name: "sidebar.propertyServiceFee",
            path: "/service-fee/:id",
            element: <PropertyServiceFeePage />,
            hideInSidenav: true,
          },
          {
            icon: <UsersIcon {...icon} />,
            name: "sidebar.residents",
            path: "/residents",
            element: <ResidentsPage />,
          },
          
          {
            icon: <HomeModernIcon {...icon} />,
            name: "sidebar.apartmentGroups",
            path: "/apartment-groups",
            element: <ApartmentGroupsPage />,
          },
          {
            icon: <BuildingOfficeIcon {...icon} />,
            name: "sidebar.buildingServiceFee",
            path: "/building-service-fee",
            element: <BuildingServiceFeePage />,
            hideInSidenav: true,
          },
        ],
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "sidebar.profile",
        path: "/profile",
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
      },
    ],
  },
];

export default routes;
