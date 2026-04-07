import React, { useCallback, useState } from "react";
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
import { useTranslation } from "react-i18next";
import {
  BellIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import Header from "@/components/ui/Header";
import { AsyncSearchSelect } from "@/components/ui/AsyncSearchSelect";
import usersAPI from "@/services/users/usersApi";
import residentsAPI from "@/services/management/residentsApi";

const SendNotificationPage = () => {
  const { getRgba: getMtkRgba } = useMtkColor();
  const { t } = useTranslation();
  const { showToast } = useDynamicToast();

  const [accountId, setAccountId] = useState("");
  const [accountType, setAccountType] = useState("user");
  const [selectedAccountLabel, setSelectedAccountLabel] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");
  const [sending, setSending] = useState(false);

  const typeStyles = {
    success: {
      label: "success",
      icon: CheckCircleIcon,
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    },
    danger: {
      label: "danger",
      icon: ExclamationCircleIcon,
      badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    },
    info: {
      label: "info",
      icon: InformationCircleIcon,
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    },
    warning: {
      label: "warning",
      icon: ExclamationCircleIcon,
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    },
  };

  const selectedType = typeStyles[type] || typeStyles.success;
  const TypeIcon = selectedType.icon;

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setAccountId("");
    setSelectedAccountLabel("");
    setAccountType("user");
    setType("success");
  };

  const parseListPayload = (payload, fallbackPage = 1) => {
    if (Array.isArray(payload)) {
      return { items: payload, lastPage: fallbackPage };
    }

    if (Array.isArray(payload?.data)) {
      const lastPage = Number(payload?.last_page || payload?.meta?.last_page || fallbackPage) || fallbackPage;
      return { items: payload.data, lastPage };
    }

    if (Array.isArray(payload?.data?.data)) {
      const nested = payload.data;
      const lastPage = Number(nested?.last_page || payload?.last_page || payload?.meta?.last_page || fallbackPage) || fallbackPage;
      return { items: nested.data, lastPage };
    }

    return { items: [], lastPage: fallbackPage };
  };

  const matchAccountType = (item, selectedType) => {
    const roleName = String(item?.roleName || "").toLowerCase();

    if (selectedType === "resident") return true;
    if (selectedType === "admin") return roleName.includes("admin");
    if (selectedType === "manager") return roleName.includes("manager");

    // "user" type: keep non-admin/non-manager accounts
    return !roleName.includes("admin") && !roleName.includes("manager");
  };

  const toAccountOption = (item) => {
    const id = item?.id ?? item?.user_id ?? item?.user_data?.id;
    const name = item?.name || item?.user_data?.name || item?.full_name || "Unknown";
    const username = item?.username || item?.user_data?.username || "";
    const email = item?.email || item?.user_data?.email || "";
    const roleName =
      item?.role?.name ||
      item?.role?.role_name ||
      item?.user_role?.name ||
      item?.user_role?.role_name ||
      item?.role_name ||
      "";

    const primaryMeta = username || email || `#${id ?? "-"}`;

    return {
      id,
      roleName,
      displayName: `${name} (${primaryMeta})`,
    };
  };

  const toResidentOption = (item) => {
    const id = item?.id ?? item?.resident_id ?? item?.user_data?.id;
    const fullName = [item?.name, item?.surname].filter(Boolean).join(" ").trim() || item?.full_name || "Resident";
    const phone = item?.phone || item?.user_data?.phone || "";
    const email = item?.email || item?.user_data?.email || "";
    const primaryMeta = phone || email || `#${id ?? "-"}`;

    return {
      id,
      roleName: "resident",
      displayName: `${fullName} (${primaryMeta})`,
    };
  };

  const loadAccountOptions = useCallback(
    async ({ search = "", page = 1, perPage = 20 }) => {
      const params = {
        page,
        per_page: perPage,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (accountType === "resident") {
        const response = await residentsAPI.search(params);
        const payload = response?.data || {};
        const { items: rawItems, lastPage } = parseListPayload(payload, page);

        const residentItems = rawItems
          .map(toResidentOption)
          .filter((item) => item?.id !== null && item?.id !== undefined);

        return {
          data: residentItems,
          lastPage,
        };
      }

      const response = await usersAPI.getAll(params);
      const payload = response?.data || response;
      const { items: rawItems, lastPage } = parseListPayload(payload, page);

      const filteredItems = rawItems
        .map(toAccountOption)
        .filter((item) => item?.id !== null && item?.id !== undefined)
        .filter((item) => matchAccountType(item, accountType));

      return {
        data: filteredItems,
        lastPage,
      };
    },
    [accountType]
  );

  const handleAccountTypeChange = (value) => {
    const nextType = value || "user";
    setAccountType(nextType);
    setAccountId("");
    setSelectedAccountLabel("");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim() || !accountId) {
      showToast({
        type: "error",
        title: "Xəta",
        message: "Account type seçin, istifadəçi seçin, sonra başlıq və mesajı daxil edin",
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
      resetForm();
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
    <div className="mt-6 mb-8 space-y-5">
      <Header
        icon={BellIcon}
        title={t("notifications.send.pageTitle") || "Bildiriş göndər"}
        subtitle={t("notifications.send.pageSubtitle") || "İstifadəçiyə hədəfli bildiriş göndərmək üçün formu doldurun"}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <Card className="xl:col-span-8 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
          <CardBody className="p-4 sm:p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label={t("notifications.send.accountType") || "Account Type (account_type)"}
                value={accountType}
                onChange={handleAccountTypeChange}
                className="dark:text-white"
              >
                <Option value="user">user</Option>
                <Option value="admin">admin</Option>
                <Option value="manager">manager</Option>
                <Option value="resident">sakin (resident)</Option>
              </Select>

              <AsyncSearchSelect
                // label={t("notifications.send.accountId") || "Account (account_id)"}
                value={accountId || null}
                onChange={(value, option) => {
                  setAccountId(value ? String(value) : "");
                  setSelectedAccountLabel(option?.displayName || "");
                }}
                loadOptions={loadAccountOptions}
                selectedLabel={selectedAccountLabel || null}
                placeholder={t("notifications.send.selectAccount") || "İstifadəçi seçin"}
                searchPlaceholder={t("notifications.send.searchAccount") || "İstifadəçi axtar..."}
                valueKey="id"
                labelKey="displayName"
                perPage={20}
                allowClear={false}
              />
            </div>

            <Input
              label={t("notifications.send.title") || "Başlıq (title)"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Typography variant="small" className="font-medium text-blue-gray-700 dark:text-gray-200">
                  {t("notifications.send.message") || "Mesaj (message)"}
                </Typography>
                <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
                  {message.length} simvol
                </Typography>
              </div>
              <textarea
                placeholder={t("notifications.send.message") || "Mesaj (message)"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-blue-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <Select
                label={t("notifications.send.type") || "Bildiriş tipi (type)"}
                value={type}
                onChange={(value) => setType(value || "success")}
                className="dark:text-white"
              >
                <Option value="success">success</Option>
                <Option value="danger">danger</Option>
                <Option value="info">info</Option>
                <Option value="warning">warning</Option>
              </Select>

              <div className="flex flex-wrap md:justify-end gap-3">
                <Button
                  variant="outlined"
                  onClick={resetForm}
                  className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200"
                >
                  {t("notifications.send.clearButton") || "Təmizlə"}
                </Button>

                <Button
                  onClick={handleSubmit}
                  disabled={sending}
                  style={{ background: getMtkRgba(0.95) }}
                  className="flex items-center gap-2"
                >
                  {sending && <Spinner className="h-4 w-4" />}
                  {t("notifications.send.sendButton") || "Göndər"}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="xl:col-span-4 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 shadow-sm">
          <CardBody className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              <Typography className="font-semibold text-gray-900 dark:text-white">
                Canlı Preview
              </Typography>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/70 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Typography className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {accountType}
                </Typography>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${selectedType.badge}`}>
                  <TypeIcon className="h-3.5 w-3.5" />
                  {selectedType.label}
                </span>
              </div>

              <Typography className="font-bold text-sm text-gray-900 dark:text-white break-words">
                {title.trim() || "Başlıq burada görünəcək"}
              </Typography>

              <Typography className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words min-h-[72px]">
                {message.trim() || "Mesaj mətni burada görünəcək"}
              </Typography>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <Typography className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  account: <span className="font-semibold">{selectedAccountLabel || "-"}</span>
                </Typography>
                <Typography className="text-xs text-gray-500 dark:text-gray-400">
                  account_id: <span className="font-semibold">{accountId || "-"}</span>
                </Typography>
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-3">
              <Typography className="text-xs text-gray-500 dark:text-gray-400 leading-5">
                Tövsiyə: Başlığı qısa saxla, mesajda əsas hərəkəti ilk cümlədə yaz. Bu, oxunma və klik faizini artırır.
              </Typography>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SendNotificationPage;