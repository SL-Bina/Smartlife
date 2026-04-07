import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Option, Select, Switch, Typography } from "@material-tailwind/react";
import {
  Bars3BottomLeftIcon,
  BellIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  LanguageIcon,
  MoonIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  useMaterialTailwindController,
  setDarkMode,
  setSidenavType,
  setSidenavColor,
  setSidenavCollapsed,
  setSidenavFlatMenu,
  setSidenavExpandAll,
  setSidenavSize,
  setSidenavPosition,
  setFixedNavbar,
  setNavbarColor,
  setNavbarHeight,
  setNavbarStyle,
  setNavbarShadow,
  setNavbarBorder,
  setNavbarBlur,
  setNavbarTransparency,
  setNavbarPosition,
  setNavbarAnimations,
  setNavbarHoverEffects,
} from "@/store/exports";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import Header from "@/components/ui/Header";
import { CustomButton } from "@/components/ui/CustomButton";

function OptionGroup({ title, options, currentValue, onChange, activeStyle }) {
  return (
    <div>
      <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {title}
      </Typography>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {options.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className="px-2 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            style={currentValue === value ? activeStyle : undefined}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleRow({ icon, title, description, checked, onChange, accent }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 p-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-lg" style={{ backgroundColor: accent }}>
          {icon}
        </div>
        <div>
          <Typography className="font-semibold text-sm dark:text-gray-200">{title}</Typography>
          <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </Typography>
        </div>
      </div>
      <Switch checked={checked} onChange={(e) => onChange(e.target.checked)} color="red" />
    </div>
  );
}

function CollapsibleBlock({ title, description, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left bg-gray-50/70 dark:bg-gray-800/70 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="min-w-0">
          <Typography className="text-sm font-semibold text-gray-900 dark:text-white">{title}</Typography>
          {description && (
            <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </Typography>
          )}
        </div>
        <ChevronDownIcon
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && <div className="p-3 space-y-3 bg-white dark:bg-gray-800">{children}</div>}
    </div>
  );
}

