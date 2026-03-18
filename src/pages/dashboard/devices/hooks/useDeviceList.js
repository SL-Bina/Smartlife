import { useState, useEffect, useCallback } from "react";
import { devicesAPI } from "../api";

const ITEMS_PER_PAGE = 10;

const isLikelyIp = (value = "") => /^\d{1,3}(\.\d{1,3}){3}$/.test(String(value).trim());

const normalizeStatusValue = (status) => {
  const raw = String(status || "").toLowerCase();
  if (raw === "onlayn" || raw === "online" || raw === "active") return "Onlayn";
  return "Offline";
};

const statusFilterMatches = (deviceStatusLabel, filterValue) => {
  const normalizedFilter = String(filterValue || "").toLowerCase();
  if (!normalizedFilter) return true;

  if (normalizedFilter === "active") return deviceStatusLabel === "Onlayn";
  if (normalizedFilter === "inactive") return deviceStatusLabel === "Offline";

  return deviceStatusLabel.toLowerCase() === normalizedFilter;
};

const normalizeDevice = (device = {}) => {
  const rawId = device.id ?? device.device_id ?? `${Date.now()}-${Math.random()}`;
  const id = Number.isFinite(Number(rawId)) ? Number(rawId) : rawId;

  const name =
    device.name ||
    device.title ||
    device.device_name ||
    device.label ||
    `Device #${id}`;

  const userStatus = normalizeStatusValue(
    device.userStatus ||
      device.status ||
      device.device_info?.status ||
      device.device_status ||
      device.connection_status ||
      ""
  );

  const domainName =
    device.domain?.full_name ||
    device.domain?.name ||
    device.building ||
    device.building_name ||
    device.block ||
    device.complex_name ||
    "-";

  const address = device.device_settings?.address || {};
  const apartmentValue =
    address.apartment ||
    address.unit ||
    address.floor ||
    device.apartment ||
    device.apartment_no ||
    device.flat ||
    "-";

  const typeLabel = String(device.type || device.device_info?.api_info?.device_type || "-").toUpperCase();
  const modelLabel = device.model || device.device_info?.api_info?.device_model || "-";
  const apartment = apartmentValue !== "-" ? String(apartmentValue) : `${typeLabel} / ${modelLabel}`;

  const ipCandidate =
    (isLikelyIp(device.description) ? device.description : "") ||
    device.ip_address ||
    device.device_settings?.network?.ip ||
    "-";

  const serialValue =
    device.serial ||
    device.serial_number ||
    device.identifier ||
    device.mac ||
    (ipCandidate !== "-" ? ipCandidate : `${(device.protocol || "").toUpperCase()}${device.port ? `:${device.port}` : ""}`);

  return {
    ...device,
    id,
    name,
    nameLines: [{ id, text: name }],
    building: domainName,
    apartment,
    devices: [
      {
        status: userStatus,
        value: serialValue,
      },
    ],
    userStatus,
  };
};

export function useDeviceList(selectedComplexId = null) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [filterName, setFilterName] = useState("");
  const [filterBuilding, setFilterBuilding] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const params = {
        page,
        size: ITEMS_PER_PAGE,
      };

      if (selectedComplexId) {
        params.complex_id = Number(selectedComplexId);
      }

      if (filterName?.trim()) params.name = filterName.trim();
      if (filterBuilding?.trim()) params.building = filterBuilding.trim();
      if (filterStatus) {
        const normalizedFilter = String(filterStatus).toLowerCase();
        params.status = normalizedFilter === "active" ? "online" : normalizedFilter === "inactive" ? "offline" : filterStatus;
      }

      const response = await devicesAPI.getBasipDevices(params);
      const rawItems = response?.data?.body?.data || response?.data?.data || [];
      const pagination = response?.data?.body?.pagination || response?.data?.pagination || {};

      let mapped = rawItems.map(normalizeDevice);

      if (filterBuilding?.trim()) {
        const q = filterBuilding.trim().toLowerCase();
        mapped = mapped.filter((d) => String(d.building || "").toLowerCase().includes(q));
      }

      if (filterStatus) {
        mapped = mapped.filter((d) => statusFilterMatches(d.userStatus, filterStatus));
      }

      setItems(mapped);
      setTotal(Number(pagination.total) || mapped.length);
      setLastPage(Number(pagination.last_page) || Math.max(1, Math.ceil((Number(pagination.total) || mapped.length) / ITEMS_PER_PAGE)));
    } catch (error) {
      console.error("Failed to load Basip devices", error);
      setItems([]);
      setTotal(0);
      setLastPage(1);
    } finally {
      setLoading(false);
    }
  }, [filterBuilding, filterName, filterStatus, page, selectedComplexId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [selectedComplexId]);

  const goToPage = useCallback((p) => setPage(p), []);

  const applySearch = useCallback((filters) => {
    setFilterName(filters.name ?? "");
    setFilterBuilding(filters.building ?? "");
    setFilterStatus(filters.status ?? "");
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    items,
    loading,
    page,
    lastPage,
    total,
    itemsPerPage: ITEMS_PER_PAGE,
    filterName,
    filterBuilding,
    filterStatus,
    goToPage,
    applySearch,
    refresh,
  };
}
