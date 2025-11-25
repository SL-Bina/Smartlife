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

const transfersData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  fromAccount: index % 2 === 0 ? "Nağd" : "Bank",
  toAccount: index % 2 === 0 ? "Bank" : "Nağd",
  amount: (200 + (index % 15) * 100).toFixed(2),
  transferDate: `2025-11-${String(1 + (index % 20)).padStart(2, "0")}`,
  description: `Köçürmə ${index + 1}`,
  status: index % 3 === 0 ? "Tamamlanıb" : "Gözləyir",
  referenceNumber: `TRF-${String(1000 + index).padStart(4, "0")}`,
}));

const ITEMS_PER_PAGE = 10;

const TransfersPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filterFromAccount, setFilterFromAccount] = useState("");
  const [filterToAccount, setFilterToAccount] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [formFromAccount, setFormFromAccount] = useState("");
  const [formToAccount, setFormToAccount] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formTransferDate, setFormTransferDate] = useState("");
  const [formDescription, setFormDescription] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = React.useMemo(
    () =>
      transfersData.filter((item) => {
        const matchesFromAccount = filterFromAccount
          ? item.fromAccount.toLowerCase().includes(filterFromAccount.toLowerCase())
          : true;
        const matchesToAccount = filterToAccount
          ? item.toAccount.toLowerCase().includes(filterToAccount.toLowerCase())
          : true;
        const matchesStatus = filterStatus ? item.status === filterStatus : true;
        return matchesFromAccount && matchesToAccount && matchesStatus;
      }),
    [filterFromAccount, filterToAccount, filterStatus]
  );

  const totalTransfers = filteredData
    .filter((item) => item.status === "Tamamlanıb")
    .reduce((sum, item) => sum + parseFloat(item.amount), 0)
    .toFixed(2);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  const openCreateModal = () => {
    setFormFromAccount("");
    setFormToAccount("");
    setFormAmount("");
    setFormTransferDate("");
    setFormDescription("");
    setCreateOpen(true);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormFromAccount(item.fromAccount);
    setFormToAccount(item.toAccount);
    setFormAmount(item.amount);
    setFormTransferDate(item.transferDate);
    setFormDescription(item.description);
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
    setFilterFromAccount("");
    setFilterToAccount("");
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
    setDeleteOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="">
      {/* Section title bar */}
      <div className="w-full bg-black dark:bg-black my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-red-600">
        <h3 className="text-white font-bold">{t("transfers.pageTitle")}</h3>
      </div>

      {/* Summary card */}
      <div className="mb-6 flex justify-end">
        <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black ">
          <CardBody className="p-4">
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("transfers.summary.totalTransfers")}
            </Typography>
            <Typography variant="h5" color="blue" className="font-bold dark:text-blue-300">
              {totalTransfers} ₼
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white">{t("transfers.filter.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black ">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("transfers.filter.fromAccount")}
            </Typography>
            <Input
              label={t("transfers.filter.enter")}
              value={filterFromAccount}
              onChange={(e) => setFilterFromAccount(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("transfers.filter.toAccount")}
            </Typography>
            <Input
              label={t("transfers.filter.enter")}
              value={filterToAccount}
              onChange={(e) => setFilterToAccount(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("transfers.filter.status")}
            </Typography>
            <Input
              label={t("transfers.filter.enter")}
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

      {/* Create transfer modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="sm" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white">{t("transfers.create.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black ">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("transfers.form.fromAccount")}
            </Typography>
            <Input
              label={t("transfers.form.enter")}
              value={formFromAccount}
              onChange={(e) => setFormFromAccount(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("transfers.form.toAccount")}
            </Typography>
            <Input
              label={t("transfers.form.enter")}
              value={formToAccount}
              onChange={(e) => setFormToAccount(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("transfers.form.amount")}
            </Typography>
            <Input
              type="number"
              label={t("transfers.form.enter")}
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("transfers.form.transferDate")}
            </Typography>
            <Input
              type="date"
              label={t("transfers.form.enter")}
              value={formTransferDate}
              onChange={(e) => setFormTransferDate(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("transfers.form.description")}
            </Typography>
            <Input
              label={t("transfers.form.enter")}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-black ">
          <Button variant="outlined" color="blue-gray" onClick={() => setCreateOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.cancel")}
          </Button>
          <Button color="green" onClick={handleCreateSave} className="dark:bg-green-600 dark:hover:bg-green-700">
            {t("buttons.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit transfer modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white">{t("transfers.edit.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black ">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("transfers.form.fromAccount")}
            </Typography>
            <Input
              label={t("transfers.form.enter")}
              value={formFromAccount}
              onChange={(e) => setFormFromAccount(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("transfers.form.toAccount")}
            </Typography>
            <Input
              label={t("transfers.form.enter")}
              value={formToAccount}
              onChange={(e) => setFormToAccount(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("transfers.form.amount")}
            </Typography>
            <Input
              type="number"
              label={t("transfers.form.enter")}
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("transfers.form.transferDate")}
            </Typography>
            <Input
              type="date"
              label={t("transfers.form.enter")}
              value={formTransferDate}
              onChange={(e) => setFormTransferDate(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("transfers.form.description")}
            </Typography>
            <Input
              label={t("transfers.form.enter")}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-black ">
          <Button variant="outlined" color="blue-gray" onClick={() => setEditOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.cancel")}
          </Button>
          <Button color="blue" onClick={handleEditSave} className="dark:bg-blue-600 dark:hover:bg-blue-700">
            {t("buttons.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* View transfer modal */}
      <Dialog open={viewOpen} handler={setViewOpen} size="lg" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("transfers.view.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          {selectedItem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("transfers.table.id")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                  {selectedItem.id}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("transfers.table.fromAccount")}
                </Typography>
                <Chip
                  size="sm"
                  value={selectedItem.fromAccount === "Nağd" ? t("transfers.account.cash") : t("transfers.account.bank")}
                  color={selectedItem.fromAccount === "Nağd" ? "amber" : "blue"}
                  className="dark:bg-opacity-80"
                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("transfers.table.toAccount")}
                </Typography>
                <Chip
                  size="sm"
                  value={selectedItem.toAccount === "Nağd" ? t("transfers.account.cash") : t("transfers.account.bank")}
                  color={selectedItem.toAccount === "Nağd" ? "amber" : "blue"}
                  className="dark:bg-opacity-80"
                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("transfers.table.amount")}
                </Typography>
                <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
                  {selectedItem.amount} ₼
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("transfers.table.transferDate")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {selectedItem.transferDate}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("transfers.table.description")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {selectedItem.description}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("transfers.table.referenceNumber")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {selectedItem.referenceNumber}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("transfers.table.status")}
                </Typography>
                <Chip
                  size="sm"
                  value={selectedItem.status === "Tamamlanıb" ? t("transfers.status.completed") : t("transfers.status.pending")}
                  color={selectedItem.status === "Tamamlanıb" ? "green" : "amber"}
                  className="dark:bg-opacity-80"
                />
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

      {/* Delete transfer modal */}
      <Dialog open={deleteOpen} handler={setDeleteOpen} size="sm" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("transfers.delete.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          {selectedItem && (
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("transfers.delete.message")} <strong>{selectedItem.referenceNumber}</strong> (ID: {selectedItem.id})?
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
              {t("transfers.actions.search")}
            </Button>
            <Button color="green" onClick={openCreateModal} className="dark:bg-green-600 dark:hover:bg-green-700">
              {t("transfers.actions.add")}
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-black">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6 dark:text-blue-400" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("transfers.actions.loading")}
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
                        t("transfers.table.id"),
                        t("transfers.table.fromAccount"),
                        t("transfers.table.toAccount"),
                        t("transfers.table.amount"),
                        t("transfers.table.transferDate"),
                        t("transfers.table.description"),
                        t("transfers.table.referenceNumber"),
                        t("transfers.table.status"),
                        t("transfers.table.operations"),
                      ].map((el, idx) => (
                        <th
                          key={el}
                          className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${
                            idx === 8 ? "text-right" : ""
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
                            <Chip
                              size="sm"
                              value={row.fromAccount === "Nağd" ? t("transfers.account.cash") : t("transfers.account.bank")}
                              color={row.fromAccount === "Nağd" ? "amber" : "blue"}
                              className="dark:bg-opacity-80"
                            />
                          </td>
                          <td className={className}>
                            <Chip
                              size="sm"
                              value={row.toAccount === "Nağd" ? t("transfers.account.cash") : t("transfers.account.bank")}
                              color={row.toAccount === "Nağd" ? "amber" : "blue"}
                              className="dark:bg-opacity-80"
                            />
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
                              {row.amount} ₼
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.transferDate}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.description}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.referenceNumber}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              size="sm"
                              value={row.status === "Tamamlanıb" ? t("transfers.status.completed") : t("transfers.status.pending")}
                              color={row.status === "Tamamlanıb" ? "green" : "amber"}
                              className="dark:bg-opacity-80"
                            />
                          </td>
                          <td className={`${className} text-right`}>
                            <Menu placement="left-start">
                              <MenuHandler>
                                <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                                  <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                                </IconButton>
                              </MenuHandler>
                              <MenuList className="dark:bg-black dark:border-gray-800">
                                <MenuItem onClick={() => openViewModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                                  {t("transfers.actions.view")}
                                </MenuItem>
                                <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                                  {t("transfers.actions.edit")}
                                </MenuItem>
                                <MenuItem onClick={() => openDeleteModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                                  {t("transfers.actions.delete")}
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
                  <Card key={row.id} className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black ">
                    <CardBody className="space-y-2 dark:bg-black">
                      <div className="flex items-center justify-between">
                        <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                          {row.referenceNumber}
                        </Typography>
                        <Menu placement="left-start">
                          <MenuHandler>
                            <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                              <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                            </IconButton>
                          </MenuHandler>
                          <MenuList className="dark:bg-black dark:border-gray-800">
                            <MenuItem onClick={() => openViewModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                              {t("transfers.actions.view")}
                            </MenuItem>
                            <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                              {t("transfers.actions.edit")}
                            </MenuItem>
                            <MenuItem onClick={() => openDeleteModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                              {t("transfers.actions.delete")}
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("transfers.mobile.id")}: {row.id}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("transfers.mobile.fromAccount")}: {row.fromAccount === "Nağd" ? t("transfers.account.cash") : t("transfers.account.bank")} → {t("transfers.mobile.toAccount")}: {row.toAccount === "Nağd" ? t("transfers.account.cash") : t("transfers.account.bank")}
                      </Typography>
                      <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
                        {t("transfers.mobile.amount")}: {row.amount} ₼
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("transfers.mobile.transferDate")}: {row.transferDate}
                      </Typography>
                      <Chip
                        size="sm"
                        value={row.status === "Tamamlanıb" ? t("transfers.status.completed") : t("transfers.status.pending")}
                        color={row.status === "Tamamlanıb" ? "green" : "amber"}
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
                  {t("transfers.pagination.prev")}
                </Button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
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
                ))}
                <Button
                  variant="text"
                  size="sm"
                  color="blue-gray"
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:text-gray-600"
                >
                  {t("transfers.pagination.next")}
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default TransfersPage;
