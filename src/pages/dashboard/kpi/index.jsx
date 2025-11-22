import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { CalendarIcon, ArrowDownTrayIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Mock data - real app-də API-dən gələcək
const kpiData = [
  {
    id: 1,
    employeeName: "55newusertest2",
    employeeSurname: "55newusertest",
    department: "Təyin edilməyib",
    totalCreated: 0,
    totalClosed: 0,
    onTimeCompleted: { count: 0, percentage: 0.0 },
    priorityReport: {
      medium: { count: 0, percentage: 0.0 },
      high: { count: 0, percentage: 0.0 },
      urgent: { count: 0, percentage: 0.0 },
      low: { count: 0, percentage: 0.0 },
      fiveMinute: { count: 0, percentage: 0.0 },
    },
    averageCompletionTime: "0 dəq",
    delayCount: 0,
    utilization: {
      workHours: 24.5,
      spentHours: "0 dəq",
      percentage: 0.0,
    },
    repeatedRequests: 0,
    averageResponseTime: "0 dəq",
    workOrdersPerDay: {
      perDay: 0,
      total: 0,
      days: 20,
    },
  },
  {
    id: 2,
    employeeName: "Adgozel",
    employeeSurname: "Adgozelov",
    department: "Texniki şöbə",
    totalCreated: 5,
    totalClosed: 3,
    onTimeCompleted: { count: 0, percentage: 0.0 },
    priorityReport: {
      medium: { count: 1, percentage: 20.0 },
      high: { count: 1, percentage: 20.0 },
      urgent: { count: 3, percentage: 60.0 },
      low: { count: 0, percentage: 0.0 },
      fiveMinute: { count: 0, percentage: 0.0 },
    },
    averageCompletionTime: "269 saat, 36 dəq",
    delayCount: 3,
    utilization: {
      workHours: 68,
      spentHours: "807 saat, 40 dəq",
      percentage: 1187.74,
    },
    repeatedRequests: 0,
    averageResponseTime: "5 dəq",
    workOrdersPerDay: {
      perDay: 0.3,
      total: 5,
      days: 20,
    },
  },
  {
    id: 3,
    employeeName: "Ahmed",
    employeeSurname: "Ahmedov",
    department: "Texniki şöbə",
    totalCreated: 0,
    totalClosed: 0,
    onTimeCompleted: { count: 0, percentage: 0.0 },
    priorityReport: {
      medium: { count: 0, percentage: 0.0 },
      high: { count: 0, percentage: 0.0 },
      urgent: { count: 0, percentage: 0.0 },
      low: { count: 0, percentage: 0.0 },
      fiveMinute: { count: 0, percentage: 0.0 },
    },
    averageCompletionTime: "0 dəq",
    delayCount: 0,
    utilization: {
      workHours: 0,
      spentHours: "0 dəq",
      percentage: 0.0,
    },
    repeatedRequests: 0,
    averageResponseTime: "0 dəq",
    workOrdersPerDay: {
      perDay: 0,
      total: 0,
      days: 20,
    },
  },
  {
    id: 4,
    employeeName: "Ahmed",
    employeeSurname: "Ahmedov",
    department: "Texniki şöbə",
    totalCreated: 12,
    totalClosed: 0,
    onTimeCompleted: { count: 0, percentage: 0.0 },
    priorityReport: {
      medium: { count: 8, percentage: 100.0 },
      high: { count: 0, percentage: 0.0 },
      urgent: { count: 0, percentage: 0.0 },
      low: { count: 0, percentage: 0.0 },
      fiveMinute: { count: 0, percentage: 0.0 },
    },
    averageCompletionTime: "0 dəq",
    delayCount: 0,
    utilization: {
      workHours: 0,
      spentHours: "2186 saat, 55 dəq",
      percentage: 0.0,
    },
    repeatedRequests: 0,
    averageResponseTime: "0 dəq",
    workOrdersPerDay: {
      perDay: 0.6,
      total: 12,
      days: 20,
    },
  },
];

const KPIPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("2025-11-01");
  const [endDate, setEndDate] = useState("2025-11-20");
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Search filter states
  const [searchEmployeeName, setSearchEmployeeName] = useState("");
  const [searchEmployeeSurname, setSearchEmployeeSurname] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchDateFrom, setSearchDateFrom] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);
  
  const handleSearchApply = () => {
    setSearchOpen(false);
    // Apply search filters here
  };
  
  const handleSearchClear = () => {
    setSearchEmployeeName("");
    setSearchEmployeeSurname("");
    setSearchDepartment("");
    setSearchDateFrom("");
    setSearchDateTo("");
    setSearchOpen(false);
  };

  return (
    <div className="">
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black dark:bg-black my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-red-600">
        <h3 className="text-white font-bold">{t("kpi.pageTitle")}</h3>
      </div>

      {/* Filters and Actions */}
      <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black mb-6">
        <CardBody className="p-6 dark:bg-black">
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
                    onChange={(e) => setStartDate(e.target.value)}
                    label={t("kpi.startDate")}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    containerProps={{ className: "min-w-[240px]" }}
                  />
                  {startDate && (
                    <button
                      onClick={() => setStartDate("")}
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
                    onChange={(e) => setEndDate(e.target.value)}
                    label={t("kpi.endDate")}
                    className="dark:text-white"
                    labelProps={{ className: "dark:text-gray-400" }}
                    containerProps={{ className: "min-w-[240px]" }}
                  />
                  {endDate && (
                    <button
                      onClick={() => setEndDate("")}
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
                className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>{t("kpi.excel")}</span>
              </Button>
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>{t("kpi.pdf")}</span>
              </Button>
              <Button
                color="blue"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                <span>{t("kpi.search")}</span>
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Search Modal */}
      <Dialog open={searchOpen} handler={setSearchOpen} size="md" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white">{t("kpi.searchModal.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("kpi.searchModal.employeeName")}
            </Typography>
            <Input
              label={t("kpi.searchModal.enterEmployeeName")}
              value={searchEmployeeName}
              onChange={(e) => setSearchEmployeeName(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400 !text-left" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("kpi.searchModal.employeeSurname")}
            </Typography>
            <Input
              label={t("kpi.searchModal.enterEmployeeSurname")}
              value={searchEmployeeSurname}
              onChange={(e) => setSearchEmployeeSurname(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400 !text-left" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("kpi.searchModal.department")}
            </Typography>
            <Input
              label={t("kpi.searchModal.enterDepartment")}
              value={searchDepartment}
              onChange={(e) => setSearchDepartment(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400 !text-left" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("kpi.searchModal.dateFrom")}
              </Typography>
              <Input
                type="date"
                label={t("kpi.searchModal.enterDateFrom")}
                value={searchDateFrom}
                onChange={(e) => setSearchDateFrom(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400 !text-left" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("kpi.searchModal.dateTo")}
              </Typography>
              <Input
                type="date"
                label={t("kpi.searchModal.enterDateTo")}
                value={searchDateTo}
                onChange={(e) => setSearchDateTo(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400 !text-left" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2 dark:bg-black">
          <Button variant="text" color="blue-gray" onClick={handleSearchClear} className="dark:text-gray-300 dark:hover:bg-gray-700">
            {t("buttons.clear")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outlined" color="blue-gray" onClick={() => setSearchOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
              {t("buttons.cancel")}
            </Button>
            <Button color="blue" onClick={handleSearchApply} className="dark:bg-blue-600 dark:hover:bg-blue-700">
              {t("buttons.apply")}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {/* KPI Table */}
      <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black">
        <CardBody className="p-0 dark:bg-black">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("kpi.loading")}
              </Typography>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-[1600px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-black">
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left sticky left-0 bg-gray-50 dark:bg-black z-10 min-w-[180px]">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("kpi.table.employeeInfo")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[150px]">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("kpi.table.totalWorkOrders")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[180px]">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("kpi.table.onTimeCompletion")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[200px]">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("kpi.table.priorityReport")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[180px]">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("kpi.table.averageCompletionTime")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[120px]">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("kpi.table.delay")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[200px]">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("kpi.table.utilization")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[150px]">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("kpi.table.repeatedRequests")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[180px]">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("kpi.table.averageResponseTime")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-4 px-5 text-left min-w-[220px]">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("kpi.table.workOrdersPerDay")}
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {kpiData.map((row, index) => (
                    <tr 
                      key={row.id} 
                      className={`${
                        index % 2 === 0 
                          ? "bg-white dark:bg-black" 
                          : "bg-gray-50 dark:bg-black/50"
                      } hover:bg-blue-gray-50 dark:hover:bg-gray-800/70 transition-colors`}
                    >
                      <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800 sticky left-0 bg-inherit z-10">
                        <div className="flex flex-col gap-1.5">
                          <Typography variant="small" className="font-semibold text-blue-gray-900 dark:text-white text-sm">
                            {row.employeeName}
                          </Typography>
                          <Typography variant="small" className="text-blue-gray-600 dark:text-gray-300 text-sm">
                            {row.employeeSurname}
                          </Typography>
                          <Typography variant="small" className="text-blue-gray-400 dark:text-gray-500 text-xs">
                            {row.department}
                          </Typography>
                        </div>
                      </td>
                      <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                        <div className="flex flex-col gap-1.5">
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                            {t("kpi.created")}: <span className="font-semibold">{row.totalCreated}</span>
                          </Typography>
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                            {t("kpi.completed")}: <span className="font-semibold">{row.totalClosed}</span>
                          </Typography>
                        </div>
                      </td>
                      <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                        <div className="flex flex-col gap-1.5">
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                            {t("kpi.count")}: <span className="font-semibold">{row.onTimeCompleted.count}</span>
                          </Typography>
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                            {t("kpi.percentage")}: <span className="font-semibold">{row.onTimeCompleted.percentage.toFixed(2)}%</span>
                          </Typography>
                        </div>
                      </td>
                      <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                        <div className="flex flex-col gap-1.5">
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                            <span className="font-medium">{t("kpi.medium")}</span> / {row.priorityReport.medium.count} / {row.priorityReport.medium.percentage.toFixed(2)}%
                          </Typography>
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                            <span className="font-medium">{t("kpi.high")}</span> / {row.priorityReport.high.count} / {row.priorityReport.high.percentage.toFixed(2)}%
                          </Typography>
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                            <span className="font-medium">{t("kpi.urgent")}</span> / {row.priorityReport.urgent.count} / {row.priorityReport.urgent.percentage.toFixed(2)}%
                          </Typography>
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                            <span className="font-medium">{t("kpi.low")}</span> / {row.priorityReport.low.count} / {row.priorityReport.low.percentage.toFixed(2)}%
                          </Typography>
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                            <span className="font-medium">{t("kpi.fiveMinute")}</span> / {row.priorityReport.fiveMinute.count} / {row.priorityReport.fiveMinute.percentage.toFixed(2)}%
                          </Typography>
                        </div>
                      </td>
                      <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm font-medium">
                          {row.averageCompletionTime}
                        </Typography>
                      </td>
                      <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm font-semibold">
                          {row.delayCount}
                        </Typography>
                      </td>
                      <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                        <div className="flex flex-col gap-1.5">
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                            {t("kpi.employeeWorkHours")}: <span className="font-semibold">{row.utilization.workHours}</span>
                          </Typography>
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                            {t("kpi.spentHours")}: <span className="font-semibold">{row.utilization.spentHours}</span>
                          </Typography>
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                            {t("kpi.percentage")}: <span className="font-semibold">{row.utilization.percentage.toFixed(2)}%</span>
                          </Typography>
                        </div>
                      </td>
                      <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm font-semibold">
                          {row.repeatedRequests}
                        </Typography>
                      </td>
                      <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm font-medium">
                          {row.averageResponseTime}
                        </Typography>
                      </td>
                      <td className="py-4 px-5 border-b border-blue-gray-50 dark:border-gray-800">
                        <div className="flex flex-col gap-1.5">
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                            {t("kpi.workOrdersPerDayCount")}: <span className="font-semibold">{row.workOrdersPerDay.perDay}</span>
                          </Typography>
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                            {t("kpi.totalWorkOrders")}: <span className="font-semibold">{row.workOrdersPerDay.total}</span>
                          </Typography>
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
                            {t("kpi.daysCount")}: <span className="font-semibold">{row.workOrdersPerDay.days}</span>
                          </Typography>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default KPIPage;

