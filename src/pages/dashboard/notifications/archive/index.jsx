import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Spinner,
  Chip,
  IconButton,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import {
  MagnifyingGlassIcon,
  TrashIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const mockNotifications = [
  {
    id: 1,
    title: "Test Header Internal",
    content: "Test Content Internal",
    building: "B",
    block: "A",
    apartment: "Menzil 500",
    type: "internal",
    date: "2025-09-28 23:40:47",
  },
  {
    id: 2,
    title: "Test Content SMS",
    content: "Test Content SMS",
    building: "B",
    block: "A",
    apartment: "Menzil 500",
    type: "sms",
    date: "2025-09-28 23:41:05",
  },
  {
    id: 3,
    title: "Test",
    content: "fds fds gsdg dfg f dgfd mgf dmng fdmng fmn...",
    building: "B",
    block: "A",
    apartment: "Menzil 500",
    type: "internal",
    date: "2025-09-30 17:37:30",
  },
];

const ITEMS_PER_PAGE = 10;

const NotificationArchivePage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(mockNotifications.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = mockNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
            <div className="flex items-center gap-2">
              <TrashIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <div>
                <Typography variant="h6" color="blue-gray" className="dark:text-white">
                  {t("notifications.archive.pageTitle")}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-500 dark:text-gray-400"
                >
                  {t("notifications.archive.pageSubtitle")}
                </Typography>
              </div>
            </div>
            <Button
              color="blue"
              size="sm"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span>{t("notifications.archive.search")}</span>
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
                      {t("notifications.archive.table.requests")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("notifications.archive.table.building")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("notifications.archive.table.block")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("notifications.archive.table.apartment")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("notifications.archive.table.type")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("notifications.archive.table.date")}
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
                      <div>
                        <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 font-semibold">
                          {row.title}
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400">
                          {row.content}
                        </Typography>
                      </div>
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
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.apartment}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Chip
                        value={row.type === "internal" ? t("notifications.archive.internal") : "SMS"}
                        color={row.type === "internal" ? "purple" : "blue"}
                        icon={row.type === "internal" ? <BellIcon className="h-4 w-4" /> : <ChatBubbleLeftRightIcon className="h-4 w-4" />}
                        className="dark:bg-purple-600 dark:text-white"
                      />
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.date}
                      </Typography>
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

export default NotificationArchivePage;

