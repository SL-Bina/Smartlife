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
import { useTranslation } from "react-i18next";
import {
  PlusIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

const mockServices = [
  {
    id: 3,
    title: "Binanın servis haqqı",
    amount: "145.00",
  },
  {
    id: 8,
    title: "Təmizlik",
    amount: "50.00",
  },
  {
    id: 20,
    title: "Santexnik.",
    amount: "50.00",
  },
  {
    id: 35,
    title: "Test",
    amount: "111.00",
  },
];

const ITEMS_PER_PAGE = 10;

const ServicesPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formTitle, setFormTitle] = useState("");
  const [formAmount, setFormAmount] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(mockServices.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = mockServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  const openCreateModal = () => {
    setFormTitle("");
    setFormAmount("");
    setCreateOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormTitle(item.title);
    setFormAmount(item.amount);
    setEditOpen(true);
  };

  const openDeleteModal = (item) => {
    setSelectedItem(item);
    setDeleteOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8">
      <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 p-6 dark:bg-black"
        >
          <div className="flex items-center justify-between">
            <Typography variant="h6" color="blue-gray" className="dark:text-white">
              {t("services.pageTitle")}
            </Typography>
            <Button
              color="green"
              size="sm"
              onClick={openCreateModal}
              className="flex items-center gap-2 dark:bg-green-600 dark:hover:bg-green-700"
            >
              <PlusIcon className="h-4 w-4" />
              <span>{t("services.add")}</span>
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-0 pb-2 dark:bg-black">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      Id
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("services.table.title")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("services.table.amount")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("services.table.actions")}
                    </Typography>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={`${
                      index % 2 === 0
                        ? "bg-white dark:bg-black"
                        : "bg-gray-50 dark:bg-black/50"
                    } hover:bg-blue-gray-50 dark:hover:bg-gray-800/70 transition-colors`}
                  >
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 font-semibold">
                        {row.id}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.title}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.amount} AZN
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Menu>
                        <MenuHandler>
                          <IconButton variant="text" className="dark:text-gray-300">
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </IconButton>
                        </MenuHandler>
                        <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                          <MenuItem
                            onClick={() => openEditModal(row)}
                            className="dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            {t("services.edit")}
                          </MenuItem>
                          <MenuItem
                            onClick={() => openDeleteModal(row)}
                            className="dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            {t("services.delete")}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-blue-gray-100 dark:border-gray-800">
              <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                {t("pagination.page")} {page} {t("pagination.of")} {totalPages}
              </Typography>
              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  color="blue-gray"
                  size="sm"
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="dark:border-gray-600 dark:text-gray-300"
                >
                  {t("pagination.previous")}
                </Button>
                <Button
                  variant="outlined"
                  color="blue-gray"
                  size="sm"
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="dark:border-gray-600 dark:text-gray-300"
                >
                  {t("pagination.next")}
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create Modal */}
      <Dialog open={createOpen} handler={setCreateOpen} className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">
          {t("services.createModal.title")}
        </DialogHeader>
        <DialogBody className="dark:bg-gray-800">
          <div className="space-y-4">
            <Input
              label={t("services.form.title")}
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Input
              label={t("services.form.amount")}
              type="number"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="dark:bg-gray-800">
          <Button
            variant="text"
            color="red"
            onClick={() => setCreateOpen(false)}
            className="mr-1 dark:text-gray-300"
          >
            <span>{t("services.cancel")}</span>
          </Button>
          <Button
            color="green"
            onClick={() => {
              setCreateOpen(false);
            }}
            className="dark:bg-green-600 dark:hover:bg-green-700"
          >
            <span>{t("services.save")}</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} handler={setEditOpen} className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">
          {t("services.editModal.title")}
        </DialogHeader>
        <DialogBody className="dark:bg-gray-800">
          <div className="space-y-4">
            <Input
              label={t("services.form.title")}
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Input
              label={t("services.form.amount")}
              type="number"
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="dark:bg-gray-800">
          <Button
            variant="text"
            color="red"
            onClick={() => setEditOpen(false)}
            className="mr-1 dark:text-gray-300"
          >
            <span>{t("services.cancel")}</span>
          </Button>
          <Button
            color="green"
            onClick={() => {
              setEditOpen(false);
            }}
            className="dark:bg-green-600 dark:hover:bg-green-700"
          >
            <span>{t("services.save")}</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteOpen} handler={setDeleteOpen} className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">
          {t("services.deleteModal.title")}
        </DialogHeader>
        <DialogBody className="dark:bg-gray-800">
          <Typography variant="paragraph" className="dark:text-gray-300">
            {t("services.deleteModal.message")}
          </Typography>
        </DialogBody>
        <DialogFooter className="dark:bg-gray-800">
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setDeleteOpen(false)}
            className="mr-1 dark:text-gray-300"
          >
            <span>{t("services.cancel")}</span>
          </Button>
          <Button
            color="red"
            onClick={() => {
              setDeleteOpen(false);
            }}
            className="dark:bg-red-600 dark:hover:bg-red-700"
          >
            <span>{t("services.delete")}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ServicesPage;

