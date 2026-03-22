import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, IconButton, Chip } from "@material-tailwind/react";
import {
  UserGroupIcon,
  XMarkIcon,
  TrashIcon,
  PlusIcon,
  ArrowPathIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { Pagination } from "@/components";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { Actions as ManagementActions } from "@/components";

export function DeviceUsersModal({
  open,
  onClose,
  items = [],
  loading = false,
  complexId = null,
  complexName = "",
  total = 0,
  onRefresh,
  onOpenAddUser,
  onDeleteUser,
  page = 1,
  onPageChange,
  itemsPerPage = 20,
}) {
  const { t } = useTranslation();
  const { getActiveGradient } = useMtkColor();

  const totalPages = Math.max(1, Math.ceil((Number(total) || 0) / (itemsPerPage || 20)));
  const currentPage = Math.max(1, Number(page) || 1);
  const gradientStyle = { background: getActiveGradient(0.92, 0.72) };
  const activeComplexLabel = complexName || (complexId ? `#${complexId}` : t("devices.deviceUsers.selectComplex") || "Kompleks secin");

  const getInitials = (name = "") => {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  };

  const getStatusLabel = (status) => {
    const normalized = String(status || "").toLowerCase();
    return normalized === "onlayn"
      ? t("devices.filter.online") || "Onlayn"
      : t("devices.filter.offline") || "Offline";
  };

  const getStatusColorClasses = (status) => {
    const normalized = String(status || "").toLowerCase();
    return normalized === "onlayn"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
      : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300";
  };

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="xl"
      className="dark:bg-gray-900 z-[120] border border-gray-200 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="p-0">
        <div className="w-full rounded-t-xl p-5 flex items-center gap-3" style={gradientStyle}>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 border border-white/30">
            <UserGroupIcon className="h-6 w-6 text-white" />
          </div>

          <div className="min-w-0 flex-1">
            <Typography variant="h6" className="text-white font-bold">
              {t("devices.deviceUsers.title") || "Cihaz istifadecileri"}
            </Typography>
            <Typography variant="small" className="text-white/90 text-xs">
              {(t("devices.deviceUsers.complex") || "Kompleks") + ": "}
              <b>{activeComplexLabel}</b>
            </Typography>
          </div>

          <button
            onClick={onRefresh}
            className="text-white/90 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
            title={t("devices.deviceUsers.refresh") || "Yenile"}
            type="button"
          >
            <ArrowPathIcon className="h-5 w-5" />
          </button>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
            type="button"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </DialogHeader>

      <DialogBody className="p-4 md:p-5 dark:bg-gray-900 max-h-[72vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
            <Typography variant="small" className="text-gray-500 dark:text-gray-300 flex items-center gap-1.5">
              <BuildingOffice2Icon className="h-4 w-4" />
              {t("devices.deviceUsers.complex") || "Kompleks"}
            </Typography>
            <Typography variant="h6" className="text-gray-900 dark:text-white font-bold mt-1">
              {activeComplexLabel}
            </Typography>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
            <Typography variant="small" className="text-gray-500 dark:text-gray-300">
              {t("devices.deviceUsers.total") || "Cem"}
            </Typography>
            <Typography variant="h6" className="text-gray-900 dark:text-white font-bold mt-1">
              {total}
            </Typography>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
            <Typography variant="small" className="text-gray-500 dark:text-gray-300">
              {t("devices.pagination.page") || "Sehife"}
            </Typography>
            <Typography variant="h6" className="text-gray-900 dark:text-white font-bold mt-1">
              {currentPage} / {totalPages}
            </Typography>
          </div>
        </div>

        <div className="mb-4">
          <ManagementActions
            entityLevel="device"
            search={{ name: "", status: "" }}
            showStatus={false}
            onCreateClick={onOpenAddUser}
            totalItems={total}
            renderExtraControls={(isMobile) => (
              <Button
                size={isMobile ? "sm" : "md"}
                onClick={onRefresh}
                className="text-white shadow-md hover:shadow-lg transition-all px-4"
                style={gradientStyle}
              >
                <span className="inline-flex items-center gap-1.5">
                  <ArrowPathIcon className="h-4 w-4" />
                  {t("devices.deviceUsers.refresh") || "Yenile"}
                </span>
              </Button>
            )}
          />
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <div className="hidden lg:block overflow-x-auto max-h-[36vh]">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                <tr>
                  {[
                    "ID",
                    t("devices.deviceUsers.userName") || "Ad",
                    t("devices.deviceUsers.email") || "E-poct",
                    t("devices.deviceUsers.phone") || "Telefon",
                    t("devices.deviceUsers.role") || "Rol",
                    t("devices.deviceUsers.domain") || "Domain",
                    t("devices.deviceUsers.status") || "Status",
                    "",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {items.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/60 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">#{user.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold flex items-center justify-center">
                          {getInitials(user.name)}
                        </div>
                        <Typography className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {user.name || "-"}
                        </Typography>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.email || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.phone || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.role || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{user.domain || "-"}</td>
                    <td className="px-4 py-3">
                      <Chip
                        value={getStatusLabel(user.status)}
                        className={`${getStatusColorClasses(user.status)} text-[11px] font-semibold w-fit normal-case`}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <IconButton variant="text" size="sm" color="red" onClick={() => onDeleteUser?.(user.id)}>
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </td>
                  </tr>
                ))}

                {loading && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-300">
                      {t("common.loading") || "Yuklenir..."}
                    </td>
                  </tr>
                )}

                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-300">
                      {t("common.noData") || "Melumat yoxdur"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden p-3 space-y-3 max-h-[36vh] overflow-y-auto">
            {loading ? (
              <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-300">
                {t("common.loading") || "Yuklenir..."}
              </div>
            ) : items.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-300">
                {t("common.noData") || "Melumat yoxdur"}
              </div>
            ) : (
              items.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-gray-900/40 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Typography className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        #{user.id} - {user.name || "-"}
                      </Typography>
                      <div className="mt-2 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <EnvelopeIcon className="h-3.5 w-3.5" /> {user.email || "-"}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PhoneIcon className="h-3.5 w-3.5" /> {user.phone || "-"}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ShieldCheckIcon className="h-3.5 w-3.5" /> {user.role || "-"}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <GlobeAltIcon className="h-3.5 w-3.5" /> {user.domain || "-"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Chip
                        value={getStatusLabel(user.status)}
                        className={`${getStatusColorClasses(user.status)} text-[11px] font-semibold w-fit normal-case`}
                      />
                      <IconButton variant="text" size="sm" color="red" onClick={() => onDeleteUser?.(user.id)}>
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-4">
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(nextPage) => onPageChange?.(nextPage)}
            prevLabel={t("devices.pagination.prev") || "Evvelki"}
            nextLabel={t("devices.pagination.next") || "Novbeti"}
            summary={
              <>
                {(t("devices.deviceUsers.total") || "Cem")}: <b>{total}</b>
              </>
            }
          />
        </div>
      </DialogBody>

      <DialogFooter className="flex justify-end gap-2 px-4 py-3 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="text"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300"
        >
          {t("devices.actions.close") || "Bagla"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
