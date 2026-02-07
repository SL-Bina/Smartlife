import React, { useMemo, useState } from "react";
import { Card, Typography, Button, Input, IconButton } from "@material-tailwind/react";
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function PermissionAdminDrawer({
  modules,
  onCreate,
  onEdit,
  onDelete,
}) {
  const { t } = useTranslation();
  const [q, setQ] = useState("");

  // flat permissions list
  const all = useMemo(() => {
    const list = [];
    (modules || []).forEach((item) => {
      const m = item?.module;
      if (!m?.name) return;
      (m.permissions || []).forEach((p) => {
        list.push({ moduleId: m.id, moduleName: m.name, permission: p });
      });
    });
    return list;
  }, [modules]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return all;
    return all.filter((x) => {
      const p = x.permission || {};
      const title = (p.details || p.detail || "").toLowerCase();
      const code = (p.permission || "").toLowerCase();
      const moduleName = (x.moduleName || "").toLowerCase();
      return title.includes(s) || code.includes(s) || moduleName.includes(s);
    });
  }, [all, q]);

  return (
    <Card className="h-full dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Typography variant="h6" className="font-bold dark:text-white">
            {t("permissions.permissions.manage") || "Permission idarəetmə"}
          </Typography>
          <Typography variant="small" className="dark:text-gray-300">
            {all.length}
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
          {t("permissions.permissions.create") || "İcazə yarat"}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.map((x) => {
          const p = x.permission;
          const title = p.details || p.detail || p.permission;

          return (
            <div
              key={p.id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Typography className="font-semibold text-sm dark:text-white truncate">
                    {title}
                  </Typography>
                  <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
                    {x.moduleName} • {p.permission} • ID: {p.id}
                  </Typography>
                </div>

                <div className="flex gap-1">
                  <IconButton
                    size="sm"
                    variant="text"
                    className="dark:text-gray-200"
                    onClick={() => onEdit({ moduleId: x.moduleId, moduleName: x.moduleName, permission: p })}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    size="sm"
                    variant="text"
                    color="red"
                    onClick={() => onDelete({ moduleId: x.moduleId, moduleName: x.moduleName, permission: p })}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
