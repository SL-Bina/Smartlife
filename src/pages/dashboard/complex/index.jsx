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
  name: `Kompleks ${index + 1}`,
  city: "Bakı",
  address: `Ünvan ${index + 1}`,
  buildings: Math.floor(Math.random() * 10) + 1,
  residents: Math.floor(Math.random() * 200) + 20,
}));

const ITEMS_PER_PAGE = 10;

const ComplexPage = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const [formName, setFormName] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formBuildings, setFormBuildings] = useState("");
  const [formResidents, setFormResidents] = useState("");

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
    setFormName("");
    setFormCity("");
    setFormAddress("");
    setFormBuildings("");
    setFormResidents("");
    setCreateOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormName(item.name);
    setFormCity(item.city);
    setFormAddress(item.address);
    setFormBuildings(String(item.buildings));
    setFormResidents(String(item.residents));
    setEditOpen(true);
  };

  const handleFilterApply = () => {
    // Filter apply logic backend və ya state ilə inteqrasiya edilə bilər
    setFilterOpen(false);
  };

  const handleFilterClear = () => {
    setFilterName("");
    setFilterCity("");
    setFilterOpen(false);
  };

  const handleCreateSave = () => {
    // Yeni kompleks yaratmaq üçün API çağırışı burada ola bilər
    setCreateOpen(false);
  };

  const handleEditSave = () => {
    // Seçilmiş kompleks üçün dəyişiklikləri saxlamaq üçün API çağırışı burada ola bilər
    setEditOpen(false);
  };

  return (
    <div className="">
      <div className="w-full bg-black my-4 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-white font-bold">Komplekslər</h3>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm">
        <DialogHeader>Kompleks filter</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Kompleks adı
            </Typography>
            <Input
              label="Ad ilə axtarış"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Şəhər
            </Typography>
            <Input
              label="Şəhər"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
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

      {/* Create complex modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="sm">
        <DialogHeader>Yeni kompleks əlavə et</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ad
            </Typography>
            <Input
              label="Kompleks adı"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Şəhər
            </Typography>
            <Input
              label="Şəhər"
              value={formCity}
              onChange={(e) => setFormCity(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ünvan
            </Typography>
            <Input
              label="Ünvan"
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Bina sayı
              </Typography>
              <Input
                type="number"
                label="Bina sayı"
                value={formBuildings}
                onChange={(e) => setFormBuildings(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Sakin sayı
              </Typography>
              <Input
                type="number"
                label="Sakin sayı"
                value={formResidents}
                onChange={(e) => setFormResidents(e.target.value)}
              />
            </div>
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

      {/* Edit complex modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm">
        <DialogHeader>Kompleks məlumatlarını dəyiş</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ad
            </Typography>
            <Input
              label="Kompleks adı"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Şəhər
            </Typography>
            <Input
              label="Şəhər"
              value={formCity}
              onChange={(e) => setFormCity(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ünvan
            </Typography>
            <Input
              label="Ünvan"
              value={formAddress}
              onChange={(e) => setFormAddress(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Bina sayı
              </Typography>
              <Input
                type="number"
                label="Bina sayı"
                value={formBuildings}
                onChange={(e) => setFormBuildings(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Sakin sayı
              </Typography>
              <Input
                type="number"
                label="Sakin sayı"
                value={formResidents}
                onChange={(e) => setFormResidents(e.target.value)}
              />
            </div>
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
            Kompleks Siyahısı
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
                      {["ID", "Ad", "Şəhər", "Ünvan", "Bina sayı", "Sakin sayı", "Əməliyyatlar"].map(
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
                              {row.name}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.city}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.address}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.buildings}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.residents}
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
                    <CardBody className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {row.name}
                        </Typography>
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
                      <Typography variant="small" color="blue-gray">
                        ID: {row.id}
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Şəhər: {row.city}
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Ünvan: {row.address}
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Bina sayı: {row.buildings}
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Sakin sayı: {row.residents}
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

export default ComplexPage;
