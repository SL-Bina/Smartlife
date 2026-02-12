import React, { useState } from "react";
import { Card, CardBody, Typography, IconButton } from "@material-tailwind/react";
import {
  BuildingOffice2Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { useManagementEnhanced, useMtkColor } from "@/store/exports";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export function ManagementInfo() {
  const { state } = useManagementEnhanced();
  const { colorCode, getRgba } = useMtkColor();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  // Yalnız management səhifələrində göstər
  const isManagementPage = location.pathname.includes("/dashboard/management");

  // Default göz yormayan qırmızı ton
  const defaultRed = "#dc2626";
  const activeColor = colorCode || defaultRed;

  // Rəng koduna görə kontrast mətn rəngi müəyyən et
  const getContrastColor = (hexColor) => {
    if (!hexColor) return "#000000";
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  // Məlumatların olub olmadığını yoxla
  const hasData = state.mtkId || state.complexId || state.buildingId || state.blockId || state.propertyId;

  // Yalnız management səhifələrində və məlumat varsa göstər
  if (!isManagementPage || !hasData || !isVisible) {
    return null;
  }

  const contrastColor = getContrastColor(activeColor);
  const rgbaColor = colorCode && getRgba ? getRgba(0.95) : `rgba(220, 38, 38, 0.95)`;
  const rgbaColor2 = colorCode && getRgba ? getRgba(0.9) : `rgba(220, 38, 38, 0.9)`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, x: "-50%" }}
        animate={{ y: 0, opacity: 1, x: "-50%" }}
        exit={{ y: 100, opacity: 0, x: "-50%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-8 left-1/2 z-50 max-w-2xl w-full px-4"
      >
        <Card
          className="shadow-2xl border-0"
          style={{
            background: `linear-gradient(135deg, ${rgbaColor}, ${rgbaColor2})`,
            backdropFilter: "blur(10px)",
          }}
        >
          <CardBody className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BuildingOffice2Icon className="h-5 w-5" style={{ color: contrastColor }} />
                <Typography
                  variant="h6"
                  className="font-semibold"
                  style={{ color: contrastColor }}
                >
                  Seçilmiş məlumatlar
                </Typography>
              </div>
              <div className="flex items-center gap-1">
                <IconButton
                  variant="text"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="rounded-full"
                  style={{ color: contrastColor }}
                >
                  {isExpanded ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronUpIcon className="h-4 w-4" />
                  )}
                </IconButton>
                <IconButton
                  variant="text"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="rounded-full"
                  style={{ color: contrastColor }}
                >
                  <XMarkIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pt-2 border-t" style={{ borderColor: `rgba(255, 255, 255, 0.2)` }}>
                    {state.mtk && (
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="small"
                          className="font-medium"
                          style={{ color: contrastColor, opacity: 0.9 }}
                        >
                          MTK:
                        </Typography>
                        <Typography
                          variant="small"
                          className="font-semibold"
                          style={{ color: contrastColor }}
                        >
                          {state.mtk.name || `ID: ${state.mtkId}`}
                        </Typography>
                      </div>
                    )}

                    {state.complex && (
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="small"
                          className="font-medium"
                          style={{ color: contrastColor, opacity: 0.9 }}
                        >
                          Kompleks:
                        </Typography>
                        <Typography
                          variant="small"
                          className="font-semibold"
                          style={{ color: contrastColor }}
                        >
                          {state.complex.name || `ID: ${state.complexId}`}
                        </Typography>
                      </div>
                    )}

                    {state.building && (
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="small"
                          className="font-medium"
                          style={{ color: contrastColor, opacity: 0.9 }}
                        >
                          Bina:
                        </Typography>
                        <Typography
                          variant="small"
                          className="font-semibold"
                          style={{ color: contrastColor }}
                        >
                          {state.building.name || `ID: ${state.buildingId}`}
                        </Typography>
                      </div>
                    )}

                    {state.block && (
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="small"
                          className="font-medium"
                          style={{ color: contrastColor, opacity: 0.9 }}
                        >
                          Blok:
                        </Typography>
                        <Typography
                          variant="small"
                          className="font-semibold"
                          style={{ color: contrastColor }}
                        >
                          {state.block.name || `ID: ${state.blockId}`}
                        </Typography>
                      </div>
                    )}

                    {state.property && (
                      <div className="flex items-center justify-between">
                        <Typography
                          variant="small"
                          className="font-medium"
                          style={{ color: contrastColor, opacity: 0.9 }}
                        >
                          Mənzil:
                        </Typography>
                        <Typography
                          variant="small"
                          className="font-semibold"
                          style={{ color: contrastColor }}
                        >
                          {state.property.name || `ID: ${state.propertyId}`}
                        </Typography>
                      </div>
                    )}

                    {!state.mtk && !state.complex && !state.building && !state.block && !state.property && (
                      <Typography
                        variant="small"
                        className="text-center italic"
                        style={{ color: contrastColor, opacity: 0.7 }}
                      >
                        Məlumat yüklənir...
                      </Typography>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardBody>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export default ManagementInfo;
