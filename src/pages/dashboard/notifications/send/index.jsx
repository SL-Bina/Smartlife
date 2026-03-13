import React, { useState } from "react";
import {
  Typography,
  Card,
  CardBody,
  Button,
  Input,
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";
import api from "@/services/api";
import { useDynamicToast } from "@/hooks/useDynamicToast";
import DynamicToast from "@/components/DynamicToast";
import { useTranslation } from "react-i18next";
import { BellIcon } from "@heroicons/react/24/solid";
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
      showToast({
        type: "error",
        title: "Xəta",
        message: "Başlıq, mesaj və account_id daxil edin",
      });
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

      showToast({
        type: "success",
        title: "Uğurlu",
        message: t("notifications.send.sentSuccess") || "Bildiriş göndərildi",
      });

      setTitle("");
      setMessage("");
      setAccountId("");
      setAccountType("user");
      setType("success");
    } catch (error) {
      showToast({
        type: "error",
        title: "Xəta",
        message:
          error?.response?.data?.message ||
          t("notifications.send.sentError") ||
          "Bildiriş göndərilərkən xəta baş verdi",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-12 mb-8 relative">
      {/* Gradient Header */}
      <div
        className="relative w-full overflow-hidden rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 mb-8"
        style={{
          position: "relative",
          zIndex: 0,
          background: `linear-gradient(135deg, ${getMtkRgba(1)}, ${getMtkRgba(0.8)})`,
        }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />
        <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12" />

        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 dark:border-gray-600/30 bg-white/20">
            <BellIcon className="h-6 w-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <Typography
              variant="h4"
              className="text-white font-bold mb-1 text-lg sm:text-xl md:text-2xl"
            >
              {t("notifications.send.pageTitle") || "Bildiriş göndər"}
            </Typography>
            <Typography className="text-white/90 dark:text-gray-300 text-xs sm:text-sm font-medium">
              {t("notifications.send.pageSubtitle") ||
                "Bildiriş göndərmək üçün formu doldurun"}
            </Typography>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden group mx-auto">
        <CardBody className="p-6 space-y-6">
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
              onChange={(value) => setAccountType(value || "user")}
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
              onChange={(value) => setType(value || "success")}
              className="bg-white dark:bg-gray-800"
            >
              <Option value="success">success</Option>
              <Option value="danger">danger</Option>
              <Option value="info">info</Option>
              <Option value="warning">warning</Option>
            </Select>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 justify-end mt-6">
            <Button
              variant="outlined"
              color="blue"
              onClick={() => {
                setTitle("");
                setMessage("");
                setAccountId("");
                setAccountType("user");
                setType("success");
              }}
              className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              {t("notifications.send.clearButton") || "Təmizlə"}
            </Button>

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