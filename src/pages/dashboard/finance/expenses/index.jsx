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
      <div className="w-full bg-black my-4 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-white font-bold">Xərclər</h3>
      </div>

      {/* Summary card */}
      <div className="mb-6 flex justify-end">
        <Card className="border border-red-500 shadow-sm">
          <CardBody className="p-4">
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ümumi xərc
            </Typography>
            <Typography variant="h5" color="red" className="font-bold">
              {totalExpenses} ₼
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm">
        <DialogHeader>Xərc filter</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Kateqoriya
            </Typography>
            <Input
              label="Daxil et"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ödəniş üsulu
            </Typography>
            <Input
              label="Daxil et"
              value={filterPaymentMethod}
              onChange={(e) => setFilterPaymentMethod(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Status
            </Typography>
            <Input
              label="Daxil et"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2">
          <Button variant="text" color="blue-gray" onClick={handleFilterClear}>
            Təmizlə
          </Button>
          <div className="flex gap-2">
            <Button variant="outlined" color="blue-gray" onClick={() => setFilterOpen(false)}>
              Bağla
            </Button>
            <Button color="blue" onClick={handleFilterApply}>
              Tətbiq et
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {/* Create expense modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="sm">
        <DialogHeader>Yeni xərc əlavə et</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Kateqoriya
            </Typography>
            <Input
              label="Daxil et"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Açıqlama
            </Typography>
            <Input
              label="Daxil et"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Məbləğ
            </Typography>
            <Input
              type="number"
              label="Daxil et"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ödəniş üsulu
            </Typography>
            <Input
              label="Daxil et"
              value={formPaymentMethod}
              onChange={(e) => setFormPaymentMethod(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ödəniş tarixi
            </Typography>
            <Input
              type="date"
              label="Daxil et"
              value={formPaymentDate}
              onChange={(e) => setFormPaymentDate(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ödəyən
            </Typography>
            <Input
              label="Daxil et"
              value={formPaidBy}
              onChange={(e) => setFormPaidBy(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Faktura nömrəsi
            </Typography>
            <Input
              label="Daxil et"
              value={formInvoiceNumber}
              onChange={(e) => setFormInvoiceNumber(e.target.value)}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outlined" color="blue-gray" onClick={() => setCreateOpen(false)}>
            Ləğv et
          </Button>
          <Button color="green" onClick={handleCreateSave}>
            Yadda saxla
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit expense modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm">
        <DialogHeader>Xərc məlumatlarını dəyiş</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Kateqoriya
            </Typography>
            <Input
              label="Daxil et"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Açıqlama
            </Typography>
            <Input
              label="Daxil et"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Məbləğ
            </Typography>
            <Input
              type="number"
              label="Daxil et"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ödəniş üsulu
            </Typography>
            <Input
              label="Daxil et"
              value={formPaymentMethod}
              onChange={(e) => setFormPaymentMethod(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ödəniş tarixi
            </Typography>
            <Input
              type="date"
              label="Daxil et"
              value={formPaymentDate}
              onChange={(e) => setFormPaymentDate(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ödəyən
            </Typography>
            <Input
              label="Daxil et"
              value={formPaidBy}
              onChange={(e) => setFormPaidBy(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Faktura nömrəsi
            </Typography>
            <Input
              label="Daxil et"
              value={formInvoiceNumber}
              onChange={(e) => setFormInvoiceNumber(e.target.value)}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outlined" color="blue-gray" onClick={() => setEditOpen(false)}>
            Ləğv et
          </Button>
          <Button color="blue" onClick={handleEditSave}>
            Yadda saxla
          </Button>
        </DialogFooter>
      </Dialog>

      <Card className="border border-red-500 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6"
        >
          <div className="flex items-center gap-3">
            <Button variant="outlined" color="blue" onClick={() => setFilterOpen(true)}>
              Axtarış
            </Button>
            <Button color="green" onClick={openCreateModal}>
              Əlavə et
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400">
                Yüklənir...
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
                        "ID",
                        "Kateqoriya",
                        "Açıqlama",
                        "Məbləğ",
                        "Ödəniş üsulu",
                        "Ödəniş tarixi",
                        "Ödəyən",
                        "Faktura nömrəsi",
                        "Status",
                        "Əməliyyatlar",
                      ].map((el, idx) => (
                        <th
                          key={el}
                          className={`border-b border-blue-gray-100 py-3 px-6 text-left ${
                            idx === 9 ? "text-right" : ""
                          }`}
                        >
                          <Typography
                            variant="small"
                            className="text-[11px] font-medium uppercase text-blue-gray-400"
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
                        key === pageData.length - 1 ? "" : "border-b border-blue-gray-50"
                      }`;
                      return (
                        <tr key={row.id}>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.id}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {row.category}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.description}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="red" className="font-semibold">
                              {row.amount} ₼
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              size="sm"
                              value={row.paymentMethod}
                              color={row.paymentMethod === "Nağd" ? "amber" : "blue"}
                            />
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.paymentDate}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.paidBy}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.invoiceNumber}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              size="sm"
                              value={row.status}
                              color={row.status === "Təsdiqlənib" ? "green" : "amber"}
                            />
                          </td>
                          <td className={`${className} text-right`}>
                            <Menu placement="left-start">
                              <MenuHandler>
                                <IconButton size="sm" variant="text" color="blue-gray">
                                  <EllipsisVerticalIcon
                                    strokeWidth={2}
                                    className="h-5 w-5"
                                  />
                                </IconButton>
                              </MenuHandler>
                              <MenuList>
                                <MenuItem>Bax</MenuItem>
                                <MenuItem onClick={() => openEditModal(row)}>Düzəliş et</MenuItem>
                                <MenuItem>Sil</MenuItem>
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
                  <Card key={row.id} className="border border-red-500 shadow-sm">
                    <CardBody className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {row.category}
                        </Typography>
                        <Menu placement="left-start">
                          <MenuHandler>
                            <IconButton size="sm" variant="text" color="blue-gray">
                              <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                            </IconButton>
                          </MenuHandler>
                          <MenuList>
                            <MenuItem>Bax</MenuItem>
                            <MenuItem onClick={() => openEditModal(row)}>Düzəliş et</MenuItem>
                            <MenuItem>Sil</MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                      <Typography variant="small" color="blue-gray">
                        ID: {row.id}
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Açıqlama: {row.description}
                      </Typography>
                      <Typography variant="small" color="red" className="font-semibold">
                        Məbləğ: {row.amount} ₼
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Ödəniş üsulu: {row.paymentMethod}
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Ödəniş tarixi: {row.paymentDate}
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Ödəyən: {row.paidBy}
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Faktura: {row.invoiceNumber}
                      </Typography>
                      <Chip
                        size="sm"
                        value={row.status}
                        color={row.status === "Təsdiqlənib" ? "green" : "amber"}
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
                >
                  Geri
                </Button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === page ? "filled" : "text"}
                      size="sm"
                      color={pageNumber === page ? "blue" : "blue-gray"}
                      onClick={() => setPage(pageNumber)}
                      className="min-w-[32px] px-2"
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
                >
                  İrəli
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

