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
  Input,
  Button,
  Chip,
  Avatar,
} from "@material-tailwind/react";
import {
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  ChevronRightIcon,
  UserCircleIcon,
  CalendarIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/auth-context";
import { authAPI } from "@/services/api";

const Profile = () => {
  const { t } = useTranslation();
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSuccessMessage(null);
    setErrorMessage(null);
  };
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    birthDate: user?.birthday ? (user.birthday.includes('T') ? user.birthday.split('T')[0] : user.birthday) : "",
    address: user?.address || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
  });

  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (user && !isInitialized) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        birthDate: user.birthday ? (user.birthday.includes('T') ? user.birthday.split('T')[0] : user.birthday) : "",
        address: user.address || "",
        phone: user.phone || "",
        gender: user.gender || "",
      });
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

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

  const handleSavePersonalInfo = async () => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      let birthdayValue = null;
      if (formData.birthDate) {
        birthdayValue = formData.birthDate;
      } else if (user?.birthday) {
        const dateStr = user.birthday.includes('T') ? user.birthday.split('T')[0] : user.birthday;
        birthdayValue = dateStr;
      }

      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`.trim() || formData.firstName || formData.lastName || user?.name || "",
        username: formData.username || user?.username || "",
        email: user?.email || "",
        phone: formData.phone || user?.phone || "",
        is_user: Number(user?.is_user ?? 1),
        role_id: Number(user?.role_id || user?.role?.id || 1),
        modules: ["*"],
        grant_permissions: ["*"],
        birthday: birthdayValue, // Nullable, amma həmişə göndərilməlidir
        password: "", // Sometimes - şifrə dəyişikliyi olmadıqda boş string, server mövcud password-u saxlayacaq
        password_confirmation: "", // Sometimes - şifrə dəyişikliyi olmadıqda boş string
      };

      // personal_code "sometimes" - yalnız varsa göndər
      if (user?.personal_code) {
        updateData.personal_code = user.personal_code;
      }

      // Debug: göndərilən data formatını yoxla
      console.log("Profile update data:", JSON.stringify(updateData, null, 2));

      const response = await authAPI.updateProfile(updateData);
      
      if (response.success) {
        setSuccessMessage(t("profile.updateSuccess") || "Məlumatlar uğurla yeniləndi");
        // Kullanıcı bilgilerini yenile
        await refreshUser();
        // FormData'yı güncelle (sadece başarılı güncellemeden sonra)
        setFormData({
          firstName: user?.firstName || formData.firstName,
          lastName: user?.lastName || formData.lastName,
          username: user?.username || formData.username,
          birthDate: user?.birthday ? (user.birthday.includes('T') ? user.birthday.split('T')[0] : user.birthday) : formData.birthDate,
          address: user?.address || formData.address,
          phone: user?.phone || formData.phone,
          gender: user?.gender || formData.gender,
        });
        // 3 saniye sonra mesajı kaldır
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(response.message || t("profile.updateError") || "Xəta baş verdi");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      console.error("Error response:", error?.response?.data);
      
      let errorMsg = t("profile.updateError") || "Xəta baş verdi";
      if (error?.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error?.message) {
        errorMsg = error.message;
      } else if (typeof error === "string") {
        errorMsg = error;
      }
      setErrorMessage(errorMsg);
      // 5 saniye sonra mesajı kaldır
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    // Şifre kontrolü
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage(t("profile.passwordMismatch") || "Yeni şifrələr uyğun gəlmir");
      setLoading(false);
      return;
    }

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setErrorMessage(t("profile.passwordRequired") || "Bütün sahələr doldurulmalıdır");
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword,
      };

      const response = await authAPI.updatePassword(updateData);
      
      if (response.success) {
        setSuccessMessage(t("profile.passwordUpdateSuccess") || "Şifrə uğurla yeniləndi");
        // Şifre alanlarını temizle
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        // 3 saniye sonra mesajı kaldır
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setErrorMessage(response.message || t("profile.passwordUpdateError") || "Xəta baş verdi");
      }
    } catch (error) {
      let errorMsg = t("profile.passwordUpdateError") || "Xəta baş verdi";
      if (error?.message) {
        errorMsg = error.message;
      } else if (typeof error === "string") {
        errorMsg = error;
      }
      setErrorMessage(errorMsg);
      // 5 saniye sonra mesajı kaldır
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setLoading(false);
    }
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
    <div className="h-full flex flex-col">
      <div className="w-full bg-black dark:bg-gray-800 my-2 p-3 rounded-lg shadow-lg mb-3 border border-red-600 dark:border-gray-700 flex-shrink-0">
        <h3 className="text-white font-bold text-base">{t("profile.pageTitle")}</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0">
        <div className="space-y-3 flex flex-col min-h-0">
          <Card className="border border-red-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 overflow-hidden flex-1 min-h-0 flex flex-col">
            <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 p-4 flex-1 min-h-0">
              <div className="absolute inset-0 opacity-20">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
                  alt="Complex"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-800/90 dark:from-blue-700/90 dark:to-blue-900/90"></div>

              <div className="relative flex flex-col items-center justify-center z-10 h-full">
                <div className="relative mb-2">
                  {user?.profile_photo ? (
                    <Avatar
                      src={user.profile_photo}
                      alt={user?.fullName || user?.name || "User"}
                      size="lg"
                      className="border-3 border-white dark:border-gray-700 shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold border-3 border-white dark:border-gray-700 shadow-lg">
                      {user?.firstName?.charAt(0) || user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full border-2 border-white dark:border-gray-800 shadow-md"></div>
                </div>
                <Typography variant="h6" className="text-white font-bold mb-0 text-center text-sm">
                  {user?.fullName || user?.name || "User"}
                </Typography>
                <Typography variant="small" className="text-blue-100 dark:text-blue-200 text-center text-xs mt-0.5">
                  {user?.email || "N/A"}
                </Typography>
                {user?.role && (
                  <Chip
                    value={(user?.role?.name || user?.role || "USER")?.toUpperCase()}
                    size="sm"
                    className="mt-1 bg-white/20 text-white border border-white/30 text-xs"
                    icon={<ShieldCheckIcon className="h-2.5 w-2.5" />}
                  />
                )}
              </div>
            </div>
          </Card>

          <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800 flex-1 min-h-0 flex flex-col">
            <CardBody className="p-3 dark:bg-gray-800 flex-1 flex flex-col min-h-0">
              <Typography variant="h6" className="mb-2 font-bold text-blue-gray-900 dark:text-white text-xs flex-shrink-0">
                {t("profile.contactInfo") || "ƏLAQƏ MƏLUMATLARI"}
              </Typography>
              <div className="space-y-1.5 flex-1 flex flex-col justify-center">
                <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer group">
                  <CardBody className="p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                        <EnvelopeIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-0.5 font-semibold">
                          {t("profile.email") || "E-poçt"}
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs truncate">
                          {user?.email || "N/A"}
                        </Typography>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 text-blue-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />
                  </CardBody>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer group">
                  <CardBody className="p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                        <PhoneIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-0.5 font-semibold">
                          {t("profile.phone") || "Telefon"}
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs truncate">
                          {user?.phone || "N/A"}
                        </Typography>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 text-blue-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors flex-shrink-0" />
                  </CardBody>
                </Card>

                {user?.username && (
                  <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer group">
                    <CardBody className="p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                          <UserCircleIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-0.5 font-semibold">
                            {t("profile.username") || "İstifadəçi adı"}
                          </Typography>
                          <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs truncate">
                            {user.username}
                          </Typography>
                        </div>
                      </div>
                      <ChevronRightIcon className="h-4 w-4 text-blue-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex-shrink-0" />
                    </CardBody>
                  </Card>
                )}
              </div>
            </CardBody>
          </Card>


        </div>


        <div className="lg:col-span-2 flex flex-col min-h-0">
          <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800 flex-1 flex flex-col min-h-0">
            <CardBody className="p-3 dark:bg-gray-800 flex-1 flex flex-col min-h-0">
              <Tabs value={activeTab} className="flex-1 flex flex-col min-h-0">
                <TabsHeader className="rounded-none border-b border-red-600 dark:border-gray-700 bg-transparent p-0 flex-shrink-0">
                  <Tab
                    value="personal"
                    onClick={() => handleTabChange("personal")}
                    className={
                      activeTab === "personal"
                        ? "border-b-2 border-red-600 text-red-600 dark:text-red-400"
                        : "dark:text-gray-400"
                    }
                  >
                    {t("profile.personalInfo") || "Şəxsi məlumatlar"}
                  </Tab>
                  <Tab
                    value="password"
                    onClick={() => handleTabChange("password")}
                    className={
                      activeTab === "password"
                        ? "border-b-2 border-red-600 text-red-600 dark:text-red-400"
                        : "dark:text-gray-400"
                    }
                  >
                    {t("profile.password") || "Şifrəm"}
                  </Tab>
                </TabsHeader>
                <TabsBody className="mt-2 flex-1 min-h-0" style={{ minHeight: '450px' }}>
                  <TabPanel value="personal" className="p-0 h-full flex flex-col">
                    <Typography variant="h6" color="blue-gray" className="mb-2 font-bold dark:text-white text-sm flex-shrink-0">
                      {t("profile.personalInfo") || "Şəxsi məlumatlar"}
                    </Typography>
                    {successMessage && (
                      <div className="mb-3 p-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <Typography variant="small" className="text-green-700 dark:text-green-300 text-xs">
                          {successMessage}
                        </Typography>
                      </div>
                    )}
                    {errorMessage && (
                      <div className="mb-3 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <Typography variant="small" className="text-red-700 dark:text-red-300 text-xs">
                          {errorMessage}
                        </Typography>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                            {t("profile.firstName") || "Ad"}
                          </Typography>
                          <Input
                            value={formData.firstName}
                            onChange={(e) =>
                              handlePersonalInfoChange("firstName", e.target.value)
                            }
                            className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-red-600 dark:focus:border-red-500 text-sm w-full"
                            labelProps={{ className: "dark:text-gray-400" }}
                            containerProps={{ className: "min-w-0" }}
                            size="md"
                          />
                        </div>
                        <div>
                          <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                            {t("profile.lastName") || "Soyad"}
                          </Typography>
                          <Input
                            value={formData.lastName}
                            onChange={(e) =>
                              handlePersonalInfoChange("lastName", e.target.value)
                            }
                            className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-red-600 dark:focus:border-red-500 text-sm w-full"
                            labelProps={{ className: "dark:text-gray-400" }}
                            containerProps={{ className: "min-w-0" }}
                            size="md"
                          />
                        </div>
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                          {t("profile.username") || "İstifadəçi adı"}
                        </Typography>
                        <Input
                          value={formData.username}
                          onChange={(e) =>
                            handlePersonalInfoChange("username", e.target.value)
                          }
                          className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-red-600 dark:focus:border-red-500 text-sm w-full"
                          labelProps={{ className: "dark:text-gray-400" }}
                          containerProps={{ className: "min-w-0" }}
                          size="md"
                        />
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                          {t("profile.birthDate") || "Doğum tarixi"}
                        </Typography>
                        <Input
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) =>
                            handlePersonalInfoChange("birthDate", e.target.value)
                          }
                          className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-red-600 dark:focus:border-red-500 text-sm w-full"
                          labelProps={{ className: "dark:text-gray-400" }}
                          size="md"
                        />
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                          {t("profile.gender") || "Cins"}
                        </Typography>
                        <Input
                          value={formData.gender === "male" ? (t("profile.genderMale") || "Kişi") : formData.gender === "female" ? (t("profile.genderFemale") || "Qadın") : formData.gender}
                          onChange={(e) =>
                            handlePersonalInfoChange("gender", e.target.value)
                          }
                          className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-red-600 dark:focus:border-red-500 text-sm w-full"
                          labelProps={{ className: "dark:text-gray-400" }}
                          size="md"
                          disabled
                        />
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                          {t("profile.address") || "Ünvan"}
                        </Typography>
                        <Input
                          value={formData.address}
                          onChange={(e) =>
                            handlePersonalInfoChange("address", e.target.value)
                          }
                          className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-red-600 dark:focus:border-red-500 text-sm w-full"
                          labelProps={{ className: "dark:text-gray-400" }}
                          size="md"
                        />
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                          {t("profile.phone") || "Telefon"}
                        </Typography>
                        <Input
                          value={formData.phone}
                          onChange={(e) =>
                            handlePersonalInfoChange("phone", e.target.value)
                          }
                          className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-red-600 dark:focus:border-red-500 text-sm w-full"
                          labelProps={{ className: "dark:text-gray-400" }}
                          size="md"
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button
                          color="red"
                          onClick={handleSavePersonalInfo}
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-xs py-1.5 px-4 disabled:opacity-50"
                          size="sm"
                        >
                          {loading ? (t("profile.saving") || "Yadda saxlanır...") : (t("profile.save") || "Yadda saxla")}
                        </Button>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel value="password" className="p-0 h-full flex flex-col">
                    <Typography variant="h6" color="blue-gray" className="mb-2 font-bold dark:text-white text-sm flex-shrink-0">
                      {t("profile.password") || "Şifrəm"}
                    </Typography>
                    {successMessage && (
                      <div className="mb-3 p-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <Typography variant="small" className="text-green-700 dark:text-green-300 text-xs">
                          {successMessage}
                        </Typography>
                      </div>
                    )}
                    {errorMessage && (
                      <div className="mb-3 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <Typography variant="small" className="text-red-700 dark:text-red-300 text-xs">
                          {errorMessage}
                        </Typography>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                          {t("profile.currentPassword") || "Cari şifrə"}
                        </Typography>
                        <Input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            handlePasswordChange("currentPassword", e.target.value)
                          }
                          className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-red-600 dark:focus:border-red-500 text-sm w-full"
                          labelProps={{ className: "dark:text-gray-400" }}
                          size="md"
                        />
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                          {t("profile.newPassword") || "Yeni şifrə"}
                        </Typography>
                        <Input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            handlePasswordChange("newPassword", e.target.value)
                          }
                          className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-red-600 dark:focus:border-red-500 text-sm w-full"
                          labelProps={{ className: "dark:text-gray-400" }}
                          size="md"
                        />
                      </div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="mb-2.5 font-semibold dark:text-gray-300 text-base">
                          {t("profile.confirmPassword") || "Şifrəni təsdiqlə"}
                        </Typography>
                        <Input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            handlePasswordChange("confirmPassword", e.target.value)
                          }
                          className="dark:text-white border-gray-300 dark:border-gray-600 focus:border-red-600 dark:focus:border-red-500 text-sm w-full"
                          labelProps={{ className: "dark:text-gray-400" }}
                          size="md"
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button
                          color="red"
                          onClick={handleSavePassword}
                          disabled={loading}
                          className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-xs py-1.5 px-4 disabled:opacity-50"
                          size="sm"
                        >
                          {loading ? (t("profile.saving") || "Yadda saxlanır...") : (t("profile.save") || "Yadda saxla")}
                        </Button>
                      </div>
                    </div>
                  </TabPanel>
                </TabsBody>
              </Tabs>
            </CardBody>
          </Card>
        </div>
        <div className="flex flex-row gap-3 w-full lg:col-span-3 flex-1 min-h-0">
          <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800 flex-1 min-h-0 flex flex-col w-1/2">
            <CardBody className="p-3 dark:bg-gray-800 flex-1 flex flex-col min-h-0">
              <Typography variant="h6" className="mb-2 font-bold text-blue-gray-900 dark:text-white text-xs flex-shrink-0">
                {t("profile.complexInfo") || "KOMPLEKS MƏLUMATLARI"}
              </Typography>
              <div className="flex-1 flex items-center">
                <Card className="border border-green-200 dark:border-green-800 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-900/20 hover:shadow-md transition-shadow w-full">
                  <CardBody className="p-2.5 flex items-center gap-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg shadow-sm">
                      <HomeIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-0.5 font-semibold">
                        {t("profile.complex") || "Kompleks"}
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-900 dark:text-white font-bold text-sm truncate">
                        {user?.email?.split("@")[1]?.split(".")[0] || "SmartLife"}
                      </Typography>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </CardBody>
          </Card>

          <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800 flex-1 min-h-0 flex flex-col w-1/2">
            <CardBody className="p-3 dark:bg-gray-800 flex-1 flex flex-col min-h-0">
              <Typography variant="h6" className="mb-3 font-bold text-blue-gray-900 dark:text-white text-xs flex-shrink-0">
                {t("profile.additionalInfo") || "ƏLAVƏ MƏLUMATLAR"}
              </Typography>
              <div className="flex-1 min-h-0 flex flex-col gap-2">
                {/* İlk sıra - Doğum tarixi ve Şəxsi kod */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                      <CalendarIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-1 font-semibold">
                        {t("profile.birthDate") || "Doğum tarixi"}
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs break-words">
                        {user?.birthday ? (() => {
                          const dateStr = user.birthday.includes('T') ? user.birthday.split('T')[0] : user.birthday;
                          const date = new Date(dateStr);
                          return date.toLocaleDateString('az-AZ', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          });
                        })() : "—"}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                    <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex-shrink-0">
                      <UserCircleIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-1 font-semibold">
                        {t("profile.personalCode") || "Şəxsi kod"}
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs break-words">
                        {user?.personal_code || "—"}
                      </Typography>
                    </div>
                  </div>
                </div>
                {/* İkinci sıra - Ünvan (tam genişlik) */}
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 flex-1">
                  <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg flex-shrink-0">
                    <MapPinIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-1 font-semibold">
                      {t("profile.address") || "Ünvan"}
                    </Typography>
                    <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs break-words">
                      {user?.address || "—"}
                    </Typography>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
