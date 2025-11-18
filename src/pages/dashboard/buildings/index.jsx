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
  name: `Bina ${index + 1}`,
  complex: `Kompleks ${Math.floor(index / 5) + 1}`,
  blocks: Math.floor(Math.random() * 5) + 1,
  apartments: Math.floor(Math.random() * 80) + 20,
}));

const ITEMS_PER_PAGE = 10;

const BuildingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterComplex, setFilterComplex] = useState("");

  const [formName, setFormName] = useState("");
  const [formComplex, setFormComplex] = useState("");
  const [formBlocks, setFormBlocks] = useState("");
  const [formApartments, setFormApartments] = useState("");

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
    setFormComplex("");
    setFormBlocks("");
    setFormApartments("");
    setCreateOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormName(item.name);
    setFormComplex(item.complex);
    setFormBlocks(String(item.blocks));
    setFormApartments(String(item.apartments));
    setEditOpen(true);
  };

  const handleFilterApply = () => {
    setFilterOpen(false);
  };

  const handleFilterClear = () => {
    setFilterName("");
    setFilterComplex("");
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
      <div className="w-full bg-black my-4 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-white font-bold">Binalar</h3>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm">
        <DialogHeader>Bina filter</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Bina adı
            </Typography>
            <Input
              label="Ad ilə axtarış"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Kompleks
            </Typography>
            <Input
              label="Kompleks"
              value={filterComplex}
              onChange={(e) => setFilterComplex(e.target.value)}
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

      {/* Create building modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="sm">
        <DialogHeader>Yeni bina əlavə et</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ad
            </Typography>
            <Input
              label="Bina adı"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Kompleks
            </Typography>
            <Input
              label="Kompleks"
              value={formComplex}
              onChange={(e) => setFormComplex(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Blok sayı
              </Typography>
              <Input
                type="number"
                label="Blok sayı"
                value={formBlocks}
                onChange={(e) => setFormBlocks(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Mənzil sayı
              </Typography>
              <Input
                type="number"
                label="Mənzil sayı"
                value={formApartments}
                onChange={(e) => setFormApartments(e.target.value)}
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

      {/* Edit building modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm">
        <DialogHeader>Bina məlumatlarını dəyiş</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Ad
            </Typography>
            <Input
              label="Bina adı"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Kompleks
            </Typography>
            <Input
              label="Kompleks"
              value={formComplex}
              onChange={(e) => setFormComplex(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Blok sayı
              </Typography>
              <Input
                type="number"
                label="Blok sayı"
                value={formBlocks}
                onChange={(e) => setFormBlocks(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                Mənzil sayı
              </Typography>
              <Input
                type="number"
                label="Mənzil sayı"
                value={formApartments}
                onChange={(e) => setFormApartments(e.target.value)}
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
            Bina Siyahısı
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
                      {["ID", "Ad", "Kompleks", "Blok sayı", "Mənzil sayı", "Əməliyyatlar"].map(
                        (el, idx) => (
                          <th
                            key={el}
                            className={`border-b border-blue-gray-100 py-3 px-6 text-left ${
                              idx === 5 ? "text-right" : ""
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
                              {row.complex}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.blocks}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray">
                              {row.apartments}
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
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {row.name}
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
                            <MenuItem>Bax</MenuItem>
                            <MenuItem onClick={() => openEditModal(row)}>Düzəliş et</MenuItem>
                            <MenuItem>Sil</MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                      <Typography variant="small" color="blue-gray">
                        Kompleks: {row.complex}
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Blok sayı: {row.blocks}
                      </Typography>
                      <Typography variant="small" color="blue-gray">
                        Mənzil sayı: {row.apartments}
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

export default BuildingsPage;
