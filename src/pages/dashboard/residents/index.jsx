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
  Select,
  Option,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

const data = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  fullName: `Sakin ${index + 1}`,
  phone: `050-000-${String(index + 1).padStart(2, "0")}`,
  email: `sakin${index + 1}@mail.com`,
  apartment: `Mənzil ${Math.floor(index / 2) + 1}`,
  status: index % 2 === 0 ? "Aktiv" : "Passiv",
}));

const ITEMS_PER_PAGE = 10;

const ResidentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [formFullName, setFormFullName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formApartment, setFormApartment] = useState("");
  const [formStatus, setFormStatus] = useState("Aktiv");

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
    setFormFullName("");
    setFormPhone("");
    setFormEmail("");
    setFormApartment("");
    setFormStatus("Aktiv");
    setCreateOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormFullName(item.fullName);
    setFormPhone(item.phone);
    setFormEmail(item.email);
    setFormApartment(item.apartment);
    setFormStatus(item.status);
    setEditOpen(true);
  };

  const handleFilterApply = () => {
    setFilterOpen(false);
  };

  const handleFilterClear = () => {
    setFilterName("");
    setFilterStatus("");
    setFilterOpen(false);
  };

  const handleCreateSave = () => {
    setCreateOpen(false);
  };

  const handleEditSave = () => {
    setEditOpen(false);
  };

  return (
    <div className=" ">
      <div className="w-full bg-black my-4 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-white font-bold">Sakinlər</h3>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm">
        <DialogHeader>Sakin filter</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ad Soyad
            </Typography>
            <Input
              label="Ad Soyad ilə axtarış"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Status
            </Typography>
            <Select
              label="Status"
              value={filterStatus}
              onChange={(val) => setFilterStatus(val || "")}
            >
              <Option value="Aktiv">Aktiv</Option>
              <Option value="Passiv">Passiv</Option>
            </Select>
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

      {/* Create resident modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="sm">
        <DialogHeader>Yeni sakin əlavə et</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ad Soyad
            </Typography>
            <Input
              label="Ad Soyad"
              value={formFullName}
              onChange={(e) => setFormFullName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Telefon
              </Typography>
              <Input
                label="Telefon"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Email
              </Typography>
              <Input
                label="Email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Mənzil
            </Typography>
            <Input
              label="Mənzil"
              value={formApartment}
              onChange={(e) => setFormApartment(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Status
            </Typography>
            <Select
              label="Status"
              value={formStatus}
              onChange={(val) => setFormStatus(val || "Aktiv")}
            >
              <Option value="Aktiv">Aktiv</Option>
              <Option value="Passiv">Passiv</Option>
            </Select>
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

      {/* Edit resident modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm">
        <DialogHeader>Sakin məlumatlarını dəyiş</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ad Soyad
            </Typography>
            <Input
              label="Ad Soyad"
              value={formFullName}
              onChange={(e) => setFormFullName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Telefon
              </Typography>
              <Input
                label="Telefon"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Email
              </Typography>
              <Input
                label="Email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Mənzil
            </Typography>
            <Input
              label="Mənzil"
              value={formApartment}
              onChange={(e) => setFormApartment(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Status
            </Typography>
            <Select
              label="Status"
              value={formStatus}
              onChange={(val) => setFormStatus(val || "Aktiv")}
            >
              <Option value="Aktiv">Aktiv</Option>
              <Option value="Passiv">Passiv</Option>
            </Select>
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
          {/* <Typography variant="h6" color="blue-gray" className="mb-1">
            Sakin Siyahısı
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
                      {["ID", "Ad Soyad", "Telefon", "Email", "Mənzil", "Status", "Əməliyyatlar"].map(
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
                              {row.fullName}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.phone}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.email}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.apartment}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography
                              variant="small"
                              color={row.status === "Aktiv" ? "green" : "red"}
                            >
                              {row.status}
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
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="text-[11px] font-medium uppercase"
                          >
                            Ad Soyad
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {row.fullName}
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
                            <MenuItem>Bax</MenuItem>
                            <MenuItem onClick={() => openEditModal(row)}>Düzəliş et</MenuItem>
                            <MenuItem>Sil</MenuItem>
                          </MenuList>
                        </Menu>
                      </div>

                      <div className="space-y-1">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="text-[11px] font-medium uppercase"
                        >
                          ID
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          {row.id}
                        </Typography>
                      </div>

                      <div className="space-y-1">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="text-[11px] font-medium uppercase"
                        >
                          Email
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          {row.email}
                        </Typography>
                      </div>

                      <div className="space-y-1">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="text-[11px] font-medium uppercase"
                        >
                          Telefon
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          {row.phone}
                        </Typography>
                      </div>

                      <div className="space-y-1">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="text-[11px] font-medium uppercase"
                        >
                          Mənzil
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          {row.apartment}
                        </Typography>
                      </div>

                      <div className="space-y-1">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="text-[11px] font-medium uppercase"
                        >
                          Status
                        </Typography>
                        <Typography
                          variant="small"
                          color={row.status === "Aktiv" ? "green" : "red"}
                          className="font-semibold"
                        >
                          {row.status}
                        </Typography>
                      </div>
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

export default ResidentsPage;
