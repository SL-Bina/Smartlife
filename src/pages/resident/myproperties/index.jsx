import React, { useState, useEffect } from "react";
import { Typography, Spinner } from "@material-tailwind/react";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import myPropertiesAPI from "./api";
import { PropertyCard, PropertyDetailModal } from "./components";

export default function MyPropertiesPage() {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await myPropertiesAPI.getAll();
      setProperties(response?.data?.data || response?.data || []);
    } catch (err) {
      setError(err?.message || t("properties.loadError") || "Məlumat yüklənərkən xəta baş verdi");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (property) => {
    setSelectedProperty(property);
    setDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setDetailModalOpen(false);
    setSelectedProperty(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12" style={{ position: 'relative', zIndex: 0 }}>
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto mb-4" />
          <Typography className="text-sm text-gray-500 dark:text-gray-400">
            {t("properties.loading") || "Yüklənir..."}
          </Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12" style={{ position: 'relative', zIndex: 0 }}>
        <Typography className="text-sm text-red-500 dark:text-red-400">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ position: 'relative', zIndex: 0 }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 p-4 rounded-xl shadow-lg border border-blue-500 dark:border-blue-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <BuildingOfficeIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <Typography variant="h4" className="text-white font-bold">
              {t("properties.myProperties") || "Mənim Əmlaklarım"}
            </Typography>
            <Typography variant="small" className="text-blue-100 dark:text-blue-200">
              {properties.length} {t("properties.property") || "əmlak"}
            </Typography>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {!properties || properties.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <BuildingOfficeIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <Typography className="text-lg text-gray-500 dark:text-gray-400 font-semibold mb-2">
            {t("properties.noProperties") || "Əmlak tapılmadı"}
          </Typography>
          <Typography variant="small" className="text-gray-400 dark:text-gray-500">
            {t("properties.noPropertiesDesc") || "Hələ heç bir əmlakınız yoxdur"}
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <PropertyDetailModal
        open={detailModalOpen}
        onClose={handleCloseModal}
        propertyId={selectedProperty?.id}
      />
    </div>
  );
}
