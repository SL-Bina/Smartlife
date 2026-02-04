import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Chip,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  InformationCircleIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  SwatchIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ComplexViewModal({ open, onClose, complex, onEdit }) {
  const { t } = useTranslation();

  if (!open || !complex) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="xl"
      className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3">
          <EyeIcon className="h-5 w-5 text-blue-500" />
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            {t("complexes.view.title") || "Kompleks məlumatları"}
          </Typography>
        </div>
        <div
          className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={onClose}
        >
          <XMarkIcon className="h-5 w-5 dark:text-white cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[75vh] overflow-y-auto">
        <div className="space-y-6 py-2">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("complexes.form.basicInfo") || "Əsas Məlumatlar"}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("complexes.form.name")}
                </Typography>
                <Typography variant="paragraph" className="font-semibold dark:text-white">
                  {complex.name || <span className="text-gray-400 italic">{t("complexes.view.notProvided")}</span>}
                </Typography>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("complexes.form.status")}
                </Typography>
                <Chip
                  value={complex.status === "active" ? t("complexes.form.active") : t("complexes.form.inactive")}
                  color={complex.status === "active" ? "green" : "gray"}
                  className="w-fit"
                />
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <MapPinIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("complexes.form.metaInfo")}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("complexes.form.latitude")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white">
                  {complex.meta?.lat ? complex.meta.lat : <span className="text-gray-400 italic">{t("complexes.view.notProvided")}</span>}
                </Typography>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("complexes.form.longitude")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white">
                  {complex.meta?.lng ? complex.meta.lng : <span className="text-gray-400 italic">{t("complexes.view.notProvided")}</span>}
                </Typography>
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("complexes.form.description")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white min-h-[60px] p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  {complex.meta?.desc ? complex.meta.desc : <span className="text-gray-400 italic">{t("complexes.view.notProvided")}</span>}
                </Typography>
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("complexes.form.address")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white">
                  {complex.meta?.address ? complex.meta.address : <span className="text-gray-400 italic">{t("complexes.view.notProvided")}</span>}
                </Typography>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <EnvelopeIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("complexes.form.contactInfo")}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                  {t("complexes.form.email")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white break-all">
                  {complex.meta?.email ? (
                    <a
                      href={`mailto:${complex.meta.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {complex.meta.email}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">{t("complexes.view.notProvided")}</span>
                  )}
                </Typography>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  <PhoneIcon className="h-4 w-4 inline mr-1" />
                  {t("complexes.form.phone")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white">
                  {complex.meta?.phone ? (
                    <a
                      href={`tel:${complex.meta.phone}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {complex.meta.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">{t("complexes.view.notProvided")}</span>
                  )}
                </Typography>
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  <GlobeAltIcon className="h-4 w-4 inline mr-1" />
                  {t("complexes.form.website")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white">
                  {complex.meta?.website ? (
                    <a
                      href={complex.meta.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                    >
                      {complex.meta.website}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">{t("complexes.view.notProvided")}</span>
                  )}
                </Typography>
              </div>
            </div>
          </div>

          {/* Color Code Section */}
          {complex.meta?.color_code && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <SwatchIcon className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                <Typography variant="h6" className="font-semibold dark:text-white">
                  {t("complexes.form.colorCode")}
                </Typography>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-400">
                  {t("complexes.form.enterColorCode")}
                </Typography>
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                    style={{ backgroundColor: complex.meta.color_code }}
                    title={complex.meta.color_code}
                  />
                  <Typography variant="paragraph" className="font-mono dark:text-white">
                    {complex.meta.color_code}
                  </Typography>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-3 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 min-w-[100px]"
        >
          {t("complexes.view.close") || "Bağla"}
        </Button>
        {onEdit && (
          <Button
            color="blue"
            onClick={() => {
              onEdit(complex);
              onClose();
            }}
            className="dark:bg-blue-600 dark:hover:bg-blue-700 min-w-[100px]"
          >
            {t("complexes.actions.edit")}
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
}
