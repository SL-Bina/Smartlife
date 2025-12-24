import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

const formatNumber = (num) => {
  return num.toLocaleString("az-AZ", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function IncomeExpensesCard({ incomeData, expenseData, currency }) {
  const { t } = useTranslation();

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 bg-white">
      <CardBody className="p-4 dark:bg-gray-800">
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
  );
}

