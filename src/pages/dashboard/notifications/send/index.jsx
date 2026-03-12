import React, { useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Checkbox,
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";
import api from "@/services/api";
import { useDynamicToast } from "@/hooks/useDynamicToast";
import DynamicToast from "@/components/DynamicToast";
import { useTranslation } from "react-i18next";
import {
  BuildingOfficeIcon,
  RectangleStackIcon,
  HomeModernIcon,
  BellIcon,
} from "@heroicons/react/24/solid";
import { useMtkColor } from "@/store/hooks/useMtkColor";

const SendNotificationPage = () => {
  const { getRgba: getMtkRgba } = useMtkColor();
  const { t } = useTranslation();
  const { toast, showToast, closeToast } = useDynamicToast();
  const [accountId, setAccountId] = useState("");
  const [accountType, setAccountType] = useState("user");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim() || !accountId.trim()) {
      showToast({ type: "error", title: "Xəta", message: "Başlıq, mesaj və account_id daxil edin" });
      return;
    }
    setSending(true);
    try {
      await api.post("/notify/send", {
        account_id: Number(accountId),
        account_type: accountType,
        title: title.trim(),
        message: message.trim(),
        type: type,
      });
      showToast({ type: "success", title: "Uğurlu", message: t("notifications.send.sentSuccess") || "Bildiriş göndərildi" });
      setTitle("");
      setMessage("");
      setAccountId("");
    } catch (err) {
      showToast({
        type: "error",
        title: "Xəta",
        message: err?.response?.data?.message || err?.message || "Xəta baş verdi",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-12 mb-8">
      <Card className="border dark:border-gray-700 shadow-sm dark:bg-gray-800" style={{ borderColor: getMtkRgba(0.7) }}>
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 p-6 dark:bg-gray-800"
        >
          <div className="flex items-center gap-2">
            <BellIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <Typography variant="h6" color="blue-gray" className="dark:text-white">
              {t("notifications.send.pageTitle") || "Bildiriş göndər"}
            </Typography>
          </div>
          <Typography
            variant="small"
            className="font-normal text-blue-gray-500 dark:text-gray-400 mt-1"
          >
            {t("notifications.send.pageSubtitle") || "Bildiriş göndərmək üçün formu doldurun"}
          </Typography>
        </CardHeader>
        <CardBody className="px-6 pb-6 dark:bg-gray-800 space-y-6">
          {/* Account ID */}
          <div>
            <Input
              type="number"
              label={t("notifications.send.accountId") || "Account ID (account_id)"}
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          {/* Account Type */}
          <div>
            <Select
              label={t("notifications.send.accountType") || "Account Type (account_type)"}
              value={accountType}
              onChange={setAccountType}
              className="bg-white dark:bg-gray-800"
            >
              <Option value="user">user</Option>
              <Option value="admin">admin</Option>
              <Option value="manager">manager</Option>
            </Select>
          </div>
          {/* Title */}
          <div>
            <Input
              label={t("notifications.send.title") || "Başlıq (title)"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          {/* Message */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 dark:text-gray-300">
              {t("notifications.send.message") || "Mesaj (message)"}
            </Typography>
            <textarea
              placeholder={t("notifications.send.message") || "Mesaj (message)"}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
              rows={4}
            />
          </div>
          {/* Type */}
          <div>
            <Select
              label={t("notifications.send.type") || "Bildiriş tipi (type)"}
              value={type}
              onChange={setType}
              className="bg-white dark:bg-gray-800"
            >
              <Option value="success">success</Option>
              <Option value="danger">danger</Option>
              <Option value="info">info</Option>
              <Option value="warning">warning</Option>
            </Select>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              color="blue"
              onClick={handleSubmit}
              disabled={sending}
              className="flex items-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {sending && <Spinner className="h-4 w-4" />}
              {t("notifications.send.sendButton") || "Göndər"}
            </Button>
          </div>
        </CardBody>
      </Card>

      <DynamicToast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={toast.duration}
        onClose={closeToast}
      />
    </div>
  );
};

export default SendNotificationPage;

