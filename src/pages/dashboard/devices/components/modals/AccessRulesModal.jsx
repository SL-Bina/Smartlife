import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function AccessRulesModal({ open, onClose, items = [], loading = false }) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-900">
      <DialogHeader className="p-0">
        <div className="w-full rounded-t-xl bg-gradient-to-r from-slate-700 to-slate-800 p-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <Cog6ToothIcon className="h-5 w-5 text-white" />
          </div>
          <Typography variant="h6" className="text-white font-bold">
            {t("devices.accessRules.title") || "Cihaz icazələri"}
          </Typography>
          <button onClick={onClose} className="ml-auto text-white/70 hover:text-white transition-colors">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </DialogHeader>
      <DialogBody className="p-0 dark:bg-gray-900 max-h-[65vh] overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                {["ID", t("devices.accessRules.name") || "Ad", t("devices.accessRules.deviceCount") || "Cihaz sayı"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left">
                    <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">{h}</Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold font-mono bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300">#{rule.id}</span>
                  </td>
                  <td className="px-6 py-3">
                    <Typography variant="small" className="text-gray-800 dark:text-gray-200 text-xs xl:text-sm">{rule.name}</Typography>
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{rule.deviceCount}</span>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr><td colSpan={3} className="py-10 text-center">
                  <Typography variant="small" className="text-gray-400 dark:text-gray-500">{t("common.noData") || "Məlumat yoxdur"}</Typography>
                </td></tr>
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
