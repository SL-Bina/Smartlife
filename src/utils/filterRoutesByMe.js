import { hasPermissionById } from "./permissions";

export function filterRoutesByMe(routes, meOrUser, { forSidenav = false } = {}) {
  const permsById = (meOrUser?.modules || meOrUser?.data?.modules)
    ? new Map((meOrUser?.modules || meOrUser?.data?.modules).map((m) => [Number(m.id), new Set(m.can || [])]))
    : new Map();

  const walk = (node) => {
    if (node.pages?.length) {
      const pages = node.pages.map(walk).filter(Boolean);
      if (!pages.length) return null;
      return { ...node, pages };
    }

    if (node.children?.length) {
      const children = node.children.map(walk).filter(Boolean);
      if (!children.length) return null;
      if (forSidenav && node.hideInSidenav) return null;
      return { ...node, children };
    }

    const ok = hasPermissionById(permsById, node.moduleId, node.need);

    if (!ok) return null;
    if (forSidenav && node.hideInSidenav) return null;

    return node;
  };

  return routes.map(walk).filter(Boolean);
}
