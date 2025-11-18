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
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const data = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  number: `Mənzil ${index + 1}`,
  block: `Blok ${String.fromCharCode(65 + (index % 5))}`,
  floor: (index % 16) + 1,
  area: 60 + (index % 10) * 5,
  resident: `Sakin ${index + 1}`,
  serviceFee: 20 + (index % 6) * 2,
}));

const ITEMS_PER_PAGE = 10;

const PropertiesPage = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filterNumber, setFilterNumber] = useState("");
  const [filterBlock, setFilterBlock] = useState("");

  const [formNumber, setFormNumber] = useState("");
  const [formBlock, setFormBlock] = useState("");
  const [formFloor, setFormFloor] = useState("");
  const [formArea, setFormArea] = useState("");
  const [formResident, setFormResident] = useState("");

  const [feeOpen, setFeeOpen] = useState(false);
  const [feeItem, setFeeItem] = useState(null);
  const [feeValue, setFeeValue] = useState("");

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
    setFormNumber("");
    setFormBlock("");
    setFormFloor("");
    setFormArea("");
    setFormResident("");
    setCreateOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormNumber(item.number);
    setFormBlock(item.block);
    setFormFloor(String(item.floor));
    setFormArea(String(item.area));
    setFormResident(item.resident);
    setEditOpen(true);
  };

  const handleFilterApply = () => {
    setFilterOpen(false);
  };

  const handleFilterClear = () => {
    setFilterNumber("");
    setFilterBlock("");
    setFilterOpen(false);
  };

  const handleCreateSave = () => {
    setCreateOpen(false);
  };

  const handleEditSave = () => {
    setEditOpen(false);
  };

  const openFeeModal = (item) => {
    setFeeItem(item);
    setFeeValue(String(item.serviceFee ?? ""));
    setFeeOpen(true);
  };

  const handleFeeSave = () => {
    // Burada seçilmiş mənzil üçün servis haqqını saxlamaq üçün API çağırışı ola bilər
    setFeeOpen(false);
  };

  return (
    <div className=" ">
      <div className="w-full bg-black my-4 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-white font-bold">Mənzillər</h3>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm">
        <DialogHeader>Mənzil filter</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Mənzil
            </Typography>
            <Input
              label="Mənzil nömrəsi ilə axtarış"
              value={filterNumber}
              onChange={(e) => setFilterNumber(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Blok
            </Typography>
            <Input
              label="Blok"
              value={filterBlock}
              onChange={(e) => setFilterBlock(e.target.value)}
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

      {/* Create property modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="sm">
        <DialogHeader>Yeni mənzil əlavə et</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Mənzil
            </Typography>
            <Input
              label="Mənzil"
              value={formNumber}
              onChange={(e) => setFormNumber(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Blok
            </Typography>
            <Input
              label="Blok"
              value={formBlock}
              onChange={(e) => setFormBlock(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Mərtəbə
              </Typography>
              <Input
                type="number"
                label="Mərtəbə"
                value={formFloor}
                onChange={(e) => setFormFloor(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Sahə (m²)
              </Typography>
              <Input
                type="number"
                label="Sahə"
                value={formArea}
                onChange={(e) => setFormArea(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Sakin
            </Typography>
            <Input
              label="Sakin"
              value={formResident}
              onChange={(e) => setFormResident(e.target.value)}
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

      {/* Edit property modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm">
        <DialogHeader>Mənzil məlumatlarını dəyiş</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Mənzil
            </Typography>
            <Input
              label="Mənzil"
              value={formNumber}
              onChange={(e) => setFormNumber(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Blok
            </Typography>
            <Input
              label="Blok"
              value={formBlock}
              onChange={(e) => setFormBlock(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Mərtəbə
              </Typography>
              <Input
                type="number"
                label="Mərtəbə"
                value={formFloor}
                onChange={(e) => setFormFloor(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Sahə (m²)
              </Typography>
              <Input
                type="number"
                label="Sahə"
                value={formArea}
                onChange={(e) => setFormArea(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Sakin
            </Typography>
            <Input
              label="Sakin"
              value={formResident}
              onChange={(e) => setFormResident(e.target.value)}
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

      {/* Service fee modal */}
      <Dialog open={feeOpen} handler={setFeeOpen} size="sm">
        <DialogHeader>
          Servis haqqı - {feeItem ? feeItem.number : ""}
        </DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Servis haqqı (AZN / ay)
            </Typography>
            <Input
              type="number"
              label="Servis haqqı"
              value={feeValue}
              onChange={(e) => setFeeValue(e.target.value)}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outlined" color="blue-gray" onClick={() => setFeeOpen(false)}>
            Ləğv et
          </Button>
          <Button color="blue" onClick={handleFeeSave}>
            Yadda saxla
          </Button>
        </DialogFooter>
      </Dialog>

      <Card className="border border-blue-gray-100 shadow-sm">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6"
        >
          {/* <Typography variant="h6" color="blue-gray" className="mb-1">
            Mənzil Siyahısı
          </Typography> */}
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
              <div className="hidden lg:block">
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      {["ID", "Mənzil", "Blok", "Mərtəbə", "Sahə (m²)", "Sakin", "Əməliyyatlar"].map(
                        (el, idx) => (
                          <th
                            key={el}
                            className={`border-b border-blue-gray-100 py-3 px-6 text-left ${
                              idx === 6 ? "text-right" : ""
                            }`}
                          >
                            <Typography
                              variant="small"
                              className="text-[11px] font-medium uppercase text-blue-gray-400"
                            >
                              {el}
                            </Typography>
                          </th>
                        )
                      )}
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
                              {row.number}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.block}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.floor}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.area}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.resident}
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
                                <MenuItem onClick={() => openFeeModal(row)}>Servis haqqı</MenuItem>
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
                  <Card
                    key={row.id}
                    className="border border-red-500 shadow-sm"
                  >
                    <CardBody className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {row.number}
                          </Typography>
                          <Typography variant="small" className="text-xs text-blue-gray-400">
                            ID: {row.id}
                          </Typography>
                        </div>
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
                            <MenuItem onClick={() => openFeeModal(row)}>Servis haqqı</MenuItem>
                            <MenuItem onClick={() => openEditModal(row)}>Düzəliş et</MenuItem>
                            <MenuItem>Sil</MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                      <Typography variant="small" color="blue-gray">
                        Blok: {row.block}
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Mərtəbə: {row.floor}
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Sahə: {row.area} m²
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Sakin: {row.resident}
                      </Typography>
                    </CardBody>
                  </Card>
                ))}
              </div>

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

export default PropertiesPage;
