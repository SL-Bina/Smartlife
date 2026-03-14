import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, IconButton } from "@material-tailwind/react";
import { UserGroupIcon, XMarkIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { CustomSelect } from "@/components/ui/CustomSelect";

export function DeviceUsersModal({
  open,
  onClose,
  items = [],
  loading = false,
  complexId = 2,
  complexName = "",
  total = 0,
  onRefresh,
  onOpenAddUser,
  onDeleteUser,
  complexes = [],
  selectedComplexId = null,
  onComplexChange,
}) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} handler={onClose} size="xl" className="dark:bg-gray-900 z-[120]" dismiss={{ enabled: false }}>
      <DialogHeader className="p-0">
        <div className="w-full rounded-t-xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <UserGroupIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h6" className="text-white font-bold">
            {t("devices.deviceUsers.title") || "Cihaz istifadəçiləri"}
          </Typography>
          <button onClick={onClose} className="ml-auto text-white/70 hover:text-white transition-colors">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </DialogHeader>

      <DialogBody className="p-4 dark:bg-gray-900 h-[72vh] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
            <Typography variant="small" className="text-gray-500 dark:text-gray-300">{t("devices.deviceUsers.complex") || "Kompleks"}</Typography>
            <Typography variant="h6" className="text-gray-900 dark:text-white font-bold">{complexName || `#${complexId}`}</Typography>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
            <Typography variant="small" className="text-gray-500 dark:text-gray-300">{t("devices.deviceUsers.total") || "Cəm"}</Typography>
            <Typography variant="h6" className="text-gray-900 dark:text-white font-bold">{total}</Typography>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
            <Typography variant="small" className="text-gray-500 dark:text-gray-300">{t("devices.deviceUsers.title") || "Cihaz istifadəçiləri"}</Typography>
            <Typography variant="h6" className="text-gray-900 dark:text-white font-bold">{items.length} {t("devices.deviceUsers.users") || "istifadəçi"}</Typography>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 mb-3">
          <div className="flex-1">
            <CustomSelect
              label={t("devices.deviceUsers.complexSelect") || "Kompleks seçin"}
              value={selectedComplexId?.toString() || ""}
              onChange={(value) => onComplexChange?.(value)}
              options={[{ value: "", label: t("devices.deviceUsers.complexSelect") || "Kompleks seçin" }, ...complexes.map((complex) => ({ value: String(complex.id), label: complex.name || complex.title || `Complex ${complex.id}`}))]}
              placeholder={t("devices.deviceUsers.complexSelect") || "Kompleks seçin"}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" color="blue" onClick={onOpenAddUser} className="flex items-center gap-1">
              <PlusIcon className="h-4 w-4" /> {t("devices.deviceUsers.addUser") || "Yeni istifadəçi"}
            </Button>
            <Button size="sm" color="blue" variant="outlined" onClick={onRefresh}>{t("devices.deviceUsers.refresh") || "Yenilə"}</Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-[46vh]">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {[
                  "ID",
                  t("devices.deviceUsers.userName") || "Ad",
                  t("devices.deviceUsers.email") || "E-poçt",
                  t("devices.deviceUsers.phone") || "Telefon",
                  t("devices.deviceUsers.role") || "Rol",
                  t("devices.deviceUsers.domain") || "Domain",
                  t("devices.deviceUsers.status") || "Status",
                  ""
                ].map((heading) => (
                  <th key={heading} className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-200">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {items.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-2 text-xs text-gray-700 dark:text-gray-200">#{user.id}</td>
                  <td className="px-3 py-2 text-xs text-gray-800 dark:text-gray-100">{user.name}</td>
                  <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">{user.email}</td>
                  <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">{user.phone}</td>
                  <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">{user.role || "-"}</td>
                  <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-300">{user.domain || "-"}</td>
                  <td className="px-3 py-2"><span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${String(user.status || "").toLowerCase() === "onlayn" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>{user.status || "Offline"}</span></td>
                  <td className="px-3 py-2 text-right">
                    <IconButton variant="text" size="sm" color="red" onClick={() => onDeleteUser?.(user.id)}>
                      <TrashIcon className="h-4 w-4" />
                    </IconButton>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr><td colSpan={8} className="px-3 py-6 text-center text-xs text-gray-500 dark:text-gray-300">{t("common.loading") || "Yüklənir..."}</td></tr>
              )}
              {!loading && items.length === 0 && (
                <tr><td colSpan={8} className="px-3 py-6 text-center text-xs text-gray-500 dark:text-gray-300">{t("common.noData") || "Məlumat yoxdur"}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 px-4 py-3 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <Button variant="text" color="blue-gray" onClick={onClose} className="dark:text-gray-300">{t("devices.actions.close") || "Bağla"}</Button>
      </DialogFooter>
    </Dialog>
  );
}
