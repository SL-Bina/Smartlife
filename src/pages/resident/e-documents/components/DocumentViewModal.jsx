import React from "react";
import { Dialog, DialogBody } from "@material-tailwind/react";
import {
  XMarkIcon,
  BookOpenIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  TagIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import residentEDocumentsAPI from "../api";
import { useComplexColor } from "@/hooks/useComplexColor";

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm shrink-0">
        {Icon && <Icon className="h-4 w-4 shrink-0" />}{label}
      </div>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right max-w-[60%] truncate">{value || "-"}</span>
    </div>
  );
}

const fmtDate = (d) => {
  if (!d) return "-";
  try { return new Date(d).toLocaleDateString("az-AZ", { year: "numeric", month: "long", day: "numeric" }); }
  catch { return d; }
};

export function DocumentViewModal({ open, onClose, document: doc }) {
  const { color, getRgba } = useComplexColor();

  const handleDownload = async () => {
    if (!doc) return;
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

  if (!doc) return null;

  return (
    <Dialog open={open} handler={onClose} size="md" className="dark:bg-gray-800 !max-w-lg">
      <div
        className="flex items-center justify-between px-5 py-4 rounded-t-xl"
        style={{ background: `linear-gradient(135deg, ${color}, ${getRgba(0.75)})` }}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <BookOpenIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Sənəd Detalları</p>
            <p className="text-white/70 text-xs">#{doc.id}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      <DialogBody className="p-5 space-y-4">
        {/* Name + type banner */}
        <div
          className="rounded-xl p-4 flex items-center justify-between gap-3"
          style={{ background: getRgba(0.06), border: `1px solid ${getRgba(0.15)}` }}
        >
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 dark:text-white text-base truncate">{doc.name || doc.title || "Sənəd"}</p>
            {doc.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{doc.description}</p>
            )}
          </div>
          {doc.type && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
              {doc.type}
            </span>
          )}
        </div>

        {/* Detail rows */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl px-4 py-1">
          <Row icon={CalendarIcon} label="Tarix"    value={fmtDate(doc.created_at || doc.date)} />
          <Row icon={TagIcon}      label="Növ"      value={doc.type} />
          <Row icon={DocumentIcon} label="Fayl adı" value={doc.file_name} />
          {doc.file_size && <Row icon={null} label="Həcm" value={doc.file_size} />}
        </div>

        {/* Footer buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: color }}
          >
            <DocumentArrowDownIcon className="h-4 w-4" />Yüklə
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Bağla
          </button>
        </div>
      </DialogBody>
    </Dialog>
  );
}

export default DocumentViewModal;
