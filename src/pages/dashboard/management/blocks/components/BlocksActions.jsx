import React, { useMemo, useEffect } from "react";
import { Button, Input } from "@material-tailwind/react";
import { PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { useManagement } from "@/context/ManagementContext";
import { useMtkColor } from "@/context";
import AppSelect from "@/components/ui/AppSelect";

const STANDARD_OPTIONS = [10, 25, 50, 75, 100];

export function BlocksActions({
  search,
  onSearchChange,
  onCreateClick,
  mtks = [],
  complexes = [],
  buildings = [],
  loadingMtks = false,
  loadingComplexes = false,
  loadingBuildings = false,
  onFilterClick,
  hasActiveFilters = false,
  totalItems = 0,
  itemsPerPage = 10,
  onItemsPerPageChange
}) {
  const { state, actions } = useManagement();
  const { colorCode, getRgba } = useMtkColor();
  
  // Default göz yormayan qırmızı ton
  const defaultRed = "#dc2626";
  const activeColor = colorCode || defaultRed;

  const filteredComplexes = useMemo(() => {
    const mid = state.mtkId;
    if (!mid) return complexes;

    return complexes.filter((c) => {
      const id1 = c?.bind_mtk?.id;
      const id2 = c?.mtk_id;
      return String(id1 || id2 || "") === String(mid);
    });
  }, [complexes, state.mtkId]);

  const filteredBuildings = useMemo(() => {
    const cid = state.complexId;
    if (!cid) return buildings;

    return buildings.filter((b) => {
      const id1 = b?.complex?.id;
      const id2 = b?.complex_id;
      return String(id1 || id2 || "") === String(cid);
    });
  }, [buildings, state.complexId]);

  // Əgər MTK seçilməyib və mtks array-i varsa, birinci MTK-nı avtomatik seç
  useEffect(() => {
    if (!state.mtkId && mtks.length > 0 && !loadingMtks) {
      actions.setMtk(mtks[0].id, mtks[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mtks.length, loadingMtks, state.mtkId]);

  // Əgər Complex seçilməyib və filteredComplexes array-i varsa, birinci Complex-i avtomatik seç
  useEffect(() => {
    if (!state.complexId && filteredComplexes.length > 0 && !loadingComplexes && state.mtkId) {
      actions.setComplex(filteredComplexes[0].id, filteredComplexes[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredComplexes.length, loadingComplexes, state.complexId, state.mtkId]);

  // Əgər Building seçilməyib və filteredBuildings array-i varsa, birinci Building-i avtomatik seç
  useEffect(() => {
    if (!state.buildingId && filteredBuildings.length > 0 && !loadingBuildings && state.complexId) {
      actions.setBuilding(filteredBuildings[0].id, filteredBuildings[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredBuildings.length, loadingBuildings, state.buildingId, state.complexId]);

  // Items per page seçimləri yarat
  const itemsPerPageOptions = useMemo(() => {
    // Əgər data sayı 25-dən azdırsa, select göstərmə
    if (totalItems < 25) {
      return null;
    }

    const options = [];
    const maxItems = Math.min(totalItems, 100); // Max 100
    
    // Həmişə 10 olmalıdır
    options.push(10);
    
    // Standart variantları əlavə et (yalnız maxItems-dən kiçik və ya bərabər olanlar)
    STANDARD_OPTIONS.slice(1).forEach(option => {
      if (option <= maxItems && !options.includes(option)) {
        options.push(option);
      }
    });
    
    // Əgər data sayı standart variantlar arasında deyilsə və 100-dən kiçikdirsə, əlavə et
    if (maxItems < 100 && !STANDARD_OPTIONS.includes(maxItems)) {
      // Data sayını uyğun yerə daxil et (sıralı şəkildə)
      const insertIndex = options.findIndex(opt => opt > maxItems);
      if (insertIndex === -1) {
        options.push(maxItems);
      } else {
        options.splice(insertIndex, 0, maxItems);
      }
    } else if (maxItems === 100 && !options.includes(100)) {
      // Əgər maxItems 100-dürsə və hələ əlavə olunmayıbsa
      options.push(100);
    }
    
    return options.map(value => ({
      id: value,
      name: String(value)
    }));
  }, [totalItems]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3 items-center flex-wrap">
        <div className="w-full sm:w-[280px]">
          <Input
            label="Axtarış"
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-300" }}
          />
        </div>

        <div className="w-full sm:w-[280px]">
          <AppSelect
            items={mtks}
            value={state.mtkId || (mtks.length > 0 ? mtks[0].id : null)}
            loading={loadingMtks}
            placeholder="MTK seç"
            allowAll={false}
            getValue={(x) => x.id}
            getLabel={(x) => x.name}
            onChange={(id, obj) => {
              // MTK dəyişəndə complex və building sıfırlansın
              actions.setMtk(id, obj);
              actions.setComplex(null, null);
              actions.setBuilding(null, null);
            }}
          />
        </div>

        <div className="w-full sm:w-[300px]">
          <AppSelect
            items={filteredComplexes}
            value={state.complexId || (filteredComplexes.length > 0 ? filteredComplexes[0].id : null)}
            loading={loadingComplexes}
            placeholder="Kompleks seç"
            allowAll={false}
            getValue={(x) => x.id}
            getLabel={(x) => x.name}
            onChange={(id, obj) => {
              // Complex dəyişəndə building sıfırlansın
              actions.setComplex(id, obj);
              actions.setBuilding(null, null);
            }}
          />
        </div>

        <div className="w-full sm:w-[300px]">
          <AppSelect
            items={filteredBuildings}
            value={state.buildingId || (filteredBuildings.length > 0 ? filteredBuildings[0].id : null)}
            loading={loadingBuildings}
            placeholder="Bina seç"
            allowAll={false}
            getValue={(x) => x.id}
            getLabel={(x) => x.name}
            onChange={(id, obj) => actions.setBuilding(id, obj)}
          />
        </div>

        <Button
          variant="outlined"
          color="blue-gray"
          onClick={() => actions.resetAll()}
          className="dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Scope sıfırla
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {itemsPerPageOptions && (
          <div className="w-full sm:w-auto">
            <AppSelect
              items={itemsPerPageOptions}
              value={itemsPerPage}
              onChange={(value) => onItemsPerPageChange?.(value)}
              placeholder="Göstəriləcək say"
              allowAll={false}
            />
          </div>
        )}
        {onFilterClick && (
          <Button 
            variant="outlined" 
            color="blue-gray" 
            onClick={onFilterClick} 
            className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white hover:shadow-lg flex items-center gap-2"
            style={{
              borderColor: hasActiveFilters ? activeColor : undefined,
              color: hasActiveFilters ? activeColor : undefined,
            }}
          >
            <FunnelIcon className="h-5 w-5" />
            Axtarış
          </Button>
        )}
        <Button
          onClick={onCreateClick}
          variant="outlined"
          className="border-green-700 text-green-700 hover:bg-green-700 hover:text-white hover:shadow-lg flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Blok əlavə et
        </Button>
      </div>
    </div>
  );
}
