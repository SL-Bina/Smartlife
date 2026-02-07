import React, { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Spinner,
  Chip,
  IconButton,
  Input,
} from "@material-tailwind/react";
import {
  PlusIcon,
  UserGroupIcon,
  PencilIcon,
  MagnifyingGlassIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function RolesPanel({
  roles,
  loading,
  selectedRoleId,
  onRoleSelect,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = () => "green";

  const getRoleId = (role) => role.role_id ?? role.id;
  const getRoleName = (role) => role.role_name ?? role.name ?? "";

  const filteredRoles = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return roles || [];

    return (roles || []).filter((role) => {
      const id = String(getRoleId(role) ?? "").toLowerCase();
      const name = getRoleName(role).toLowerCase();
      const label = (t(`permissions.rolesDict.${getRoleName(role)}`) || getRoleName(role)).toLowerCase();

      return id.includes(q) || name.includes(q) || label.includes(q);
    });
  }, [roles, searchTerm, t]);

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
            {t("permissions.roles.title") || "Hüquqlar"}
          </Typography>

          <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
            {t("permissions.roles.total") || "Cəmi"}: {roles?.length || 0}{" "}
            {t("permissions.roles.role") || "rol"}
          </Typography>
        </div>

        <div className="relative mb-3">
          <Input
            type="text"
            placeholder={t("permissions.searchRoles") || t("permissions.search") || "Axtarış..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full dark:text-white dark:bg-gray-800/50 pr-10 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400"
            labelProps={{ className: "dark:text-gray-300" }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 dark:text-gray-400" />
          </div>
        </div>

        <Button
          color="purple"
          size="sm"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white border-0 w-full"
          onClick={onCreateClick}
        >
          <PlusIcon className="h-4 w-4" />
          {t("permissions.roles.create") || "Hüquq yarat"}
        </Button>
      </CardHeader>

      <CardBody className="p-0 dark:bg-gray-800 flex-1 min-h-0 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Spinner className="h-6 w-6 dark:text-blue-400" />
            <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
              {t("permissions.loading") || "Yüklənir..."}
            </Typography>
          </div>
        ) : !filteredRoles || filteredRoles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Typography variant="small" className="text-blue-gray-400 dark:text-gray-400">
              {searchTerm
                ? t("permissions.roles.noRolesFiltered") || "Axtarışa uyğun rol tapılmadı"
                : t("permissions.roles.noRoles") || "Rol tapılmadı"}
            </Typography>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredRoles.map((role) => {
              const roleId = getRoleId(role);
              const roleName = getRoleName(role);
              const roleLabel = t(`permissions.rolesDict.${roleName}`) || roleName;

              return (
                <div
                  key={roleId}
                  onClick={() => onRoleSelect(roleId)}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-all
                    ${selectedRoleId === roleId
                      ? "bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700"
                      : "bg-white dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/70"
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="bg-purple-100 dark:bg-purple-900/40 p-1.5 rounded-full flex-shrink-0">
                        <UserGroupIcon className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold dark:text-white text-sm truncate"
                        >
                          {roleLabel}
                        </Typography>

                        <Typography variant="small" className="text-xs text-blue-gray-400 dark:text-gray-400">
                          ID: {roleId}
                        </Typography>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Chip
                        value={t("permissions.status.active") || "Aktiv"}
                        color={getStatusColor()}
                        size="sm"
                        className="dark:bg-green-600 dark:text-white text-xs"
                      />

                      <IconButton
                        size="sm"
                        variant="text"
                        color="blue-gray"
                        className="dark:text-gray-300 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClick(role);
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
                          onDeleteClick(role);
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </IconButton>
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
