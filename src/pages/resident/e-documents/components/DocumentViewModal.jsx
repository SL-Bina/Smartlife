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
  BookOpenIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import residentEDocumentsAPI from "../api";

export function DocumentViewModal({ open, onClose, documentId }) {
  const { t } = useTranslation();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && documentId) {
      fetchDocumentDetails();
    } else {
      setDocument(null);
      setError(null);
    }
  }, [open, documentId]);

  const fetchDocumentDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await residentEDocumentsAPI.getById(documentId);
      if (response?.success && response?.data) {
        setDocument(response.data);
      } else {
        setError(response?.message || "Məlumat tapılmadı");
      }
    } catch (err) {
      // Mock data on error
      setDocument({
        id: documentId,
        name: "Ödəniş Qəbzisi",
        type: "Qəbzi",
        description: "Yanvar ayı üçün ödəniş qəbzisi",
        created_at: "2026-02-01T10:00:00Z",
        file_name: "payment-receipt-january.pdf",
        file_size: "245 KB",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!document) return;
    try {
      const blob = await residentEDocumentsAPI.download(document.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.file_name || document.name || `document-${document.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Mock download
      alert(t("resident.documents.download") || "Yükləmə simulyasiya edildi");
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
          <BookOpenIcon className="h-5 w-5 text-indigo-500" />
          <Typography variant="h5" className="font-bold">
            {t("resident.documents.pageTitle") || "Sənəd Detalları"}
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
        ) : document ? (
          <div className="space-y-6">
            {/* Document Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h5" className="font-bold text-gray-800 dark:text-white mb-1">
                    {document.name || document.title || t("resident.documents.document") || "Sənəd"}
                  </Typography>
                  {document.type && (
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                      {document.type}
                    </Typography>
                  )}
                </div>
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <BookOpenIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
                </div>
              </div>
            </div>

            {/* Description */}
            {document.description && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <Typography variant="h6" className="font-bold mb-3 text-gray-800 dark:text-white">
                  {t("invoices.form.description") || "Təsvir"}
                </Typography>
                <Typography variant="small" className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {document.description}
                </Typography>
              </div>
            )}

            {/* File Info */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <Typography variant="h6" className="font-bold mb-4 text-gray-800 dark:text-white">
                {t("documents.fileInfo") || "Fayl Məlumatları"}
              </Typography>
              <div className="space-y-2">
                {document.file_name && (
                  <div className="flex justify-between">
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                      {t("documents.fileName") || "Fayl adı"}:
                    </Typography>
                    <Typography variant="small" className="font-semibold text-gray-800 dark:text-white">
                      {document.file_name}
                    </Typography>
                  </div>
                )}
                {document.file_size && (
                  <div className="flex justify-between">
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                      {t("documents.fileSize") || "Fayl ölçüsü"}:
                    </Typography>
                    <Typography variant="small" className="font-semibold text-gray-800 dark:text-white">
                      {document.file_size}
                    </Typography>
                  </div>
                )}
              </div>
            </div>

            {/* Date */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <Typography variant="h6" className="font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {t("properties.dates") || "Tarix"}
              </Typography>
              <Typography variant="small" className="font-semibold text-gray-800 dark:text-white">
                {formatDate(document.created_at || document.date)}
              </Typography>
            </div>
          </div>
        ) : null}
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <Button
          variant="text"
          color="gray"
          onClick={onClose}
          className="mr-2"
        >
          {t("buttons.close") || "Bağla"}
        </Button>
        <Button
          variant="filled"
          color="green"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <DocumentArrowDownIcon className="h-4 w-4" />
          {t("resident.documents.download") || "Yüklə"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

