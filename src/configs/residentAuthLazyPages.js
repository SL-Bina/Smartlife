import { lazy } from "react";

export const SignIn = lazy(() => import("@/pages/auth/sign-in"));

export const ResidentHomePage = lazy(() => import("@/pages/resident/home"));
export const ResidentNotificationsPage = lazy(() => import("@/pages/resident/notifications"));
export const ResidentEDocumentsPage = lazy(() => import("@/pages/resident/e-documents"));
export const ResidentTicketsPage = lazy(() => import("@/pages/resident/tickets"));
export const ResidentMyInvaoicesPage = lazy(() => import("@/pages/resident/myinvoices"));
export const ResidentProfilePage = lazy(() => import("@/pages/resident/profile"));
export const ResidentMyPropertiesPage = lazy(() => import("@/pages/resident/myproperties"));
export const ResidentMyServicesPage = lazy(() => import("@/pages/resident/myservices"));
export const ResidentComplexDashboardPage = lazy(() => import("@/pages/resident/complexdashboard"));
export const ResidentPaymentHistoryPage = lazy(() => import("@/pages/resident/payment-history"));
