import React from "react";
import {
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

export function createInvoiceViewFields(t) {
  return [
    { key: "id", label: "ID", icon: DocumentTextIcon },
    {
      key: "service.name",
      label: t("invoices.table.service") || "Xidmət",
      icon: BuildingOfficeIcon,
      getValue: (item) => item?.service?.name || "-",
    },
    {
      key: "property.name",
      label: t("invoices.table.property") || "Mənzil",
      icon: BuildingOfficeIcon,
      getValue: (item) => item?.property?.name || "-",
    },
    {
      key: "property.complex.name",
      label: t("invoices.table.complex") || "Kompleks",
      icon: BuildingOfficeIcon,
      getValue: (item) => item?.property?.complex?.name || "-",
    },
    {
      key: "residents",
      label: t("invoices.table.residents") || "Sakinlər",
      icon: UserGroupIcon,
      customRender: (item) => {
        const residents = item?.residents || [];
        if (residents.length === 0) return "-";
        return (
          <div className="flex flex-col gap-1">
            {residents.map((resident) => (
              <span key={resident.id} className="text-sm">
                {resident.name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: "amount",
      label: t("invoices.table.amount") || "Məbləğ",
      icon: CurrencyDollarIcon,
      format: (value) => `${parseFloat(value || 0).toFixed(2)} ₼`,
    },
    {
      key: "amount_paid",
      label: t("invoices.table.paidAmount") || "Ödənilmiş məbləğ",
      icon: CurrencyDollarIcon,
      format: (value) => `${parseFloat(value || 0).toFixed(2)} ₼`,
    },
    {
      key: "remaining",
      label: t("invoices.table.remaining") || "Qalıq",
      icon: CurrencyDollarIcon,
      getValue: (item) => {
        const remaining = parseFloat(item?.amount || 0) - parseFloat(item?.amount_paid || 0);
        return remaining.toFixed(2);
      },
      format: (value) => `${value} ₼`,
    },
    {
      key: "status",
      label: t("invoices.table.status") || "Status",
      icon: CheckCircleIcon,
      format: (value) => t(`invoices.status.${value}`) || value,
    },
    {
      key: "type",
      label: t("invoices.table.type") || "Növ",
      icon: DocumentTextIcon,
      format: (value) => t(`invoices.types.${value}`) || value,
    },
    {
      key: "start_date",
      label: t("invoices.table.startDate") || "Başlama tarixi",
      icon: CalendarIcon,
      format: (value) => {
        if (!value) return "-";
        try {
          return new Date(value).toLocaleDateString("az-AZ");
        } catch {
          return value;
        }
      },
    },
    {
      key: "due_date",
      label: t("invoices.table.dueDate") || "Son tarix",
      icon: CalendarIcon,
      format: (value) => {
        if (!value) return "-";
        try {
          return new Date(value).toLocaleDateString("az-AZ");
        } catch {
          return value;
        }
      },
    },
    {
      key: "paid_at",
      label: t("invoices.table.paymentDate") || "Ödəniş tarixi",
      icon: CalendarIcon,
      format: (value) => {
        if (!value) return "-";
        try {
          return new Date(value).toLocaleDateString("az-AZ");
        } catch {
          return value;
        }
      },
    },
    {
      key: "payment_method.name",
      label: t("invoices.table.paymentMethod") || "Ödəniş metodu",
      icon: CreditCardIcon,
      getValue: (item) => item?.payment_method?.name || "-",
    },
    {
      key: "meta.description",
      label: t("invoices.table.description") || "Təsvir",
      icon: DocumentTextIcon,
      getValue: (item) => item?.meta?.description || item?.meta?.desc || "-",
      fullWidth: true,
    },
  ];
}
