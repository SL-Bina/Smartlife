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

const ReportsPage = () => {
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
      <div className="w-full bg-black my-4 p-4 rounded-lg shadow-lg mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold">
            Ümumi hesabat {startDate} - {endDate} ({currency})
          </h3>
          <div className="flex items-center gap-3">
            <Button
              variant="outlined"
              color="blue"
              className="flex items-center gap-2"
              onClick={handleExport}
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outlined" color="blue" onClick={() => setFilterOpen(true)}>
              Axtarış
            </Button>
          </div>
        </div>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm">
        <DialogHeader>Hesabat filter</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Başlanğıc tarix
            </Typography>
            <Input
              type="date"
              label="Daxil et"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Son tarix
            </Typography>
            <Input
              type="date"
              label="Daxil et"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              Valyuta
            </Typography>
            <Input
              label="Daxil et"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2">
          <Button variant="text" color="blue-gray" onClick={handleFilterClear}>
            Təmizlə
          </Button>
          <div className="flex gap-2">
            <Button variant="outlined" color="blue-gray" onClick={() => setFilterOpen(false)}>
              Bağla
            </Button>
            <Button color="blue" onClick={handleFilterApply}>
              Tətbiq et
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <Spinner className="h-6 w-6" />
          <Typography variant="small" className="mt-2 text-blue-gray-400">
            Yüklənir...
          </Typography>
        </div>
      ) : (
        <>
          {/* Income and Expenses Section */}
          <Card className="border border-red-500 shadow-sm mb-6">
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Income Column */}
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4 font-bold">
                    MƏDAXİL
                  </Typography>
                  
                  <div className="space-y-3">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
                        MƏDAXİL (FAKTURA ÜZRƏ)
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <Typography variant="small" color="blue-gray">
                          Ümumi: {formatNumber(incomeData.invoice.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Bank: {formatNumber(incomeData.invoice.bank)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Nağd: {formatNumber(incomeData.invoice.cash)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
                        DEPOZİT
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <Typography variant="small" color="blue-gray">
                          Ümumi: {formatNumber(incomeData.deposit.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Bank: {formatNumber(incomeData.deposit.bank)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Nağd: {formatNumber(incomeData.deposit.cash)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
                        ALINAN ÖHDƏLİKLƏR
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <Typography variant="small" color="blue-gray">
                          Ümumi: {formatNumber(incomeData.receivedLiabilities.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Bank: {formatNumber(incomeData.receivedLiabilities.bank)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Nağd: {formatNumber(incomeData.receivedLiabilities.cash)}
                        </Typography>
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded mt-4">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        TOPLAM MƏDAXİL
                      </Typography>
                      <Typography variant="h6" color="green" className="font-bold">
                        {formatNumber(incomeData.total)}
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Expenses Column */}
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4 font-bold">
                    XƏRCLƏR
                  </Typography>
                  
                  <div className="space-y-3">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
                        XƏRCLƏR
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <Typography variant="small" color="blue-gray">
                          Ümumi: {formatNumber(expenseData.expenses.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Bank: {formatNumber(expenseData.expenses.bank)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Nağd: {formatNumber(expenseData.expenses.cash)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
                        QAYTARILAN ÖHDƏLİKLƏR
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <Typography variant="small" color="blue-gray">
                          Ümumi: {formatNumber(expenseData.returnedLiabilities.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Bank: {formatNumber(expenseData.returnedLiabilities.bank)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Nağd: {formatNumber(expenseData.returnedLiabilities.cash)}
                        </Typography>
                      </div>
                    </div>

                    <div className="bg-red-50 p-3 rounded mt-4">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        TOPLAM MƏXARİC
                      </Typography>
                      <Typography variant="h6" color="red" className="font-bold">
                        {formatNumber(expenseData.total)}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Balances and Financial Details Section */}
          <Card className="border border-red-500 shadow-sm">
            <CardBody className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Balances */}
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4 font-bold">
                    Balanslar
                  </Typography>
                  
                  <div className="space-y-4">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
                        ÜMUMI DEPOZIT QALIĞI
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <Typography
                          variant="small"
                          color={balanceData.totalDepositBalance.total < 0 ? "red" : "blue-gray"}
                        >
                          Ümumi: {formatNumber(balanceData.totalDepositBalance.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Bank: {formatNumber(balanceData.totalDepositBalance.bank)}
                        </Typography>
                        <Typography
                          variant="small"
                          color={balanceData.totalDepositBalance.cash < 0 ? "red" : "blue-gray"}
                        >
                          Nağd: {formatNumber(balanceData.totalDepositBalance.cash)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
                        MÜŞTƏRİ BORCUNDAN ÇIXILAN DEPOZİT (Tarix aralığına görə)
                      </Typography>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <Typography variant="small" color="blue-gray">
                          Ümumi: {formatNumber(balanceData.depositWithdrawn.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Bank: {formatNumber(balanceData.depositWithdrawn.bank)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Nağd: {formatNumber(balanceData.depositWithdrawn.cash)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
                        ÖNCƏKİ AY QALIQLARI
                      </Typography>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <Typography variant="small" color="blue-gray">
                          Ümumi: {formatNumber(balanceData.previousMonthBalances.total)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Bank: {formatNumber(balanceData.previousMonthBalances.bank)}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Profit/Loss and Cash/Bank Flow */}
                <div>
                  <Typography variant="h6" color="blue-gray" className="mb-4 font-bold">
                    Mənfəət / Zərər və Kassa / Bank
                  </Typography>
                  
                  <div className="space-y-4">
                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
                        CARİ AY MƏNFƏƏT / -ZƏRƏR
                      </Typography>
                      <div className="space-y-1 text-sm">
                        <Typography variant="small" color="blue-gray">
                          Gəlir: {formatNumber(profitLossData.revenue)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          Xərc: {formatNumber(profitLossData.expense)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
                        ÖNCƏKİ AY DÖVR (KASSA VƏ BANK)
                      </Typography>
                      <div className="space-y-1 text-sm">
                        <Typography variant="small" color="blue-gray">
                          DÖVR İÇİ MƏDAXİL: {formatNumber(previousMonthData.income)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          DÖVR İÇİ ÖDƏNƏN: {formatNumber(previousMonthData.paid)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          KASSA VƏ BANK QALIĞI: {formatNumber(previousMonthData.cashBankBalance)}
                        </Typography>
                        <Typography variant="small" color="blue-gray">
                          MƏRKƏZİN BORCU-(Alacağı): {formatNumber(previousMonthData.centralDebt)}
                        </Typography>
                        <Typography
                          variant="small"
                          color={previousMonthData.centralDebtValue < 0 ? "red" : "blue-gray"}
                        >
                          {formatNumber(previousMonthData.centralDebtValue)}
                        </Typography>
                      </div>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
                        KASSA VƏ BANK
                      </Typography>
                      <Typography variant="h6" color="blue-gray" className="font-bold">
                        {formatNumber(previousMonthData.cashBankBalance)}
                      </Typography>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
                        BAŞ OFİSDƏN ALACAQ
                      </Typography>
                      <Typography variant="h6" color="blue-gray" className="font-bold">
                        {formatNumber(0.0)}
                      </Typography>
                    </div>

                    <div>
                      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
                        TOPLAM AKTİV
                      </Typography>
                      <Typography variant="h6" color="blue-gray" className="font-bold">
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

