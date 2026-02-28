import { useDispatch, useSelector } from "react-redux";
import myPropertiesAPI from "@/pages/resident/myproperties/api";
import { setSelectedProperty } from "@/store/slices/propertySlice";
import { useAuth } from "@/store/exports";
import React from "react";
import { IconButton, Typography, Menu, MenuHandler, MenuList } from "@material-tailwind/react";
import { CheckIcon } from "@heroicons/react/24/solid";
import { Squares2X2Icon, BuildingOfficeIcon, HomeModernIcon } from "@heroicons/react/24/outline";

function PropertySelectorMenu() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const selectedPropertyId = useSelector((state) => state.property.selectedPropertyId);
  const [properties, setProperties] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const isResident = user?.is_resident === true;

  React.useEffect(() => {
    if (!isResident) {
      setProperties([]);
      return;
    }

    let active = true;
    setLoading(true);

    myPropertiesAPI
      .getAll()
      .then((response) => {
        if (!active) return;
        const list = response?.data?.data || response?.data || [];
        const normalizedList = Array.isArray(list) ? list : [];
        setProperties(normalizedList);

        if (!selectedPropertyId && normalizedList.length > 0) {
          const autoSelected = normalizePropertyForStore(normalizedList[0]);
          dispatch(setSelectedProperty({ id: autoSelected?.id ?? null, property: autoSelected }));
        }
      })
      .catch(() => {
        if (!active) return;
        setProperties([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isResident, user?.id, selectedPropertyId, dispatch]);

  const getPropertyMeta = (property) => {
    const mtkName = property?.sub_data?.mtk?.name || property?.mtk?.name || "MTK";
    const complexName = property?.sub_data?.complex?.name || property?.complex?.name || "Kompleks";
    const buildingName =
      property?.sub_data?.building?.name ||
      property?.building?.name ||
      (property?.building_id ? `Bina #${property.building_id}` : "Bina");
    const blockName =
      property?.sub_data?.block?.name ||
      property?.block?.name ||
      (property?.block_id ? `Blok #${property.block_id}` : "Blok");
    const apartmentName = property?.name || property?.meta?.apartment_number || `Mənzil #${property?.id}`;
    return { mtkName, complexName, buildingName, blockName, apartmentName };
  };

  const paletteFallback = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#84cc16"];

  const normalizeHexColor = (value) => {
    if (typeof value !== "string") return null;
    const cleaned = value.trim().replace("#", "");
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
    for (let index = 0; index < keyString.length; index += 1) {
      hash = (hash + keyString.charCodeAt(index)) % 997;
    }

    return paletteFallback[hash % paletteFallback.length];
  };

  const getComplexColor = (property) => {
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

  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const normalizePropertyForStore = (property) => {
    if (!property) return null;

    const normalizedSubData = {
      ...(property.sub_data || {}),
      mtk: property?.sub_data?.mtk || property?.mtk || null,
      complex: property?.sub_data?.complex || property?.complex || null,
      building: property?.sub_data?.building || property?.building || null,
      block: property?.sub_data?.block || property?.block || null,
    };

    return {
      ...property,
      sub_data: normalizedSubData,
    };
  };

  const handleSelect = (property) => {
    const normalizedProperty = normalizePropertyForStore(property);
    dispatch(setSelectedProperty({ id: normalizedProperty?.id ?? null, property: normalizedProperty }));
  };

  if (!isResident || (!loading && properties.length === 0)) {
    return null;
  }

  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <IconButton
          variant="text"
          color="blue-gray"
          className="dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-xl transition-all p-1.5 shadow-sm border border-gray-200/70 dark:border-gray-700/70"
          size="sm"
        >
          <Squares2X2Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </IconButton>
      </MenuHandler>
      <MenuList className="w-[700px] max-h-[520px] overflow-y-auto dark:bg-gray-800 dark:border-gray-700 rounded-2xl shadow-2xl p-0">
        <div className="px-4 py-3 border-b border-gray-200/60 dark:border-gray-700/60 bg-gray-50/70 dark:bg-gray-900/30 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/60">
                <HomeModernIcon className="h-4.5 w-4.5 text-blue-600 dark:text-blue-300" />
              </div>
              <Typography variant="small" className="font-bold text-gray-900 dark:text-white text-sm">
                Mənzil seçimi
              </Typography>
            </div>
            <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-gray-200/80 dark:bg-gray-700/70 text-gray-700 dark:text-gray-200">
              {properties.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="px-4 py-4">
            <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
              Yüklənir...
            </Typography>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-2 gap-4">
            {properties.map((property) => {
              const isSelected = Number(selectedPropertyId) === Number(property.id);
              const color = getComplexColor(property);
              const { mtkName, complexName, buildingName, blockName, apartmentName } = getPropertyMeta(property);

              return (
                <button
                  key={property.id}
                  type="button"
                  onClick={() => handleSelect(property)}
                  className="relative w-full min-w-0 overflow-hidden flex flex-col items-start gap-2.5 p-3.5 rounded-2xl border text-left transition-all hover:shadow-md hover:-translate-y-[1px]"
                  style={{
                    borderColor: isSelected ? getRgbaColor(color, 0.8) : "rgba(148, 163, 184, 0.3)",
                    background: isSelected
                      ? `linear-gradient(135deg, ${getRgbaColor(color, 0.2)}, ${getRgbaColor(color, 0.1)})`
                      : "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(241,245,249,0.75))",
                  }}
                >
                  <div className="flex items-start justify-between w-full">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center border"
                      style={{
                        backgroundColor: getRgbaColor(color, 0.18),
                        borderColor: getRgbaColor(color, 0.35),
                      }}
                    >
                      <BuildingOfficeIcon className="h-5 w-5" style={{ color }} />
                    </div>

                    {isSelected && (
                      <div
                        className="h-6 w-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: getRgbaColor(color, 0.22) }}
                      >
                        <CheckIcon className="h-4 w-4" style={{ color }} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 w-full overflow-hidden">
                    <Typography  className="text-sm font-bold text-gray-900 dark:text-gray-100 break-words leading-tight line-clamp-2" style={{ overflowWrap: "anywhere" }}>
                      {apartmentName}
                    </Typography>
                    <Typography  className="text-[12px] text-gray-500 dark:text-gray-400 break-words leading-tight line-clamp-2 mt-1" style={{ overflowWrap: "anywhere" }}>
                      MTK: {mtkName}
                    </Typography>
                    <Typography  className="text-[12px] text-gray-500 dark:text-gray-400 break-words leading-tight line-clamp-2" style={{ overflowWrap: "anywhere" }}>
                      Kompleks: {complexName}
                    </Typography>
                    {/* <Typography  className="text-[10px] text-gray-600 dark:text-gray-300 break-words leading-tight line-clamp-2" style={{ overflowWrap: "anywhere" }}>
                      {buildingName} • {blockName}
                    </Typography> */}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </MenuList>
    </Menu>
  );
}

export default PropertySelectorMenu;