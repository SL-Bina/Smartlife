import React, { useState, useEffect } from "react";
import { Typography, Spinner } from "@material-tailwind/react";
import {
  QuestionMarkCircleIcon,
  PlusIcon,
  EyeIcon,
  ClockIcon,
  XCircleIcon,
  Squares2X2Icon,
  TableCellsIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import residentTicketsAPI from "./api";
import { TicketDetailModal } from "./components";
import { useComplexColor } from "@/hooks/useComplexColor";

const mockTickets = [
  { id: 1, title: "Lift Problemi", description: "Liftdə səs-küy var və düzgün işləmir. Zəhmət olmasa baxın.", status: "pending",     created_at: "2026-02-20T10:00:00Z", ticket_number: "TKT-001", category: "Texniki" },
  { id: 2, title: "Su Sızıntısı",  description: "Mənzildə su sızıntısı var. Təcili təmir lazımdır.",               status: "in_progress", created_at: "2026-02-18T14:30:00Z", ticket_number: "TKT-002", category: "Bərpa"   },
];

const STATUS_CFG = {
  pending:     { label: "Gözləyir",    cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", Icon: ClockIcon },
  in_progress: { label: "İcrada",      cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",         Icon: ArrowPathIcon },
  resolved:    { label: "Həll olunub", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",     Icon: CheckCircleSolid },
  completed:   { label: "Tamamlanıb",  cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",     Icon: CheckCircleSolid },
  cancelled:   { label: "Ləğv edilib", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",            Icon: XCircleIcon },
  closed:      { label: "Bağlanıb",    cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",           Icon: XCircleIcon },
};

const statusCfg = (s) => STATUS_CFG[s] || { label: s || "-", cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300", Icon: null };

const fmtDate = (d) => {
  if (!d) return "-";
  try { return new Date(d).toLocaleDateString("az-AZ", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return d; }
};

const ResidentTicketsPage = () => {
  const { t } = useTranslation();
  const selectedPropertyId = useSelector((state) => state.property.selectedPropertyId);
  const { color, getRgba, headerStyle } = useComplexColor();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => { fetchTickets(); }, [selectedPropertyId]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = selectedPropertyId ? { property_id: selectedPropertyId } : {};
      const response = await residentTicketsAPI.getAll(params);
      setTickets(response?.data?.data || response?.data || mockTickets);
    } catch {
      setTickets(mockTickets);
    } finally {
      setLoading(false);
    }
  };

  const openCount     = tickets.filter((tk) => ["pending", "in_progress"].includes(tk.status)).length;
  const resolvedCount = tickets.filter((tk) => ["resolved", "completed"].includes(tk.status)).length;

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
        {/* Filter/toggle row */}
        <div className="flex items-center justify-between">
          <div className="h-10 w-48 rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="h-10 w-32 rounded-xl bg-gray-200 dark:bg-gray-700" />
        </div>
        {/* Ticket cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl p-4 border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3">
              <div className="flex items-start justify-between">
                <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
              <div className="space-y-1.5">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="flex gap-2 pt-1">
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-3 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <QuestionMarkCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <Typography variant="h4" className="text-white font-bold">Müraciətlərim</Typography>
              <Typography variant="small" className="text-white/80">{tickets.length} müraciət</Typography>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg border border-white/30 transition-colors">
            <PlusIcon className="h-4 w-4" />
            Yeni Müraciət
          </button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Cəmi",        value: tickets.length, sub: "müraciət",   bg: getRgba(0.08),           border: getRgba(0.2) },
          { label: "Açıq",        value: openCount,      sub: "davam edir", bg: "rgba(234,179,8,0.08)",  border: "rgba(234,179,8,0.25)" },
          { label: "Həll olunub", value: resolvedCount,  sub: "tamamlandı", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.25)" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl p-4 border" style={{ background: card.bg, borderColor: card.border }}>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}</p>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mt-0.5">{card.label}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{card.sub}</p>
          </div>
        ))}
      </div>

      {tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <QuestionMarkCircleIcon className="h-14 w-14 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Müraciət tapılmadı</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Hələ müraciət yaratmamısınız</p>
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
              {tickets.map((ticket, index) => {
                const cfg = statusCfg(ticket.status);
                const SIcon = cfg.Icon;
                return (
                  <motion.div
                    key={ticket.id || index}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg" style={{ background: getRgba(0.1) }}>
                        <QuestionMarkCircleIcon className="h-5 w-5" style={{ color }} />
                      </div>
                      <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.cls}`}>
                        {SIcon && <SIcon className="h-3 w-3" />}{cfg.label}
                      </span>
                    </div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-tight mb-1">{ticket.title || "Müraciət"}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">#{ticket.id || ticket.ticket_number}</p>
                    {ticket.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{ticket.description}</p>
                    )}
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 mb-3">
                      <ClockIcon className="h-3.5 w-3.5 shrink-0" />{fmtDate(ticket.created_at || ticket.date)}
                    </div>
                    <button
                      onClick={() => { setSelectedTicket(ticket); setDetailModalOpen(true); }}
                      className="w-full py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                      style={{ borderColor: color, color }}
                    >
                      Ətraflı
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── Table view ── */}
          {viewMode === "table" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: getRgba(0.08) }}>
                    {["#", "Başlıq", "Kateqoriya", "Tarix", "Status", ""].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, i) => {
                    const cfg = statusCfg(ticket.status);
                    const SIcon = cfg.Icon;
                    return (
                      <tr key={ticket.id || i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                        <td className="px-4 py-3 text-gray-400 dark:text-gray-500 text-xs">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200 max-w-[160px]">
                          <p className="truncate">{ticket.title || "-"}</p>
                          <p className="text-[10px] text-gray-400">#{ticket.id || ticket.ticket_number}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{ticket.category || "-"}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{fmtDate(ticket.created_at || ticket.date)}</td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.cls}`}>
                            {SIcon && <SIcon className="h-3 w-3" />}{cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => { setSelectedTicket(ticket); setDetailModalOpen(true); }}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <EyeIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <TicketDetailModal
        open={detailModalOpen}
        onClose={() => { setDetailModalOpen(false); setSelectedTicket(null); }}
        ticket={selectedTicket}
      />
    </div>
  );
};

export default ResidentTicketsPage;
