import React, { useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Checkbox,
  Select,
  Option,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import {
  BuildingOfficeIcon,
  RectangleStackIcon,
  HomeModernIcon,
  BellIcon,
} from "@heroicons/react/24/solid";

const SendNotificationPage = () => {
  const { t } = useTranslation();
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedApartment, setSelectedApartment] = useState("");
  const [notificationType, setNotificationType] = useState({
    internal: true,
    sms: false,
  });
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    // Handle form submission
    console.log({
      building: selectedBuilding,
      block: selectedBlock,
      apartment: selectedApartment,
      type: notificationType,
      title,
      message,
    });
  };

  return (
    <div className="mt-12 mb-8">
      <Card className="border border-red-600 dark:border-red-600 shadow-sm dark:bg-black">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 p-6 dark:bg-black"
        >
          <div className="flex items-center gap-2">
            <BellIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <Typography variant="h6" color="blue-gray" className="dark:text-white">
              {t("notifications.send.pageTitle")}
            </Typography>
          </div>
          <Typography
            variant="small"
            className="font-normal text-blue-gray-500 dark:text-gray-400 mt-1"
          >
            {t("notifications.send.pageSubtitle")}
          </Typography>
        </CardHeader>
        <CardBody className="px-6 pb-6 dark:bg-black space-y-6">
          {/* Müvafiq xanaları seçin */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-4 dark:text-gray-300">
              {t("notifications.send.selectFields")} <span className="text-red-500">*</span>
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Bina */}
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 dark:from-purple-600 dark:to-purple-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="h6" className="text-white font-bold">
                      {t("notifications.send.building")}
                    </Typography>
                    <Typography variant="small" className="text-white/80">
                      {t("notifications.send.residentialBuilding")}
                    </Typography>
                  </div>
                </div>
                <Select
                  label={t("notifications.send.select")}
                  value={selectedBuilding}
                  onChange={(val) => setSelectedBuilding(val)}
                  className="bg-white dark:bg-gray-800"
                >
                  <Option value="1">Bina 1</Option>
                  <Option value="2">Bina 2</Option>
                </Select>
              </Card>

              {/* Blok */}
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 dark:from-orange-600 dark:to-orange-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <RectangleStackIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="h6" className="text-white font-bold">
                      {t("notifications.send.block")}
                    </Typography>
                    <Typography variant="small" className="text-white/80">
                      {t("notifications.send.buildingBlock")}
                    </Typography>
                  </div>
                </div>
                <Select
                  label={t("notifications.send.select")}
                  value={selectedBlock}
                  onChange={(val) => setSelectedBlock(val)}
                  className="bg-white dark:bg-gray-800"
                >
                  <Option value="1">Blok A</Option>
                  <Option value="2">Blok B</Option>
                </Select>
              </Card>

              {/* Mənzil */}
              <Card className="bg-gradient-to-br from-green-500 to-green-600 p-4 dark:from-green-600 dark:to-green-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <HomeModernIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <Typography variant="h6" className="text-white font-bold">
                      {t("notifications.send.apartment")}
                    </Typography>
                    <Typography variant="small" className="text-white/80">
                      {t("notifications.send.residentialApartment")}
                    </Typography>
                  </div>
                </div>
                <Select
                  label={t("notifications.send.select")}
                  value={selectedApartment}
                  onChange={(val) => setSelectedApartment(val)}
                  className="bg-white dark:bg-gray-800"
                >
                  <Option value="1">Mənzil 101</Option>
                  <Option value="2">Mənzil 102</Option>
                </Select>
              </Card>
            </div>
          </div>

          {/* Bildiriş növü */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 dark:text-gray-300">
              {t("notifications.send.notificationType")}
            </Typography>
            <div className="flex gap-4">
              <Checkbox
                label={t("notifications.send.internal")}
                checked={notificationType.internal}
                onChange={(e) =>
                  setNotificationType({ ...notificationType, internal: e.target.checked })
                }
                className="dark:text-white"
              />
              <Checkbox
                label="SMS"
                checked={notificationType.sms}
                onChange={(e) =>
                  setNotificationType({ ...notificationType, sms: e.target.checked })
                }
                className="dark:text-white"
              />
            </div>
          </div>

          {/* Başlıq */}
          <div>
            <Input
              label={t("notifications.send.title")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>

          {/* Mesaj */}
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 dark:text-gray-300">
              {t("notifications.send.message")}
            </Typography>
            <textarea
              placeholder={t("notifications.send.message")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-blue-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              color="blue"
              onClick={handleSubmit}
              className="dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {t("notifications.send.sendButton")}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SendNotificationPage;

