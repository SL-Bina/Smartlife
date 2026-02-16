import { useState, useEffect } from "react";
import { userLookupsAPI } from "../api/lookups";

const normalizeList = (res) => {
  if (res?.data?.data) return res.data.data;
  if (res?.data) return Array.isArray(res.data) ? res.data : [];
  if (Array.isArray(res)) return res;
  return [];
};

export function useUserAddLookups(open) {
  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);
  const [mtks, setMtks] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [permissions, setPermissions] = useState([]);

  const [loading, setLoading] = useState({
    roles: false,
    modules: false,
    mtks: false,
    complexes: false,
    permissions: false,
  });

  const [error, setError] = useState({
    roles: null,
    modules: null,
    mtks: null,
    complexes: null,
    permissions: null,
  });

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    const run = async () => {
      setError({
        roles: null,
        modules: null,
        mtks: null,
        complexes: null,
        permissions: null,
      });
      setLoading({
        roles: true,
        modules: true,
        mtks: true,
        complexes: true,
        permissions: true,
      });

      try {
        const [rolesRes, modulesRes, mtksRes, complexesRes, permissionsRes] =
          await Promise.allSettled([
            userLookupsAPI.getRoles(),
            userLookupsAPI.getModules(),
            userLookupsAPI.getMtks(),
            userLookupsAPI.getComplexes(),
            userLookupsAPI.getModules(), // Permissions are in modules
          ]);

        if (!mounted) return;

        if (rolesRes.status === "fulfilled") {
          const rolesData = normalizeList(rolesRes.value);
          const formattedRoles = rolesData.map((role) => ({
            id: role.role_id || role.id,
            name: role.role_name || role.name,
          }));
          setRoles(formattedRoles);
        } else {
          setRoles([]);
          setError((p) => ({
            ...p,
            roles: rolesRes.reason?.message || "Rollar yüklənə bilmədi",
          }));
        }

        if (modulesRes.status === "fulfilled") {
          const modulesData = normalizeList(modulesRes.value);
          setModules(modulesData);
        } else {
          setModules([]);
          setError((p) => ({
            ...p,
            modules: modulesRes.reason?.message || "Modullar yüklənə bilmədi",
          }));
        }

        if (mtksRes.status === "fulfilled") {
          setMtks(normalizeList(mtksRes.value));
        } else {
          setMtks([]);
          setError((p) => ({
            ...p,
            mtks: mtksRes.reason?.message || "MTK list alınmadı",
          }));
        }

        if (complexesRes.status === "fulfilled") {
          setComplexes(normalizeList(complexesRes.value));
        } else {
          setComplexes([]);
          setError((p) => ({
            ...p,
            complexes: complexesRes.reason?.message || "Complex list alınmadı",
          }));
        }

        if (permissionsRes.status === "fulfilled") {
          const modulesData = normalizeList(permissionsRes.value);
          // Extract all permissions from modules
          const allPermissions = [];
          modulesData.forEach((module) => {
            if (module.module?.permissions && Array.isArray(module.module.permissions)) {
              module.module.permissions.forEach((perm) => {
                allPermissions.push({
                  id: perm.id,
                  name: perm.permission,
                  details: perm.details,
                  module_id: module.module.id,
                  module_name: module.module.name,
                });
              });
            }
          });
          setPermissions(allPermissions);
        } else {
          setPermissions([]);
          setError((p) => ({
            ...p,
            permissions: permissionsRes.reason?.message || "İcazələr yüklənə bilmədi",
          }));
        }
      } finally {
        if (!mounted) return;
        setLoading({
          roles: false,
          modules: false,
          mtks: false,
          complexes: false,
          permissions: false,
        });
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [open]);

  return {
    roles,
    modules,
    mtks,
    complexes,
    permissions,
    loading,
    error,
  };
}

