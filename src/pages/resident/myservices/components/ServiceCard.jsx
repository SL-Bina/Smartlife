import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { 
  CogIcon, 
  WrenchScrewdriverIcon, 
  BellIcon, 
  FireIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function ServiceCard({ service, onView, onRequest, onCancel }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "pending":
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getServiceIcon = (name) => {
    // Backend-də gələn name-ə görə ikon seçirik
    const serviceName = (name || "").toLowerCase();
    if (serviceName.includes("servis") || serviceName.includes("service")) {
      return <CogIcon className="h-8 w-8 text-blue-500" />;
    } else if (serviceName.includes("temiz") || serviceName.includes("clean")) {
      return <WrenchScrewdriverIcon className="h-8 w-8 text-green-500" />;
    } else if (serviceName.includes("təhlükə") || serviceName.includes("security")) {
      return <BellIcon className="h-8 w-8 text-purple-500" />;
    } else if (serviceName.includes("istilik") || serviceName.includes("heat")) {
      return <FireIcon className="h-8 w-8 text-red-500" />;
    } else {
      return <CogIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800 dark:border-gray-700">
        <CardBody className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getServiceIcon(service.name)}
              <div>
                <Typography variant="h6" className="font-semibold text-gray-900 dark:text-white">
                  {service.name || "Xidmət"}
                </Typography>
                <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                  {service.description || "Xidmət təsviri"}
                </Typography>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(service.status)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                {service.status === "active" ? "Aktiv" : 
                 service.status === "pending" ? "Gözləmədə" : 
                 service.status === "cancelled" ? "Ləğv edilib" : "Məlum deyil"}
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <Typography variant="small" className="text-gray-600 dark:text-gray-300">
              {service.description || "Xidmət haqqında məlumat"}
            </Typography>
            
            {service.price && (
              <Typography variant="small" className="font-medium text-gray-900 dark:text-white">
                Qiymət: {service.price} AZN
              </Typography>
            )}

            {service.amount && (
              <Typography variant="small" className="font-medium text-gray-900 dark:text-white">
                Məbləğ: {service.amount} AZN
              </Typography>
            )}

            {service.next_date && (
              <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                Növbəti ödəniş: {new Date(service.next_date).toLocaleDateString("az-AZ")}
              </Typography>
            )}

            {service.start_date && (
              <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                Başlanğıc: {new Date(service.start_date).toLocaleDateString("az-AZ")}
              </Typography>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => onView(service)}
              className="flex-1 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Ətraflı
            </Button>
            
            {service.status === "active" ? (
              <Button
                variant="outlined"
                size="sm"
                color="red"
                onClick={() => onCancel(service)}
                className="flex-1 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Ləğv et
              </Button>
            ) : (
              <Button
                variant="filled"
                size="sm"
                onClick={() => onRequest(service)}
                className="flex-1"
              >
                Sifariş et
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

export default ServiceCard;
