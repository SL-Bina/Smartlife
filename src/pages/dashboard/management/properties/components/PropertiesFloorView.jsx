import React from "react";
import { Card, CardBody, Typography, IconButton, Menu, MenuHandler, MenuList, MenuItem, Chip } from "@material-tailwind/react";
import { CurrencyDollarIcon, EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function PropertiesFloorView({ organizedData, onEdit, onView, onDelete }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const openFeePage = (apartment) => {
    navigate(`/dashboard/management/service-fee/${apartment.id}`);
  };

  const statusColor = (s) => (s === "active" ? "green" : "gray");

  return (
    <div className="space-y-6">
      {organizedData.map((floorGroup, floorIndex) => (
        <div key={`floor-${floorGroup.floor}-${floorIndex}`} className="space-y-3">
          <div className="flex items-center gap-2">
            <Typography variant="h6" className="text-blue-gray-700 dark:text-white font-bold">
              {t("properties.table.floor") || "Mərtəbə"} {floorGroup.floor}
            </Typography>
            <div className="flex-1 h-px bg-blue-gray-200 dark:bg-gray-700"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {floorGroup.apartments.map((apartment) => (
              <Card
                key={apartment.id}
                className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onView(apartment)}
              >
                <CardBody className="p-4 dark:bg-gray-800">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Typography variant="h6" className="text-blue-gray-900 dark:text-white font-bold text-lg mb-1">
                        {apartment.name}
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-500 dark:text-gray-400 text-xs">
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
                          <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                        </IconButton>
                      </MenuHandler>

                      <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                        <MenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            openFeePage(apartment);
                          }}
                          className="flex items-center gap-2 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                          <CurrencyDollarIcon className="h-4 w-4" />
                          {t("properties.actions.serviceFee") || "Service fee"}
                        </MenuItem>


                        <MenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(apartment);
                          }}
                          className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <EyeIcon className="h-4 w-4" />
                          {t("properties.actions.view") || "Bax"}
                        </MenuItem>

                        <MenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(apartment);
                          }}
                          className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <PencilIcon className="h-4 w-4" />
                          {t("properties.actions.edit") || "Dəyiş"}
                        </MenuItem>

                        <MenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(apartment);
                          }}
                          className="dark:text-gray-300 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600"
                        >
                          <TrashIcon className="h-4 w-4" />
                          {t("properties.actions.delete") || "Sil"}
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs">
                      {t("properties.table.block") || "Blok"}:
                    </Typography>
                    <Typography variant="small" className="text-blue-gray-900 dark:text-white font-semibold text-xs">
                      {apartment.block}
                    </Typography>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs">
                      {t("properties.table.area") || "Sahə"}:
                    </Typography>
                    <Typography variant="small" className="text-blue-gray-900 dark:text-white font-semibold text-xs">
                      {apartment.area} m²
                    </Typography>
                  </div>

                  <div className="flex justify-between items-center">
                    <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs">
                      {t("properties.table.status") || "Status"}:
                    </Typography>
                    <Chip
                      size="sm"
                      value={apartment.status || "—"}
                      color={statusColor(apartment.status)}
                      className="text-xs"
                    />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
