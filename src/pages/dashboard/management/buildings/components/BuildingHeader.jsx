import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { HomeModernIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearSelectedBuilding } from "@/store/slices/buildingSlice";

export function BuildingHeader() {
  const dispatch = useAppDispatch();
  const selectedBuilding = useAppSelector((state) => state.building.selectedBuilding);
  const selectedBuildingId = useAppSelector((state) => state.building.selectedBuildingId);

  const handleClearSelection = (e) => {
    e.stopPropagation();
    dispatch(clearSelectedBuilding());
  };

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-r from-purple-600 to-purple-800 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 mt-2 sm:mt-3 md:mt-4"
      style={{ position: 'relative', zIndex: 0 }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 dark:border-gray-600/30 bg-white/20">
            <HomeModernIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="min-w-0">
              <Typography 
                variant="h4" 
                className="text-white font-bold mb-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-lg sm:text-xl md:text-2xl"
              >
                <span>Binalar İdarəetməsi</span>
                {selectedBuilding && (
                  <span className="text-xs sm:text-sm font-normal text-white/80 truncate">
                    ({selectedBuilding.name})
                  </span>
                )}
              </Typography>
              <Typography className="text-white/90 dark:text-gray-300 text-xs sm:text-sm font-medium">
                Bina siyahısı, yarat / redaktə et / sil / seç / bloklara keç
              </Typography>
            </div>
            {selectedBuildingId && (
              <Button
                variant="outlined"
                size="sm"
                onClick={handleClearSelection}
                className="border-white/30 text-white hover:bg-white/20 flex items-center gap-2 flex-shrink-0"
              >
                <XMarkIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Seçimi ləğv et</span>
                <span className="sm:hidden">Ləğv</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12"></div>
    </div>
  );
}

