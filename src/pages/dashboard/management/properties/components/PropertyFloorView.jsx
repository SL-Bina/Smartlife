import React, { useMemo } from "react";
import { Card, CardBody, Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem, Spinner } from "@material-tailwind/react";
import { 
  EllipsisVerticalIcon, 
  HomeIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

export function PropertyFloorView({ 
  items = [], 
  loading, 
  onView, 
  onEdit, 
  onDelete, 
  onServiceFee, 
  onSelect, 
  selectedPropertyId 
}) {
  // Mərtəbələrə görə qruplaşdır
  const groupedByFloor = useMemo(() => {
    if (!items || items.length === 0) return {};

    const grouped = {};
    items.forEach((item) => {
      const floor = item?.meta?.floor || item?.floor || 0;
      if (!grouped[floor]) {
        grouped[floor] = [];
      }
      grouped[floor].push(item);
    });

    // Mərtəbələri sırala (yuxarıdan aşağıya)
    const sortedFloors = Object.keys(grouped).sort((a, b) => {
      const floorA = parseInt(a) || 0;
      const floorB = parseInt(b) || 0;
      return floorB - floorA; // Yuxarıdan aşağıya
    });

    const sortedGrouped = {};
    sortedFloors.forEach((floor) => {
      sortedGrouped[floor] = grouped[floor].sort((a, b) => {
        const aptA = parseInt(a?.meta?.apartment_number || a?.apartment_number || 0);
        const aptB = parseInt(b?.meta?.apartment_number || b?.apartment_number || 0);
        return aptA - aptB;
      });
    });

    return sortedGrouped;
  }, [items]);

  const getStatusBadge = (status) => {
    if (status === "active" || status === true) {
      return (
        <Chip
          value="Aktiv"
          size="sm"
          className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          icon={<CheckCircleIcon className="h-3 w-3" />}
        />
      );
    }
    if (status === "inactive" || status === false) {
      return (
        <Chip
          value="Qeyri-aktiv"
          size="sm"
          className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          icon={<XCircleIcon className="h-3 w-3" />}
        />
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <Typography className="text-sm font-medium text-gray-800 dark:text-gray-100">
          Mənzil tapılmadı
        </Typography>
      </div>
    );
  }

  const floors = Object.keys(groupedByFloor);

  return (
    <div className="space-y-8">
      {floors.map((floor) => {
        const floorProperties = groupedByFloor[floor];
        const floorNumber = parseInt(floor) || 0;

        return (
          <div key={floor} className="space-y-4">
            {/* Mərtəbə başlığı */}
            <div className="flex items-center gap-3 pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                <Typography variant="h6" className="text-white font-bold">
                  {floorNumber}
                </Typography>
              </div>
              <div>
                <Typography variant="h6" className="text-gray-900 dark:text-white font-semibold">
                  {floorNumber === 0 ? "Zirzəmi" : floorNumber < 0 ? `${Math.abs(floorNumber)} Mərtəbə (Zirzəmi)` : `${floorNumber} Mərtəbə`}
                </Typography>
                <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                  {floorProperties.length} mənzil
                </Typography>
              </div>
            </div>

            {/* Mənzil kartları */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {floorProperties.map((property) => {
                const isSelected = selectedPropertyId === property.id;
                const apartmentNumber = property?.meta?.apartment_number || property?.apartment_number || "-";
                const area = property?.meta?.area || property?.area || "-";

                return (
                  <Card
                    key={property.id}
                    className={`
                      relative overflow-hidden
                      transition-all duration-300
                      ${isSelected 
                        ? "ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg scale-105" 
                        : "hover:shadow-lg hover:scale-105"
                      }
                      border border-gray-200 dark:border-gray-700
                      bg-white dark:bg-gray-800
                    `}
                  >
                    <CardBody className="p-4">
                      {/* Action Menu */}
                      <div className="absolute top-2 right-2 z-10">
                        <Menu>
                          <MenuHandler>
                            <IconButton 
                              variant="text" 
                              size="sm" 
                              className="dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                            >
                              <EllipsisVerticalIcon className="h-4 w-4" />
                            </IconButton>
                          </MenuHandler>
                          <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                            {onView && (
                              <MenuItem 
                                onClick={() => onView(property)}
                                className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <EyeIcon className="h-4 w-4" />
                                Bax
                              </MenuItem>
                            )}
                            {onEdit && (
                              <MenuItem 
                                onClick={() => onEdit(property)}
                                className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <PencilIcon className="h-4 w-4" />
                                Redaktə et
                              </MenuItem>
                            )}
                            {onServiceFee && (
                              <MenuItem 
                                onClick={() => onServiceFee(property)}
                                className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <CurrencyDollarIcon className="h-4 w-4" />
                                Xidmət haqqı
                              </MenuItem>
                            )}
                            {onDelete && (
                              <MenuItem 
                                onClick={() => onDelete(property)}
                                className="dark:text-red-400 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
                              >
                                <TrashIcon className="h-4 w-4" />
                                Sil
                              </MenuItem>
                            )}
                          </MenuList>
                        </Menu>
                      </div>

                      {/* Mənzil məlumatları */}
                      <div className="space-y-3 pt-2">
                        {/* Mənzil nömrəsi */}
                        <div className="flex items-center gap-2">
                          <HomeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <Typography variant="h6" className="text-gray-900 dark:text-white font-bold">
                            {property.name || `Mənzil ${apartmentNumber}`}
                          </Typography>
                        </div>

                        {/* Mənzil nömrəsi */}
                        {apartmentNumber !== "-" && (
                          <div className="flex items-center gap-2">
                            <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                              Mənzil №:
                            </Typography>
                            <Typography variant="small" className="text-gray-900 dark:text-white font-semibold">
                              {apartmentNumber}
                            </Typography>
                          </div>
                        )}

                        {/* Sahə */}
                        {area !== "-" && (
                          <div className="flex items-center gap-2">
                            <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                              Sahə:
                            </Typography>
                            <Typography variant="small" className="text-gray-900 dark:text-white font-semibold">
                              {area} m²
                            </Typography>
                          </div>
                        )}

                        {/* Status */}
                        <div className="flex items-center gap-2">
                          {getStatusBadge(property.status)}
                        </div>

                        {/* Select button */}
                        {onSelect && (
                          <button
                            onClick={() => onSelect(property)}
                            className={`
                              w-full mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                              ${isSelected
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                              }
                            `}
                          >
                            {isSelected ? "Seçilmiş" : "Seç"}
                          </button>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

