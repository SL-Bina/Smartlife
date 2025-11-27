import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Spinner,
  Switch,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

const mockQueries = [
  {
    id: 180,
    title: "test",
    description: "Lisfteb kamerala...",
    complex: 1,
    building: 1,
    block: 61,
    status: true,
  },
  {
    id: 179,
    title: "Salam",
    description: "Liftlere kameral...",
    complex: 1,
    building: 1,
    block: 61,
    status: true,
  },
  {
    id: 178,
    title: "csdc",
    description: "sdc",
    complex: 1,
    building: 1,
    block: 61,
    status: true,
  },
];

const ITEMS_PER_PAGE = 10;

const QueriesListPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(mockQueries.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = mockQueries.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

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
              {t("queries.list.pageTitle")}
            </Typography>
            <div className="flex gap-2">
              <Button
                color="blue"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
                <span>{t("queries.list.search")}</span>
              </Button>
              <Button
                color="green"
                size="sm"
                className="flex items-center gap-2 dark:bg-green-600 dark:hover:bg-green-700"
              >
                <PlusIcon className="h-4 w-4" />
                <span>{t("queries.list.createNew")}</span>
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
                      {t("queries.list.table.title")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("queries.list.table.description")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("queries.list.table.complex")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("queries.list.table.building")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("queries.list.table.block")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("queries.list.table.status")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("queries.list.table.action")}
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
                        {row.description}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.complex}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.building}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.block}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Switch
                        checked={row.status}
                        onChange={() => {}}
                        className="dark:text-white"
                      />
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Menu>
                        <MenuHandler>
                          <IconButton variant="text" className="dark:text-gray-300">
                            <EllipsisVerticalIcon className="h-5 w-5" />
                          </IconButton>
                        </MenuHandler>
                        <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                          <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                            {t("queries.list.edit")}
                          </MenuItem>
                          <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                            {t("queries.list.delete")}
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
    </div>
  );
};

export default QueriesListPage;

