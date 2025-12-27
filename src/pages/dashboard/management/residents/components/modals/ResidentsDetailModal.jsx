import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ResidentsDetailModal({ open, onClose, resident, onEdit }) {
  const { t } = useTranslation();

  if (!open || !resident) return null;

  return (
    <Dialog open={open} handler={onClose} size="xl" className="dark:bg-gray-900" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:bg-gray-800 dark:text-white text-xl font-bold">
        {t("residents.detail.title")}
      </DialogHeader>
      <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[70vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                {t("residents.detail.fullName")}
              </Typography>
              <Typography variant="h6" className="text-blue-gray-900 dark:text-white font-bold">
                {resident.fullName}
              </Typography>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                {t("residents.detail.type")}
              </Typography>
              <Typography variant="h6" className="text-blue-gray-900 dark:text-white font-bold">
                {resident.type === "legal" ? t("residents.detail.legalEntity") : t("residents.detail.physicalPerson")}
              </Typography>
            </div>
          </div>

          {resident.type === "physical" && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <Typography variant="h6" className="text-blue-gray-900 dark:text-white font-bold mb-4">
                {t("residents.detail.physicalPersonInfo")}
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                    {t("residents.detail.fin")}
                  </Typography>
                  <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                    {resident.fin}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                    {t("residents.detail.birthDate")}
                  </Typography>
                  <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                    {resident.birthDate}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                    {t("residents.detail.gender")}
                  </Typography>
                  <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                    {resident.gender}
                  </Typography>
                </div>
              </div>
            </div>
          )}

          {resident.type === "legal" && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <Typography variant="h6" className="text-blue-gray-900 dark:text-white font-bold mb-4">
                {t("residents.detail.legalEntityInfo")}
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                    {t("residents.detail.voen")}
                  </Typography>
                  <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                    {resident.voen}
                  </Typography>
                </div>
                <div>
                  <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                    {t("residents.detail.registrationDate")}
                  </Typography>
                  <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                    {resident.registrationDate}
                  </Typography>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <Typography variant="h6" className="text-blue-gray-900 dark:text-white font-bold mb-4">
              {t("residents.detail.contactInfo")}
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                  {t("residents.detail.phone")}
                </Typography>
                <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                  {resident.phone}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                  {t("residents.detail.email")}
                </Typography>
                <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                  {resident.email}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                  {t("residents.detail.emergencyContact")}
                </Typography>
                <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                  {resident.emergencyContact}
                </Typography>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <Typography variant="h6" className="text-blue-gray-900 dark:text-white font-bold mb-4">
              {t("residents.detail.apartmentInfo")}
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                  {t("residents.detail.apartment")}
                </Typography>
                <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                  {resident.apartment}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                  {t("residents.detail.block")}
                </Typography>
                <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                  {resident.block}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                  {t("residents.detail.floor")}
                </Typography>
                <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                  {resident.floor}
                </Typography>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <Typography variant="h6" className="text-blue-gray-900 dark:text-white font-bold mb-4">
              {t("residents.detail.addressInfo")}
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                  {t("residents.detail.address")}
                </Typography>
                <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                  {resident.address}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                  {t("residents.detail.registrationAddress")}
                </Typography>
                <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                  {resident.registrationAddress}
                </Typography>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <Typography variant="h6" className="text-blue-gray-900 dark:text-white font-bold mb-4">
              {t("residents.detail.financialInfo")}
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                  {t("residents.detail.balance")}
                </Typography>
                <Typography
                  variant="paragraph"
                  className={`font-semibold ${
                    resident.balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {resident.balance >= 0 ? "+" : ""}
                  {resident.balance.toFixed(2)} AZN
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                  {t("residents.detail.paymentMethod")}
                </Typography>
                <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                  {resident.paymentMethod}
                </Typography>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <Typography variant="h6" className="text-blue-gray-900 dark:text-white font-bold mb-4">
              {t("residents.detail.otherInfo")}
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                  {t("residents.detail.status")}
                </Typography>
                <Typography
                  variant="paragraph"
                  className={`font-semibold ${
                    resident.status === "Aktiv" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {resident.status}
                </Typography>
              </div>
              <div>
                <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                  {t("residents.detail.joinDate")}
                </Typography>
                <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white font-semibold">
                  {resident.joinDate}
                </Typography>
              </div>
              {resident.notes && (
                <div className="md:col-span-2">
                  <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 mb-1">
                    {t("residents.detail.notes")}
                  </Typography>
                  <Typography variant="paragraph" className="text-blue-gray-900 dark:text-white">
                    {resident.notes}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("residents.detail.close")}
        </Button>
        <Button
          color="blue"
          onClick={() => {
            onClose();
            if (resident) onEdit(resident);
          }}
          className="dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {t("residents.detail.edit")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