const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialTailwindController();
  const {
    darkMode,
    sidenavCollapsed,
    sidenavFlatMenu,
    sidenavExpandAll,
    sidenavSize,
    sidenavPosition,
    fixedNavbar,
    navbarColor,
    navbarHeight,
    navbarStyle,
    navbarShadow,
    navbarBorder,
    navbarBlur,
    navbarTransparency,
    navbarPosition,
    navbarAnimations,
    navbarHoverEffects,
  } = controller;

  const { getRgba: getMtkRgba } = useMtkColor();

  const [language, setLanguage] = useState(i18n.language || "az");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setLanguage(i18n.language || "az");
  }, [i18n.language]);

  const ts = (key, fallback) => {
    const value = t(key);
    return value === key ? fallback : value;
  };

  const activeStyle = useMemo(
    () => ({
      borderColor: getMtkRgba(0.45),
      background: `linear-gradient(to right, ${getMtkRgba(0.15)}, ${getMtkRgba(0.08)})`,
      color: getMtkRgba(1),
    }),
    [getMtkRgba]
  );

  const showSuccess = (message) => {
    setErrorMessage(null);
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleLanguageChange = async (value) => {
    if (!value) return;
    setLanguage(value);
    await i18n.changeLanguage(value);
    showSuccess(ts("settings.languageChanged", "Dil dəyişdirildi"));
  };

  const handleThemeChange = (isDark) => {
    setDarkMode(dispatch, isDark);
    if (isDark) {
      setSidenavType(dispatch, "dark");
      setSidenavColor(dispatch, "dark");
    } else {
      setSidenavType(dispatch, "white");
      setSidenavColor(dispatch, "blue-gray");
    }
    showSuccess(ts("settings.themeChanged", "Tema dəyişdirildi"));
  };

  const handleFlatMenuChange = (checked) => {
    setSidenavFlatMenu(dispatch, checked);
    if (checked && sidenavExpandAll) setSidenavExpandAll(dispatch, false);
  };

  const handleExpandAllChange = (checked) => {
    setSidenavExpandAll(dispatch, checked);
    if (checked && sidenavFlatMenu) setSidenavFlatMenu(dispatch, false);
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      showSuccess(ts("settings.notificationsSaved", "Bildiriş ayarları saxlanıldı"));
    } catch (error) {
      setErrorMessage(ts("settings.notificationsSaveError", "Bildiriş ayarları saxlanarkən xəta baş verdi"));
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleResetInterface = () => {
    setSidenavCollapsed(dispatch, false);
    setSidenavFlatMenu(dispatch, false);
    setSidenavExpandAll(dispatch, false);
    setSidenavSize(dispatch, "medium");
    setSidenavPosition(dispatch, "left");
    setFixedNavbar(dispatch, true);
    setNavbarColor(dispatch, "default");
    setNavbarHeight(dispatch, "normal");
    setNavbarStyle(dispatch, "modern");
    setNavbarShadow(dispatch, "large");
    setNavbarBorder(dispatch, "enabled");
    setNavbarBlur(dispatch, "enabled");
    setNavbarTransparency(dispatch, "95");
    setNavbarPosition(dispatch, "top");
    setNavbarAnimations(dispatch, "enabled");
    setNavbarHoverEffects(dispatch, "disabled");
    showSuccess("Interface default vəziyyətə qaytarıldı");
  };

  const sectionTitleClass = "text-base sm:text-lg font-bold text-gray-900 dark:text-white";
  const sectionDescClass = "text-xs sm:text-sm text-gray-500 dark:text-gray-400";

  return (
    <div className="mt-3 mb-6 space-y-3">
      <Header
        icon={Cog6ToothIcon}
        title={ts("settings.title", "Sistem Tənzimləmələri")}
        subtitle={ts("settings.subtitle", "Bütün ümumi, görünüş və bildiriş parametrlərini bir səhifədən idarə et")}
      />

      {successMessage && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <Typography variant="small" className="text-green-700 dark:text-green-400">
            {successMessage}
          </Typography>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <Typography variant="small" className="text-red-700 dark:text-red-400">
            {errorMessage}
          </Typography>
        </div>
      )}

      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm dark:bg-gray-900">
        <CardBody className="p-4 sm:p-5 space-y-4 dark:bg-gray-900">
          <div className="space-y-3">
            <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
              <Typography className={sectionTitleClass}>{ts("settings.general", "Ümumi")}</Typography>
              <Typography className={sectionDescClass}>Dil və tema parametrləri</Typography>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Card className="border border-gray-200 dark:border-gray-700 shadow-none dark:bg-gray-800">
                <CardBody className="p-3 dark:bg-gray-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: getMtkRgba(0.1) }}>
                        <LanguageIcon className="h-5 w-5" style={{ color: getMtkRgba(1) }} />
                      </div>
                      <div>
                        <Typography variant="h6" className="text-sm sm:text-base dark:text-gray-200">
                          {ts("settings.language", "Dil")}
                        </Typography>
                        <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
                          {ts("settings.languageDescription", "Platforma dili")}
                        </Typography>
                      </div>
                    </div>

                    <Select value={language} onChange={handleLanguageChange} className="w-40" labelProps={{ className: "hidden" }}>
                      <Option value="az">Azərbaycan</Option>
                      <Option value="en">English</Option>
                      <Option value="ru">Русский</Option>
                    </Select>
                  </div>
                </CardBody>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-700 shadow-none dark:bg-gray-800">
                <CardBody className="p-3 dark:bg-gray-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: getMtkRgba(0.1) }}>
                        {darkMode ? (
                          <MoonIcon className="h-5 w-5" style={{ color: getMtkRgba(1) }} />
                        ) : (
                          <SunIcon className="h-5 w-5" style={{ color: getMtkRgba(1) }} />
                        )}
                      </div>
                      <div>
                        <Typography variant="h6" className="text-sm sm:text-base dark:text-gray-200">
                          {ts("settings.theme", "Tema")}
                        </Typography>
                        <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
                          {darkMode ? ts("settings.dark", "Qaranlıq") : ts("settings.light", "İşıqlı")}
                        </Typography>
                      </div>
                    </div>

                    <Switch checked={darkMode} onChange={(e) => handleThemeChange(e.target.checked)} color="red" />
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          <div className="space-y-3">
            <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
              <Typography className={sectionTitleClass}>Interface</Typography>
              <Typography className={sectionDescClass}>Sidebar və navbar tənzimləmələri</Typography>
            </div>

            <div className="space-y-3">
              <CollapsibleBlock
                title="Sidebar davranışı"
                description="Sidebar görünüşü və açılma davranışı"
                defaultOpen={true}
              >
                <ToggleRow
                  icon={<Bars3BottomLeftIcon className="h-4 w-4" style={{ color: getMtkRgba(1) }} />}
                  title="Collapsed"
                  description="Sidebar dar rejimə keçsin"
                  checked={sidenavCollapsed}
                  onChange={(value) => setSidenavCollapsed(dispatch, value)}
                  accent={getMtkRgba(0.1)}
                />

                <ToggleRow
                  icon={<Bars3BottomLeftIcon className="h-4 w-4" style={{ color: getMtkRgba(1) }} />}
                  title="Flat menu"
                  description="Sadə menyu görünüşü"
                  checked={sidenavFlatMenu}
                  onChange={handleFlatMenuChange}
                  accent={getMtkRgba(0.1)}
                />

                <ToggleRow
                  icon={<Bars3BottomLeftIcon className="h-4 w-4" style={{ color: getMtkRgba(1) }} />}
                  title="Expand all"
                  description="Bütün alt-menyular açıq qalsın"
                  checked={sidenavExpandAll}
                  onChange={handleExpandAllChange}
                  accent={getMtkRgba(0.1)}
                />

                <OptionGroup
                  title="Sidebar ölçüsü"
                  options={["small", "medium", "large"]}
                  currentValue={sidenavSize}
                  onChange={(value) => setSidenavSize(dispatch, value)}
                  activeStyle={activeStyle}
                />

                <OptionGroup
                  title="Sidebar mövqeyi"
                  options={["left", "right"]}
                  currentValue={sidenavPosition}
                  onChange={(value) => setSidenavPosition(dispatch, value)}
                  activeStyle={activeStyle}
                />
              </CollapsibleBlock>

              <CollapsibleBlock
                title="Navbar davranışı"
                description="Navbar üçün bütün parametrlər"
                defaultOpen={true}
              >
                <ToggleRow
                  icon={<SunIcon className="h-4 w-4" style={{ color: getMtkRgba(1) }} />}
                  title="Fixed navbar"
                  description="Yuxarı hissədə sabit qalsın"
                  checked={fixedNavbar}
                  onChange={(value) => setFixedNavbar(dispatch, value)}
                  accent={getMtkRgba(0.1)}
                />

                <OptionGroup
                  title="Navbar color"
                  options={["default", "red", "blue", "green", "purple"]}
                  currentValue={navbarColor}
                  onChange={(value) => setNavbarColor(dispatch, value)}
                  activeStyle={activeStyle}
                />

                <OptionGroup
                  title="Navbar height"
                  options={["compact", "normal", "large"]}
                  currentValue={navbarHeight}
                  onChange={(value) => setNavbarHeight(dispatch, value)}
                  activeStyle={activeStyle}
                />

                <OptionGroup
                  title="Navbar style"
                  options={["minimalist", "modern", "classic"]}
                  currentValue={navbarStyle}
                  onChange={(value) => setNavbarStyle(dispatch, value)}
                  activeStyle={activeStyle}
                />

                <OptionGroup
                  title="Navbar shadow"
                  options={["none", "small", "medium", "large"]}
                  currentValue={navbarShadow}
                  onChange={(value) => setNavbarShadow(dispatch, value)}
                  activeStyle={activeStyle}
                />

                <OptionGroup
                  title="Navbar border"
                  options={["enabled", "disabled"]}
                  currentValue={navbarBorder}
                  onChange={(value) => setNavbarBorder(dispatch, value)}
                  activeStyle={activeStyle}
                />

                <OptionGroup
                  title="Navbar blur"
                  options={["enabled", "disabled"]}
                  currentValue={navbarBlur}
                  onChange={(value) => setNavbarBlur(dispatch, value)}
                  activeStyle={activeStyle}
                />

                <OptionGroup
                  title="Navbar transparency"
                  options={["50", "70", "85", "95", "100"]}
                  currentValue={navbarTransparency}
                  onChange={(value) => setNavbarTransparency(dispatch, value)}
                  activeStyle={activeStyle}
                />

                <OptionGroup
                  title="Navbar position"
                  options={["top", "bottom"]}
                  currentValue={navbarPosition}
                  onChange={(value) => setNavbarPosition(dispatch, value)}
                  activeStyle={activeStyle}
                />

                <OptionGroup
                  title="Navbar animations"
                  options={["enabled", "disabled"]}
                  currentValue={navbarAnimations}
                  onChange={(value) => setNavbarAnimations(dispatch, value)}
                  activeStyle={activeStyle}
                />

                <OptionGroup
                  title="Navbar hover effects"
                  options={["enabled", "disabled"]}
                  currentValue={navbarHoverEffects}
                  onChange={(value) => setNavbarHoverEffects(dispatch, value)}
                  activeStyle={activeStyle}
                />

                <div className="flex justify-end pt-1">
                  <CustomButton variant="outlined" color="gray" onClick={handleResetInterface}>
                    Interface Reset
                  </CustomButton>
                </div>
              </CollapsibleBlock>
            </div>
          </div>

          <div className="space-y-3">
            <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
              <Typography className={sectionTitleClass}>{ts("settings.notifications", "Bildirişlər")}</Typography>
              <Typography className={sectionDescClass}>Email, push və SMS xəbərdarlıqları</Typography>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <Card className="border border-gray-200 dark:border-gray-700 shadow-none dark:bg-gray-800">
                <CardBody className="p-3 dark:bg-gray-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: getMtkRgba(0.1) }}>
                        <EnvelopeIcon className="h-5 w-5" style={{ color: getMtkRgba(1) }} />
                      </div>
                      <Typography className="font-semibold text-sm dark:text-gray-200">
                        {ts("settings.emailNotifications", "Email")}
                      </Typography>
                    </div>
                    <Switch checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} color="red" />
                  </div>
                </CardBody>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-700 shadow-none dark:bg-gray-800">
                <CardBody className="p-3 dark:bg-gray-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: getMtkRgba(0.1) }}>
                        <BellIcon className="h-5 w-5" style={{ color: getMtkRgba(1) }} />
                      </div>
                      <Typography className="font-semibold text-sm dark:text-gray-200">
                        {ts("settings.pushNotifications", "Push")}
                      </Typography>
                    </div>
                    <Switch checked={pushNotifications} onChange={(e) => setPushNotifications(e.target.checked)} color="red" />
                  </div>
                </CardBody>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-700 shadow-none dark:bg-gray-800">
                <CardBody className="p-3 dark:bg-gray-800">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: getMtkRgba(0.1) }}>
                        <PhoneIcon className="h-5 w-5" style={{ color: getMtkRgba(1) }} />
                      </div>
                      <Typography className="font-semibold text-sm dark:text-gray-200">
                        {ts("settings.smsNotifications", "SMS")}
                      </Typography>
                    </div>
                    <Switch checked={smsNotifications} onChange={(e) => setSmsNotifications(e.target.checked)} color="red" />
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="flex justify-end mt-2">
              <CustomButton onClick={handleSaveNotifications} loading={loading} color="red">
                {loading ? ts("settings.saving", "Saxlanılır...") : ts("settings.save", "Saxla")}
              </CustomButton>
            </div>
          </div>

          <div className="space-y-3">
            <div className="border-b border-gray-200 dark:border-gray-800 pb-2">
              <Typography className={sectionTitleClass}>{ts("settings.security", "Təhlükəsizlik")}</Typography>
              <Typography className={sectionDescClass}>Profil və şifrə parametrləri</Typography>
            </div>

            <Card className="border border-gray-200 dark:border-gray-700 shadow-none dark:bg-gray-800">
              <CardBody className="p-3 sm:p-4 dark:bg-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: getMtkRgba(0.1) }}>
                      <ShieldCheckIcon className="h-5 w-5" style={{ color: getMtkRgba(1) }} />
                    </div>
                    <div>
                      <Typography variant="h6" className="text-sm sm:text-base dark:text-gray-200">
                        {ts("settings.securitySettings", "Təhlükəsizlik Parametrləri")}
                      </Typography>
                      <Typography variant="small" className="text-xs text-gray-500 dark:text-gray-400">
                        {ts("settings.securityDescription", "Şifrə və şəxsi məlumatları profil bölməsində dəyişdirə bilərsən")}
                      </Typography>
                    </div>
                  </div>

                  <CustomButton
                    variant="outlined"
                    color="red"
                    onClick={() => navigate("/dashboard/profile")}
                    className="whitespace-nowrap"
                  >
                    {ts("settings.goToProfile", "Profili Aç")}
                  </CustomButton>
                </div>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Settings;

