import React, { useState, useMemo } from "react";
import {
  Typography,
  Card,
  CardBody,
  Button,
} from "@material-tailwind/react";
import {
  BellIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { NotificationsViewModal } from "./components/NotificationsViewModal";

// Mock data - şəkillərdə göründüyü kimi
const initialNotifications = [
  {
    id: 1,
    title: "Yeni Ticket #695 yaradıldı",
    description: "test",
    message: "test",
    priority: "important",
    type: "warning",
    date: "2025-12-26",
    fullDate: "2025-12-26 23:52",
    read: false,
    image: null,
  },
  {
    id: 2,
    title: "Test 100",
    description: "Test 100",
    message: "Test 100",
    priority: "normal",
    type: "info",
    date: "2025-12-26",
    fullDate: "2025-12-26 23:50",
    read: false,
    image: null,
  },
  {
    id: 3,
    title: "dfvdfvd",
    description: "dfvdfvd",
    message: "dfvdfvd",
    priority: "normal",
    type: "info",
    date: "2025-11-28",
    fullDate: "2025-11-28 17:37",
    read: false,
    image: null,
  },
  {
    id: 4,
    title: "TEst",
    description: "TEst",
    message: "TEst",
    priority: "normal",
    type: "info",
    date: "2025-11-27",
    fullDate: "2025-11-27 10:30",
    read: false,
    image: null,
  },
  {
    id: 5,
    title: "test",
    description: "test",
    message: "test",
    priority: "normal",
    type: "info",
    date: "2025-11-25",
    fullDate: "2025-11-25 14:20",
    read: false,
    image: null,
  },
];

// Natural sort utility
const naturalSort = (a, b) => {
  const aStr = String(a).toLowerCase();
  const bStr = String(b).toLowerCase();
  const aParts = aStr.match(/(\d+|\D+)/g) || [];
  const bParts = bStr.match(/(\d+|\D+)/g) || [];
  const maxLength = Math.max(aParts.length, bParts.length);

  for (let i = 0; i < maxLength; i++) {
    const aPart = aParts[i] || "";
    const bPart = bParts[i] || "";
    const aNum = parseInt(aPart, 10);
    const bNum = parseInt(bPart, 10);

    if (!isNaN(aNum) && !isNaN(bNum)) {
      if (aNum !== bNum) return aNum - bNum;
    } else {
      if (aPart < bPart) return -1;
      if (aPart > bPart) return 1;
    }
  }
  return 0;
};

const ITEMS_PER_PAGE = 5;

export function Notifications() {
  const { t } = useTranslation();
  const [notifications] = useState(initialNotifications);
  const [sortConfig, setSortConfig] = useState({ column: "date", direction: "desc" });
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Sorting logic
  const sortedNotifications = useMemo(() => {
    const sorted = [...notifications];
    
    sorted.sort((a, b) => {
      let aValue, bValue;

      if (sortConfig.column === "description") {
        aValue = a.description || "";
        bValue = b.description || "";
        const result = naturalSort(aValue, bValue);
        return sortConfig.direction === "asc" ? result : -result;
      } else if (sortConfig.column === "date") {
        aValue = new Date(a.date || 0).getTime();
        bValue = new Date(b.date || 0).getTime();
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [notifications, sortConfig]);

  // Display paginated notifications (cumulative - Load More)
  const paginatedNotifications = sortedNotifications.slice(0, displayCount);
  const hasMore = displayCount < sortedNotifications.length;

  const handleSort = (column) => {
    setSortConfig((prev) => {
      if (prev.column === column) {
        return { column, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { column, direction: "asc" };
    });
  };

  const getSortIcon = (column) => {
    if (sortConfig.column !== column) {
      return <span className="text-xs">↑↓</span>;
    }
    return sortConfig.direction === "asc" ? (
      <ArrowUpIcon className="h-4 w-4 inline" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 inline" />
    );
  };

  const handleView = (notification) => {
    setSelectedNotification(notification);
    setViewModalOpen(true);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
    // Load more logic - burada API çağırışı olacaq
    // Müvəqqəti olaraq sadəcə displayCount-u artırırıq
  };

  return (
    <div className="">
      {/* Səhifə başlığı */}
      <div className="w-full bg-black dark:bg-gray-800 my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-gray-700">
        <h3 className="text-white font-bold">{t("notifications.pageTitle") || "Bildirişlər"}</h3>
      </div>

      {/* Table Card */}
      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {sortedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-gray-50 dark:bg-gray-700">
                <BellIcon className="h-6 w-6 text-blue-gray-300 dark:text-gray-400" />
              </div>
              <Typography variant="h6" color="blue-gray" className="mb-2 dark:text-white">
                {t("notifications.emptyTitle") || "Hazırda göstəriləcək bildiriş yoxdur"}
              </Typography>
              <Typography
                variant="small"
                className="max-w-md text-xs font-normal text-blue-gray-500 dark:text-gray-400"
              >
                {t("notifications.emptySubtitle") || "Yeni hadisələr baş verdikdə bildirişlər burada görünəcək."}
              </Typography>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th
                        className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left cursor-pointer"
                        onClick={() => handleSort("description")}
                      >
                        <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400 flex items-center gap-1">
                          {t("notifications.table.description") || "Təsvir"} {getSortIcon("description")}
                        </Typography>
                      </th>
                      <th
                        className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left cursor-pointer"
                        onClick={() => handleSort("date")}
                      >
                        <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400 flex items-center gap-1">
                          {t("notifications.table.date") || "Tarix"} {getSortIcon("date")}
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                        <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                          Əməliyyatlar
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedNotifications.map((notification) => (
                      <tr
                        key={notification.id}
                        className="border-b border-blue-gray-100 dark:border-gray-800 hover:bg-blue-gray-50/40 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <Typography variant="small" className="font-normal text-blue-gray-900 dark:text-white">
                            {notification.description || notification.message || "-"}
                          </Typography>
                        </td>
                        <td className="py-3 px-4">
                          <Typography variant="small" className="font-normal text-blue-gray-900 dark:text-white">
                            {notification.date || "-"}
                          </Typography>
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            color="blue"
                            onClick={() => handleView(notification)}
                            className="px-4 py-1.5 text-xs font-medium"
                          >
                            {t("notifications.table.view") || "Bax"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center py-4 border-t border-blue-gray-100 dark:border-gray-800">
                  <Button
                    size="sm"
                    color="blue"
                    onClick={handleLoadMore}
                    className="px-6 py-2"
                  >
                    {t("notifications.loadMore") || "Daha çox"}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>

      {/* View Modal */}
      <NotificationsViewModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedNotification(null);
        }}
        notification={selectedNotification}
      />
    </div>
  );
}

export default Notifications;
