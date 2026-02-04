import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { rolesAPI } from "./api";
import { useRolesData } from "./hooks/useRolesData";
import { usePermissionsData } from "./hooks/usePermissionsData";
import { usePermissionsForm } from "./hooks/usePermissionsForm";
import { RolesPanel } from "./components/RolesPanel";
import { PermissionsPanel } from "./components/PermissionsPanel";
import { RoleFormModal } from "./components/modals/RoleFormModal";

const PermissionsPage = () => {
  const { t } = useTranslation();
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { roles, loading: rolesLoading, error: rolesError } = useRolesData(refreshKey);
  const { modules, loading: permissionsLoading } = usePermissionsData();
  const {
    formData,
    selectedPermissions,
    updateField,
    resetForm,
    setFormFromRole,
    togglePermission,
    toggleModulePermissions,
    getAllSelectedPermissionIds,
    setSelectedPermissionsFromRole,
  } = usePermissionsForm();

  // Permission-ları seçəndə avtomatik olaraq backend-ə göndər
  const handlePermissionToggle = (moduleName, permissionId) => {
    togglePermission(moduleName, permissionId);
  };

  const handleModuleToggle = (moduleName, permissionIds) => {
    toggleModulePermissions(moduleName, permissionIds);
  };


  // Seçilmiş rol üçün permission-ları yüklə
  useEffect(() => {
    if (selectedRoleId) {
      const loadRolePermissions = async () => {
        try {
          const response = await rolesAPI.getById(selectedRoleId);
          if (response.success && response.data) {
            const roleData = response.data;
            const roleAccessModules = roleData.role_access_modules || [];
            
            // API-dən gələn permission-ları formatla
            // Format: { moduleName: [permissionIds] }
            const rolePermissions = {};
            
            roleAccessModules.forEach((module) => {
              const moduleName = module.module_name;
              const permissions = module.permissions || [];
              
              if (permissions.length > 0) {
                rolePermissions[moduleName] = permissions.map((perm) => perm.id);
              }
            });
            
            setSelectedPermissionsFromRole(rolePermissions);
          }
        } catch (err) {
          console.error("Error loading role permissions:", err);
          setSelectedPermissionsFromRole({});
        }
      };
      loadRolePermissions();
    } else {
      setSelectedPermissionsFromRole({});
    }
  }, [selectedRoleId, setSelectedPermissionsFromRole]);

  const handleRoleSelect = (roleId) => {
    setSelectedRoleId(roleId);
    const role = roles.find((r) => r.id === roleId);
    if (role) {
      setSelectedRole(role);
    }
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

  const handleCreateSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await rolesAPI.create({
        name: formData.name,
      });

      if (response.success) {
        setSuccess(t("permissions.roles.created") || "Rol uğurla yaradıldı");
        setCreateOpen(false);
        resetForm();
        setRefreshKey((prev) => prev + 1);
        
        // Yeni yaradılan rol seçilir
        // API-dən gələn response-da role_id olacaq
        const newRoleId = response.data?.role_id || response.data?.id;
        if (newRoleId) {
          setTimeout(() => {
            handleRoleSelect(newRoleId);
          }, 100);
        }
      }
    } catch (err) {
      console.error("Error creating role:", err);
      setError(err.message || err.allErrors?.[0] || t("permissions.roles.createError") || "Rol yaradılarkən xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  const handleEditSave = async () => {
    if (!selectedRole) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await rolesAPI.update(selectedRole.id, {
        name: formData.name,
      });

      if (response.success) {
        setSuccess(t("permissions.roles.updated") || "Rol uğurla yeniləndi");
        setEditOpen(false);
        resetForm();
        setSelectedRole(null);
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error updating role:", err);
      setError(err.message || err.allErrors?.[0] || t("permissions.roles.updateError") || "Rol yenilənərkən xəta baş verdi");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleId) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Yalnız seçilmiş permission ID-ləri topla
      const permissionIds = Object.values(selectedPermissions).flat().filter(id => id != null && id !== undefined && id !== '');
      
      const response = await rolesAPI.bindPermissions(selectedRoleId, permissionIds);

      if (response.success) {
        setSuccess(t("permissions.permissions.saved") || "İcazələr uğurla yadda saxlanıldı");
        // Permission-lar yadda saxlanıldıqdan sonra rol məlumatlarını yenilə
        setRefreshKey((prev) => prev + 1);
        // Seçilmiş rol üçün permission-ları yenidən yüklə
        const roleResponse = await rolesAPI.getById(selectedRoleId);
        if (roleResponse.success && roleResponse.data) {
          const roleData = roleResponse.data;
          const roleAccessModules = roleData.role_access_modules || [];
          const rolePermissions = {};
          roleAccessModules.forEach((module) => {
            const moduleName = module.module_name;
            const permissions = module.permissions || [];
            if (permissions.length > 0) {
              rolePermissions[moduleName] = permissions.map((perm) => perm.id);
            }
          });
          setSelectedPermissionsFromRole(rolePermissions);
        }
      }
    } catch (err) {
      console.error("Error saving permissions:", err);
      console.error("Error details:", err.errors);
      // Detallı error mesajı göstər
      const errorMessage = err.allErrors && err.allErrors.length > 0 
        ? err.allErrors.join(", ")
        : err.message || t("permissions.permissions.saveError") || "İcazələr yadda saxlanarkən xəta baş verdi";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Section title bar */}
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

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <Typography variant="small" className="text-red-600 dark:text-red-400">
            {error}
          </Typography>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <Typography variant="small" className="text-green-600 dark:text-green-400">
            {success}
          </Typography>
        </div>
      )}

      {/* Two Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Left Panel - Roles */}
        <div className="h-full min-h-[400px]">
          <RolesPanel
            roles={roles}
            loading={rolesLoading}
            selectedRoleId={selectedRoleId}
            onRoleSelect={handleRoleSelect}
            onCreateClick={handleCreateClick}
            onEditClick={handleEditClick}
          />
        </div>

        {/* Right Panel - Permissions */}
        <div className="h-full min-h-[400px]">
          <PermissionsPanel
            modules={modules}
            loading={permissionsLoading}
            selectedPermissions={selectedPermissions}
            onPermissionToggle={handlePermissionToggle}
            onModuleToggle={handleModuleToggle}
          />
        </div>
      </div>

      {/* Create Role Modal */}
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

      {/* Edit Role Modal */}
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
    </div>
  );
};

export default PermissionsPage;

