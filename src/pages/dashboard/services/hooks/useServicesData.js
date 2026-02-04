import { useState, useEffect, useMemo } from "react";
import { servicesAPI } from "../api";

export function useServicesData(filters = {}, page = 1, refreshKey = 0) {
  const [raw, setRaw] = useState([]); // hamısı (bu page-in data-sı)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [serverPagination, setServerPagination] = useState({
    page: 1,
    perPage: 20,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        // backend pagination dəstəkləyirsə page/per_page göndər
        const params = {
          page,
          // per_page: 20, // istəsən aç
        };

        const response = await servicesAPI.getAll(params);

        // response = { success, message, data: { current_page, data: [], last_page, per_page, total } }
        const d = response?.data;

        const list = Array.isArray(d?.data) ? d.data : [];
        setRaw(list);

        setServerPagination({
          page: Number(d?.current_page ?? page ?? 1),
          perPage: Number(d?.per_page ?? 20),
          total: Number(d?.total ?? list.length ?? 0),
          totalPages: Number(d?.last_page ?? 1),
        });
      } catch (err) {
        console.error("Error fetching Services data:", err);
        setError(err?.message || "Failed to fetch Services data");
        setRaw([]);
        setServerPagination({
          page: 1,
          perPage: 20,
          total: 0,
          totalPages: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [page, refreshKey]);

  // ✅ client-side filter (server filter yoxdursa)
  const filteredData = useMemo(() => {
    let list = Array.isArray(raw) ? [...raw] : [];

    const name = String(filters?.name ?? "").trim().toLowerCase();
    const q = String(filters?.q ?? "").trim().toLowerCase();
    const complexId = filters?.complex_id ? Number(filters.complex_id) : null;

    if (name) {
      list = list.filter((x) => String(x?.name ?? "").toLowerCase().includes(name));
    }

    if (q) {
      list = list.filter((x) => {
        const n = String(x?.name ?? "").toLowerCase();
        const desc = String(x?.description ?? "").toLowerCase();
        const cName = String(x?.complex?.name ?? "").toLowerCase();
        return n.includes(q) || desc.includes(q) || cName.includes(q);
      });
    }

    if (Number.isFinite(complexId) && complexId !== null) {
      list = list.filter((x) => Number(x?.complex_id ?? 0) === complexId);
    }

    return list;
  }, [raw, filters]);

  // ✅ pagination: server varsa onu qaytarırıq
  // filter tətbiq edəndə server totalPages dəyişmir — ona görə UI-də 2 seçim var:
  // 1) filter serverdə olarsa (params göndərib), totalPages düz qalacaq
  // 2) filter yalnız clientdədirsə, totalPages-i clientdən hesablamaq lazımdır
  // Mən burada client filter varsa totalPages-i clientdən hesablayıram (daha düzgün UI üçün):

  const pagination = useMemo(() => {
    const hasClientFilter =
      !!String(filters?.name ?? "").trim() ||
      !!String(filters?.q ?? "").trim() ||
      filters?.complex_id;

    if (!hasClientFilter) return serverPagination;

    // client filter olduqda page-də göstərilən listin totalu bu page-in içindədir.
    // Əgər bütün datanı serverdən səhifəsiz almırsansa, client totalPages real olmayacaq.
    // Ona görə burada "page 1" kimi sadə saxlayırıq.
    return {
      page: 1,
      perPage: filteredData.length || serverPagination.perPage,
      total: filteredData.length,
      totalPages: 1,
    };
  }, [serverPagination, filteredData, filters]);

  return {
    services: filteredData,
    loading,
    error,
    pagination, // ✅ totalPages burdan gəlir
  };
}
