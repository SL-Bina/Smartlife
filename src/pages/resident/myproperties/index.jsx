import React, { useState, useEffect } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import myPropertiesAPI from "./api";

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await myPropertiesAPI.getAll();
        setProperties(response?.data?.data || []);
        setError(null);
      } catch (err) {
        setError(err.message || "Məlumat yüklənərkən xəta baş verdi");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <Typography className="text-sm text-gray-500 dark:text-gray-400">
          Yüklənir...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Typography className="text-sm text-red-500 dark:text-red-400">
          {error}
        </Typography>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <Typography className="text-sm text-gray-500 dark:text-gray-400">
          Əmlak tapılmadı
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
        <Typography variant="h4" className="text-gray-800 dark:text-gray-200">
          Mənim Əmlaklarım
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <Card key={property.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Typography variant="h6" className="text-gray-800 dark:text-gray-200 font-semibold mb-2">
                    {property.name}
                  </Typography>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 mb-1">
                    MTK: {property.mtk?.name || `#${property.mtk_id}`}
                  </Typography>
                  <Typography variant="small" className="text-gray-500 dark:text-gray-400 mb-1">
                    Kompleks: {property.complex?.name || `#${property.complex_id}`}
                  </Typography>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    property.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {property.status === "active" ? "Aktiv" : "Qeyri-aktiv"}
                </span>
              </div>

              {property.meta && (
                <div className="space-y-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {property.meta.area && (
                    <div className="flex justify-between">
                      <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                        Sahə:
                      </Typography>
                      <Typography variant="small" className="text-gray-800 dark:text-gray-200 font-medium">
                        {property.meta.area} m²
                      </Typography>
                    </div>
                  )}
                  {property.meta.floor && (
                    <div className="flex justify-between">
                      <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                        Mərtəbə:
                      </Typography>
                      <Typography variant="small" className="text-gray-800 dark:text-gray-200 font-medium">
                        {property.meta.floor}
                      </Typography>
                    </div>
                  )}
                  {property.meta.apartment_number && (
                    <div className="flex justify-between">
                      <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                        Mənzil nömrəsi:
                      </Typography>
                      <Typography variant="small" className="text-gray-800 dark:text-gray-200 font-medium">
                        {property.meta.apartment_number}
                      </Typography>
                    </div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

