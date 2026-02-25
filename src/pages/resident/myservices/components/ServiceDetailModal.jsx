import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function ServiceDetailModal({ service, open, onClose, onRequest, onCancel }) {
  if (!service) return null;

  const handleRequest = () => {
    onRequest(service);
    onClose();
  };

  const handleCancel = () => {
    onCancel(service);
    onClose();
  };

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800">
      <DialogHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between w-full">
          <Typography variant="h5" className="text-gray-900 dark:text-white">
            Xidmət Detalları
          </Typography>
          <Button
            variant="text"
            color="gray"
            onClick={onClose}
            className="p-2 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </div>
      </DialogHeader>

      <DialogBody className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Service Header */}
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <div className="h-8 w-8 text-blue-600 dark:text-blue-300">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <Typography variant="h4" className="font-bold text-gray-900 dark:text-white">
                {service.name || "Xidmət"}
              </Typography>
              <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                {service.description || "Xidmət təsviri"}
              </Typography>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              service.status === "active" 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            }`}>
              {service.status === "active" ? "Aktiv" : "Gözləmədə"}
            </div>
          </div>

          {/* Service Description */}
          <div>
            <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white mb-2">
              Xidmət Haqqında
            </Typography>
            <Typography variant="paragraph" className="text-gray-600 dark:text-gray-300">
              {service.description || "Bu xidmət haqqında ətraflı məlumat mövcud deyil."}
            </Typography>
          </div>

          {/* Service Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <Typography variant="small" className="text-gray-500 dark:text-gray-400 mb-1">
                Qiymət
              </Typography>
              <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                {service.price ? `${service.price} AZN` : service.amount ? `${service.amount} AZN` : "Müəyyən edilməyib"}
              </Typography>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <Typography variant="small" className="text-gray-500 dark:text-gray-400 mb-1">
                Status
              </Typography>
              <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                {service.status === "active" ? "Aktiv" : service.status === "pending" ? "Gözləmədə" : "Ləğv edilib"}
              </Typography>
            </div>

            {service.next_date && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <Typography variant="small" className="text-gray-500 dark:text-gray-400 mb-1">
                  Növbəti ödəniş
                </Typography>
                <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                  {new Date(service.next_date).toLocaleDateString("az-AZ")}
                </Typography>
              </div>
            )}

            {service.start_date && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <Typography variant="small" className="text-gray-500 dark:text-gray-400 mb-1">
                  Başlanğıc tarixi
                </Typography>
                <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                  {new Date(service.start_date).toLocaleDateString("az-AZ")}
                </Typography>
              </div>
            )}

            {service.last_date && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <Typography variant="small" className="text-gray-500 dark:text-gray-400 mb-1">
                  Son ödəniş
                </Typography>
                <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                  {new Date(service.last_date).toLocaleDateString("az-AZ")}
                </Typography>
              </div>
            )}
          </div>
        </motion.div>
      </DialogBody>

      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex space-x-3 w-full">
          <Button
            variant="outlined"
            onClick={onClose}
            className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Bağla
          </Button>
          
          {service.status === "active" ? (
            <Button
              variant="outlined"
              color="red"
              onClick={handleCancel}
              className="flex-1 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              Xidməti Ləğv Et
            </Button>
          ) : (
            <Button
              variant="filled"
              onClick={handleRequest}
              className="flex-1"
            >
              Xidmət Sifariş Et
            </Button>
          )}
        </div>
      </DialogFooter>
    </Dialog>
  );
}

export default ServiceDetailModal;
