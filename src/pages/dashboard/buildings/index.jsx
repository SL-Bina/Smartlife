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
import { useTranslation } from "react-i18next";

const data = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `Bina ${index + 1}`,
  complex: `Kompleks ${Math.floor(index / 5) + 1}`,
  blocks: Math.floor(Math.random() * 5) + 1,
  apartments: Math.floor(Math.random() * 80) + 20,
}));

const ITEMS_PER_PAGE = 10;

const BuildingsPage = () => {
  const { t } = useTranslation();
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
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black dark:bg-gray-900 my-4 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-white font-bold">{t("buildings.pageTitle")}</h3>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm" className="dark:bg-gray-800">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">{t("buildings.filter.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("buildings.filter.name")}
            </Typography>
            <Input
              label={t("buildings.filter.enterName")}
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("buildings.filter.complex")}
            </Typography>
            <Input
              label={t("buildings.filter.enterComplex")}
              value={filterComplex}
              onChange={(e) => setFilterComplex(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="text" color="blue-gray" onClick={handleFilterClear} className="dark:text-gray-300 dark:hover:bg-gray-700">
            {t("buildings.filter.clear")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outlined" color="blue-gray" onClick={() => setFilterOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
              {t("buildings.filter.close")}
            </Button>
            <Button color="blue" onClick={handleFilterApply} className="dark:bg-blue-600 dark:hover:bg-blue-700">
              {t("buildings.filter.apply")}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {/* Create building modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="sm" className="dark:bg-gray-800">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">{t("buildings.create.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("buildings.create.name")}
            </Typography>
            <Input
              label={t("buildings.create.enterName")}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("buildings.create.complex")}
            </Typography>
            <Input
              label={t("buildings.create.enterComplex")}
              value={formComplex}
              onChange={(e) => setFormComplex(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("buildings.create.blocksCount")}
              </Typography>
              <Input
                type="number"
                label={t("buildings.create.enterBlocks")}
                value={formBlocks}
                onChange={(e) => setFormBlocks(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("buildings.create.apartmentsCount")}
              </Typography>
              <Input
                type="number"
                label={t("buildings.create.enterApartments")}
                value={formApartments}
                onChange={(e) => setFormApartments(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="outlined" color="blue-gray" onClick={() => setCreateOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buildings.create.cancel")}
          </Button>
          <Button color="green" onClick={handleCreateSave} className="dark:bg-green-600 dark:hover:bg-green-700">
            {t("buildings.create.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit building modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm" className="dark:bg-gray-800">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">{t("buildings.edit.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("buildings.edit.name")}
            </Typography>
            <Input
              label={t("buildings.edit.enterName")}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("buildings.edit.complex")}
            </Typography>
            <Input
              label={t("buildings.edit.enterComplex")}
              value={formComplex}
              onChange={(e) => setFormComplex(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("buildings.edit.blocksCount")}
              </Typography>
              <Input
                type="number"
                label={t("buildings.edit.enterBlocks")}
                value={formBlocks}
                onChange={(e) => setFormBlocks(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("buildings.edit.apartmentsCount")}
              </Typography>
              <Input
                type="number"
                label={t("buildings.edit.enterApartments")}
                value={formApartments}
                onChange={(e) => setFormApartments(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="outlined" color="blue-gray" onClick={() => setEditOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buildings.edit.cancel")}
          </Button>
          <Button color="blue" onClick={handleEditSave} className="dark:bg-blue-600 dark:hover:bg-blue-700">
            {t("buildings.edit.save")}
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
            <Button variant="outlined" color="blue" onClick={() => setFilterOpen(true)} className="dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20">
              {t("buildings.actions.search")}
            </Button>
            <Button color="green" onClick={openCreateModal} className="dark:bg-green-600 dark:hover:bg-green-700">
              {t("buildings.actions.add")}
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("buildings.loading")}
              </Typography>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block">
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      {[t("buildings.table.id"), t("buildings.table.name"), t("buildings.table.complex"), t("buildings.table.blocksCount"), t("buildings.table.apartmentsCount"), t("buildings.table.actions")].map(
                        (el, idx) => (
                          <th
                            key={el}
                            className={`border-b border-blue-gray-100 dark:border-gray-700 py-3 px-6 text-left ${
                              idx === 5 ? "text-right" : ""
                            }`}
                          >
                            <Typography
                              variant="small"
                              className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400"
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
                              {row.name}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.complex}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.blocks}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.apartments}
                            </Typography>
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
                                <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">{t("buildings.actions.view")}</MenuItem>
                                <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("buildings.actions.edit")}</MenuItem>
                                <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">{t("buildings.actions.delete")}</MenuItem>
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
                    className="border border-red-500 shadow-sm dark:bg-gray-800 dark:border-gray-700"
                  >
                    <CardBody className="space-y-3 dark:bg-gray-800">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold dark:text-white"
                          >
                            {row.name}
                          </Typography>
                          <Typography variant="small" className="text-xs text-blue-gray-400 dark:text-gray-400">
                            {t("buildings.table.id")}: {row.id}
                          </Typography>
                        </div>
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
                            <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">{t("buildings.actions.view")}</MenuItem>
                            <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("buildings.actions.edit")}</MenuItem>
                            <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">{t("buildings.actions.delete")}</MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("buildings.table.complex")}: {row.complex}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("buildings.table.blocksCount")}: {row.blocks}
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("buildings.table.apartmentsCount")}: {row.apartments}
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
                  className="dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:text-gray-600"
                >
                  {t("buildings.pagination.prev")}
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
                  {t("buildings.pagination.next")}
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
