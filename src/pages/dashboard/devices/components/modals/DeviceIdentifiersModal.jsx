import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { KeyIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function DeviceIdentifiersModal({ open, onClose, items = [], loading = false }) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-900">
      <DialogHeader className="p-0">
        <div className="w-full rounded-t-xl bg-gradient-to-r from-amber-600 to-amber-700 p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <KeyIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h6" className="text-white font-bold">{t("devices.deviceIdentifiers.title") || "Cihaz identifikatorları"}</Typography>
          <button onClick={onClose} className="ml-auto text-white/70 hover:text-white transition-colors"><XMarkIcon className="h-5 w-5" /></button>
        </div>
      </DialogHeader>
      <DialogBody className="p-0 dark:bg-gray-900 max-h-[65vh] overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                {["ID", t("devices.deviceIdentifiers.name") || "Ad", t("devices.deviceIdentifiers.value") || "Dəyər", t("devices.deviceIdentifiers.type") || "Növ"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left">
                    <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">{h}</Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((identifier) => (
                <tr key={identifier.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                  <td className="px-6 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold font-mono bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">#{identifier.id}</span></td>
                  <td className="px-6 py-3"><Typography variant="small" className="font-semibold text-gray-800 dark:text-gray-200 text-xs xl:text-sm">{identifier.name}</Typography></td>
                  <td className="px-6 py-3"><span className="font-mono text-xs text-gray-600 dark:text-gray-400">{identifier.identifier}</span></td>
                  <td className="px-6 py-3"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{identifier.type}</span></td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr><td colSpan={4} className="py-10 text-center"><Typography variant="small" className="text-gray-400 dark:text-gray-500">{t("common.noData") || "Məlumat yoxdur"}</Typography></td></tr>
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
