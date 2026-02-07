import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import propertiesAPI from "../api";

// list response -> UI model mapping
const mapProperty = (p) => {
  const floor = p?.meta?.floor ?? null;
  const aptNumber = p?.meta?.apartment_number ?? null;
  const area = p?.meta?.area ?? null;

  // sub_data-dan block, building, complex, mtk götür
  const block = p?.block || p?.sub_data?.block || null;
  const building = p?.building || p?.sub_data?.building || null;
  const complex = p?.complex || p?.sub_data?.complex || null;
  const mtk = p?.mtk || p?.sub_data?.mtk || null;

  return {
    id: p?.id,
    name: p?.name || "",
    status: p?.status || "active",
    meta: p?.meta || {},
    block: block,
    building: building,
    complex: complex,
    mtk: mtk,
    block_id: p?.block_id ?? block?.id ?? null,
    building_id: p?.building_id ?? building?.id ?? null,
    complex_id: p?.complex_id ?? complex?.id ?? null,
    mtk_id: p?.mtk_id ?? mtk?.id ?? null,

    // UI fields
    floor: floor,
    number: aptNumber !== null && aptNumber !== undefined ? String(aptNumber) : "—",
    area: area ?? "—",
    blockName: block?.name || "—",
    resident: p?.resident || "—",
    sub_data: p?.sub_data || {},
  };
};

const groupByFloor = (items = []) => {
  const map = new Map();

  items.forEach((item) => {
    const floorKey = Number(item?.meta?.floor ?? item?.floor ?? 0);
    if (!map.has(floorKey)) {
      map.set(floorKey, []);
    }
    map.get(floorKey).push(item);
  });

  return Array.from(map.entries()).map(([floor, apartments]) => ({
    floor,
    apartments,
  }));
};

export function usePropertiesData({ search = "", mtkId = null, complexId = null, buildingId = null, blockId = null, sortAscending = true, enabled = true } = {}) {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => {
    // Əgər enabled false-dursa, API sorğusu göndərmə
    if (!enabled) {
      setLoading(false);
      setRaw([]);
      return;
    }
    
    setLoading(true);
    try {
      const res = await propertiesAPI.getAll();
      // API response: { success: true, data: { data: [...], current_page: 1, last_page: 1 } }
      let responseData = res;
      
      if (responseData?.success && responseData?.data) {
        responseData = responseData.data;
      } else if (responseData?.data) {
        responseData = responseData.data;
      }
      
      const list = responseData?.data || [];
      const mapped = list.map(mapProperty);
      setRaw(mapped);
    } catch (e) {
      console.error("Properties list error:", e);
      setRaw([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  const hasFetchedRef = useRef(false);
  const prevEnabledRef = useRef(enabled);
  useEffect(() => {
    // React StrictMode-da iki dəfə çağırılmanın qarşısını almaq üçün
    if (prevEnabledRef.current === enabled && hasFetchedRef.current) return;
    prevEnabledRef.current = enabled;
    hasFetchedRef.current = true;
    
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]); // Yalnız enabled dəyişəndə yenidən çağır

  // ✅ 1) Filter (raw -> filtered) - context-dən filter
  const filtered = useMemo(() => {
    let list = [...raw];

    // Context-dən filter
    if (blockId) {
      list = list.filter((x) => {
        const bid = x?.block_id ?? x?.block?.id ?? x?.sub_data?.block?.id ?? null;
        return String(bid || "") === String(blockId);
      });
    } else if (buildingId) {
      list = list.filter((x) => {
        const bid = x?.building_id ?? x?.building?.id ?? x?.sub_data?.building?.id ?? null;
        return String(bid || "") === String(buildingId);
      });
    } else if (complexId) {
      list = list.filter((x) => {
        const cid = x?.complex_id ?? x?.complex?.id ?? x?.sub_data?.complex?.id ?? null;
        return String(cid || "") === String(complexId);
      });
    } else if (mtkId) {
      list = list.filter((x) => {
        const mid = x?.mtk_id ?? x?.mtk?.id ?? x?.sub_data?.mtk?.id ?? null;
        const complexMtkId = x?.complex?.bind_mtk?.id ?? x?.complex?.mtk_id ?? x?.sub_data?.complex?.bind_mtk?.id ?? x?.sub_data?.complex?.mtk_id ?? null;
        return String(mid || "") === String(mtkId) || String(complexMtkId || "") === String(mtkId);
      });
    }

    // Search filter
    const q = (search || "").trim().toLowerCase();
    if (q) {
      list = list.filter((x) => {
        return (
          (x.name || "").toLowerCase().includes(q) ||
          (x.number || "").toLowerCase().includes(q) ||
          (x.blockName || "").toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [raw, search, mtkId, complexId, buildingId, blockId]);

  // ✅ 2) Group by floor + floor sort + inside sort
  const organizedData = useMemo(() => {
    const grouped = groupByFloor(filtered);

    // eyni mərtəbənin içində də apartment_number-a görə sort
    grouped.forEach((g) => {
      g.apartments.sort((a, b) => {
        const an = Number(a?.meta?.apartment_number ?? 0);
        const bn = Number(b?.meta?.apartment_number ?? 0);
        return an - bn;
      });
    });

    // mərtəbələri sort et (↑/↓)
    grouped.sort((a, b) => {
      const fa = Number(a?.floor ?? 0);
      const fb = Number(b?.floor ?? 0);
      return sortAscending ? fa - fb : fb - fa;
    });

    return grouped;
  }, [filtered, sortAscending]);

  return {
    organizedData,
    loading,
    refresh: fetchList,
    items: filtered,
  };
}
