import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Spinner,
  IconButton,
  Button,
  Input,
} from "@material-tailwind/react";
import {
  ShieldCheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function PermissionsPanel({
  modules,
  loading,
  selectedPermissions,
  onPermissionToggle,
  onModuleToggle,
  onCreateClick,
  onEditPermission,
  onDeletePermission,
}) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [openModules, setOpenModules] = useState({});
  const checkboxRefs = useRef({});

  // permissionsByModule: { [moduleName]: permissions[] }
  const permissionsByModule = (modules || []).reduce((acc, item) => {
    const module = item?.module;
    if (!module?.name) return acc;

    const moduleName = module.name;
    const perms = Array.isArray(module.permissions) ? module.permissions : [];

    if (perms.length) acc[moduleName] = perms;
    return acc;
  }, {});

  // moduleName -> moduleId map (edit/delete üçün mütləq lazımdır)
  const moduleIdByName = (modules || []).reduce((acc, item) => {
    const m = item?.module;
    if (m?.name && m?.id != null) acc[m.name] = m.id;
    return acc;
  }, {});

  const trModule = (moduleName) => t(`permissions.modules.${moduleName}`) || moduleName;
  const trAction = (actionCode) => t(`permissions.actions.${actionCode}`) || actionCode;

  const isPermissionSelected = useCallback(
    (moduleName, permissionId) => {
      const modulePerms = selectedPermissions?.[moduleName] || [];
      return modulePerms.some((id) => String(id) === String(permissionId));
    },
    [selectedPermissions]
  );

  const isModuleAllSelected = useCallback(
    (moduleName, permissionIds) => {
      if (!Array.isArray(permissionIds) || permissionIds.length === 0) return false;
      const modulePerms = selectedPermissions?.[moduleName] || [];
      return permissionIds.every((id) => modulePerms.some((permId) => String(permId) === String(id)));
    },
    [selectedPermissions]
  );

  const isModuleSomeSelected = useCallback(
    (moduleName, permissionIds) => {
      if (!Array.isArray(permissionIds) || permissionIds.length === 0) return false;
      const modulePerms = selectedPermissions?.[moduleName] || [];
      return permissionIds.some((id) => modulePerms.some((permId) => String(permId) === String(id)));
    },
    [selectedPermissions]
  );

  // indeterminate state
  useEffect(() => {
    Object.keys(permissionsByModule).forEach((moduleName) => {
      const perms = permissionsByModule[moduleName] || [];
      const ids = perms.map((p) => p.id);

      const allSelected = isModuleAllSelected(moduleName, ids);
      const someSelected = isModuleSomeSelected(moduleName, ids);

      const checkbox = checkboxRefs.current[moduleName];
      if (checkbox) checkbox.indeterminate = someSelected && !allSelected;
    });
  }, [permissionsByModule, selectedPermissions, isModuleAllSelected, isModuleSomeSelected]);

  // Filter
  const filteredPermissions = Object.entries(permissionsByModule).reduce((acc, [moduleName, perms]) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return acc;

    const moduleLabel = trModule(moduleName).toLowerCase();

    const filtered = (perms || []).filter((perm) => {
      const details = (perm.details || perm.detail || "").toLowerCase();
      const code = (perm.permission || "").toLowerCase();
      const codeTr = trAction(perm.permission || "").toLowerCase();

      return (
        details.includes(q) ||
        code.includes(q) ||
        codeTr.includes(q) ||
        moduleName.toLowerCase().includes(q) ||
        moduleLabel.includes(q)
      );
    });

    if (filtered.length) acc[moduleName] = filtered;
    return acc;
  }, {});

  const dataToRender = searchTerm ? filteredPermissions : permissionsByModule;

  const toggleModule = (moduleName) => {
    setOpenModules((prev) => ({ ...prev, [moduleName]: !prev[moduleName] }));
  };

  const totalPermissions = Object.values(permissionsByModule).reduce(
    (sum, perms) => sum + (Array.isArray(perms) ? perms.length : 0),
    0
  );

  return (
    <Card className="border border-red-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 max-h-[700px] h-full flex flex-col max-w-full">

      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="m-0 p-4 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0"
      >
        <div className="flex items-center justify-between mb-3">
          <Typography variant="h6" color="blue-gray" className="font-bold dark:text-white">
            {t("permissions.permissions.title") || "İcazələr"}
          </Typography>

          <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
            {t("permissions.permissions.total") || "Cəmi"}: {totalPermissions}{" "}
            {t("permissions.permissions.permission") || "icazə"}
          </Typography>
        </div>

        {/* SEARCH */}
        <div className="relative mb-3">
          <Input
            type="text"
            placeholder={t("permissions.search") || "Axtarış..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full dark:text-white dark:bg-gray-800/50 pr-10 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400"
            labelProps={{ className: "dark:text-gray-300" }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 dark:text-gray-400" />
          </div>
        </div>

        {/* ADD */}
        <Button
          color="purple"
          size="sm"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white border-0 w-full"
          onClick={onCreateClick}
        >
          <PlusIcon className="h-4 w-4" />
          {t("permissions.permissions.create") || "İcazə yarat"}
        </Button>
      </CardHeader>

      <CardBody className="p-4 dark:bg-gray-800 flex-1 min-h-0 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Spinner className="h-6 w-6 dark:text-blue-400" />
            <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
              {t("permissions.loading") || "Yüklənir..."}
            </Typography>
          </div>
        ) : Object.keys(dataToRender).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Typography variant="small" className="text-blue-gray-400 dark:text-gray-400">
              {t("permissions.permissions.noPermissions") || "İcazə tapılmadı"}
            </Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(dataToRender).map(([moduleName, perms]) => {
              if (!Array.isArray(perms) || perms.length === 0) return null;

              const ids = perms.map((p) => p.id);
              const allSelected = isModuleAllSelected(moduleName, ids);

              return (
                <div key={moduleName} className="space-y-2">
                  {/* Module Header */}
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 p-3 rounded-lg border border-purple-200 dark:border-purple-700/50 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          ref={(el) => {
                            checkboxRefs.current[moduleName] = el;
                          }}
                          checked={allSelected}
                          onChange={() => onModuleToggle(moduleName, ids)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-purple-600 cursor-pointer"
                        />
                      </div>

                      <div className="bg-white dark:bg-purple-900/60 p-1.5 rounded flex-shrink-0">
                        <ShieldCheckIcon className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                      </div>

                      <Typography variant="h6" className="font-semibold dark:text-white text-sm flex-1 capitalize">
                        {trModule(moduleName)}
                      </Typography>

                      <div className="bg-white dark:bg-gray-800 px-2.5 py-1 rounded-full">
                        <Typography variant="small" className="text-gray-600 dark:text-gray-300 text-xs font-medium">
                          {perms.length} {t("permissions.permissions.permission") || "icazə"}
                        </Typography>
                      </div>

                      <IconButton
                        variant="text"
                        size="sm"
                        onClick={() => toggleModule(moduleName)}
                        className="dark:text-white dark:hover:bg-purple-800/50"
                      >
                        <ChevronDownIcon
                          strokeWidth={2}
                          className={`h-4 w-4 transition-transform duration-300 ${openModules[moduleName] ? "rotate-180" : ""
                            }`}
                        />
                      </IconButton>
                    </div>
                  </div>

                  {/* Permissions List */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${openModules[moduleName] ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="space-y-2 pl-2 pt-2">
                      {perms.map((permission) => {
                        const isSelected = isPermissionSelected(moduleName, permission.id);

                        const title =
                          permission.details || permission.detail || trAction(permission.permission);

                        const codeLabel = trAction(permission.permission);

                        const moduleId = moduleIdByName[moduleName]; // ✅ dəqiq module id

                        return (
                          <div
                            key={permission.id}
                            className="flex items-center gap-3 p-2.5 bg-white dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700/50 transition-all duration-200 cursor-pointer group"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPermissionToggle(moduleName, permission.id);
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                e.stopPropagation();
                                onPermissionToggle(moduleName, permission.id);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-green-600 cursor-pointer flex-shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                              <Typography
                                variant="small"
                                className="dark:text-gray-200 text-sm font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate"
                              >
                                {title}
                              </Typography>

                              <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 truncate">
                                {codeLabel}
                              </Typography>
                            </div>

                            {/* Selected dot */}
                            {isSelected && (
                              <div className="flex-shrink-0">
                                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                              </div>
                            )}

                            {/* ✅ ACTIONS: EDIT / DELETE */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <IconButton
                                size="sm"
                                variant="text"
                                className="dark:text-gray-300 dark:hover:bg-gray-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditPermission?.({ moduleId, moduleName, permission });
                                }}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </IconButton>

                              <IconButton
                                size="sm"
                                variant="text"
                                color="red"
                                className="dark:hover:bg-red-900/30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeletePermission?.({ moduleId, moduleName, permission });
                                }}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </IconButton>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
