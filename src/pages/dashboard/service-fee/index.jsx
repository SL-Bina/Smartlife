import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Spinner,
  Chip,
} from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

// Mock data - real app-də API-dən gələcək
const apartmentData = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  number: `Mənzil ${index + 1}`,
  block: `Blok ${String.fromCharCode(65 + (index % 5))}`,
  floor: (index % 16) + 1,
  area: 60 + (index % 10) * 5,
  resident: `Sakin ${index + 1}`,
  serviceFee: 20 + (index % 6) * 2,
  complex: `Kompleks ${Math.floor(index / 10) + 1}`,
  building: `Bina ${Math.floor(index / 5) + 1}`,
}));

// Servis haqqı tarixçəsi mock data
const feeHistoryData = [
  {
    id: 1,
    date: "2024-01-15",
    amount: 18,
    changedBy: "Admin",
    reason: "İlkin təyin",
  },
  {
    id: 2,
    date: "2024-03-20",
    amount: 20,
    changedBy: "Admin",
    reason: "Tarif artımı",
  },
  {
    id: 3,
    date: "2024-06-10",
    amount: 22,
    changedBy: "Admin",
    reason: "Tarif artımı",
  },
];

const PropertyServiceFeePage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [feeValue, setFeeValue] = useState("");
  const [apartment, setApartment] = useState(null);
  const [saving, setSaving] = useState(false);
  const [feeHistory, setFeeHistory] = useState([]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    // Simulate API call
    const timer = setTimeout(() => {
      const apt = apartmentData.find((a) => a.id === parseInt(id)) || {
        id: parseInt(id),
        number: `Mənzil ${id}`,
        block: "Blok A",
        floor: 1,
        area: 60,
        resident: `Sakin ${id}`,
        serviceFee: 20,
        complex: "Kompleks 1",
        building: "Bina 1",
      };
      setApartment(apt);
      setFeeValue(String(apt.serviceFee ?? ""));
      // Tarixçəni da yüklə
      setFeeHistory(feeHistoryData);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [id]);

  const handleSave = async () => {
    if (!feeValue || parseFloat(feeValue) <= 0) {
      alert(t("serviceFee.invalidFee"));
      return;
    }

    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      // Yeni tarixçə qeydi əlavə et
      const newHistoryEntry = {
        id: feeHistory.length + 1,
        date: new Date().toISOString().split("T")[0],
        amount: parseFloat(feeValue),
        changedBy: "Admin",
        reason: t("serviceFee.reasons.manualChange"),
      };
      setFeeHistory([newHistoryEntry, ...feeHistory]);
      setApartment({ ...apartment, serviceFee: parseFloat(feeValue) });
      setSaving(false);
      alert(t("serviceFee.successMessage"));
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
        <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
          {t("serviceFee.loading")}
        </Typography>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Typography variant="h6" color="blue-gray" className="dark:text-white">
          {t("serviceFee.notFound")}
        </Typography>
        <Button
          variant="text"
          color="blue"
          onClick={() => navigate("/dashboard/properties")}
          className="mt-4 dark:text-blue-400 dark:hover:bg-blue-900/20"
        >
          {t("serviceFee.goBack")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black dark:bg-gray-900 my-4 p-4 rounded-lg shadow-lg mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="text"
            color="white"
            className="p-2 dark:text-white dark:hover:bg-gray-800"
            onClick={() => navigate("/dashboard/properties")}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <h3 className="text-white font-bold">
            {t("serviceFee.pageTitle")} - {apartment?.number}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol tərəf - Mənzil məlumatları və form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mənzil məlumatları */}
          <Card className="border border-red-500 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 p-6 border-b border-blue-gray-100 dark:border-gray-700 dark:bg-gray-800"
            >
              <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-white">
                {t("serviceFee.apartmentInfo")}
              </Typography>
            </CardHeader>
            <CardBody className="px-6 py-6 dark:bg-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                    {t("serviceFee.labels.apartment")}
                  </Typography>
                  <Typography variant="paragraph" color="blue-gray" className="font-semibold dark:text-white">
                    {apartment?.number}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                    {t("serviceFee.labels.block")}
                  </Typography>
                  <Typography variant="paragraph" color="blue-gray" className="font-semibold dark:text-white">
                    {apartment?.block}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                    {t("serviceFee.labels.floor")}
                  </Typography>
                  <Typography variant="paragraph" color="blue-gray" className="font-semibold dark:text-white">
                    {apartment?.floor}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                    {t("serviceFee.labels.area")}
                  </Typography>
                  <Typography variant="paragraph" color="blue-gray" className="font-semibold dark:text-white">
                    {apartment?.area} m²
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                    {t("serviceFee.labels.resident")}
                  </Typography>
                  <Typography variant="paragraph" color="blue-gray" className="font-semibold dark:text-white">
                    {apartment?.resident}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                    {t("serviceFee.labels.complex")}
                  </Typography>
                  <Typography variant="paragraph" color="blue-gray" className="font-semibold dark:text-white">
                    {apartment?.complex}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                    {t("serviceFee.labels.building")}
                  </Typography>
                  <Typography variant="paragraph" color="blue-gray" className="font-semibold dark:text-white">
                    {apartment?.building}
                  </Typography>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Servis haqqı form */}
          <Card className="border border-red-500 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 p-6 border-b border-blue-gray-100 dark:border-gray-700 dark:bg-gray-800"
            >
              <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-white">
                {t("serviceFee.serviceFeeTitle")}
              </Typography>
            </CardHeader>
            <CardBody className="px-6 py-6 dark:bg-gray-800">
              <div className="max-w-md">
                <div className="mb-6">
                  <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-400">
                    {t("serviceFee.serviceFeePerMonth")}
                  </Typography>
                  <Input
                    type="number"
                    label={t("serviceFee.enterFee")}
                    value={feeValue}
                    onChange={(e) => setFeeValue(e.target.value)}
                    className="mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    labelProps={{ className: "dark:text-gray-400" }}
                    min="0"
                    step="0.01"
                  />
                  <Typography variant="small" className="text-blue-gray-400 dark:text-gray-400">
                    {t("serviceFee.currentFee")}: <span className="font-semibold text-blue-gray-700 dark:text-blue-300">{apartment?.serviceFee} AZN</span>
                  </Typography>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outlined" 
                    color="blue-gray" 
                    onClick={() => navigate("/dashboard/properties")}
                    disabled={saving}
                    className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:text-gray-600"
                  >
                    {t("serviceFee.cancel")}
                  </Button>
                  <Button 
                    color="blue" 
                    onClick={handleSave}
                    disabled={saving || !feeValue || parseFloat(feeValue) <= 0}
                    className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:text-gray-600"
                  >
                    {saving ? t("serviceFee.saving") : t("serviceFee.save")}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sağ tərəf - Tarixçə */}
        <div className="lg:col-span-1">
          <Card className="border border-red-500 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 p-6 border-b border-blue-gray-100 dark:border-gray-700 dark:bg-gray-800"
            >
              <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-white">
                {t("serviceFee.changeHistory")}
              </Typography>
            </CardHeader>
            <CardBody className="px-6 py-6 dark:bg-gray-800">
              {feeHistory.length === 0 ? (
                <Typography variant="small" color="blue-gray" className="text-center py-4 dark:text-gray-400">
                  {t("serviceFee.noHistory")}
                </Typography>
              ) : (
                <div className="space-y-4">
                  {feeHistory.map((item, index) => (
                    <div
                      key={item.id}
                      className={`pb-4 ${
                        index !== feeHistory.length - 1 ? "border-b border-blue-gray-100 dark:border-gray-700" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Typography variant="small" className="font-semibold text-blue-gray-700 dark:text-blue-300">
                          {item.amount} AZN
                        </Typography>
                        <Chip
                          value={index === 0 ? t("serviceFee.current") : t("serviceFee.old")}
                          size="sm"
                          color={index === 0 ? "green" : "gray"}
                          variant="ghost"
                          className="dark:bg-gray-700 dark:text-gray-300"
                        />
                      </div>
                      <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                        {new Date(item.date).toLocaleDateString("az-AZ", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-400 dark:text-gray-400">
                        {item.reason}
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-400 dark:text-gray-500 text-xs mt-1">
                        {t("serviceFee.changedBy")}: {item.changedBy}
                      </Typography>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyServiceFeePage;

