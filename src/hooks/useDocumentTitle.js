import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const layoutTitleKeyMap = {
  dashboard: "sidebar.dashboard",
  auth: "auth.signIn.title", // Default auth title
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
  properties: "sidebar.properties",
  residents: "sidebar.residents",
  blocks: "sidebar.blocks",
  "apartment-groups": "apartmentGroups.pageTitle",
  "building-service-fee": "buildingServiceFee.pageTitle",
  "service-fee": "serviceFee.pageTitle",
  kpi: "kpi.pageTitle",
  applications: "applications.list.pageTitle",
  "applications/list": "applications.list.pageTitle",
  "applications/evaluation": "applications.evaluation.pageTitle",
  // Nested finance routes
  "finance/invoices": "sidebar.invoices",
  "finance/payment-history": "sidebar.paymentHistory",
  "finance/reports": "sidebar.reports",
  "finance/debtor-apartments": "sidebar.debtorApartments",
  "finance/expenses": "sidebar.expenses",
  "finance/deposit": "sidebar.deposit",
  "finance/transfers": "sidebar.transfers",
  "finance/debt": "sidebar.debt",
};

export function useDocumentTitle() {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const pathParts = pathname.split("/").filter((el) => el !== "");
    const layout = pathParts[0] || "";
    const page = pathParts.slice(1).join("/") || pathParts[0] || "";

    // First try full path (e.g., "applications/list"), then try just page name
    const fullPath = pathParts.slice(1).join("/");
    let pageTitle = "";

    // Handle parameterized routes (e.g., /service-fee/:id -> /service-fee/123)
    // Try to match base route by checking if path starts with known route patterns
    let matchedKey = null;
    
    // First, try exact match
    if (pageTitleKeyMap[fullPath]) {
      matchedKey = fullPath;
    } else if (pageTitleKeyMap[page]) {
      matchedKey = page;
    } else {
      // Try to match base route for parameterized paths
      // Check if path starts with any known route key
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
      // If no match found, use the page name (capitalize first letter)
      pageTitle = page.charAt(0).toUpperCase() + page.slice(1);
    } else {
      // Default to dashboard title
      pageTitle = layoutTitleKeyMap[layout] ? t(layoutTitleKeyMap[layout]) : "Dashboard";
    }

    // Set document title in format "West | {PageTitle}"
    document.title = `West | ${pageTitle}`;
  }, [pathname, t]);
}

