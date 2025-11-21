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

const expensesData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  category: ["Təmizlik", "Santexnika", "Elektrik", "Təmir", "Digər"][index % 5],
  description: `Xərc açıqlaması ${index + 1}`,
  amount: (50 + (index % 10) * 10).toFixed(2),
  paymentMethod: index % 2 === 0 ? "Nağd" : "Bank",
  paymentDate: `2025-11-${String(1 + (index % 20)).padStart(2, "0")}`,
  paidBy: `Ödəyən ${index + 1}`,
  invoiceNumber: `INV-${String(1000 + index).padStart(4, "0")}`,
  status: index % 3 === 0 ? "Təsdiqlənib" : "Gözləyir",
}));

const ITEMS_PER_PAGE = 10;

const ExpensesPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [formCategory, setFormCategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formPaymentMethod, setFormPaymentMethod] = useState("");
  const [formPaymentDate, setFormPaymentDate] = useState("");
  const [formPaidBy, setFormPaidBy] = useState("");
  const [formInvoiceNumber, setFormInvoiceNumber] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = React.useMemo(
    () =>
      expensesData.filter((item) => {
        const matchesCategory = filterCategory
          ? item.category.toLowerCase().includes(filterCategory.toLowerCase())
          : true;
        const matchesPaymentMethod = filterPaymentMethod
          ? item.paymentMethod === filterPaymentMethod
          : true;
        const matchesStatus = filterStatus ? item.status === filterStatus : true;
        return matchesCategory && matchesPaymentMethod && matchesStatus;
      }),
    [filterCategory, filterPaymentMethod, filterStatus]
  );

  const totalExpenses = filteredData
    .reduce((sum, item) => sum + parseFloat(item.amount), 0)
    .toFixed(2);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  const openCreateModal = () => {
    setFormCategory("");
    setFormDescription("");
    setFormAmount("");
    setFormPaymentMethod("");
    setFormPaymentDate("");
    setFormPaidBy("");
    setFormInvoiceNumber("");
    setCreateOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormCategory(item.category);
    setFormDescription(item.description);
    setFormAmount(item.amount);
    setFormPaymentMethod(item.paymentMethod);
    setFormPaymentDate(item.paymentDate);
    setFormPaidBy(item.paidBy);
    setFormInvoiceNumber(item.invoiceNumber);
    setEditOpen(true);
  };

  const handleFilterApply = () => {
    setPage(1);
    setFilterOpen(false);
  };

  const handleFilterClear = () => {
    setFilterCategory("");
    setFilterPaymentMethod("");
    setFilterStatus("");
    setPage(1);
    setFilterOpen(false);
  };

  const handleCreateSave = () => {
    setCreateOpen(false);
  };

  const handleEditSave = () => {
    setEditOpen(false);
  };

  return (
    <div className="">
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black dark:bg-gray-900 my-4 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-white font-bold">{t("expenses.pageTitle")}</h3>
      </div>

      {/* Summary card */}
      <div className="mb-6 flex justify-end">
        <Card className="border border-red-500 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardBody className="p-4">
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.summary.totalExpenses")}
            </Typography>
            <Typography variant="h5" color="red" className="font-bold dark:text-red-300">
              {totalExpenses} ₼
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm" className="dark:bg-gray-800">
        <DialogHeader className="dark:text-white">{t("expenses.filter.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.filter.category")}
            </Typography>
            <Input
              label={t("expenses.filter.enter")}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.filter.paymentMethod")}
            </Typography>
            <Input
              label={t("expenses.filter.enter")}
              value={filterPaymentMethod}
              onChange={(e) => setFilterPaymentMethod(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.filter.status")}
            </Typography>
            <Input
              label={t("expenses.filter.enter")}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 dark:border-gray-700">
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

      {/* Create expense modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="sm" className="dark:bg-gray-800">
        <DialogHeader className="dark:text-white">{t("expenses.create.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.form.category")}
            </Typography>
            <Input
              label={t("expenses.form.enter")}
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.form.description")}
            </Typography>
            <Input
              label={t("expenses.form.enter")}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.form.amount")}
            </Typography>
            <Input
              type="number"
              label={t("expenses.form.enter")}
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.form.paymentMethod")}
            </Typography>
            <Input
              label={t("expenses.form.enter")}
              value={formPaymentMethod}
              onChange={(e) => setFormPaymentMethod(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.form.paymentDate")}
            </Typography>
            <Input
              type="date"
              label={t("expenses.form.enter")}
              value={formPaymentDate}
              onChange={(e) => setFormPaymentDate(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.form.paidBy")}
            </Typography>
            <Input
              label={t("expenses.form.enter")}
              value={formPaidBy}
              onChange={(e) => setFormPaidBy(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.form.invoiceNumber")}
            </Typography>
            <Input
              label={t("expenses.form.enter")}
              value={formInvoiceNumber}
              onChange={(e) => setFormInvoiceNumber(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="outlined" color="blue-gray" onClick={() => setCreateOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.cancel")}
          </Button>
          <Button color="green" onClick={handleCreateSave} className="dark:bg-green-600 dark:hover:bg-green-700">
            {t("buttons.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit expense modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm" className="dark:bg-gray-800">
        <DialogHeader className="dark:text-white">{t("expenses.edit.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.form.category")}
            </Typography>
            <Input
              label={t("expenses.form.enter")}
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.form.description")}
            </Typography>
            <Input
              label={t("expenses.form.enter")}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.form.amount")}
            </Typography>
            <Input
              type="number"
              label={t("expenses.form.enter")}
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.form.paymentMethod")}
            </Typography>
            <Input
              label={t("expenses.form.enter")}
              value={formPaymentMethod}
              onChange={(e) => setFormPaymentMethod(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.form.paymentDate")}
            </Typography>
            <Input
              type="date"
              label={t("expenses.form.enter")}
              value={formPaymentDate}
              onChange={(e) => setFormPaymentDate(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.form.paidBy")}
            </Typography>
            <Input
              label={t("expenses.form.enter")}
              value={formPaidBy}
              onChange={(e) => setFormPaidBy(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("expenses.form.invoiceNumber")}
            </Typography>
            <Input
              label={t("expenses.form.enter")}
              value={formInvoiceNumber}
              onChange={(e) => setFormInvoiceNumber(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="outlined" color="blue-gray" onClick={() => setEditOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.cancel")}
          </Button>
          <Button color="blue" onClick={handleEditSave} className="dark:bg-blue-600 dark:hover:bg-blue-700">
            {t("buttons.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      <Card className="border border-red-500 shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800"
        >
          <div className="flex items-center gap-3">
            <Button variant="outlined" color="blue" onClick={() => setFilterOpen(true)} className="dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-600/20">
              {t("expenses.actions.search")}
            </Button>
            <Button color="green" onClick={openCreateModal} className="dark:bg-green-600 dark:hover:bg-green-700">
              {t("expenses.actions.add")}
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6 dark:text-blue-400" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("expenses.actions.loading")}
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
                        t("expenses.table.id"),
                        t("expenses.table.category"),
                        t("expenses.table.description"),
                        t("expenses.table.amount"),
                        t("expenses.table.paymentMethod"),
                        t("expenses.table.paymentDate"),
                        t("expenses.table.paidBy"),
                        t("expenses.table.invoiceNumber"),
                        t("expenses.table.status"),
                        t("expenses.table.operations"),
                      ].map((el, idx) => (
                        <th
                          key={el}
                          className={`border-b border-blue-gray-100 dark:border-gray-700 py-3 px-6 text-left ${
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
                        key === pageData.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-700"
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
                              {row.category}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.description}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="red" className="font-semibold dark:text-red-300">
                              {row.amount} ₼
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              size="sm"
                              value={row.paymentMethod === "Nağd" ? t("expenses.paymentMethod.cash") : t("expenses.paymentMethod.bank")}
                              color={row.paymentMethod === "Nağd" ? "amber" : "blue"}
                              className="dark:bg-opacity-80"
                            />
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.paymentDate}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.paidBy}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.invoiceNumber}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              size="sm"
                              value={row.status === "Təsdiqlənib" ? t("expenses.status.approved") : t("expenses.status.pending")}
                              color={row.status === "Təsdiqlənib" ? "green" : "amber"}
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
                              <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                                <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">{t("expenses.actions.view")}</MenuItem>
                                <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("expenses.actions.edit")}</MenuItem>
                                <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">{t("expenses.actions.delete")}</MenuItem>
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
                  <Card key={row.id} className="border border-red-500 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <CardBody className="space-y-2 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold dark:text-white"
                        >
                          {row.category}
                        </Typography>
                        <Menu placement="left-start">
                          <MenuHandler>
                            <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                              <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                            </IconButton>
                          </MenuHandler>
                          <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                            <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">{t("expenses.actions.view")}</MenuItem>
                            <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("expenses.actions.edit")}</MenuItem>
                            <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">{t("expenses.actions.delete")}</MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("expenses.mobile.id")}: {row.id}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("expenses.mobile.description")}: {row.description}
                      </Typography>
                      <Typography variant="small" color="red" className="font-semibold dark:text-red-300">
                        {t("expenses.mobile.amount")}: {row.amount} ₼
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("expenses.mobile.paymentMethod")}: {row.paymentMethod === "Nağd" ? t("expenses.paymentMethod.cash") : t("expenses.paymentMethod.bank")}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("expenses.mobile.paymentDate")}: {row.paymentDate}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("expenses.mobile.paidBy")}: {row.paidBy}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("expenses.mobile.invoice")}: {row.invoiceNumber}
                      </Typography>
                      <Chip
                        size="sm"
                        value={row.status === "Təsdiqlənib" ? t("expenses.status.approved") : t("expenses.status.pending")}
                        color={row.status === "Təsdiqlənib" ? "green" : "amber"}
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
                  {t("expenses.pagination.prev")}
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
                  {t("expenses.pagination.next")}
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ExpensesPage;

