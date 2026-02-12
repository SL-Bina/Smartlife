import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Button,
  Switch,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  LanguageIcon,
  MoonIcon,
  SunIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useMaterialTailwindController, setDarkMode, setSidenavType, setSidenavColor } from "@/store/exports";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialTailwindController();
  const { darkMode } = controller;
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Dil ayarları
  const [language, setLanguage] = useState(i18n.language || "az");

  // Bildirim ayarları
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  useEffect(() => {
    // Sayfa yüklendiğinde mevcut dil ayarını kontrol et
    setLanguage(i18n.language || "az");
  }, [i18n.language]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleLanguageChange = async (value) => {
    if (!value) return;
    setLanguage(value);
    await i18n.changeLanguage(value);
    setSuccessMessage(t("settings.languageChanged") || "Dil dəyişdirildi");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleThemeChange = (isDark) => {
    // Context üzerinden dark mode'u güncelle
    // Context'teki useEffect otomatik olarak document.documentElement.classList'i güncelleyecek
    setDarkMode(dispatch, isDark);
    
    // Sidebar ve navbar renklerini de tema ile senkronize et
    if (isDark) {
      // Karanlık tema: sidebar karanlık gradient, navbar karanlık
      setSidenavType(dispatch, "dark");
      setSidenavColor(dispatch, "dark");
    } else {
      // Açık tema: sidebar beyaz, navbar açık
      setSidenavType(dispatch, "white");
      setSidenavColor(dispatch, "blue-gray");
    }
    
    setSuccessMessage(t("settings.themeChanged") || "Tema dəyişdirildi");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      // API çağrısı burada yapılabilir
      // await settingsAPI.updateNotifications({ emailNotifications, pushNotifications, smsNotifications });
      setSuccessMessage(t("settings.notificationsSaved") || "Bildiriş ayarları saxlanıldı");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to save notifications:", error);
      setErrorMessage(t("settings.notificationsSaveError") || "Bildiriş ayarları saxlanarkən xəta baş verdi");
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card className="border border-red-200 dark:border-red-900 dark:bg-gray-800">
        <CardBody className="p-6 dark:bg-gray-800">

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <Typography variant="small" className="text-green-700 dark:text-green-400">
                {successMessage}
              </Typography>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <Typography variant="small" className="text-red-700 dark:text-red-400">
                {errorMessage}
              </Typography>
            </div>
          )}

          <Tabs value={activeTab} className="w-full">
            <TabsHeader
              className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 dark:border-gray-700"
              indicatorProps={{
                className: "bg-transparent border-b-2 border-red-600 shadow-none rounded-none",
              }}
            >
              <Tab
                value="general"
                onClick={() => handleTabChange("general")}
                className={`${
                  activeTab === "general"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <GlobeAltIcon className="h-5 w-5" />
                  <span>{t("settings.general") || "Ümumi"}</span>
                </div>
              </Tab>
              <Tab
                value="notifications"
                onClick={() => handleTabChange("notifications")}
                className={`${
                  activeTab === "notifications"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BellIcon className="h-5 w-5" />
                  <span>{t("settings.notifications") || "Bildirişlər"}</span>
                </div>
              </Tab>
              <Tab
                value="security"
                onClick={() => handleTabChange("security")}
                className={`${
                  activeTab === "security"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <span>{t("settings.security") || "Təhlükəsizlik"}</span>
                </div>
              </Tab>
            </TabsHeader>

            <TabsBody style={{ minHeight: "450px" }} className="mt-6">
              <TabPanel value="general" className="h-full flex flex-col">
                <div className="space-y-4">
                  {/* Dil Seçimi */}
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-none dark:bg-gray-800">
                    <CardBody className="p-4 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <LanguageIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-gray-300">
                              {t("settings.language") || "Dil"}
                            </Typography>
                            <Typography variant="small" color="gray" className="dark:text-gray-400">
                              {t("settings.languageDescription") || "İstifadə etmək istədiyiniz dili seçin"}
                            </Typography>
                          </div>
                        </div>
                        <Select
                          value={language}
                          onChange={handleLanguageChange}
                          className="w-48"
                          labelProps={{
                            className: "hidden",
                          }}
                          containerProps={{
                            className: "min-w-[180px]",
                          }}
                        >
                          <Option value="az">Azərbaycan</Option>
                          <Option value="en">English</Option>
                          <Option value="ru">Русский</Option>
                        </Select>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Tema Seçimi */}
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-none dark:bg-gray-800">
                    <CardBody className="p-4 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            {darkMode ? (
                              <MoonIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                            ) : (
                              <SunIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <div>
                            <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-gray-300">
                              {t("settings.theme") || "Tema"}
                            </Typography>
                            <Typography variant="small" color="gray" className="dark:text-gray-400">
                              {t("settings.themeDescription") || "Qaranlıq və ya işıqlı tema seçin"}
                            </Typography>
                          </div>
                        </div>
                        <Switch
                          checked={darkMode}
                          onChange={(e) => handleThemeChange(e.target.checked)}
                          color="red"
                          label={
                            <span className="text-sm dark:text-gray-300 ml-2">
                              {darkMode ? (t("settings.dark") || "Qaranlıq") : (t("settings.light") || "İşıqlı")}
                            </span>
                          }
                        />
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </TabPanel>

              <TabPanel value="notifications" className="h-full flex flex-col">
                <div className="space-y-4">
                  {/* Email Bildirişləri */}
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-none dark:bg-gray-800">
                    <CardBody className="p-4 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <EnvelopeIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-gray-300">
                              {t("settings.emailNotifications") || "Email Bildirişləri"}
                            </Typography>
                            <Typography variant="small" color="gray" className="dark:text-gray-400">
                              {t("settings.emailNotificationsDescription") || "Email vasitəsilə bildirişlər alın"}
                            </Typography>
                          </div>
                        </div>
                        <Switch
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          color="red"
                        />
                      </div>
                    </CardBody>
                  </Card>

                  {/* Push Bildirişləri */}
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-none dark:bg-gray-800">
                    <CardBody className="p-4 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <BellIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-gray-300">
                              {t("settings.pushNotifications") || "Push Bildirişləri"}
                            </Typography>
                            <Typography variant="small" color="gray" className="dark:text-gray-400">
                              {t("settings.pushNotificationsDescription") || "Brauzer bildirişləri alın"}
                            </Typography>
                          </div>
                        </div>
                        <Switch
                          checked={pushNotifications}
                          onChange={(e) => setPushNotifications(e.target.checked)}
                          color="red"
                        />
                      </div>
                    </CardBody>
                  </Card>

                  {/* SMS Bildirişləri */}
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-none dark:bg-gray-800">
                    <CardBody className="p-4 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <PhoneIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-gray-300">
                              {t("settings.smsNotifications") || "SMS Bildirişləri"}
                            </Typography>
                            <Typography variant="small" color="gray" className="dark:text-gray-400">
                              {t("settings.smsNotificationsDescription") || "SMS vasitəsilə bildirişlər alın"}
                            </Typography>
                          </div>
                        </div>
                        <Switch
                          checked={smsNotifications}
                          onChange={(e) => setSmsNotifications(e.target.checked)}
                          color="red"
                        />
                      </div>
                    </CardBody>
                  </Card>

                  <div className="flex justify-end mt-4">
                    <Button
                      onClick={handleSaveNotifications}
                      loading={loading}
                      color="red"
                      className="px-8"
                    >
                      {loading ? (t("settings.saving") || "Saxlanılır...") : (t("settings.save") || "Saxla")}
                    </Button>
                  </div>
                </div>
              </TabPanel>

              <TabPanel value="security" className="h-full flex flex-col">
                <div className="space-y-4">
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-none dark:bg-gray-800">
                    <CardBody className="p-6 dark:bg-gray-800">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <ShieldCheckIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <Typography variant="h6" color="blue-gray" className="mb-1 dark:text-gray-300">
                            {t("settings.securitySettings") || "Təhlükəsizlik Parametrləri"}
                          </Typography>
                          <Typography variant="small" color="gray" className="dark:text-gray-400">
                            {t("settings.securityDescription") || "Şifrə dəyişdirmək üçün Profil səhifəsinə keçin"}
                          </Typography>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button
                          variant="outlined"
                          color="red"
                          className="border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={() => navigate("/dashboard/profile")}
                        >
                          {t("settings.goToProfile") || "Profili Dəyişdir"}
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
};

export default Settings;

