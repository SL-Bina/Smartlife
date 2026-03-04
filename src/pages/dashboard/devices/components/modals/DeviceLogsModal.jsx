import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { QueueListIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DeviceLogsModal({ open, onClose, items = [], loading = false }) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} handler={onClose} size="xl" className="dark:bg-gray-900">
      <DialogHeader className="p-0">
        <div className="w-full rounded-t-xl bg-gradient-to-r from-teal-600 to-teal-700 p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <QueueListIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h6" className="text-white font-bold">{t("devices.deviceLogs.title") || "Cihaz qeydləri"}</Typography>
          <button onClick={onClose} className="ml-auto text-white/70 hover:text-white transition-colors"><XMarkIcon className="h-5 w-5" /></button>
        </div>
      </DialogHeader>
      <DialogBody className="p-0 dark:bg-gray-900 max-h-[65vh] overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                {[t("devices.deviceLogs.date") || "Tarix", t("devices.deviceLogs.device") || "Cihaz", t("devices.deviceLogs.identifier") || "İdentifikator", t("devices.deviceLogs.type") || "Növ", t("devices.deviceLogs.acsMessage") || "Nəticə"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left">
                    <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">{h}</Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                  <td className="px-6 py-3"><span className="font-mono text-xs text-gray-600 dark:text-gray-400">{log.date}</span></td>
                  <td className="px-6 py-3"><Typography variant="small" className="text-gray-800 dark:text-gray-200 text-xs xl:text-sm">{log.device}</Typography></td>
                  <td className="px-6 py-3"><span className="font-mono text-xs text-gray-500 dark:text-gray-400">{log.identifier}</span></td>
                  <td className="px-6 py-3"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{log.type}</span></td>
                  <td className="px-6 py-3">
                    <span className={"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold " + (log.acsMessage === "Access granted" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>{log.acsMessage}</span>
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
