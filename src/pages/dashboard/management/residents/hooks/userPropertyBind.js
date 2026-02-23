import { useState, useEffect, useMemo } from "react";
import residentsAPI from "@/pages/dashboard/management/residents/api";
import propertyLookupsAPI from "@/pages/dashboard/management/properties/api/lookups";

export function usePropertyBind(residentId, { onSuccess } = {}) {
  const [mtks, setMtks] = useState([]);
  const [complexes, setComplexes] = useState([]);

  const [mtkId, setMtkId] = useState(null);
  const [complexId, setComplexId] = useState(null);
  const [propertyId, setPropertyId] = useState(null);

  const [loadingMtks, setLoadingMtks] = useState(false);
  const [loadingComplexes, setLoadingComplexes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMtks = async () => {
      try {
        setLoadingMtks(true);
        const data = await propertyLookupsAPI.getMtks();
        setMtks(data || []);
      } catch (e) {
        setError(e?.message || "MTK-ları yükləmək mümkün olmadı");
      } finally {
        setLoadingMtks(false);
      }
    };
    loadMtks();
  }, []);

  useEffect(() => {
    const loadComplexes = async () => {
      try {
        if (!mtkId) {
          setComplexes([]);
          setComplexId(null);
          return;
        }
        setLoadingComplexes(true);
        const data = await propertyLookupsAPI.getComplexes({ mtk_id: mtkId });
        setComplexes(data || []);
      } catch (e) {
        setError(e?.message || "Kompleksləri yükləmək mümkün olmadı");
      } finally {
        setLoadingComplexes(false);
      }
    };
    loadComplexes();
  }, [mtkId]);

  const canBind = useMemo(() => Boolean(mtkId && complexId && propertyId), [mtkId, complexId, propertyId]);

  const bindProperty = async () => {
    if (!residentId || !canBind) return;
    setSaving(true);
    setError(null);
    try {
      await residentsAPI.bindProperty(residentId, {
        mtk_id: mtkId,
        complex_id: complexId,
        property_id: propertyId,
      });
      onSuccess?.();
      setPropertyId(null);
    } catch (e) {
      setError(e?.message || "Bağlama əməliyyatı uğursuz oldu");
      throw e;
    } finally {
      setSaving(false);
    }
  };

  const unbindProperty = async (property) => {
    if (!residentId || !property) return;
    setSaving(true);
    setError(null);
    try {
      const mtk = property?.mtk_id ?? property?.sub_data?.complex?.mtk_id ?? property?.complex?.mtk_id;
      const complex = property?.complex_id ?? property?.sub_data?.complex?.id ?? property?.complex?.id;
      const propId = property?.id ?? property?.property_id;
      await residentsAPI.unbindProperty(residentId, {
        mtk_id: mtk,
        complex_id: complex,
        property_id: propId,
      });
      onSuccess?.();
    } catch (e) {
      setError(e?.message || "Açı bağlama əməliyyatı uğursuz oldu");
      throw e;
    } finally {
      setSaving(false);
    }
  };

  return {
    state: {
      mtks,
      complexes,
      mtkId,
      complexId,
      propertyId,
      loadingMtks,
      loadingComplexes,
      saving,
      error,
      canBind,
    },
    actions: {
      setMtkId,
      setComplexId,
      setPropertyId,
      bindProperty,
      unbindProperty,
    },
  };
}
