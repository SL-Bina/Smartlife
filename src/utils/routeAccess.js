export function buildModulesIndex(userModules = []) {
  const byId = new Map();
  const byName = new Map();

  (userModules || []).forEach((m) => {
    if (!m) return;
    if (m.id != null) byId.set(Number(m.id), m);
    if (m.name) byName.set(String(m.name).toLowerCase(), m);
  });

  return { byId, byName };
}

export function canAccessRoute(route, modulesIndex) {
  if (!route?.moduleId) return true;

  const mod = modulesIndex.byId.get(Number(route.moduleId));
  if (!mod) return false;

  const need = Array.isArray(route.need) ? route.need : [];
  if (need.length === 0) return true;

  const can = Array.isArray(mod.can) ? mod.can : [];
  return need.every((p) => can.includes(p));
}

export function filterRoutesByAccess(allRoutes = [], userModules = []) {
  const modulesIndex = buildModulesIndex(userModules);

  const filteredLayouts = (allRoutes || [])
    .map((layoutBlock) => {
      const pages = (layoutBlock.pages || [])
        .map((page) => {
          if (Array.isArray(page.children) && page.children.length > 0) {
            const children = page.children.filter((ch) => canAccessRoute(ch, modulesIndex));

            if (children.length === 0) return null;

            if (!canAccessRoute(page, modulesIndex) && page.moduleId) {
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
