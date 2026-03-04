import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { UserGroupIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DeviceUsersModal({ open, onClose, items = [], loading = false }) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} handler={onClose} size="xl" className="dark:bg-gray-900">
      <DialogHeader className="p-0">
        <div className="w-full rounded-t-xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <UserGroupIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h6" className="text-white font-bold">{t("devices.deviceUsers.title") || "Cihaz istifadəçiləri"}</Typography>
          <button onClick={onClose} className="ml-auto text-white/70 hover:text-white transition-colors"><XMarkIcon className="h-5 w-5" /></button>
        </div>
      </DialogHeader>
      <DialogBody className="p-0 dark:bg-gray-900 max-h-[65vh] overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                {["ID", t("devices.deviceUsers.userName") || "Ad", t("devices.deviceUsers.email") || "E-poçt", t("devices.deviceUsers.phone") || "Telefon", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left">
                    <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">{h}</Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                  <td className="px-6 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold font-mono bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">#{user.id}</span></td>
                  <td className="px-6 py-3"><Typography variant="small" className="font-semibold text-gray-800 dark:text-gray-200 text-xs xl:text-sm">{user.name}</Typography></td>
                  <td className="px-6 py-3"><Typography variant="small" className="text-gray-600 dark:text-gray-400 text-xs xl:text-sm">{user.email}</Typography></td>
                  <td className="px-6 py-3"><Typography variant="small" className="text-gray-600 dark:text-gray-400 text-xs xl:text-sm">{user.phone}</Typography></td>
                  <td className="px-6 py-3">
                    <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold " + (String(user.status).toLowerCase() === "onlayn" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>{user.status}</span>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center"><Typography variant="small" className="text-gray-400 dark:text-gray-500">{t("common.noData") || "Məlumat yoxdur"}</Typography></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end px-6 py-4 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <Button variant="text" color="blue-gray" onClick={onClose} className="dark:text-gray-300">{t("devices.actions.close") || "Bağla"}</Button>
      </DialogFooter>
    </Dialog>
  );
}
