import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Spinner,
  Chip,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  QuestionMarkCircleIcon,
  ClockIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import residentTicketsAPI from "../api";

export function TicketDetailModal({ open, onClose, ticketId }) {
  const { t } = useTranslation();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && ticketId) {
      fetchTicketDetails();
    } else {
      setTicket(null);
      setError(null);
    }
  }, [open, ticketId]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await residentTicketsAPI.getById(ticketId);
      if (response?.success && response?.data) {
        setTicket(response.data);
      } else {
        setError(response?.message || "Məlumat tapılmadı");
      }
    } catch (err) {
      // Mock data on error
      setTicket({
        id: ticketId,
        title: "Lift Problemi",
        description: "Liftdə səs-küy var və düzgün işləmir. Zəhmət olmasa baxın.",
        status: "pending",
        created_at: "2026-02-20T10:00:00Z",
        ticket_number: "TKT-001",
        category: "Texniki",
      });
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
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
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
          <QuestionMarkCircleIcon className="h-5 w-5 text-purple-500" />
          <Typography variant="h5" className="font-bold">
            {t("resident.tickets.pageTitle") || "Bilet Detalları"}
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
        ) : ticket ? (
          <div className="space-y-6">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="h5" className="font-bold text-gray-800 dark:text-white">
                  {ticket.title || t("resident.tickets.ticket") || "Bilet"}
                </Typography>
                <Chip
                  value={getStatusLabel(ticket.status)}
                  color={getStatusColor(ticket.status)}
                  size="sm"
                />
              </div>
              <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                {t("resident.tickets.ticket") || "Bilet"} #{ticket.id || ticket.ticket_number}
              </Typography>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <Typography variant="h6" className="font-bold mb-3 text-gray-800 dark:text-white">
                {t("tickets.description") || "Təsvir"}
              </Typography>
              <Typography variant="small" className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {ticket.description || ticket.message || ""}
              </Typography>
            </div>

            {/* Category */}
            {ticket.category && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <Typography variant="h6" className="font-bold mb-2 text-gray-800 dark:text-white flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  {t("tickets.category") || "Kateqoriya"}
                </Typography>
                <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                  {ticket.category}
                </Typography>
              </div>
            )}

            {/* Dates */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <Typography variant="h6" className="font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {t("properties.dates") || "Tarixlər"}
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                    {t("properties.createdAt") || "Yaradılma tarixi"}
                  </Typography>
                  <Typography variant="small" className="font-semibold text-gray-800 dark:text-white">
                    {formatDate(ticket.created_at || ticket.date)}
                  </Typography>
                </div>
                {ticket.updated_at && (
                  <div>
                    <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                      {t("properties.updatedAt") || "Yenilənmə tarixi"}
                    </Typography>
                    <Typography variant="small" className="font-semibold text-gray-800 dark:text-white">
                      {formatDate(ticket.updated_at)}
                    </Typography>
                  </div>
                )}
              </div>
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
      </DialogFooter>
    </Dialog>
  );
}

