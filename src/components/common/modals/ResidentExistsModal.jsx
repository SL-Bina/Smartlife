import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { ExclamationTriangleIcon, LinkIcon, UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function ResidentExistsModal({ open, onClose, onChoose, saving }) {
  if (!open) return null;

  return (
    <Dialog
      open={!!open}
      handler={onClose}
      size="sm"
      className="dark:bg-gray-800 border border-amber-300 dark:border-amber-700 shadow-2xl"
      style={{ zIndex: 99999 }}
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="border-b border-amber-200 dark:border-amber-700 pb-4 flex items-center justify-between bg-amber-50 dark:bg-amber-900/30 rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-800">
            <ExclamationTriangleIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <Typography variant="h6" className="text-amber-800 dark:text-amber-300 font-bold">Sakin artıq mövcuddur</Typography>
        </div>
        <Button variant="text" size="sm" onClick={onClose} className="text-amber-700 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-800/40 rounded-full p-2">
          <XMarkIcon className="h-5 w-5" />
        </Button>
      </DialogHeader>

      <DialogBody className="p-6">
        <Typography className="text-gray-700 dark:text-gray-300 mb-6 text-sm leading-relaxed">
          Bu məlumatlarla uyğun sakin artıq sistemdə mövcuddur. Necə davam etmək istəyirsiniz?
        </Typography>

        <div className="flex flex-col gap-3">
          <button
            disabled={saving}
            onClick={() => onChoose(true)}
            className="w-full flex items-start gap-4 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800 flex-shrink-0 mt-0.5">
              <LinkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <Typography variant="small" className="font-bold text-blue-800 dark:text-blue-300 mb-0.5">Mövcud sakini mənzilə bağla</Typography>
              <Typography variant="small" className="text-blue-600 dark:text-blue-400">Sistemdəki sakin qeyd etdiyiniz mənzilə əlavə ediləcək</Typography>
            </div>
          </button>

          <button
            disabled={saving}
            onClick={() => onChoose(false)}
            className="w-full flex items-start gap-4 p-4 rounded-xl border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-100 dark:hover:bg-green-900/40 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800 flex-shrink-0 mt-0.5">
              <UserPlusIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <Typography variant="small" className="font-bold text-green-800 dark:text-green-300 mb-0.5">Yeni sakin kimi əlavə et</Typography>
              <Typography variant="small" className="text-green-600 dark:text-green-400">Eyni məlumatlarla tamamilə yeni sakin yaradılacaq</Typography>
            </div>
          </button>
        </div>
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button variant="outlined" onClick={onClose} disabled={saving} className="border-gray-500 text-gray-600 hover:bg-gray-100 dark:border-gray-500 dark:text-gray-400 dark:hover:bg-gray-700 w-full">
          {saving ? "Zəhmət olmasa gözləyin..." : "Ləğv et"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
