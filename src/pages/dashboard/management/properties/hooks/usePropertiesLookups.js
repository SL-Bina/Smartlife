import { useEffect, useMemo, useState } from "react";
import lookupsAPI from "../api/lookups";

const toList = (res) => res?.data?.data || res?.data || [];

export function usePropertiesLookups(open, formData) {
  const [loading, setLoading] = useState(false);
  const [mtks, setMtks] = useState([]);
  const [complexes, setComplexes] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    if (!open) return;

    const run = async () => {
      setLoading(true);
      try {
        const [m, c, b, bl] = await Promise.all([
          lookupsAPI.getMtks(),
          lookupsAPI.getComplexes(),
          lookupsAPI.getBuildings(),
          lookupsAPI.getBlocks(),
        ]);

        setMtks(toList(m));
        setComplexes(toList(c));
        setBuildings(toList(b));
        setBlocks(toList(bl));
      } catch (e) {
        console.error("Lookups error:", e);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [open]);

  const selectedMtkId = formData?.mtk_id ? Number(formData.mtk_id) : null;
  const selectedComplexId = formData?.complex_id ? Number(formData.complex_id) : null;
  const selectedBuildingId = formData?.building_id ? Number(formData.building_id) : null;

  const filteredComplexes = useMemo(() => {
    if (!selectedMtkId) return complexes;

    return complexes.filter((x) => {
      // backend model-də mtk_id olma ehtimalı
      const mid = x?.mtk_id ?? x?.sub_data?.mtk?.id ?? x?.mtk?.id;
      return Number(mid) === selectedMtkId;
    });
  }, [complexes, selectedMtkId]);

  const filteredBuildings = useMemo(() => {
    if (!selectedComplexId) return buildings;

    return buildings.filter((x) => {
      const cid = x?.complex_id ?? x?.sub_data?.complex?.id ?? x?.complex?.id;
      return Number(cid) === selectedComplexId;
    });
  }, [buildings, selectedComplexId]);

  const filteredBlocks = useMemo(() => {
    if (!selectedBuildingId) return blocks;

    return blocks.filter((x) => {
      const bid = x?.building_id ?? x?.sub_data?.building?.id ?? x?.building?.id;
      return Number(bid) === selectedBuildingId;
    });
  }, [blocks, selectedBuildingId]);

  return {
    loading,
    mtks,
    complexes,
    buildings,
    blocks,
    // complexes : filteredComplexes,
    // buildings : filteredBuildings,
    // blocks : filteredBlocks,
  };
}
