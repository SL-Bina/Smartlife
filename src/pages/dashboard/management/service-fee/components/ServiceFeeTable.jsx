import React from "react";
import { useTranslation } from "react-i18next";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CustomCard } from "@/components/ui/CustomCard";
import { CustomTypography } from "@/components/ui/CustomTypography";
import { CustomButton } from "@/components/ui/CustomButton";

export function ServiceFeeTable({ serviceFees, loading, pagination, onPageChange, onEdit, onDelete }) {
  const { t } = useTranslation();

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString("az-AZ", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price) => {
    if (!price) return "—";
    return `${parseFloat(price).toFixed(2)} AZN`;
  };

  const getStatusColor = (status) => {
    return status === "active" ? "green" : "gray";
  };

  const getTypeLabel = (type) => {
    const types = {
      weekly: "Həftəlik",
      monthly: "Aylıq",
      yearly: "İllik",
    };
    return types[type] || type;
  };

  return (
    <CustomCard className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <CustomTypography variant="h6" className="dark:text-white">
          Service Fee-lər
        </CustomTypography>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <th className="px-4 py-3 text-left">
                <CustomTypography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">
                  Service
                </CustomTypography>
              </th>
              <th className="px-4 py-3 text-left">
                <CustomTypography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">
                  Qiymət
                </CustomTypography>
              </th>
              <th className="px-4 py-3 text-left">
                <CustomTypography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">
                  Tip
                </CustomTypography>
              </th>
              <th className="px-4 py-3 text-left">
                <CustomTypography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">
                  Başlanğıc
                </CustomTypography>
              </th>
              <th className="px-4 py-3 text-left">
                <CustomTypography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">
                  Növbəti
                </CustomTypography>
              </th>
              <th className="px-4 py-3 text-left">
                <CustomTypography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </CustomTypography>
              </th>
              <th className="px-4 py-3 text-right">
                <CustomTypography variant="small" className="font-semibold text-gray-700 dark:text-gray-300">
                  Əməliyyatlar
                </CustomTypography>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <CustomTypography variant="small" className="text-gray-500 dark:text-gray-400">
                    Yüklənir...
                  </CustomTypography>
                </td>
              </tr>
            ) : serviceFees.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <CustomTypography variant="small" className="text-gray-500 dark:text-gray-400">
                    Heç bir service fee tapılmadı
                  </CustomTypography>
                </td>
              </tr>
            ) : (
              serviceFees.map((fee) => (
                <tr
                  key={fee.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <CustomTypography variant="small" className="font-semibold text-gray-900 dark:text-white">
                        {fee?.service?.name || "—"}
                      </CustomTypography>
                      {fee?.service?.description && (
                        <CustomTypography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                          {fee.service.description}
                        </CustomTypography>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <CustomTypography variant="small" className="text-gray-900 dark:text-white font-semibold">
                      {formatPrice(fee.price)}
                    </CustomTypography>
                  </td>
                  <td className="px-4 py-3">
                    <CustomTypography variant="small" className="text-gray-700 dark:text-gray-300">
                      {getTypeLabel(fee.type)}
                    </CustomTypography>
                  </td>
                  <td className="px-4 py-3">
                    <CustomTypography variant="small" className="text-gray-700 dark:text-gray-300">
                      {formatDate(fee.start_date)}
                    </CustomTypography>
                  </td>
                  <td className="px-4 py-3">
                    <CustomTypography variant="small" className="text-gray-700 dark:text-gray-300">
                      {formatDate(fee.next_date)}
                    </CustomTypography>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        fee.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {fee.status === "active" ? "Aktiv" : "Qeyri-aktiv"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <CustomButton
                        size="sm"
                        variant="outlined"
                        onClick={() => onEdit(fee)}
                        className="px-3 py-1.5 text-xs border-amber-500 text-amber-600 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900/20"
                      >
                        <PencilIcon className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </CustomButton>
                      <CustomButton
                        size="sm"
                        variant="outlined"
                        onClick={() => onDelete(fee)}
                        className="px-3 py-1.5 text-xs border-red-500 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <TrashIcon className="h-3.5 w-3.5 mr-1" />
                        Sil
                      </CustomButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.last_page > 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <CustomTypography variant="small" className="text-gray-600 dark:text-gray-400">
            Səhifə {pagination.current_page} / {pagination.last_page} (Cəmi: {pagination.total})
          </CustomTypography>
          <div className="flex gap-2">
            <CustomButton
              size="sm"
              variant="outlined"
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="dark:text-gray-300 dark:border-gray-600"
            >
              Əvvəlki
            </CustomButton>
            <CustomButton
              size="sm"
              variant="outlined"
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="dark:text-gray-300 dark:border-gray-600"
            >
              Növbəti
            </CustomButton>
          </div>
        </div>
      )}
    </CustomCard>
  );
}

