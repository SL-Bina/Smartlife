import React from "react";
import { Typography, IconButton } from "@material-tailwind/react";
import { UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { clearSelectedResident } from "@/store/slices/residentSlice";

export function ResidentHeader() {
  const dispatch = useAppDispatch();
  const selectedResident = useAppSelector((state) => state.resident.selectedResident);
  const selectedResidentId = useAppSelector((state) => state.resident.selectedResidentId);

  const handleClearSelection = (e) => {
    e.stopPropagation();
    dispatch(clearSelectedResident());
  };

  return (
    <div 
      className="relative w-full overflow-hidden rounded-xl shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 mt-4 sm:mt-3 md:mt-4"
      style={{ position: 'relative', zIndex: 0 }}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative flex items-center gap-2 sm:gap-3 md:gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 dark:border-gray-600/30 bg-white/20">
            <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <Typography variant="h4" className="text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
            Sakinlər
          </Typography>
          {selectedResident && selectedResidentId && (
            <div className="flex items-center gap-2 mt-1">
              <Typography variant="small" className="text-white/90 text-xs sm:text-sm">
                Seçilmiş: {selectedResident.name} {selectedResident.surname}
              </Typography>
              <IconButton
                size="sm"
                variant="text"
                className="text-white hover:bg-white/20"
                onClick={handleClearSelection}
              >
                <XMarkIcon className="h-4 w-4" />
              </IconButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

