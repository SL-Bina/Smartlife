import React from "react";
import servicesLookupsAPI from "../api/lookups";

const normalizeList = (res) => {
  const list =
    res?.data?.data ||
    res?.data ||
    res?.data?.items ||
    res?.data?.data?.items ||
    [];
  return Array.isArray(list) ? list : [];
};

export function useServicesLookups(open, formData, onFieldChange) {
  const [mtks, setMtks] = React.useState([]);
  const [complexes, setComplexes] = React.useState([]);

  const [loading, setLoading] = React.useState({
    mtks: false,
    complexes: false,
  });

  const [error, setError] = React.useState({
    mtks: null,
    complexes: null,
  });

  // ✅ Modal açılan kimi BOTH: mtks + complexes yüklə
  React.useEffect(() => {
    if (!open) return;

    let mounted = true;

    const run = async () => {
      setError({ mtks: null, complexes: null });
      setLoading({ mtks: true, complexes: true });

      try {
        const [mtkRes, complexRes] = await Promise.allSettled([
          servicesLookupsAPI.getMtks(),
          servicesLookupsAPI.getComplexes(), // ✅ sərbəst
        ]);

        if (!mounted) return;

        if (mtkRes.status === "fulfilled") {
          setMtks(normalizeList(mtkRes.value));
        } else {
          setMtks([]);
          setError((p) => ({
            ...p,
            mtks: mtkRes.reason?.message || "MTK list alınmadı",
          }));
        }

        if (complexRes.status === "fulfilled") {
          setComplexes(normalizeList(complexRes.value));
        } else {
          setComplexes([]);
          setError((p) => ({
            ...p,
            complexes: complexRes.reason?.message || "Complex list alınmadı",
          }));
        }
      } finally {
        if (!mounted) return;
        setLoading({ mtks: false, complexes: false });
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [open]);

  // istəyirsənsə MTK seçimi qalsın (amma complexə təsir etmir)
  const setMtk = (id) => {
    const v = id === "" ? null : Number(id);
    onFieldChange("mtk_id", v);
  };

  const setComplex = (id) => {
    const v = id === "" ? null : Number(id);
    onFieldChange("complex_id", v);
  };

  return {
    mtks,
    complexes,
    loading,
    error,
    setMtk,
    setComplex,
  };
}
