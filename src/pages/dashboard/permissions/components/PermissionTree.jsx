import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { Card, Typography, Input, Spinner, IconButton } from "@material-tailwind/react";
import { ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export default function PermissionTree({
  modules,
  loading,
  selectedPermissions,
  onPermissionToggle,
  onModuleToggle,
}) {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState({});
  const checkboxRefs = useRef({});

  const permissionsByModule = useMemo(() => {
    return (modules || []).reduce((acc, item) => {
      const m = item?.module;
      if (!m?.name) return acc;
      acc[m.name] = Array.isArray(m.permissions) ? m.permissions : [];
      return acc;
    }, {});
  }, [modules]);

  const trModule = (name) => t(`permissions.modules.${name}`) || name;
  const trAction = (code) => t(`permissions.actions.${code}`) || code;

  const isPermissionSelected = useCallback(
    (moduleName, id) => (selectedPermissions?.[moduleName] || []).some((x) => String(x) === String(id)),
    [selectedPermissions]
  );

  const isModuleAllSelected = useCallback(
    (moduleName, ids) => {
      if (!ids.length) return false;
      const sel = selectedPermissions?.[moduleName] || [];
      return ids.every((id) => sel.some((x) => String(x) === String(id)));
    },
    [selectedPermissions]
  );

  const isModuleSomeSelected = useCallback(
    (moduleName, ids) => {
      if (!ids.length) return false;
      const sel = selectedPermissions?.[moduleName] || [];
      return ids.some((id) => sel.some((x) => String(x) === String(id)));
    },
    [selectedPermissions]
  );

  useEffect(() => {
    Object.keys(permissionsByModule).forEach((moduleName) => {
      const ids = (permissionsByModule[moduleName] || []).map((p) => p.id);
      const all = isModuleAllSelected(moduleName, ids);
      const some = isModuleSomeSelected(moduleName, ids);
      const checkbox = checkboxRefs.current[moduleName];
      if (checkbox) checkbox.indeterminate = some && !all;
    });
  }, [permissionsByModule, isModuleAllSelected, isModuleSomeSelected, selectedPermissions]);

  const data = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return permissionsByModule;

    const out = {};
    for (const [moduleName, perms] of Object.entries(permissionsByModule)) {
      const moduleLabel = trModule(moduleName).toLowerCase();
      const filtered = (perms || []).filter((p) => {
        const title = (p.details || p.detail || "").toLowerCase();
        const code = (p.permission || "").toLowerCase();
        const codeTr = trAction(p.permission || "").toLowerCase();
        return (
          title.includes(s) ||
          code.includes(s) ||
          codeTr.includes(s) ||
          moduleName.toLowerCase().includes(s) ||
          moduleLabel.includes(s)
        );
      });
      if (filtered.length) out[moduleName] = filtered;
    }
    return out;
  }, [q, permissionsByModule, trModule, trAction]);

  const toggleOpen = (moduleName) => setOpen((p) => ({ ...p, [moduleName]: !p[moduleName] }));

  return (
    <Card className="h-full dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Typography variant="h6" className="font-bold dark:text-white">
          {t("permissions.permissions.title") || "İcazələr"}
        </Typography>

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
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="py-10 flex items-center justify-center">
            <Spinner className="h-6 w-6" />
          </div>
        ) : Object.keys(data).length === 0 ? (
          <div className="py-10 text-center">
            <Typography variant="small" className="text-gray-500 dark:text-gray-400">
              {t("permissions.permissions.noPermissions") || "İcazə tapılmadı"}
            </Typography>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(data).map(([moduleName, perms]) => {
              const ids = (perms || []).map((p) => p.id);
              const allSelected = isModuleAllSelected(moduleName, ids);

              return (
                <div key={moduleName} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div
                    className="p-3 bg-white dark:bg-gray-800/50 flex items-center gap-3 cursor-pointer"
                    onClick={() => toggleOpen(moduleName)}
                  >
                    <input
                      type="checkbox"
                      ref={(el) => (checkboxRefs.current[moduleName] = el)}
                      checked={allSelected}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => onModuleToggle(moduleName, ids)}
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                    />
                    <div className="min-w-0 flex-1">
                      <Typography className="font-semibold text-sm dark:text-white truncate">
                        {trModule(moduleName)}
                      </Typography>
                      <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
                        {perms.length} {t("permissions.permissions.permission") || "icazə"}
                      </Typography>
                    </div>

                    <IconButton variant="text" size="sm" className="dark:text-gray-200">
                      <ChevronDownIcon
                        className={[
                          "h-4 w-4 transition-transform duration-200",
                          open[moduleName] ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </IconButton>
                  </div>

                  {open[moduleName] ? (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/30 space-y-2">
                      {(perms || []).map((p) => {
                        const checked = isPermissionSelected(moduleName, p.id);
                        const title = p.details || p.detail || trAction(p.permission);

                        return (
                          <div
                            key={p.id}
                            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 p-2 flex items-start gap-3"
                            onClick={() => onPermissionToggle(moduleName, p.id)}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => onPermissionToggle(moduleName, p.id)}
                              className="h-4 w-4 mt-0.5 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <div className="min-w-0 flex-1">
                              <Typography className="text-sm font-medium dark:text-white">
                                {title}
                              </Typography>
                              <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
                                {trAction(p.permission)}
                              </Typography>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
