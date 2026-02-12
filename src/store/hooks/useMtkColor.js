import { useAppSelector } from '../hooks';
import { selectMtk, selectStoredColorCode } from '../selectors';
import { colorUtils } from './colorUtils';

export function useMtkColor() {
  const mtk = useAppSelector(selectMtk);
  const storedColorCode = useAppSelector(selectStoredColorCode);
  
  const colorCode = mtk?.meta?.color_code || storedColorCode;

  return {
    colorCode,
    getRgba: (opacity = 1) => colorUtils.hexToRgba(colorCode, opacity),
    getContrastColor: () => colorUtils.getContrastColor(colorCode),
    getGradientBackground: (direction, opacity1, opacity2) => 
      colorUtils.getGradientBackground(colorCode, direction, opacity1, opacity2),
    getActiveGradient: (opacity1, opacity2) => 
      colorUtils.getActiveGradient(colorCode, opacity1, opacity2),
    getHoverColor: (opacity) => colorUtils.getHoverColor(colorCode, opacity),
    getSelectedColor: (opacity) => colorUtils.getSelectedColor(colorCode, opacity),
    defaultColor: "#3b82f6",
    defaultHover: "rgba(59, 130, 246, 0.15)",
    defaultSelected: "rgba(59, 130, 246, 0.25)",
  };
}


