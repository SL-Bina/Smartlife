export function buildModulesIndex(userModules = [], roleAccessModules = [], userRole = null) {
  const byId = new Map();
  const byName = new Map();

  // Root role has access to all modules
  const isRoot = userRole?.toLowerCase() === 'root';

  // Build index from role_access_modules (more accurate)
  if (roleAccessModules && Array.isArray(roleAccessModules) && roleAccessModules.length > 0) {
    roleAccessModules.forEach((m) => {
      if (!m) return;
      if (m.module_id != null) {
        const permissions = (m.permissions || []).map((p) => p.permission);
        byId.set(Number(m.module_id), { id: m.module_id, name: m.module_name, can: permissions });
      }
      if (m.module_name) {
        const permissions = (m.permissions || []).map((p) => p.permission);
        byName.set(String(m.module_name).toLowerCase(), { id: m.module_id, name: m.module_name, can: permissions });
      }
    });
  }

  // Fallback to modules (for backward compatibility)
  (userModules || []).forEach((m) => {
    if (!m) return;
    if (m.id != null && !byId.has(Number(m.id))) {
      byId.set(Number(m.id), m);
    }
    if (m.name && !byName.has(String(m.name).toLowerCase())) {
      byName.set(String(m.name).toLowerCase(), m);
    }
  });

  return { byId, byName, isRoot };
}

export function canAccessRoute(route, modulesIndex) {
  // Root role has access to all routes
  if (modulesIndex.isRoot) {
    return true;
  }

  // Check by moduleName first (preferred)
  if (route?.moduleName) {
    const mod = modulesIndex.byName.get(String(route.moduleName).toLowerCase());
    if (!mod) return false;

    const need = Array.isArray(route.need) ? route.need : [];
    if (need.length === 0) return true;

    const can = Array.isArray(mod.can) ? mod.can : [];
    return need.every((p) => can.includes(p));
  }

  // Fallback to moduleId
  if (!route?.moduleId) return true;

  const mod = modulesIndex.byId.get(Number(route.moduleId));
  if (!mod) return false;

  const need = Array.isArray(route.need) ? route.need : [];
  if (need.length === 0) return true;

  const can = Array.isArray(mod.can) ? mod.can : [];
  return need.every((p) => can.includes(p));
}

export function filterRoutesByAccess(allRoutes = [], userModules = [], roleAccessModules = [], userRole = null) {
  const modulesIndex = buildModulesIndex(userModules, roleAccessModules, userRole);

  const filteredLayouts = (allRoutes || [])
    .map((layoutBlock) => {
      const pages = (layoutBlock.pages || [])
        .map((page) => {
          if (Array.isArray(page.children) && page.children.length > 0) {
            const children = page.children.filter((ch) => canAccessRoute(ch, modulesIndex));

            if (children.length === 0) return null;

            if (!canAccessRoute(page, modulesIndex) && (page.moduleId || page.moduleName)) {
              // parent bağlıdırsa, children görünsün istəmirsənsə burda null qaytar.
              // Mən sənin istədiyin kimi: children varsa parent görünür (group kimi)
              // return null;
            }

            return { ...page, children };
          }

          // normal route
          return canAccessRoute(page, modulesIndex) ? page : null;
        })
        .filter(Boolean);

      // layout boşdursa, çıxart
      if (pages.length === 0) return null;
      return { ...layoutBlock, pages };
    })
    .filter(Boolean);

  return filteredLayouts;
}
