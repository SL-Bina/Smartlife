import React from "react";
import { Card, CardBody, Typography, Input, Button } from "@material-tailwind/react";
import { ArrowDownTrayIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function KPIActions({ startDate, endDate, onStartDateChange, onEndDateChange, onSearchClick, onExcelExport, onPDFExport }) {
  const { t } = useTranslation();

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800 mb-6">
      <CardBody className="p-6 dark:bg-gray-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 w-full lg:w-auto">
            <Typography variant="small" className="text-blue-gray-600 dark:text-gray-300 font-medium whitespace-nowrap pt-2">
              {t("kpi.timeRange")}:
            </Typography>
            <div className="flex flex-col sm:flex-row gap-3 flex-1 sm:flex-initial">
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  label={t("kpi.startDate")}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  containerProps={{ className: "min-w-[240px]" }}
                />
                {startDate && (
                  <button
                    onClick={() => onStartDateChange("")}
                    className="text-blue-gray-400 hover:text-blue-gray-600 dark:text-gray-400 dark:hover:text-gray-300 text-xl leading-none w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={t("kpi.clear")}
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  label={t("kpi.endDate")}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                  containerProps={{ className: "min-w-[240px]" }}
                />
                {endDate && (
                  <button
                    onClick={() => onEndDateChange("")}
                    className="text-blue-gray-400 hover:text-blue-gray-600 dark:text-gray-400 dark:hover:text-gray-300 text-xl leading-none w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={t("kpi.clear")}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
            <Button
              variant="outlined"
              color="blue-gray"
              size="sm"
              onClick={onExcelExport}
              className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>{t("kpi.excel")}</span>
            </Button>
            <Button
              variant="outlined"
              color="blue-gray"
              size="sm"
              onClick={onPDFExport}
              className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              <span>{t("kpi.pdf")}</span>
            </Button>
            <Button
              color="blue"
              size="sm"
              onClick={onSearchClick}
              className="flex items-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span>{t("kpi.search")}</span>
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

