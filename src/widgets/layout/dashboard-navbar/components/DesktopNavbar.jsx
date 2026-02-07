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
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { NavbarBreadcrumbs } from "./NavbarBreadcrumbs";
import { DarkModeToggle } from "./DarkModeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { NotificationsMenu } from "./NotificationsMenu";
import { UserMenu } from "./UserMenu";

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
    const url =
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${encodeURIComponent(lat)}` +
      `&longitude=${encodeURIComponent(lon)}&language=en`;

    const res = await fetch(url);
    if (!res.ok) return "Nearby";
    const data = await res.json();

    const best = data?.results?.[0];
    const name = best?.name;
    const admin = best?.admin1 || best?.admin2;
    const country = best?.country;

    // Short pretty label
    return [name, admin, country].filter(Boolean).join(", ") || "Nearby";
  }, []);

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

            const [w, place] = await Promise.all([
              fetchWeather(lat, lon),
              fetchPlace(lat, lon).catch(() => "Nearby"),
            ]);

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
    <div className="hidden md:flex items-center justify-center w-full">
      {/* Center pill: longer */}
      <div
        className={`
          relative
          w-[520px] lg:w-[620px] xl:w-[720px]
          px-5 py-3
          rounded-[22px]
          border border-white/10 dark:border-white/10
          shadow-[0_18px_55px_rgba(0,0,0,.22)]
          overflow-hidden
          ${ui.pill}
          text-white
        `}
        title="Weather (current location)"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/10 border border-white/10 p-2.5">
            {state.error ? (
              <ExclamationTriangleIcon className="h-6 w-6 text-white/90" />
            ) : (
              <WIcon className="h-6 w-6 text-white/90" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-white/80">
              <MapPinIcon className="h-4 w-4 text-white/70" />
              <span className="text-[12px] font-medium truncate">
                {state.loading ? "Finding location…" : state.place}
              </span>
            </div>

            <div className="flex items-end justify-between gap-3">
              {state.loading ? (
                <Typography className="text-base font-semibold text-white/90">
                  Loading…
                </Typography>
              ) : state.error ? (
                <Typography className="text-base font-semibold text-white/90">
                  {state.error}
                </Typography>
              ) : (
                <>
                  <div className="flex items-end gap-3">
                    <Typography className="text-2xl font-bold leading-none text-white">
                      {state.temp ?? "—"}°C
                    </Typography>
                    <Typography className="text-[13px] font-semibold text-white/80">
                      {ui.label}
                    </Typography>
                  </div>

                  {/* subtle hint (optional) */}
                  <Typography className="text-[11px] text-white/65">
                    Current weather
                  </Typography>
                </>
              )}
            </div>
          </div>
        </div>

        {/* gloss */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_220px_at_25%_10%,rgba(255,255,255,.22),transparent_55%)]" />
        <div className="pointer-events-none absolute -bottom-10 left-1/2 h-24 w-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>
    </div>
  );
}

/* ------------------------------ Desktop Navbar ------------------------------ */
export function DesktopNavbar({ pathParts, pageTitle, fixedNavbar }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav } = controller;

  return (
    <div className="hidden md:flex items-center justify-between gap-2 lg:gap-4 w-full">
      {/* LEFT */}
      <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
        <IconButton
          variant="text"
          color="blue-gray"
          className="grid xl:hidden dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 flex-shrink-0 rounded-xl transition-all"
          onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          size="sm"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center">
            <Bars3Icon strokeWidth={3} className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          </div>
        </IconButton>

        <div className="min-w-0 flex-1">
          <NavbarBreadcrumbs pathParts={pathParts} fixedNavbar={fixedNavbar} />
          {/* İstəsən title-ni geri qaytar:
          <Typography variant="h6" className="text-gray-900 dark:text-white text-sm lg:text-base xl:text-lg font-bold truncate">
            {pageTitle}
          </Typography>
          */}
        </div>
      </div>

      {/* <div className="flex items-center justify-center w-[70%] mx-4">
        <WeatherPillCenter />
      </div> */}

      <div className="flex items-center justify-end gap-1.5 lg:gap-2 flex-shrink-0">
        <DarkModeToggle />
        <LanguageSelector />
        <NotificationsMenu />
        <UserMenu showButton={true} />
      </div>
    </div>
  );
}
