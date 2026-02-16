import { useAppSelector } from '../hooks';

// Color utility functions
const hexToRgba = (hex, opacity = 1) => {
  if (!hex) return null;
  const hexClean = hex.replace("#", "");
  const r = parseInt(hexClean.substring(0, 2), 16);
  const g = parseInt(hexClean.substring(2, 4), 16);
  const b = parseInt(hexClean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const getContrastColor = (hex) => {
  if (!hex) return "#000000";
  const hexClean = hex.replace("#", "");
  const r = parseInt(hexClean.substring(0, 2), 16);
  const g = parseInt(hexClean.substring(2, 4), 16);
  const b = parseInt(hexClean.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

const getGradientBackground = (hex, direction = "to bottom", opacity1 = 0.1, opacity2 = 0.05) => {
  const color1 = hexToRgba(hex, opacity1);
  const color2 = hexToRgba(hex, opacity2);
  return `linear-gradient(${direction}, ${color1}, ${color2}, ${color1})`;
};

const getActiveGradient = (hex, opacity1 = 0.9, opacity2 = 0.7) => {
  return getGradientBackground(hex, "to right", opacity1, opacity2);
};

const getHoverColor = (hex, opacity = 0.1) => {
  return hexToRgba(hex, opacity);
};

const getSelectedColor = (hex, opacity = 0.25) => {
  return hexToRgba(hex, opacity);
};

export function useMtkColor() {
  const selectedMtk = useAppSelector((state) => state.mtk.selectedMtk);
  const storedColorCode = useAppSelector((state) => state.mtk.storedColorCode);
  
  const colorCode = selectedMtk?.meta?.color_code || storedColorCode || "#dc2626";

  return {
    colorCode,
    getRgba: (opacity = 1) => hexToRgba(colorCode, opacity),
    getContrastColor: () => getContrastColor(colorCode),
    getGradientBackground: (direction, opacity1, opacity2) => 
      getGradientBackground(colorCode, direction, opacity1, opacity2),
    getActiveGradient: (opacity1, opacity2) => 
      getActiveGradient(colorCode, opacity1, opacity2),
    getHoverColor: (opacity) => getHoverColor(colorCode, opacity),
    getSelectedColor: (opacity) => getSelectedColor(colorCode, opacity),
    defaultColor: "#dc2626",
    defaultHover: "rgba(220, 38, 38, 0.15)",
    defaultSelected: "rgba(220, 38, 38, 0.25)",
  };
}

