export function getUserModuleIds(meResponseOrUser) {
  const modules =
    meResponseOrUser?.data?.modules ||
    meResponseOrUser?.modules ||
    [];

  return new Set(modules.map((m) => Number(m.id)));
}

export function getUserModulePermsById(meResponseOrUser) {
  const modules =
    meResponseOrUser?.data?.modules ||
    meResponseOrUser?.modules ||
    [];

  const map = new Map();
  for (const m of modules) {
    map.set(Number(m.id), new Set((m.can || []).filter(Boolean)));
  }
  return map;
}

export function hasModuleAccessById(userModuleIdsSet, moduleId) {
  if (!moduleId) return true;
  return userModuleIdsSet.has(Number(moduleId));
}

export function hasPermissionById(permsByIdMap, moduleId, need = []) {
  if (!moduleId) return true;
  const perms = permsByIdMap.get(Number(moduleId));
  if (!perms) return false;
  if (!need || need.length === 0) return true;
  return need.some((p) => perms.has(p));
}
