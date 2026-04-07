import {
  Input,
  Button,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth, useMaterialTailwindController, setDarkMode } from "@/store/exports";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { getFirstActivePath } from "@/utils/getFirstActivePath";
import { filterRoutesByRole } from "@/layouts/dashboard";
import routes from "@/routes";
import { motion } from "framer-motion";

import ReactCountryFlag from "react-country-flag";

const languages = [
  {
    code: "az",
    label: "Azərbaycan dili",
    flag: <ReactCountryFlag countryCode="AZ" svg style={{ width: "1.5em", height: "1.5em" }} />
  },
  {
    code: "en",
    label: "English",
    flag: <ReactCountryFlag countryCode="GB" svg style={{ width: "1.5em", height: "1.5em" }} />
  },
  {
    code: "ru",
    label: "Русский",
    flag: <ReactCountryFlag countryCode="RU" svg style={{ width: "1.5em", height: "1.5em" }} />
  },
];

const easeOutExpo = [0.16, 1, 0.3, 1];

function MockQrCode() {
  return (
    // <div className="rounded-2xl bg-white p-3 border border-white/30 dark:border-white/10 shadow-2xl">
    //   <svg viewBox="0 0 220 220" className="h-52 w-52 rounded-xl bg-white">
    //     <rect x="0" y="0" width="220" height="220" fill="#ffffff" />

    //     <rect x="12" y="12" width="56" height="56" fill="#111827" />
    //     <rect x="20" y="20" width="40" height="40" fill="#ffffff" />
    //     <rect x="28" y="28" width="24" height="24" fill="#111827" />

    //     <rect x="152" y="12" width="56" height="56" fill="#111827" />
    //     <rect x="160" y="20" width="40" height="40" fill="#ffffff" />
    //     <rect x="168" y="28" width="24" height="24" fill="#111827" />

    //     <rect x="12" y="152" width="56" height="56" fill="#111827" />
    //     <rect x="20" y="160" width="40" height="40" fill="#ffffff" />
    //     <rect x="28" y="168" width="24" height="24" fill="#111827" />

    //     <rect x="86" y="22" width="8" height="8" fill="#111827" />
    //     <rect x="102" y="22" width="8" height="8" fill="#111827" />
    //     <rect x="118" y="22" width="8" height="8" fill="#111827" />
    //     <rect x="86" y="38" width="8" height="8" fill="#111827" />
    //     <rect x="118" y="38" width="8" height="8" fill="#111827" />
    //     <rect x="86" y="54" width="8" height="8" fill="#111827" />
    //     <rect x="102" y="54" width="8" height="8" fill="#111827" />
    //     <rect x="118" y="54" width="8" height="8" fill="#111827" />

    //     <rect x="86" y="86" width="8" height="8" fill="#111827" />
    //     <rect x="102" y="86" width="8" height="8" fill="#111827" />
    //     <rect x="118" y="86" width="8" height="8" fill="#111827" />
    //     <rect x="134" y="86" width="8" height="8" fill="#111827" />
    //     <rect x="150" y="86" width="8" height="8" fill="#111827" />
    //     <rect x="166" y="86" width="8" height="8" fill="#111827" />

    //     <rect x="86" y="102" width="8" height="8" fill="#111827" />
    //     <rect x="118" y="102" width="8" height="8" fill="#111827" />
    //     <rect x="134" y="102" width="8" height="8" fill="#111827" />
    //     <rect x="166" y="102" width="8" height="8" fill="#111827" />

    //     <rect x="86" y="118" width="8" height="8" fill="#111827" />
    //     <rect x="102" y="118" width="8" height="8" fill="#111827" />
    //     <rect x="118" y="118" width="8" height="8" fill="#111827" />
    //     <rect x="150" y="118" width="8" height="8" fill="#111827" />
    //     <rect x="166" y="118" width="8" height="8" fill="#111827" />

    //     <rect x="86" y="134" width="8" height="8" fill="#111827" />
    //     <rect x="118" y="134" width="8" height="8" fill="#111827" />
    //     <rect x="134" y="134" width="8" height="8" fill="#111827" />
    //     <rect x="150" y="134" width="8" height="8" fill="#111827" />
    //     <rect x="166" y="134" width="8" height="8" fill="#111827" />

    //     <rect x="86" y="150" width="8" height="8" fill="#111827" />
    //     <rect x="102" y="150" width="8" height="8" fill="#111827" />
    //     <rect x="134" y="150" width="8" height="8" fill="#111827" />
    //     <rect x="166" y="150" width="8" height="8" fill="#111827" />

    //     <rect x="86" y="166" width="8" height="8" fill="#111827" />
    //     <rect x="102" y="166" width="8" height="8" fill="#111827" />
    //     <rect x="118" y="166" width="8" height="8" fill="#111827" />
    //     <rect x="134" y="166" width="8" height="8" fill="#111827" />
    //     <rect x="150" y="166" width="8" height="8" fill="#111827" />
    //     <rect x="166" y="166" width="8" height="8" fill="#111827" />

    //     <rect x="86" y="182" width="8" height="8" fill="#111827" />
    //     <rect x="118" y="182" width="8" height="8" fill="#111827" />
    //     <rect x="134" y="182" width="8" height="8" fill="#111827" />
    //     <rect x="166" y="182" width="8" height="8" fill="#111827" />
    //   </svg>
    // </div>
    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QR Code" className="h-52 w-52 rounded-xl bg-white shadow-2xl border border-white/30 dark:border-white/10" />
  );
}

