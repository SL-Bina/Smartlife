import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Spinner,
  Chip,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import {
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const mockSMS = [
  {
    id: 1,
    apartment: "menzil_116",
    recipient: "sakin_116 sakin_116ov",
    phone: "0508405544",
    message: "Hormetli sakin! Kompleksimizin odeme sistemi akti...",
    status: "sent",
    date: "2025-11-24 14:49",
  },
  {
    id: 2,
    apartment: "coratMenzil4",
    recipient: "Nahid Dadasov",
    phone: "85416541654",
    message: "Hormetli sakin! Kompleksimizin odeme sistemi akti...",
    status: "sent",
    date: "2025-11-24 14:48",
  },
  {
    id: 3,
    apartment: "Menzil 500",
    recipient: "Samir Cavadov..",
    phone: "994505656230",
    message: "sasaas",
    status: "failed",
    date: "2025-10-28 15:36",
  },
];

const ITEMS_PER_PAGE = 10;

const SentSMSPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(mockSMS.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = mockSMS.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
          <Typography variant="h6" color="blue-gray" className="dark:text-white">
            {t("notifications.sentSMS.pageTitle")}
          </Typography>
        </CardHeader>
        <CardBody className="px-0 pb-2 dark:bg-black">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("notifications.sentSMS.table.apartment")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("notifications.sentSMS.table.recipient")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("notifications.sentSMS.table.phone")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("notifications.sentSMS.table.message")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("notifications.sentSMS.table.status")}
                    </Typography>
                  </th>
                  <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                    <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                      {t("notifications.sentSMS.table.sendDate")}
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
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.apartment}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.recipient}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.phone}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                        {row.message}
                      </Typography>
                    </td>
                    <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                      <Chip
                        value={row.status === "sent" ? t("notifications.sentSMS.sent") : t("notifications.sentSMS.failed")}
                        color={row.status === "sent" ? "green" : "red"}
                        icon={row.status === "sent" ? <CheckCircleIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
                        className="dark:bg-green-600 dark:text-white"
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

export default SentSMSPage;

