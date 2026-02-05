export const KEY = {
  mtkList: "mtk:list",
  complexList: "complex:list",
  buildingList: "building:list",
  blockList: "block:list",
  propertiesList: "properties:list",
  residentsList: "residents:list",
};

export const selectList = (cache, key) => cache?.[key]?.data?.data || cache?.[key]?.data || [];

export const getMtks = (cache) => selectList(cache, KEY.mtkList);

export const getComplexes = (cache, mtkId) => {
  const all = selectList(cache, KEY.complexList);
  if (!mtkId) return all;
  return all.filter((c) => String(c.mtk_id || c.mtkId) === String(mtkId));
};

export const getBuildings = (cache, complexId) => {
  const all = selectList(cache, KEY.buildingList);
  if (!complexId) return all;
  return all.filter((b) => String(b.complex_id || b.complexId) === String(complexId));
};

export const getBlocks = (cache, buildingId) => {
  const all = selectList(cache, KEY.blockList);
  if (!buildingId) return all;
  return all.filter((bl) => String(bl.building_id || bl.buildingId) === String(buildingId));
};
