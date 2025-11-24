import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Chip,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  UserGroupIcon,
  PencilIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const data = [
  { id: 1, name: "Admin", status: "Aktiv" },
  { id: 2, name: "Moderator", status: "Aktiv" },
  { id: 3, name: "Property Owner", status: "Aktiv" },
  { id: 4, name: "Family member", status: "Aktiv" },
  { id: 5, name: "Tenant", status: "Aktiv" },
  { id: 6, name: "Employee", status: "Aktiv" },
  { id: 7, name: "Guest", status: "Aktiv" },
  { id: 8, name: "Manager", status: "Aktiv" },
  { id: 9, name: "Accountant", status: "Aktiv" },
  { id: 10, name: "Security", status: "Aktiv" },
  { id: 11, name: "Maintenance", status: "Aktiv" },
];

const ITEMS_PER_PAGE = 10;

const UserRightsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [formName, setFormName] = useState("");
  const [formStatus, setFormStatus] = useState("Aktiv");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  const openCreateModal = () => {
    setSelectedItem(null);
    setFormName("");
    setFormStatus("Aktiv");
    setCreateOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormName(item.name);
    setFormStatus(item.status);
    setEditOpen(true);
  };

  const handleFilterApply = () => {
    setFilterOpen(false);
  };

  const handleFilterClear = () => {
    setFilterName("");
    setFilterStatus("");
    setFilterOpen(false);
  };

  const handleCreateSave = () => {
    // Mock: Yeni hüququn ID-sini al (real tətbiqdə API-dən gələcək)
    const newRightId = data.length + 1;
    setCreateOpen(false);
    // İcazələr səhifəsinə keçid et
    navigate(`/dashboard/user-permissions?rightId=${newRightId}`);
  };

  const handleEditSave = () => {
    setEditOpen(false);
  };

  const getStatusColor = (status) => {
    return status === "Aktiv" ? "green" : "gray";
  };

  return (
    <div className="h-full flex flex-col">
      {/* Section title bar */}
      <div className="w-full bg-black dark:bg-black my-2 sm:my-3 lg:my-4 p-3 sm:p-4 rounded-lg shadow-lg mb-3 sm:mb-4 lg:mb-5 border border-red-600 dark:border-red-600 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Typography variant="h5" className="text-white font-bold text-lg sm:text-xl leading-tight">
              {t("userRights.pageTitle")}
            </Typography>
            <Typography variant="small" className="text-white/90 dark:text-white/90 mt-1.5 text-xs sm:text-sm font-medium">
              {t("userRights.subtitle")}
            </Typography>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setFilterOpen(true)}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 dark:bg-white/10 dark:border-white/30 dark:text-white dark:hover:bg-white/20"
            >
              {t("buttons.filter")}
            </Button>
            <Button
              color="purple"
              size="sm"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white border-0"
              onClick={openCreateModal}
            >
              <PlusIcon className="h-4 w-4" />
              {t("userRights.rights.create")}
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <Dialog
        open={filterOpen}
        handler={setFilterOpen}
        size="md"
        className="dark:bg-black border border-red-600 dark:border-red-600"
      >
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("buttons.filter")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          <Input
            label={t("userRights.rights.filter.name")}
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
          <Input
            label={t("userRights.rights.filter.status")}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2 dark:bg-black border-t border-gray-200 dark:border-gray-700 pt-3">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={handleFilterClear}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t("buttons.clear")}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              color="blue-gray"
              onClick={() => setFilterOpen(false)}
              className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              color="purple"
              onClick={handleFilterApply}
              className="dark:bg-purple-600 dark:hover:bg-purple-700"
            >
              {t("buttons.apply")}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {/* Create Modal */}
      <Dialog
        open={createOpen}
        handler={setCreateOpen}
        size="md"
        className="dark:bg-black border border-red-600 dark:border-red-600"
      >
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("userRights.rights.createModal.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          <Input
            label={t("userRights.rights.createModal.name")}
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
          <Input
            label={t("userRights.rights.createModal.status")}
            value={formStatus}
            onChange={(e) => setFormStatus(e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-black border-t border-gray-200 dark:border-gray-700 pt-3">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={() => setCreateOpen(false)}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            color="purple"
            onClick={handleCreateSave}
            className="dark:bg-purple-600 dark:hover:bg-purple-700"
          >
            {t("buttons.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit Modal */}
      <Dialog
        open={editOpen}
        handler={setEditOpen}
        size="md"
        className="dark:bg-black border border-red-600 dark:border-red-600"
      >
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("userRights.rights.editModal.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          <Input
            label={t("userRights.rights.editModal.name")}
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
          <Input
            label={t("userRights.rights.editModal.status")}
            value={formStatus}
            onChange={(e) => setFormStatus(e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-black border-t border-gray-200 dark:border-gray-700 pt-3">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={() => setEditOpen(false)}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            color="purple"
            onClick={handleEditSave}
            className="dark:bg-purple-600 dark:hover:bg-purple-700"
          >
            {t("buttons.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Spinner className="h-6 w-6 dark:text-blue-400" />
          <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
            {t("userRights.loading")}
          </Typography>
        </div>
      ) : (
        <Card className="border border-red-600 dark:border-red-600 shadow-lg dark:bg-black flex flex-col flex-1 min-h-0">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-3 sm:p-4 dark:bg-black border-b border-gray-200 dark:border-gray-700 flex-shrink-0"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
              <Typography variant="h6" color="blue-gray" className="font-bold dark:text-white text-base sm:text-lg">
                {t("userRights.rights.title")}
              </Typography>
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300 text-xs sm:text-sm">
                {t("userRights.rights.total")}: {data.length} {t("userRights.rights.role")}
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-auto overflow-y-auto p-0 dark:bg-black flex-1 min-h-0">
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <th className="p-2 sm:p-3 lg:p-4 border-r border-gray-200 dark:border-gray-700">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none dark:text-white text-xs sm:text-sm"
                      >
                        ID
                      </Typography>
                    </th>
                    <th className="p-2 sm:p-3 lg:p-4 border-r border-gray-200 dark:border-gray-700">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none dark:text-white text-xs sm:text-sm"
                      >
                        {t("userRights.rights.table.name")}
                      </Typography>
                    </th>
                    <th className="p-2 sm:p-3 lg:p-4 border-r border-gray-200 dark:border-gray-700">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none dark:text-white text-xs sm:text-sm"
                      >
                        {t("userRights.rights.table.status")}
                      </Typography>
                    </th>
                    <th className="p-2 sm:p-3 lg:p-4 text-right">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none dark:text-white text-xs sm:text-sm"
                      >
                        {t("userRights.rights.table.actions")}
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((item, index) => {
                    const isLast = index === pageData.length - 1;
                    const classes = isLast
                      ? "p-2 sm:p-3 lg:p-4 border-b-0"
                      : "p-2 sm:p-3 lg:p-4 border-b border-gray-200 dark:border-gray-700";

                    return (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-medium dark:text-gray-200 text-xs sm:text-sm">
                            {item.id}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-2">
                            <div className="bg-purple-100 dark:bg-purple-900/40 p-1.5 rounded-full flex-shrink-0">
                              <UserGroupIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-300" />
                            </div>
                            <Typography variant="small" color="blue-gray" className="font-medium dark:text-gray-200 text-xs sm:text-sm">
                              {item.name}
                            </Typography>
                          </div>
                        </td>
                        <td className={classes}>
                          <Chip
                            value={item.status}
                            color={getStatusColor(item.status)}
                            size="sm"
                            className="dark:bg-green-600 dark:text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 h-5 sm:h-6"
                          />
                        </td>
                        <td className={`${classes} text-right`}>
                          <div className="flex justify-end">
                            <Menu>
                              <MenuHandler>
                                <IconButton variant="text" size="sm" className="dark:text-gray-300 dark:hover:bg-gray-700">
                                  <EllipsisVerticalIcon className="h-5 w-5" />
                                </IconButton>
                              </MenuHandler>
                            <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                              <MenuItem
                                onClick={() => navigate(`/dashboard/user-permissions?rightId=${item.id}`)}
                                className="flex items-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                <ShieldCheckIcon className="h-4 w-4" />
                                {t("userRights.rights.managePermissions")}
                              </MenuItem>
                              <MenuItem
                                onClick={() => openEditModal(item)}
                                className="flex items-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
                              >
                                <PencilIcon className="h-4 w-4" />
                                {t("buttons.edit")}
                              </MenuItem>
                            </MenuList>
                          </Menu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet Cards */}
            <div className="grid gap-3 sm:gap-4 lg:hidden px-3 sm:px-4 pt-3 sm:pt-4 pb-2">
              {pageData.map((item) => (
                <Card
                  key={item.id}
                  className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black"
                >
                  <CardBody className="space-y-3 dark:bg-black p-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <div className="bg-purple-100 dark:bg-purple-900/40 p-1.5 rounded-full flex-shrink-0">
                          <UserGroupIcon className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold dark:text-white text-sm"
                          >
                            {item.name}
                          </Typography>
                          <Typography variant="small" className="text-xs text-blue-gray-400 dark:text-gray-400">
                            ID: {item.id}
                          </Typography>
                        </div>
                      </div>
                      <Menu placement="left-start">
                        <MenuHandler>
                          <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </IconButton>
                        </MenuHandler>
                        <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                          <MenuItem
                            onClick={() => navigate(`/dashboard/user-permissions?rightId=${item.id}`)}
                            className="flex items-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <ShieldCheckIcon className="h-4 w-4" />
                            {t("userRights.rights.managePermissions")}
                          </MenuItem>
                          <MenuItem
                            onClick={() => openEditModal(item)}
                            className="flex items-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <PencilIcon className="h-4 w-4" />
                            {t("buttons.edit")}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </div>
                    <div className="flex items-center gap-2">
                      <Typography variant="small" className="text-xs text-blue-gray-600 dark:text-gray-400">
                        {t("userRights.rights.table.status")}:
                      </Typography>
                      <Chip
                        value={item.status}
                        color={getStatusColor(item.status)}
                        size="sm"
                        className="dark:bg-green-600 dark:text-white text-xs"
                      />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
          <CardBody className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 dark:bg-black flex-shrink-0">
            <Typography variant="small" color="blue-gray" className="font-normal dark:text-gray-300 text-xs sm:text-sm">
              {t("common.showing")} {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, data.length)} {t("common.of")} {data.length}
            </Typography>
            <div className="flex gap-2">
              <Button
                variant="outlined"
                size="sm"
                onClick={handlePrev}
                disabled={page === 1}
                className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {t("common.previous")}
              </Button>
              <Button
                variant="outlined"
                size="sm"
                onClick={handleNext}
                disabled={page === totalPages}
                className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {t("common.next")}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default UserRightsPage;
