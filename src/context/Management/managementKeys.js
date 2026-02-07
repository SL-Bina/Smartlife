export const KEY = {
  mtkList: "mtk:list",
  complexList: "complex:list",
  buildingList: "building:list",
  blockList: "block:list",
  propertiesList: "properties:list",
  residentsList: "residents:list",
};

export const buildKey = (baseKey, params = {}) => {
  const normalized = Object.keys(params)
    .sort()
    .reduce((acc, k) => {
      const v = params[k];
      if (v === undefined || v === null || v === "") return acc;
      acc[k] = String(v);
      return acc;
    }, {});
  return `${baseKey}?${JSON.stringify(normalized)}`;
};
