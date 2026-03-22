import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { QueueListIcon, XMarkIcon, ArrowPathIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { Pagination } from "@/components";

export function DeviceLogsModal({
  open,
  onClose,
  items = [],
  loading = false,
  complexId = null,
  complexName = "",
  total = 0,
  page = 1,
  onPageChange,
  onRefresh,
  itemsPerPage = 20,
}) {
  const { t } = useTranslation();
  const { getActiveGradient } = useMtkColor();

  const getResultColor = (message = "") => {
    const value = String(message).toLowerCase();
    if (
      value.includes("grant") ||
      value.includes("allow") ||
      value.includes("success") ||
      value.includes("ok") ||
      value.includes("access granted")
    ) {
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    }
    if (
      value.includes("deny") ||
      value.includes("denied") ||
      value.includes("reject") ||
      value.includes("fail") ||
      value.includes("error") ||
      value.includes("not valid")
    ) {
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }
    return "bg-gray-100 text-gray-700 dark:bg-gray-700/60 dark:text-gray-300";
  };

  const gradientStyle = { background: getActiveGradient(0.92, 0.72) };
  const totalPages = Math.max(1, Math.ceil((Number(total) || 0) / (itemsPerPage || 20)));
  const currentPage = Math.max(1, Number(page) || 1);
  const activeComplexLabel =
    complexName || (complexId ? `#${complexId}` : t("devices.deviceUsers.selectComplex") || "Kompleks secin");

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="xl"
      className="dark:bg-gray-900 z-[130] border border-gray-200 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="p-0">
        <div className="w-full rounded-t-xl p-5 flex items-center gap-3" style={gradientStyle}>
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 border border-white/30">
            <QueueListIcon className="h-6 w-6 text-white" />
          </div>

          <div className="min-w-0 flex-1">
            <Typography variant="h6" className="text-white font-bold">
              {t("devices.deviceLogs.title") || "Cihaz qeydləri"}
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

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <div className="overflow-x-auto max-h-[42vh]">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700/70">
                  {[
                    "ID",
                    t("devices.deviceLogs.date") || "Tarix",
                    t("devices.deviceLogs.device") || "Cihaz",
                    t("devices.table.building") || "Domain",
                    t("devices.deviceLogs.identifier") || "İdentifikator",
                    t("devices.deviceLogs.type") || "Növ",
                    t("devices.actions.user") || "İstifadəçi",
                    t("devices.deviceLogs.acsMessage") || "Nəticə",
                  ].map((h) => (
                    <th key={h} className="px-6 py-3 text-left">
                      <Typography variant="small" className="font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-xs">{h}</Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {items.map((log) => (
                  <tr
                    key={log.id}
                    className="odd:bg-white even:bg-gray-50/50 dark:odd:bg-gray-800 dark:even:bg-gray-800/70 hover:!bg-blue-50/60 dark:hover:!bg-blue-900/20 transition-colors"
                  >
                    <td className="px-6 py-3"><span className="font-mono text-xs text-gray-600 dark:text-gray-400">#{log.id}</span></td>
                    <td className="px-6 py-3"><span className="font-mono text-xs text-gray-600 dark:text-gray-400">{log.date}</span></td>
                    <td className="px-6 py-3"><Typography variant="small" className="text-gray-800 dark:text-gray-200 text-xs xl:text-sm">{log.device}</Typography></td>
                    <td className="px-6 py-3"><Typography variant="small" className="text-gray-800 dark:text-gray-200 text-xs xl:text-sm">{log.domain || "-"}</Typography></td>
                    <td className="px-6 py-3"><span className="font-mono text-xs text-gray-500 dark:text-gray-400">{log.identifier}</span></td>
                    <td className="px-6 py-3"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{log.type}</span></td>
                    <td className="px-6 py-3"><Typography variant="small" className="text-gray-800 dark:text-gray-200 text-xs xl:text-sm">{log.user || "-"}</Typography></td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getResultColor(log.acsMessage)}`}>{log.acsMessage}</span>
                    </td>
                  </tr>
                ))}

                {loading && (
                  <tr><td colSpan={8} className="py-10 text-center"><Typography variant="small" className="text-gray-400 dark:text-gray-500">{t("common.loading") || "Yuklenir..."}</Typography></td></tr>
                )}

                {!loading && items.length === 0 && (
                  <tr><td colSpan={8} className="py-10 text-center"><Typography variant="small" className="text-gray-400 dark:text-gray-500">{t("common.noData") || "Məlumat yoxdur"}</Typography></td></tr>
                )}
              </tbody>
            </table>
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
      <DialogFooter className="flex justify-end px-6 py-4 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <Button variant="text" color="blue-gray" onClick={onClose} className="dark:text-gray-300">{t("devices.actions.close") || "Bağla"}</Button>
      </DialogFooter>
    </Dialog>
  );
}
