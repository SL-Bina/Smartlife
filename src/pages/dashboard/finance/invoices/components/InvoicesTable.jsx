import React from "react";
import { Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function InvoicesTable({ invoices, loading, onView, onEdit, onDelete }) {
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
      <div className="flex items-center justify-center py-10">
        <Typography variant="small" className="text-gray-500 dark:text-gray-400">
          Yüklənir...
        </Typography>
      </div>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <div className="flex items-center justify-center py-10">
        <Typography variant="small" className="text-gray-500 dark:text-gray-400">
          Faktura tapılmadı
        </Typography>
      </div>
    );
  }

  return (
    <div className="hidden lg:block overflow-x-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/30">
      <table className="w-full table-auto min-w-[1200px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900/50">
            <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
              <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                ID
              </Typography>
            </th>
            <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
              <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                Xidmət
              </Typography>
            </th>
            <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
              <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                Mənzil
              </Typography>
            </th>
            <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
              <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                Sakinlər
              </Typography>
            </th>
            <th className="px-4 xl:px-6 py-3 xl:py-4 text-right">
              <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                Məbləğ
              </Typography>
            </th>
            <th className="px-4 xl:px-6 py-3 xl:py-4 text-right">
              <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                Ödənilmiş
              </Typography>
            </th>
            <th className="px-4 xl:px-6 py-3 xl:py-4 text-right">
              <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                Qalıq
              </Typography>
            </th>
            <th className="px-4 xl:px-6 py-3 xl:py-4 text-center">
              <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                Status
              </Typography>
            </th>
            <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
              <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                Başlama tarixi
              </Typography>
            </th>
            <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
              <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                Son tarix
              </Typography>
            </th>
            <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
              <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                Ödəniş metodu
              </Typography>
            </th>
            <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
              <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                Əməliyyatlar
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {invoices.map((invoice, index) => {
            const remaining = calculateRemaining(invoice.amount, invoice.amount_paid);
            
            return (
              <tr 
                key={invoice.id} 
                className="transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-medium">
                    {invoice.id}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold">
                    {invoice.service?.name || "-"}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                    {invoice.property?.name || "-"}
                  </Typography>
                  {invoice.property?.complex?.name && (
                    <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
                      {invoice.property.complex.name}
                    </Typography>
                  )}
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  {invoice.residents && invoice.residents.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {invoice.residents.slice(0, 2).map((resident) => (
                        <Typography key={resident.id} variant="small" className="text-gray-700 dark:text-gray-300">
                          {resident.name}
                        </Typography>
                      ))}
                      {invoice.residents.length > 2 && (
                        <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
                          +{invoice.residents.length - 2} daha
                        </Typography>
                      )}
                    </div>
                  ) : (
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                      -
                    </Typography>
                  )}
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-right">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300 font-semibold">
                    {parseFloat(invoice.amount || 0).toFixed(2)} ₼
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-right">
                  <Typography variant="small" className="text-green-600 dark:text-green-400 font-semibold">
                    {parseFloat(invoice.amount_paid || 0).toFixed(2)} ₼
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-right">
                  <Typography
                    variant="small"
                    className={`font-semibold ${parseFloat(remaining) > 0 ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {remaining} ₼
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-center">
                  <Chip
                    value={getStatusLabel(invoice.status)}
                    className={`${getStatusColor(invoice.status)} text-xs font-medium`}
                    size="sm"
                  />
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                    {formatDate(invoice.start_date)}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                    {formatDate(invoice.due_date)}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="text-gray-700 dark:text-gray-300">
                    {invoice.payment_method?.name || "-"}
                  </Typography>
                </td>
                <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap text-left">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
