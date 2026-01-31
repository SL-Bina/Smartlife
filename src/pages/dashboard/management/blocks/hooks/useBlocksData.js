import { useState, useEffect } from "react";
import { blocksAPI } from "../api";

export function useBlocksData(filters, page, refreshKey = 0, sortConfig = { key: null, direction: "asc" }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    itemsPerPage: 20,
    total: 0,
    totalPages: 0,
  });

  // Natural sort (MTK/Buildings ilə eyni)
  const naturalSort = (a, b) => {
    const aStr = String(a).toLowerCase();
    const bStr = String(b).toLowerCase();
    const aParts = aStr.match(/(\d+|\D+)/g) || [];
    const bParts = bStr.match(/(\d+|\D+)/g) || [];
    const maxLength = Math.max(aParts.length, bParts.length);

    for (let i = 0; i < maxLength; i++) {
      const aPart = aParts[i] || "";
      const bPart = bParts[i] || "";
      if (/^\d+$/.test(aPart) && /^\d+$/.test(bPart)) {
        const aNum = parseInt(aPart, 10);
        const bNum = parseInt(bPart, 10);
        if (aNum !== bNum) return aNum - bNum;
      } else if (aPart !== bPart) {
        return aPart < bPart ? -1 : 1;
      }
    }
    return 0;
  };

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Hamısını çəkirik (MTK/Buildings kimi), sonra sort/paginate client-side
        const params = {
          page: 1,
          per_page: 10000,
        };

        // Əgər backend filter dəstəkləyirsə ötürə bilərsən:
        if (filters?.name) params.name = filters.name;

        const response = await blocksAPI.getAll(params);

        if (response?.success && response?.data) {
          const list = Array.isArray(response.data.data) ? response.data.data : [];

          // UI üçün map edirik
          let mapped = list.map((item) => ({
            id: item.id,
            name: item.name,
            complex: item.complex?.name || "",
            building: item.building?.name || "",
            complex_id: item.complex?.id ?? null,
            building_id: item.building?.id ?? null,
            floors: item.meta?.total_floor ?? "",
            apartments: item.meta?.total_apartment ?? "",
            meta: item.meta || {},
            raw: item,
          }));

          // Client filter (mövcud filter modal “building text” istifadə edir deyə)
          if (filters?.building) {
            const q = String(filters.building).toLowerCase();
            mapped = mapped.filter((x) => String(x.building).toLowerCase().includes(q));
          }
          if (filters?.name) {
            const q = String(filters.name).toLowerCase();
            mapped = mapped.filter((x) => String(x.name).toLowerCase().includes(q));
          }

          // Sorting
          if (sortConfig?.key) {
            mapped = [...mapped].sort((a, b) => {
              let aValue = a[sortConfig.key];
              let bValue = b[sortConfig.key];

              // numeric keys
              if (["id", "floors", "apartments"].includes(sortConfig.key)) {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
              } else if (typeof aValue === "string" && typeof bValue === "string") {
                const comparison = naturalSort(aValue, bValue);
                return sortConfig.direction === "asc" ? comparison : -comparison;
              }

              if (typeof aValue === "number" && typeof bValue === "number") {
                if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
              }
              return 0;
            });
          }

          // Pagination
          const total = mapped.length;
          const itemsPerPage = 20;
          const startIndex = (page - 1) * itemsPerPage;
          const paginatedData = mapped.slice(startIndex, startIndex + itemsPerPage);

          setBlocks(paginatedData);
          setPagination({
            page,
            itemsPerPage,
            total,
            totalPages: Math.ceil(total / itemsPerPage),
          });
        } else {
          setBlocks([]);
          setPagination({ page: 1, itemsPerPage: 20, total: 0, totalPages: 0 });
        }
      } catch (err) {
        console.error("Error fetching Blocks data:", err);
        setError(err?.message || "Failed to fetch Blocks data");
        setBlocks([]);
        setPagination({ page: 1, itemsPerPage: 20, total: 0, totalPages: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, [filters, page, refreshKey, sortConfig]);

  return { blocks, loading, error, pagination };
}
