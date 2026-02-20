import React from "react";
import { Card, CardBody, Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function InvoicesCardList({ invoices, loading, onView, onEdit, onDelete }) {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    const statusMap = {
      paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      not_paid: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      overdue: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      declined: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      draft: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      pre_paid: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return statusMap[status] || statusMap.not_paid;
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      paid: "Ödənilib",
      not_paid: "Ödənilməmiş",
      pending: "Gözləyir",
      overdue: "Gecikmiş",
      declined: "Rədd edilib",
      draft: "Qaralama",
      pre_paid: "Ön ödəniş",
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("az-AZ", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return dateString;
    }
  };

  const calculateRemaining = (amount, amountPaid) => {
    const remaining = parseFloat(amount || 0) - parseFloat(amountPaid || 0);
    return remaining.toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10 lg:hidden">
        <Typography variant="small" className="text-gray-500 dark:text-gray-400">
          Yüklənir...
        </Typography>
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="flex items-center justify-center py-10 lg:hidden">
        <Typography variant="small" className="text-gray-500 dark:text-gray-400">
          Faktura tapılmadı
        </Typography>
      </div>
    );
  }

  return (
    <div className="lg:hidden flex flex-col gap-4 px-4">
      {invoices.map((invoice) => {
        const remaining = calculateRemaining(invoice.amount, invoice.amount_paid);
        
        return (
          <Card 
            key={invoice.id} 
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50"
          >
            <CardBody className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Typography variant="h6" className="text-gray-700 dark:text-gray-300 font-semibold">
                  ID: {invoice.id}
                </Typography>
                <Menu placement="left-start">
                  <MenuHandler>
                    <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                      <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                    </IconButton>
                  </MenuHandler>
                  <MenuList className="dark:bg-gray-800 dark:border-gray-800">
                    <MenuItem onClick={() => onView(invoice)} className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2">
                      <EyeIcon className="h-4 w-4" />
                      Bax
                    </MenuItem>
                    <MenuItem onClick={() => onEdit(invoice)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                      Redaktə et
                    </MenuItem>
                    <MenuItem onClick={() => onDelete(invoice)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                      Sil
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>

              <div className="space-y-2">
                <div>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                    Xidmət
                  </Typography>
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold">
                    {invoice.service?.name || "-"}
                  </Typography>
                </div>

                <div>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                    Mənzil
                  </Typography>
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                    {invoice.property?.name || "-"}
                  </Typography>
                  {invoice.property?.complex?.name && (
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                      {invoice.property.complex.name}
                    </Typography>
                  )}
                </div>

                {invoice.residents && invoice.residents.length > 0 && (
                  <div>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                      Sakinlər
                    </Typography>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {invoice.residents.slice(0, 3).map((resident) => (
                        <Typography key={resident.id} variant="small" className="text-gray-700 dark:text-gray-300">
                          {resident.name}
                        </Typography>
                      ))}
                      {invoice.residents.length > 3 && (
                        <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                          +{invoice.residents.length - 3} daha
                        </Typography>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                      Məbləğ
                    </Typography>
                    <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold">
                      {parseFloat(invoice.amount || 0).toFixed(2)} ₼
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                      Ödənilmiş
                    </Typography>
                    <Typography variant="small" className="text-green-600 dark:text-green-400 font-semibold">
                      {parseFloat(invoice.amount_paid || 0).toFixed(2)} ₼
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                      Qalıq
                    </Typography>
                    <Typography
                      variant="small"
                      className={`font-semibold ${parseFloat(remaining) > 0 ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      {remaining} ₼
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                      Status
                    </Typography>
                    <Chip
                      value={getStatusLabel(invoice.status)}
                      className={`${getStatusColor(invoice.status)} text-xs font-medium mt-1`}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                      Başlama tarixi
                    </Typography>
                    <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                      {formatDate(invoice.start_date)}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                      Son tarix
                    </Typography>
                    <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                      {formatDate(invoice.due_date)}
                    </Typography>
                  </div>
                </div>

                {invoice.payment_method?.name && (
                  <div>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                      Ödəniş metodu
                    </Typography>
                    <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                      {invoice.payment_method.name}
                    </Typography>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
