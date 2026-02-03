import { useEffect, useMemo, useState } from "react";
import propertiesAPI from "../api";

// list response -> UI model mapping
const mapProperty = (p) => {
  const floor = p?.meta?.floor ?? null;
  const aptNumber = p?.meta?.apartment_number ?? null;
  const area = p?.meta?.area ?? null;

  return {
    id: p?.id,
    name: p?.name || "",
    status: p?.status || "active",
    meta: p?.meta || {},

    // UI fields
    floor: floor, // mərtəbə (group üçün)
    number: aptNumber !== null && aptNumber !== undefined ? String(aptNumber) : "—", // UI-də göstərilən
    area: area ?? "—",
    block: p?.sub_data?.block?.name || "—",
    resident: p?.resident || "—", // backend-də yoxdursa — qalacaq
    sub_data: p?.sub_data || {},
  };
};

const groupByFloor = (items = []) => {
  const map = new Map();

  items.forEach((item) => {
    const floorKey = Number(item?.meta?.floor ?? item?.floor ?? 0); // floor string olsa da Number edirik
    if (!map.has(floorKey)) {
      map.set(floorKey, []);
    }
    map.get(floorKey).push(item);
  });

  // Map -> Array
  return Array.from(map.entries()).map(([floor, apartments]) => ({
    floor,
    apartments,
  }));
};

export function usePropertiesData(appliedFilters, sortAscending = true) {
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await propertiesAPI.getAll();
      const list = res?.data?.data || [];
      setRaw(list.map(mapProperty));
    } catch (e) {
      console.error("Properties list error:", e);
      setRaw([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 1) Filter (raw -> filtered)
  const filtered = useMemo(() => {
    let list = [...raw];

    const number = (appliedFilters?.number || "").trim().toLowerCase();
    const block = (appliedFilters?.block || "").trim().toLowerCase();

    if (number) {
      list = list.filter((x) => String(x.number).toLowerCase().includes(number));
    }
    if (block) {
      list = list.filter((x) => String(x.block).toLowerCase().includes(block));
    }

    return list;
  }, [raw, appliedFilters]);

  // ✅ 2) Group by floor + floor sort + inside sort
  const organizedData = useMemo(() => {
    const grouped = groupByFloor(filtered);

    // eyni mərtəbənin içində də apartment_number-a görə sort (istəsən saxla)
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
    items: raw,
  };
}
