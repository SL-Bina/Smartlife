import React from "react";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export const mtkViewFields = [
  { key: "name", label: "Ad", icon: BuildingOfficeIcon },
  {
    key: "meta.desc",
    label: "Təsvir",
    icon: InformationCircleIcon,
    fullWidth: true,
    getValue: (item) => item?.meta?.desc,
  },
  {
    key: "meta.address",
    label: "Ünvan",
    icon: MapPinIcon,
    fullWidth: true,
    getValue: (item) => item?.meta?.address,
  },
  {
    key: "meta.phone",
    label: "Telefon",
    icon: PhoneIcon,
    getValue: (item) => item?.meta?.phone,
  },
  {
    key: "meta.email",
    label: "E-mail",
    icon: EnvelopeIcon,
    getValue: (item) => item?.meta?.email,
  },
  {
    key: "meta.website",
    label: "Website",
    icon: GlobeAltIcon,
    fullWidth: true,
    getValue: (item) => item?.meta?.website,
  },
  {
    key: "meta.lat",
    label: "Enlik (Lat)",
    icon: MapPinIcon,
    getValue: (item) => item?.meta?.lat,
  },
  {
    key: "meta.lng",
    label: "Uzunluq (Lng)",
    icon: MapPinIcon,
    getValue: (item) => item?.meta?.lng,
  },
  {
    key: "meta.color_code",
    label: "Rəng kodu",
    icon: InformationCircleIcon,
    getValue: (item) => item?.meta?.color_code,
    format: (value) => {
      if (!value) return "-";
      return (
        <div className="flex items-center gap-2">
          <span>{value}</span>
          <div
            className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: value }}
          />
        </div>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    icon: CheckCircleIcon,
  },
];
