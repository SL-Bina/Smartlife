import React, { useState, useEffect } from "react";
import { Dialog, DialogBody, DialogHeader, DialogFooter } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import { Typography } from "@material-tailwind/react";
import { IconButton } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

export function FloorSelectionModal({ open, onClose, onConfirm, loading = false }) {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedFloor(1);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleFloorClick = async (floor) => {
    if (floor <= 16 && !isSubmitting) {
      setSelectedFloor(floor);
      setIsSubmitting(true);
      await onConfirm(floor);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedFloor(1);
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      handler={handleClose}
      size="sm"
      className="bg-white dark:bg-gray-800 m-4 max-w-[95vw] sm:max-w-[90vw] md:max-w-md lg:max-w-lg"
    >
      <DialogHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between w-full">
          <Typography variant="h5" className="text-gray-900 dark:text-white">
            Mərtəbə Seçimi
          </Typography>
          <IconButton
            variant="text"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <XMarkIcon className="h-5 w-5" />
          </IconButton>
        </div>
      </DialogHeader>
      
      <DialogBody className="py-4 sm:py-6 px-2 sm:px-4">
        <Typography variant="paragraph" className="text-gray-600 dark:text-gray-300 mb-6">
          Zəhmət olmasa açmaq istədiyiniz mərtəbəni seçin (1-16 aktiv)
        </Typography>
        
        {isSubmitting && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <Typography variant="small" className="ml-3 text-blue-600 dark:text-blue-400">
              Göndərilir...
            </Typography>
          </div>
        )}
        
        <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-80 overflow-y-auto p-3 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}`}>
          {Array.from({ length: 50 }, (_, i) => i + 1).map((floor) => {
            const isActive = floor <= 16;
            const isSelected = selectedFloor === floor;
            
            return (
              <motion.button
                key={floor}
                whileHover={isActive ? { scale: 1.05 } : {}}
                whileTap={isActive ? { scale: 0.95 } : {}}
                onClick={() => handleFloorClick(floor)}
                disabled={!isActive || isSubmitting}
                className={`
                  relative p-3 sm:p-4 rounded-lg font-bold text-sm sm:text-base transition-all duration-200 min-h-[48px] sm:min-h-[52px]
                  ${isActive 
                    ? isSelected
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                    : "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-700"
                  }
                `}
              >
                {floor}
                {!isActive && (
                  <div className="absolute inset-0 bg-gray-200/50 dark:bg-gray-700/50 rounded-lg" />
                )}
              </motion.button>
            );
          })}
        </div>
        
        {selectedFloor > 16 && (
          <Typography variant="small" className="text-orange-600 dark:text-orange-400 mt-4">
            Diqqət: Yalnız 1-16 arası mərtəbələr aktivdir
          </Typography>
        )}
      </DialogBody>
      
      <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 px-2 sm:px-4">
        <Button
          variant="text"
          onClick={handleClose}
          disabled={isSubmitting}
          size="sm"
          className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm sm:text-base px-3 sm:px-4 w-full"
        >
          {isSubmitting ? "Gözləyin..." : "İmtina"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
