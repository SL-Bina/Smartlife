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
  const [currency, setCurrency] = useState("AZN");

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
    invoice: { total: 1004.0, bank: 0.0, cash: 1004.0 },
    deposit: { total: 14.0, bank: 0.0, cash: 14.0 },
    receivedLiabilities: { total: 0.0, bank: 0.0, cash: 0.0 },
    total: 1018.0,
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
    cashBankBalance: 329.0,
    centralDebt: 2333.55,
    centralDebtValue: -90.0,
  };

  const formatNumber = (num) => {
    return num.toLocaleString("az-AZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="">
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black dark:bg-gray-900 my-4 p-4 rounded-lg shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold">
            {t("reports.pageTitle")} {startDate} - {endDate} ({currency})
          </h3>
          <div className="flex items-center gap-3">
            <Button
              variant="outlined"
              color="blue"
              className="flex items-center gap-2 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-600/20"
              onClick={handleExport}
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              {t("reports.actions.export")}
            </Button>
            <Button variant="outlined" color="blue" onClick={() => setFilterOpen(true)} className="dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-600/20">
              {t("reports.actions.search")}
            </Button>
          </div>
        </div>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm" className="dark:bg-gray-800">
        <DialogHeader className="dark:text-white">{t("reports.filter.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("reports.filter.startDate")}
            </Typography>
            <Input
              type="date"
              label={t("reports.filter.enter")}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("reports.filter.endDate")}
            </Typography>
            <Input
              type="date"
              label={t("reports.filter.enter")}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("reports.filter.currency")}
            </Typography>
            <Input
              label={t("reports.filter.enter")}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="text" color="blue-gray" onClick={handleFilterClear} className="dark:text-gray-300 dark:hover:bg-gray-700">
            {t("buttons.clear")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outlined" color="blue-gray" onClick={() => setFilterOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
              {t("buttons.cancel")}
            </Button>
            <Button color="blue" onClick={handleFilterApply} className="dark:bg-blue-600 dark:hover:bg-blue-700">
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
        <>
          {/* Income and Expenses Section */}
          <Card className="border border-red-500 shadow-sm mb-6 dark:bg-gray-800 dark:border-gray-700">
            <CardBody className="p-6 dark:bg-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Income Column */}
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4 font-bold dark:text-white">
                    {t("reports.income.title")}
                  </Typography>
                  
                  <div className="space-y-3">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.income.invoice")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.total")}: {formatNumber(incomeData.invoice.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.bank")}: {formatNumber(incomeData.invoice.bank)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.cash")}: {formatNumber(incomeData.invoice.cash)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.income.deposit")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.total")}: {formatNumber(incomeData.deposit.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.bank")}: {formatNumber(incomeData.deposit.bank)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.cash")}: {formatNumber(incomeData.deposit.cash)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.income.receivedLiabilities")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.total")}: {formatNumber(incomeData.receivedLiabilities.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.bank")}: {formatNumber(incomeData.receivedLiabilities.bank)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.cash")}: {formatNumber(incomeData.receivedLiabilities.cash)}
                        </Typography>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded mt-4">
                      <Typography variant="small" color="blue-gray" className="font-bold dark:text-gray-300">
                        {t("reports.income.total")}
                      </Typography>
                      <Typography variant="h6" color="green" className="font-bold dark:text-green-300">
                        {formatNumber(incomeData.total)}
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Expenses Column */}
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4 font-bold dark:text-white">
                    {t("reports.expenses.title")}
                  </Typography>
                  
                  <div className="space-y-3">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.expenses.expenses")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.total")}: {formatNumber(expenseData.expenses.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.bank")}: {formatNumber(expenseData.expenses.bank)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.cash")}: {formatNumber(expenseData.expenses.cash)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.expenses.returnedLiabilities")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.total")}: {formatNumber(expenseData.returnedLiabilities.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.bank")}: {formatNumber(expenseData.returnedLiabilities.bank)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.cash")}: {formatNumber(expenseData.returnedLiabilities.cash)}
                        </Typography>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded mt-4">
                      <Typography variant="small" color="blue-gray" className="font-bold dark:text-gray-300">
                        {t("reports.expenses.total")}
                      </Typography>
                      <Typography variant="h6" color="red" className="font-bold dark:text-red-300">
                        {formatNumber(expenseData.total)}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Balances and Financial Details Section */}
          <Card className="border border-red-500 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <CardBody className="p-6 dark:bg-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Balances */}
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4 font-bold dark:text-white">
                    {t("reports.balances.title")}
                  </Typography>
                  
                  <div className="space-y-4">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.balances.totalDepositBalance")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <Typography
                          variant="small"
                          color={balanceData.totalDepositBalance.total < 0 ? "red" : "blue-gray"}
                          className={balanceData.totalDepositBalance.total < 0 ? "dark:text-red-400" : "dark:text-gray-300"}
                        >
                          {t("reports.common.total")}: {formatNumber(balanceData.totalDepositBalance.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.bank")}: {formatNumber(balanceData.totalDepositBalance.bank)}
                        </Typography>
                        <Typography
                          variant="small"
                          color={balanceData.totalDepositBalance.cash < 0 ? "red" : "blue-gray"}
                          className={balanceData.totalDepositBalance.cash < 0 ? "dark:text-red-400" : "dark:text-gray-300"}
                        >
                          {t("reports.common.cash")}: {formatNumber(balanceData.totalDepositBalance.cash)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.balances.depositWithdrawn")}
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.total")}: {formatNumber(balanceData.depositWithdrawn.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.bank")}: {formatNumber(balanceData.depositWithdrawn.bank)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.cash")}: {formatNumber(balanceData.depositWithdrawn.cash)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.balances.previousMonthBalances")}
                      </Typography>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.total")}: {formatNumber(balanceData.previousMonthBalances.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.common.bank")}: {formatNumber(balanceData.previousMonthBalances.bank)}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Profit/Loss and Cash/Bank Flow */}
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4 font-bold dark:text-white">
                    {t("reports.profitLoss.title")}
                  </Typography>
                  
                  <div className="space-y-4">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.profitLoss.currentMonth")}
                      </Typography>
                      <div className="space-y-1 text-sm">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.profitLoss.revenue")}: {formatNumber(profitLossData.revenue)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.profitLoss.expense")}: {formatNumber(profitLossData.expense)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.profitLoss.previousMonthPeriod")}
                      </Typography>
                      <div className="space-y-1 text-sm">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.profitLoss.periodIncome")}: {formatNumber(previousMonthData.income)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.profitLoss.periodPaid")}: {formatNumber(previousMonthData.paid)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.profitLoss.cashBankBalance")}: {formatNumber(previousMonthData.cashBankBalance)}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {t("reports.profitLoss.centralDebt")}: {formatNumber(previousMonthData.centralDebt)}
                        </Typography>
                        <Typography
                          variant="small"
                          color={previousMonthData.centralDebtValue < 0 ? "red" : "blue-gray"}
                          className={previousMonthData.centralDebtValue < 0 ? "dark:text-red-400" : "dark:text-gray-300"}
                        >
                          {formatNumber(previousMonthData.centralDebtValue)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.profitLoss.cashAndBank")}
                      </Typography>
                      <Typography variant="h6" color="blue-gray" className="font-bold dark:text-white">
                        {formatNumber(previousMonthData.cashBankBalance)}
                      </Typography>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.profitLoss.receivableFromMainOffice")}
                      </Typography>
                      <Typography variant="h6" color="blue-gray" className="font-bold dark:text-white">
                        {formatNumber(0.0)}
                      </Typography>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                        {t("reports.profitLoss.totalAssets")}
                      </Typography>
                      <Typography variant="h6" color="blue-gray" className="font-bold dark:text-white">
                        {formatNumber(previousMonthData.centralDebt)}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
};

export default ReportsPage;

