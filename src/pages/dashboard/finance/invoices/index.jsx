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
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
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
    setCreateOpen(true);
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

  return (
    <div className="">
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black my-4 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-white font-bold">Fakturalar</h3>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border border-red-500 shadow-sm">
          <CardBody className="p-4">
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ödənilib
            </Typography>
            <Typography variant="h5" color="green" className="font-bold">
              {totalPaid} ₼
            </Typography>
          </CardBody>
        </Card>
        <Card className="border border-red-500 shadow-sm">
          <CardBody className="p-4">
            <Typography variant="small" color="blue-gray" className="mb-1">
              İstehlak həcmi
            </Typography>
            <Typography variant="h5" color="blue-gray" className="font-bold">
              {totalConsumption} ₼
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm">
        <DialogHeader>Faktura filter</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Xidmət adı
            </Typography>
            <Input
              label="Daxil et"
              value={filterServiceName}
              onChange={(e) => setFilterServiceName(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Mənzil sahibi
            </Typography>
            <Input
              label="Daxil et"
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
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

      {/* Create invoice modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="sm">
        <DialogHeader>Yeni faktura əlavə et</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Xidmət adı
            </Typography>
            <Input label="Daxil et" />
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
                        "Xidmət adı",
                        "Mənzil sahibi",
                        "Mənzil məlumatları",
                        "Məbləğ",
                        "Ödənilən məbləğ",
                        "Qalıq",
                        "Status",
                        "Faktura tarixi",
                        "Ödəniş tarixi",
                        "Ödəniş üsulu",
                        "Əməliyyatlar",
                      ].map((el, idx) => (
                        <th
                          key={el}
                          className={`border-b border-blue-gray-100 py-3 px-6 text-left ${
                            idx === 11 ? "text-right" : ""
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
                              {row.serviceName}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.owner}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs">
                              Balans: {row.ownerBalance} ₼
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.apartment}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs">
                              Bina: {row.building}, Blok: {row.block}, Mərtəbə: {row.floor}, Sahə:{" "}
                              {row.area} m²
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {row.amount} ₼
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="green" className="font-semibold">
                              {row.paidAmount} ₼
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color={parseFloat(row.remaining) > 0 ? "red" : "blue-gray"}
                              className="font-semibold"
                            >
                              {row.remaining} ₼
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              size="sm"
                              value={row.status}
                              color={row.status === "Ödənilib" ? "green" : "red"}
                            />
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.invoiceDate}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.paymentDate || "-"}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.paymentMethod || "-"}
                            </Typography>
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
                                <MenuItem>Düzəliş et</MenuItem>
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
                          {row.serviceName}
                        </Typography>
                        <Menu placement="left-start">
                          <MenuHandler>
                            <IconButton size="sm" variant="text" color="blue-gray">
                              <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                            </IconButton>
                          </MenuHandler>
                          <MenuList>
                            <MenuItem>Bax</MenuItem>
                            <MenuItem>Düzəliş et</MenuItem>
                            <MenuItem>Sil</MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                      <Typography variant="small" color="blue-gray">
                        ID: {row.id}
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Mənzil sahibi: {row.owner}
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Məbləğ: {row.amount} ₼
                      </Typography>
                      <Typography variant="small" color="green">
                        Ödənilən: {row.paidAmount} ₼
                      </Typography>
                      <Typography
                        variant="small"
                        color={parseFloat(row.remaining) > 0 ? "red" : "blue-gray"}
                      >
                        Qalıq: {row.remaining} ₼
                      </Typography>
                      <Chip
                        size="sm"
                        value={row.status}
                        color={row.status === "Ödənilib" ? "green" : "red"}
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

export default InvoicesPage;

