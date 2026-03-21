import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
  CursorArrowRaysIcon,
} from "@heroicons/react/24/outline";
import { CheckBadgeIcon, Squares2X2Icon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { useMtkColor } from "@/store/hooks/useMtkColor";

/* ─── tiny sub-components ─────────────────────────────────────────── */

function ModuleCard({
  moduleName,
  perms,
  selectedPermissions,
  isModuleAllSelected,
  isModuleSomeSelected,
  isPermissionSelected,
  onModuleToggle,
  onPermissionToggle,
  onEditPermission,
  onDeletePermission,
  moduleId,
  trModule,
  trAction,
  checkboxRef,
  getMtkRgba,
  getActiveGradient,
}) {
  const ids = perms.map((p) => p.id);
  const allSel = isModuleAllSelected(moduleName, ids);
  const someSel = isModuleSomeSelected(moduleName, ids);
  const selectedCount = (selectedPermissions?.[moduleName] || []).length;
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden border transition-all duration-200 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md"
      style={{
        borderColor: someSel ? getMtkRgba(0.35) : "rgb(229,231,235)",
      }}
    >
      {/* Card header */}
      <div
        className="flex items-center gap-2 px-3.5 py-3 border-b border-gray-100 dark:border-gray-700/60"
        style={{
          background: someSel
            ? `linear-gradient(135deg, ${getMtkRgba(0.08)}, ${getMtkRgba(0.04)})`
            : "rgba(249,250,251,1)",
        }}
      >
        {/* Select-all checkbox */}
        <input
          type="checkbox"
          ref={checkboxRef}
          checked={allSel}
          onChange={() => onModuleToggle(moduleName, ids)}
          className="h-4 w-4 rounded cursor-pointer flex-shrink-0 accent-current"
          style={{ accentColor: getMtkRgba(1) }}
        />

        {/* Module icon */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: someSel ? getMtkRgba(0.15) : "rgba(229,231,235,0.8)" }}
        >
          <ShieldCheckIcon
            className="h-3.5 w-3.5"
            style={{ color: someSel ? getMtkRgba(1) : "#9ca3af" }}
          />
        </div>

        <span className="flex-1 text-xs font-bold text-gray-700 dark:text-gray-200 truncate capitalize">
          {trModule(moduleName)}
        </span>

        {/* Count badge */}
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{
            backgroundColor: someSel ? getMtkRgba(0.15) : "rgba(229,231,235,1)",
            color: someSel ? getMtkRgba(1) : "#6b7280",
          }}
        >
          {selectedCount}/{perms.length}
        </span>
      </div>

      {/* Permission rows */}
      <div className="flex-1 divide-y divide-gray-50 dark:divide-gray-700/40">
        {perms.map((permission) => {
          const isSel = isPermissionSelected(moduleName, permission.id);
          const title = permission.details || permission.detail || trAction(permission.permission);
          const codeLabel = trAction(permission.permission);

          return (
            <div
              key={permission.id}
              onClick={() => onPermissionToggle(moduleName, permission.id)}
              className="group flex items-center gap-2.5 px-3.5 py-2 cursor-pointer transition-colors"
              style={{ backgroundColor: isSel ? getMtkRgba(0.045) : "transparent" }}
            >
              {/* Toggle visual */}
              <div
                className="relative flex-shrink-0 w-8 h-4 rounded-full transition-all duration-200 border"
                style={{
                  backgroundColor: isSel ? getMtkRgba(0.85) : "transparent",
                  borderColor: isSel ? getMtkRgba(0.85) : "rgb(209,213,219)",
                }}
              >
                <span
                  className="absolute top-0.5 h-3 w-3 rounded-full bg-white shadow-sm transition-all duration-200"
                  style={{ left: isSel ? "calc(100% - 14px)" : "2px" }}
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: isSel ? getMtkRgba(1) : "" }}
                >
                  <span className={isSel ? "" : "text-gray-700 dark:text-gray-300"}>{title}</span>
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate font-mono">{codeLabel}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={t("buttons.edit") || "Düzəliş"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditPermission?.({ moduleId, moduleName, permission });
                  }}
                >
                  <PencilSquareIcon className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                </button>
                <button
                  className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                  title={t("buttons.delete") || "Sil"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePermission?.({ moduleId, moduleName, permission });
                  }}
                >
                  <TrashIcon className="h-3 w-3 text-gray-400 dark:text-gray-500 hover:text-red-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── main export ──────────────────────────────────────────────────── */

