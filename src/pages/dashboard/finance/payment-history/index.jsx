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

const paymentHistoryData = Array.from({ length: 50 }, (_, index) => ({
  id: 86316 - index,
  payer: `Ödəniş edən ${index + 1}`,
  apartment: `Mənzil ${index + 1}`,
  building: index % 3 === 0 ? "-" : `Bina ${String.fromCharCode(65 + (index % 5))}`,
  block: `Blok ${String.fromCharCode(65 + (index % 3))}`,
  floor: (index % 16) + 1,
  area: (60 + (index % 10) * 5).toFixed(2),
  serviceDate: `2025-11-${String(1 + (index % 28)).padStart(2, "0")}`,
  amount: (20 + (index % 10) * 5).toFixed(2),
  paymentDate: `2025-11-${String(19 - (index % 10)).padStart(2, "0")} ${String(17 + (index % 5)).padStart(2, "0")}:${String(20 + (index % 40)).padStart(2, "0")}`,
  status: "Uğurlu",
  transactionType: "Mədaxil",
  paymentType: index % 2 === 0 ? "Nağd" : "Balans",
}));

const ITEMS_PER_PAGE = 10;

const PaymentHistoryPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filterPayer, setFilterPayer] = useState("");
  const [filterApartment, setFilterApartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = React.useMemo(
    () =>
      paymentHistoryData.filter((item) => {
        const matchesPayer = filterPayer
          ? item.payer.toLowerCase().includes(filterPayer.toLowerCase())
          : true;
        const matchesApartment = filterApartment
          ? item.apartment.toLowerCase().includes(filterApartment.toLowerCase())
          : true;
        const matchesStatus = filterStatus ? item.status === filterStatus : true;
        return matchesPayer && matchesApartment && matchesStatus;
      }),
    [filterPayer, filterApartment, filterStatus]
  );

  const totalAmount = filteredData
    .reduce((sum, item) => sum + parseFloat(item.amount), 0)
    .toFixed(2);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  const handleFilterApply = () => {
    setPage(1);
    setFilterOpen(false);
  };

  const handleFilterClear = () => {
    setFilterPayer("");
    setFilterApartment("");
    setFilterStatus("");
    setPage(1);
    setFilterOpen(false);
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
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black dark:bg-black my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-red-600">
        <h3 className="text-white font-bold">{t("paymentHistory.pageTitle")}</h3>
      </div>

      {/* Summary card */}
      <div className="mb-6 flex justify-end">
        <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black ">
          <CardBody className="p-4">
            <Chip
              value={`${t("paymentHistory.summary.total")}: ${totalAmount} ₼`}
              color="green"
              className="font-semibold dark:bg-opacity-80"
            />
          </CardBody>
        </Card>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white">{t("paymentHistory.filter.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black ">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("paymentHistory.filter.payer")}
            </Typography>
            <Input
              label={t("paymentHistory.filter.enter")}
              value={filterPayer}
              onChange={(e) => setFilterPayer(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("paymentHistory.filter.apartment")}
            </Typography>
            <Input
              label={t("paymentHistory.filter.enter")}
              value={filterApartment}
              onChange={(e) => setFilterApartment(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("paymentHistory.filter.status")}
            </Typography>
            <Input
              label={t("paymentHistory.filter.enter")}
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

      {/* View payment modal */}
      <Dialog open={viewOpen} handler={setViewOpen} size="lg" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("paymentHistory.view.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          {selectedItem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("paymentHistory.table.id")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                  {selectedItem.id}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("paymentHistory.table.payer")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                  {selectedItem.payer}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("paymentHistory.table.apartmentInfo")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {selectedItem.apartment}
                </Typography>
                <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                  {t("paymentHistory.labels.building")}: {selectedItem.building}, {t("paymentHistory.labels.block")}: {selectedItem.block}, {t("paymentHistory.labels.floor")}: {selectedItem.floor}, {t("paymentHistory.labels.area")}: {selectedItem.area} m²
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("paymentHistory.table.amount")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                  {selectedItem.amount} AZN
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("paymentHistory.table.paymentDate")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {selectedItem.paymentDate}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("paymentHistory.table.status")}
                </Typography>
                <Chip size="sm" value={t("paymentHistory.status.successful")} color="green" className="dark:bg-opacity-80" />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("paymentHistory.table.transactionType")}
                </Typography>
                <Chip size="sm" value={t("paymentHistory.transactionType.income")} color="green" className="dark:bg-opacity-80" />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("paymentHistory.table.paymentType")}
                </Typography>
                <Chip
                  size="sm"
                  value={selectedItem.paymentType === "Nağd" ? t("paymentHistory.paymentType.cash") : t("paymentHistory.paymentType.balance")}
                  color={selectedItem.paymentType === "Nağd" ? "amber" : "blue"}
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

      {/* Edit payment modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="md" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("paymentHistory.edit.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          {selectedItem && (
            <>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                  {t("paymentHistory.table.payer")}
                </Typography>
                <Input 
                  label={t("paymentHistory.filter.enter")}
                  defaultValue={selectedItem.payer}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                  {t("paymentHistory.table.amount")}
                </Typography>
                <Input 
                  type="number"
                  label={t("paymentHistory.filter.enter")}
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

      {/* Delete payment modal */}
      <Dialog open={deleteOpen} handler={setDeleteOpen} size="sm" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("paymentHistory.delete.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          {selectedItem && (
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("paymentHistory.delete.message")} <strong>{selectedItem.payer}</strong> (ID: {selectedItem.id})?
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
              {t("paymentHistory.actions.search")}
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-black">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6 dark:text-blue-400" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("paymentHistory.actions.loading")}
              </Typography>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full table-auto min-w-[1400px]">
                  <thead>
                    <tr>
                      {[
                        t("paymentHistory.table.id"),
                        t("paymentHistory.table.payer"),
                        t("paymentHistory.table.apartmentInfo"),
                        t("paymentHistory.table.amount"),
                        t("paymentHistory.table.paymentDate"),
                        t("paymentHistory.table.status"),
                        t("paymentHistory.table.transactionType"),
                        t("paymentHistory.table.paymentType"),
                        t("paymentHistory.table.operations"),
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
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold dark:text-white"
                            >
                              {row.payer}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                              {t("paymentHistory.labels.building")}: {row.building}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                              {t("paymentHistory.labels.block")}: {row.block}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                              {t("paymentHistory.labels.apartment")}: {row.apartment}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                              {t("paymentHistory.labels.floor")}: {row.floor}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                              {t("paymentHistory.labels.area")}: {row.area} m²
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                              {t("paymentHistory.labels.serviceDate")}: {row.serviceDate}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                              {row.amount} AZN
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.paymentDate}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip size="sm" value={t("paymentHistory.status.successful")} color="green" className="dark:bg-opacity-80" />
                          </td>
                          <td className={className}>
                            <Chip size="sm" value={t("paymentHistory.transactionType.income")} color="green" className="dark:bg-opacity-80" />
                          </td>
                          <td className={className}>
                            <Chip
                              size="sm"
                              value={row.paymentType === "Nağd" ? t("paymentHistory.paymentType.cash") : t("paymentHistory.paymentType.balance")}
                              color={row.paymentType === "Nağd" ? "amber" : "blue"}
                              className="dark:bg-opacity-80"
                            />
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
                                  {t("paymentHistory.actions.view")}
                                </MenuItem>
                                <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                                  {t("paymentHistory.actions.edit")}
                                </MenuItem>
                                <MenuItem onClick={() => openDeleteModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                                  {t("paymentHistory.actions.delete")}
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
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold dark:text-white"
                        >
                          {row.payer}
                        </Typography>
                        <Menu placement="left-start">
                          <MenuHandler>
                            <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                              <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                            </IconButton>
                          </MenuHandler>
                          <MenuList className="dark:bg-black dark:border-gray-800">
                            <MenuItem onClick={() => openViewModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                              {t("paymentHistory.actions.view")}
                            </MenuItem>
                            <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                              {t("paymentHistory.actions.edit")}
                            </MenuItem>
                            <MenuItem onClick={() => openDeleteModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                              {t("paymentHistory.actions.delete")}
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("paymentHistory.mobile.id")}: {row.id}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("paymentHistory.mobile.apartment")}: {row.apartment}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                        {t("paymentHistory.mobile.amount")}: {row.amount} AZN
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("paymentHistory.mobile.paymentDate")}: {row.paymentDate}
                      </Typography>
                      <div className="flex gap-2 flex-wrap">
                        <Chip size="sm" value={t("paymentHistory.status.successful")} color="green" className="dark:bg-opacity-80" />
                        <Chip size="sm" value={t("paymentHistory.transactionType.income")} color="green" className="dark:bg-opacity-80" />
                        <Chip
                          size="sm"
                          value={row.paymentType === "Nağd" ? t("paymentHistory.paymentType.cash") : t("paymentHistory.paymentType.balance")}
                          color={row.paymentType === "Nağd" ? "amber" : "blue"}
                          className="dark:bg-opacity-80"
                        />
                      </div>
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
                  {t("paymentHistory.pagination.prev")}
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
                  {t("paymentHistory.pagination.next")}
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default PaymentHistoryPage;

