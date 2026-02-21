import React from "react";
import { IconButton, Typography } from "@material-tailwind/react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import {
  CloudIcon,
  SunIcon,
  CloudArrowDownIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { useMaterialTailwindController, setOpenSidenav } from "@/store/exports";
import { NavbarBreadcrumbs } from "./NavbarBreadcrumbs";
import { DarkModeToggle } from "./DarkModeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import routes from "@/routes";
import { useAuth } from "@/store/hooks/useAuth";
import { filterRoutesByRole } from "@/layouts/dashboard";

/* --------------------------- Weather Pill (center, dynamic) --------------------------- */
/**
 * - Geolocation (current location)
 * - Open-Meteo current weather (no key)
 * - Reverse geocoding for place name (Open-Meteo reverse). If fails -> "Nearby"
 *
 * Weather: https://api.open-meteo.com/v1/forecast
 * Reverse geocode: https://geocoding-api.open-meteo.com/v1/reverse
 */
function WeatherPillCenter() {
  const [state, setState] = React.useState({
    loading: true,
    error: null,
    temp: null,
    code: null,
    place: "Nearby",
  });

  const abortRef = React.useRef(null);

  const getUiByCode = (code) => {
    // Open-Meteo weathercode mapping (simplified)
    // 0 clear, 1-3 partly/cloudy, 45-48 fog, 51-67 drizzle/rain, 71-77 snow, 80-82 showers, 95-99 thunder
    if (code === 0)
      return {
        label: "Açıq",
        Icon: SunIcon,
        pill:
          "bg-[radial-gradient(900px_400px_at_20%_10%,rgba(255,255,255,.18),transparent_60%),radial-gradient(700px_320px_at_80%_30%,rgba(255,200,0,.22),transparent_55%),linear-gradient(135deg,rgba(245,158,11,.28),rgba(15,23,42,.92))]",
      };
    if ([1, 2].includes(code))
      return {
        label: "Az buludlu",
        Icon: CloudIcon,
        pill:
          "bg-[radial-gradient(900px_400px_at_20%_10%,rgba(255,255,255,.18),transparent_60%),radial-gradient(700px_320px_at_80%_30%,rgba(59,130,246,.25),transparent_55%),linear-gradient(135deg,rgba(37,99,235,.22),rgba(15,23,42,.92))]",
      };
    if (code === 3)
      return {
        label: "Buludlu",
        Icon: CloudIcon,
        pill:
          "bg-[radial-gradient(900px_400px_at_20%_10%,rgba(255,255,255,.14),transparent_60%),radial-gradient(700px_320px_at_80%_30%,rgba(148,163,184,.20),transparent_55%),linear-gradient(135deg,rgba(71,85,105,.30),rgba(15,23,42,.92))]",
      };
    if ([45, 48].includes(code))
      return {
        label: "Duman",
        Icon: CloudIcon,
        pill:
          "bg-[radial-gradient(900px_400px_at_20%_10%,rgba(255,255,255,.14),transparent_60%),radial-gradient(700px_320px_at_80%_30%,rgba(203,213,225,.18),transparent_55%),linear-gradient(135deg,rgba(100,116,139,.26),rgba(15,23,42,.92))]",
      };
    if (
      [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)
    )
      return {
        label: "Yağış",
        Icon: CloudArrowDownIcon,
        pill:
          "bg-[radial-gradient(900px_400px_at_20%_10%,rgba(255,255,255,.16),transparent_60%),radial-gradient(700px_320px_at_80%_30%,rgba(14,165,233,.26),transparent_55%),linear-gradient(135deg,rgba(2,132,199,.26),rgba(15,23,42,.92))]",
      };
    if ([71, 73, 75, 77, 85, 86].includes(code))
      return {
        label: "Qar",
        Icon: CloudIcon,
        pill:
          "bg-[radial-gradient(900px_400px_at_20%_10%,rgba(255,255,255,.18),transparent_60%),radial-gradient(700px_320px_at_80%_30%,rgba(226,232,240,.22),transparent_55%),linear-gradient(135deg,rgba(148,163,184,.22),rgba(15,23,42,.92))]",
      };
    if ([95, 96, 99].includes(code))
      return {
        label: "Şimşək",
        Icon: BoltIcon,
        pill:
          "bg-[radial-gradient(900px_400px_at_20%_10%,rgba(255,255,255,.16),transparent_60%),radial-gradient(700px_320px_at_80%_30%,rgba(168,85,247,.26),transparent_55%),linear-gradient(135deg,rgba(124,58,237,.26),rgba(15,23,42,.92))]",
      };

    return {
      label: "Hava",
      Icon: CloudIcon,
      pill:
        "bg-[radial-gradient(900px_400px_at_20%_10%,rgba(255,255,255,.16),transparent_60%),radial-gradient(700px_320px_at_80%_30%,rgba(59,130,246,.22),transparent_55%),linear-gradient(135deg,rgba(30,64,175,.22),rgba(15,23,42,.92))]",
    };
  };

  // Fallback function to get approximate city name
  const getCityNameFromCoordinates = React.useCallback((lat, lon) => {
    // Approximate city detection based on coordinates
    // This is a simple fallback - you can enhance it with a local database
    if (lat >= 40.0 && lat <= 41.0 && lon >= 49.0 && lon <= 50.0) {
      return "Baku, Azerbaijan";
    }
    // Add more regions as needed
    return "Nearby";
  }, []);

  const fetchWeather = React.useCallback(async (lat, lon) => {
    abortRef.current?.abort?.();
    const controller = new AbortController();
    abortRef.current = controller;

    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}` +
      `&longitude=${encodeURIComponent(lon)}` +
      `&current=temperature_2m,weather_code` +
      `&timezone=auto`;

    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error("Weather fetch failed");
    const data = await res.json();

    const temp = data?.current?.temperature_2m;
    const code = data?.current?.weather_code;

    return { temp, code };
  }, []);

  const fetchPlace = React.useCallback(async (lat, lon) => {
    try {
      // Try using CORS proxy or direct API call
      const url =
        `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${encodeURIComponent(lat)}` +
        `&longitude=${encodeURIComponent(lon)}&language=en`;

      const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        // If API fails, try to get city name from coordinates using alternative method
        return getCityNameFromCoordinates(lat, lon);
      }

      const data = await res.json();

      const best = data?.results?.[0];
      const name = best?.name;
      const admin = best?.admin1 || best?.admin2;
      const country = best?.country;

      // Short pretty label
      return [name, admin, country].filter(Boolean).join(", ") || "Nearby";
    } catch (error) {
      // If CORS or network error, use fallback
      console.warn("Geocoding API error:", error);
      return getCityNameFromCoordinates(lat, lon);
    }
  }, [getCityNameFromCoordinates]);

  React.useEffect(() => {
    let mounted = true;

    const run = async () => {
      setState((p) => ({ ...p, loading: true, error: null }));

      if (!("geolocation" in navigator)) {
        setState((p) => ({
          ...p,
          loading: false,
          error: "Geolocation not supported",
        }));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;

            // Fetch weather first (this usually works)
            const w = await fetchWeather(lat, lon);
            
            // Try to get place name, but don't fail if it doesn't work
            // fetchPlace already has error handling and fallback
            const place = await fetchPlace(lat, lon);

            if (!mounted) return;

            setState((p) => ({
              ...p,
              loading: false,
              error: null,
              temp: typeof w.temp === "number" ? Math.round(w.temp) : null,
              code: typeof w.code === "number" ? w.code : null,
              place: place || "Nearby",
            }));
          } catch (e) {
            if (!mounted) return;
            setState((p) => ({
              ...p,
              loading: false,
              error: e?.message || "Weather error",
            }));
          }
        },
        (err) => {
          if (!mounted) return;
          const msg =
            err?.code === 1
              ? "Location off"
              : err?.code === 2
              ? "Location unavailable"
              : "Location error";
          setState((p) => ({ ...p, loading: false, error: msg }));
        },
        {
          enableHighAccuracy: false,
          timeout: 9000,
          maximumAge: 5 * 60 * 1000,
        }
      );
    };

    run();

    return () => {
      mounted = false;
      abortRef.current?.abort?.();
    };
  }, [fetchWeather, fetchPlace]);

  const ui = getUiByCode(state.code);
  const WIcon = ui.Icon;

  return (
    <div className="hidden lg:flex items-center justify-center w-full">
      {/* Center pill: responsive */}
      <div
        className={`
          relative
          w-full max-w-[420px] lg:max-w-[500px] xl:max-w-[560px] 2xl:max-w-[600px]
          px-3 lg:px-3.5 xl:px-4
          py-2 lg:py-2.5
          rounded-xl lg:rounded-xl xl:rounded-2xl
          border border-white/10 dark:border-white/10
          shadow-[0_8px_25px_rgba(0,0,0,.18)]
          overflow-hidden
          ${ui.pill}
          text-white
        `}
        title="Weather (current location)"
      >
        <div className="flex items-center gap-2 lg:gap-2.5">
          <div className="rounded-lg lg:rounded-xl bg-white/10 border border-white/10 p-1.5 lg:p-2 flex-shrink-0">
            {state.error ? (
              <ExclamationTriangleIcon className="h-4 w-4 lg:h-5 lg:w-5 text-white/90" />
            ) : (
              <WIcon className="h-4 w-4 lg:h-5 lg:w-5 text-white/90" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 lg:gap-1.5 text-white/80">
              <MapPinIcon className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-white/70 flex-shrink-0" />
              <span className="text-[10px] lg:text-[11px] font-medium truncate">
                {state.loading ? "Finding location…" : state.place}
              </span>
            </div>

            <div className="flex items-end justify-between gap-2 lg:gap-2.5 mt-0.5">
              {state.loading ? (
                <Typography className="text-xs lg:text-sm font-semibold text-white/90">
                  Loading…
                </Typography>
              ) : state.error ? (
                <Typography className="text-xs lg:text-sm font-semibold text-white/90">
                  {state.error}
                </Typography>
              ) : (
                <>
                  <div className="flex items-end gap-1.5 lg:gap-2">
                    <Typography className="text-lg lg:text-xl font-bold leading-none text-white">
                      {state.temp ?? "—"}°C
                    </Typography>
                    <Typography className="text-[11px] lg:text-[12px] font-semibold text-white/80">
                      {ui.label}
                    </Typography>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* gloss */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_180px_at_25%_10%,rgba(255,255,255,.18),transparent_55%)]" />
        <div className="pointer-events-none absolute -bottom-8 left-1/2 h-20 w-60 -translate-x-1/2 rounded-full bg-white/8 blur-2xl" />
      </div>
    </div>
  );
}

/* ------------------------------ Desktop Navbar ------------------------------ */
export function DesktopNavbar({ pathParts, pageTitle, fixedNavbar, navbarHoverEffects }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;
  const mtk = null;
  const colorCode = null;
  const { user, hasModuleAccess } = useAuth();
  const currentLayout = pathParts[0] || "dashboard";
  const filteredRoutes = filterRoutesByRole(routes, user, hasModuleAccess, currentLayout);
  const parentPathMap = React.useMemo(() => {
    const map = {};
    filteredRoutes.forEach(({ layout, pages }) => {
      if (layout !== currentLayout) return;
      pages.forEach((page) => {
        if (Array.isArray(page.children) && page.children.length > 0) {
          const firstVisibleChild = page.children.find((child) => !child.hideInSidenav);
          const childPath = firstVisibleChild?.path;
          if (typeof childPath === "string") {
            const seg = childPath.split("/")[1] || "";
            if (seg) {
              map[seg] = childPath;
            }
          }
        }
      });
    });
    return map;
  }, [filteredRoutes, currentLayout]);
  
  // MTK rəng kodunu al (mtk-dan və ya context-dən)
  const mtkColorCode = null;
  
  // Rəng kodunu rgba-ya çevir
  const getRgbaColor = (hex, opacity = 1) => {
    if (!hex) return null;
    const hexClean = hex.replace("#", "");
    const r = parseInt(hexClean.substring(0, 2), 16);
    const g = parseInt(hexClean.substring(2, 4), 16);
    const b = parseInt(hexClean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const getHoverClasses = () => {
    if (navbarHoverEffects === "disabled") return "";
    return "hover:scale-110 hover:shadow-lg hover:brightness-110 transition-all duration-300 ease-out";
  };

  return (
    <div className="hidden md:flex items-center justify-between gap-2 lg:gap-3 xl:gap-4 w-full">
      {/* LEFT */}
      <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3 flex-1 min-w-0">
        <IconButton
          variant="text"
          color="blue-gray"
          className={`grid xl:hidden dark:text-gray-300 flex-shrink-0 rounded-xl transition-all ${
            navbarHoverEffects === "enabled" 
              ? "hover:bg-gray-200/70 dark:hover:bg-gray-700/70 hover:scale-110 hover:rotate-3 hover:shadow-lg active:scale-95" 
              : "hover:bg-gray-200/70 dark:hover:bg-gray-700/70 active:scale-95"
          }`}
          onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          size="sm"
        >
          <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center ${
            navbarHoverEffects === "enabled" ? "transition-transform duration-200" : ""
          }`}>
            <Bars3Icon strokeWidth={3} className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-700 dark:text-gray-300" />
          </div>
        </IconButton>

        {/* MTK Badge */}
        {mtk && (
          <div 
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border flex-shrink-0"
            style={{
              background: mtkColorCode 
                ? `linear-gradient(to right, ${getRgbaColor(mtkColorCode, 0.15)}, ${getRgbaColor(mtkColorCode, 0.1)})`
                : "linear-gradient(to right, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.1))",
              borderColor: mtkColorCode 
                ? getRgbaColor(mtkColorCode, 0.3)
                : "rgba(59, 130, 246, 0.3)",
            }}
          >
            <BuildingOfficeIcon 
              className="h-4 w-4 flex-shrink-0"
              style={{
                color: mtkColorCode || "#3b82f6"
              }}
            />
            <Typography 
              variant="small" 
              className="text-xs font-semibold truncate max-w-[120px] xl:max-w-[160px]"
              style={{
                color: mtkColorCode || "#1e40af"
              }}
            >
              {mtk.name}
            </Typography>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <NavbarBreadcrumbs pathParts={pathParts} fixedNavbar={fixedNavbar} navbarHoverEffects={navbarHoverEffects} homePath={`/${currentLayout}/home`} parentPathMap={parentPathMap} />
        </div>
      </div>

      {/* CENTER - Weather (hidden for now) */}
      {/* <div className="hidden lg:flex items-center justify-center flex-1 mx-2 xl:mx-4 max-w-[600px]">
        <div className={`w-full ${getHoverClasses()}`}>
          <WeatherPillCenter />
        </div>
      </div> */}

      {/* RIGHT - Actions */}
      <div className="flex items-center justify-end gap-1 md:gap-1.5 lg:gap-2 flex-shrink-0">
        <div className={navbarHoverEffects === "enabled" ? "hover:scale-125 hover:rotate-6 hover:brightness-110 active:scale-100 transition-all duration-300 ease-out cursor-pointer" : "active:scale-95"}>
          <DarkModeToggle />
        </div>
        <div className={navbarHoverEffects === "enabled" ? "hover:scale-125 hover:rotate-6 hover:brightness-110 active:scale-100 transition-all duration-300 ease-out cursor-pointer" : "active:scale-95"}>
          <LanguageSelector />
        </div>
        <div className={navbarHoverEffects === "enabled" ? "hover:scale-125 hover:rotate-6 hover:brightness-110 active:scale-100 transition-all duration-300 ease-out cursor-pointer" : "active:scale-95"}>
          <NotificationsMenu />
        </div>
        <div className={navbarHoverEffects === "enabled" ? "hover:scale-125 hover:rotate-6 hover:brightness-110 active:scale-100 transition-all duration-300 ease-out cursor-pointer" : "active:scale-95"}>
          <UserMenu showButton={true} />
        </div>
      </div>
    </div>
  );
}
