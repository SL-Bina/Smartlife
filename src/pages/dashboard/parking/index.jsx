import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BuildingOffice2Icon } from "@heroicons/react/24/solid";
import { GradientPageHeader } from "@/components/ui/GradientPageHeader";
import { FLOORS } from "./data/mockData";
import { StatsBar }    from "./components/StatsBar";
import { FloorTabs }   from "./components/FloorTabs";
import { FilterBar }   from "./components/FilterBar";
import { ParkingGrid } from "./components/ParkingGrid";
import { SpotModal }   from "./components/SpotModal";

export default function ParkingPage() {
  const { t } = useTranslation();

  // ── UI state ───────────────────────────────────────────────────────────────
  const [activeFloor,   setActiveFloor]   = useState(FLOORS[0].id);
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [search,        setSearch]        = useState("");
  const [selectedSpot,  setSelectedSpot]  = useState(null);

  // ── Derived data ───────────────────────────────────────────────────────────
  const floor = useMemo(
    () => FLOORS.find((f) => f.id === activeFloor) ?? FLOORS[0],
    [activeFloor]
  );

  const stats = useMemo(() => {
    const all = FLOORS.flatMap((f) => f.spots);
    return {
      total:     all.length,
      available: all.filter((s) => s.status === "available").length,
      occupied:  all.filter((s) => s.status === "occupied").length,
      reserved:  all.filter((s) => s.status === "reserved").length,
    };
  }, []);

  const isSpotActive = useMemo(() => (spot) => {
    if (statusFilter !== "all" && spot.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        spot.label.toLowerCase().includes(q) ||
        (spot.resident ?? "").toLowerCase().includes(q) ||
        (spot.plate    ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  }, [statusFilter, search]);

  const rows = useMemo(() => {
    const map = {};
    floor.spots.forEach((s) => {
      if (!map[s.row]) map[s.row] = [];
      map[s.row].push(s);
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [floor.spots]);

  return (
    <div className="flex flex-col gap-4 pb-6">

      <GradientPageHeader
        icon={BuildingOffice2Icon}
        title={t("parking.pageTitle") || "Parkinq İdarəetməsi"}
        subtitle={t("parking.pageSubtitle") || "Parkinq yerlərini real vaxtda izləyin"}
      />

      <StatsBar stats={stats} />

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">

        <FloorTabs activeFloor={activeFloor} onChange={setActiveFloor} />

        <FilterBar
          search={search}
          onSearch={setSearch}
          statusFilter={statusFilter}
          onStatus={setStatusFilter}
        />

        <ParkingGrid
          rows={rows}
          isSpotActive={isSpotActive}
          onSpotClick={setSelectedSpot}
        />
      </div>

      {selectedSpot && (
        <SpotModal spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
      )}
    </div>
  );
}
