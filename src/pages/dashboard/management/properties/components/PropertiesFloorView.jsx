import React from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function PropertiesFloorView({ organizedData, onEdit }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const openFeePage = (apartment) => {
    navigate(`/dashboard/management/service-fee/${apartment.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Hər mərtəbə üçün bir sətir - aşağıdan yuxarı (1-ci mərtəbə ən aşağıda) */}
      {organizedData.map((floorGroup, floorIndex) => (
        <div key={`floor-${floorGroup.floor}-${floorIndex}`} className="space-y-3">
          {/* Mərtəbə başlığı */}
          <div className="flex items-center gap-2">
            <Typography variant="h6" className="text-blue-gray-700 dark:text-white font-bold">
              {t("properties.table.floor")} {floorGroup.floor}
            </Typography>
            <div className="flex-1 h-px bg-blue-gray-200 dark:bg-gray-700"></div>
          </div>
          
          {/* Mənzil card-ları - hər sətirdə tam 5 mənzil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {floorGroup.apartments.map((apartment, aptIndex) => {
              // Əgər mənzil yoxdursa (null), boş card göstəririk
              if (!apartment) {
                return (
                  <Card
                    key={`empty-${floorGroup.floor}-${aptIndex}`}
                    className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800 opacity-50"
                  >
                    <CardBody className="p-4 dark:bg-gray-800">
                      <div className="flex items-center justify-center h-32">
                        <Typography
                          variant="small"
                          className="text-blue-gray-400 dark:text-gray-600 text-xs"
                        >
                          {t("properties.empty")}
                        </Typography>
                      </div>
                    </CardBody>
                  </Card>
                );
              }
              
              return (
                <Card
                  key={apartment.id}
                  className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onEdit(apartment)}
                >
                  <CardBody className="p-4 dark:bg-gray-800">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Typography
                          variant="h6"
                          className="text-blue-gray-900 dark:text-white font-bold text-lg mb-1"
                        >
                          {apartment.number}
                        </Typography>
                        <Typography
                          variant="small"
                          className="text-blue-gray-500 dark:text-gray-400 text-xs"
                        >
                          ID: {apartment.id}
                        </Typography>
                      </div>
                      <Menu placement="left-start">
                        <MenuHandler>
                          <IconButton 
                            size="sm" 
                            variant="text" 
                            color="blue-gray" 
                            className="dark:text-gray-300 dark:hover:bg-gray-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <EllipsisVerticalIcon
                              strokeWidth={2}
                              className="h-5 w-5"
                            />
                          </IconButton>
                        </MenuHandler>
                        <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                          <MenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              openFeePage(apartment);
                            }} 
                            className="dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            {t("properties.actions.serviceFee")}
                          </MenuItem>
                          <MenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(apartment);
                            }} 
                            className="dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            {t("properties.actions.edit")}
                          </MenuItem>
                          <MenuItem 
                            className="dark:text-gray-300 dark:hover:bg-gray-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {t("properties.actions.delete")}
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="small"
                          className="text-blue-gray-600 dark:text-gray-400 text-xs"
                        >
                          {t("properties.table.block")}:
                        </Typography>
                        <Typography
                          variant="small"
                          className="text-blue-gray-900 dark:text-white font-semibold text-xs"
                        >
                          {apartment.block}
                        </Typography>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="small"
                          className="text-blue-gray-600 dark:text-gray-400 text-xs"
                        >
                          {t("properties.table.area")}:
                        </Typography>
                        <Typography
                          variant="small"
                          className="text-blue-gray-900 dark:text-white font-semibold text-xs"
                        >
                          {apartment.area} m²
                        </Typography>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="small"
                          className="text-blue-gray-600 dark:text-gray-400 text-xs"
                        >
                          {t("properties.table.resident")}:
                        </Typography>
                        <Typography
                          variant="small"
                          className="text-blue-gray-900 dark:text-white font-semibold text-xs truncate max-w-[120px]"
                          title={apartment.resident}
                        >
                          {apartment.resident}
                        </Typography>
                      </div>
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

