import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button, IconButton, Menu, MenuHandler, MenuList, MenuItem, Avatar, Typography } from "@material-tailwind/react";
import { UserCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";

export function UserMenu({ isMobile = false, showButton = false }) {
  const { user, logout, isInitialized } = useAuth();
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [user?.fullName]);

  if (!isInitialized) {
    return (
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
    );
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

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const buttonClass = isMobile
    ? "dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all p-0 overflow-visible"
    : "dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-xl transition-all p-1";

  return (
    <>
      {showButton ? (
        <Menu placement="bottom-end">
          <MenuHandler>
            <Button
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-3 px-3 lg:px-4 xl:flex normal-case dark:text-gray-300 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 rounded-xl transition-all"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                  {!imageError ? (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=random&color=fff&size=128`}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {getInitials(user.fullName)}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-sm lg:text-base font-bold text-gray-900 dark:text-white">{user.fullName}</span>
            </Button>
          </MenuHandler>
          <MenuList className="dark:bg-gray-800 dark:border-gray-700 min-w-[200px] rounded-xl shadow-xl">
            <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
              <Typography variant="small" className="font-bold text-gray-900 dark:text-white text-sm">
                {user.fullName}
              </Typography>
              {user.email && (
                <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                  {user.email}
                </Typography>
              )}
            </div>
            <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 flex items-center gap-3 rounded-lg">
              <NavLink to="/dashboard/profile" className="flex items-center gap-3 w-full">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 flex items-center justify-center">
                  <UserCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-semibold">{t("header.profile")}</span>
              </NavLink>
            </MenuItem>
            <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 flex items-center gap-3 rounded-lg">
              <NavLink to="/dashboard/settings" className="flex items-center gap-3 w-full">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-500/10 to-slate-500/10 dark:from-gray-500/20 dark:to-slate-500/20 flex items-center justify-center">
                  <Cog6ToothIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="font-semibold">{t("header.settings")}</span>
              </NavLink>
            </MenuItem>
            <MenuItem onClick={logout} className="dark:hover:bg-gray-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 dark:text-red-400 rounded-lg mt-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20 flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 font-bold text-lg">→</span>
              </div>
              <span className="font-bold">{t("common.logout")}</span>
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Menu placement="bottom-end">
          <MenuHandler>
            <IconButton
              variant="text"
              color="blue-gray"
              className={buttonClass}
              size="sm"
            >
              <div className="relative">
                <div className={`${isMobile ? "w-10 h-10" : "w-8 h-8"} rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 overflow-hidden`}>
                  {!imageError ? (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=random&color=fff&size=128`}
                      alt={user.fullName}
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <span className={`text-white font-bold ${isMobile ? "text-sm" : "text-xs"}`}>
                      {getInitials(user.fullName)}
                    </span>
                  )}
                </div>
                {/* Pink stripe indicator - like in the image */}
                {isMobile && (
                  <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-6 bg-pink-400 dark:bg-pink-500 rounded-full z-10"></div>
                )}
              </div>
            </IconButton>
          </MenuHandler>
          <MenuList className={`dark:bg-gray-800 dark:border-gray-700 ${isMobile ? "min-w-[240px]" : "min-w-[200px]"} rounded-xl shadow-xl`}>
            <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
              <Typography variant="small" className="font-bold text-gray-900 dark:text-white text-sm">
                {user.fullName}
              </Typography>
              {user.email && (
                <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                  {user.email}
                </Typography>
              )}
            </div>
            <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 flex items-center gap-3 rounded-lg">
              <NavLink to="/dashboard/profile" className="flex items-center gap-3 w-full">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 flex items-center justify-center">
                  <UserCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-semibold">{t("header.profile")}</span>
              </NavLink>
            </MenuItem>
            <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-800/50 hover:bg-gray-100/50 flex items-center gap-3 rounded-lg">
              <NavLink to="/dashboard/settings" className="flex items-center gap-3 w-full">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-500/10 to-slate-500/10 dark:from-gray-500/20 dark:to-slate-500/20 flex items-center justify-center">
                  <Cog6ToothIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="font-semibold">{t("header.settings")}</span>
              </NavLink>
            </MenuItem>
            <MenuItem onClick={logout} className="dark:hover:bg-gray-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 dark:text-red-400 rounded-lg mt-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20 flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 font-bold text-lg">→</span>
              </div>
              <span className="font-bold">{t("common.logout")}</span>
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  );
}
