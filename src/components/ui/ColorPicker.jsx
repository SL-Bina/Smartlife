import React, { useState } from "react";
import { SwatchIcon } from "@heroicons/react/24/outline";
import { CustomInput } from "./CustomInput";
import { CustomTypography } from "./CustomTypography";

const COLOR_PALETTE = [
  "#FF0000", "#FF5733", "#FF8C00", "#FFA500", "#FFD700", "#FFFF00", "#ADFF2F", "#00FF00",
  "#32CD32", "#00FA9A", "#00CED1", "#1E90FF", "#0000FF", "#8A2BE2", "#FF1493", "#FF69B4",
  "#DC143C", "#B22222", "#8B0000", "#2F4F4F", "#696969", "#000000", "#FFFFFF", "#C0C0C0",
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
];

export default function ColorPicker({ value = "", onChange, label = "Rəng kodu", className = "" }) {
  const [inputValue, setInputValue] = useState(value || "");
  const [isValid, setIsValid] = useState(true);
  const [showPalette, setShowPalette] = useState(false);

  React.useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const validateColor = (color) => {
    if (!color) return true;
    // Hex color validation
    const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexPattern.test(color);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    const valid = validateColor(newValue);
    setIsValid(valid);
    if (valid) {
      onChange?.(newValue);
    }
  };

  const handlePaletteSelect = (color) => {
    setInputValue(color);
    setIsValid(true);
    onChange?.(color);
    setShowPalette(false);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex gap-2">
        <div className="flex-1">
          <CustomInput
            label={label}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="#FF5733"
            error={!isValid ? "Yanlış rəng formatı (məs: #FF5733)" : false}
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPalette(!showPalette)}
            className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Rəng palitrası"
          >
            <SwatchIcon className="h-5 w-5" />
          </button>

          {showPalette && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowPalette(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 p-4">
                <div className="flex flex-col gap-3">
                  <CustomTypography variant="h6" className="text-gray-900 dark:text-white font-semibold">
                    Rəng seç
                  </CustomTypography>
                  <div className="grid grid-cols-8 gap-2">
                    {COLOR_PALETTE.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handlePaletteSelect(color)}
                        className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                          inputValue === color
                            ? "border-blue-500 ring-2 ring-blue-300"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  {inputValue && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div
                        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: inputValue || "#FFFFFF" }}
                      />
                      <CustomTypography variant="small" className="text-gray-700 dark:text-gray-200">
                        {inputValue || "Rəng seçilməyib"}
                      </CustomTypography>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
