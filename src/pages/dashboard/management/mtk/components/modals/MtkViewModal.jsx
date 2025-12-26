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
import { useTranslation } from "react-i18next";
import {
  InformationCircleIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  SwatchIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export function MtkViewModal({ open, onClose, mtk, onEdit }) {
  const { t } = useTranslation();

  if (!open || !mtk) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="xl"
      className="dark:bg-gray-900 border border-red-600 dark:border-gray-700"
      dismiss={{ enabled: false }}
    >
      <DialogHeader className="dark:bg-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center gap-2">
          <EyeIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
          <Typography variant="h5" className="font-bold">
            {t("mtk.view.title") || "MTK Məlumatları"}
          </Typography>
        </div>
      </DialogHeader>
      <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[75vh] overflow-y-auto">
        <div className="space-y-6 py-2">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("mtk.form.basicInfo")}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("mtk.form.name")}
                </Typography>
                <Typography variant="paragraph" className="font-semibold dark:text-white">
                  {mtk.name || <span className="text-gray-400 italic">{t("mtk.view.notProvided")}</span>}
                </Typography>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("mtk.form.status")}
                </Typography>
                <Chip
                  value={mtk.status === "active" ? t("mtk.form.active") : t("mtk.form.inactive")}
                  color={mtk.status === "active" ? "green" : "gray"}
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
                {t("mtk.form.metaInfo")}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("mtk.form.latitude")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white">
                  {mtk.meta?.lat ? mtk.meta.lat : <span className="text-gray-400 italic">{t("mtk.view.notProvided")}</span>}
                </Typography>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("mtk.form.longitude")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white">
                  {mtk.meta?.lng ? mtk.meta.lng : <span className="text-gray-400 italic">{t("mtk.view.notProvided")}</span>}
                </Typography>
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("mtk.form.description")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white min-h-[60px] p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  {mtk.meta?.desc ? mtk.meta.desc : <span className="text-gray-400 italic">{t("mtk.view.notProvided")}</span>}
                </Typography>
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  {t("mtk.form.address")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white">
                  {mtk.meta?.address ? mtk.meta.address : <span className="text-gray-400 italic">{t("mtk.view.notProvided")}</span>}
                </Typography>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              <EnvelopeIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              <Typography variant="h6" className="font-semibold dark:text-white">
                {t("mtk.form.contactInfo")}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  <EnvelopeIcon className="h-4 w-4 inline mr-1" />
                  {t("mtk.form.email")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white break-all">
                  {mtk.meta?.email ? (
                    <a
                      href={`mailto:${mtk.meta.email}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {mtk.meta.email}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">{t("mtk.view.notProvided")}</span>
                  )}
                </Typography>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  <PhoneIcon className="h-4 w-4 inline mr-1" />
                  {t("mtk.form.phone")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white">
                  {mtk.meta?.phone ? (
                    <a
                      href={`tel:${mtk.meta.phone}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {mtk.meta.phone}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">{t("mtk.view.notProvided")}</span>
                  )}
                </Typography>
              </div>

              <div className="md:col-span-2">
                <Typography variant="small" color="blue-gray" className="mb-1 font-medium dark:text-gray-400">
                  <GlobeAltIcon className="h-4 w-4 inline mr-1" />
                  {t("mtk.form.website")}
                </Typography>
                <Typography variant="paragraph" className="dark:text-white">
                  {mtk.meta?.website ? (
                    <a
                      href={mtk.meta.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                    >
                      {mtk.meta.website}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">{t("mtk.view.notProvided")}</span>
                  )}
                </Typography>
              </div>
            </div>
          </div>

          {/* Color Code Section */}
          {mtk.meta?.color_code && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <SwatchIcon className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                <Typography variant="h6" className="font-semibold dark:text-white">
                  {t("mtk.form.colorCode")}
                </Typography>
              </div>

              <div>
                <Typography variant="small" color="blue-gray" className="mb-2 font-medium dark:text-gray-400">
                  {t("mtk.form.enterColorCode")}
                </Typography>
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                    style={{ backgroundColor: mtk.meta.color_code }}
                    title={mtk.meta.color_code}
                  />
                  <Typography variant="paragraph" className="font-mono dark:text-white">
                    {mtk.meta.color_code}
                  </Typography>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-3 dark:bg-gray-800 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 min-w-[100px]"
        >
          {t("mtk.view.close") || t("mtk.filter.close")}
        </Button>
        {onEdit && (
          <Button
            color="blue"
            onClick={() => {
              onEdit(mtk);
              onClose();
            }}
            className="dark:bg-blue-600 dark:hover:bg-blue-700 min-w-[100px]"
          >
            {t("mtk.actions.edit")}
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
}

