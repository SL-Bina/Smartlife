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
  Chip,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import {
  PlusIcon,
  EllipsisVerticalIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const mockDocuments = [
  {
    id: 89,
    documentName: "Müqavilə",
    file: null,
    status: "unknown",
    location: "Mənzil 20",
    date: "15.10.2025 13:56",
  },
  {
    id: 84,
    documentName: "test",
    file: null,
    status: "unknown",
    location: "icerisheher1",
    date: "13.10.2025 18:23",
  },
  {
    id: 85,
    documentName: "test",
    file: null,
    status: "unknown",
    location: "icerisheher2",
    date: "13.10.2025 18:23",
  },
];

const ITEMS_PER_PAGE = 10;

const ElectronicDocumentsPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [documentTypesOpen, setDocumentTypesOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [formDocumentName, setFormDocumentName] = useState("");
  const [formFile, setFormFile] = useState(null);
  const [formStatus, setFormStatus] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDate, setFormDate] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(mockDocuments.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = mockDocuments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  const openCreateModal = () => {
    setFormDocumentName("");
    setFormFile(null);
    setFormStatus("");
    setFormLocation("");
    setFormDate("");
    setCreateOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormDocumentName(item.documentName);
    setFormFile(item.file);
    setFormStatus(item.status);
    setFormLocation(item.location);
    setFormDate(item.date);
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
              {t("electronicDocuments.pageTitle")}
            </Typography>
            <div className="flex gap-2">
              <Button
                color="blue"
                size="sm"
                onClick={() => setDocumentTypesOpen(true)}
                variant="outlined"
                className="dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-600/10"
              >
                <span>{t("electronicDocuments.documentTypes")}</span>
              </Button>
              <Button
                color="green"
                size="sm"
                onClick={openCreateModal}
                variant="outlined"
                className="dark:border-green-600 dark:text-green-400 dark:hover:bg-green-600/10"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                <span>{t("electronicDocuments.addDocument")}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="px-0 pb-2 dark:bg-black">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      ID
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("electronicDocuments.table.documentName")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("electronicDocuments.table.file")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("electronicDocuments.table.status")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("electronicDocuments.table.location")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("electronicDocuments.table.date")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("electronicDocuments.table.actions")}
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
                        {row.documentName}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                        {row.file ? row.file.name : "-"}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Chip
                        value={t("electronicDocuments.status.unknown")}
                        color="blue"
                        className="dark:bg-blue-600 dark:text-white"
                      />
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.location}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.date}
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
                            {t("electronicDocuments.edit")}
                          </MenuItem>
                          <MenuItem
                            onClick={() => openDeleteModal(row)}
                            className="dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            {t("electronicDocuments.delete")}
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

      {/* Document Types Modal */}
      <Dialog open={documentTypesOpen} handler={setDocumentTypesOpen} className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">
          {t("electronicDocuments.documentTypesModal.title")}
        </DialogHeader>
        <DialogBody className="dark:bg-gray-800">
          <Typography variant="paragraph" className="dark:text-gray-300">
            {t("electronicDocuments.documentTypesModal.content")}
          </Typography>
        </DialogBody>
        <DialogFooter className="dark:bg-gray-800">
          <Button
            variant="text"
            color="blue"
            onClick={() => setDocumentTypesOpen(false)}
            className="dark:text-gray-300"
          >
            <span>{t("electronicDocuments.close")}</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={createOpen} handler={setCreateOpen} className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">
          {t("electronicDocuments.createModal.title")}
        </DialogHeader>
        <DialogBody className="dark:bg-gray-800">
          <div className="space-y-4">
            <Input
              label={t("electronicDocuments.form.documentName")}
              value={formDocumentName}
              onChange={(e) => setFormDocumentName(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Input
              type="file"
              label={t("electronicDocuments.form.file")}
              onChange={(e) => setFormFile(e.target.files[0])}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Select
              label={t("electronicDocuments.form.status")}
              value={formStatus}
              onChange={(val) => setFormStatus(val)}
              className="dark:text-white"
            >
              <Option value="unknown">{t("electronicDocuments.status.unknown")}</Option>
            </Select>
            <Input
              label={t("electronicDocuments.form.location")}
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
            <Input
              type="datetime-local"
              label={t("electronicDocuments.form.date")}
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
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
            <span>{t("electronicDocuments.cancel")}</span>
          </Button>
          <Button
            color="green"
            onClick={() => {
              setCreateOpen(false);
            }}
            className="dark:bg-green-600 dark:hover:bg-green-700"
          >
            <span>{t("electronicDocuments.save")}</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={deleteOpen} handler={setDeleteOpen} className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">
          {t("electronicDocuments.deleteModal.title")}
        </DialogHeader>
        <DialogBody className="dark:bg-gray-800">
          <Typography variant="paragraph" className="dark:text-gray-300">
            {t("electronicDocuments.deleteModal.message")}
          </Typography>
        </DialogBody>
        <DialogFooter className="dark:bg-gray-800">
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setDeleteOpen(false)}
            className="mr-1 dark:text-gray-300"
          >
            <span>{t("electronicDocuments.cancel")}</span>
          </Button>
          <Button
            color="red"
            onClick={() => {
              setDeleteOpen(false);
            }}
            className="dark:bg-red-600 dark:hover:bg-red-700"
          >
            <span>{t("electronicDocuments.delete")}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ElectronicDocumentsPage;

