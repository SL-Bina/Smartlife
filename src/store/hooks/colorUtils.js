export const colorUtils = {
  hexToRgb: (hex) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return { r, g, b };
  },

  hexToRgba: (hex, opacity = 1) => {
    if (!hex) return null;
    const rgb = colorUtils.hexToRgb(hex);
    if (!rgb) return null;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
  },

  getContrastColor: (hexColor) => {
    if (!hexColor) return "#000000";
    const rgb = colorUtils.hexToRgb(hexColor);
    if (!rgb) return "#000000";
    
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  },

  getGradientBackground: (hexColor, direction = "to right", opacity1 = 0.1, opacity2 = 0.05) => {
    if (!hexColor) return {};
    const color1 = colorUtils.hexToRgba(hexColor, opacity1);
    const color2 = colorUtils.hexToRgba(hexColor, opacity2);
    if (!color1 || !color2) return {};
    return {
      background: `linear-gradient(${direction}, ${color1}, ${color2}, ${color1})`,
    };
  },

  getActiveGradient: (hexColor, opacity1 = 0.9, opacity2 = 1) => {
    if (!hexColor) return {};
    const color1 = colorUtils.hexToRgba(hexColor, opacity1);
    const color2 = colorUtils.hexToRgba(hexColor, opacity2);
    if (!color1 || !color2) return {};
    return {
      background: `linear-gradient(to right, ${color1}, ${color2})`,
      boxShadow: `0 10px 15px -3px ${colorUtils.hexToRgba(hexColor, 0.3)}, 0 4px 6px -2px ${colorUtils.hexToRgba(hexColor, 0.2)}`,
    };
  },

  getHoverColor: (hexColor, opacity = 0.15) => {
    return colorUtils.hexToRgba(hexColor, opacity);
  },

  getSelectedColor: (hexColor, opacity = 0.25) => {
    return colorUtils.hexToRgba(hexColor, opacity);
  },
};


