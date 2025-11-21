import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  IconButton,
  Spinner,
  Chip,
} from "@material-tailwind/react";
import {
  CalendarIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

// Mock data - real app-də API-dən gələcək
const applicationsData = [
  {
    id: 583,
    apartmentEmployee: "1A_sakin_menzili",
    text: "test",
    department: "-",
    residentPriority: "Normal",
    operationPriority: "-",
    image: "lightbulb",
    status: "Gözləmədə",
    date: "21.11.2025",
  },
  {
    id: 582,
    apartmentEmployee: "-",
    text: "test",
    department: "Təmizlik",
    residentPriority: "-",
    operationPriority: "Tecili",
    image: "lightbulb",
    status: "Gözləmədə",
    date: "20.11.2025",
    isNew: true,
  },
  {
    id: 549,
    apartmentEmployee: "Menzil 500",
    text: "111222",
    department: "-",
    residentPriority: "-",
    operationPriority: "-",
    image: "lightbulb",
    status: "Ləğv edildi",
    date: "19.11.2025",
  },
  {
    id: 548,
    apartmentEmployee: "-",
    text: "101010",
    department: "-",
    residentPriority: "Normal",
    operationPriority: "5 deqiqelik",
    image: "lightbulb",
    status: "Tamamlandı",
    date: "14.11.2025",
    isNew: true,
  },
  {
    id: 547,
    apartmentEmployee: "-",
    text: "99999999",
    department: "-",
    residentPriority: "Yüksək",
    operationPriority: "5 deqiqelik",
    image: "lightbulb",
    status: "Tamamlandı",
    date: "13.11.2025",
    isNew: true,
  },
  {
    id: 546,
    apartmentEmployee: "-",
    text: "8888888",
    department: "-",
    residentPriority: "Orta",
    operationPriority: "5 deqiqelik",
    image: "lightbulb",
    status: "Tamamlandı",
    date: "12.11.2025",
    isNew: true,
  },
  {
    id: 545,
    apartmentEmployee: "-",
    text: "7777777",
    department: "-",
    residentPriority: "Orta",
    operationPriority: "5 deqiqelik",
    image: "lightbulb",
    status: "Tamamlandı",
    date: "11.11.2025",
    isNew: true,
  },
  {
    id: 544,
    apartmentEmployee: "-",
    text: "666666",
    department: "-",
    residentPriority: "Normal",
    operationPriority: "5 deqiqelik",
    image: "lightbulb",
    status: "Tamamlandı",
    date: "10.11.2025",
    isNew: true,
  },
  {
    id: 543,
    apartmentEmployee: "-",
    text: "55555555",
    department: "-",
    residentPriority: "-",
    operationPriority: "Aşağı",
    image: "lightbulb",
    status: "Tamamlandı",
    date: "09.11.2025",
    isNew: true,
  },
  {
    id: 540,
    apartmentEmployee: "-",
    text: "4444444444",
    department: "-",
    residentPriority: "Yüksək",
    operationPriority: "-",
    image: "other",
    status: "Gözləmədə",
    date: "08.11.2025",
    isNew: true,
  },
];

const ITEMS_PER_PAGE = 10;

const ApplicationsListPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(applicationsData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = applicationsData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column) => {
    if (sortColumn !== column) return "↑↓";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Tamamlandı":
        return "green";
      case "Gözləmədə":
        return "orange";
      case "Ləğv edildi":
        return "red";
      default:
        return "gray";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Normal":
        return "green";
      case "Yüksək":
        return "orange";
      case "Orta":
        return "yellow";
      default:
        return "gray";
    }
  };

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <div className="">
      {/* Section title bar */}
      <div className="w-full bg-black dark:bg-gray-900 my-4 p-4 rounded-lg shadow-lg mb-6">
        <Typography variant="h5" className="text-white font-bold">
          {t("applications.list.pageTitle")}
        </Typography>
      </div>

      {/* Navigation/Filter Bar */}
      <Card className="border border-red-500 shadow-sm dark:bg-gray-800 dark:border-gray-700 mb-6">
        <CardBody className="p-4 dark:bg-gray-800">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <CalendarIcon className="h-4 w-4 mr-1" />
                {t("applications.list.calendar")}
              </Button>
              <Button
                variant="filled"
                color="blue"
                size="sm"
                className="dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <ListBulletIcon className="h-4 w-4 mr-1" />
                {t("applications.list.list")}
              </Button>
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
                {t("applications.list.search")}
              </Button>
              <Button
                variant="outlined"
                color="pink"
                size="sm"
                className="dark:border-pink-600 dark:text-pink-300 dark:hover:bg-pink-700"
              >
                <TagIcon className="h-4 w-4 mr-1" />
                {t("applications.list.category")}
              </Button>
              <Button
                variant="outlined"
                color="green"
                size="sm"
                className="dark:border-green-600 dark:text-green-300 dark:hover:bg-green-700"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                {t("applications.list.excelExport")}
              </Button>
              <Button
                variant="outlined"
                color="purple"
                size="sm"
                className="dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-700"
              >
                <SparklesIcon className="h-4 w-4 mr-1" />
                {t("applications.list.priorities")}
              </Button>
            </div>
            <Button
              color="green"
              size="sm"
              className="dark:bg-green-600 dark:hover:bg-green-700"
            >
              {t("applications.list.newApplication")}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Applications Table */}
      <Card className="border border-red-500 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardBody className="p-0 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("applications.list.loading")}
              </Typography>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        ID {getSortIcon("id")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("apartmentEmployee")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.apartmentEmployee")} {getSortIcon("apartmentEmployee")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("text")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.text")} {getSortIcon("text")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("department")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.department")} {getSortIcon("department")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.residentPriority")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.operationPriority")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.image")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.status")} {getSortIcon("status")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.date")} {getSortIcon("date")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.action")}
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-900/50"
                      } hover:bg-blue-gray-50 dark:hover:bg-gray-800/70 transition-colors`}
                    >
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-700">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 font-semibold">
                          {row.id}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-700">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                          {row.apartmentEmployee}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          {row.isNew && (
                            <Chip
                              value={t("applications.list.new")}
                              color="red"
                              size="sm"
                              className="dark:bg-red-600 dark:text-white"
                            />
                          )}
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                            {row.text}
                          </Typography>
                        </div>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-700">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                          {row.department}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-700">
                        {row.residentPriority !== "-" ? (
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                getPriorityColor(row.residentPriority) === "green"
                                  ? "bg-green-500"
                                  : getPriorityColor(row.residentPriority) === "orange"
                                  ? "bg-orange-500"
                                  : getPriorityColor(row.residentPriority) === "yellow"
                                  ? "bg-yellow-500"
                                  : "bg-gray-500"
                              }`}
                            />
                            <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                              {row.residentPriority}
                            </Typography>
                          </div>
                        ) : (
                          <Typography variant="small" className="text-blue-gray-400 dark:text-gray-500">
                            -
                          </Typography>
                        )}
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-700">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                          {row.operationPriority}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-700">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            row.image === "lightbulb"
                              ? "bg-orange-500"
                              : "bg-blue-500"
                          }`}
                        >
                          <span className="text-white text-xs">⚡</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              getStatusColor(row.status) === "green"
                                ? "bg-green-500"
                                : getStatusColor(row.status) === "orange"
                                ? "bg-orange-500"
                                : "bg-red-500"
                            }`}
                          />
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                            {row.status}
                          </Typography>
                        </div>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-700">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                          {row.date}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-700">
                        <Button
                          size="sm"
                          color="blue"
                          className="dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                          {t("applications.list.details")}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Pagination */}
      {!loading && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <IconButton
            variant="outlined"
            size="sm"
            onClick={handlePrev}
            disabled={page === 1}
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            &lt;
          </IconButton>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <IconButton
              key={pageNum}
              variant={page === pageNum ? "filled" : "outlined"}
              color="blue"
              size="sm"
              onClick={() => setPage(pageNum)}
              className={
                page === pageNum
                  ? "dark:bg-blue-600 dark:hover:bg-blue-700"
                  : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              }
            >
              {pageNum}
            </IconButton>
          ))}
          <IconButton
            variant="outlined"
            size="sm"
            onClick={handleNext}
            disabled={page === totalPages}
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            &gt;
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default ApplicationsListPage;

