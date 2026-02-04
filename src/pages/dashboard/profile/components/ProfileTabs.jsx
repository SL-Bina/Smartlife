import React, { useState } from "react";
import {
  Card,
  CardBody,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { profileAPI } from "../api";
import { useProfileForm, usePasswordForm } from "../hooks";

export function ProfileTabs({ user, refreshUser, messages }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);

  const { formData, setFormData, onChange: onPersonalChange } = useProfileForm(user);
  const { passwordData, onChange: onPasswordChange, reset: resetPassword } = usePasswordForm();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    messages.clearMessages();
  };

  const handleSavePersonalInfo = async () => {
    setLoading(true);
    messages.clearMessages();

    try {
      let birthdayValue = null;
      if (formData.birthDate) {
        birthdayValue = formData.birthDate;
      } else if (user?.birthday) {
        const dateStr = user.birthday.includes("T") ? user.birthday.split("T")[0] : user.birthday;
        birthdayValue = dateStr;
      }

      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`.trim() || user?.name || "",
        username: formData.username || user?.username || "",
        email: user?.email || "", // required
        phone: formData.phone || user?.phone || "", // required
        is_user: Number(user?.is_user ?? 1), // required
        role_id: Number(user?.role_id || user?.role?.id || 1), // required
        modules: ["*"], // required
        grant_permissions: ["*"], // required
        birthday: formData.birthDate || null, // nullable
        // personal_code only if exists
        ...(user?.personal_code ? { personal_code: user.personal_code } : {}),
        // password göndərmə! (bu personal info update-dir)
      };
      
      const res = await profileAPI.updateMe(updateData, user);
      

      if (user?.personal_code) updateData.personal_code = user.personal_code;

      const response = await profileAPI.update(updateData);
      

      if (response?.success) {
        messages.showSuccess(t("profile.updateSuccess") || "Məlumatlar uğurla yeniləndi");
        await refreshUser();

        // formu local olaraq saxla
        setFormData((prev) => ({ ...prev }));
      } else {
        messages.showError(response?.message || t("profile.updateError") || "Xəta baş verdi");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === "string" ? error : null) ||
        (t("profile.updateError") || "Xəta baş verdi");

      messages.showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    setLoading(true);
    messages.clearMessages();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      messages.showError(t("profile.passwordMismatch") || "Yeni şifrələr uyğun gəlmir");
      setLoading(false);
      return;
    }
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      messages.showError(t("profile.passwordRequired") || "Bütün sahələr doldurulmalıdır");
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword,
      };

      const response = await profileAPI.updatePassword(updateData);

      if (response?.success) {
        messages.showSuccess(t("profile.passwordUpdateSuccess") || "Şifrə uğurla yeniləndi");
        resetPassword();
      } else {
        messages.showError(response?.message || t("profile.passwordUpdateError") || "Xəta baş verdi");
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        (typeof error === "string" ? error : null) ||
        (t("profile.passwordUpdateError") || "Xəta baş verdi");

      messages.showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
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

          <TabsBody className="mt-2 flex-1 min-h-0" style={{ minHeight: "450px" }}>
            {/* PERSONAL */}
            <TabPanel value="personal" className="p-0 h-full flex flex-col">
              <Typography variant="h6" color="blue-gray" className="mb-2 font-bold dark:text-white text-sm flex-shrink-0">
                {t("profile.personalInfo") || "Şəxsi məlumatlar"}
              </Typography>

              {messages.successMessage && (
                <div className="mb-3 p-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <Typography variant="small" className="text-green-700 dark:text-green-300 text-xs">
                    {messages.successMessage}
                  </Typography>
                </div>
              )}

              {messages.errorMessage && (
                <div className="mb-3 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <Typography variant="small" className="text-red-700 dark:text-red-300 text-xs">
                    {messages.errorMessage}
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
                      onChange={(e) => onPersonalChange("firstName", e.target.value)}
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
                      onChange={(e) => onPersonalChange("lastName", e.target.value)}
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
                    onChange={(e) => onPersonalChange("username", e.target.value)}
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
                    onChange={(e) => onPersonalChange("birthDate", e.target.value)}
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
                    value={
                      formData.gender === "male"
                        ? t("profile.genderMale") || "Kişi"
                        : formData.gender === "female"
                        ? t("profile.genderFemale") || "Qadın"
                        : formData.gender
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
                    onChange={(e) => onPersonalChange("address", e.target.value)}
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
                    onChange={(e) => onPersonalChange("phone", e.target.value)}
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

            {/* PASSWORD */}
            <TabPanel value="password" className="p-0 h-full flex flex-col">
              <Typography variant="h6" color="blue-gray" className="mb-2 font-bold dark:text-white text-sm flex-shrink-0">
                {t("profile.password") || "Şifrəm"}
              </Typography>

              {messages.successMessage && (
                <div className="mb-3 p-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <Typography variant="small" className="text-green-700 dark:text-green-300 text-xs">
                    {messages.successMessage}
                  </Typography>
                </div>
              )}

              {messages.errorMessage && (
                <div className="mb-3 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <Typography variant="small" className="text-red-700 dark:text-red-300 text-xs">
                    {messages.errorMessage}
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
                    onChange={(e) => onPasswordChange("currentPassword", e.target.value)}
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
                    onChange={(e) => onPasswordChange("newPassword", e.target.value)}
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
                    onChange={(e) => onPasswordChange("confirmPassword", e.target.value)}
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
  );
}
