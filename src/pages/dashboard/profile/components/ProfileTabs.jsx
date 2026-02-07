import React, { useState } from "react";
import {
  Card,
  CardBody,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Input,
  Button
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { profileAPI } from "../api";
import { useProfileForm, usePasswordForm } from "../hooks";

export function ProfileTabs({ user, refreshUser, messages }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);

  const { formData, onChange: onPersonalChange } = useProfileForm(user || {});
  const { passwordData, onChange: onPasswordChange } = usePasswordForm();

  const handleSavePersonalInfo = async () => {
    if (!user) return;
    setLoading(true);
    messages.clearMessages();
    try {
      const updateData = {
        name: '${formData.firstName || ""} ${formData.lastName || ""}'.trim() || user?.name || "",
        username: formData.username || user?.username || "",
        email: user?.email || "",
        phone: formData.phone || user?.phone || "",
        is_user: Number(user?.is_user ?? 1),
        role_id: Number(user?.role_id || user?.role?.id || 1),
        modules: ["*"],
        grant_permissions: ["*"],
        birthday: formData.birthDate || null,
        address: formData.address || "",
      };

      const response = await profileAPI.updateMe(updateData, user); // Sənin API-da updateMe-dir

      messages.showSuccess(t("profile.updateSuccess") || "Uğurla yeniləndi");
      await refreshUser();
    } catch (error) {
      messages.showError(error?.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-red-600/20 dark:border-gray-700 shadow-sm dark:bg-gray-800">
      <CardBody className="p-4">
        <Tabs value={activeTab}>
          <TabsHeader
            className="bg-transparent border-b border-gray-200 dark:border-gray-700 rounded-none p-0"
            indicatorProps={{ className: "bg-transparent border-b-2 border-red-600 shadow-none rounded-none" }}
          >
            <Tab value="personal" onClick={() => setActiveTab("personal")} className={activeTab === "personal" ? "text-red-600" : "dark:text-gray-400"}>
              <div className="font-bold py-2 text-sm">{t("profile.personalInfo") || "Şəxsi məlumatlar"}</div>
            </Tab>
            <Tab value="password" onClick={() => setActiveTab("password")} className={activeTab === "password" ? "text-red-600" : "dark:text-gray-400"}>
              <div className="font-bold py-2 text-sm">{t("profile.password") || "Şifrə"}</div>
            </Tab>
          </TabsHeader>

          <TabsBody>
            <TabPanel value="personal" className="p-0 pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t("profile.firstName") || "Ad"} value={formData.firstName || ""} onChange={(e) => onPersonalChange("firstName", e.target.value)} color="red" />
                <Input label={t("profile.lastName") || "Soyad"} value={formData.lastName || ""} onChange={(e) => onPersonalChange("lastName", e.target.value)} color="red" />
              </div>
              <Input label={t("profile.username") || "İstifadəçi adı"} value={formData.username || ""} onChange={(e) => onPersonalChange("username", e.target.value)} color="red" />
              <Input type="date" label={t("profile.birthDate") || "Doğum tarixi"} value={formData.birthDate || ""} onChange={(e) => onPersonalChange("birthDate", e.target.value)} color="red" />
              <Input label={t("profile.address") || "Ünvan"} value={formData.address || ""} onChange={(e) => onPersonalChange("address", e.target.value)} color="red" />
              <Input label={t("profile.phone") || "Telefon"} value={formData.phone || ""} onChange={(e) => onPersonalChange("phone", e.target.value)} color="red" />
              <div className="flex justify-end">
                <Button color="red" onClick={handleSavePersonalInfo} disabled={loading}>{loading ? "..." : (t("profile.save") || "Yadda saxla")}</Button>
              </div>
            </TabPanel>

            <TabPanel value="password" className="p-0 pt-6 space-y-4">
              <Input type="password" label={t("profile.currentPassword") || "Cari şifrə"} value={passwordData.currentPassword || ""} onChange={(e) => onPasswordChange("currentPassword", e.target.value)} color="red" />
              <Input type="password" label={t("profile.newPassword") || "Yeni şifrə"} value={passwordData.newPassword || ""} onChange={(e) => onPasswordChange("newPassword", e.target.value)} color="red" />
              <Input type="password" label={t("profile.confirmPassword") || "Təkrar şifrə"} value={passwordData.confirmPassword || ""} onChange={(e) => onPasswordChange("confirmPassword", e.target.value)} color="red" />
              <div className="flex justify-end">
                <Button color="red">{t("profile.updatePassword") || "Şifrəni yenilə"}</Button>
              </div>
            </TabPanel>
          </TabsBody>
        </Tabs>
      </CardBody>
    </Card>
  );
}