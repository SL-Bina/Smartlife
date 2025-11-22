import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  IconButton,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Chip,
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  
  // Search filter states
  const [searchText, setSearchText] = useState("");
  const [searchApartment, setSearchApartment] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchDateFrom, setSearchDateFrom] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");
  const [searchRating, setSearchRating] = useState("");

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
  
  const handleSearchApply = () => {
    setPage(1);
    setSearchOpen(false);
    // Apply search filters here
  };
  
  const handleSearchClear = () => {
    setSearchText("");
    setSearchApartment("");
    setSearchDepartment("");
    setSearchDateFrom("");
    setSearchDateTo("");
    setSearchRating("");
    setPage(1);
    setSearchOpen(false);
  };
  
  const openDetailsModal = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setDetailsOpen(true);
  };
  
  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedEvaluation(null);
  };

  return (
    <div className="">
      {/* Section title bar */}
      <div className="w-full bg-black dark:bg-black my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-red-600">
        <div className="flex items-center justify-between">
          <Typography variant="h5" className="text-white font-bold">
            {t("applications.evaluation.pageTitle")}
          </Typography>
          <Button
            color="blue"
            size="sm"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            <span>{t("applications.evaluation.search")}</span>
          </Button>
        </div>
      </div>

      {/* Search Modal */}
      <Dialog open={searchOpen} handler={setSearchOpen} size="md" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white">{t("applications.evaluation.searchModal.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("applications.evaluation.searchModal.searchText")}
            </Typography>
            <Input
              label={t("applications.evaluation.searchModal.enterSearchText")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400 !text-left" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("applications.evaluation.searchModal.apartment")}
            </Typography>
            <Input
              label={t("applications.evaluation.searchModal.enterApartment")}
              value={searchApartment}
              onChange={(e) => setSearchApartment(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400 !text-left" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("applications.evaluation.searchModal.department")}
            </Typography>
            <Input
              label={t("applications.evaluation.searchModal.enterDepartment")}
              value={searchDepartment}
              onChange={(e) => setSearchDepartment(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400 !text-left" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("applications.evaluation.searchModal.rating")}
            </Typography>
            <Select
              label={t("applications.evaluation.searchModal.selectRating")}
              value={searchRating}
              onChange={(val) => setSearchRating(val)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400 !text-left" }}
              containerProps={{ className: "!min-w-0" }}
            >
              <Option value="" className="text-center dark:text-gray-300">
                {t("applications.evaluation.searchModal.all")}
              </Option>
              <Option value="5" className="text-center dark:text-gray-300">
                5 ⭐
              </Option>
              <Option value="4" className="text-center dark:text-gray-300">
                4 ⭐
              </Option>
              <Option value="3" className="text-center dark:text-gray-300">
                3 ⭐
              </Option>
              <Option value="2" className="text-center dark:text-gray-300">
                2 ⭐
              </Option>
              <Option value="1" className="text-center dark:text-gray-300">
                1 ⭐
              </Option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("applications.evaluation.searchModal.dateFrom")}
              </Typography>
              <Input
                type="date"
                label={t("applications.evaluation.searchModal.enterDateFrom")}
                value={searchDateFrom}
                onChange={(e) => setSearchDateFrom(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400 !text-left" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("applications.evaluation.searchModal.dateTo")}
              </Typography>
              <Input
                type="date"
                label={t("applications.evaluation.searchModal.enterDateTo")}
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

      {/* Details Modal */}
      {selectedEvaluation && (
        <Dialog open={detailsOpen} handler={handleDetailsClose} size="xl" className="dark:bg-black border border-red-600 dark:border-red-600">
          <DialogHeader className="dark:text-white">{t("applications.evaluation.detailsModal.title")}</DialogHeader>
          <DialogBody divider className="space-y-6 dark:bg-black max-h-[70vh] overflow-y-auto">
            {/* Evaluation ID */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-300">
                {t("applications.evaluation.detailsModal.id")}
              </Typography>
              <Typography variant="h6" color="blue-gray" className="dark:text-white">
                #{selectedEvaluation.id}
              </Typography>
            </div>

            {/* Main Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("applications.evaluation.detailsModal.apartment")}
                </Typography>
                <Typography variant="paragraph" color="blue-gray" className="dark:text-white">
                  {selectedEvaluation.apartment || "-"}
                </Typography>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("applications.evaluation.detailsModal.department")}
                </Typography>
                <Typography variant="paragraph" color="blue-gray" className="dark:text-white">
                  {selectedEvaluation.department || "-"}
                </Typography>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("applications.evaluation.detailsModal.date")}
                </Typography>
                <Typography variant="paragraph" color="blue-gray" className="dark:text-white">
                  {selectedEvaluation.date}
                </Typography>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("applications.evaluation.detailsModal.rating")}
                </Typography>
                <div className="flex items-center gap-2">
                  {renderStars(selectedEvaluation.rating)}
                  <Typography variant="paragraph" color="blue-gray" className="dark:text-white">
                    ({selectedEvaluation.rating}/5)
                  </Typography>
                </div>
              </div>
            </div>

            {/* Text Description */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("applications.evaluation.detailsModal.text")}
              </Typography>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Typography variant="paragraph" color="blue-gray" className="dark:text-white whitespace-pre-wrap">
                  {selectedEvaluation.text || "-"}
                </Typography>
              </div>
            </div>

            {/* Image */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("applications.evaluation.detailsModal.image")}
              </Typography>
              <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                {selectedEvaluation.image === "lightbulb" ? (
                  <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white text-3xl">⚡</span>
                  </div>
                ) : selectedEvaluation.image === "other" ? (
                  <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-3xl">📷</span>
                  </div>
                ) : (
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-400">
                    {t("applications.evaluation.detailsModal.noImage")}
                  </Typography>
                )}
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="flex justify-end gap-2 dark:bg-black">
            <Button variant="outlined" color="blue-gray" onClick={handleDetailsClose} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
              {t("buttons.cancel")}
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {/* Evaluation Table */}
      <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black ">
        <CardBody className="p-0 dark:bg-black">
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
                  <tr className="bg-gray-50 dark:bg-black">
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        ID {getSortIcon("id")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("apartment")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.evaluation.table.apartment")} {getSortIcon("apartment")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("text")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.evaluation.table.text")} {getSortIcon("text")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("department")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.evaluation.table.department")} {getSortIcon("department")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.evaluation.table.image")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.evaluation.table.date")} {getSortIcon("date")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("rating")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.evaluation.table.rating")} {getSortIcon("rating")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
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
                          ? "bg-white dark:bg-black"
                          : "bg-gray-50 dark:bg-black/50"
                      } hover:bg-blue-gray-50 dark:hover:bg-gray-800/70 transition-colors`}
                    >
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 font-semibold">
                          {row.id}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                          {row.apartment}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                          {row.text}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                          {row.department}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
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
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                          {row.date}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                        <div className="flex items-center gap-1">
                          {renderStars(row.rating)}
                        </div>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                        <Button
                          size="sm"
                          color="blue"
                          onClick={() => openDetailsModal(row)}
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

