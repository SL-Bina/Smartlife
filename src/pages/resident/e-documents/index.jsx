import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Spinner, Button } from "@material-tailwind/react";
import {
  BookOpenIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import residentEDocumentsAPI from "./api";
import { DocumentViewModal } from "./components";

// Mock data
const mockDocuments = [
  {
    id: 1,
    name: "Ödəniş Qəbzisi",
    type: "Qəbzi",
    description: "Yanvar ayı üçün ödəniş qəbzisi",
    created_at: "2026-02-01T10:00:00Z",
    file_name: "payment-receipt-january.pdf",
  },
  {
    id: 2,
    name: "Müqavilə",
    type: "Müqavilə",
    description: "Mənzil icarə müqaviləsi",
    created_at: "2026-01-15T14:30:00Z",
    file_name: "rental-contract.pdf",
  },
  {
    id: 3,
    name: "Hesabat",
    type: "Hesabat",
    description: "2025-ci il üçün illik hesabat",
    created_at: "2026-01-10T09:00:00Z",
    file_name: "annual-report-2025.pdf",
  },
  {
    id: 4,
    name: "Təlimat",
    type: "Təlimat",
    description: "Kompleks qaydaları və təlimatlar",
    created_at: "2025-12-20T11:15:00Z",
    file_name: "complex-rules.pdf",
  },
];

const ResidentEDocumentsPage = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await residentEDocumentsAPI.getAll();
      setDocuments(response?.data?.data || response?.data || mockDocuments);
    } catch (err) {
      // Use mock data on error
      setDocuments(mockDocuments);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const blob = await residentEDocumentsAPI.download(documentId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `document-${documentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Mock download - just show alert
      alert(t("resident.documents.download") || "Yükləmə simulyasiya edildi");
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" style={{ position: 'relative', zIndex: 0 }}>
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto mb-4" />
          <Typography className="text-sm text-gray-500 dark:text-gray-400">
            {t("common.loading") || "Yüklənir..."}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-700 dark:to-indigo-900 p-4 sm:p-6 rounded-xl shadow-lg border border-indigo-500 dark:border-indigo-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <BookOpenIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-white font-bold">
              {t("resident.documents.pageTitle") || t("sidebar.electronicDocuments") || "Elektron Sənədlər"}
            </Typography>
            <Typography variant="small" className="text-indigo-100 dark:text-indigo-200">
              {documents.length} {t("resident.documents.document") || "sənəd"}
            </Typography>
          </div>
        </div>
      </div>

      {/* Documents List */}
      {!documents || documents.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <BookOpenIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <Typography className="text-lg text-gray-500 dark:text-gray-400 font-semibold mb-2">
            {t("resident.documents.noDocuments") || "Sənəd tapılmadı"}
          </Typography>
          <Typography variant="small" className="text-gray-400 dark:text-gray-500">
            {t("resident.documents.noDocumentsDesc") || "Hələ heç bir sənədiniz yoxdur"}
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {documents.map((document, index) => (
            <motion.div
              key={document.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                <CardBody className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Typography variant="h6" className="text-gray-800 dark:text-gray-200 font-bold mb-1">
                        {document.name || document.title || t("resident.documents.document") || "Sənəd"}
                      </Typography>
                      {document.type && (
                        <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                          {document.type}
                        </Typography>
                      )}
                    </div>
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                      <BookOpenIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                    </div>
                  </div>

                  {document.description && (
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {document.description}
                    </Typography>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Typography variant="small" className="text-gray-500 dark:text-gray-500">
                      {formatDate(document.created_at || document.date)}
                    </Typography>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outlined"
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                      onClick={() => {
                        setSelectedDocument(document);
                        setViewModalOpen(true);
                      }}
                    >
                      <EyeIcon className="h-4 w-4" />
                      {t("resident.documents.view") || "Bax"}
                    </Button>
                    <Button
                      variant="outlined"
                      size="sm"
                      className="flex-1 flex items-center justify-center gap-2 border-green-600 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400 dark:hover:bg-green-900/20"
                      onClick={() => handleDownload(document.id, document.name || document.file_name)}
                    >
                      <DocumentArrowDownIcon className="h-4 w-4" />
                      {t("resident.documents.download") || "Yüklə"}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Document View Modal */}
      <DocumentViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedDocument(null);
        }}
        documentId={selectedDocument?.id}
      />
    </div>
  );
};

export default ResidentEDocumentsPage;
