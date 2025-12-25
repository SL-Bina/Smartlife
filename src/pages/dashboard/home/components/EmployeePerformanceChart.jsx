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
import { motion } from "framer-motion";
import Chart from "react-apexcharts";

export function EmployeePerformanceChart({ options, series, height }) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card className=" dark:border-gray-700/50 shadow-xl shadow-red-200/50 dark:shadow-gray-900/50 bg-gradient-to-br from-white via-white to-gray-50/50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 h-full flex flex-col rounded-2xl transition-all duration-300">
        <CardHeader className="bg-black dark:from-gray-800 dark:to-gray-800 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-red-600 dark:border-gray-700/50">
          <Typography variant="h6" className="text-white font-bold text-base sm:text-lg mb-0">
            {t("dashboard.charts.employeePerformance")}
          </Typography>
          <Menu placement="bottom-end">
            <MenuHandler>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="text"
                  size="sm"
                  className="flex items-center gap-2 normal-case text-white dark:text-gray-300 px-3 sm:px-4 py-2 hover:bg-white/20 dark:hover:bg-gray-700/50 rounded-xl text-xs sm:text-sm transition-all duration-200"
                >
                  {t("dashboard.charts.allDepartments")}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </motion.div>
            </MenuHandler>
            <MenuList className="dark:bg-gray-800 dark:border-gray-700 rounded-xl shadow-xl min-w-[180px]">
              <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 rounded-lg transition-all">
                {t("dashboard.charts.allDepartments")}
              </MenuItem>
              <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 rounded-lg transition-all">
                {t("dashboard.charts.technicalDepartment")}
              </MenuItem>
              <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 rounded-lg transition-all">
                {t("dashboard.charts.security")}
              </MenuItem>
              <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 rounded-lg transition-all">
                {t("dashboard.charts.cleaning")}
              </MenuItem>
            </MenuList>
          </Menu>
        </CardHeader>
        <CardBody className="rounded-2xl bg-white dark:bg-gray-800 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-4 sm:pt-6 flex-1">
          <Chart options={options} series={series} type="line" height={height} />
        </CardBody>
      </Card>
    </motion.div>
  );
}

