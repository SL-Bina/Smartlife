import React from "react";
import { Card, CardHeader, CardBody, Typography, Input, Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export function ServiceFeeFormCard({ apartment, feeValue, onFeeChange, onSave, saving }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!apartment) return null;

  const isValid = feeValue && parseFloat(feeValue) > 0;

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 p-6 border-b border-red-600 dark:border-gray-700 dark:bg-gray-800"
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
              onChange={(e) => onFeeChange(e.target.value)}
              className="mb-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              labelProps={{ className: "dark:text-gray-400" }}
              min="0"
              step="0.01"
            />
            <Typography variant="small" className="text-blue-gray-400 dark:text-gray-400">
              {t("serviceFee.currentFee")}: <span className="font-semibold text-blue-gray-700 dark:text-blue-300">{apartment.serviceFee} AZN</span>
            </Typography>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              color="blue-gray"
              onClick={() => navigate("/dashboard/management/properties")}
              disabled={saving}
              className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:disabled:text-gray-600"
            >
              {t("serviceFee.cancel")}
            </Button>
            <Button
              color="blue"
              onClick={onSave}
              disabled={saving || !isValid}
              className="dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:text-gray-600"
            >
              {saving ? t("serviceFee.saving") : t("serviceFee.save")}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

