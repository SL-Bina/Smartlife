import React, { useRef, useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import Chart from "react-apexcharts";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  getPaymentStatistics,
  getPaymentDynamicsData,
  getEmployeePerformanceData,
  getApplicationStatusData,
  getDepartmentStats,
  getResidentStats,
} from "@/data/dashboard-data";

export function Home() {
  const { t } = useTranslation();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const paymentStatistics = getPaymentStatistics(t);
  const residentStats = getResidentStats(t);
  const paymentDynamicsData = getPaymentDynamicsData(t);
  const employeePerformanceData = getEmployeePerformanceData(t);
  const applicationStatusData = getApplicationStatusData(t);
  const departmentStats = getDepartmentStats(t);
  
  // Responsive chart heights
  const getChartHeight = (mobile, tablet, desktop) => {
    if (windowWidth < 640) return mobile;
    if (windowWidth < 1024) return tablet;
    return desktop;
  };
  
  // Pie chart height - larger for better visibility
  const getPieChartHeight = () => {
    if (windowWidth < 640) return 500;
    if (windowWidth < 1024) return 650;
    return 700;
  };

  // Payment Dynamics Chart
  const paymentChartOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: paymentDynamicsData.months,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
        formatter: (val) => val.toFixed(2),
      },
    },
    legend: {
      position: "top",
      fontSize: "12px",
      labels: {
        colors: "#6B7280",
      },
    },
    colors: paymentDynamicsData.series.map((s) => s.color),
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
  };

  const paymentChartSeries = paymentDynamicsData.series.map((s) => ({
    name: t(s.nameKey),
    data: s.data,
  }));

  // Employee Performance Chart
  const employeeChartOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: employeePerformanceData.employees,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "11px",
        },
        rotate: -45,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    legend: {
      position: "top",
      fontSize: "11px",
      labels: {
        colors: "#6B7280",
      },
    },
    colors: employeePerformanceData.series.map((s) => s.color),
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
  };

  const employeeChartSeries = employeePerformanceData.series.map((s) => ({
    name: t(s.nameKey),
    data: s.data,
  }));

  // Application Status Pie Chart
  const pieChartOptions = {
    chart: {
      type: "pie",
      fontFamily: "inherit",
      width: "100%",
      height: getPieChartHeight(),
      events: {
        dataPointMouseEnter: function(event, chartContext, config) {
          const chart = chartContext;
          const dataPointIndex = config.dataPointIndex;
          
          // Get all slices and labels
          const baseEl = chart.w.globals.dom.baseEl;
          const slices = baseEl.querySelectorAll('.apexcharts-pie-area, path[class*="apexcharts-pie"]');
          const dataLabels = baseEl.querySelectorAll('.apexcharts-datalabel, .apexcharts-datalabel-group');
          
          // Hide other slices and labels
          slices.forEach((slice, index) => {
            if (index !== dataPointIndex) {
              slice.style.opacity = "0.3";
              slice.style.transition = "opacity 0.2s ease";
            }
          });
          
          dataLabels.forEach((label, index) => {
            if (index !== dataPointIndex) {
              label.style.opacity = "0";
              label.style.transition = "opacity 0.2s ease";
            }
          });
        },
        dataPointMouseLeave: function(event, chartContext, config) {
          const chart = chartContext;
          const baseEl = chart.w.globals.dom.baseEl;
          const slices = baseEl.querySelectorAll('.apexcharts-pie-area, path[class*="apexcharts-pie"]');
          const dataLabels = baseEl.querySelectorAll('.apexcharts-datalabel, .apexcharts-datalabel-group');
          
          // Restore all slices and labels
          slices.forEach((slice) => {
            slice.style.opacity = "1";
          });
          
          dataLabels.forEach((label) => {
            label.style.opacity = "1";
          });
        },
      },
    },
    labels: applicationStatusData.map((item) => t(item.nameKey)),
    colors: applicationStatusData.map((item) => item.color),
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: "0%",
        },
        dataLabels: {
          offset: 0,
          minAngleToShowLabel: 10,
        },
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.3,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "darken",
          value: 0.3,
        },
      },
    },
    legend: {
      position: "bottom",
      fontSize: "13px",
      fontFamily: "inherit",
      labels: {
        colors: "#6B7280",
      },
      formatter: function (seriesName, opts) {
        const item = applicationStatusData[opts.seriesIndex];
        return `${seriesName} (${t("common.count")}: ${item.value} ${t("common.percentage")}: ${item.percentage}%)`;
      },
      itemMargin: {
        horizontal: 10,
        vertical: 8,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        const item = applicationStatusData[opts.seriesIndex];
        return `${item.value}\n(${item.percentage}%)`;
      },
      style: {
        fontSize: windowWidth >= 1024 ? "16px" : "12px",
        fontWeight: 700,
        colors: ["#FFFFFF"],
      },
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 1,
        left: 1,
        blur: 2,
        opacity: 0.5,
      },
      offsetY: 0,
      offsetX: 0,
      textAnchor: "middle",
      filter: {
        type: "none",
      },
    },
    tooltip: {
      y: {
        formatter: function (val, opts) {
          const item = applicationStatusData[opts.seriesIndex];
          return `${t(item.nameKey)} (${t("common.count")}: ${item.value}, ${t("common.percentage")}: ${item.percentage}%)`;
        },
      },
    },
  };

  const pieChartSeries = applicationStatusData.map((item) => item.value);

  // Department Bar Chart
  const departmentChartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    xaxis: {
      categories: departmentStats.map((d) => t(d.nameKey)),
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    colors: ["#3B82F6"],
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: 600,
        colors: ["#1F2937"],
      },
    },
  };

  const departmentChartSeries = [
    {
      name: t("dashboard.charts.requestCount"),
      data: departmentStats.map((d) => d.total),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10 py-4 sm:py-6 lg:py-8 px-2 sm:px-4">
      {/* Üst statistik kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {paymentStatistics.map((stat, index) => (
          <StatisticsCard
            key={index}
            color="blue"
            icon={React.createElement(stat.icon, { className: "w-6 h-6 text-white" })}
            title={t(stat.titleKey)}
            value={stat.value}
            footer={
              stat.subtitleKey ? (
                <Typography className="font-normal text-blue-gray-600 dark:text-gray-200 text-sm">
                  {t(stat.subtitleKey)}
                </Typography>
              ) : null
            }
          />
        ))}
      </div>

      {/* Orta qrafiklər */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Ödəniş dinamikası */}
        <Card className="border border-red-600 shadow-lg dark:bg-gray-800 dark:border-gray-700 h-full flex flex-col rounded-xl">
          <CardHeader className="bg-black dark:bg-gray-900 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6">
            <Typography variant="h6" className="text-white font-bold text-base sm:text-lg mb-0">
              {t("dashboard.charts.paymentDynamics")}
            </Typography>
          </CardHeader>
          <CardBody className="dark:bg-gray-800 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-0 flex-1">
            <Chart
              options={paymentChartOptions}
              series={paymentChartSeries}
              type="line"
              height={getChartHeight(250, 300, 380)}
            />
          </CardBody>
        </Card>

        {/* Əməkdaş performansı */}
        <Card className="border border-red-600 shadow-lg dark:bg-gray-800 dark:border-gray-700 h-full flex flex-col rounded-xl">
          <CardHeader className="bg-black dark:bg-gray-900 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
            <Chart
              options={employeeChartOptions}
              series={employeeChartSeries}
              type="line"
              height={getChartHeight(250, 300, 380)}
            />
          </CardBody>
        </Card>
      </div>

      {/* Aşağı qrafiklər */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Müraciətlərin statusu - Pie Chart */}
        <Card className="border border-red-600 shadow-lg dark:bg-gray-800 dark:border-gray-700 flex flex-col rounded-xl " style={{ minHeight: "fit-content" }}>
          <CardHeader className="bg-black dark:bg-gray-900 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6 flex-shrink-0">
            <Typography variant="h6" className="text-white font-bold text-base sm:text-lg mb-0">
              {t("dashboard.charts.applicationStatus")}
            </Typography>
          </CardHeader>
          <CardBody className="dark:bg-gray-800 px-2 sm:px-4 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-4 sm:pt-6 flex items-center justify-center overflow-visible">
            <div className="w-full flex items-center justify-center" style={{ 
              maxWidth: "100%", 
              minHeight: `${getPieChartHeight()}px`,
              minWidth: windowWidth >= 1024 ? `${getPieChartHeight()}px` : "100%"
            }}>
              <Chart
                options={pieChartOptions}
                series={pieChartSeries}
                type="pie"
                height={getPieChartHeight()}
                width={windowWidth >= 1024 ? getPieChartHeight() : "100%"}
              />
            </div>
          </CardBody>
        </Card>

        {/* Şöbə statistikaları */}
        <Card className="border border-red-600 shadow-lg dark:bg-gray-800 dark:border-gray-700 h-full flex flex-col rounded-xl">
          <CardHeader className="bg-black dark:bg-gray-900 px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6">
            <Typography variant="h6" className="text-white font-bold text-base sm:text-lg mb-0">
              {t("dashboard.charts.departmentStats")}
            </Typography>
          </CardHeader>
          <CardBody className="dark:bg-gray-800 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8 pt-4 sm:pt-6 flex-1">
            {/* Kiçik statistik kartlar - responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mb-5 sm:mb-6 lg:mb-8">
              {departmentStats.slice(0, 4).map((dept, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-700 p-3 sm:p-4 lg:p-5 rounded-xl border border-gray-200 dark:border-gray-600 h-full flex flex-col shadow-sm"
                >
                  <Typography
                    variant="small"
                    className="text-blue-gray-600 dark:text-gray-200 text-xs mb-3 font-semibold"
                  >
                    {t(dept.nameKey)}
                  </Typography>
                  <Typography
                    variant="h6"
                    className="text-blue-gray-900 dark:text-white font-bold text-sm mb-2"
                  >
                    {t("dashboard.departmentLabels.totalRequests")}: {dept.total}
                  </Typography>
                  <Typography
                    variant="small"
                    className="text-green-600 dark:text-green-300 text-xs mb-3"
                  >
                    {t("dashboard.departmentLabels.completed")}: {dept.completed}
                  </Typography>
                  <div className="mt-auto">
                    <Typography
                      variant="small"
                      className="text-blue-gray-600 dark:text-gray-200 text-xs mb-2"
                    >
                      {t("dashboard.departmentLabels.successRate")} {dept.successRate}%
                    </Typography>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                      <div
                        className="bg-red-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${dept.successRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* 5-ci kart - full width */}
            {departmentStats[4] && (
              <div className="bg-white dark:bg-gray-700 p-3 sm:p-4 lg:p-5 rounded-xl border border-gray-200 dark:border-gray-600 mb-5 sm:mb-6 lg:mb-8 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <Typography
                    variant="small"
                    className="text-blue-gray-600 dark:text-gray-200 text-xs font-semibold"
                  >
                    {t(departmentStats[4].nameKey)}
                  </Typography>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <Typography
                    variant="h6"
                    className="text-blue-gray-900 dark:text-white font-bold text-sm"
                  >
                    {t("dashboard.departmentLabels.totalRequests")}: {departmentStats[4].total}
                  </Typography>
                  <Typography
                    variant="small"
                    className="text-green-600 dark:text-green-300 text-xs"
                  >
                    {t("dashboard.departmentLabels.completed")}: {departmentStats[4].completed}
                  </Typography>
                </div>
                <div>
                  <Typography
                    variant="small"
                    className="text-blue-gray-600 dark:text-gray-200 text-xs mb-2"
                  >
                    {t("dashboard.departmentLabels.successRate")} {departmentStats[4].successRate}%
                  </Typography>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                    <div
                      className="bg-red-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${departmentStats[4].successRate}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Bar Chart */}
            <div className="mt-4 sm:mt-6">
              <Typography
                variant="small"
                className="text-blue-gray-600 dark:text-gray-200 mb-3 sm:mb-4 font-semibold text-xs sm:text-sm"
              >
                {t("dashboard.charts.requestCount")}
              </Typography>
              <Chart
                options={departmentChartOptions}
                series={departmentChartSeries}
                type="bar"
                height={getChartHeight(180, 200, 220)}
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Aşağı statistik kartlar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {residentStats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="cursor-pointer"
          >
            <Card className="border border-red-600 shadow-lg dark:bg-gray-800 dark:border-gray-700 text-center p-3 sm:p-4 lg:p-6 h-full flex flex-col items-center justify-center min-h-[140px] sm:min-h-[160px] lg:min-h-[180px] rounded-xl">
              <div className="mb-2 sm:mb-3 lg:mb-4 flex justify-center">
                {React.createElement(stat.icon, { className: "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600 dark:text-blue-400" })}
              </div>
              <Typography
                variant="h4"
                color="blue-gray"
                className="dark:text-white font-bold mb-2 sm:mb-3 text-lg sm:text-xl lg:text-2xl"
              >
                {stat.value}
              </Typography>
              <Typography
                variant="small"
                className="text-blue-gray-600 dark:text-gray-200 text-[10px] sm:text-xs mb-2 sm:mb-3 lg:mb-4 leading-tight px-1 sm:px-2"
              >
                {t(stat.titleKey)}
              </Typography>
              <Typography
                variant="small"
                className="text-blue-600 dark:text-blue-300 text-[10px] sm:text-xs font-semibold hover:underline"
              >
                {t("dashboard.residentStats.details")}
              </Typography>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Home;
