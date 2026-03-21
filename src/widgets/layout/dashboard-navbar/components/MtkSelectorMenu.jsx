import React from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@/store/hooks/useAuth";
import { setSelectedMtk } from "@/store/slices/management/mtkSlice";
import { Menu, MenuHandler, MenuList, Typography, IconButton } from "@material-tailwind/react";
import { BuildingLibraryIcon, CheckIcon } from "@heroicons/react/24/outline";
import api from "@/services/api";

const hexToRgba = (hex, opacity = 1) => {
  if (!hex) return null;
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

function MtkSelectorMenu({ isMobile = false }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const selectedMtkId = useSelector((state) => state.mtk.selectedMtkId);
  const [mtks, setMtks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const isResident = user?.is_resident === true;
  const [switching, setSwitching] = React.useState(false);
  const [switchingMtk, setSwitchingMtk] = React.useState(null);

  React.useEffect(() => {
    if (isResident) return;

    let active = true;
    setLoading(true);

    api
      .get("/search/module/mtk", { params: { per_page: 200, page: 1 } })
      .then((res) => {
        if (!active) return;
        const d = res?.data?.data;
        const list = Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
        setMtks(list);

        // Auto-select first MTK if none selected
        if (!selectedMtkId && list.length > 0) {
          dispatch(setSelectedMtk({ id: list[0].id, mtk: list[0] }));
        }
      })
      .catch(() => { if (active) setMtks([]); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [isResident, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (mtk) => {
    if (mtk.id === selectedMtkId) return;
    dispatch(setSelectedMtk({ id: mtk.id, mtk }));
    setSwitchingMtk(mtk);
    setSwitching(true);
    setTimeout(() => {
      window.location.href = "/dashboard/home";
    }, 1500);
  };

  if (isResident || (!loading && mtks.length === 0)) return null;

  const selectedMtk = mtks.find((m) => m.id === selectedMtkId);
  const activeColor = selectedMtk?.meta?.color_code || null;

  const switchColor = switchingMtk?.meta?.color_code || activeColor || "#3b82f6";

  const SwitchingOverlay = switching
    ? ReactDOM.createPortal(
        <div
          className="mtk-overlay-enter"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${hexToRgba(switchColor, 0.96)}, ${hexToRgba(switchColor, 0.82)})`,
            backdropFilter: "blur(12px)",
          }}
        >
          <style>{`
            @keyframes mtk-fade-in {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            @keyframes mtk-spin-ring {
              to { transform: rotate(360deg); }
            }
            @keyframes mtk-pulse-logo {
              0%, 100% { transform: scale(1);   opacity: 1; }
              50%       { transform: scale(1.08); opacity: 0.85; }
            }
          `}</style>

          {/* Decorative blobs */}
          <div style={{
            position: "absolute", top: "-80px", right: "-80px",
            width: "320px", height: "320px", borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", bottom: "-100px", left: "-60px",
            width: "260px", height: "260px", borderRadius: "50%",
            background: "rgba(255,255,255,0.06)", pointerEvents: "none",
          }} />

          {/* Spinner + icon */}
          <div style={{ position: "relative", width: "96px", height: "96px", marginBottom: "28px" }}>
            {/* Rotating ring */}
            <svg
              viewBox="0 0 96 96"
              className="mtk-spin-ring"
              style={{ position: "absolute", inset: 0 }}
            >
              <circle
                cx="48" cy="48" r="44"
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="4"
              />
              <circle
                cx="48" cy="48" r="44"
                fill="none"
                stroke="rgba(255,255,255,0.9)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="70 210"
                strokeDashoffset="0"
              />
            </svg>

            {/* Center icon */}
            <div
              className="mtk-pulse-logo"
              style={{
                position: "absolute", inset: "12px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <BuildingLibraryIcon style={{ width: "36px", height: "36px", color: "#fff" }} />
            </div>
          </div>

          {/* MTK name */}
          {switchingMtk?.name && (
            <p style={{
              color: "#fff",
              fontSize: "22px",
              fontWeight: 700,
              letterSpacing: "-0.3px",
              marginBottom: "8px",
              textAlign: "center",
              textShadow: "0 1px 8px rgba(0,0,0,0.18)",
            }}>
              {switchingMtk.name}
            </p>
          )}

          <p style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "0.2px",
            textAlign: "center",
          }}>
            Panel yüklənir...
          </p>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      {SwitchingOverlay}
      <Menu placement="bottom-end">
      <MenuHandler>
        <IconButton
          variant="text"
          color="blue-gray"
          className="dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-xl transition-all p-1.5 shadow-sm border border-gray-200/70 dark:border-gray-700/70"
          size="sm"
          style={activeColor ? {
            borderColor: hexToRgba(activeColor, 0.5),
            backgroundColor: hexToRgba(activeColor, 0.08),
          } : {}}
        >
          <BuildingLibraryIcon
            className="h-5 w-5"
            style={{ color: activeColor || undefined }}
          />
        </IconButton>
      </MenuHandler>
      <MenuList className={`${isMobile ? "w-[90vw] max-w-[380px]" : "w-[420px]"} max-h-[480px] overflow-y-auto dark:bg-gray-800 dark:border-gray-700 rounded-2xl shadow-2xl p-0`}>
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200/60 dark:border-gray-700/60 bg-gray-50/70 dark:bg-gray-900/30 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/60">
                <BuildingLibraryIcon className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
              <Typography variant="small" className="font-bold text-gray-900 dark:text-white text-sm">
                MTK seçimi
              </Typography>
            </div>
            <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-gray-200/80 dark:bg-gray-700/70 text-gray-700 dark:text-gray-200">
              {mtks.length}
            </span>
          </div>
        </div>

        {/* MTK list */}
        {loading ? (
          <div className="px-4 py-4">
            <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
              Yüklənir...
            </Typography>
          </div>
        ) : (
          <div className="p-3 flex flex-col gap-2">
            {mtks.map((mtk) => {
              const isSelected = selectedMtkId === mtk.id;
              const color = mtk?.meta?.color_code || null;

              return (
                <button
                  key={mtk.id}
                  type="button"
                  onClick={() => handleSelect(mtk)}
                  className="relative w-full overflow-hidden flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:shadow-md hover:-translate-y-[1px]"
                  style={{
                    borderColor: isSelected
                      ? (color ? hexToRgba(color, 0.7) : "rgba(59,130,246,0.7)")
                      : "rgba(148,163,184,0.3)",
                    background: isSelected
                      ? (color
                          ? `linear-gradient(135deg, ${hexToRgba(color, 0.18)}, ${hexToRgba(color, 0.08)})`
                          : "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.07))")
                      : "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(241,245,249,0.75))",
                  }}
                >
                  {/* Color dot */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border"
                    style={{
                      backgroundColor: color ? hexToRgba(color, 0.18) : "rgba(59,130,246,0.12)",
                      borderColor: color ? hexToRgba(color, 0.35) : "rgba(59,130,246,0.25)",
                    }}
                  >
                    <BuildingLibraryIcon
                      className="h-5 w-5"
                      style={{ color: color || "#3b82f6" }}
                    />
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <Typography
                      className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate"
                      style={isSelected && color ? { color } : {}}
                    >
                      {mtk.name}
                    </Typography>
                    {color && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <Typography className="text-[11px] text-gray-400 dark:text-gray-500">
                          {color}
                        </Typography>
                      </div>
                    )}
                  </div>

                  {/* Check */}
                  {isSelected && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: color ? hexToRgba(color, 0.2) : "rgba(59,130,246,0.2)" }}
                    >
                      <CheckIcon
                        className="h-4 w-4"
                        style={{ color: color || "#3b82f6" }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </MenuList>
    </Menu>
    </>
  );
}

export default MtkSelectorMenu;
