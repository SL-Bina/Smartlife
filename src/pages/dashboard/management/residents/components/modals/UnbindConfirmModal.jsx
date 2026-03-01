import React from "react";
import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Button, Typography
} from "@material-tailwind/react";
import {
  XMarkIcon,
  TrashIcon,
  Square3Stack3DIcon,
  BuildingOfficeIcon,
  BuildingStorefrontIcon,
  RectangleGroupIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

function InfoRow({ icon: Icon, label, value, accent = false }) {
  if (!value) return null;
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${accent ? "bg-red-50 dark:bg-red-900/20" : "bg-gray-50 dark:bg-gray-700/50"}`}>
      <div className={`p-2 rounded-lg ${accent ? "bg-red-100 dark:bg-red-800/50" : "bg-gray-200 dark:bg-gray-600"}`}>
        <Icon className={`h-4 w-4 ${accent ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-300"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <Typography variant="small" className="text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider text-xs">
          {label}
        </Typography>
        <Typography variant="paragraph" className="text-gray-800 dark:text-white font-semibold truncate">
          {value}
        </Typography>
      </div>
    </div>
  );
}

export function UnbindConfirmModal({ open, onClose, onConfirm, labels = {}, loading = false }) {
  if (!open) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="sm"
      dismiss={{ enabled: false }}
      className="dark:bg-gray-800 border border-red-200 dark:border-red-900/30"
    >
      <DialogHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-xl pb-4">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrashIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <Typography variant="h6" className="text-white font-bold">
                Bağlantını Silməyi Təsdiqlə
              </Typography>
              <Typography variant="small" className="text-red-100">
                Aşağıdakı mənzil bu sakindən silinəcək
              </Typography>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </DialogHeader>

      <DialogBody className="p-5 space-y-2">
        <InfoRow icon={UserCircleIcon}         label="Sakin"    value={labels.resident} accent />
        <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
        <InfoRow icon={Square3Stack3DIcon}     label="MTK"      value={labels.mtk} />
        <InfoRow icon={BuildingStorefrontIcon} label="Kompleks" value={labels.complex} />
        <InfoRow icon={BuildingOfficeIcon}     label="Bina"     value={labels.building} />
        {labels.block && (
          <InfoRow icon={RectangleGroupIcon}   label="Blok"     value={labels.block} />
        )}
        <InfoRow icon={HomeIcon}               label="Mənzil"   value={labels.property} />

        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-xl">
          <Typography variant="small" className="text-red-700 dark:text-red-400">
            Bu əməliyyat geri alına bilməz. Sakin bu mənzilə daha giriş əldə edə bilməyəcək.
          </Typography>
        </div>
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-b-xl gap-2">
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
        >
          Ləğv et
        </Button>
        <Button
          variant="gradient"
          color="red"
          onClick={onConfirm}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Silinir...
            </>
          ) : (
            <>
              <TrashIcon className="h-4 w-4" />
              Bəli, Sil
            </>
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default UnbindConfirmModal;
