import { useSelector } from 'react-redux';


const PALETTE_FALLBACK = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ef4444',
  '#06b6d4',
  '#84cc16',
];

const normalizeHexColor = (value) => {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  return `#${cleaned}`;
};

const buildColorFallbackByComplex = (property) => {
  const key =
    property?.sub_data?.complex?.id ||
    property?.complex_id ||
    property?.sub_data?.complex?.name ||
    property?.id ||
    0;
  const keyString = String(key);
  let hash = 0;
  for (let i = 0; i < keyString.length; i += 1) {
    hash = (hash + keyString.charCodeAt(i)) % 997;
  }
  return PALETTE_FALLBACK[hash % PALETTE_FALLBACK.length];
};

const extractComplexColor = (property) => {
  if (!property) return '#3b82f6';
  const candidates = [
    property?.sub_data?.complex?.meta?.color_code,
    property?.sub_data?.complex?.meta?.color,
    property?.sub_data?.complex?.color_code,
    property?.sub_data?.complex?.color,
    property?.complex?.meta?.color_code,
    property?.complex?.color_code,
    property?.meta?.complex_color,
    property?.meta?.color_code,
  ];
  for (const candidate of candidates) {
    const normalized = normalizeHexColor(candidate);
    if (normalized) return normalized;
  }
  return buildColorFallbackByComplex(property);
};

const toRgba = (hex, opacity = 1) => {
  if (!hex) return `rgba(59,130,246,${opacity})`;
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export function useComplexColor() {
  const selectedProperty = useSelector((state) => state.property.selectedProperty);
  const color = extractComplexColor(selectedProperty);

  const getRgba = (opacity = 1) => toRgba(color, opacity);

  const headerStyle = {
    background: `linear-gradient(135deg, ${getRgba(1)}, ${getRgba(0.8)})`,
    borderColor: getRgba(0.5),
  };
  const modalHeaderStyle = {
    background: `linear-gradient(135deg, ${getRgba(0.15)}, ${getRgba(0.08)})`,
    borderColor: getRgba(0.25),
  };

  return {
    color,
    getRgba,
    headerStyle,
    modalHeaderStyle,
  };
}

export default useComplexColor;
