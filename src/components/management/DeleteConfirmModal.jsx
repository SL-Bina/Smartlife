import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export function DeleteConfirmModal({ 
  open, 
  onClose, 
  onConfirm,
  title = "Silməni Təsdiqlə",
  message = "Bu elementi silmək istədiyinizə əminsiniz?",
  itemName = "",
  entityName = "element",
  loading = false
}) {
  if (!open) return null;

  const displayMessage = itemName 
    ? `${itemName} adlı ${entityName} silmək istədiyinizə əminsiniz?`
    : message;

  return (
    <Dialog 
      open={open} 
      handler={onClose} 
      size="sm" 
      className="dark:bg-gray-800 border border-red-200 dark:border-red-900/30"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          <Typography variant="h5" className="font-bold text-red-600 dark:text-red-400">
            {title}
          </Typography>
        </div>
        <div 
          className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" 
          onClick={onClose}
        >
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800 py-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="flex-1">
            <Typography variant="h6" className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Diqqət!
            </Typography>
            <Typography variant="paragraph" className="text-gray-700 dark:text-gray-300">
              {displayMessage}
            </Typography>
            <Typography variant="small" className="text-gray-500 dark:text-gray-400 mt-2">
              Bu əməliyyat geri alına bilməz.
            </Typography>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <Button
          variant="text"
          color="gray"
          onClick={onClose}
          className="mr-2"
          disabled={loading}
        >
          Ləğv et
        </Button>
        <Button
          variant="filled"
          color="red"
          onClick={onConfirm}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Silinir...</span>
            </>
          ) : (
            "Sil"
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

