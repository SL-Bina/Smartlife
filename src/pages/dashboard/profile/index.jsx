import React, { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Input,
  Button,
  Chip,
} from "@material-tailwind/react";
import {
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    firstName: "Smart",
    lastName: "Lıfe",
    birthDate: "1990-01-01",
    address: "Baku",
    phone: "0123456789",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePersonalInfoChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePersonalInfo = () => {
    // Save personal information
    console.log("Saving personal info:", formData);
  };

  const handleSavePassword = () => {
    // Save password
    console.log("Saving password");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="">
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black dark:bg-gray-900 my-4 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-white font-bold">{t("profile.pageTitle")}</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - User Information */}
        <Card className="border border-red-500 shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <CardBody className="p-6 dark:bg-gray-800">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 text-2xl font-bold">
                  R
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 dark:bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <Typography variant="h5" color="blue-gray" className="mb-4 font-bold dark:text-white">
                Test User
              </Typography>
              
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="h-5 w-5 text-blue-gray-400 dark:text-gray-400" />
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    admin@mail.az
                  </Typography>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 text-blue-gray-400 dark:text-gray-400" />
                  <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                    {formData.phone}
                  </Typography>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-gray-100 dark:border-gray-700">
                  <Chip
                    value="West"
                    color="green"
                    icon={<HomeIcon className="h-4 w-4" />}
                    className="w-full justify-start dark:bg-green-900/20 dark:text-green-300"
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Right Panel - Personal Information Editing */}
        <div className="lg:col-span-2">
          <Card className="border border-red-500 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <CardBody className="p-6 dark:bg-gray-800">
              <Tabs value={activeTab} className="overflow-visible">
                <TabsHeader className="rounded-none border-b border-blue-gray-100 dark:border-gray-700 bg-transparent p-0">
                  <Tab
                    value="personal"
                    onClick={() => setActiveTab("personal")}
                    className={
                      activeTab === "personal"
                        ? "border-b-2 border-blue-500 text-blue-500 dark:text-blue-400"
                        : "dark:text-gray-400"
                    }
                  >
                    {t("profile.personalInfo")}
                  </Tab>
                  <Tab
                    value="password"
                    onClick={() => setActiveTab("password")}
                    className={
                      activeTab === "password"
                        ? "border-b-2 border-blue-500 text-blue-500 dark:text-blue-400"
                        : "dark:text-gray-400"
                    }
                  >
                    {t("profile.password")}
                  </Tab>
                </TabsHeader>
                <TabsBody className="mt-6">
                  <TabPanel value="personal" className="p-0">
                    <Typography variant="h6" color="blue-gray" className="mb-6 font-bold dark:text-white">
                      {t("profile.personalInfo")}
                    </Typography>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                            {t("profile.firstName")}
                          </Typography>
                          <Input
                            label={t("profile.enter")}
                            value={formData.firstName}
                            onChange={(e) =>
                              handlePersonalInfoChange("firstName", e.target.value)
                            }
                            className="dark:text-white"
                            labelProps={{ className: "dark:text-gray-400" }}
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                            {t("profile.lastName")}
                          </Typography>
                          <Input
                            label={t("profile.enter")}
                            value={formData.lastName}
                            onChange={(e) =>
                              handlePersonalInfoChange("lastName", e.target.value)
                            }
                            className="dark:text-white"
                            labelProps={{ className: "dark:text-gray-400" }}
                          />
                        </div>
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                          {t("profile.birthDate")}
                        </Typography>
                        <Input
                          type="date"
                          label={t("profile.enter")}
                          value={formData.birthDate}
                          onChange={(e) =>
                            handlePersonalInfoChange("birthDate", e.target.value)
                          }
                          className="dark:text-white"
                          labelProps={{ className: "dark:text-gray-400" }}
                        />
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                          {t("profile.address")}
                        </Typography>
                        <Input
                          label={t("profile.enter")}
                          value={formData.address}
                          onChange={(e) =>
                            handlePersonalInfoChange("address", e.target.value)
                          }
                          className="dark:text-white"
                          labelProps={{ className: "dark:text-gray-400" }}
                        />
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                          {t("profile.phone")}
                        </Typography>
                        <Input
                          label={t("profile.enter")}
                          value={formData.phone}
                          onChange={(e) =>
                            handlePersonalInfoChange("phone", e.target.value)
                          }
                          className="dark:text-white"
                          labelProps={{ className: "dark:text-gray-400" }}
                        />
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button color="blue" onClick={handleSavePersonalInfo} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                          {t("profile.save")}
                        </Button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value="password" className="p-0">
                    <Typography variant="h6" color="blue-gray" className="mb-6 font-bold dark:text-white">
                      {t("profile.password")}
                    </Typography>
                    <div className="space-y-4">
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                          {t("profile.currentPassword")}
                        </Typography>
                        <Input
                          type="password"
                          label={t("profile.enter")}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            handlePasswordChange("currentPassword", e.target.value)
                          }
                          className="dark:text-white"
                          labelProps={{ className: "dark:text-gray-400" }}
                        />
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                          {t("profile.newPassword")}
                        </Typography>
                        <Input
                          type="password"
                          label={t("profile.enter")}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            handlePasswordChange("newPassword", e.target.value)
                          }
                          className="dark:text-white"
                          labelProps={{ className: "dark:text-gray-400" }}
                        />
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                          {t("profile.confirmPassword")}
                        </Typography>
                        <Input
                          type="password"
                          label={t("profile.enter")}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            handlePasswordChange("confirmPassword", e.target.value)
                          }
                          className="dark:text-white"
                          labelProps={{ className: "dark:text-gray-400" }}
                        />
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button color="blue" onClick={handleSavePassword} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                          {t("profile.save")}
                        </Button>
                      </div>
                    </div>
                  </TabPanel>
                </TabsBody>
              </Tabs>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
