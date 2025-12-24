import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

const formatNumber = (num) => {
  return num.toLocaleString("az-AZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function BalancesProfitLossCard({ balanceData, previousMonthData, incomeData, expenseData, currency }) {
  const { t } = useTranslation();

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 bg-white">
      <CardBody className="p-4 dark:bg-gray-800">
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
  );
}

