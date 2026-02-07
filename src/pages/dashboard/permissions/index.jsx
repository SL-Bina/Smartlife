import React, { useEffect, useMemo, useState } from "react";
import { Typography, Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

import { rolesAPI, permissionsAPI } from "./api";
import { useRolesData } from "./hooks/useRolesData";
import { usePermissionsData } from "./hooks/usePermissionsData";
import { usePermissionsForm } from "./hooks/usePermissionsForm";

import { RolesPanel } from "./components/RolesPanel";
import { PermissionsPanel } from "./components/PermissionsPanel";

import { RoleFormModal } from "./components/modals/RoleFormModal";
import { PermissionFormModal } from "./components/modals/PermissionFormModal";
import { ConfirmDeleteModal } from "./components/modals/ConfirmDeleteModal";
import { useDynamicToast } from "@/hooks/useDynamicToast";
import DynamicToast from "@/components/DynamicToast";
import { PermissionHeader } from "./components/PermissionHeader";


const PermissionsPage = () => {
  const { t } = useTranslation();

  const { toast, showToast, closeToast } = useDynamicToast();

  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [permCreateOpen, setPermCreateOpen] = useState(false);
  const [permEditOpen, setPermEditOpen] = useState(false);

  const [roleDeleteOpen, setRoleDeleteOpen] = useState(false);
  const [permDeleteOpen, setPermDeleteOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissionCtx, setSelectedPermissionCtx] = useState(null);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { roles, loading: rolesLoading } = useRolesData(refreshKey);
  const { modules, loading: permissionsLoading } = usePermissionsData(refreshKey);

  const {
    formData,
    selectedPermissions,
    updateField,
    resetForm,
    setFormFromRole,
    togglePermission,
    toggleModulePermissions,
    setSelectedPermissionsFromRole,
  } = usePermissionsForm();

  const [permForm, setPermForm] = useState({
    module_id: "",
    permission_name: "",
    permission_detail: "",
  });

  const modulesFlat = useMemo(() => {
    return (modules || [])
      .map((x) => x?.module)
      .filter(Boolean)
      .map((m) => ({ id: m.id, name: m.name }));
  }, [modules]);

  const resetPermForm = () => {
    setPermForm({ module_id: "", permission_name: "", permission_detail: "" });
  };

  const updatePermField = (k, v) => setPermForm((p) => ({ ...p, [k]: v }));

  const handlePermissionToggle = (moduleName, permissionId) => togglePermission(moduleName, permissionId);
  const handleModuleToggle = (moduleName, permissionIds) => toggleModulePermissions(moduleName, permissionIds);

  useEffect(() => {
    if (!selectedRoleId) {
      setSelectedPermissionsFromRole({});
      return;
    }

    const loadRolePermissions = async () => {
      try {
        const response = await rolesAPI.getById(selectedRoleId);
        if (response.success && response.data) {
          const roleAccessModules = response.data.role_access_modules || [];
          const rolePermissions = {};

          roleAccessModules.forEach((m) => {
            const moduleName = m.module_name;
            const perms = m.permissions || [];
            if (perms.length) rolePermissions[moduleName] = perms.map((p) => p.id);
          });

          setSelectedPermissionsFromRole(rolePermissions);
        }
      } catch (err) {
        console.error(err);
        setSelectedPermissionsFromRole({});
        showToast({
          type: "error",
          title: t("common.error") || "Xəta",
          message: err?.message || "Rol icazələri yüklənmədi",
        });
      }
    };

    loadRolePermissions();
  }, [selectedRoleId, setSelectedPermissionsFromRole, showToast, t]);

  const handleRoleSelect = (roleId) => {
    setSelectedRoleId(roleId);
    const r = (roles || []).find((x) => x.id === roleId || x.role_id === roleId);
    if (r) setSelectedRole(r);
  };

  const handleCreateClick = () => {
    resetForm();
    setSelectedRole(null);
    setCreateOpen(true);
  };

  const handleEditClick = (role) => {
    setSelectedRole(role);
    setFormFromRole(role);
    setEditOpen(true);
  };

  const handleRoleDeleteClick = (role) => {
    setSelectedRole(role);
    setRoleDeleteOpen(true);
  };

  const handleCreateSave = async () => {
    try {
      setSaving(true);
      const response = await rolesAPI.create({ name: formData.name });

      if (response.success) {
        showToast({
          type: "success",
          title: t("common.success") || "Uğurlu",
          message: t("permissions.roles.created") || "Rol uğurla yaradıldı",
        });

        setCreateOpen(false);
        resetForm();
        setRefreshKey((p) => p + 1);

        const newRoleId = response.data?.role_id || response.data?.id;
        if (newRoleId) setSelectedRoleId(newRoleId);
      } else {
        showToast({
          type: "error",
          title: t("common.error") || "Xəta",
          message: response.message || "Rol yaradılmadı",
        });
      }
    } catch (err) {
      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: err?.message || err?.allErrors?.[0] || "Rol yaradılarkən xəta baş verdi",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async () => {
    if (!selectedRole) return;

    try {
      setSaving(true);
      const roleId = selectedRole.id ?? selectedRole.role_id;
      const response = await rolesAPI.update(roleId, { name: formData.name });

      if (response.success) {
        showToast({
          type: "success",
          title: t("common.success") || "Uğurlu",
          message: t("permissions.roles.updated") || "Rol uğurla yeniləndi",
        });

        setEditOpen(false);
        resetForm();
        setSelectedRole(null);
        setRefreshKey((p) => p + 1);
      } else {
        showToast({
          type: "error",
          title: t("common.error") || "Xəta",
          message: response.message || "Rol yenilənmədi",
        });
      }
    } catch (err) {
      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: err?.message || "Rol yenilənərkən xəta baş verdi",
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteRole = async () => {
    if (!selectedRole) return;

    try {
      setSaving(true);
      const roleId = selectedRole.id ?? selectedRole.role_id;
      const res = await rolesAPI.delete(roleId);

      if (res.success) {
        showToast({
          type: "success",
          title: t("common.success") || "Uğurlu",
          message: t("permissions.roles.deleted") || "Rol silindi",
        });

        setRoleDeleteOpen(false);

        if (selectedRoleId === roleId) {
          setSelectedRoleId(null);
          setSelectedPermissionsFromRole({});
        }

        setSelectedRole(null);
        setRefreshKey((p) => p + 1);
      } else {
        showToast({
          type: "error",
          title: t("common.error") || "Xəta",
          message: res.message || "Rol silinmədi",
        });
      }
    } catch (err) {
      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: err?.message || "Rol silinərkən xəta baş verdi",
      });
    } finally {
      setSaving(false);
    }
  };

  const openPermissionCreate = () => {
    resetPermForm();
    setSelectedPermissionCtx(null);
    setPermCreateOpen(true);
  };

  const openPermissionEdit = ({ moduleId, moduleName, permission }) => {
    const realModuleId =
      moduleId || (modules || []).find((x) => x?.module?.name === moduleName)?.module?.id;

    setSelectedPermissionCtx({ moduleId: realModuleId, moduleName, permission });

    setPermForm({
      module_id: realModuleId || "",
      permission_name: permission?.permission || "",
      permission_detail: permission?.details || permission?.detail || "",
    });

    setPermEditOpen(true);
  };

  const openPermissionDelete = ({ moduleId, moduleName, permission }) => {
    const realModuleId =
      moduleId || (modules || []).find((x) => x?.module?.name === moduleName)?.module?.id;

    setSelectedPermissionCtx({ moduleId: realModuleId, moduleName, permission });
    setPermDeleteOpen(true);
  };

  const savePermissionCreate = async () => {
    try {
      setSaving(true);

      const payload = {
        module_id: permForm.module_id,
        permission_name: permForm.permission_name,
        permission_detail: permForm.permission_detail,
      };

      const res = await permissionsAPI.create(payload);

      if (res.success) {
        showToast({
          type: "success",
          title: t("common.success") || "Uğurlu",
          message: t("permissions.permissions.created") || "İcazə yaradıldı",
        });

        setPermCreateOpen(false);
        resetPermForm();
        setRefreshKey((p) => p + 1);
      } else {
        showToast({
          type: "error",
          title: t("common.error") || "Xəta",
          message: res.message || "İcazə yaradılmadı",
        });
      }
    } catch (err) {
      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: err?.message || err?.allErrors?.[0] || "İcazə yaradılarkən xəta baş verdi",
      });
    } finally {
      setSaving(false);
    }
  };

  const savePermissionEdit = async () => {
    const permId = selectedPermissionCtx?.permission?.id;
    if (!permId) return;

    try {
      setSaving(true);

      const payload = {
        module_id: permForm.module_id,
        permission_name: permForm.permission_name,
        permission_detail: permForm.permission_detail,
      };

      const res = await permissionsAPI.update(permId, payload);

      if (res.success) {
        showToast({
          type: "success",
          title: t("common.success") || "Uğurlu",
          message: t("permissions.permissions.updated") || "İcazə yeniləndi",
        });

        setPermEditOpen(false);
        resetPermForm();
        setSelectedPermissionCtx(null);
        setRefreshKey((p) => p + 1);
      } else {
        showToast({
          type: "error",
          title: t("common.error") || "Xəta",
          message: res.message || "İcazə yenilənmədi",
        });
      }
    } catch (err) {
      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: err?.message || "İcazə yenilənərkən xəta baş verdi",
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDeletePermission = async () => {
    const permId = selectedPermissionCtx?.permission?.id;
    if (!permId) return;

    try {
      setSaving(true);
      const res = await permissionsAPI.delete(permId);

      if (res.success) {
        showToast({
          type: "success",
          title: t("common.success") || "Uğurlu",
          message: t("permissions.permissions.deleted") || "İcazə silindi",
        });

        setPermDeleteOpen(false);
        setSelectedPermissionCtx(null);
        setRefreshKey((p) => p + 1);
      } else {
        showToast({
          type: "error",
          title: t("common.error") || "Xəta",
          message: res.message || "İcazə silinmədi",
        });
      }
    } catch (err) {
      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: err?.message || "İcazə silinərkən xəta baş verdi",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleId) return;

    try {
      setSaving(true);

      const permissionIds = Object.values(selectedPermissions)
        .flat()
        .filter((id) => id != null && id !== "");

      const response = await rolesAPI.bindPermissions(selectedRoleId, permissionIds);

      if (response.success) {
        showToast({
          type: "success",
          title: t("common.success") || "Uğurlu",
          message: t("permissions.permissions.saved") || "İcazələr uğurla yadda saxlanıldı",
        });

        setRefreshKey((p) => p + 1);
      } else {
        showToast({
          type: "error",
          title: t("common.error") || "Xəta",
          message: response.message || "İcazələr yadda saxlanılmadı",
        });
      }
    } catch (err) {
      const msg =
        err?.allErrors?.length ? err.allErrors.join(", ") : err?.message || "İcazələr yadda saxlanarkən xəta baş verdi";

      showToast({
        type: "error",
        title: t("common.error") || "Xəta",
        message: msg,
        duration: 3500,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">

      {/* <PermissionHeader /> */}

      <div className="w-full bg-black dark:bg-gray-800 my-2 sm:my-3 lg:my-4 p-3 sm:p-4 rounded-lg shadow-lg mb-3 sm:mb-4 lg:mb-5 border border-red-600 dark:border-gray-700 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <Typography variant="h5" className="text-white font-bold text-lg sm:text-xl leading-tight">
              {t("permissions.pageTitle") || "İstifadəçi Hüquqları"}
            </Typography>
            <Typography variant="small" className="text-white/90 dark:text-white/90 mt-1.5 text-xs sm:text-sm font-medium">
              {t("permissions.subtitle") || "İstifadəçi rollarını və icazələrini idarə edin"}
            </Typography>
          </div>
          {selectedRoleId && (
            <Button
              color="green"
              size="sm"
              onClick={handleSavePermissions}
              disabled={saving}
              className="dark:bg-green-600 dark:hover:bg-green-700 text-white"
            >
              {saving ? t("buttons.saving") || "Yadda saxlanır..." : t("permissions.savePermissions") || "İcazələri yadda saxla"}
            </Button>
          )}
        </div>
      </div>
      <DynamicToast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={toast.duration}
        onClose={closeToast}
      />



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        <div className="h-full min-h-[400px]">
          <RolesPanel
            roles={roles}
            loading={rolesLoading}
            selectedRoleId={selectedRoleId}
            onRoleSelect={handleRoleSelect}
            onCreateClick={handleCreateClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleRoleDeleteClick}
          />
        </div>

        <div className="h-full min-h-[400px]">
          <PermissionsPanel
            modules={modules}
            loading={permissionsLoading}
            selectedPermissions={selectedPermissions}
            onPermissionToggle={handlePermissionToggle}
            onModuleToggle={handleModuleToggle}
            onCreateClick={openPermissionCreate}
            onEditPermission={openPermissionEdit}
            onDeletePermission={openPermissionDelete}
          />
        </div>
      </div>

      <RoleFormModal
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          resetForm();
        }}
        title={t("permissions.roles.createModal.title") || "Yeni rol yarat"}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleCreateSave}
        isEdit={false}
        saving={saving}
      />

      <RoleFormModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          resetForm();
          setSelectedRole(null);
        }}
        title={t("permissions.roles.editModal.title") || "Rolu düzəliş et"}
        formData={formData}
        onFieldChange={updateField}
        onSave={handleEditSave}
        isEdit={true}
        saving={saving}
      />

      <ConfirmDeleteModal
        open={roleDeleteOpen}
        onClose={() => {
          setRoleDeleteOpen(false);
          setSelectedRole(null);
        }}
        title={t("permissions.roles.deleteTitle") || "Rolu sil"}
        description={t("permissions.roles.deleteDesc") || "Bu rolu silmək istədiyinizə əminsiniz?"}
        onConfirm={confirmDeleteRole}
        loading={saving}
      />

      <PermissionFormModal
        open={permCreateOpen}
        onClose={() => {
          setPermCreateOpen(false);
          resetPermForm();
        }}
        title={t("permissions.permissions.createModal.title") || "Yeni icazə yarat"}
        formData={permForm}
        onFieldChange={updatePermField}
        onSave={savePermissionCreate}
        saving={saving}
        modules={modulesFlat}
        isEdit={false}
      />

      <PermissionFormModal
        open={permEditOpen}
        onClose={() => {
          setPermEditOpen(false);
          resetPermForm();
          setSelectedPermissionCtx(null);
        }}
        title={t("permissions.permissions.editModal.title") || "İcazəni düzəliş et"}
        formData={permForm}
        onFieldChange={updatePermField}
        onSave={savePermissionEdit}
        saving={saving}
        modules={modulesFlat}
        isEdit={true}
      />

      <ConfirmDeleteModal
        open={permDeleteOpen}
        onClose={() => {
          setPermDeleteOpen(false);
          setSelectedPermissionCtx(null);
        }}
        title={t("permissions.permissions.deleteTitle") || "İcazəni sil"}
        description={t("permissions.permissions.deleteDesc") || "Bu icazəni silmək istədiyinizə əminsiniz?"}
        onConfirm={confirmDeletePermission}
        loading={saving}
      />
    </div>
  );
};

export default PermissionsPage;
