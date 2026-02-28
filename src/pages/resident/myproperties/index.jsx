import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, Typography, Spinner, Chip, Button } from "@material-tailwind/react";
import { BuildingOfficeIcon, DocumentTextIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import myPropertiesAPI from "./api";
import residentInvoicesAPI from "@/pages/resident/myinvoices/api";
import { setSelectedProperty } from "@/store/slices/propertySlice";

export default function MyPropertiesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedPropertyId = useSelector((state) => state.property.selectedPropertyId);
  const selectedProperty = useSelector((state) => state.property.selectedProperty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchMyPropertyContext();
  }, [selectedPropertyId]);

  const normalizePropertyForStore = (property) => {
    if (!property) return null;
    return {
      ...property,
      sub_data: {
        ...(property.sub_data || {}),
        mtk: property?.sub_data?.mtk || property?.mtk || null,
        complex: property?.sub_data?.complex || property?.complex || null,
        building: property?.sub_data?.building || property?.building || null,
        block: property?.sub_data?.block || property?.block || null,
      },
    };
  };

  const fetchMyPropertyContext = async () => {
    try {
      setLoading(true);
      setError(null);

      const propertiesResponse = await myPropertiesAPI.getAll();
      const list = propertiesResponse?.data?.data || propertiesResponse?.data || [];
      const properties = Array.isArray(list) ? list : [];

      let activeProperty = selectedProperty;
      if (!activeProperty) {
        if (selectedPropertyId) {
          activeProperty = properties.find((item) => Number(item.id) === Number(selectedPropertyId)) || null;
        }
        if (!activeProperty && properties.length > 0) {
          activeProperty = properties[0];
        }
      }

      const normalized = normalizePropertyForStore(activeProperty);
      if (normalized) {
        dispatch(setSelectedProperty({ id: normalized.id, property: normalized }));
      }

      const invoicesResponse = await residentInvoicesAPI.getAll();
      const invoiceList = invoicesResponse?.data?.data ?? invoicesResponse?.data ?? [];
      setInvoices(Array.isArray(invoiceList) ? invoiceList : []);
    } catch (err) {
      setError(err?.message || t("properties.loadError") || "Məlumat yüklənərkən xəta baş verdi");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const propertyTitle = useMemo(() => {
    return (
      selectedProperty?.name ||
      selectedProperty?.meta?.apartment_number ||
      (selectedProperty?.id ? `Mənzil #${selectedProperty.id}` : "Mənzil seçilməyib")
    );
  }, [selectedProperty]);

  const unpaidCount = useMemo(() => {
    return invoices.filter((item) => ["unpaid", "not_paid", "overdue"].includes(item?.status)).length;
  }, [invoices]);

  const totalDebt = useMemo(() => {
    return invoices
      .filter((item) => ["unpaid", "not_paid", "overdue"].includes(item?.status))
      .reduce((sum, item) => sum + Number(item?.amount || 0) - Number(item?.amount_paid || 0), 0);
  }, [invoices]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" style={{ position: 'relative', zIndex: 0 }}>
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto mb-4" />
          <Typography className="text-sm text-gray-500 dark:text-gray-400">
            {t("properties.loading") || "Yüklənir..."}
          </Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12" style={{ position: 'relative', zIndex: 0 }}>
        <Typography className="text-sm text-red-500 dark:text-red-400">
          {error}
        </Typography>
      </div>
    );
  }

  if (!selectedProperty) {
    return (
      <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
        <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardBody className="text-center py-12">
            <BuildingOfficeIcon className="h-14 w-14 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
            <Typography className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Mənzil seçilməyib
            </Typography>
            <Typography variant="small" className="text-gray-500 dark:text-gray-400 mb-4">
              Yuxarıdakı navbar-dan mənzil seçin və bu səhifə avtomatik yenilənəcək.
            </Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 p-4 sm:p-6 rounded-xl shadow-lg border border-blue-500 dark:border-blue-700">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <Typography variant="h4" className="text-white font-bold">
                Mənzilim
              </Typography>
              <Typography variant="small" className="text-blue-100 dark:text-blue-200">
                {propertyTitle}
              </Typography>
            </div>
          </div>
          <div className="text-right">
            <Button
              size="sm"
              variant="filled"
              className="normal-case bg-white/20 hover:bg-white/30 text-white"
              onClick={() => navigate("/resident/invoices")}
            >
              Fakturalara keç
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardBody>
            <Typography variant="small" className="text-gray-500 dark:text-gray-400">Kompleks</Typography>
            <Typography className="font-semibold text-gray-800 dark:text-white mt-1">
              {selectedProperty?.sub_data?.complex?.name || selectedProperty?.complex?.name || "-"}
            </Typography>
          </CardBody>
        </Card>
        <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardBody>
            <Typography variant="small" className="text-gray-500 dark:text-gray-400">Bina / Blok</Typography>
            <Typography className="font-semibold text-gray-800 dark:text-white mt-1">
              {(selectedProperty?.sub_data?.building?.name || selectedProperty?.building?.name || `Bina #${selectedProperty?.building_id || "-"}`)} / {(selectedProperty?.sub_data?.block?.name || selectedProperty?.block?.name || `Blok #${selectedProperty?.block_id || "-"}`)}
            </Typography>
          </CardBody>
        </Card>
        <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
          <CardBody>
            <Typography variant="small" className="text-gray-500 dark:text-gray-400">Borclar</Typography>
            <Typography className="font-semibold text-gray-800 dark:text-white mt-1">{totalDebt.toFixed(2)} ₼</Typography>
            <Typography variant="small" className="text-red-500 mt-1">{unpaidCount} ödənilməmiş faktura</Typography>
          </CardBody>
        </Card>
      </div>

      <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <Typography className="font-semibold text-gray-900 dark:text-white">Bu mənzilə aid fakturalar</Typography>
            </div>
            <Chip value={`${invoices.length} faktura`} size="sm" className="normal-case" />
          </div>

          {invoices.length === 0 ? (
            <Typography variant="small" className="text-gray-500 dark:text-gray-400">Bu mənzil üçün faktura tapılmadı.</Typography>
          ) : (
            <div className="space-y-2">
              {invoices.slice(0, 5).map((invoice) => (
                <div key={invoice.id} className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Typography variant="small" className="font-semibold text-gray-800 dark:text-white truncate">
                      {invoice?.service?.name || "Xidmət"}
                    </Typography>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs truncate">
                      #{invoice?.id} • {invoice?.due_date || "Tarix yoxdur"}
                    </Typography>
                  </div>
                  <div className="text-right">
                    <Typography variant="small" className="font-semibold text-gray-900 dark:text-white">
                      <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />{Number(invoice?.amount || 0).toFixed(2)} ₼
                    </Typography>
                    <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
                      {invoice?.status || "status"}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* <Card className="border border-dashed border-gray-300 dark:border-gray-700 dark:bg-gray-800">
        <CardBody className="flex items-center justify-between gap-3">
          <Typography variant="small" className="text-gray-600 dark:text-gray-300">
            Mənzil seçimi navbar-dan idarə olunur. Seçim dəyişəndə bu səhifə avtomatik yenilənir.
          </Typography>
          <Button size="sm" variant="outlined" className="normal-case" onClick={() => navigate("/resident/home")}>Panelə qayıt</Button>
        </CardBody>
      </Card> */}
    </div>
  );
}
