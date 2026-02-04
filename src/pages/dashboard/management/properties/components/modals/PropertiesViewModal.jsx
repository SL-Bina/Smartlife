import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
  Typography,
  Chip,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  EyeIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  HomeModernIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const Field = ({ label, value }) => (
  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white/60 dark:bg-gray-900/20">
    <Typography className="text-xs font-semibold text-gray-600 dark:text-gray-400">
      {label}
    </Typography>
    <Typography className="mt-1 text-sm font-semibold text-gray-900 dark:text-white break-words">
      {value ?? "—"}
    </Typography>
  </div>
);

export function PropertiesViewModal({ open, onClose, item }) {
  const { t } = useTranslation();
  if (!open) return null;

  const status = item?.status || "active";
  const statusLabel =
    status === "active"
      ? t("common.active")
      : status === "inactive"
      ? t("common.inactive")
      : status;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="md"
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="flex items-center justify-between dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <EyeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div className="flex flex-col">
            <Typography variant="h6" className="dark:text-white leading-tight">
              {t("properties.view.title")}
            </Typography>
            <Typography className="text-xs text-gray-600 dark:text-gray-400">
              {t("properties.view.subtitle")}
            </Typography>
          </div>
        </div>

        <div
          className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="dark:text-white h-5 w-5" />
        </div>
      </DialogHeader>

      <DialogBody className="dark:bg-gray-800 space-y-4">
        {/* Top summary */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/40 dark:to-gray-800/30">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Typography className="text-xs text-gray-600 dark:text-gray-400">
                {t("properties.fields.name")}
              </Typography>
              <Typography className="mt-1 text-lg font-bold text-gray-900 dark:text-white truncate">
                {item?.name || "—"}
              </Typography>

              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <Chip
                  size="sm"
                  value={statusLabel}
                  className={`text-white ${
                    status === "active"
                      ? "bg-green-700"
                      : status === "inactive"
                      ? "bg-gray-700"
                      : "bg-blue-gray-700"
                  }`}
                />
                {item?.id ? (
                  <Chip
                    size="sm"
                    variant="outlined"
                    value={`ID: ${item.id}`}
                    className="dark:text-gray-200 dark:border-gray-600"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Apartment meta */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <HomeModernIcon className="h-4 w-4 text-indigo-700 dark:text-indigo-400" />
            <Typography className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {t("properties.view.sections.apartment")}
            </Typography>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label={t("properties.fields.apartmentNumber")}
              value={item?.meta?.apartment_number ?? "—"}
            />
            <Field
              label={t("properties.fields.floor")}
              value={item?.meta?.floor ?? "—"}
            />
            <Field
              label={t("properties.fields.area")}
              value={
                item?.meta?.area !== undefined && item?.meta?.area !== null
                  ? `${item.meta.area} m²`
                  : "—"
              }
            />
            <Field label={t("properties.fields.block")} value={item?.block || "—"} />
          </div>
        </div>

        {/* Hierarchy */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Squares2X2Icon className="h-4 w-4 text-amber-700 dark:text-amber-400" />
            <Typography className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {t("properties.view.sections.hierarchy")}
            </Typography>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label={
                <span className="inline-flex items-center gap-1">
                  <BuildingOffice2Icon className="h-4 w-4" />
                  {t("properties.fields.mtk")}
                </span>
              }
              value={item?.sub_data?.mtk?.name || "—"}
            />
            <Field
              label={
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4" />
                  {t("properties.fields.complex")}
                </span>
              }
              value={item?.sub_data?.complex?.name || "—"}
            />
            <Field
              label={t("properties.fields.building")}
              value={item?.sub_data?.building?.name || "—"}
            />
            <Field
              label={t("properties.fields.subBlock")}
              value={item?.sub_data?.block?.name || "—"}
            />
          </div>
        </div>

        <div className="pt-1 flex justify-end">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={onClose}
            className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t("buttons.close")}
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
}
