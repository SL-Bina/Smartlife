import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import {
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import ReactCountryFlag from "react-country-flag";
import {
  useAuth,
  useMaterialTailwindController,
  setDarkMode,
} from "@/store/exports";
import { useTranslation } from "react-i18next";
import { useMtkColor } from "@/store/hooks/useMtkColor";
import { languages } from "../utils/languages";

export function UserMenu({ isMobile = false, showButton = false }) {
  const { user, logout, isInitialized } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { getActiveGradient, getRgba } = useMtkColor();
  const [controller, dispatch] = useMaterialTailwindController();
  const { darkMode } = controller;

  const [imageError, setImageError] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [user?.fullName, user?.name, user?.surname]);

  const fullName = useMemo(() => {
    const fromFullName = user?.fullName?.trim();
    if (fromFullName) return fromFullName;

    const fromParts = [user?.name, user?.surname].filter(Boolean).join(" ").trim();
    if (fromParts) return fromParts;

    return "User";
  }, [user?.fullName, user?.name, user?.surname]);

  const isResident = user?.is_resident === true;
  const profilePath = isResident ? "/resident/profile" : "/dashboard/profile";
  const settingsPath = "/dashboard/settings";

  if (!isInitialized) {
    return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600" />;
  }

  if (!user) {
    return (
      <Link to="/auth/sign-in">
        {showButton ? (
          <Button
            variant="text"
            color="blue-gray"
            className="hidden items-center gap-2 px-3 lg:px-4 xl:flex normal-case dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-xl transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center">
              <UserCircleIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </div>
            <span className="text-sm lg:text-base font-semibold">{t("common.login")}</span>
          </Button>
        ) : (
          <IconButton
            variant="text"
            color="blue-gray"
            className="dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-xl transition-all p-1"
            size="sm"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-200/50 dark:bg-gray-700/50 flex items-center justify-center">
              <UserCircleIcon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </div>
          </IconButton>
        )}
      </Link>
    );
  }

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const openAiAssistant = () => {
    window.dispatchEvent(new CustomEvent("smartlife:open-ai-chat"));
    setOpenMenu(false);
  };

  const goTo = (path) => {
    navigate(path);
    setOpenMenu(false);
  };

  const handleLogout = () => {
    setOpenMenu(false);
    logout();
  };

  const trigger = showButton ? (
    <Button
      type="button"
      variant="text"
      color="blue-gray"
      className="hidden items-center gap-3 px-3 lg:px-4 xl:flex normal-case dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-xl transition-all"
    >
      <div className="relative">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
          style={{ background: getActiveGradient(0.9, 0.7) }}
        >
          {!imageError ? (
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff&size=128`}
              alt={fullName}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-white font-bold text-sm">{getInitials(fullName)}</span>
          )}
        </div>
      </div>
      <span className="text-sm lg:text-base font-bold text-gray-900 dark:text-white">{fullName}</span>
    </Button>
  ) : (
    <IconButton
      type="button"
      variant="text"
      color="blue-gray"
      className={isMobile
        ? "dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all p-0"
        : "dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-xl transition-all p-1"}
      size="sm"
    >
      <div className="relative">
        <div
          className={`${isMobile ? "w-10 h-10" : "w-8 h-8"} rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 overflow-hidden`}
          style={{ background: getActiveGradient(0.9, 0.7) }}
        >
          {!imageError ? (
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff&size=128`}
              alt={fullName}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className={`text-white font-bold ${isMobile ? "text-sm" : "text-xs"}`}>
              {getInitials(fullName)}
            </span>
          )}
        </div>
      </div>
    </IconButton>
  );

  return (
    <Menu
      open={openMenu}
      handler={setOpenMenu}
      placement="bottom-end"
      offset={10}
      dismiss={{ itemPress: false }}
    >
      <MenuHandler>{trigger}</MenuHandler>

      <MenuList className="w-[320px] max-w-[92vw] p-0 dark:bg-gray-900 dark:border-gray-800 shadow-xl">
        <div className="rounded-xl overflow-hidden">
          <div
            className="px-4 py-4 text-white"
            style={{ background: getActiveGradient(0.95, 0.75) }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/40 bg-white/20 flex items-center justify-center">
                  {!imageError ? (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff&size=128`}
                      alt={fullName}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span className="text-white font-bold">{getInitials(fullName)}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <Typography className="text-white font-bold text-sm truncate">{fullName}</Typography>
                  {user.email && (
                    <Typography className="text-white/80 text-xs truncate mt-0.5">{user.email}</Typography>
                  )}
                </div>
              </div>
              <IconButton
                variant="text"
                color="white"
                className="rounded-lg hover:bg-white/20"
                onClick={() => setOpenMenu(false)}
              >
                <XMarkIcon className="h-5 w-5" />
              </IconButton>
            </div>
          </div>

          <div className="p-4 space-y-4 bg-white dark:bg-gray-900">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => goTo(profilePath)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <UserCircleIcon className="h-4 w-4" />
                {t("header.profile")}
              </button>
              {!isResident && (
                <button
                  type="button"
                  onClick={() => goTo(settingsPath)}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Cog6ToothIcon className="h-4 w-4" />
                  {t("header.settings")}
                </button>
              )}
            </div>

            <div>
              <Typography className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                Theme
              </Typography>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDarkMode(dispatch, false)}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border"
                  style={!darkMode ? {
                    borderColor: getRgba(0.45),
                    background: `linear-gradient(to right, ${getRgba(0.15)}, ${getRgba(0.08)})`,
                  } : undefined}
                >
                  <SunIcon className="h-4 w-4 text-amber-500" />
                  {t("header.lightMode")}
                </button>
                <button
                  type="button"
                  onClick={() => setDarkMode(dispatch, true)}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border"
                  style={darkMode ? {
                    borderColor: getRgba(0.45),
                    background: `linear-gradient(to right, ${getRgba(0.15)}, ${getRgba(0.08)})`,
                  } : undefined}
                >
                  <MoonIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  {t("header.darkMode")}
                </button>
              </div>
            </div>

            <div>
              <Typography className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                Language
              </Typography>
              <div className="space-y-2">
                {languages.map((lng) => {
                  const active = i18n.language === lng.code;
                  return (
                    <button
                      key={lng.code}
                      type="button"
                      onClick={() => i18n.changeLanguage(lng.code)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold text-gray-700 dark:text-gray-200"
                      style={active ? {
                        borderColor: getRgba(0.45),
                        background: `linear-gradient(to right, ${getRgba(0.15)}, ${getRgba(0.08)})`,
                      } : undefined}
                    >
                      <ReactCountryFlag
                        countryCode={lng.countryCode}
                        svg
                        style={{ width: "1.2em", height: "1.2em", borderRadius: "3px" }}
                      />
                      <span>{lng.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Typography className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                Tools
              </Typography>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={openAiAssistant}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  AI Chat
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              {t("common.logout")}
            </button>
          </div>
        </div>
      </MenuList>
    </Menu>
  );
}
