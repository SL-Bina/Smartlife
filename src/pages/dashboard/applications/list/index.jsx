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
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
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
  const [viewMode, setViewMode] = useState("list"); // "calendar" or "list"
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [newApplicationOpen, setNewApplicationOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  // Search filter states
  const [searchText, setSearchText] = useState("");
  const [searchApartment, setSearchApartment] = useState("");
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDateFrom, setSearchDateFrom] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");
  
  // Category filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // New application form states
  const [formApartmentEmployee, setFormApartmentEmployee] = useState("");
  const [formText, setFormText] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formResidentPriority, setFormResidentPriority] = useState("");
  const [formOperationPriority, setFormOperationPriority] = useState("");
  const [formStatus, setFormStatus] = useState("Gözləmədə");
  const [formDate, setFormDate] = useState("");

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
      case "completed":
      case "Tamamlandı":
        return "green";
      case "pending":
      case "Gözləmədə":
        return "orange";
      case "cancelled":
      case "Ləğv edildi":
        return "red";
      case "accepted":
      case "Qəbul edildi":
        return "blue";
      case "inProgress":
      case "İcraya başalınıldı":
        return "purple";
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
  
  const getStatusTranslation = (status) => {
    if (!status) return "";
    // Try direct translation first - this will work for both English keys and Azerbaijani values
    try {
      const translation = t(`applicationStatus.${status}`);
      // If translation exists and is different from the key, return it
      if (translation && translation !== `applicationStatus.${status}`) {
        return translation;
      }
    } catch (e) {
      // If translation key doesn't exist, continue to switch case
    }
    // Fallback to switch case
    switch (status) {
      case "pending":
      case "Gözləmədə":
        return t("applicationStatus.pending");
      case "completed":
      case "Tamamlandı":
        return t("applicationStatus.completed");
      case "accepted":
      case "Qəbul edildi":
        return t("applicationStatus.accepted");
      case "inProgress":
      case "İcraya başalınıldı":
        return t("applicationStatus.inProgress");
      case "cancelled":
      case "Ləğv edildi":
        return t("applicationStatus.cancelled");
      default:
        return status;
    }
  };
  
  const getStatusValue = (status) => {
    // Convert Azerbaijani status to English key
    switch (status) {
      case "Gözləmədə":
        return "pending";
      case "Tamamlandı":
        return "completed";
      case "Qəbul edildi":
        return "accepted";
      case "İcraya başalınıldı":
        return "inProgress";
      case "Ləğv edildi":
        return "cancelled";
      default:
        return status;
    }
  };
  
  const getPriorityTranslation = (priority, type = "resident") => {
    if (type === "resident") {
      switch (priority) {
        case "Normal":
          return t("applications.list.newApplicationModal.priorityNormal");
        case "Orta":
          return t("applications.list.newApplicationModal.priorityMedium");
        case "Yüksək":
          return t("applications.list.newApplicationModal.priorityHigh");
        case "Aşağı":
          return t("applications.list.newApplicationModal.priorityLow");
        default:
          return priority;
      }
    } else {
      switch (priority) {
        case "Tecili":
          return t("applications.list.newApplicationModal.priorityUrgent");
        case "5 deqiqelik":
          return t("applications.list.newApplicationModal.priority5Minute");
        case "Orta":
          return t("applications.list.newApplicationModal.priorityMedium");
        case "Aşağı":
          return t("applications.list.newApplicationModal.priorityLow");
        default:
          return priority;
      }
    }
  };
  
  const getCategoryTranslation = (category) => {
    switch (category) {
      case "Təmizlik":
        return t("applications.list.categoryModal.cleaning");
      case "Santexnika":
        return t("applications.list.categoryModal.plumbing");
      case "Elektrik":
        return t("applications.list.categoryModal.electricity");
      case "Təmir":
        return t("applications.list.categoryModal.repair");
      case "Digər":
        return t("applications.list.categoryModal.other");
      default:
        return category || "";
    }
  };
  
  const getSelectedStatusDisplay = (status) => {
    if (!status) return t("applications.list.searchModal.all");
    return getStatusTranslation(status);
  };
  
  const getSelectedCategoryDisplay = (category) => {
    if (!category) return t("applications.list.categoryModal.all");
    return getCategoryTranslation(category);
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
    setSearchStatus("");
    setSearchDateFrom("");
    setSearchDateTo("");
    setPage(1);
    setSearchOpen(false);
  };
  
  const handleCategoryApply = () => {
    setPage(1);
    setCategoryOpen(false);
    // Apply category filter here
  };
  
  const handleCategoryClear = () => {
    setSelectedCategory("");
    setPage(1);
    setCategoryOpen(false);
  };
  
  const openNewApplicationModal = () => {
    setFormApartmentEmployee("");
    setFormText("");
    setFormDepartment("");
    setFormResidentPriority("");
    setFormOperationPriority("");
    setFormStatus("Gözləmədə");
    setFormDate(new Date().toISOString().split('T')[0]);
    setNewApplicationOpen(true);
  };
  
  const handleNewApplicationSave = () => {
    // Save new application logic here
    setNewApplicationOpen(false);
    // Reset form
    setFormApartmentEmployee("");
    setFormText("");
    setFormDepartment("");
    setFormResidentPriority("");
    setFormOperationPriority("");
    setFormStatus("Gözləmədə");
    setFormDate("");
  };
  
  const handleNewApplicationCancel = () => {
    setNewApplicationOpen(false);
    setFormApartmentEmployee("");
    setFormText("");
    setFormDepartment("");
    setFormResidentPriority("");
    setFormOperationPriority("");
    setFormStatus("Gözləmədə");
    setFormDate("");
  };
  
  const openDetailsModal = (application) => {
    setSelectedApplication(application);
    setDetailsOpen(true);
  };
  
  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedApplication(null);
  };

  return (
    <div className="">
      {/* Section title bar */}
      <div className="w-full bg-black dark:bg-black my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-red-600">
        <Typography variant="h5" className="text-white font-bold">
          {t("applications.list.pageTitle")}
        </Typography>
      </div>

      {/* Navigation/Filter Bar */}
      <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black  mb-6">
        <CardBody className="p-4 dark:bg-black">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={viewMode === "calendar" ? "filled" : "outlined"}
                color={viewMode === "calendar" ? "blue" : "blue-gray"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className={`flex items-center gap-2 ${
                  viewMode === "calendar"
                    ? "dark:bg-blue-600 dark:hover:bg-blue-700"
                    : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <CalendarIcon className="h-4 w-4" />
                <span>{t("applications.list.calendar")}</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "filled" : "outlined"}
                color={viewMode === "list" ? "blue" : "blue-gray"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 ${
                  viewMode === "list"
                    ? "dark:bg-blue-600 dark:hover:bg-blue-700"
                    : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <ListBulletIcon className="h-4 w-4" />
                <span>{t("applications.list.list")}</span>
              </Button>
              <Button
                variant="outlined"
                color="blue-gray"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                <span>{t("applications.list.search")}</span>
              </Button>
              <Button
                variant="outlined"
                color="pink"
                size="sm"
                onClick={() => setCategoryOpen(true)}
                className="flex items-center gap-2 dark:border-pink-600 dark:text-pink-300 dark:hover:bg-pink-700/20"
              >
                <TagIcon className="h-4 w-4" />
                <span>{t("applications.list.category")}</span>
              </Button>
              <Button
                variant="outlined"
                color="green"
                size="sm"
                className="flex items-center gap-2 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-700/20"
              >
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>{t("applications.list.excelExport")}</span>
              </Button>
              <Button
                variant="outlined"
                color="purple"
                size="sm"
                className="flex items-center gap-2 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-700/20"
              >
                <SparklesIcon className="h-4 w-4" />
                <span>{t("applications.list.priorities")}</span>
              </Button>
            </div>
            <Button
              color="green"
              size="sm"
              onClick={openNewApplicationModal}
              className="dark:bg-green-600 dark:hover:bg-green-700"
            >
              {t("applications.list.newApplication")}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Search Modal */}
      <Dialog open={searchOpen} handler={setSearchOpen} size="md" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white">{t("applications.list.searchModal.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("applications.list.searchModal.searchText")}
            </Typography>
            <Input
              label={t("applications.list.searchModal.enterSearchText")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("applications.list.searchModal.apartment")}
            </Typography>
            <Input
              label={t("applications.list.searchModal.enterApartment")}
              value={searchApartment}
              onChange={(e) => setSearchApartment(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("applications.list.searchModal.department")}
            </Typography>
            <Input
              label={t("applications.list.searchModal.enterDepartment")}
              value={searchDepartment}
              onChange={(e) => setSearchDepartment(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("applications.list.searchModal.status")}
            </Typography>
            <Select
              label={t("applications.list.searchModal.selectStatus")}
              value={searchStatus || ""}
              onChange={(val) => setSearchStatus(val)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400 !text-left" }}
              containerProps={{ className: "!min-w-0" }}
            >
              <Option value="" className=" dark:text-gray-300">
                {t("applications.list.searchModal.all")}
              </Option>
              <Option value="pending" className=" dark:text-gray-300">
                {t("applicationStatus.pending")}
              </Option>
              <Option value="completed" className=" dark:text-gray-300">
                {t("applicationStatus.completed")}
              </Option>
              <Option value="cancelled" className=" dark:text-gray-300">
                {t("applicationStatus.cancelled")}
              </Option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("applications.list.searchModal.dateFrom")}
              </Typography>
              <Input
                type="date"
                label={t("applications.list.searchModal.enterDateFrom")}
                value={searchDateFrom}
                onChange={(e) => setSearchDateFrom(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("applications.list.searchModal.dateTo")}
              </Typography>
              <Input
                type="date"
                label={t("applications.list.searchModal.enterDateTo")}
                value={searchDateTo}
                onChange={(e) => setSearchDateTo(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
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

      {/* Category Modal */}
      <Dialog open={categoryOpen} handler={setCategoryOpen} size="sm" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white">{t("applications.list.categoryModal.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("applications.list.categoryModal.category")}
            </Typography>
            <Select
              label={t("applications.list.categoryModal.selectCategory")}
              value={selectedCategory || ""}
              onChange={(val) => setSelectedCategory(val)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400 !text-left" }}
              containerProps={{ className: "!min-w-0" }}
            >
              <Option value="" className="text-center dark:text-gray-300">
                {t("applications.list.categoryModal.all")}
              </Option>
              <Option value="Təmizlik" className="text-center dark:text-gray-300">
                {t("applications.list.categoryModal.cleaning")}
              </Option>
              <Option value="Santexnika" className="text-center dark:text-gray-300">
                {t("applications.list.categoryModal.plumbing")}
              </Option>
              <Option value="Elektrik" className="text-center dark:text-gray-300">
                {t("applications.list.categoryModal.electricity")}
              </Option>
              <Option value="Təmir" className="text-center dark:text-gray-300">
                {t("applications.list.categoryModal.repair")}
              </Option>
              <Option value="Digər" className="text-center dark:text-gray-300">
                {t("applications.list.categoryModal.other")}
              </Option>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2 dark:bg-black">
          <Button variant="text" color="blue-gray" onClick={handleCategoryClear} className="dark:text-gray-300 dark:hover:bg-gray-700">
            {t("buttons.clear")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outlined" color="blue-gray" onClick={() => setCategoryOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
              {t("buttons.cancel")}
            </Button>
            <Button color="pink" onClick={handleCategoryApply} className="dark:bg-pink-600 dark:hover:bg-pink-700">
              {t("buttons.apply")}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {/* New Application Modal */}
      <Dialog open={newApplicationOpen} handler={setNewApplicationOpen} size="lg" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white">{t("applications.list.newApplicationModal.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("applications.list.newApplicationModal.apartmentEmployee")}
              </Typography>
              <Input
                label={t("applications.list.newApplicationModal.enterApartmentEmployee")}
                value={formApartmentEmployee}
                onChange={(e) => setFormApartmentEmployee(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("applications.list.newApplicationModal.department")}
              </Typography>
              <Select
                label={t("applications.list.newApplicationModal.selectDepartment")}
                value={formDepartment || ""}
                onChange={(val) => setFormDepartment(val)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400 !text-left" }}
                containerProps={{ className: "!min-w-0" }}
              >
                <Option value="" className="text-center dark:text-gray-300">
                  {t("applications.list.newApplicationModal.selectOption")}
                </Option>
                <Option value="Təmizlik" className="text-center dark:text-gray-300">
                  {t("applications.list.categoryModal.cleaning")}
                </Option>
                <Option value="Santexnika" className="text-center dark:text-gray-300">
                  {t("applications.list.categoryModal.plumbing")}
                </Option>
                <Option value="Elektrik" className="text-center dark:text-gray-300">
                  {t("applications.list.categoryModal.electricity")}
                </Option>
                <Option value="Təmir" className="text-center dark:text-gray-300">
                  {t("applications.list.categoryModal.repair")}
                </Option>
                <Option value="Digər" className="text-center dark:text-gray-300">
                  {t("applications.list.categoryModal.other")}
                </Option>
              </Select>
            </div>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("applications.list.newApplicationModal.text")}
            </Typography>
            <Input
              label={t("applications.list.newApplicationModal.enterText")}
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label={t("applications.list.newApplicationModal.selectResidentPriority")}
                value={formResidentPriority || ""}
                onChange={(val) => setFormResidentPriority(val)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400 !text-left" }}
                containerProps={{ className: "!min-w-0" }}
              >
                <Option value="" className="text-center dark:text-gray-300">
                  {t("applications.list.newApplicationModal.selectOption")}
                </Option>
                <Option value="Normal" className="text-center dark:text-gray-300">
                  {t("applications.list.newApplicationModal.priorityNormal")}
                </Option>
                <Option value="Orta" className="text-center dark:text-gray-300">
                  {t("applications.list.newApplicationModal.priorityMedium")}
                </Option>
                <Option value="Yüksək" className="text-center dark:text-gray-300">
                  {t("applications.list.newApplicationModal.priorityHigh")}
                </Option>
                <Option value="Aşağı" className="text-center dark:text-gray-300">
                  {t("applications.list.newApplicationModal.priorityLow")}
                </Option>
              </Select>
            </div>
            <div>
              <Select
                label={t("applications.list.newApplicationModal.selectOperationPriority")}
                value={formOperationPriority || ""}
                onChange={(val) => setFormOperationPriority(val)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400 !text-left" }}
                containerProps={{ className: "!min-w-0" }}
              >
                <Option value="" className="text-center dark:text-gray-300">
                  {t("applications.list.newApplicationModal.selectOption")}
                </Option>
                <Option value="Tecili" className="text-center dark:text-gray-300">
                  {t("applications.list.newApplicationModal.priorityUrgent")}
                </Option>
                <Option value="5 deqiqelik" className="text-center dark:text-gray-300">
                  {t("applications.list.newApplicationModal.priority5Minute")}
                </Option>
                <Option value="Aşağı" className="text-center dark:text-gray-300">
                  {t("applications.list.newApplicationModal.priorityLow")}
                </Option>
                <Option value="Orta" className="text-center dark:text-gray-300">
                  {t("applications.list.newApplicationModal.priorityMedium")}
                </Option>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label={t("applications.list.newApplicationModal.selectStatus")}
                value={formStatus || ""}
                onChange={(val) => setFormStatus(val)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400 !text-left" }}
                containerProps={{ className: "!min-w-0" }}
              >
                <Option value="Gözləmədə" className="text-center dark:text-gray-300">
                  {t("applicationStatus.pending")}
                </Option>
                <Option value="Tamamlandı" className="text-center dark:text-gray-300">
                  {t("applicationStatus.completed")}
                </Option>
                <Option value="Qəbul edildi" className="text-center dark:text-gray-300">
                  {t("applicationStatus.accepted")}
                </Option>
                <Option value="İcraya başalınıldı" className="text-center dark:text-gray-300">
                  {t("applicationStatus.inProgress")}
                </Option>
                <Option value="Ləğv edildi" className="text-center dark:text-gray-300">
                  {t("applicationStatus.cancelled")}
                </Option>
              </Select>
            </div>
            <div>
              <Input
                type="date"
                label={t("applications.list.newApplicationModal.enterDate")}
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400 !text-left" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
          </div>
          <div>
            <Input
              type="file"
              accept="image/*"
              label={t("applications.list.newApplicationModal.selectImage")}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400 !text-left" }}
              containerProps={{ className: "!min-w-0" }}
              onChange={(e) => {
                // Handle file upload
              }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-black">
          <Button variant="outlined" color="blue-gray" onClick={handleNewApplicationCancel} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.cancel")}
          </Button>
          <Button color="green" onClick={handleNewApplicationSave} className="dark:bg-green-600 dark:hover:bg-green-700">
            {t("buttons.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Details Modal */}
      {selectedApplication && (
        <Dialog open={detailsOpen} handler={handleDetailsClose} size="xl" className="dark:bg-black border border-red-600 dark:border-red-600">
          <DialogHeader className="dark:text-white">{t("applications.list.detailsModal.title")}</DialogHeader>
          <DialogBody divider className="space-y-6 dark:bg-black max-h-[70vh] overflow-y-auto">
            {/* Application ID */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-300">
                {t("applications.list.detailsModal.id")}
              </Typography>
              <Typography variant="h6" color="blue-gray" className="dark:text-white">
                #{selectedApplication.id}
              </Typography>
            </div>

            {/* Main Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("applications.list.detailsModal.apartmentEmployee")}
                </Typography>
                <Typography variant="paragraph" color="blue-gray" className="dark:text-white">
                  {selectedApplication.apartmentEmployee || "-"}
                </Typography>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("applications.list.detailsModal.department")}
                </Typography>
                <Typography variant="paragraph" color="blue-gray" className="dark:text-white">
                  {selectedApplication.department || "-"}
                </Typography>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("applications.list.detailsModal.residentPriority")}
                </Typography>
                {selectedApplication.residentPriority !== "-" ? (
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        getPriorityColor(selectedApplication.residentPriority) === "green"
                          ? "bg-green-500"
                          : getPriorityColor(selectedApplication.residentPriority) === "orange"
                          ? "bg-orange-500"
                          : getPriorityColor(selectedApplication.residentPriority) === "yellow"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    />
                    <Typography variant="paragraph" color="blue-gray" className="dark:text-white">
                      {selectedApplication.residentPriority}
                    </Typography>
                  </div>
                ) : (
                  <Typography variant="paragraph" color="blue-gray" className="dark:text-gray-400">
                    -
                  </Typography>
                )}
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("applications.list.detailsModal.operationPriority")}
                </Typography>
                <Typography variant="paragraph" color="blue-gray" className="dark:text-white">
                  {selectedApplication.operationPriority || "-"}
                </Typography>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("applications.list.detailsModal.status")}
                </Typography>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      getStatusColor(selectedApplication.status) === "green"
                        ? "bg-green-500"
                        : getStatusColor(selectedApplication.status) === "orange"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  />
                  <Typography variant="paragraph" color="blue-gray" className="dark:text-white">
                    {selectedApplication.status}
                  </Typography>
                </div>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                  {t("applications.list.detailsModal.date")}
                </Typography>
                <Typography variant="paragraph" color="blue-gray" className="dark:text-white">
                  {selectedApplication.date}
                </Typography>
              </div>
            </div>

            {/* Text Description */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("applications.list.detailsModal.text")}
              </Typography>
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <Typography variant="paragraph" color="blue-gray" className="dark:text-white whitespace-pre-wrap">
                  {selectedApplication.text || "-"}
                </Typography>
              </div>
            </div>

            {/* Image */}
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("applications.list.detailsModal.image")}
              </Typography>
              <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                {selectedApplication.image === "lightbulb" ? (
                  <div className="w-20 h-20 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white text-3xl">⚡</span>
                  </div>
                ) : selectedApplication.image === "other" ? (
                  <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-3xl">📷</span>
                  </div>
                ) : (
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-400">
                    {t("applications.list.detailsModal.noImage")}
                  </Typography>
                )}
              </div>
            </div>

            {/* New Badge */}
            {selectedApplication.isNew && (
              <div className="flex items-center gap-2">
                <Chip
                  value={t("applications.list.new")}
                  color="red"
                  size="sm"
                  className="dark:bg-red-600 dark:text-white"
                />
                <Typography variant="small" color="blue-gray" className="dark:text-gray-400">
                  {t("applications.list.detailsModal.newApplication")}
                </Typography>
              </div>
            )}
          </DialogBody>
          <DialogFooter className="flex justify-end gap-2 dark:bg-black">
            <Button variant="outlined" color="blue-gray" onClick={handleDetailsClose} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
              {t("buttons.cancel")}
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {/* Applications Table */}
      <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black">
        <CardBody className="p-0 dark:bg-black">
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
                      onClick={() => handleSort("apartmentEmployee")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.apartmentEmployee")} {getSortIcon("apartmentEmployee")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("text")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.text")} {getSortIcon("text")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("department")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.department")} {getSortIcon("department")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.residentPriority")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.operationPriority")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.image")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.status")} {getSortIcon("status")}
                      </Typography>
                    </th>
                    <th
                      className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                        {t("applications.list.table.date")} {getSortIcon("date")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
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
                          {row.apartmentEmployee}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
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
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                          {row.department}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
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
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                          {row.operationPriority}
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
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                          {row.date}
                        </Typography>
                      </td>
                      <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                        <Button
                          size="sm"
                          color="blue"
                          onClick={() => openDetailsModal(row)}
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

