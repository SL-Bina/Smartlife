import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { useManagementEnhanced } from "@/store/exports";
import { useNavigate } from "react-router-dom";
import {
  CurrencyDollarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export function PropertiesFloorView({ organizedData, onEdit, onView, onDelete, loading = false }) {
  const navigate = useNavigate();
  const { state, actions } = useManagementEnhanced();

  const openFeePage = (apartment) => {
    navigate(`/dashboard/management/service-fee/${apartment.id}`);
  };

  if (loading) {
    return (
      <div className="py-10 flex items-center justify-center">
        <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Yüklənir...</Typography>
      </div>
    );
  }

  if (organizedData.length === 0) {
    return (
      <div className="py-10 flex items-center justify-center">
        <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Heç nə tapılmadı</Typography>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {organizedData.map((floorGroup, floorIndex) => (
        <div key={`floor-${floorGroup.floor}-${floorIndex}`} className="space-y-3">
          <div className="flex items-center gap-2">
            <Typography variant="h6" className="text-blue-gray-700 dark:text-white font-bold">
              Mərtəbə {floorGroup.floor}
            </Typography>
            <div className="flex-1 h-px bg-blue-gray-200 dark:bg-gray-700"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {floorGroup.apartments.map((apartment) => {
              const isSelected = String(state.propertyId || "") === String(apartment.id);

              return (
                <Card
                  key={apartment.id}
                  className={`border shadow-sm dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer ${
                    isSelected
                      ? "border-blue-500 dark:border-blue-400 bg-blue-50/60 dark:bg-gray-700/40"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => {
                    actions.setProperty(apartment.id, apartment);
                    onView?.(apartment);
                  }}
                >
                  <CardBody className="p-4 dark:bg-gray-800">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Typography variant="h6" className="text-blue-gray-900 dark:text-white font-bold text-lg mb-1">
                          {apartment.name || "—"}
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400 text-xs">
                          ID: {apartment.id}
                        </Typography>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between items-center">
                        <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs">
                          Mərtəbə:
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-900 dark:text-white font-semibold text-xs">
                          {apartment.meta?.floor || apartment.floor || "—"}
                        </Typography>
                      </div>

                      <div className="flex justify-between items-center">
                        <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs">
                          Blok:
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-900 dark:text-white font-semibold text-xs">
                          {apartment.blockName || apartment.block || "—"}
                        </Typography>
                      </div>

                      <div className="flex justify-between items-center">
                        <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs">
                          Sahə:
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-900 dark:text-white font-semibold text-xs">
                          {apartment.meta?.area || apartment.area ? `${apartment.meta?.area || apartment.area} m²` : "—"}
                        </Typography>
                      </div>

                      <div className="flex justify-between items-center">
                        <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs">
                          Status:
                        </Typography>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            apartment.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                          }`}
                        >
                          {apartment.status === "active" ? "Aktiv" : "Qeyri-aktiv"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-blue-gray-100 dark:border-gray-700" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="text"
                        color="blue"
                        onClick={() => onView?.(apartment)}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                      >
                        <EyeIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="text"
                        color="amber"
                        onClick={() => onEdit?.(apartment)}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
                      >
                        <PencilIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="text"
                        color="red"
                        onClick={() => onDelete?.(apartment)}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="text"
                        color="green"
                        onClick={() => openFeePage(apartment)}
                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20"
                      >
                        <CurrencyDollarIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
