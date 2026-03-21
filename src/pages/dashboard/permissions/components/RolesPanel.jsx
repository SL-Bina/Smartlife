import React, { useMemo, useState } from "react";
import {
  PlusIcon,
  UserGroupIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { useMtkColor } from "@/store/hooks/useMtkColor";

export function RolesPanel({
  roles,
  loading,
  selectedRoleId,
  onRoleSelect,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}) {
  const { getRgba: getMtkRgba, getActiveGradient } = useMtkColor();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const getRoleId = (role) => role.role_id ?? role.id;
  const getRoleName = (role) => role.role_name ?? role.name ?? "";

  const filteredRoles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return roles || [];
    return (roles || []).filter((role) => {
      const name = getRoleName(role).toLowerCase();
      const label = (t(`permissions.rolesDict.${getRoleName(role)}`) || getRoleName(role)).toLowerCase();
      return name.includes(q) || label.includes(q);
    });
  }, [roles, searchTerm, t]);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700/60 overflow-hidden">
      {/* Sidebar header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100 dark:border-gray-700/60">
        {/* Title row + create button */}
        <div className="flex items-center gap-2 mb-3 flex-wrap sm:flex-nowrap">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: getActiveGradient(0.85, 0.65) }}
          >
            <UserGroupIcon className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
            {t("permissions.roles.title") || "Rollar"}
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: getMtkRgba(0.1), color: getMtkRgba(1) }}
          >
            {(roles || []).length}
          </span>
          {/* Create button — top right */}
          <button
            onClick={onCreateClick}
            title={t("permissions.roles.create") || "Yeni rol yarat"}
            className="ml-auto flex items-center justify-center gap-1 px-2 py-1.5 sm:px-2.5 rounded-lg text-white text-xs font-semibold transition-opacity hover:opacity-90 shadow-sm flex-shrink-0"
            style={{ background: getActiveGradient(0.9, 0.75) }}
          >
            <PlusIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("permissions.roles.create") || "Yeni rol"}</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder={t("permissions.searchRoles") || "Axtar..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
            style={{ focusRingColor: getMtkRgba(0.4) }}
          />
        </div>
      </div>

      {/* Role list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {loading ? (
          // Skeleton rows
          <div className="space-y-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl animate-pulse"
              >
                <div
                  className="w-8 h-8 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: getMtkRgba(0.1) }}
                />
                <div className="flex-1 space-y-1.5">
                  <div
                    className="h-3 rounded-full"
                    style={{ backgroundColor: getMtkRgba(0.08), width: `${55 + (i % 4) * 10}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2">
            <UserGroupIcon className="h-8 w-8 text-gray-300 dark:text-gray-600" />
            <span className="text-xs text-gray-400 italic text-center">
              {searchTerm
                ? t("permissions.roles.noRolesFiltered") || "Tapılmadı"
                : t("permissions.roles.noRoles") || "Rol yoxdur"}
            </span>
          </div>
        ) : (
          filteredRoles.map((role) => {
            const roleId = getRoleId(role);
            const roleName = getRoleName(role);
            const roleLabel = t(`permissions.rolesDict.${roleName}`) || roleName;
            const isSelected = selectedRoleId === roleId;

            return (
              <div
                key={roleId}
                onClick={() => onRoleSelect(roleId)}
                className="group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 select-none"
                style={
                  isSelected
                    ? {
                        background: getActiveGradient(0.9, 0.7),
                        boxShadow: `0 4px 14px ${getMtkRgba(0.3)}`,
                      }
                    : {}
                }
              >
                {!isSelected && (
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gray-50 dark:bg-gray-800" />
                )}

                {/* Role icon */}
                <div
                  className="relative w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isSelected ? "rgba(255,255,255,0.2)" : getMtkRgba(0.1),
                  }}
                >
                  {isSelected ? (
                    <CheckCircleIcon className="h-4 w-4 text-white" />
                  ) : (
                    <ShieldCheckIcon className="h-4 w-4" style={{ color: getMtkRgba(0.8) }} />
                  )}
                </div>

                {/* Role name */}
                <span
                  className="relative flex-1 text-xs font-semibold truncate"
                  style={{ color: isSelected ? "#fff" : "" }}
                >
                  <span className={isSelected ? "text-white" : "text-gray-700 dark:text-gray-200"}>
                    {roleLabel}
                  </span>
                </span>

                {/* Actions — only visible when hovered or selected */}
                <div
                  className={`relative flex items-center gap-0.5 flex-shrink-0 transition-opacity ${
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <button
                    title={t("buttons.edit") || "Düzəliş"}
                    onClick={(e) => { e.stopPropagation(); onEditClick(role); }}
                    className="p-1 rounded-md transition-colors"
                    style={{
                      color: isSelected ? "rgba(255,255,255,0.8)" : "",
                    }}
                  >
                    <PencilSquareIcon className={`h-3.5 w-3.5 ${isSelected ? "text-white/80 hover:text-white" : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"}`} />
                  </button>
                  <button
                    title={t("buttons.delete") || "Sil"}
                    onClick={(e) => { e.stopPropagation(); onDeleteClick(role); }}
                    className="p-1 rounded-md transition-colors"
                  >
                    <TrashIcon className={`h-3.5 w-3.5 ${isSelected ? "text-red-200 hover:text-red-100" : "text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"}`} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
