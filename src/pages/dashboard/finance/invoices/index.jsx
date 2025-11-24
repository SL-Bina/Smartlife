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
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Chip,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const invoicesData = Array.from({ length: 50 }, (_, index) => ({
  id: 139653 - index,
  serviceName: `Xidmət ${index + 1}`,
  owner: `Sahib ${index + 1}`,
  ownerBalance: (Math.random() * 10).toFixed(2),
  apartment: `Mənzil ${index + 1}`,
  building: `Bina ${String.fromCharCode(65 + (index % 5))}`,
  block: `Blok ${String.fromCharCode(65 + (index % 3))}`,
  floor: (index % 16) + 1,
  area: (60 + (index % 10) * 5).toFixed(2),
  amount: (20 + (index % 10) * 5).toFixed(2),
  paidAmount: index % 3 === 0 ? (20 + (index % 10) * 5).toFixed(2) : (10 + (index % 5) * 2).toFixed(2),
  remaining: index % 3 === 0 ? "0.00" : (10 + (index % 5) * 3).toFixed(2),
  status: index % 3 === 0 ? "Ödənilib" : "Ödənilməmiş",
  invoiceDate: "2025 Noy",
  paymentDate: index % 3 === 0 ? `2025-11-${String(19 - (index % 10)).padStart(2, "0")} 17:01` : "",
  paymentMethod: index % 3 === 0 ? (index % 2 === 0 ? "Balans" : "Nağd") : "",
}));

const ITEMS_PER_PAGE = 10;

const InvoicesPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filterServiceName, setFilterServiceName] = useState("");
  const [filterOwner, setFilterOwner] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = React.useMemo(
    () =>
      invoicesData.filter((item) => {
        const matchesService = filterServiceName
          ? item.serviceName.toLowerCase().includes(filterServiceName.toLowerCase())
          : true;
        const matchesOwner = filterOwner
          ? item.owner.toLowerCase().includes(filterOwner.toLowerCase())
          : true;
        const matchesStatus = filterStatus ? item.status === filterStatus : true;
        return matchesService && matchesOwner && matchesStatus;
      }),
    [filterServiceName, filterOwner, filterStatus]
  );

  const totalPaid = filteredData
    .reduce((sum, item) => sum + parseFloat(item.paidAmount), 0)
    .toFixed(2);
  const totalConsumption = filteredData
    .reduce((sum, item) => sum + parseFloat(item.amount), 0)
    .toFixed(2);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  const openCreateModal = () => {
    setSelectedItem(null);
    setCreateOpen(true);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setEditOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  const handleFilterApply = () => {
    setPage(1);
    setFilterOpen(false);
  };

  const handleFilterClear = () => {
    setFilterServiceName("");
    setFilterOwner("");
    setFilterStatus("");
    setPage(1);
    setFilterOpen(false);
  };

  const handleCreateSave = () => {
    setCreateOpen(false);
  };

  const handleEditSave = () => {
    setEditOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteConfirm = () => {
    // Delete logic here
    setDeleteOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="">
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black dark:bg-black my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-red-600" >
        <h3 className="text-white font-bold">{t("invoices.pageTitle")}</h3>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black ">
          <CardBody className="p-4">
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("invoices.summary.paid")}
            </Typography>
            <Typography variant="h5" color="green" className="font-bold dark:text-green-300">
              {totalPaid} ₼
            </Typography>
          </CardBody>
        </Card>
        <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black ">
          <CardBody className="p-4">
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("invoices.summary.consumption")}
            </Typography>
            <Typography variant="h5" color="blue-gray" className="font-bold dark:text-white">
              {totalConsumption} ₼
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white">{t("invoices.filter.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black ">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("invoices.filter.serviceName")}
            </Typography>
            <Input
              label={t("invoices.filter.enter")}
              value={filterServiceName}
              onChange={(e) => setFilterServiceName(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("invoices.filter.owner")}
            </Typography>
            <Input
              label={t("invoices.filter.enter")}
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("invoices.filter.status")}
            </Typography>
            <Input
              label={t("invoices.filter.enter")}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2 dark:bg-black ">
          <Button variant="text" color="blue-gray" onClick={handleFilterClear} className="dark:text-gray-300 dark:hover:bg-gray-700">
            {t("buttons.clear")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outlined" color="blue-gray" onClick={() => setFilterOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
              {t("buttons.cancel")}
            </Button>
            <Button color="blue" onClick={handleFilterApply} className="dark:bg-blue-600 dark:hover:bg-blue-700">
              {t("buttons.apply")}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {/* Create invoice modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="md" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("invoices.create.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("invoices.create.serviceName")}
            </Typography>
            <Input 
              label={t("invoices.create.enter")} 
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-black border-t border-gray-200 dark:border-gray-700 pt-3">
          <Button variant="outlined" color="blue-gray" onClick={() => setCreateOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.cancel")}
          </Button>
          <Button color="green" onClick={handleCreateSave} className="dark:bg-green-600 dark:hover:bg-green-700">
            {t("buttons.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* View invoice modal */}
      <Dialog open={viewOpen} handler={setViewOpen} size="lg" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("invoices.view.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          {selectedItem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("invoices.table.id")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                  {selectedItem.id}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("invoices.table.serviceName")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                  {selectedItem.serviceName}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("invoices.table.owner")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {selectedItem.owner}
                </Typography>
                <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                  {t("invoices.labels.balance")}: {selectedItem.ownerBalance} ₼
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("invoices.table.apartmentInfo")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {selectedItem.apartment}
                </Typography>
                <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                  {t("invoices.labels.building")}: {selectedItem.building}, {t("invoices.labels.block")}: {selectedItem.block}, {t("invoices.labels.floor")}: {selectedItem.floor}, {t("invoices.labels.area")}: {selectedItem.area} m²
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("invoices.table.amount")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                  {selectedItem.amount} ₼
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("invoices.table.paidAmount")}
                </Typography>
                <Typography variant="small" color="green" className="font-semibold dark:text-green-300">
                  {selectedItem.paidAmount} ₼
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("invoices.table.remaining")}
                </Typography>
                <Typography
                  variant="small"
                  color={parseFloat(selectedItem.remaining) > 0 ? "red" : "blue-gray"}
                  className={`font-semibold ${parseFloat(selectedItem.remaining) > 0 ? "dark:text-red-400" : "dark:text-gray-300"}`}
                >
                  {selectedItem.remaining} ₼
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("invoices.table.status")}
                </Typography>
                <Chip
                  size="sm"
                  value={selectedItem.status === "Ödənilib" ? t("invoices.status.paid") : t("invoices.status.unpaid")}
                  color={selectedItem.status === "Ödənilib" ? "green" : "red"}
                  className="dark:bg-opacity-80"
                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("invoices.table.invoiceDate")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {selectedItem.invoiceDate}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("invoices.table.paymentDate")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {selectedItem.paymentDate || "-"}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("invoices.table.paymentMethod")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {selectedItem.paymentMethod || "-"}
                </Typography>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-black border-t border-gray-200 dark:border-gray-700 pt-3">
          <Button variant="outlined" color="blue-gray" onClick={() => setViewOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.close")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit invoice modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="md" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("invoices.edit.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          {selectedItem && (
            <>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                  {t("invoices.create.serviceName")}
                </Typography>
                <Input 
                  label={t("invoices.create.enter")}
                  defaultValue={selectedItem.serviceName}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                  {t("invoices.table.owner")}
                </Typography>
                <Input 
                  label={t("invoices.filter.enter")}
                  defaultValue={selectedItem.owner}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                  {t("invoices.table.amount")}
                </Typography>
                <Input 
                  type="number"
                  label={t("invoices.filter.enter")}
                  defaultValue={selectedItem.amount}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                />
              </div>
            </>
          )}
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-black border-t border-gray-200 dark:border-gray-700 pt-3">
          <Button variant="outlined" color="blue-gray" onClick={() => setEditOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.cancel")}
          </Button>
          <Button color="green" onClick={handleEditSave} className="dark:bg-green-600 dark:hover:bg-green-700">
            {t("buttons.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete invoice modal */}
      <Dialog open={deleteOpen} handler={setDeleteOpen} size="sm" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("invoices.delete.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          {selectedItem && (
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("invoices.delete.message")} <strong>{selectedItem.serviceName}</strong> (ID: {selectedItem.id})?
            </Typography>
          )}
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-black border-t border-gray-200 dark:border-gray-700 pt-3">
          <Button variant="outlined" color="blue-gray" onClick={() => setDeleteOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.cancel")}
          </Button>
          <Button color="red" onClick={handleDeleteConfirm} className="dark:bg-red-600 dark:hover:bg-red-700">
            {t("buttons.delete")}
          </Button>
        </DialogFooter>
      </Dialog>

      <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black ">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-black"
        >
          <div className="flex items-center gap-3">
            <Button variant="outlined" color="blue" onClick={() => setFilterOpen(true)} className="dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-600/20">
              {t("invoices.actions.search")}
            </Button>
            <Button color="green" onClick={openCreateModal} className="dark:bg-green-600 dark:hover:bg-green-700">
              {t("invoices.actions.add")}
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-black">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6 dark:text-blue-400" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("invoices.actions.loading")}
              </Typography>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full table-auto min-w-[1200px]">
                  <thead>
                    <tr>
                      {[
                        t("invoices.table.id"),
                        t("invoices.table.serviceName"),
                        t("invoices.table.owner"),
                        t("invoices.table.apartmentInfo"),
                        t("invoices.table.amount"),
                        t("invoices.table.paidAmount"),
                        t("invoices.table.remaining"),
                        t("invoices.table.status"),
                        t("invoices.table.invoiceDate"),
                        t("invoices.table.paymentDate"),
                        t("invoices.table.paymentMethod"),
                        t("invoices.table.operations"),
                      ].map((el, idx) => (
                        <th
                          key={el}
                          className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${
                            idx === 11 ? "text-right" : ""
                          }`}
                        >
                          <Typography
                            variant="small"
                            className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400"
                          >
                            {el}
                          </Typography>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map((row, key) => {
                      const className = `py-3 px-6 ${
                        key === pageData.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
                      }`;
                      return (
                        <tr key={row.id} className="dark:hover:bg-gray-700/50">
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.id}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold dark:text-white"
                            >
                              {row.serviceName}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.owner}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                              {t("invoices.labels.balance")}: {row.ownerBalance} ₼
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.apartment}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                              {t("invoices.labels.building")}: {row.building}, {t("invoices.labels.block")}: {row.block}, {t("invoices.labels.floor")}: {row.floor}, {t("invoices.labels.area")}:{" "}
                              {row.area} m²
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                              {row.amount} ₼
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="green" className="font-semibold dark:text-green-300">
                              {row.paidAmount} ₼
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color={parseFloat(row.remaining) > 0 ? "red" : "blue-gray"}
                              className={`font-semibold ${parseFloat(row.remaining) > 0 ? "dark:text-red-400" : "dark:text-gray-300"}`}
                            >
                              {row.remaining} ₼
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              size="sm"
                              value={row.status === "Ödənilib" ? t("invoices.status.paid") : t("invoices.status.unpaid")}
                              color={row.status === "Ödənilib" ? "green" : "red"}
                              className="dark:bg-opacity-80"
                            />
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.invoiceDate}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.paymentDate || "-"}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.paymentMethod || "-"}
                            </Typography>
                          </td>
                          <td className={`${className} text-right`}>
                            <Menu placement="left-start">
                              <MenuHandler>
                                <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                                  <EllipsisVerticalIcon
                                    strokeWidth={2}
                                    className="h-5 w-5"
                                  />
                                </IconButton>
                              </MenuHandler>
                              <MenuList className="dark:bg-black dark:border-gray-800">
                                <MenuItem onClick={() => openViewModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                                  {t("invoices.actions.view")}
                                </MenuItem>
                                <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                                  {t("invoices.actions.edit")}
                                </MenuItem>
                                <MenuItem onClick={() => openDeleteModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                                  {t("invoices.actions.delete")}
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tablet & mobile cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
                {pageData.map((row) => (
                  <Card key={row.id} className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black dark:border-gray-800">
                    <CardBody className="space-y-2 dark:bg-black">
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold dark:text-white"
                        >
                          {row.serviceName}
                        </Typography>
                        <Menu placement="left-start">
                          <MenuHandler>
                            <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                              <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                            </IconButton>
                          </MenuHandler>
                          <MenuList className="dark:bg-black dark:border-gray-800">
                            <MenuItem onClick={() => openViewModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                              {t("invoices.actions.view")}
                            </MenuItem>
                            <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                              {t("invoices.actions.edit")}
                            </MenuItem>
                            <MenuItem onClick={() => openDeleteModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                              {t("invoices.actions.delete")}
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("invoices.mobile.id")}: {row.id}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("invoices.mobile.owner")}: {row.owner}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-white">
                        {t("invoices.mobile.amount")}: {row.amount} ₼
                      </Typography>
                      <Typography variant="small" color="green" className="dark:text-green-300">
                        {t("invoices.mobile.paid")}: {row.paidAmount} ₼
                      </Typography>
                      <Typography
                        variant="small"
                        color={parseFloat(row.remaining) > 0 ? "red" : "blue-gray"}
                        className={parseFloat(row.remaining) > 0 ? "dark:text-red-400" : "dark:text-gray-300"}
                      >
                        {t("invoices.mobile.remaining")}: {row.remaining} ₼
                      </Typography>
                      <Chip
                        size="sm"
                        value={row.status === "Ödənilib" ? t("invoices.status.paid") : t("invoices.status.unpaid")}
                        color={row.status === "Ödənilib" ? "green" : "red"}
                        className="dark:bg-opacity-80"
                      />
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end gap-2 px-6 pt-4">
                <Button
                  variant="text"
                  size="sm"
                  color="blue-gray"
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:text-gray-600"
                >
                  {t("invoices.pagination.prev")}
                </Button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === page ? "filled" : "text"}
                      size="sm"
                      color={pageNumber === page ? "blue" : "blue-gray"}
                      onClick={() => setPage(pageNumber)}
                      className={`min-w-[32px] px-2 ${
                        pageNumber === page 
                          ? "dark:bg-blue-600 dark:hover:bg-blue-700" 
                          : "dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  )
                )}
                <Button
                  variant="text"
                  size="sm"
                  color="blue-gray"
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:text-gray-600"
                >
                  {t("invoices.pagination.next")}
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default InvoicesPage;

