import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Spinner,
} from "@material-tailwind/react";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const ReportsPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [startDate, setStartDate] = useState("2025-11-01");
  const [endDate, setEndDate] = useState("2025-11-20");
  const [currency, setCurrency] = useState("AZN ilə");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleFilterApply = () => {
    setFilterOpen(false);
  };

  const handleFilterClear = () => {
    setStartDate("2025-11-01");
    setEndDate("2025-11-20");
    setCurrency("AZN");
    setFilterOpen(false);
  };

  const handleExport = () => {
    // Export functionality
    console.log("Exporting report...");
  };

  // Mock data
  const incomeData = {
    invoice: { total: 1199.0, bank: 0.0, cash: 1199.0 },
    deposit: { total: 14.0, bank: 0.0, cash: 14.0 },
    receivedLiabilities: { total: 0.0, bank: 0.0, cash: 0.0 },
    total: 1213.0,
  };

  const expenseData = {
    expenses: { total: 329.0, bank: 0.0, cash: 329.0 },
    returnedLiabilities: { total: 0.0, bank: 0.0, cash: 0.0 },
    total: 329.0,
  };

  const balanceData = {
    totalDepositBalance: { total: -637.09, bank: 3.05, cash: -640.14 },
    depositWithdrawn: { total: 363.67, bank: 0.0, cash: 363.67 },
    previousMonthBalances: { total: 1644.55, bank: 189.42 },
  };

  const profitLossData = {
    revenue: 1038.67,
    expense: 1367.67,
  };

  const previousMonthData = {
    income: 1644.55,
    paid: 1018.0,
    cashBankBalance: 2528.55,
    centralDebt: 2333.55,
    centralDebtValue: -90.0,
    currentMonthEndBalance: { total: 2528.55, bank: 189.42, cash: 2339.13 },
  };

  // Mock data for residents receivables table
  const residentsReceivablesData = [
    {
      dateRange: "01.11.2025 - 30.11.2025",
      totalApartments: 5,
      indebtedApartments: 5,
      indebtedInvoices: 9,
      debtAmount: 540.0,
    },
    {
      dateRange: "01.01.2023 - 24.11.2025",
      totalApartments: 10,
      indebtedApartments: 10,
      indebtedInvoices: 46,
      debtAmount: 2113.0,
    },
  ];

  const formatNumber = (num) => {
    return num.toLocaleString("az-AZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="space-y-6">
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black dark:bg-black p-5 rounded-lg shadow-lg border border-red-600 dark:border-red-600 mt-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Typography variant="h5" className="text-white font-bold">
            {t("reports.pageTitle")} {formatDate(startDate)} - {formatDate(endDate)} ({currency})
          </Typography>
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outlined"
              color="blue"
              size="sm"
              className="flex items-center gap-2 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-600/20"
              onClick={handleExport}
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              {t("reports.actions.export")}
            </Button>
            <Button 
              variant="outlined" 
              color="blue" 
              size="sm"
              onClick={() => setFilterOpen(true)} 
              className="dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-600/20"
            >
              {t("reports.actions.search")}
            </Button>
          </div>
        </div>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="md" className="dark:bg-black border border-red-600 dark:border-red-600">
        <DialogHeader className="dark:text-white border-b border-gray-200 dark:border-gray-700 pb-3">
          <Typography variant="h5" className="font-bold">
            {t("reports.filter.title")}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="space-y-5 dark:bg-black py-6">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("reports.filter.startDate")}
            </Typography>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("reports.filter.endDate")}
            </Typography>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("reports.filter.currency")}
            </Typography>
            <Input
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2 dark:bg-black border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button 
            variant="text" 
            color="blue-gray" 
            onClick={handleFilterClear} 
            className="dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t("buttons.clear")}
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outlined" 
              color="blue-gray" 
              onClick={() => setFilterOpen(false)} 
              className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              {t("buttons.cancel")}
            </Button>
            <Button 
              color="blue" 
              onClick={handleFilterApply} 
              className="dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {t("buttons.apply")}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Spinner className="h-6 w-6 dark:text-blue-400" />
          <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
            {t("reports.actions.loading")}
          </Typography>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Income and Expenses Section */}
          <Card className="border border-red-600 dark:border-red-600 shadow-lg dark:bg-black bg-white">
            <CardBody className="p-4 dark:bg-black">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Income Column */}
                <div className="flex flex-col h-full">
                  <div className="pb-2 border-b border-gray-200 dark:border-gray-700 mb-3">
                    <Typography variant="h6" color="blue-gray" className="font-bold dark:text-white">
                      {t("reports.income.title")}
                    </Typography>
                  </div>
                  
                  <div className="flex flex-col space-y-3 flex-1">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex-1 flex flex-col">
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.income.invoice")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.total")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(incomeData.invoice.total)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.bank")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(incomeData.invoice.bank)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.cash")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(incomeData.invoice.cash)}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex-1 flex flex-col">
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.income.deposit")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.total")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(incomeData.deposit.total)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.bank")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(incomeData.deposit.bank)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.cash")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(incomeData.deposit.cash)}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex-1 flex flex-col">
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.income.receivedLiabilities")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.total")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(incomeData.receivedLiabilities.total)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.bank")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(incomeData.receivedLiabilities.bank)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.cash")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(incomeData.receivedLiabilities.cash)}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-3 rounded-lg border-2 border-green-300 dark:border-green-700 shadow-sm">
                      <Typography variant="small" color="blue-gray" className="font-semibold mb-1 dark:text-gray-300">
                        {t("reports.income.total")}
                      </Typography>
                      <Typography variant="h6" color="green" className="font-bold dark:text-green-300">
                        {formatNumber(incomeData.total)} {currency}
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Expenses Column */}
                <div className="flex flex-col h-full">
                  <div className="pb-2 border-b border-gray-200 dark:border-gray-700 mb-3">
                    <Typography variant="h6" color="blue-gray" className="font-bold dark:text-white">
                      {t("reports.expenses.title")}
                    </Typography>
                  </div>
                  
                  <div className="flex flex-col space-y-3 flex-1">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex-1 flex flex-col">
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.expenses.expenses")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.total")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(expenseData.expenses.total)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.bank")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(expenseData.expenses.bank)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.cash")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(expenseData.expenses.cash)}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex-1 flex flex-col">
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.expenses.returnedLiabilities")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.total")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(expenseData.returnedLiabilities.total)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.bank")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(expenseData.returnedLiabilities.bank)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.cash")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(expenseData.returnedLiabilities.cash)}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 p-3 rounded-lg border-2 border-red-300 dark:border-red-700 shadow-sm">
                      <Typography variant="small" color="blue-gray" className="font-semibold mb-1 dark:text-gray-300">
                        {t("reports.expenses.total")}
                      </Typography>
                      <Typography variant="h6" color="red" className="font-bold dark:text-red-300">
                        {formatNumber(expenseData.total)} {currency}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Balances and Financial Details Section */}
          <Card className="border border-red-600 dark:border-red-600 shadow-lg dark:bg-black bg-white">
            <CardBody className="p-4 dark:bg-black">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Column - Balances */}
                <div className="flex flex-col h-full">
                  <div className="pb-2 border-b border-gray-200 dark:border-gray-700 mb-3">
                    <Typography variant="h6" color="blue-gray" className="font-bold dark:text-white">
                      {t("reports.balances.title")}
                    </Typography>
                  </div>
                  
                  <div className="flex flex-col space-y-3 flex-1">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex-1 flex flex-col">
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.balances.totalDepositBalance")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.total")}
                          </Typography>
                          <Typography
                            variant="small"
                            color={balanceData.totalDepositBalance.total < 0 ? "red" : "blue-gray"}
                            className={`font-semibold ${balanceData.totalDepositBalance.total < 0 ? "dark:text-red-400" : "dark:text-gray-200"}`}
                          >
                            {formatNumber(balanceData.totalDepositBalance.total)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.bank")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(balanceData.totalDepositBalance.bank)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.cash")}
                          </Typography>
                          <Typography
                            variant="small"
                            color={balanceData.totalDepositBalance.cash < 0 ? "red" : "blue-gray"}
                            className={`font-semibold ${balanceData.totalDepositBalance.cash < 0 ? "dark:text-red-400" : "dark:text-gray-200"}`}
                          >
                            {formatNumber(balanceData.totalDepositBalance.cash)}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex-1 flex flex-col">
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.balances.depositWithdrawn")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.total")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(balanceData.depositWithdrawn.total)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.bank")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(balanceData.depositWithdrawn.bank)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.cash")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(balanceData.depositWithdrawn.cash)}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex-1 flex flex-col">
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.balances.previousMonthBalances")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.total")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(balanceData.previousMonthBalances.total)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.bank")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(balanceData.previousMonthBalances.bank)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.cash")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-200">
                            {formatNumber(balanceData.previousMonthBalances.total - balanceData.previousMonthBalances.bank)}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 flex-1 flex flex-col">
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.balances.currentMonthEndBalance")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 flex-1">
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.total")}
                          </Typography>
                          <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
                            {formatNumber(previousMonthData.currentMonthEndBalance.total)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.bank")}
                          </Typography>
                          <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
                            {formatNumber(previousMonthData.currentMonthEndBalance.bank)}
                          </Typography>
                        </div>
                        <div className="flex flex-col">
                          <Typography variant="small" color="blue-gray" className="text-xs opacity-70 dark:text-gray-400 mb-0.5">
                            {t("reports.common.cash")}
                          </Typography>
                          <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
                            {formatNumber(previousMonthData.currentMonthEndBalance.cash)}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Profit/Loss and Cash/Bank Flow */}
                <div className="flex flex-col h-full">
                  <div className="pb-2 border-b border-gray-200 dark:border-gray-700 mb-3">
                    <Typography variant="h6" color="blue-gray" className="font-bold dark:text-white">
                      {t("reports.profitLoss.title")}
                    </Typography>
                  </div>
                  
                  <div className="flex flex-col space-y-3 flex-1">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex-1 flex flex-col">
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.profitLoss.currentMonth")}
                      </Typography>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex justify-between items-center">
                          <Typography variant="small" color="blue-gray" className="dark:text-gray-400">
                            {t("reports.profitLoss.revenue")}
                          </Typography>
                          <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
                            {formatNumber(incomeData.total)}
                          </Typography>
                        </div>
                        <div className="flex justify-between items-center">
                          <Typography variant="small" color="blue-gray" className="dark:text-gray-400">
                            {t("reports.profitLoss.expense")}
                          </Typography>
                          <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
                            {formatNumber(expenseData.total)}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex-1 flex flex-col">
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.profitLoss.previousMonthPeriod")}
                      </Typography>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex justify-between items-center">
                          <Typography variant="small" color="blue-gray" className="dark:text-gray-400">
                            {t("reports.profitLoss.periodIncome")}
                          </Typography>
                          <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
                            {formatNumber(previousMonthData.income)}
                          </Typography>
                        </div>
                        <div className="flex justify-between items-center">
                          <Typography variant="small" color="blue-gray" className="dark:text-gray-400">
                            {t("reports.profitLoss.periodPaid")}
                          </Typography>
                          <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
                            {formatNumber(expenseData.total)}
                          </Typography>
                        </div>
                        <div className="flex justify-between items-center">
                          <Typography variant="small" color="blue-gray" className="dark:text-gray-400">
                            {t("reports.profitLoss.cashBankBalance")}
                          </Typography>
                          <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
                            {formatNumber(previousMonthData.currentMonthEndBalance.total)}
                          </Typography>
                        </div>
                        <div className="flex justify-between items-center">
                          <Typography variant="small" color="blue-gray" className="dark:text-gray-400">
                            {t("reports.profitLoss.centralDebt")}
                          </Typography>
                          <Typography variant="small" color="blue" className="font-semibold dark:text-blue-300">
                            {formatNumber(previousMonthData.centralDebt)}
                          </Typography>
                        </div>
                        <div className="flex justify-between items-center pt-1.5 border-t border-gray-200 dark:border-gray-700">
                          <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-300">
                            {t("reports.profitLoss.centralDebtValue")}
                          </Typography>
                          <Typography
                            variant="small"
                            color={previousMonthData.centralDebtValue < 0 ? "red" : "blue"}
                            className={`font-bold ${previousMonthData.centralDebtValue < 0 ? "dark:text-red-400" : "dark:text-blue-300"}`}
                          >
                            {formatNumber(previousMonthData.centralDebtValue)}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 flex-1 flex flex-col">
                      <Typography variant="small" color="blue-gray" className="mb-1 font-semibold dark:text-gray-300">
                        {t("reports.profitLoss.cashAndBank")}
                      </Typography>
                      <Typography variant="h6" color="blue" className="font-bold dark:text-blue-300">
                        {formatNumber(previousMonthData.currentMonthEndBalance.total)} {currency}
                      </Typography>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex-1 flex flex-col">
                      <Typography variant="small" color="blue-gray" className="mb-1 font-semibold dark:text-gray-300">
                        {t("reports.profitLoss.receivableFromMainOffice")}
                      </Typography>
                      <Typography variant="h6" color="blue" className="font-bold dark:text-blue-300">
                        {formatNumber(0.0)} {currency}
                      </Typography>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-3 rounded-lg border-2 border-blue-300 dark:border-blue-700 shadow-sm flex-1 flex flex-col">
                      <Typography variant="small" color="blue-gray" className="mb-1 font-semibold dark:text-gray-300">
                        {t("reports.profitLoss.totalAssets")}
                      </Typography>
                      <Typography variant="h6" color="blue" className="font-bold dark:text-blue-300">
                        {formatNumber(previousMonthData.currentMonthEndBalance.total)} {currency}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Residents Receivables Table */}
          <Card className="border border-red-600 dark:border-red-600 shadow-lg dark:bg-black bg-white">
            <CardBody className="p-4 dark:bg-black">
              <Typography variant="h6" color="blue-gray" className="mb-3 font-bold dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
                {t("reports.residentsReceivables.title")}
              </Typography>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900">
                      <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                        <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                          {t("reports.residentsReceivables.dateRange")}
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                        <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                          {t("reports.residentsReceivables.totalApartments")}
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                        <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                          {t("reports.residentsReceivables.indebtedApartments")}
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-left">
                        <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                          {t("reports.residentsReceivables.indebtedInvoices")}
                        </Typography>
                      </th>
                      <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-4 text-right">
                        <Typography variant="small" className="text-[11px] font-semibold uppercase text-blue-gray-500 dark:text-gray-400">
                          {t("reports.residentsReceivables.debtAmount")}
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {residentsReceivablesData.map((row, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0
                            ? "bg-white dark:bg-black"
                            : "bg-gray-50 dark:bg-black/50"
                        } hover:bg-blue-gray-50 dark:hover:bg-gray-800/70 transition-colors`}
                      >
                        <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                            {row.dateRange}
                          </Typography>
                        </td>
                        <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                            {row.totalApartments}
                          </Typography>
                        </td>
                        <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                            {row.indebtedApartments}
                          </Typography>
                        </td>
                        <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800">
                          <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300">
                            {row.indebtedInvoices}
                          </Typography>
                        </td>
                        <td className="py-3 px-4 border-b border-blue-gray-50 dark:border-gray-800 text-right">
                          <Typography variant="small" className="text-blue-600 dark:text-blue-400 font-semibold">
                            {formatNumber(row.debtAmount)} {currency}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;








