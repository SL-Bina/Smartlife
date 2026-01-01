import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";
import { ConfiguratorSection } from "./ConfiguratorSection";
import { ConfiguratorSwitch } from "./ConfiguratorSwitch";
import { setFixedNavbar } from "@/context";

export function NavbarSection({
  dispatch,
  isOpen,
  onToggle,
  fixedNavbar,
  openSections,
  setOpenSections,
}) {
  const { t } = useTranslation();

  const navbarIcon = (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const fixedIcon = (
    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5h14M5 12h14M5 19h14" />
    </svg>
  );

  const transparentIcon = (
    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const sizeIcon = (
    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  );

  return (
    <ConfiguratorSection
      title={t("configurator.sections.navbar.title")}
      icon={navbarIcon}
      iconColor="from-indigo-500 to-indigo-600"
      isOpen={isOpen}
      onToggle={onToggle}
    >
      <ConfiguratorSwitch
        id="navbar-fixed"
        titleKey="configurator.sections.navbar.fixed.title"
        descriptionKey="configurator.sections.navbar.fixed.description"
        checked={fixedNavbar}
        onChange={() => setFixedNavbar(dispatch, !fixedNavbar)}
        icon={fixedIcon}
        iconBgColor="bg-indigo-50 dark:bg-indigo-900/20"
        iconColor="text-indigo-600 dark:text-indigo-400"
      />

      <ConfiguratorSwitch
        id="navbar-transparent"
        titleKey="configurator.sections.navbar.transparent.title"
        descriptionKey="configurator.sections.navbar.transparent.description"
        checked={true}
        onChange={() => {}}
        icon={transparentIcon}
        iconBgColor="bg-gray-100 dark:bg-gray-700"
        iconColor="text-gray-400 dark:text-gray-500"
        disabled={true}
        opacity={true}
      />

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm opacity-60">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                {sizeIcon}
              </div>
              <Typography variant="small" className="font-semibold text-gray-500 dark:text-gray-400 text-sm">
                {t("configurator.sections.navbar.size.title")}
              </Typography>
            </div>
            <Typography variant="small" className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed pl-10">
              {t("configurator.sections.navbar.size.description")}
            </Typography>
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ${
              openSections?.navbarSize ? "rotate-180" : ""
            } text-gray-400 dark:text-gray-500`}
          />
        </div>
      </div>
    </ConfiguratorSection>
  );
}

