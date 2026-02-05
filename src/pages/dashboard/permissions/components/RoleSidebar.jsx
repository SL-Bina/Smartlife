import React, { useMemo, useState } from "react";
import { Card, Typography, Button, Input, Spinner, IconButton } from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function RoleSidebar({
  roles,
  loading,
  selectedRoleId,
  onSelect,
  onCreate,
  onEdit,
  onDelete,
}) {
  const { t } = useTranslation();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return roles || [];
    return (roles || []).filter((r) => (r?.name || r?.role_name || "").toLowerCase().includes(s));
  }, [roles, q]);

  return (
    <Card className="h-full dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Typography variant="h6" className="font-bold dark:text-white">
            {t("permissions.roles.title") || "Rollar"}
          </Typography>
          <Typography variant="small" className="dark:text-gray-300">
            {(roles?.length || 0)} {t("permissions.roles.role") || "rol"}
          </Typography>
        </div>

        <div className="relative mt-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("permissions.search") || "Axtarış..."}
            className="dark:text-white dark:bg-gray-800/60 pr-10"
            labelProps={{ className: "hidden" }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Button
          onClick={onCreate}
          size="sm"
          className="mt-3 w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          {t("permissions.roles.create") || "Rol yarat"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="py-10 flex items-center justify-center">
            <Spinner className="h-6 w-6" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center">
            <Typography variant="small" className="text-gray-500 dark:text-gray-400">
              {t("permissions.roles.noRoles") || "Rol tapılmadı"}
            </Typography>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((role) => {
              const id = role.role_id ?? role.id;
              const name = role.role_name ?? role.name;
              const active = String(selectedRoleId) === String(id);

              return (
                <div
                  key={id}
                  onClick={() => onSelect(id)}
                  className={[
                    "group cursor-pointer rounded-xl border p-3 transition",
                    active
                      ? "border-purple-400 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-700"
                      : "border-gray-200 bg-white hover:bg-gray-50 dark:bg-gray-800/40 dark:border-gray-700 dark:hover:bg-gray-800",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Typography className="font-semibold text-sm dark:text-white truncate">
                        {name}
                      </Typography>
                      <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                        ID: {id}
                      </Typography>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <IconButton
                        size="sm"
                        variant="text"
                        className="dark:text-gray-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(role);
                        }}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        size="sm"
                        variant="text"
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(role);
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
      </div>
    </Card>
  );
}
