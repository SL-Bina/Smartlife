import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  HomeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import myPropertiesAPI from "../api";

export function PropertyDetailModal({ open, onClose, propertyId }) {
  const { t } = useTranslation();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && propertyId) {
      fetchPropertyDetails();
    } else {
      setProperty(null);
      setError(null);
    }
  }, [open, propertyId]);

  const fetchPropertyDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await myPropertiesAPI.getById(propertyId);
      if (response?.success && response?.data) {
        setProperty(response.data);
      } else {
        setError(response?.message || "Məlumat tapılmadı");
      }
    } catch (err) {
      setError(err?.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  // Set z-index for portal container when modal is open
  useEffect(() => {
    if (open) {
      const setDialogZIndex = () => {
        const dialogs = document.querySelectorAll('div[role="dialog"]');
        dialogs.forEach((dialog) => {
          if (dialog instanceof HTMLElement) {
            dialog.style.zIndex = '999999';
          }
          let parent = dialog.parentElement;
          while (parent && parent !== document.body) {
            if (parent instanceof HTMLElement) {
              const computedStyle = window.getComputedStyle(parent);
              if (computedStyle.position === 'fixed' || computedStyle.position === 'absolute') {
                parent.style.zIndex = '999999';
              }
            }
            parent = parent.parentElement;
          }
        });
        const backdrops = document.querySelectorAll('[class*="backdrop"]');
        backdrops.forEach((backdrop) => {
          if (backdrop instanceof HTMLElement) {
            backdrop.style.zIndex = '999998';
          }
        });
      };
      setDialogZIndex();
      const timeout = setTimeout(setDialogZIndex, 10);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("az-AZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="lg"
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HomeIcon className="h-5 w-5 text-blue-500" />
          <Typography variant="h5" className="font-bold">
            {t("properties.details") || "Əmlak Detalları"}
          </Typography>
        </div>
        <div
          className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>

      <DialogBody divider className="dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="h-8 w-8" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Typography className="text-red-500 dark:text-red-400">
              {error}
            </Typography>
          </div>
        ) : property ? (
          <div className="space-y-6">
            {/* Property Name & Status */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <HomeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="h5" className="font-bold text-gray-800 dark:text-white">
                      {property.name}
                    </Typography>
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                      ID: {property.id}
                    </Typography>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    property.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {property.status === "active" ? t("properties.status.active") || "Aktiv" : t("properties.status.inactive") || "Qeyri-aktiv"}
                </span>
              </div>
            </div>

            {/* Property Meta Info */}
            {property.meta && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <Typography variant="h6" className="font-bold mb-4 text-gray-800 dark:text-white">
                  {t("properties.basicInfo") || "Əsas Məlumatlar"}
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.meta.area && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <HomeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                          {t("properties.area") || "Sahə"}
                        </Typography>
                        <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">
                          {property.meta.area} m²
                        </Typography>
                      </div>
                    </div>
                  )}
                  {property.meta.floor && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <BuildingOfficeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                          {t("properties.floor") || "Mərtəbə"}
                        </Typography>
                        <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">
                          {property.meta.floor}
                        </Typography>
                      </div>
                    </div>
                  )}
                  {property.meta.apartment_number && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <HomeIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                          {t("properties.apartmentNumber") || "Mənzil nömrəsi"}
                        </Typography>
                        <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">
                          {property.meta.apartment_number}
                        </Typography>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Complex Info */}
            {property.complex && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <Typography variant="h6" className="font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  {t("properties.complex") || "Kompleks"}
                </Typography>
                <div className="space-y-2">
                  <div>
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                      {t("properties.name") || "Ad"}
                    </Typography>
                    <Typography variant="h6" className="font-semibold text-gray-800 dark:text-white">
                      {property.complex.name}
                    </Typography>
                  </div>
                  {property.complex.meta?.address && (
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                        {property.complex.meta.address}
                      </Typography>
                    </div>
                  )}
                  {property.complex.meta?.phone && (
                    <div>
                      <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                        {t("properties.phone") || "Telefon"}: {property.complex.meta.phone}
                      </Typography>
                    </div>
                  )}
                  {property.complex.meta?.email && (
                    <div>
                      <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                        {t("properties.email") || "E-poçt"}: {property.complex.meta.email}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MTK Info */}
            {property.mtk && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <Typography variant="h6" className="font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  MTK
                </Typography>
                <div className="space-y-2">
                  <div>
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                      {t("properties.name") || "Ad"}
                    </Typography>
                    <Typography variant="h6" className="font-semibold text-gray-800 dark:text-white">
                      {property.mtk.name}
                    </Typography>
                  </div>
                  {property.mtk.meta?.address && (
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                        {property.mtk.meta.address}
                      </Typography>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Financial Info */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <Typography variant="h6" className="font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                {t("properties.financialInfo") || "Maliyyə Məlumatları"}
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                    {t("properties.bankBalance") || "Bank balansı"}
                  </Typography>
                  <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">
                    {property.bank_balance !== null ? `${property.bank_balance} ₼` : "N/A"}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                    {t("properties.cashBalance") || "Nağd balans"}
                  </Typography>
                  <Typography variant="h6" className="font-bold text-gray-800 dark:text-white">
                    {property.cash_balance !== null ? `${property.cash_balance} ₼` : "N/A"}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <Typography variant="h6" className="font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {t("properties.dates") || "Tarixlər"}
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                    {t("properties.createdAt") || "Yaradılma tarixi"}
                  </Typography>
                  <Typography variant="small" className="font-semibold text-gray-800 dark:text-white">
                    {formatDate(property.created_at)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                    {t("properties.updatedAt") || "Yenilənmə tarixi"}
                  </Typography>
                  <Typography variant="small" className="font-semibold text-gray-800 dark:text-white">
                    {formatDate(property.updated_at)}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800 flex justify-between">
        <Button
          variant="text"
          color="gray"
          onClick={onClose}
          className="mr-2"
        >
          {t("buttons.close") || "Bağla"}
        </Button>
        {property && property.id && (
          <Button
            variant="text"
            size="sm"
            onClick={() => {
              window.location.href = `/resident/my-properties/${property.id}`;
            }}
          >
            {t("properties.goTo") || "Keçid et"}
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
}