export function PermissionsPanel({
  modules,
  loading,
  selectedPermissions,
  onPermissionToggle,
  onModuleToggle,
  onCreateClick,
  onEditPermission,
  onDeletePermission,
  selectedRoleId,
  selectedRoleName,
}) {
  const { getRgba: getMtkRgba, getActiveGradient } = useMtkColor();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const checkboxRefs = useRef({});

  const permissionsByModule = (modules || []).reduce((acc, item) => {
    const module = item?.module;
    if (!module?.name) return acc;
    const perms = Array.isArray(module.permissions) ? module.permissions : [];
    if (perms.length) acc[module.name] = perms;
    return acc;
  }, {});

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

  const filteredPermissions = Object.entries(permissionsByModule).reduce((acc, [moduleName, perms]) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return acc;
    const moduleLabel = trModule(moduleName).toLowerCase();
    const filtered = (perms || []).filter((perm) => {
      const details = (perm.details || perm.detail || "").toLowerCase();
      const code = (perm.permission || "").toLowerCase();
      const codeTr = trAction(perm.permission || "").toLowerCase();
      return (
        details.includes(q) || code.includes(q) || codeTr.includes(q) ||
        moduleName.toLowerCase().includes(q) || moduleLabel.includes(q)
      );
    });
    if (filtered.length) acc[moduleName] = filtered;
    return acc;
  }, {});

  const dataToRender = searchTerm ? filteredPermissions : permissionsByModule;

  const totalPermissions = Object.values(permissionsByModule).reduce(
    (sum, perms) => sum + (Array.isArray(perms) ? perms.length : 0),
    0
  );

  const totalSelected = Object.values(selectedPermissions || {}).reduce(
    (sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0),
    0
  );

  /* ── Empty state when no role selected ── */
  if (!selectedRoleId) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 shadow-sm p-8 text-center">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 mx-auto"
          style={{ background: getActiveGradient(0.12, 0.06) }}
        >
          <CursorArrowRaysIcon className="h-9 w-9" style={{ color: getMtkRgba(0.7) }} />
        </div>
        <p className="text-base font-bold text-gray-700 dark:text-gray-200 mb-1">
          {t("permissions.selectRoleHint.title") || "Rol seçin"}
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">
          {t("permissions.selectRoleHint.desc") || "İcazələri görmək və redaktə etmək üçün sol paneldən bir rol seçin"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700/60 shadow-sm overflow-hidden">

      {/* ── Toolbar — sticky so it stays visible while scrolling ── */}
      <div className="sticky top-0 z-10 flex-shrink-0 flex flex-wrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 border-b border-gray-100 dark:border-gray-700/60 bg-white dark:bg-gray-900">

        {/* Module icon + role name */}
        <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: getActiveGradient(0.85, 0.65) }}
          >
            <LockOpenIcon className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 truncate">
            {selectedRoleName
              ? (t(`permissions.rolesDict.${selectedRoleName}`) || selectedRoleName)
              : (t("permissions.permissionsTitle") || "İcazələr")}
          </span>
        </div>

        {/* Stats chips */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
            style={{ backgroundColor: getMtkRgba(0.1), color: getMtkRgba(1) }}
          >
            <Squares2X2Icon className="h-3 w-3" />
            {Object.keys(permissionsByModule).length} {t("permissions.modulesCount") || "modul"}
          </span>
          <span
            className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full"
            style={{
              backgroundColor: totalSelected > 0 ? getMtkRgba(0.1) : "rgba(243,244,246,1)",
              color: totalSelected > 0 ? getMtkRgba(1) : "#9ca3af",
            }}
          >
            <CheckBadgeIcon className="h-3 w-3" />
            {totalSelected}/{totalPermissions}
          </span>
        </div>

        <div className="flex-1 hidden sm:block" />

        {/* Search */}
        <div className="relative order-last sm:order-none w-full sm:w-52 md:w-64 flex-shrink-0">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder={t("permissions.search") || "Axtar..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all"
          />
        </div>

        {/* Create permission button */}
        <button
          onClick={onCreateClick}
          className="ml-auto sm:ml-0 flex-shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90 shadow-sm"
          style={{ background: getActiveGradient(0.9, 0.75) }}
        >
          <PlusIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t("permissions.permissions.create") || "İcazə yarat"}</span>
        </button>
      </div>

      {/* ── Permission cards grid ── */}
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700/60 bg-white dark:bg-gray-900 animate-pulse"
              >
                {/* Card header skeleton */}
                <div
                  className="flex items-center gap-2 px-3.5 py-3 border-b border-gray-100 dark:border-gray-700/60"
                  style={{ backgroundColor: getMtkRgba(0.04) }}
                >
                  <div className="h-4 w-4 rounded flex-shrink-0" style={{ backgroundColor: getMtkRgba(0.12) }} />
                  <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ backgroundColor: getMtkRgba(0.1) }} />
                  <div className="flex-1 h-3 rounded-full" style={{ backgroundColor: getMtkRgba(0.08), width: "60%" }} />
                  <div className="h-4 w-8 rounded-full flex-shrink-0" style={{ backgroundColor: getMtkRgba(0.08) }} />
                </div>
                {/* Rows skeleton */}
                <div className="divide-y divide-gray-50 dark:divide-gray-700/40">
                  {Array.from({ length: 3 + (i % 3) }).map((_, j) => (
                    <div key={j} className="flex items-center gap-2.5 px-3.5 py-2.5">
                      <div className="w-8 h-4 rounded-full flex-shrink-0 bg-gray-100 dark:bg-gray-700" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-700" style={{ width: `${50 + (j * 15) % 40}%` }} />
                        <div className="h-2 rounded-full bg-gray-50 dark:bg-gray-800" style={{ width: `${30 + (j * 10) % 30}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : Object.keys(dataToRender).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <LockClosedIcon className="h-12 w-12 text-gray-300 dark:text-gray-600" />
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {t("permissions.permissions.noPermissions") || "İcazə tapılmadı"}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3">
            {Object.entries(dataToRender).map(([moduleName, perms]) => {
              if (!Array.isArray(perms) || perms.length === 0) return null;
              const moduleId = moduleIdByName[moduleName];

              return (
                <ModuleCard
                  key={moduleName}
                  moduleName={moduleName}
                  perms={perms}
                  selectedPermissions={selectedPermissions}
                  isModuleAllSelected={isModuleAllSelected}
                  isModuleSomeSelected={isModuleSomeSelected}
                  isPermissionSelected={isPermissionSelected}
                  onModuleToggle={onModuleToggle}
                  onPermissionToggle={onPermissionToggle}
                  onEditPermission={onEditPermission}
                  onDeletePermission={onDeletePermission}
                  moduleId={moduleId}
                  trModule={trModule}
                  trAction={trAction}
                  checkboxRef={(el) => { checkboxRefs.current[moduleName] = el; }}
                  getMtkRgba={getMtkRgba}
                  getActiveGradient={getActiveGradient}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
