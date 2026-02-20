import React, { useMemo, useState, useRef, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, Input, Select, Option, Checkbox } from "@material-tailwind/react";
import DynamicToast from "@/components/DynamicToast";
import MultiSelect from "@/components/MultiSelect";
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
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const mapAccessToForm = (accessModules = []) => {
  const modules = [];
  const permissions = [];

  accessModules.forEach((m) => {
    if (m.module_id) modules.push(m.module_id);
    if (m.permissions?.length) {
      m.permissions.forEach(p => permissions.push(p.id));
    }
  });

  return { modules, permissions };
};


export function UserAddFormModal({ open, mode = "create", onClose, form, onSubmit, lookups }) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [toast, setToast] = useState({ open: false, type: "info", message: "", title: "" });
  const photoInputRef = useRef(null);

  const showToast = (type, message, title = "") => {
    setToast({ open: true, type, message, title });
  };



  useEffect(() => {
    if (mode === "edit" && form?.formData?.role_access_modules) {
      const parsed = mapAccessToForm(form.formData.role_access_modules);

      form.updateField("modules", parsed.modules);
      form.updateField("permissions", parsed.permissions);
    }
  }, [mode, form?.formData?.role_access_modules]);



  const isEdit = mode === "edit";
  const title = isEdit ? t("users.add.editTitle") : t("users.add.title");
  const subtitle = t("users.add.subtitle");

  const typeOptions = [
    { value: 1, label: t("users.add.typeUser") || "İstifadəçi" },
    { value: 2, label: t("users.add.typeOrganization") || "Təşkilat" },
  ];

  const errorText = useMemo(() => {
    if (!form?.formData?.name?.trim()) return t("users.add.errors.nameRequired");
    if (!form?.formData?.username?.trim()) return t("users.add.errors.usernameRequired");
    if (!form?.formData?.email?.trim()) return t("users.add.errors.emailRequired");
    if (!form?.formData?.phone?.trim()) return t("users.add.errors.phoneRequired");
    if (!form?.formData?.password?.trim()) return t("users.add.errors.passwordRequired");
    if (form?.formData?.password !== form?.formData?.password_confirmation) return t("users.add.errors.passwordsMismatch");
    if (!form?.formData?.role_id) return t("users.add.errors.roleRequired");
    return "";
  }, [form?.formData, t]);

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
      showToast("error", t("users.add.errors.photoSizeError"), t("users.add.errors.error"));
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
      const errorMessage = e?.response?.data?.message || e?.message || t("users.add.errors.errorOccurred");
      showToast("error", errorMessage, t("users.add.errors.error"));
    } finally {
      setSaving(false);
    }
  };

  const normalizeIds = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.map(item => typeof item === "object" ? item.id : item);
  };

  useEffect(() => {
    if (mode !== "edit" || !form?.formData) return;

    form.setFormData(prev => ({
      ...prev,
      modules: normalizeIds(prev.modules),
      permissions: normalizeIds(prev.permissions),
      mtk: normalizeIds(prev.mtk),
      complex: normalizeIds(prev.complex),
    }));
  }, [mode]);

  useEffect(() => {
    if (mode !== "edit") return;

    const access = form?.formData?.role_access_modules;
    if (!access) return;

    const modules = [];
    const permissions = [];

    access.forEach(m => {
      if (m.module_id) modules.push(m.module_id);
      if (m.permissions) {
        m.permissions.forEach(p => permissions.push(p.id));
      }
    });

    form.setFormData(prev => ({
      ...prev,
      modules,
      permissions
    }));
  }, [mode]);



  if (!open) return null;

  return (
    <>
      <Dialog
        open={!!open}
        handler={onClose}
        size="xl"
        className="dark:bg-gray-800"
        dismiss={{ enabled: false }}
        style={{ zIndex: 9999 }}
      >
        <div style={{ zIndex: 9999 }}>
          <DialogHeader
            className="border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <UserPlusIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <Typography variant="h5" className="font-bold text-white">
                  {title}
                </Typography>
                <Typography variant="small" className="text-white/90">
                  {subtitle}
                </Typography>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md transition-all hover:bg-white/20 text-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </DialogHeader>

          <DialogBody divider className="dark:bg-gray-800 py-6 max-h-[75vh] overflow-y-auto bg-white ">
            {!form ? (
              <div className="text-center py-8">
                <Typography className="text-gray-700 dark:text-gray-200 font-medium">
                  {t("users.add.formNotReady")}
                </Typography>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-blue-500" />
                    {t("users.add.basicInfo") || "Əsas Məlumatlar"}
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label={t("users.add.name") || "Ad Soyad"}
                        value={form.formData.name || ""}
                        onChange={(e) => form.updateField("name", e.target.value)}
                        className="!bg-white dark:!bg-gray-800"
                        labelProps={{ className: "dark:text-gray-300" }}
                        error={!form.formData.name?.trim()}
                      />
                      {!form.formData.name?.trim() && (
                        <Typography variant="small" className="text-red-500 mt-1">
                          {t("users.add.errors.nameRequired")}
                        </Typography>
                      )}
                    </div>

                    <div>
                      <Input
                        label={t("users.add.username") || "İstifadəçi adı"}
                        value={form.formData.username || ""}
                        onChange={(e) => form.updateField("username", e.target.value)}
                        className="!bg-white dark:!bg-gray-800"
                        labelProps={{ className: "dark:text-gray-300" }}
                        error={!form.formData.username?.trim()}
                      />
                      {!form.formData.username?.trim() && (
                        <Typography variant="small" className="text-red-500 mt-1">
                          {t("users.add.errors.usernameRequired")}
                        </Typography>
                      )}
                    </div>

                    <div>
                      <Input
                        label={t("users.add.email") || "E-mail"}
                        type="email"
                        value={form.formData.email || ""}
                        onChange={(e) => form.updateField("email", e.target.value)}
                        className="!bg-white dark:!bg-gray-800"
                        labelProps={{ className: "dark:text-gray-300" }}
                        error={!form.formData.email?.trim()}
                      />
                      {!form.formData.email?.trim() && (
                        <Typography variant="small" className="text-red-500 mt-1">
                          {t("users.add.errors.emailRequired")}
                        </Typography>
                      )}
                    </div>

                    <div>
                      <Input
                        label={t("users.add.phone") || "Telefon"}
                        type="tel"
                        value={form.formData.phone || ""}
                        onChange={(e) => form.updateField("phone", e.target.value)}
                        className="!bg-white dark:!bg-gray-800"
                        labelProps={{ className: "dark:text-gray-300" }}
                        error={!form.formData.phone?.trim()}
                      />
                      {!form.formData.phone?.trim() && (
                        <Typography variant="small" className="text-red-500 mt-1">
                          {t("users.add.errors.phoneRequired")}
                        </Typography>
                      )}
                    </div>

                    <Input
                      label={t("users.add.birthday") || "Doğum tarixi"}
                      type="date"
                      value={form.formData.birthday || ""}
                      onChange={(e) => form.updateField("birthday", e.target.value)}
                      className="!bg-white dark:!bg-gray-800"
                      labelProps={{ className: "dark:text-gray-300" }}
                    />

                    <Input
                      label={t("users.add.personalCode") || "Şəxsi kod"}
                      value={form.formData.personal_code || ""}
                      onChange={(e) => form.updateField("personal_code", e.target.value)}
                      className="!bg-white dark:!bg-gray-800"
                      labelProps={{ className: "dark:text-gray-300" }}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold flex items-center gap-2">
                    <KeyIcon className="h-5 w-5 text-blue-500" />
                    {t("users.add.password") || "Şifrə"}
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label={t("users.add.password") || "Şifrə"}
                        type="password"
                        value={form.formData.password || ""}
                        onChange={(e) => form.updateField("password", e.target.value)}
                        className="!bg-white dark:!bg-gray-800"
                        labelProps={{ className: "dark:text-gray-300" }}
                        error={!form.formData.password?.trim()}
                      />
                      {!form.formData.password?.trim() && (
                        <Typography variant="small" className="text-red-500 mt-1">
                          {t("users.add.errors.passwordRequired")}
                        </Typography>
                      )}
                    </div>

                    <div>
                      <Input
                        label={t("users.add.passwordConfirmation") || "Şifrə təsdiqi"}
                        type="password"
                        value={form.formData.password_confirmation || ""}
                        onChange={(e) => form.updateField("password_confirmation", e.target.value)}
                        className="!bg-white dark:!bg-gray-800"
                        labelProps={{ className: "dark:text-gray-300" }}
                        error={form.formData.password !== form.formData.password_confirmation}
                      />
                      {form.formData.password !== form.formData.password_confirmation && (
                        <Typography variant="small" className="text-red-500 mt-1">
                          {t("users.add.errors.passwordsMismatch")}
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-blue-500" />
                    {t("users.add.roleAndType") || "Rol və Tip"}
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative z-[10000]">
                      <Select
                        label={t("users.add.role") || "Rol"}
                        value={form.formData.role_id?.toString() || ""}
                        onChange={(value) => form.updateField("role_id", value ? Number(value) : "")}
                        className="!bg-white dark:!bg-gray-800 [&>div>div]:!z-[10001]"
                        labelProps={{ className: "dark:text-gray-300" }}
                        menuProps={{ className: "!z-[10001]" }}
                        error={!form.formData.role_id}
                      >
                        {lookups.roles.map((role) => (
                          <Option key={role.id} value={role.id.toString()}>
                            {role.name}
                          </Option>
                        ))}
                      </Select>
                      {!form.formData.role_id && (
                        <Typography variant="small" className="text-red-500 mt-1">
                          {t("users.add.errors.roleRequired")}
                        </Typography>
                      )}
                    </div>

                    <div className="relative z-[10000]">
                      <Select
                        label={t("users.add.type") || "Tip"}
                        value={form.formData.type?.toString() || "1"}
                        onChange={(value) => form.updateField("type", value ? Number(value) : 1)}
                        className="!bg-white dark:!bg-gray-800 [&>div>div]:!z-[10001]"
                        labelProps={{ className: "dark:text-gray-300" }}
                        menuProps={{ className: "!z-[10001]" }}
                      >
                        {typeOptions.map((opt) => (
                          <Option key={opt.value} value={opt.value.toString()}>
                            {opt.label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    {t("users.add.modules") || "Modullar"}
                  </Typography>
                  {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    {lookups.modules.map((module) => {
                      const moduleId = module.module?.id || module.id;
                      const moduleName = module.module?.name || module.name;
                      return (
                        <label
                          key={moduleId}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                          <Checkbox
                            checked={isChecked("modules", moduleId)}
                            onChange={(e) => handleArrayChange("modules", moduleId, e.target.checked)}
                            className="h-4 w-4"
                            color="blue"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{moduleName}</span>
                        </label>
                      );
                    })}
                  </div> */}
                  <MultiSelect
                    label="Modullar"
                    options={lookups.modules.map(m => ({
                      id: m.module?.id || m.id,
                      name: m.module?.name || m.name
                    }))}
                    value={form.formData.modules || []}
                    onChange={(val) => form.updateField("modules", val)}
                  />



                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    {t("users.add.mtk") || "MTK"}
                  </Typography>
                  {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    {lookups.mtks.map((mtk) => {
                      const mtkId = mtk.id;
                      const mtkName = mtk.name || mtk.title;
                      return (
                        <label
                          key={mtkId}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                          <Checkbox
                            checked={isChecked("mtk", mtkId)}
                            onChange={(e) => handleArrayChange("mtk", mtkId, e.target.checked)}
                            className="h-4 w-4"
                            color="blue"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{mtkName}</span>
                        </label>
                      );
                    })}
                      
                  </div> */}
                  <MultiSelect
                    label="MTK"
                    options={lookups.mtks}
                    value={form.formData.mtk || []}
                    onChange={(val) => form.updateField("mtk", val)}
                  />




                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    {t("users.add.complex") || "Kompleks"}
                  </Typography>
                  {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    {lookups.complexes.map((complex) => {
                      const complexId = complex.id;
                      const complexName = complex.name || complex.title;
                      return (
                        <label
                          key={complexId}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                        >
                          <Checkbox
                            checked={isChecked("complex", complexId)}
                            onChange={(e) => handleArrayChange("complex", complexId, e.target.checked)}
                            className="h-4 w-4"
                            color="blue"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{complexName}</span>
                        </label>
                      );
                    })}
                  </div> */}
                  <MultiSelect
                    label="Kompleks"
                    options={lookups.complexes}
                    value={form.formData.complex || []}
                    onChange={(val) => form.updateField("complex", val)}
                  />




                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold">
                    {t("users.add.permissions") || "İcazələr"}
                  </Typography>
                  {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    {lookups.permissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={isChecked("permissions", permission.id)}
                          onChange={(e) => handleArrayChange("permissions", permission.id, e.target.checked)}
                          className="h-4 w-4"
                          color="blue"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {permission.module_name} - {permission.name}
                        </span>
                      </label>
                    ))}
                  </div> */}
                  <MultiSelect
                    label="İcazələr"
                    options={lookups.permissions.map(p => ({
                      id: p.id,
                      name: `${p.module_name} - ${p.name}`
                    }))}
                    value={form.formData.permissions || []}
                    onChange={(val) => form.updateField("permissions", val)}
                  />



                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <Typography variant="h6" className="mb-4 text-gray-900 dark:text-white font-semibold flex items-center gap-2">
                    <PhotoIcon className="h-5 w-5 text-blue-500" />
                    {t("users.add.profilePhoto") || "Profil şəkli"}
                  </Typography>
                  <div className="flex items-center gap-4">
                    {profilePhotoPreview ? (
                      <div className="relative">
                        <img
                          src={profilePhotoPreview}
                          alt="Preview"
                          className="w-24 h-24 rounded-lg object-cover border-2 border-gray-300 dark:border-gray-600 shadow-md"
                        />
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
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
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                      >
                        <PhotoIcon className="h-5 w-5" />
                        {profilePhotoPreview ? t("users.add.changePhoto") || "Şəkil dəyiş" : t("users.add.selectPhoto") || "Şəkil seç"}
                      </label>
                      <Typography variant="small" className="text-gray-600 dark:text-gray-400 mt-2 block">
                        {t("users.add.maxSize")}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogBody>

          <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4 bg-white">
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
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {saving
                ? t("buttons.saving") || "Yadda saxlanır..."
                : t("users.add.save") || "Yadda saxla"}
            </Button>
          </DialogFooter>
        </div>
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

