import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  getPaymentDynamicsData,
  getEmployeePerformanceData,
  getApplicationStatusData,
  getDepartmentStats,
} from "@/data/dashboard-data";
import { useWindowWidth } from "./useWindowWidth";

export function useChartConfigs(
  paymentDynamicsDataFromApi = null,
  employeePerformanceDataFromApi = null,
  applicationStatusDataFromApi = null,
  departmentStatsFromApi = null
) {
  const { t } = useTranslation();
  const windowWidth = useWindowWidth();

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

  // Use API data if available, otherwise fallback to mock data
  const paymentDynamicsData = paymentDynamicsDataFromApi || getPaymentDynamicsData(t);
  const employeePerformanceData = employeePerformanceDataFromApi || getEmployeePerformanceData(t);
  const applicationStatusData = applicationStatusDataFromApi || getApplicationStatusData(t);
  const departmentStats = departmentStatsFromApi || getDepartmentStats(t);

  // Payment Dynamics Chart
  const paymentChartOptions = useMemo(
    () => ({
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
    }),
    [paymentDynamicsData]
  );

  const paymentChartSeries = useMemo(
    () =>
      paymentDynamicsData.series.map((s) => ({
        name: t(s.nameKey),
        data: s.data,
      })),
    [paymentDynamicsData.series, t]
  );

  // Employee Performance Chart
  const employeeChartOptions = useMemo(
    () => ({
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
    }),
    [employeePerformanceData]
  );

  const employeeChartSeries = useMemo(
    () =>
      employeePerformanceData.series.map((s) => ({
        name: t(s.nameKey),
        data: s.data,
      })),
    [employeePerformanceData.series, t]
  );

  // Application Status Pie Chart
  const pieChartOptions = useMemo(
    () => ({
      chart: {
        type: "pie",
        fontFamily: "inherit",
        width: "100%",
        height: getPieChartHeight(),
        events: {
          dataPointMouseEnter: function (event, chartContext, config) {
            const chart = chartContext;
            const dataPointIndex = config.dataPointIndex;

            // Get all slices and labels
            const baseEl = chart.w.globals.dom.baseEl;
            const slices = baseEl.querySelectorAll(
              '.apexcharts-pie-area, path[class*="apexcharts-pie"]'
            );
            const dataLabels = baseEl.querySelectorAll(
              ".apexcharts-datalabel, .apexcharts-datalabel-group"
            );

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
          dataPointMouseLeave: function (event, chartContext, config) {
            const chart = chartContext;
            const baseEl = chart.w.globals.dom.baseEl;
            const slices = baseEl.querySelectorAll(
              '.apexcharts-pie-area, path[class*="apexcharts-pie"]'
            );
            const dataLabels = baseEl.querySelectorAll(
              ".apexcharts-datalabel, .apexcharts-datalabel-group"
            );

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
    }),
    [applicationStatusData, t, windowWidth]
  );

  const pieChartSeries = useMemo(
    () => applicationStatusData.map((item) => item.value),
    [applicationStatusData]
  );

  // Department Bar Chart
  const departmentChartOptions = useMemo(
    () => ({
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
      colors: ["#DC2626"],
      grid: {
        borderColor: "#E5E7EB",
        strokeDashArray: 4,
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "12px",
          fontWeight: 600,
          colors: ["#FFFFFF"],
        },
      },
    }),
    [departmentStats, t]
  );

  const departmentChartSeries = useMemo(
    () => [
      {
        name: t("dashboard.charts.requestCount"),
        data: departmentStats.map((d) => d.total),
      },
    ],
    [departmentStats, t]
  );

  return {
    getChartHeight,
    getPieChartHeight,
    paymentChartOptions,
    paymentChartSeries,
    employeeChartOptions,
    employeeChartSeries,
    pieChartOptions,
    pieChartSeries,
    departmentChartOptions,
    departmentChartSeries,
    windowWidth,
  };
}

