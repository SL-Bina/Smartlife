import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const layoutTitleKeyMap = {
  dashboard: "sidebar.dashboard",
  auth: "auth.signIn.title",
};

const pageTitleKeyMap = {
  "sign-in": "auth.signIn.title",
  "sign-up": "auth.signUp.title",
  home: "sidebar.dashboard",
  finance: "sidebar.finance",
  invoices: "sidebar.invoices",
  "payment-history": "sidebar.paymentHistory",
  reports: "sidebar.reports",
  "debtor-apartments": "sidebar.debtorApartments",
  expenses: "sidebar.expenses",
  deposit: "sidebar.deposit",
  transfers: "sidebar.transfers",
  debt: "sidebar.debt",
  notifications: "sidebar.notifications",
  "user-rights": "sidebar.userRights",
  "user-permissions": "sidebar.userPermissions",
  profile: "sidebar.profile",
  mtk: "sidebar.mtk",
  complex: "sidebar.complexes",
        buildings: "sidebar.buildings",
        blocks: "sidebar.blocks",
        properties: "sidebar.properties",
  residents: "sidebar.residents",
  "apartment-groups": "apartmentGroups.pageTitle",
  "building-service-fee": "buildingServiceFee.pageTitle",
  "service-fee": "serviceFee.pageTitle",
  kpi: "kpi.pageTitle",
  applications: "applications.list.pageTitle",
  "applications/list": "applications.list.pageTitle",
  "applications/evaluation": "applications.evaluation.pageTitle",
  "finance/invoices": "sidebar.invoices",
  "finance/payment-history": "sidebar.paymentHistory",
  "finance/reports": "sidebar.reports",
  "finance/debtor-apartments": "sidebar.debtorApartments",
  "finance/expenses": "sidebar.expenses",
  "finance/deposit": "sidebar.deposit",
  "finance/transfers": "sidebar.transfers",
  "finance/debt": "sidebar.debt",
  "management/mtk": "sidebar.mtk",
  "management/complexes": "sidebar.complexes",
        "management/buildings": "sidebar.buildings",
        "management/blocks": "sidebar.blocks",
        "management/properties": "sidebar.properties",
  "resident/home": "residentDashboard.pageTitle",
  "resident/invoices": "sidebar.invoices",
  "resident/applications": "sidebar.applicationsList",
  "resident/notifications": "sidebar.notifications",
  "resident/profile": "sidebar.profile",
};

export function useDocumentTitle() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const pathParts = pathname.split("/").filter((el) => el !== "");
    const layout = pathParts[0] || "";
    const page = pathParts.slice(1).join("/") || pathParts[0] || "";

    const fullPath = pathParts.slice(1).join("/");
    let pageTitle = "";

    let matchedKey = null;
    
    if (pageTitleKeyMap[fullPath]) {
      matchedKey = fullPath;
    } else if (pageTitleKeyMap[page]) {
      matchedKey = page;
    } else {
      for (const key in pageTitleKeyMap) {
        if (fullPath.startsWith(key + "/") || fullPath === key) {
          matchedKey = key;
          break;
        }
      }
    }

    if (matchedKey && pageTitleKeyMap[matchedKey]) {
      pageTitle = t(pageTitleKeyMap[matchedKey]);
    } else if (page) {
      pageTitle = page.charAt(0).toUpperCase() + page.slice(1);
    } else {
      pageTitle = layoutTitleKeyMap[layout] ? t(layoutTitleKeyMap[layout]) : "Dashboard";
    }

    document.title = `SmartLife | ${pageTitle}`;
  }, [pathname, t]);
}

