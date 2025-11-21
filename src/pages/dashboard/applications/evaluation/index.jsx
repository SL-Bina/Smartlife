import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  IconButton,
  Spinner,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

// Mock data - real app-də API-dən gələcək
const evaluationData = [
  {
    id: 548,
    apartment: "Menzil 500",
    text: "101010",
    department: "Təmizlik",
    image: "lightbulb",
    date: "14.11.2025",
    rating: 5,
  },
  {
    id: 546,
    apartment: "Menzil 500",
    text: "8888888",
    department: "Təmizlik",
    image: "lightbulb",
    date: "12.11.2025",
    rating: 5,
  },
  {
    id: 545,
    apartment: "Menzil 500",
    text: "7777777",
    department: "Təmizlik",
    image: "lightbulb",
    date: "12.11.2025",
    rating: 5,
  },
  {
    id: 544,
    apartment: "Menzil 500",
    text: "666666",
    department: "Təmizlik",
    image: "lightbulb",
    date: "11.11.2025",
    rating: 5,
  },
  {
    id: 543,
    apartment: "Menzil 500",
    text: "55555555",
    department: "Təmizlik",
    image: "lightbulb",
    date: "11.11.2025",
    rating: 5,
  },
  {
    id: 539,
    apartment: "Menzil 500",
    text: "3333333",
    department: "Mühafizə",
    image: "lightbulb",
    date: "11.11.2025",
    rating: 5,
  },
  {
    id: 538,
    apartment: "Menzil 500",
    text: "222222222",
    department: "Mühafizə",
    image: "other",
    date: "11.11.2025",
    rating: 5,
  },
  {
    id: 509,
    apartment: "Menzil 500",
    text: "88888",
    department: "Təmizlik",
    image: "lightbulb",
    date: "11.11.2025",
    rating: 5,
  },
  {
    id: 508,
    apartment: "Menzil 500",
    text: "777777",
    department: "Təmizlik",
    image: "lightbulb",
    date: "11.11.2025",
    rating: 5,
  },
  {
    id: 500,
    apartment: "Menzil 500",
    text: "111111111",
    department: "Təmizlik",
    image: "lightbulb",
    date: "11.11.2025",
    rating: 3,
  },
];

const ITEMS_PER_PAGE = 10;

const ApplicationsEvaluationPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(evaluationData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = evaluationData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <div className="">
      {/* Section title bar */}
      <div className="w-full bg-black dark:bg-gray-900 my-4 p-4 rounded-lg shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <Typography variant="h5" className="text-white font-bold">
            {t("applications.evaluation.pageTitle")}
          </Typography>
          <Button
            color="blue"
            size="sm"
            className="dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
            {t("applications.evaluation.search")}
          </Button>
        </div>
      </div>

      {/* Evaluation Table */}
      <Card className="border border-red-500 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardBody className="p-0 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("applications.evaluation.loading")}
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
                      onClick={() => handleSort("apartment")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.evaluation.table.apartment")} {getSortIcon("apartment")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("text")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.evaluation.table.text")} {getSortIcon("text")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("department")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.evaluation.table.department")} {getSortIcon("department")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.evaluation.table.image")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.evaluation.table.date")} {getSortIcon("date")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("rating")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.evaluation.table.rating")} {getSortIcon("rating")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-700 py-3 px-4 text-left">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.evaluation.table.action")}
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
                          {row.apartment}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-700">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                          {row.text}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-700">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                          {row.department}
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
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                          {row.date}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-700">
                        <div className="flex items-center gap-1">
                          {renderStars(row.rating)}
                        </div>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-700">
                        <Button
                          size="sm"
                          color="blue"
                          className="dark:bg-blue-600 dark:hover:bg-blue-700"
                        >
                          {t("applications.evaluation.details")}
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
        <div className="flex justify-end items-center gap-2 mt-4">
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

export default ApplicationsEvaluationPage;

