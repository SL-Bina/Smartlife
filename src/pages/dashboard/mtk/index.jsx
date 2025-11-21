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

const mtkData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `Test MTK ${index + 1}`,
}));

const ITEMS_PER_PAGE = 10;

const MTK = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterName, setFilterName] = useState("");
  const [formName, setFormName] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = React.useMemo(
    () =>
      mtkData.filter((item) =>
        filterName ? item.name.toLowerCase().includes(filterName.toLowerCase()) : true
      ),
    [filterName]
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  const openCreateModal = () => {
    setFormName("");
    setCreateOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormName(item.name);
    setEditOpen(true);
  };

  const handleFilterApply = () => {
    setPage(1);
    setFilterOpen(false);
  };

  const handleFilterClear = () => {
    setFilterName("");
    setPage(1);
    setFilterOpen(false);
  };

  const handleCreateSave = () => {
    // Burada backend inteqrasiyası üçün API çağırışı edilə bilər
    setCreateOpen(false);
  };

  const handleEditSave = () => {
    // Burada seçilmiş MTK üçün dəyişiklikləri saxlamaq üçün API çağırışı edilə bilər
    setEditOpen(false);
  };

  return (
    <div className="">
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black dark:bg-gray-900 my-4 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-white font-bold">{t("mtk.pageTitle")}</h3>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm" className="dark:bg-gray-800">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">{t("mtk.filter.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("mtk.filter.name")}
            </Typography>
            <Input
              label={t("mtk.filter.enterName")}
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="text" color="blue-gray" onClick={handleFilterClear} className="dark:text-gray-300 dark:hover:bg-gray-700">
            {t("mtk.filter.clear")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outlined" color="blue-gray" onClick={() => setFilterOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
              {t("mtk.filter.close")}
            </Button>
            <Button color="blue" onClick={handleFilterApply} className="dark:bg-blue-600 dark:hover:bg-blue-700">
              {t("mtk.filter.apply")}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {/* Create MTK modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="sm" className="dark:bg-gray-800">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">{t("mtk.create.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("mtk.create.name")}
            </Typography>
            <Input
              label={t("mtk.create.enterName")}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="outlined" color="blue-gray" onClick={() => setCreateOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("mtk.create.cancel")}
          </Button>
          <Button color="green" onClick={handleCreateSave} className="dark:bg-green-600 dark:hover:bg-green-700">
            {t("mtk.create.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit MTK modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm" className="dark:bg-gray-800">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">{t("mtk.edit.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("mtk.edit.name")}
            </Typography>
            <Input
              label={t("mtk.edit.enterName")}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="outlined" color="blue-gray" onClick={() => setEditOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("mtk.edit.cancel")}
          </Button>
          <Button color="blue" onClick={handleEditSave} className="dark:bg-blue-600 dark:hover:bg-blue-700">
            {t("mtk.edit.save")}
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
              {t("mtk.actions.search")}
            </Button>
            <Button color="green" onClick={openCreateModal} className="dark:bg-green-600 dark:hover:bg-green-700">
              {t("mtk.actions.add")}
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("mtk.loading")}
              </Typography>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block">
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      {[t("mtk.table.id"), t("mtk.table.name"), t("mtk.table.actions")].map((el, idx) => (
                        <th
                          key={el}
                          className={`border-b border-blue-gray-100 dark:border-gray-700 py-3 px-6 text-left ${
                            idx === 2 ? "text-right" : ""
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
                              {row.name}
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
                                <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">{t("mtk.actions.view")}</MenuItem>
                                <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("mtk.actions.edit")}</MenuItem>
                                <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">{t("mtk.actions.delete")}</MenuItem>
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
                    <CardBody className="space-y-2 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold dark:text-white"
                        >
                          {row.name}
                        </Typography>
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
                            <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">{t("mtk.actions.view")}</MenuItem>
                            <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("mtk.actions.edit")}</MenuItem>
                            <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">{t("mtk.actions.delete")}</MenuItem>
                          </MenuList>
                        </Menu>
                      </div>
                      <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                        {t("mtk.table.id")}: {row.id}
                      </Typography>
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
                  {t("mtk.pagination.prev")}
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
                  {t("mtk.pagination.next")}
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default MTK;
