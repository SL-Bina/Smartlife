import React, { useMemo, useState, useRef, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { CustomInput } from "@/components/ui/CustomInput";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomCard, CardBody } from "@/components/ui/CustomCard";
import { CustomTypography } from "@/components/ui/CustomTypography";
import DynamicToast from "@/components/DynamicToast";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  CalendarIcon,
  IdentificationIcon,
  UserPlusIcon,
  XMarkIcon,
  PhotoIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useMaterialTailwindController } from "@/store/hooks/useMaterialTailwind";

export function UserAddFormModal({ open, mode = "create", onClose, form, onSubmit, lookups }) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });
  const photoInputRef = useRef(null);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };

  const isEdit = mode === "edit";
  const title = isEdit ? "İstifadəçi Redaktə et" : "Yeni İstifadəçi Əlavə Et";

  const typeOptions = [
    { value: 1, label: t("users.add.typeUser") || "İstifadəçi" },
    { value: 2, label: t("users.add.typeOrganization") || "Təşkilat" },
  ];

  const errorText = useMemo(() => {
    if (!form?.formData?.name?.trim()) return "Ad mütləqdir";
    if (!form?.formData?.username?.trim()) return "İstifadəçi adı mütləqdir";
    if (!form?.formData?.email?.trim()) return "E-mail mütləqdir";
    if (!form?.formData?.phone?.trim()) return "Telefon mütləqdir";
    if (!form?.formData?.password?.trim()) return "Şifrə mütləqdir";
    if (form?.formData?.password !== form?.formData?.password_confirmation) return "Şifrələr uyğun gəlmir";
    if (!form?.formData?.role_id) return "Rol seçilməlidir";
    return "";
  }, [form?.formData]);

  // Profile photo preview
  useEffect(() => {
    if (form?.formData?.profile_photo && form.formData.profile_photo instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(form.formData.profile_photo);
    } else {
      setProfilePhotoPreview(null);
    }
  }, [form?.formData?.profile_photo]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("error", "Şəkil ölçüsü 5MB-dan böyük ola bilməz", "Xəta");
      e.target.value = "";
      return;
    }

    form.updateField("profile_photo", file);
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    form.updateField("profile_photo", null);
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const handleArrayChange = (field, value, checked) => {
    const currentArray = form.formData[field] || [];
    if (checked) {
      form.updateField(field, [...currentArray, value]);
    } else {
      form.updateField(
        field,
        currentArray.filter((item) => item !== value)
      );
    }
  };

  const isChecked = (field, value) => {
    const array = form?.formData?.[field] || [];
    return array.includes(value);
  };

  const submit = async () => {
    if (errorText) {
      showToast("error", errorText, "Xəta");
      return;
    }
    setSaving(true);
    try {
      await onSubmit?.(form.formData);
      onClose?.();
    } catch (e) {
      console.error(e);
      const errorMessage = e?.response?.data?.message || e?.message || "Xəta baş verdi";
      showToast("error", errorMessage, "Xəta");
    } finally {
      setSaving(false);
    }
  };

  const [controller] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const colorCode = null;
  
  const getRgba = (opacity = 1) => {
    const r = 220; const g = 38; const b = 38;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  const activeColorCode = colorCode || "#dc2626";

  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  if (!open) return null;

  return (
    <>
      <Dialog 
        open={!!open} 
        handler={onClose} 
        size="xl"
        className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl"
        dismiss={{ enabled: false }}
      >
        <DialogHeader 
          className="border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg transition-colors bg-white dark:bg-gray-800"
          style={{
            background: activeColorCode 
              ? `linear-gradient(to right, ${getRgbaColor(activeColorCode, 0.1)}, ${getRgbaColor(activeColorCode, 0.05)})` 
              : undefined,
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: activeColorCode }}
            >
              <UserPlusIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
                {title}
              </Typography>
              <Typography variant="small" className="text-gray-600 dark:text-gray-400">
                Yeni istifadəçi üçün məlumatları doldurun
              </Typography>
            </div>
          </div>
          <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
            <XMarkIcon className="h-5 w-5 cursor-pointer text-gray-700 dark:text-gray-200" />
          </div>
        </DialogHeader>

        <DialogBody divider className="dark:bg-gray-800 py-6 max-h-[75vh] overflow-y-auto">
          {!form ? (
            <div className="text-center py-8">
              <Typography className="text-gray-700 dark:text-gray-200 font-medium">
                Form hazır deyil
              </Typography>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Basic Information */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    {t("users.add.basicInfo") || "Əsas Məlumatlar"}
                  </CustomTypography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomInput
                      label={t("users.add.name") || "Ad Soyad"} 
                      value={form.formData.name || ""}
                      onChange={(e) => form.updateField("name", e.target.value)}
                      error={!form.formData.name?.trim() ? "Ad mütləqdir" : false}
                      icon={<UserIcon className="h-5 w-5" />}
                    />

                    <CustomInput
                      label={t("users.add.username") || "İstifadəçi adı"}
                      value={form.formData.username || ""}
                      onChange={(e) => form.updateField("username", e.target.value)}
                      error={!form.formData.username?.trim() ? "İstifadəçi adı mütləqdir" : false}
                      icon={<UserIcon className="h-5 w-5" />}
                    />

                    <CustomInput
                      label={t("users.add.email") || "E-mail"}
                      type="email"
                      value={form.formData.email || ""}
                      onChange={(e) => form.updateField("email", e.target.value)}
                      error={!form.formData.email?.trim() ? "E-mail mütləqdir" : false}
                      icon={<EnvelopeIcon className="h-5 w-5" />}
                    />

                    <CustomInput
                      label={t("users.add.phone") || "Telefon"}
                      type="tel"
                      value={form.formData.phone || ""}
                      onChange={(e) => form.updateField("phone", e.target.value)}
                      error={!form.formData.phone?.trim() ? "Telefon mütləqdir" : false}
                      icon={<PhoneIcon className="h-5 w-5" />}
                    />

                    <CustomInput
                      label={t("users.add.birthday") || "Doğum tarixi"}
                      type="date"
                      value={form.formData.birthday || ""}
                      onChange={(e) => form.updateField("birthday", e.target.value)}
                      icon={<CalendarIcon className="h-5 w-5" />}
                    />

                    <CustomInput
                      label={t("users.add.personalCode") || "Şəxsi kod"}
                      value={form.formData.personal_code || ""}
                      onChange={(e) => form.updateField("personal_code", e.target.value)}
                      icon={<IdentificationIcon className="h-5 w-5" />}
                    />
                  </div>
                </CardBody>
              </CustomCard>

              {/* Password */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    {t("users.add.password") || "Şifrə"}
                  </CustomTypography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomInput
                      label={t("users.add.password") || "Şifrə"}
                      type="password"
                      value={form.formData.password || ""}
                      onChange={(e) => form.updateField("password", e.target.value)}
                      error={!form.formData.password?.trim() ? "Şifrə mütləqdir" : false}
                      icon={<KeyIcon className="h-5 w-5" />}
                    />

                    <CustomInput
                      label={t("users.add.passwordConfirmation") || "Şifrə təsdiqi"}
                      type="password"
                      value={form.formData.password_confirmation || ""}
                      onChange={(e) => form.updateField("password_confirmation", e.target.value)}
                      error={form.formData.password !== form.formData.password_confirmation ? "Şifrələr uyğun gəlmir" : false}
                      icon={<KeyIcon className="h-5 w-5" />}
                    />
                  </div>
                </CardBody>
              </CustomCard>

              {/* Role and Type */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    {t("users.add.roleAndType") || "Rol və Tip"}
                  </CustomTypography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CustomSelect
                      label={t("users.add.role") || "Rol"}
                      value={form.formData.role_id?.toString() || ""}
                      onChange={(value) => form.updateField("role_id", value ? Number(value) : "")}
                      options={lookups.roles.map((role) => ({ value: role.id.toString(), label: role.name }))}
                      placeholder={t("users.add.selectRole") || "Rol seçin"}
                      error={!form.formData.role_id ? "Rol seçilməlidir" : false}
                    />

                    <CustomSelect
                      label={t("users.add.type") || "Tip"}
                      value={form.formData.type?.toString() || "1"}
                      onChange={(value) => form.updateField("type", value ? Number(value) : 1)}
                      options={typeOptions.map((opt) => ({ value: opt.value.toString(), label: opt.label }))}
                      placeholder={t("users.add.selectType") || "Tip seçin"}
                    />
                  </div>
                </CardBody>
              </CustomCard>

              {/* Modules */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    {t("users.add.modules") || "Modullar"}
                  </CustomTypography>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                    {lookups.modules.map((module) => {
                      const moduleId = module.module?.id || module.id;
                      const moduleName = module.module?.name || module.name;
                      return (
                        <label
                          key={moduleId}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked("modules", moduleId)}
                            onChange={(e) => handleArrayChange("modules", moduleId, e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{moduleName}</span>
                        </label>
                      );
                    })}
                  </div>
                </CardBody>
              </CustomCard>

              {/* MTK */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    {t("users.add.mtk") || "MTK"}
                  </CustomTypography>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                    {lookups.mtks.map((mtk) => {
                      const mtkId = mtk.id;
                      const mtkName = mtk.name || mtk.title;
                      return (
                        <label
                          key={mtkId}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked("mtk", mtkId)}
                            onChange={(e) => handleArrayChange("mtk", mtkId, e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{mtkName}</span>
                        </label>
                      );
                    })}
                  </div>
                </CardBody>
              </CustomCard>

              {/* Complex */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    {t("users.add.complex") || "Kompleks"}
                  </CustomTypography>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                    {lookups.complexes.map((complex) => {
                      const complexId = complex.id;
                      const complexName = complex.name || complex.title;
                      return (
                        <label
                          key={complexId}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked("complex", complexId)}
                            onChange={(e) => handleArrayChange("complex", complexId, e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{complexName}</span>
                        </label>
                      );
                    })}
                  </div>
                </CardBody>
              </CustomCard>

              {/* Permissions */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    {t("users.add.permissions") || "İcazələr"}
                  </CustomTypography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                    {lookups.permissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked("permissions", permission.id)}
                          onChange={(e) => handleArrayChange("permissions", permission.id, e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {permission.module_name} - {permission.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </CardBody>
              </CustomCard>

              {/* Profile Photo */}
              <CustomCard>
                <CardBody>
                  <CustomTypography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    {t("users.add.profilePhoto") || "Profil şəkli"}
                  </CustomTypography>
                  <div className="flex items-center gap-4">
                    {profilePhotoPreview ? (
                      <div className="relative">
                        <img
                          src={profilePhotoPreview}
                          alt="Preview"
                          className="w-24 h-24 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                        <PhotoIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <PhotoIcon className="h-5 w-5" />
                        {profilePhotoPreview ? t("users.add.changePhoto") || "Şəkil dəyiş" : t("users.add.selectPhoto") || "Şəkil seç"}
                      </label>
                      <CustomTypography variant="small" className="text-gray-700 dark:text-gray-200 mt-1 font-medium">
                        Maksimum 5MB
                      </CustomTypography>
                    </div>
                  </div>
                </CardBody>
              </CustomCard>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button
            variant="outlined"
            color="blue-gray"
            onClick={onClose}
            disabled={saving}
            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {t("buttons.cancel") || "Ləğv et"}
          </Button>
          <Button
            color="blue"
            onClick={submit}
            disabled={saving || !!errorText}
            className="dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {saving
              ? t("buttons.saving") || "Yadda saxlanır..."
              : t("users.add.save") || "Yadda saxla"}
          </Button>
        </DialogFooter>
      </Dialog>

      <DynamicToast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast({ ...toast, open: false })}
        duration={3000}
      />
    </>
  );
}

