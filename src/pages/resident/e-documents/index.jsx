import React, { useState, useEffect } from "react";
import { Typography, Spinner } from "@material-tailwind/react";
import {
  BookOpenIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  CalendarIcon,
  Squares2X2Icon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import residentEDocumentsAPI from "./api";
import { DocumentViewModal } from "./components";
import { useComplexColor } from "@/hooks/useComplexColor";

const fmtDate = (d) => {
  if (!d) return "-";
  try { return new Date(d).toLocaleDateString("az-AZ", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return d; }
};

const ResidentEDocumentsPage = () => {
  const { t } = useTranslation();
  const selectedPropertyId = useSelector((state) => state.property.selectedPropertyId);
  const { color, getRgba, headerStyle } = useComplexColor();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("card");

  const mockDocuments = [
    { id: 1, name: "Ödəniş Qəbzisi", type: "Qəbzi",    description: "Yanvar ayı üçün ödəniş qəbzisi", created_at: "2026-02-01T10:00:00Z", file_name: "payment-receipt-january.pdf" },
    { id: 2, name: "Müqavilə",       type: "Müqavilə", description: "Mənzil icarə müqaviləsi",            created_at: "2026-01-15T14:30:00Z", file_name: "rental-contract.pdf" },
    { id: 3, name: "Hesabat",         type: "Hesabat",  description: "2025-ci il üçün illik hesabat",    created_at: "2026-01-10T09:00:00Z", file_name: "annual-report-2025.pdf" },
    { id: 4, name: "Təlimat",         type: "Təlimat",  description: "Kompleks qaydaları və təlimatlar",  created_at: "2025-12-20T11:15:00Z", file_name: "complex-rules.pdf" },
  ];

  useEffect(() => { fetchDocuments(); }, [selectedPropertyId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = selectedPropertyId ? { property_id: selectedPropertyId } : {};
      const response = await residentEDocumentsAPI.getAll(params);
      setDocuments(response?.data?.data || response?.data || mockDocuments);
    } catch {
      setDocuments(mockDocuments);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (doc) => {
    try {
      const blob = await residentEDocumentsAPI.download(doc.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.file_name || doc.name || `document-${doc.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Yükləmə simulyasiya edildi");
    }
  };

  if (loading) {
    return (
      <div className="space-y-5 animate-pulse" style={{ position: "relative", zIndex: 0 }}>
        {/* Header */}
        <div className="h-[80px] rounded-xl bg-gray-200 dark:bg-gray-700" />
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl h-[76px] bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
        {/* Toggle row */}
        <div className="flex items-center justify-between">
          <div className="h-10 w-40 rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 w-24 rounded-lg bg-gray-200 dark:bg-gray-700" />
        </div>
        {/* Document cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl p-4 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3">
              <div className="flex items-start justify-between">
                <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
              <div className="space-y-1.5">
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex gap-2 pt-1">
                <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-8 flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5" style={{ position: "relative", zIndex: 0 }}>

      {/* ── Header ── */}
      <div className="p-4 sm:p-6 rounded-xl shadow-lg border" style={headerStyle}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <BookOpenIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-white font-bold">Elektron Sənədlər</Typography>
            <Typography variant="small" className="text-white/80">{documents.length} sənəd</Typography>
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Cəmi",     value: documents.length,                                                                         sub: "sənəd",  bg: getRgba(0.08),             border: getRgba(0.2) },
          { label: "Qəbz",     value: documents.filter((d) => (d.type || "").toLowerCase().includes("qəbz")).length,            sub: "qəbz",   bg: "rgba(99,102,241,0.08)",  border: "rgba(99,102,241,0.25)" },
          { label: "Müqavilə", value: documents.filter((d) => (d.type || "").toLowerCase().includes("müqavil")).length,        sub: "sənəd",  bg: "rgba(20,184,166,0.08)",  border: "rgba(20,184,166,0.25)" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl p-4 border" style={{ background: card.bg, borderColor: card.border }}>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}</p>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-0.5">{card.label}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{card.sub}</p>
          </div>
        ))}
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <BookOpenIcon className="h-14 w-14 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Sənəd tapılmadı</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Hələ heç bir sənədiniz yoxdur</p>
        </div>
      ) : (
        <>
          {/* ── View toggle ── */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Görünüş:</span>
            <div className="inline-flex items-center gap-0.5 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-800">
              {[
                { key: "card",  label: "Kart",   Icon: Squares2X2Icon },
                { key: "table", label: "Cədvəl", Icon: TableCellsIcon },
              ].map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    viewMode === key ? "text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                  style={viewMode === key ? { background: color } : {}}
                >
                  <Icon className="h-3.5 w-3.5" />{label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Card view ── */}
          {viewMode === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id || index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg" style={{ background: getRgba(0.1) }}>
                      <BookOpenIcon className="h-5 w-5" style={{ color }} />
                    </div>
                    {doc.type && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                        {doc.type}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-tight mb-1">{doc.name || doc.title || "Sənəd"}</p>
                  {doc.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{doc.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 mb-3">
                    <CalendarIcon className="h-3.5 w-3.5 shrink-0" />{fmtDate(doc.created_at || doc.date)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedDocument(doc); setViewModalOpen(true); }}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                      style={{ borderColor: color, color }}
                    >
                      Bax
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold border border-green-500 text-green-600 dark:border-green-400 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                    >
                      Yüklə
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* ── Table view ── */}
          {viewMode === "table" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: getRgba(0.08) }}>
                    {["#", "Ad", "Növ", "Tarix", "", ""].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, i) => (
                    <tr key={doc.id || i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                      <td className="px-4 py-3 text-gray-400 dark:text-gray-500 text-xs">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 max-w-[180px]">
                        <p className="truncate">{doc.name || doc.title || "-"}</p>
                        {doc.file_name && <p className="text-[10px] text-gray-400 truncate">{doc.file_name}</p>}
                      </td>
                      <td className="px-4 py-3">
                        {doc.type
                          ? <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">{doc.type}</span>
                          : <span className="text-gray-400 text-xs">-</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{fmtDate(doc.created_at || doc.date)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => { setSelectedDocument(doc); setViewModalOpen(true); }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          title="Bax"
                        >
                          <EyeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                          title="Yüklə"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <DocumentViewModal
        open={viewModalOpen}
        onClose={() => { setViewModalOpen(false); setSelectedDocument(null); }}
        document={selectedDocument}
      />
    </div>
  );
};

export default ResidentEDocumentsPage;
