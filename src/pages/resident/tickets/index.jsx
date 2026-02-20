import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography, Spinner, Chip, Button } from "@material-tailwind/react";
import {
  QuestionMarkCircleIcon,
  PlusIcon,
  EyeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import residentTicketsAPI from "./api";
import { TicketDetailModal } from "./components";

// Mock data
const mockTickets = [
  {
    id: 1,
    title: "Lift Problemi",
    description: "Liftdə səs-küy var və düzgün işləmir. Zəhmət olmasa baxın.",
    status: "pending",
    created_at: "2026-02-20T10:00:00Z",
    ticket_number: "TKT-001",
  },
  {
    id: 2,
    title: "Su Sızıntısı",
    description: "Mənzildə su sızıntısı var. Təcili təmir lazımdır.",
    status: "in_progress",
    created_at: "2026-02-18T14:30:00Z",
    ticket_number: "TKT-002",
  },
];

const ResidentTicketsPage = () => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await residentTicketsAPI.getAll();
      setTickets(response?.data?.data || response?.data || mockTickets);
    } catch (err) {
      // Use mock data on error
      setTickets(mockTickets);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "in_progress":
        return "blue";
      case "resolved":
      case "completed":
        return "green";
      case "cancelled":
      case "closed":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: t("resident.tickets.status.pending") || "Gözləyir",
      in_progress: t("resident.tickets.status.inProgress") || "İcrada",
      resolved: t("resident.tickets.status.resolved") || "Həll olunub",
      completed: t("resident.tickets.status.completed") || "Tamamlanıb",
      cancelled: t("resident.tickets.status.cancelled") || "Ləğv edilib",
      closed: t("resident.tickets.status.closed") || "Bağlanıb",
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("az-AZ", {
        year: "numeric",
        month: "short",
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
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-700 dark:to-purple-900 p-4 sm:p-6 rounded-xl shadow-lg border border-purple-500 dark:border-purple-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <QuestionMarkCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <Typography variant="h4" className="text-white font-bold">
                {t("resident.tickets.pageTitle") || t("sidebar.applicationsList") || "Biletlər"}
              </Typography>
              <Typography variant="small" className="text-purple-100 dark:text-purple-200">
                {tickets.length} {t("resident.tickets.ticket") || "bilet"}
              </Typography>
            </div>
          </div>
          <Button
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            size="sm"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {t("resident.tickets.create") || "Yeni Bilet"}
          </Button>
        </div>
      </div>

      {/* Tickets List */}
      {!tickets || tickets.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <Typography className="text-lg text-gray-500 dark:text-gray-400 font-semibold mb-2">
            {t("resident.tickets.noTickets") || "Bilet tapılmadı"}
          </Typography>
          <Typography variant="small" className="text-gray-400 dark:text-gray-500 mb-4">
            {t("resident.tickets.noTicketsDesc") || "Hələ heç bir biletiniz yoxdur"}
          </Typography>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            size="sm"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {t("resident.tickets.create") || "Yeni Bilet Yarat"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
                <CardBody className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Typography variant="h6" className="text-gray-800 dark:text-gray-200 font-bold mb-1">
                        {ticket.title || t("resident.tickets.ticket") || "Bilet"}
                      </Typography>
                      <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                        #{ticket.id || ticket.ticket_number}
                      </Typography>
                    </div>
                    <Chip
                      value={getStatusLabel(ticket.status)}
                      color={getStatusColor(ticket.status)}
                      size="sm"
                      className="text-xs"
                    />
                  </div>

                  <Typography variant="small" className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {ticket.description || ticket.message || ""}
                  </Typography>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      <Typography variant="small" className="text-gray-500 dark:text-gray-500">
                        {formatDate(ticket.created_at || ticket.date)}
                      </Typography>
                    </div>
                  </div>

                  <Button
                    variant="outlined"
                    size="sm"
                    className="w-full flex items-center justify-center gap-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20"
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setDetailModalOpen(true);
                    }}
                  >
                    <EyeIcon className="h-4 w-4" />
                    {t("resident.tickets.view") || "Bax"}
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedTicket(null);
        }}
        ticketId={selectedTicket?.id}
      />
    </div>
  );
};

export default ResidentTicketsPage;
