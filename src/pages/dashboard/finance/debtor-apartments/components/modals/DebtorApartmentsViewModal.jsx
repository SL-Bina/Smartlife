import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { fetchInvoices } from "../../api";

export function DebtorApartmentsViewModal({ open, onClose, apartment, onPay }) {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalDebt, setTotalDebt] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(0);

  useEffect(() => {
    if (open && apartment) {
      const loadInvoices = async () => {
        try {
          setLoading(true);
          const invoicesData = await fetchInvoices(apartment.id);
          setInvoices(invoicesData || []);
          const total = (invoicesData || []).reduce((sum, inv) => sum + parseFloat(inv.remaining || inv.amount || 0), 0);
          setTotalDebt(total);
        } catch (error) {
          console.error("Error loading invoices:", error);
          setInvoices([]);
        } finally {
          setLoading(false);
        }
      };
      loadInvoices();
    } else {
      setInvoices([]);
      setSelectedInvoices([]);
      setTotalDebt(0);
      setSelectedAmount(0);
    }
  }, [open, apartment]);

  const handleCheckboxChange = (invoiceId, checked) => {
    if (checked) {
      const invoice = invoices.find((inv) => inv.id === invoiceId);
      if (invoice) {
        setSelectedInvoices([...selectedInvoices, invoiceId]);
        setSelectedAmount(selectedAmount + parseFloat(invoice.remaining || invoice.amount || 0));
      }
    } else {
      const invoice = invoices.find((inv) => inv.id === invoiceId);
      if (invoice) {
        setSelectedInvoices(selectedInvoices.filter((id) => id !== invoiceId));
        setSelectedAmount(selectedAmount - parseFloat(invoice.remaining || invoice.amount || 0));
      }
    }
  };

  const handlePayClick = () => {
    if (onPay && apartment && selectedInvoices.length > 0) {
      const selectedInvoicesData = invoices.filter((inv) => selectedInvoices.includes(inv.id));
      onPay({ ...apartment, selectedInvoices, selectedInvoicesData, selectedAmount });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "-") return "-";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    } catch {
      return dateString;
    }
  };

  if (!open || !apartment) return null;

  return (
    <Dialog open={open} handler={onClose} size="xl" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <HomeIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
              {apartment.apartment || "N/A"}
            </Typography>
            <Typography variant="small" className="text-gray-600 dark:text-gray-400 mt-0.5">
              {t("debtorApartments.labels.complex") || "Kompleks"}: {apartment.complex || "N/A"}. {t("debtorApartments.labels.building") || "Bina"}: {apartment.building || "N/A"} {t("debtorApartments.labels.floor") || "Mərtəbə"}: {apartment.floor || "N/A"} {t("debtorApartments.labels.rooms") || "Otaq"}: {apartment.rooms || "N/A"} {t("debtorApartments.labels.area") || "Kv.m"}: {apartment.area || "N/A"}
            </Typography>
          </div>
        </div>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-6 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
        {/* Fakturalar başlığı və ümumi borc */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <Typography variant="h6" className="font-bold text-gray-900 dark:text-white">
              {t("debtorApartments.invoices.title") || "Fakturalar"}
            </Typography>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
              {invoices.length}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                {t("debtorApartments.table.totalDebt") || "Ümumi borc"}
              </Typography>
              <Typography variant="h6" className="font-bold text-red-600 dark:text-red-400">
                {totalDebt.toFixed(2)} AZN
              </Typography>
            </div>
            <Button
              color="blue"
              size="md"
              onClick={handlePayClick}
              disabled={selectedInvoices.length === 0 || selectedAmount === 0}
              className="dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg shadow-lg hover:shadow-xl transition-all"
            >
              {t("debtorApartments.actions.pay") || "Ödə"} ({selectedInvoices.length}) - {selectedAmount.toFixed(2)} AZN
            </Button>
          </div>
        </div>

        {/* Fakturalar cədvəli */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Typography variant="small" className="text-blue-gray-400 dark:text-gray-400">
              {t("debtorApartments.actions.loading") || "Yüklənir..."}
            </Typography>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex justify-center py-8">
            <Typography variant="small" className="text-blue-gray-400 dark:text-gray-400">
              {t("debtorApartments.invoices.noInvoices") || "Faktura yoxdur"}
            </Typography>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gradient-to-r  dark:from-gray-800 dark:to-gray-700">
                  {[
                    t("debtorApartments.invoices.table.id") || "Id",
                    t("debtorApartments.invoices.table.invoiceNumber") || "Faktura nömrəsi",
                    t("debtorApartments.invoices.table.title") || "Başlıq",
                    t("debtorApartments.invoices.table.date") || "Tarix",
                    t("debtorApartments.invoices.table.status") || "Status",
                    t("debtorApartments.invoices.table.amount") || "Məbləğ",
                    t("debtorApartments.invoices.table.paid") || "Ödənilib",
                    t("debtorApartments.invoices.table.remaining") || "Qalıq",
                  ].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-200 dark:border-gray-700 py-3 px-4 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-700 dark:text-gray-300"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, key) => {
                  const className = `py-3 px-4 ${
                    key === invoices.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
                  }`;
                  const isSelected = selectedInvoices.includes(invoice.id);
                  const isUnpaid = invoice.status !== "Ödənilib" && parseFloat(invoice.remaining || invoice.amount || 0) > 0;
                  return (
                    <tr
                      key={invoice.id}
                      onClick={() => {
                        if (isUnpaid) {
                          handleCheckboxChange(invoice.id, !isSelected);
                        }
                      }}
                      className={`
                        ${key % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-800/50"}
                        ${isSelected ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500" : ""}
                        ${isUnpaid ? "hover:bg-blue-50 dark:hover:bg-gray-700/70 cursor-pointer" : "cursor-not-allowed opacity-60"}
                        transition-all duration-200
                        group
                      `}
                    >
                      <td className={className} onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleCheckboxChange(invoice.id, e.target.checked)}
                            disabled={!isUnpaid}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <Typography variant="small" color="blue-gray" className="font-medium dark:text-gray-300">
                            {invoice.id}
                          </Typography>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {invoice.invoiceNumber || invoice.number || "N/A"}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {invoice.title || invoice.serviceName || "N/A"}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {formatDate(invoice.date || invoice.invoiceDate)}
                        </Typography>
                      </td>
                      <td className={className}>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isUnpaid
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          {isUnpaid ? t("debtorApartments.invoices.status.unpaid") || "Ödənilməyib" : t("debtorApartments.invoices.status.paid") || "Ödənilib"}
                        </span>
                      </td>
                      <td className={className}>
                        <Typography variant="small" color="blue-gray" className="font-bold dark:text-white">
                          {parseFloat(invoice.amount || 0).toFixed(2)} AZN
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography variant="small" color="green" className="font-bold dark:text-green-300">
                          {parseFloat(invoice.paid || invoice.paidAmount || 0).toFixed(2)} AZN
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          color={parseFloat(invoice.remaining || invoice.remainingAmount || 0) > 0 ? "red" : "blue-gray"}
                          className={`font-bold ${parseFloat(invoice.remaining || invoice.remainingAmount || 0) > 0 ? "dark:text-red-400" : "dark:text-gray-300"}`}
                        >
                          {parseFloat(invoice.remaining || invoice.remainingAmount || invoice.amount || 0).toFixed(2)} AZN
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-3">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buttons.close") || "Bağla"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
