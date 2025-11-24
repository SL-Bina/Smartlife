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

const debtorApartmentsData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  apartment: `Mənzil ${index + 1}`,
  building: `Bina ${String.fromCharCode(65 + (index % 5))}`,
  block: `Blok ${String.fromCharCode(65 + (index % 3))}`,
  floor: (index % 16) + 1,
  area: (60 + (index % 10) * 5).toFixed(2),
  owner: `Sahib ${index + 1}`,
  phone: `050-${String(index + 1).padStart(7, "0")}`,
  totalDebt: (100 + (index % 20) * 10).toFixed(2),
  invoiceCount: index % 5 + 1,
  lastPaymentDate: index % 3 === 0 ? `2025-11-${String(19 - (index % 10)).padStart(2, "0")}` : "-",
  status: index % 3 === 0 ? "Ödənilib" : "Borclu",
}));

const ITEMS_PER_PAGE = 10;

const DebtorApartmentsPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [invoicesOpen, setInvoicesOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filterApartment, setFilterApartment] = useState("");
  const [filterOwner, setFilterOwner] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = React.useMemo(
    () =>
      debtorApartmentsData.filter((item) => {
        const matchesApartment = filterApartment
          ? item.apartment.toLowerCase().includes(filterApartment.toLowerCase())
          : true;
        const matchesOwner = filterOwner
          ? item.owner.toLowerCase().includes(filterOwner.toLowerCase())
          : true;
        const matchesStatus = filterStatus ? item.status === filterStatus : true;
        return matchesApartment && matchesOwner && matchesStatus;
      }),
    [filterApartment, filterOwner, filterStatus]
  );

  const totalDebt = filteredData
    .filter((item) => item.status === "Borclu")
    .reduce((sum, item) => sum + parseFloat(item.totalDebt), 0)
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
    setFilterApartment("");
    setFilterOwner("");
    setFilterStatus("");
    setPage(1);
    setFilterOpen(false);
  };

  const openViewModal = (item) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const openPayModal = (item) => {
    setSelectedItem(item);
    setPayOpen(true);
  };

  const openInvoicesModal = (item) => {
    setSelectedItem(item);
    setInvoicesOpen(true);
  };

  const handlePaySave = () => {
    setPayOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="">
      {/* Section title bar to match Home design */}
          <div className="w-full bg-black dark:bg-black my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-red-600">
        <h3 className="text-white font-bold">{t("debtorApartments.pageTitle")}</h3>
      </div>

      {/* Summary card */}
      <div className="mb-6 flex justify-end">
        <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black ">
          <CardBody className="p-4">
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("debtorApartments.summary.totalDebt")}
            </Typography>
            <Typography variant="h5" color="red" className="font-bold dark:text-red-300">
              {totalDebt} ₼
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white">{t("debtorApartments.filter.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black ">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("debtorApartments.filter.apartment")}
            </Typography>
            <Input
              label={t("debtorApartments.filter.enter")}
              value={filterApartment}
              onChange={(e) => setFilterApartment(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("debtorApartments.filter.owner")}
            </Typography>
            <Input
              label={t("debtorApartments.filter.enter")}
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("debtorApartments.filter.status")}
            </Typography>
            <Input
              label={t("debtorApartments.filter.enter")}
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

      {/* View debtor apartment modal */}
      <Dialog open={viewOpen} handler={setViewOpen} size="lg" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("debtorApartments.view.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          {selectedItem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("debtorApartments.table.id")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                  {selectedItem.id}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("debtorApartments.table.apartment")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="font-semibold dark:text-white">
                  {selectedItem.apartment}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("debtorApartments.table.apartmentInfo")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {t("debtorApartments.labels.building")}: {selectedItem.building}, {t("debtorApartments.labels.block")}: {selectedItem.block}, {t("debtorApartments.labels.floor")}: {selectedItem.floor}, {t("debtorApartments.labels.area")}: {selectedItem.area} m²
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("debtorApartments.table.owner")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {selectedItem.owner}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("debtorApartments.table.phone")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {selectedItem.phone}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("debtorApartments.table.totalDebt")}
                </Typography>
                <Typography
                  variant="small"
                  color={parseFloat(selectedItem.totalDebt) > 0 ? "red" : "green"}
                  className={`font-semibold ${parseFloat(selectedItem.totalDebt) > 0 ? "dark:text-red-400" : "dark:text-green-300"}`}
                >
                  {selectedItem.totalDebt} ₼
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("debtorApartments.table.invoiceCount")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {selectedItem.invoiceCount}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("debtorApartments.table.lastPaymentDate")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                  {selectedItem.lastPaymentDate}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                  {t("debtorApartments.table.status")}
                </Typography>
                <Chip
                  size="sm"
                  value={selectedItem.status === "Ödənilib" ? t("debtorApartments.status.paid") : t("debtorApartments.status.debtor")}
                  color={selectedItem.status === "Ödənilib" ? "green" : "red"}
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

      {/* Pay debt modal */}
      <Dialog open={payOpen} handler={setPayOpen} size="md" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("debtorApartments.pay.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          {selectedItem && (
            <>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                  {t("debtorApartments.table.totalDebt")}
                </Typography>
                <Typography variant="small" color="red" className="font-semibold dark:text-red-300">
                  {selectedItem.totalDebt} ₼
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                  {t("debtorApartments.pay.amount")}
                </Typography>
                <Input 
                  type="number"
                  label={t("debtorApartments.filter.enter")}
                  className="dark:text-white"
                  labelProps={{ className: "dark:text-gray-400" }}
                />
              </div>
            </>
          )}
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-black border-t border-gray-200 dark:border-gray-700 pt-3">
          <Button variant="outlined" color="blue-gray" onClick={() => setPayOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.cancel")}
          </Button>
          <Button color="green" onClick={handlePaySave} className="dark:bg-green-600 dark:hover:bg-green-700">
            {t("buttons.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* View invoices modal */}
      <Dialog open={invoicesOpen} handler={setInvoicesOpen} size="lg" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("debtorApartments.invoices.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-black py-4">
          {selectedItem && (
            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
              {t("debtorApartments.invoices.message")} {selectedItem.apartment} ({t("debtorApartments.table.invoiceCount")}: {selectedItem.invoiceCount})
            </Typography>
          )}
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-black border-t border-gray-200 dark:border-gray-700 pt-3">
          <Button variant="outlined" color="blue-gray" onClick={() => setInvoicesOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.close")}
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
              {t("debtorApartments.actions.search")}
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-black">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6 dark:text-blue-400" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("debtorApartments.actions.loading")}
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
                        t("debtorApartments.table.id"),
                        t("debtorApartments.table.apartment"),
                        t("debtorApartments.table.apartmentInfo"),
                        t("debtorApartments.table.owner"),
                        t("debtorApartments.table.phone"),
                        t("debtorApartments.table.totalDebt"),
                        t("debtorApartments.table.invoiceCount"),
                        t("debtorApartments.table.lastPaymentDate"),
                        t("debtorApartments.table.status"),
                        t("debtorApartments.table.operations"),
                      ].map((el, idx) => (
                        <th
                          key={el}
                          className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${
                            idx === 9 ? "text-right" : ""
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
                              {row.apartment}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                              {t("debtorApartments.labels.building")}: {row.building}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                              {t("debtorApartments.labels.block")}: {row.block}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                              {t("debtorApartments.labels.floor")}: {row.floor}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs dark:text-gray-400">
                              {t("debtorApartments.labels.area")}: {row.area} m²
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.owner}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.phone}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color={parseFloat(row.totalDebt) > 0 ? "red" : "green"}
                              className={`font-semibold ${parseFloat(row.totalDebt) > 0 ? "dark:text-red-400" : "dark:text-green-300"}`}
                            >
                              {row.totalDebt} ₼
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.invoiceCount}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.lastPaymentDate}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              size="sm"
                              value={row.status === "Ödənilib" ? t("debtorApartments.status.paid") : t("debtorApartments.status.debtor")}
                              color={row.status === "Ödənilib" ? "green" : "red"}
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
                                  {t("debtorApartments.actions.view")}
                                </MenuItem>
                                <MenuItem onClick={() => openPayModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                                  {t("debtorApartments.actions.pay")}
                                </MenuItem>
                                <MenuItem onClick={() => openInvoicesModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                                  {t("debtorApartments.actions.invoices")}
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
                          {row.apartment}
                        </Typography>
                        <Menu placement="left-start">
                          <MenuHandler>
                            <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                              <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                            </IconButton>
                          </MenuHandler>
                          <MenuList className="dark:bg-black dark:border-gray-800">
                            <MenuItem onClick={() => openViewModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                              {t("debtorApartments.actions.view")}
                            </MenuItem>
                            <MenuItem onClick={() => openPayModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                              {t("debtorApartments.actions.pay")}
                            </MenuItem>
                            <MenuItem onClick={() => openInvoicesModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                              {t("debtorApartments.actions.invoices")}
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("debtorApartments.mobile.id")}: {row.id}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("debtorApartments.mobile.owner")}: {row.owner}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("debtorApartments.mobile.phone")}: {row.phone}
                      </Typography>
                      <Typography
                        variant="small"
                        color={parseFloat(row.totalDebt) > 0 ? "red" : "green"}
                        className={`font-semibold ${parseFloat(row.totalDebt) > 0 ? "dark:text-red-400" : "dark:text-green-300"}`}
                      >
                        {t("debtorApartments.mobile.totalDebt")}: {row.totalDebt} ₼
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("debtorApartments.mobile.invoiceCount")}: {row.invoiceCount}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("debtorApartments.mobile.lastPayment")}: {row.lastPaymentDate}
                      </Typography>
                      <Chip
                        size="sm"
                        value={row.status === "Ödənilib" ? t("debtorApartments.status.paid") : t("debtorApartments.status.debtor")}
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
                  {t("debtorApartments.pagination.prev")}
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
                  {t("debtorApartments.pagination.next")}
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default DebtorApartmentsPage;

