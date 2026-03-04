import React, { useState, useMemo } from "react";
import {
  Typography,
  Card,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Chip,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

// Small inline badge
function Tag({ children, color = "gray" }) {
  const map = {
    green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    red:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    teal:  "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    blue:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
    gray:  "bg-gray-100 text-gray-700 dark:bg-gray-700/60 dark:text-gray-300",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border border-transparent ${map[color] || map.gray}`}>
      {children}
    </span>
  );
}

// Skeleton loader row
function SkeletonRow({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 xl:px-6 py-3 xl:py-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${50 + (i * 20) % 60}px` }} />
        </td>
      ))}
    </tr>
  );
}

export function DeviceTable({ items, loading, page, lastPage, onEdit, onDelete, onPageChange }) {
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const sortedItems = useMemo(() => {
    if (!sortConfig.key) return items;
    return [...items].sort((a, b) => {
      let av, bv;
      if (sortConfig.key === "building") { av = a.building; bv = b.building; }
      else if (sortConfig.key === "status") { av = a.userStatus?.toLowerCase(); bv = b.userStatus?.toLowerCase(); }
      else { av = (a.nameLines?.[0]?.text || "").toLowerCase(); bv = (b.nameLines?.[0]?.text || "").toLowerCase(); }
      if (av < bv) return sortConfig.direction === "asc" ? -1 : 1;
      if (av > bv) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, sortConfig]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc"
      ? <ChevronUpIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
      : <ChevronDownIcon className="h-3 w-3 text-gray-500 dark:text-gray-400" />;
  };

  // Skeleton
  if (loading) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-200/50 dark:border-gray-700/50">
                {[t("devices.table.name"), t("devices.table.building"), t("devices.table.apartment"), t("devices.table.device"), t("devices.table.userStatus"), ""].map((h, i) => (
                  <th key={i} className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={i} cols={6} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 text-center py-12">
        <Typography className="text-sm text-gray-500 dark:text-gray-400">
          {t("common.noData") || "Məlumat tapılmadı"}
        </Typography>
      </div>
    );
  }

  const ActionMenu = ({ row }) => (
    <Menu placement="bottom-end">
      <MenuHandler>
        <IconButton
          variant="text"
          size="sm"
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <EllipsisVerticalIcon className="h-4 w-4 xl:h-5 xl:w-5" />
        </IconButton>
      </MenuHandler>
      <MenuList className="min-w-[160px] !z-[9999]">
        <MenuItem
          onClick={(e) => { e.stopPropagation(); onEdit(row); }}
          className="flex items-center gap-2"
        >
          <PencilIcon className="h-4 w-4" />
          {t("devices.actions.edit") || "Redaktə et"}
        </MenuItem>
        <MenuItem
          onClick={(e) => { e.stopPropagation(); onDelete(row); }}
          className="flex items-center gap-2 text-red-600 dark:text-red-400"
        >
          <TrashIcon className="h-4 w-4" />
          {t("devices.actions.delete") || "Sil"}
        </MenuItem>
      </MenuList>
    </Menu>
  );

  const NameCell = ({ row }) => (
    <div className="flex flex-col gap-1">
      {(row.nameLines || [{ id: row.id, text: row.name || "" }]).map((ln) => (
        <div key={ln.id} className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold font-mono bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            #{ln.id}
          </span>
          <span className="text-xs text-gray-700 dark:text-gray-200">{ln.text}</span>
        </div>
      ))}
    </div>
  );

  const SerialCell = ({ row }) => (
    <div className="flex flex-col gap-1">
      {(row.devices || []).map((d, i) => (
        <div key={i} className="flex items-center gap-1.5 flex-wrap">
          <Tag color={d.status === "Onlayn" ? "green" : "red"}>{d.status}</Tag>
          <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400">{d.value}</span>
        </div>
      ))}
    </div>
  );

  const StatusBadge = ({ value }) => (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        String(value).toLowerCase() === "onlayn"
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      }`}
    >
      {value}
    </span>
  );

  const ThSort = ({ label, colKey }) => (
    <th
      className={`px-4 xl:px-6 py-3 xl:py-4 text-left ${colKey ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-colors" : ""}`}
      onClick={colKey ? () => handleSort(colKey) : undefined}
    >
      <div className="flex items-center gap-1.5">
        <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
          {label}
        </Typography>
        {colKey && <SortIcon columnKey={colKey} />}
      </div>
    </th>
  );

  return (
    <>
      {/* ── Desktop table ── */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
                <ThSort label={t("devices.table.name") || "Ad"} colKey="name" />
                <ThSort label={t("devices.table.building") || "Bina"} colKey="building" />
                <ThSort label={t("devices.table.apartment") || "Mənzil"} />
                <ThSort label={t("devices.table.device") || "Serial"} />
                <ThSort label={t("devices.table.userStatus") || "Status"} colKey="status" />
                <th className="px-4 xl:px-6 py-3 xl:py-4 text-left">
                  <Typography variant="small" className="font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">
                    {t("devices.table.actions") || "Əməliyyatlar"}
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedItems.map((row) => (
                <tr
                  key={row.id}
                  className="transition-all duration-200 hover:bg-blue-50/40 dark:hover:bg-blue-900/10"
                >
                  <td className="px-4 xl:px-6 py-3 xl:py-4 min-w-[200px]">
                    <NameCell row={row} />
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap">
                    <Typography variant="small" className="font-semibold text-gray-900 dark:text-gray-100 text-xs xl:text-sm">
                      {row.building}
                    </Typography>
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap">
                    <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-xs xl:text-sm">
                      {row.apartment}
                    </Typography>
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 min-w-[220px]">
                    <SerialCell row={row} />
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap">
                    <StatusBadge value={row.userStatus} />
                  </td>
                  <td className="px-4 xl:px-6 py-3 xl:py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <ActionMenu row={row} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile cards ── */}
        <div className="lg:hidden space-y-3 p-3 sm:p-4">
          {sortedItems.map((row) => (
            <Card
              key={row.id}
              className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800"
            >
              <CardBody className="p-4 sm:p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1">
                      {t("devices.table.name") || "Ad"}
                    </Typography>
                    <NameCell row={row} />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <StatusBadge value={row.userStatus} />
                    <ActionMenu row={row} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1">
                      {t("devices.table.building") || "Bina"}
                    </Typography>
                    <Typography variant="small" className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                      {row.building}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1">
                      {t("devices.table.apartment") || "Mənzil"}
                    </Typography>
                    <Typography variant="small" className="text-gray-700 dark:text-gray-300 text-sm">
                      {row.apartment}
                    </Typography>
                  </div>
                </div>

                <div>
                  <Typography variant="small" className="text-[11px] font-bold uppercase text-gray-400 dark:text-gray-500 mb-1">
                    {t("devices.table.device") || "Serial"}
                  </Typography>
                  <SerialCell row={row} />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

// ------------------------------------------------------------------
// Small inline tag badge
// ------------------------------------------------------------------