export function SignIn() {
  const { login, loading, user, isAuthenticated, isInitialized } = useAuth();
  const [controller, dispatch] = useMaterialTailwindController();
  const { darkMode } = controller;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const appStoreBadge = darkMode ? "/store/app-dark.png" : "/store/app-light.png";
  const playStoreBadge = darkMode ? "/store/play-dark.png" : "/store/play-light.png";
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (isInitialized && isAuthenticated && user && window.location.pathname === '/auth/sign-in') {
      const filtered = filterRoutesByRole(routes, user);
      navigate(getFirstActivePath(filtered), { replace: true });
    }
  }, [isInitialized, isAuthenticated, user, navigate]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError(t("auth.signIn.identifierRequired") || "Email, Username, Phone və ya Name daxil edin");
      return;
    }

    if (!password.trim()) {
      setError(t("auth.signIn.passwordRequired") || "Şifrə daxil edin");
      return;
    }

    const result = await login(identifier.trim(), password);
    if (!result.success) {
      setError(result.message || t("auth.signIn.invalidCredentialsError"));
      return;
    }

    const filtered = filterRoutesByRole(routes, result.user);
    navigate(getFirstActivePath(filtered), { replace: true });
  };

  if (!isInitialized) {
    return (
      <section className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t("auth.signIn.loading") || "Yüklənir..."}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-100 dark:bg-[#020617]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-rose-300/30 blur-3xl dark:bg-fuchsia-900/25" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-pink-300/25 blur-3xl dark:bg-indigo-900/25" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className={`w-full overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-sm ${
            darkMode ? "border-slate-800/80 bg-slate-900/95" : "border-slate-200/80 bg-white/95"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12, ease: easeOutExpo }}
            className={`flex w-full items-center justify-between border-b px-3 py-3 sm:px-5 sm:py-4 lg:px-8 ${
              darkMode ? "border-slate-800" : "border-slate-200/80"
            }`}
          >
            <Link to="/" className="inline-flex items-center">
              <img
                src={darkMode ? "/Vector_Logo/white_logo.svg" : "/Vector_Logo/color_logo.svg"}
                alt="SmartLife Logo"
                className="h-9 w-auto max-w-[150px] object-contain sm:h-11 sm:max-w-[180px] lg:h-12 lg:max-w-[200px]"
              />
            </Link>

            <div className="flex items-center gap-2">
              <IconButton
                variant="text"
                size="sm"
                onClick={() => setDarkMode(dispatch, !darkMode)}
                className="rounded-lg border border-gray-200 bg-gray-50 text-blue-gray-700 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-gray-100 dark:hover:bg-slate-700"
              >
                {darkMode ? <SunIcon className="h-5 w-5 text-amber-400" /> : <MoonIcon className="h-5 w-5" />}
              </IconButton>

              <Menu placement="bottom-end">
                <MenuHandler>
                  <Button variant="text" className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-blue-gray-700 normal-case dark:border-slate-700 dark:bg-slate-800">
                    {languages.map((lng) =>
                      lng.code === i18n.language ? (
                        <span key={lng.code} className="flex items-center gap-2">
                          <span>{lng.flag}</span>
                          <span className="hidden text-xs font-medium sm:inline-block">{lng.label}</span>
                        </span>
                      ) : null
                    )}
                  </Button>
                </MenuHandler>
                <MenuList className="min-w-[180px] dark:border-slate-700 dark:bg-slate-800">
                  {languages.map((lng) => (
                    <MenuItem key={lng.code} onClick={() => changeLanguage(lng.code)} className="flex items-center gap-2 dark:hover:bg-slate-700/70">
                      <span>{lng.flag}</span>
                      <span>{lng.label}</span>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: easeOutExpo }}
              className="lg:col-span-7 px-4 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10"
            >
              <div className="mx-auto w-full max-w-md">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.26, ease: easeOutExpo }}
                  className="mb-6 sm:mb-7 text-center sm:text-left"
                >
                  <Typography variant="h3" className="mb-2 text-2xl sm:text-3xl font-bold text-blue-gray-900 dark:text-gray-100">
                    {t("auth.signIn.title")}
                  </Typography>
                  <Typography className="text-sm sm:text-base font-normal text-blue-gray-600 dark:text-gray-300">
                    {t("auth.signIn.subtitle") || "Hesabınıza daxil olaraq davam edin"}
                  </Typography>
                </motion.div>

                <motion.form
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.32, ease: easeOutExpo }}
                  className="space-y-4 sm:space-y-5"
                  onSubmit={handleSubmit}
                >
                  <div className="space-y-2">
                    <Typography variant="small" color="blue-gray" className="font-medium text-blue-gray-800 dark:text-gray-200">
                      {t("auth.signIn.identifierLabel") || "Email, Username, Phone və ya Name"}
                    </Typography>
                    <Input
                      type="text"
                      size="lg"
                      placeholder={t("auth.signIn.identifierPlaceholder") || "Email, Username, Phone və ya Name daxil edin"}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="!border-gray-300 !bg-white !text-blue-gray-900 placeholder:!text-blue-gray-500 dark:!border-slate-700 dark:!bg-slate-800 dark:!text-gray-100 dark:placeholder:!text-slate-400"
                      labelProps={{ className: "before:content-none after:content-none" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Typography variant="small" color="blue-gray" className="font-medium text-blue-gray-800 dark:text-gray-200">
                      {t("auth.signIn.passwordLabel")}
                    </Typography>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        size="lg"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="!border-gray-300 !bg-white !text-blue-gray-900 placeholder:!text-blue-gray-500 pr-11 dark:!border-slate-700 dark:!bg-slate-800 dark:!text-gray-100 dark:placeholder:!text-slate-400"
                        labelProps={{ className: "before:content-none after:content-none" }}
                      />
                      <IconButton
                        variant="text"
                        size="sm"
                        className="!absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5 text-blue-gray-500 dark:text-slate-400" />
                        ) : (
                          <EyeIcon className="h-5 w-5 text-blue-gray-500 dark:text-slate-400" />
                        )}
                      </IconButton>
                    </div>
                  </div>

                  {error && (
                    <Typography variant="small" color="red" className="font-medium text-center sm:text-left">
                      {error}
                    </Typography>
                  )}

                  <Button type="submit" fullWidth disabled={loading} className="mt-1 rounded-lg bg-red-600 hover:bg-red-700">
                    {loading ? t("auth.signIn.loading") || "Yüklənir..." : t("auth.signIn.submit")}
                  </Button>
                </motion.form>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.4, ease: easeOutExpo }}
                  className="mt-6 rounded-xl border border-rose-200/60 bg-rose-50/70 p-3 text-xs text-rose-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 lg:hidden"
                >
                  <p className="font-semibold">QR ilə giriş mobil tətbiqdə daha rahatdır</p>
                  <p className="mt-1">SmartLife app-i açıb QR scan bölməsindən daxil ola bilərsən.</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.46, ease: easeOutExpo }}
                  className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start"
                >
                  <img src={appStoreBadge} alt="Download on the App Store" className="h-12 w-auto max-w-[180px] rounded-md object-contain" />
                  <img src={playStoreBadge} alt="Get it on Google Play" className="h-12 w-auto max-w-[180px] rounded-md object-contain" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: easeOutExpo }}
              className="relative hidden lg:flex lg:col-span-5 items-center justify-center bg-gradient-to-br from-rose-500 to-pink-500 p-8 text-white dark:from-slate-900 dark:via-fuchsia-950 dark:to-slate-950 xl:p-10"
            >
              <div className="absolute inset-0 " />

              <div className="relative flex w-full max-w-sm flex-col items-center justify-center text-center">
                <Typography variant="h2" className="mb-4 text-3xl xl:text-4xl font-extrabold text-black !opacity-100 dark:text-white">
                  QR ilə giriş
                </Typography>
                <Typography className="mb-6 text-sm xl:text-base font-medium text-black !opacity-100 dark:!text-slate-100 dark:text-white">
                  Mobil tətbiq ilə QR kodu skan et və saniyələr içində hesabına daxil ol.
                </Typography>

                <div className="mb-6 flex justify-center">
                  <MockQrCode />
                </div>

                <div className="space-y-2 text-center text-xs xl:text-sm font-medium text-black/80 dark:text-slate-200 dark:text-white">
                  <p>1. SmartLife mobil tətbiqini aç</p>
                  <p>2. QR scan bölməsində kodu oxut</p>
                  <p>3. Təsdiqlə və avtomatik daxil ol</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="border-t border-slate-200/80 px-4 py-3 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-6">
            © {currentYear} SmartLife. Bütün hüquqlar qorunur.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default SignIn;
