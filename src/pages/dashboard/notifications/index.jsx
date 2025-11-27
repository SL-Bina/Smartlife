import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Chip,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Switch,
} from "@material-tailwind/react";
import {
  BellIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const initialNotifications = [
  {
    id: 1,
    type: "payment",
    title: "Yeni ödəniş qeydə alındı",
    description: "Mənzil A-23 üçün aylıq xidmət haqqı uğurla ödənildi.",
    time: "5 dəqiqə əvvəl",
    read: false,
  },
  {
    id: 2,
    type: "warning",
    title: "Gecikmiş borc barədə xəbərdarlıq",
    description: "Bina 3, giriş 2 üzrə 2 aylıq ödəniş gecikib.",
    time: "1 saat əvvəl",
    read: false,
  },
  {
    id: 3,
    type: "info",
    title: "Planlı texniki işlər",
    description: "Sabah saat 10:00–12:00 arası lift sistemi üzrə servis işləri aparılacaq.",
    time: "Dünən",
    read: true,
  },
  {
    id: 4,
    type: "system",
    title: "Sistem yenilənməsi tamamlandı",
    description: "Smartlife platforması son versiyaya yeniləndi.",
    time: "2 gün əvvəl",
    read: true,
  },
];

export function Notifications() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = React.useState(initialNotifications);
  const [showUnreadOnly, setShowUnreadOnly] = React.useState(false);

  const filteredNotifications = React.useMemo(
    () =>
      notifications.filter((item) =>
        showUnreadOnly ? !item.read : true
      ),
    [notifications, showUnreadOnly]
  );

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  const handleRemove = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const getTypeConfig = (type) => {
    switch (type) {
      case "payment":
        return { label: t("notifications.types.payment"), color: "green" };
      case "warning":
        return { label: t("notifications.types.warning"), color: "red" };
      case "system":
        return { label: t("notifications.types.system"), color: "blue" };
      default:
        return { label: t("notifications.types.info"), color: "gray" };
    }
  };

  return (
    <div className="  mb-8">
      {/* Səhifə başlığı – digər dashboard səhifələri ilə eyni stil */}
      <div className="w-full bg-black dark:bg-black my-4 p-5 rounded-lg shadow-lg mb-6 flex items-center justify-between gap-4 border border-red-600 dark:border-red-600">
        <div>
          <h3 className="text-white font-bold">
            {t("notifications.pageTitle")}
          </h3>
          
        </div>
        <div className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-yellow-500/20 dark:bg-yellow-500/10 border border-yellow-500/50 dark:border-yellow-500/30">
          <BellIcon className="h-6 w-6 text-yellow-400 dark:text-yellow-300" />
        </div>
      </div>

      <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between dark:bg-black"
        >
          <div>
            <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-white">
              {t("notifications.listTitle")}
            </Typography>
            <Typography
              variant="small"
              className="font-normal text-blue-gray-500 dark:text-gray-400"
            >
              {t("notifications.listSubtitle")}
            </Typography>
          </div>
          {/* <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="unread-only"
                ripple={false}
                checked={showUnreadOnly}
                onChange={() => setShowUnreadOnly((prev) => !prev)}
                label={t(
                  "notifications.unreadOnly",
                  "Yalnız oxunmamışlar"
                )}
                containerProps={{ className: "w-auto" }}
                className="h-full w-full"
                labelProps={{
                  className: "text-xs font-normal text-blue-gray-600",
                }}
              />
            </div>
          </div> */}
        </CardHeader>

        <CardBody className="px-0 pt-0 pb-2 dark:bg-black">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-gray-50 dark:bg-gray-700">
                <BellIcon className="h-6 w-6 text-blue-gray-300 dark:text-gray-400" />
              </div>
              <Typography variant="h6" color="blue-gray" className="mb-2 dark:text-white">
                {t("notifications.emptyTitle")}
              </Typography>
              <Typography
                variant="small"
                className="max-w-md text-xs font-normal text-blue-gray-500 dark:text-gray-400"
              >
                {t("notifications.emptySubtitle")}
              </Typography>
            </div>
          ) : (
            <div className="divide-y divide-red-600/60 dark:divide-gray-700">
              {filteredNotifications.map((item) => {
                const config = getTypeConfig(item.type);

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-blue-gray-50/40 dark:hover:bg-gray-700/50 sm:flex-row sm:items-start sm:justify-between sm:px-6"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1 h-2.5 w-2.5 rounded-full ${
                          item.read ? "bg-blue-gray-200 dark:bg-gray-600" : "bg-green-500 dark:bg-green-400"
                        }`}
                      />
                      <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold dark:text-white"
                          >
                            {item.title}
                          </Typography>
                          <Chip
                            value={t(`notifications.types.${item.type}`)}
                            size="sm"
                            variant="ghost"
                            color={config.color}
                            className="px-2 py-0.5 text-[10px] font-medium uppercase dark:bg-opacity-80"
                          />
                        </div>
                        <Typography
                          variant="small"
                          className="text-xs font-normal text-blue-gray-500 dark:text-gray-300"
                        >
                          {item.description}
                        </Typography>
                        <Typography
                          variant="small"
                          className="mt-2 text-[11px] font-medium text-blue-gray-400 dark:text-gray-400"
                        >
                          {item.time}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start">
                      {!item.read && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(item.id)}
                          className="rounded-md border border-green-500 dark:border-green-400 px-3 py-1 text-[11px] font-medium uppercase text-green-600 dark:text-green-300 transition-colors hover:bg-green-50 dark:hover:bg-green-900/20"
                        >
                          {t("notifications.markAsRead")}
                        </button>
                      )}

                      <Menu placement="left-start">
                        <MenuHandler>
                          <IconButton
                            size="sm"
                            variant="text"
                            color="blue-gray"
                            className="ml-auto dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            <EllipsisVerticalIcon
                              strokeWidth={2}
                              className="h-5 w-5"
                            />
                          </IconButton>
                        </MenuHandler>
                        <MenuList className="dark:bg-black dark:border-gray-800">
                          {!item.read && (
                            <MenuItem onClick={() => handleMarkAsRead(item.id)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                              {t("notifications.actions.markAsRead")}
                            </MenuItem>
                          )}
                          <MenuItem onClick={() => handleRemove(item.id)} className="dark:text-gray-300 dark:hover:bg-gray-700">
                            {t("notifications.actions.remove")}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Notifications;
