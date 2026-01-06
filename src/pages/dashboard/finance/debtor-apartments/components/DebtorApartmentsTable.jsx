import React from "react";
import { Typography, IconButton } from "@material-tailwind/react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DebtorApartmentsTable({ apartments, onView }) {
  const { t } = useTranslation();

  return (
    <div className="hidden lg:block overflow-x-auto rounded-lg">
      <table className="w-full table-auto min-w-[1200px]">
        <thead>
          <tr >
            {[
              t("debtorApartments.table.id") || "Id",
              t("debtorApartments.table.apartment") || "Mənzil",
              t("debtorApartments.table.owner") || "Mənzil sahibi",
              t("debtorApartments.table.building") || "Bina",
              t("debtorApartments.table.block") || "Blok",
              t("debtorApartments.table.floor") || "Mərtəbə",
              t("debtorApartments.table.rooms") || "Otaq",
              t("debtorApartments.table.area") || "Kv.m",
              t("debtorApartments.table.invoiceCount") || "Faktura sayı",
              t("debtorApartments.table.totalDebt") || "Ümumi borc",
              t("debtorApartments.table.operations") || "Əməliyyatlar",
            ].map((el, idx) => (
              <th
                key={el}
                className={`border-b border-blue-gray-200 dark:border-gray-700 py-4 px-6 text-left ${
                  idx === 10 ? "text-right" : ""
                }`}
              >
                <Typography
                  variant="small"
                  className="text-[11px] font-bold uppercase text-blue-gray-700 dark:text-gray-300"
                >
                  {el}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {apartments.map((row, key) => {
            const className = `py-3 px-6 ${
              key === apartments.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
            }`;
            return (
              <tr
                key={row.id || key}
                onClick={() => onView(row)}
                className={`
                  ${key % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-800/50"}
                  hover:bg-blue-50 dark:hover:bg-gray-700/70 
                  transition-all duration-200 
                  cursor-pointer
                  group
                `}
              >
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="font-medium dark:text-gray-300">
                    {row.id || "N/A"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {row.apartment || "N/A"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.owner || "-"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.building || "N/A"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.block || "N/A"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.floor || "N/A"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.rooms || "N/A"}
                  </Typography>
                </td>
                <td className={className}>
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {row.area ? `${row.area} m²` : "N/A"}
                  </Typography>
                </td>
                <td className={className}>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {row.invoiceCount || 0}
                  </span>
                </td>
                <td className={className}>
                  <Typography
                    variant="small"
                    color="red"
                    className="font-bold dark:text-red-400"
                  >
                    {row.totalDebt ? `${row.totalDebt} AZN` : "0 AZN"}
                  </Typography>
                </td>
                <td className={`${className} text-right`} onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    size="sm"
                    variant="text"
                    color="blue-gray"
                    onClick={() => onView(row)}
                    className="dark:text-gray-300 dark:hover:bg-blue-600/20 hover:bg-blue-100"
                  >
                    <EyeIcon strokeWidth={2} className="h-5 w-5" />
                  </IconButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

