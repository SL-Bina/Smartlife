import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

const formatNumber = (num) => {
  return num.toLocaleString("az-AZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function ResidentsReceivablesTable({ residentsReceivablesData, currency }) {
  const { t } = useTranslation();

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 bg-white">
      <CardBody className="p-4 dark:bg-gray-800">
        <Typography variant="h6" color="blue-gray" className="mb-3 font-bold dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
          {t("reports.residentsReceivables.title")}
        </Typography>
        <div>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900">
                <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                  <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                    {t("reports.residentsReceivables.dateRange")}
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                  <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                    {t("reports.residentsReceivables.totalApartments")}
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                  <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                    {t("reports.residentsReceivables.indebtedApartments")}
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                  <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                    {t("reports.residentsReceivables.indebtedInvoices")}
                  </Typography>
                </th>
                <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-right">
                  <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                    {t("reports.residentsReceivables.debtAmount")}
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {residentsReceivablesData.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-50 dark:bg-gray-800/50"
                  } hover:bg-blue-gray-50 dark:hover:bg-gray-800/70 transition-colors`}
                >
                  <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                    <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                      {row.dateRange}
                    </Typography>
                  </td>
                  <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                    <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                      {row.totalApartments}
                    </Typography>
                  </td>
                  <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                    <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                      {row.indebtedApartments}
                    </Typography>
                  </td>
                  <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                    <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                      {row.indebtedInvoices}
                    </Typography>
                  </td>
                  <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800 text-right">
                    <Typography variant="small" className="text-blue-600 dark:text-blue-400 font-semibold">
                      {formatNumber(row.debtAmount)} {currency}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}

