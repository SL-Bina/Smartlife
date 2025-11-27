import React, { useEffect, useState } from "react";
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
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

const mockPackages = [
  {
    id: 1,
    apartmentNumber: "101",
    packageType: "Bağlama",
    recipient: "Məmməd Məmmədov",
    sender: "Tural Həsənov",
    phoneNumber: "+994501234567",
    photo: null,
    qrCode: "PKG-001",
    status: "accepted",
    date: "2024-01-15 10:30:00",
  },
  {
    id: 2,
    apartmentNumber: "205",
    packageType: "Sənəd",
    recipient: "Leyla Əliyeva",
    sender: "Rəşad Quliyev",
    phoneNumber: "+994507654321",
    photo: null,
    qrCode: "PKG-002",
    status: "delivered",
    date: "2024-01-14 14:20:00",
  },
  {
    id: 3,
    apartmentNumber: "312",
    packageType: "Poçt bağlaması",
    recipient: "Aygün Məlikova",
    sender: "Nigar Hüseynova",
    phoneNumber: "+994501112233",
    photo: null,
    qrCode: "PKG-003",
    status: "accepted",
    date: "2024-01-16 09:15:00",
  },
];

const ITEMS_PER_PAGE = 10;

const ReceptionPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [searchApartment, setSearchApartment] = useState("");
  const [searchPackageType, setSearchPackageType] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchDateFrom, setSearchDateFrom] = useState("");
  const [searchDateTo, setSearchDateTo] = useState("");

  const [formApartmentNumber, setFormApartmentNumber] = useState("");
  const [formPackageType, setFormPackageType] = useState("");
  const [formRecipient, setFormRecipient] = useState("");
  const [formSender, setFormSender] = useState("");
  const [formPhoneNumber, setFormPhoneNumber] = useState("");
  const [formPhoto, setFormPhoto] = useState(null);
  const [formStatus, setFormStatus] = useState("");
  const [formDate, setFormDate] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = React.useMemo(
    () =>
      mockPackages.filter((item) => {
        const matchesApartment = searchApartment
          ? item.apartmentNumber.toLowerCase().includes(searchApartment.toLowerCase())
          : true;
        const matchesPackageType = searchPackageType
          ? item.packageType === searchPackageType
          : true;
        const matchesStatus = searchStatus ? item.status === searchStatus : true;
        return matchesApartment && matchesPackageType && matchesStatus;
      }),
    [searchApartment, searchPackageType, searchStatus]
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  const openCreateModal = () => {
    setFormApartmentNumber("");
    setFormPackageType("");
    setFormRecipient("");
    setFormSender("");
    setFormPhoneNumber("");
    setFormPhoto(null);
    setFormStatus("");
    setFormDate("");
    setCreateOpen(true);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormApartmentNumber(item.apartmentNumber);
    setFormPackageType(item.packageType);
    setFormRecipient(item.recipient);
    setFormSender(item.sender);
    setFormPhoneNumber(item.phoneNumber);
    setFormPhoto(item.photo);
    setFormStatus(item.status);
    setFormDate(item.date);
    setEditOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "yellow";
      case "delivered":
        return "green";
      default:
        return "gray";
    }
  };

  const getStatusTranslation = (status) => {
    switch (status) {
      case "accepted":
        return t("reception.status.accepted");
      case "delivered":
        return t("reception.status.delivered");
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8">
      <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 p-6 dark:bg-black"
        >
          <div className="flex items-center justify-between">
            <Typography variant="h6" color="blue-gray" className="dark:text-white">
              {t("reception.pageTitle")}
            </Typography>
            <div className="flex gap-2">
              <Button
                color="blue"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                <span>{t("reception.search")}</span>
              </Button>
              <Button
                color="green"
                size="sm"
                onClick={openCreateModal}
                className="flex items-center gap-2 dark:bg-green-600 dark:hover:bg-green-700"
              >
                <PlusIcon className="h-4 w-4" />
                <span>{t("reception.addPackage")}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0 pb-2 dark:bg-black">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      ID
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("reception.table.apartmentNumber")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("reception.table.packageType")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("reception.table.recipient")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("reception.table.sender")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("reception.table.phoneNumber")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("reception.table.photo")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("reception.table.qrCode")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("reception.table.status")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("reception.table.date")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("reception.table.actions")}
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
                        {row.apartmentNumber}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.packageType}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.recipient}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.sender}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.phoneNumber}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                        {row.photo ? "Foto var" : t("reception.noPhoto")}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.qrCode}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Chip
                        value={getStatusTranslation(row.status)}
                        color={getStatusColor(row.status)}
                        className="dark:bg-yellow-600 dark:text-white"
                      />
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.date}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Menu>
                        <MenuHandler>
                          <IconButton variant="text" className="dark:text-gray-300">
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </IconButton>
                        </MenuHandler>
                        <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                          <MenuItem
                            onClick={() => openViewModal(row)}
                            className="dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            {t("reception.view")}
                          </MenuItem>
                          <MenuItem
                            onClick={() => openEditModal(row)}
                            className="dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            {t("reception.edit")}
                          </MenuItem>
                          <MenuItem
                            onClick={() => openDeleteModal(row)}
                            className="dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            {t("reception.delete")}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-blue-gray-100 dark:border-gray-800">
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {t("pagination.page")} {page} {t("pagination.of")} {totalPages}
              </Typography>
              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  color="blue-gray"
                  size="sm"
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="dark:border-gray-600 dark:text-gray-300"
                >
                  {t("pagination.previous")}
                </Button>
                <Button
                  variant="outlined"
                  color="blue-gray"
                  size="sm"
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="dark:border-gray-600 dark:text-gray-300"
                >
                  {t("pagination.next")}
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Search Modal */}
      <Dialog open={searchOpen} handler={setSearchOpen} className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">
          {t("reception.searchModal.title")}
        </DialogHeader>
        <DialogBody className="dark:bg-gray-800">
          <div className="space-y-4">
            <Input
              label={t("reception.searchModal.apartmentNumber")}
              value={searchApartment}
              onChange={(e) => setSearchApartment(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Select
              label={t("reception.searchModal.packageType")}
              value={searchPackageType}
              onChange={(val) => setSearchPackageType(val)}
              className="dark:text-white"
            >
              <Option value="Bağlama">{t("reception.packageTypes.package")}</Option>
              <Option value="Sənəd">{t("reception.packageTypes.document")}</Option>
              <Option value="Poçt bağlaması">{t("reception.packageTypes.postalPackage")}</Option>
            </Select>
            <Select
              label={t("reception.searchModal.status")}
              value={searchStatus}
              onChange={(val) => setSearchStatus(val)}
              className="dark:text-white"
            >
              <Option value="accepted">{t("reception.status.accepted")}</Option>
              <Option value="delivered">{t("reception.status.delivered")}</Option>
            </Select>
            <Input
              type="date"
              label={t("reception.searchModal.dateFrom")}
              value={searchDateFrom}
              onChange={(e) => setSearchDateFrom(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Input
              type="date"
              label={t("reception.searchModal.dateTo")}
              value={searchDateTo}
              onChange={(e) => setSearchDateTo(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="dark:bg-gray-800">
          <Button
            variant="text"
            color="red"
            onClick={() => setSearchOpen(false)}
            className="mr-1 dark:text-gray-300"
          >
            <span>{t("reception.cancel")}</span>
          </Button>
          <Button
            color="blue"
            onClick={() => {
              setSearchOpen(false);
              setPage(1);
            }}
            className="dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <span>{t("reception.apply")}</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={createOpen} handler={setCreateOpen} className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">
          {t("reception.createModal.title")}
        </DialogHeader>
        <DialogBody className="dark:bg-gray-800">
          <div className="space-y-4">
            <Input
              label={t("reception.form.apartmentNumber")}
              value={formApartmentNumber}
              onChange={(e) => setFormApartmentNumber(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Select
              label={t("reception.form.packageType")}
              value={formPackageType}
              onChange={(val) => setFormPackageType(val)}
              className="dark:text-white"
            >
              <Option value="Bağlama">{t("reception.packageTypes.package")}</Option>
              <Option value="Sənəd">{t("reception.packageTypes.document")}</Option>
              <Option value="Poçt bağlaması">{t("reception.packageTypes.postalPackage")}</Option>
            </Select>
            <Input
              label={t("reception.form.recipient")}
              value={formRecipient}
              onChange={(e) => setFormRecipient(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Input
              label={t("reception.form.sender")}
              value={formSender}
              onChange={(e) => setFormSender(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Input
              label={t("reception.form.phoneNumber")}
              value={formPhoneNumber}
              onChange={(e) => setFormPhoneNumber(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Input
              type="file"
              label={t("reception.form.photo")}
              onChange={(e) => setFormPhoto(e.target.files[0])}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Select
              label={t("reception.form.status")}
              value={formStatus}
              onChange={(val) => setFormStatus(val)}
              className="dark:text-white"
            >
              <Option value="accepted">{t("reception.status.accepted")}</Option>
              <Option value="delivered">{t("reception.status.delivered")}</Option>
            </Select>
            <Input
              type="datetime-local"
              label={t("reception.form.date")}
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="dark:bg-gray-800">
          <Button
            variant="text"
            color="red"
            onClick={() => setCreateOpen(false)}
            className="mr-1 dark:text-gray-300"
          >
            <span>{t("reception.cancel")}</span>
          </Button>
          <Button
            color="green"
            onClick={() => {
              setCreateOpen(false);
            }}
            className="dark:bg-green-600 dark:hover:bg-green-700"
          >
            <span>{t("reception.save")}</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* View Modal */}
      <Dialog open={viewOpen} handler={setViewOpen} className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">
          {t("reception.viewModal.title")}
        </DialogHeader>
        <DialogBody className="dark:bg-gray-800">
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                  {t("reception.table.id")}
                </Typography>
                <Typography variant="h6" className="dark:text-white">
                  {selectedItem.id}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                  {t("reception.table.apartmentNumber")}
                </Typography>
                <Typography variant="h6" className="dark:text-white">
                  {selectedItem.apartmentNumber}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                  {t("reception.table.packageType")}
                </Typography>
                <Typography variant="h6" className="dark:text-white">
                  {selectedItem.packageType}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                  {t("reception.table.recipient")}
                </Typography>
                <Typography variant="h6" className="dark:text-white">
                  {selectedItem.recipient}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                  {t("reception.table.sender")}
                </Typography>
                <Typography variant="h6" className="dark:text-white">
                  {selectedItem.sender}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                  {t("reception.table.phoneNumber")}
                </Typography>
                <Typography variant="h6" className="dark:text-white">
                  {selectedItem.phoneNumber}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                  {t("reception.table.qrCode")}
                </Typography>
                <Typography variant="h6" className="dark:text-white">
                  {selectedItem.qrCode}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                  {t("reception.table.status")}
                </Typography>
                <Chip
                  value={getStatusTranslation(selectedItem.status)}
                  color={getStatusColor(selectedItem.status)}
                  className="dark:bg-yellow-600 dark:text-white"
                />
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                  {t("reception.table.date")}
                </Typography>
                <Typography variant="h6" className="dark:text-white">
                  {selectedItem.date}
                </Typography>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="dark:bg-gray-800">
          <Button
            variant="text"
            color="blue"
            onClick={() => setViewOpen(false)}
            className="dark:text-gray-300"
          >
            <span>{t("reception.close")}</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteOpen} handler={setDeleteOpen} className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">
          {t("reception.deleteModal.title")}
        </DialogHeader>
        <DialogBody className="dark:bg-gray-800">
          <Typography variant="paragraph" className="dark:text-gray-300">
            {t("reception.deleteModal.message")}
          </Typography>
        </DialogBody>
        <DialogFooter className="dark:bg-gray-800">
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setDeleteOpen(false)}
            className="mr-1 dark:text-gray-300"
          >
            <span>{t("reception.cancel")}</span>
          </Button>
          <Button
            color="red"
            onClick={() => {
              setDeleteOpen(false);
            }}
            className="dark:bg-red-600 dark:hover:bg-red-700"
          >
            <span>{t("reception.delete")}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ReceptionPage;

