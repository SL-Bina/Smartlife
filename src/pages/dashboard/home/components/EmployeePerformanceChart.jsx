import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Chart from "react-apexcharts";

export function EmployeePerformanceChart({ options, series, height }) {
  const { t } = useTranslation();

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 h-full flex flex-col rounded-xl">
      <CardHeader className="bg-black dark:bg-gray-800 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border dark:border-gray-700">
        <Typography variant="h6" className="text-white font-bold text-base sm:text-lg mb-0">
          {t("dashboard.charts.employeePerformance")}
        </Typography>
        <Menu>
          <MenuHandler>
            <Button
              variant="text"
              size="sm"
              className="flex items-center gap-1 normal-case text-blue-gray-700 dark:text-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xs sm:text-sm"
            >
              {t("dashboard.charts.allDepartments")}
              <ChevronDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </MenuHandler>
          <MenuList className="dark:bg-gray-800 dark:border-gray-700">
            <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
              {t("dashboard.charts.allDepartments")}
            </MenuItem>
            <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
              {t("dashboard.charts.technicalDepartment")}
            </MenuItem>
            <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
              {t("dashboard.charts.security")}
            </MenuItem>
            <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
              {t("dashboard.charts.cleaning")}
            </MenuItem>
          </MenuList>
        </Menu>
      </CardHeader>
      <CardBody className="dark:bg-gray-800 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-0 flex-1">
        <Chart options={options} series={series} type="line" height={height} />
      </CardBody>
    </Card>
  );
}

