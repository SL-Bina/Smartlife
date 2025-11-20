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
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
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

  return (
    <div className="">
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black my-4 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-white font-bold">Ödəniş tarixçəsi</h3>
      </div>

      {/* Summary card */}
      <div className="mb-6 flex justify-end">
        <Card className="border border-red-500 shadow-sm">
          <CardBody className="p-4">
            <Chip
              value={`Toplam: ${totalAmount} ₼`}
              color="green"
              className="font-semibold"
            />
          </CardBody>
        </Card>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm">
        <DialogHeader>Ödəniş tarixçəsi filter</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ödəniş edən şəxs
            </Typography>
            <Input
              label="Daxil et"
              value={filterPayer}
              onChange={(e) => setFilterPayer(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Mənzil
            </Typography>
            <Input
              label="Daxil et"
              value={filterApartment}
              onChange={(e) => setFilterApartment(e.target.value)}
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
                <table className="w-full table-auto min-w-[1400px]">
                  <thead>
                    <tr>
                      {[
                        "ID",
                        "Ödəniş edən şəxs",
                        "Mənzil məlumatları",
                        "Məbləğ",
                        "Ödəniş tarixi",
                        "Status",
                        "Əməliyyat Növü",
                        "Ödəniş növü",
                        "Əməliyyatlar",
                      ].map((el, idx) => (
                        <th
                          key={el}
                          className={`border-b border-blue-gray-100 py-3 px-6 text-left ${
                            idx === 8 ? "text-right" : ""
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
                              {row.payer}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="text-xs">
                              Bina: {row.building}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs">
                              Blok: {row.block}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs">
                              Mənzil: {row.apartment}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs">
                              Mərtəbə: {row.floor}
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs">
                              Sahə: {row.area} m²
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="text-xs">
                              Xidmət tarixi: {row.serviceDate}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                              {row.amount} AZN
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.paymentDate}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip size="sm" value={row.status} color="green" />
                          </td>
                          <td className={className}>
                            <Chip size="sm" value={row.transactionType} color="green" />
                          </td>
                          <td className={className}>
                            <Chip
                              size="sm"
                              value={row.paymentType}
                              color={row.paymentType === "Nağd" ? "amber" : "blue"}
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
                          {row.payer}
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
                        Mənzil: {row.apartment}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="font-semibold">
                        Məbləğ: {row.amount} AZN
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Ödəniş tarixi: {row.paymentDate}
                      </Typography>
                      <div className="flex gap-2 flex-wrap">
                        <Chip size="sm" value={row.status} color="green" />
                        <Chip size="sm" value={row.transactionType} color="green" />
                        <Chip
                          size="sm"
                          value={row.paymentType}
                          color={row.paymentType === "Nağd" ? "amber" : "blue"}
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

export default PaymentHistoryPage;

