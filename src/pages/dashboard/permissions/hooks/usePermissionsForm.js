import { useState, useCallback } from "react";

const initialFormState = {
  name: "",
};

export function usePermissionsForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [selectedPermissions, setSelectedPermissions] = useState({}); // { moduleName: [permissionIds] }

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedPermissions({});
  };

  const setFormFromRole = (role) => {
    if (!role) {
      resetForm();
      return;
    }
    setFormData({
      name: role.name || role.role_name || "",
    });
  };

  // Permission toggle funksiyası
  const togglePermission = useCallback((moduleName, permissionId) => {
    setSelectedPermissions((prev) => {
      const modulePerms = prev[moduleName] || [];
      // Permission ID-ləri number və ya string ola bilər, hər ikisini yoxla
      const isSelected = modulePerms.some((id) => id == permissionId || String(id) === String(permissionId));
      
      return {
        ...prev,
        [moduleName]: isSelected
          ? modulePerms.filter((id) => id != permissionId && String(id) !== String(permissionId))
          : [...modulePerms, permissionId],
      };
    });
  }, []);

  // Bütün modul permission-larını toggle et
  const toggleModulePermissions = useCallback((moduleName, permissionIds) => {
    setSelectedPermissions((prev) => {
      const modulePerms = prev[moduleName] || [];
      // Permission ID-ləri number və ya string ola bilər, hər ikisini yoxla
      const allSelected = permissionIds.every((id) => 
        modulePerms.some((permId) => permId == id || String(permId) === String(id))
      );
      
      return {
        ...prev,
        [moduleName]: allSelected ? [] : [...permissionIds],
      };
    });
  }, []);

  // Bütün permission ID-ləri topla
  const getAllSelectedPermissionIds = () => {
    return Object.values(selectedPermissions).flat();
  };

  // Seçilmiş permission-ları set et (role-dən gələn məlumatlar üçün)
  const setSelectedPermissionsFromRole = useCallback((rolePermissions) => {
    // rolePermissions format: { moduleName: [permissionIds] }
    setSelectedPermissions(rolePermissions || {});
  }, []);

  return {
    formData,
    selectedPermissions,
    updateField,
    resetForm,
    setFormFromRole,
    togglePermission,
    toggleModulePermissions,
    getAllSelectedPermissionIds,
    setSelectedPermissionsFromRole,
  };
}

