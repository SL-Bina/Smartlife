import React, { useState, useEffect, useRef } from "react";
import { CustomButton } from "./CustomButton";
import { CustomInput } from "./CustomInput";
import { CustomTypography } from "./CustomTypography";
import { EyeDropperIcon, XMarkIcon } from "@heroicons/react/24/outline";

// RGB to HSL conversion
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
      default:
        h = 0;
    }
  }
  return [h * 360, s * 100, l * 100];
}

// HSL to RGB conversion
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

// RGB to Hex
function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export default function AdvancedColorPicker({ value = "", onChange, label = "Rəng kodu", className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [lightness, setLightness] = useState(0);
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
  const [hex, setHex] = useState("#000000");
  const [position, setPosition] = useState({ top: true, left: true });
  const pickerRef = useRef(null);
  const hueRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  // Initialize from value
  useEffect(() => {
    if (value) {
      const rgbVal = hexToRgb(value);
      setRgb(rgbVal);
      const [h, s, l] = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      setHue(h);
      setSaturation(s);
      setLightness(l);
      setHex(value);
    }
  }, [value]);

  // Update hex when RGB changes
  useEffect(() => {
    const newHex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setHex(newHex);
    onChange?.(newHex);
  }, [rgb]);

  const updateColorFromHsl = (h, s, l) => {
    const newRgb = hslToRgb(h, s, l);
    setRgb({ r: newRgb[0], g: newRgb[1], b: newRgb[2] });
  };

  const handlePickerClick = (e) => {
    if (!pickerRef.current) return;
    const rect = pickerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setSaturation(x * 100);
    setLightness((1 - y) * 100);
    updateColorFromHsl(hue, x * 100, (1 - y) * 100);
  };

  const handlePickerMouseDown = (e) => {
    isDragging.current = true;
    handlePickerClick(e);
  };

  const handlePickerMouseMove = (e) => {
    if (isDragging.current) {
      handlePickerClick(e);
    }
  };

  const handlePickerMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    if (isDragging.current) {
      document.addEventListener("mousemove", handlePickerMouseMove);
      document.addEventListener("mouseup", handlePickerMouseUp);
      return () => {
        document.removeEventListener("mousemove", handlePickerMouseMove);
        document.removeEventListener("mouseup", handlePickerMouseUp);
      };
    }
  }, [isDragging.current]);

  const handleHueClick = (e) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newHue = x * 360;
    setHue(newHue);
    updateColorFromHsl(newHue, saturation, lightness);
  };

  const handleHueMouseDown = (e) => {
    isDragging.current = true;
    handleHueClick(e);
  };

  const handleRgbChange = (component, val) => {
    const num = parseInt(val) || 0;
    const clamped = Math.max(0, Math.min(255, num));
    const newRgb = { ...rgb, [component]: clamped };
    setRgb(newRgb);
    const [h, s, l] = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setHue(h);
    setSaturation(s);
    setLightness(l);
  };

  const handleHexChange = (val) => {
    if (/^#?[0-9A-Fa-f]{0,6}$/.test(val)) {
      setHex(val.startsWith("#") ? val : `#${val}`);
      if (val.length === 7 || (val.length === 6 && !val.startsWith("#"))) {
        const rgbVal = hexToRgb(val);
        setRgb(rgbVal);
        const [h, s, l] = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
        setHue(h);
        setSaturation(s);
        setLightness(l);
      }
    }
  };

  const handleEyeDropper = async () => {
    if (!window.EyeDropper) {
      // Browser doesn't support eyedropper - silently fail or show message via parent
      return;
    }

    try {
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      const rgbVal = hexToRgb(result.sRGBHex);
      setRgb(rgbVal);
      const [h, s, l] = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      setHue(h);
      setSaturation(s);
      setLightness(l);
      setHex(result.sRGBHex);
      onChange?.(result.sRGBHex);
    } catch (e) {
      // User cancelled or error - silently fail
    }
  };

  const currentColor = `hsl(${hue}, 100%, 50%)`;
  const pickerBg = `linear-gradient(to right, white 0%, ${currentColor} 100%), linear-gradient(to top, black 0%, transparent 100%)`;

  const calculatePosition = () => {
    if (!containerRef.current) return { top: true, left: true };

    const rect = containerRef.current.getBoundingClientRect();
    const modalHeight = 400; // Approximate modal height
    const modalWidth = 288; // w-72 = 288px
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Check if there's space below
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Check if there's space on the right
    const spaceRight = viewportWidth - rect.left;
    const spaceLeft = rect.left;

    return {
      top: spaceBelow < modalHeight && spaceAbove > spaceBelow ? false : true,
      left: spaceRight < modalWidth && spaceLeft > spaceRight ? false : true,
    };
  };

  const handleToggle = () => {
    if (!isOpen) {
      const pos = calculatePosition();
      setPosition(pos);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
          style={{ backgroundColor: hex }}
          onClick={handleToggle}
        />
        <CustomInput
          label={label}
          value={hex}
          onChange={(e) => handleHexChange(e.target.value)}
          className="flex-1"
        />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={`absolute w-72 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl z-50 p-3 ${
              position.top ? "top-full mt-2" : "bottom-full mb-2"
            } ${position.left ? "left-0" : "right-0"}`}
          >
            {/* Main Color Picker */}
            <div
              ref={pickerRef}
              className="w-full h-40 rounded-lg cursor-crosshair relative mb-3 border border-gray-300 dark:border-gray-600"
              style={{
                background: pickerBg,
              }}
              onMouseDown={handlePickerMouseDown}
            >
              {/* Selector */}
              <div
                className="absolute w-3 h-3 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${saturation}%`,
                  top: `${100 - lightness}%`,
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 mb-3">
              {/* Eye Dropper */}
              {typeof window !== "undefined" && window.EyeDropper && (
                <button
                  type="button"
                  onClick={handleEyeDropper}
                  className="p-1.5 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  title="Rəng seçici"
                >
                  <EyeDropperIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </button>
              )}

              {/* Color Preview */}
              <div
                className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: hex }}
              />

              {/* Hue Slider */}
              <div className="flex-1 relative">
                <div
                  ref={hueRef}
                  className="w-full h-5 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                  }}
                  onMouseDown={handleHueMouseDown}
                >
                  <div
                    className="absolute top-0 w-1 h-full bg-white border border-gray-400 transform -translate-x-1/2 pointer-events-none"
                    style={{
                      left: `${(hue / 360) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* RGB Inputs */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <CustomTypography variant="small" className="text-gray-600 dark:text-gray-400 mb-1">
                  R
                </CustomTypography>
                <CustomInput
                  value={rgb.r}
                  onChange={(e) => handleRgbChange("r", e.target.value)}
                  type="number"
                  min="0"
                  max="255"
                  className="w-full"
                />
              </div>
              <div>
                <CustomTypography variant="small" className="text-gray-600 dark:text-gray-400 mb-1">
                  G
                </CustomTypography>
                <CustomInput
                  value={rgb.g}
                  onChange={(e) => handleRgbChange("g", e.target.value)}
                  type="number"
                  min="0"
                  max="255"
                  className="w-full"
                />
              </div>
              <div>
                <CustomTypography variant="small" className="text-gray-600 dark:text-gray-400 mb-1">
                  B
                </CustomTypography>
                <CustomInput
                  value={rgb.b}
                  onChange={(e) => handleRgbChange("b", e.target.value)}
                  type="number"
                  min="0"
                  max="255"
                  className="w-full"
                />
              </div>
            </div>

            {/* Hex Input */}
            <div className="mb-3">
              <CustomInput
                label="Hex"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <CustomButton
                variant="outlined"
                color="gray"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Ləğv et
              </CustomButton>
              <CustomButton
                color="blue"
                size="sm"
                onClick={() => {
                  onChange?.(hex);
                  setIsOpen(false);
                }}
              >
                Təsdiq et
              </CustomButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

