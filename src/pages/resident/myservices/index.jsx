import React, { useState, useEffect } from "react";
import { Typography, Spinner, Button } from "@material-tailwind/react";
import { PlusIcon, CogIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import myServicesAPI from "./api";
import { ServiceCard, ServiceDetailModal } from "./components";
import ServiceHeader from "./components/ServiceHeader";


export default function MyServicesPage() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await myServicesAPI.getAll();
      // Backend-dən gələn format: response.data.data.data
      const servicesData = response?.data?.data?.data || response?.data?.data ;
      setServices(servicesData);
      console.log("Services loaded:", servicesData);
    } catch (err) {
      console.error("Error fetching services:", err);
      // Use mock data on error
      setError(null); // Don't show error, just use mock data
    } finally {
      setLoading(false);
    }
  };

  const handleView = (service) => {
    setSelectedService(service);
    setDetailModalOpen(true);
  };

  const handleRequest = async (service) => {
    try {
      await myServicesAPI.requestService({ service_id: service.id });
      // Refresh services list
      fetchServices();
    } catch (err) {
      console.error("Error requesting service:", err);
    }
  };

  const handleCancel = async (service) => {
    try {
      await myServicesAPI.cancelService(service.id);
      // Refresh services list
      fetchServices();
    } catch (err) {
      console.error("Error cancelling service:", err);
    }
  };

  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" style={{ position: 'relative', zIndex: 0 }}>
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto mb-4" />
          <Typography className="text-sm text-gray-500 dark:text-gray-400">
            {t("services.loading") || "Xidmətlər yüklənir..."}
          </Typography>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
        <ServiceHeader/>
      

      {services.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ServiceCard
                service={service}
                onView={handleView}
                onRequest={handleRequest}
                onCancel={handleCancel}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <CogIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          <Typography variant="h6" className="text-gray-900 dark:text-white mb-2">
            {t("services.noServices") || "Xidmət tapılmadı"}
          </Typography>
          <Typography variant="small" className="text-gray-500 dark:text-gray-400 mb-6">
            {t("services.noServicesDesc") || "Hazırda heç bir aktiv xidmətiniz yoxdur"}
          </Typography>
          <Button
            variant="filled"
            onClick={() => {
              // TODO: Open new service request modal
              console.log("Request new service");
            }}
          >
            {t("services.requestFirst") || "İlk Xidməti Sifariş Et"}
          </Button>
        </motion.div>
      )}

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        open={detailModalOpen}
        onClose={handleCloseModal}
        onRequest={handleRequest}
        onCancel={handleCancel}
      />
    </div>
  );
}

//sdfgsdf wsef