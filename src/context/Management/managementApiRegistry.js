import { http } from "@/services/http";
import { KEY } from "./managementKeys";

const EP = {
  mtkList: "/mtk/list",
  complexList: "/complex/list",
  buildingList: "/buildings/list",
  blockList: "/blocks/list",
  propertiesList: "/properties/list",
  residentsList: "/residents/list",
};

export const registry = {
  [KEY.mtkList]: async ({ params } = {}) => {
    const res = await http.get(EP.mtkList, { params });
    return res.data;
  },
  [KEY.complexList]: async ({ params } = {}) => {
    const res = await http.get(EP.complexList, { params });
    return res.data;
  },
  [KEY.buildingList]: async ({ params } = {}) => {
    const res = await http.get(EP.buildingList, { params });
    return res.data;
  },
  [KEY.blockList]: async ({ params } = {}) => {
    const res = await http.get(EP.blockList, { params });
    return res.data;
  },
  [KEY.propertiesList]: async ({ params } = {}) => {
    const res = await http.get(EP.propertiesList, { params });
    return res.data;
  },
  [KEY.residentsList]: async ({ params } = {}) => {
    const res = await http.get(EP.residentsList, { params });
    return res.data;
  },
};
