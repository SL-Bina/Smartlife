/**
 * Filtered routes-dan ilk aktiv (görünən) səhifənin tam path-ını qaytarır.
 * Məs: "/dashboard/management/mtk" və ya "/resident/home"
 */
export function getFirstActivePath(filteredRoutes) {
  for (const route of filteredRoutes) {
    const layout = route.layout; // "dashboard" | "resident"
    for (const page of route.pages || []) {
      if (page.hideInSidenav) continue;

      if (page.children && page.children.length > 0) {
        const firstChild = page.children.find((ch) => !ch.hideInSidenav);
        if (firstChild?.path) {
          return `/${layout}${firstChild.path}`;
        }
      }

      if (page.path) {
        return `/${layout}${page.path}`;
      }
    }
  }

  return "/dashboard/home";
}

/**
 * Parent menu segment-lərini (məs: "management", "finance") ilk aktiv child path-a map edir.
 * Breadcrumb-da parent linkləri üçün istifadə olunur.
 * Nəticə: { "management": "/management/mtk", "finance": "/finance/invoices", ... }
 */
export function buildParentPathMap(filteredRoutes) {
  const map = {};

  for (const route of filteredRoutes) {
    for (const page of route.pages || []) {
      if (page.children && page.children.length > 0) {
        const firstChild = page.children.find((ch) => !ch.hideInSidenav);
        if (firstChild?.path) {
          // Path-dan parent segment-i çıxar: "/management/mtk" → "management"
          const segments = firstChild.path.split("/").filter(Boolean);
          if (segments.length > 1) {
            const parentSegment = segments[0];
            if (!map[parentSegment]) {
              map[parentSegment] = firstChild.path;
            }
          }
        }
      }
    }
  }

  return map;
}
